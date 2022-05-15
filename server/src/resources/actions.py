from importlib.metadata import metadata
from flask import request
from flask_restful import Resource
from datetime import datetime
from marshmallow import fields, Schema, ValidationError
from src.common.blockchain import blockchain_manager
from src.common.utils import get_user_from_token, is_valid_uuid, not_none
from src.config import ADMIN_ADDRESS, ADMIN_EMAIL, IPFS_ON, IPFS_URL, PRIVATE_KEY
from src.database.models import Action, Campaign, User, Transaction
import base58
import requests
import time


def action_creation(*, to_address: str, action_id: int, investment: int):
    tx_hash = blockchain_manager.mint(
        caller=ADMIN_ADDRESS,
        caller_key=PRIVATE_KEY,
        to=to_address,
        value=investment
    )
    
    if tx_hash is None:
        tx_hash = ''
    
    transaction = Transaction(
        date=datetime.now(),
        transaction_hash=tx_hash,
        sender_address=ADMIN_ADDRESS,   # TODO test if this breaks anything
        receiver_address=to_address,
        quantity=investment,
        transaction_info=f'Action id-{action_id} creation',
        img_ipfs_hash='',
        external_proof_url=''
    )
    transaction.save()


def action_reward(*, from_address: str, to_address: str, from_balance: int, action_id: int, reward: int, img_hash: str, url_proof: str):
    admin_address = ADMIN_ADDRESS
    admin_key = PRIVATE_KEY
    reward = reward if from_balance > reward else from_balance

    tx_hash = blockchain_manager.processAction(
        caller=admin_address,
        caller_key=admin_key,
        promoter=from_address,
        to=to_address,
        action_id=str(action_id),
        reward=reward,
        time=int(time.time()),
        ipfs_hash=img_hash
    )
    
    if tx_hash is None:
        tx_hash = ''
    
    transaction = Transaction(
        date=datetime.now(),
        transaction_hash=tx_hash,
        sender_address=from_address,
        receiver_address=to_address,
        quantity=reward,
        transaction_info=f'Action id-{action_id} registration',
        img_ipfs_hash=img_hash,
        external_proof_url=url_proof
    )
    transaction.save()


def ipfs_add_file(file):
    """Uploads a file to IPFS."""
    files = {
        'image': (file.filename, file.read(), 'rb'),
    }
    params = (
        ('hash', 'sha2-256'),
    )
    response = requests.post(IPFS_URL, files=files, params=params)
    return response


def decode_hash(hash):
    """Turns an IPFS hash into a value that can be stored in the Smart Contract.\n
    The hash is returned in a base58 multihash, from which the first two bytes are removed, as they represent the hash function and the length in bytes, which we don't need."""
    decoded_hash = base58.b58decode(hash)
    reduced_hash = decoded_hash.hex()[4:]
    return reduced_hash


class ActionSchema(Schema):
    id = fields.Str(dump_only=True)
    name = fields.Str(required=True)
    description = fields.Str(required=True)
    reward = fields.Int(required=True)
    kpi_target = fields.Int(required=True)
    kpi_indicator = fields.Str(required=True)
    campaign_id = fields.Str(required=True)

class OptionalActionSchema(Schema):
    id = fields.Str(dump_only=True)
    name = fields.Str()
    description = fields.Str()
    reward = fields.Int()
    kpi_target = fields.Int()
    kpi_indicator = fields.Str()
    campaign_id = fields.Str()
    
class ActionRegisterSchema(Schema):
    kpi = fields.Float(required=True)
    verification_url = fields.Str()
    image_proof = fields.Raw(metadata={type: 'file'})   # TODO test if this works

action_schema = ActionSchema()
optional_action_schema = OptionalActionSchema()
action_register_schema = ActionRegisterSchema()


class ActionsAll(Resource):
    def get(self):
        user = get_user_from_token(request)
        
        if not user:
            return {'error': 'not logged in'}, 401
        
        if user.role == 'PM':
            actions = Action.get_by_company(user.id)
        else:
            actions = Action.all()
        
        action_dicts = [action.as_dict() for action in actions]
        for action in action_dicts:
            action['company_name'] = User.get(action['company_id']).name
        return action_dicts

    def post(self):
        user = get_user_from_token(request)

        if not user:
            return {'error': 'not logged in'}, 401
        
        if user.role == 'CB':
            return {'error': 'collaborators cannot create actions'}, 403
        
        json_data = request.get_json()

        if not json_data:
            return {"error": "no input data provided"}, 400

        try:
            data = action_schema.load(json_data)
        except ValidationError as err:
            return err.messages, 400

        campaign_id = data.get('campaign_id')
        
        if not is_valid_uuid(campaign_id):
            return {'message': f'no campaign with id {campaign_id} found'}, 404
        
        if not Campaign.exists(campaign_id):
            return {'error': f'no campaign with id {campaign_id} exists'}, 404

        new_action = Action(
            name=data.get('name'),
            description=data.get('description'),
            reward=data.get('reward'),
            kpi_target=data.get('kpi_target'),
            kpi_indicator=data.get('kpi_indicator'),
            company_id=user.id,
            campaign_id=data.get('campaign_id')
        )
        new_action.save()
        
        action = new_action.as_dict()
        action['company_name'] = User.get(action['company_id']).name
        
        total_investment = int(data.get('reward')) * int(data.get('kpi_target'))
        action_creation(
            to_address=user.blockchain_public,
            action_id=new_action.id,
            investment=total_investment
        )
        
        return action, 201


class ActionsDetail(Resource):
    def get(self, action_id):
        if not is_valid_uuid(action_id):
            return {'message': f'no action with id {action_id} found'}, 404

        action = Action.get(action_id)

        if not action:
            return {'message': f'no action with id {action_id} found'}, 404
        
        action = action.as_dict()
        action['company_name'] = User.get(action['company_id']).name

        return action

    def put(self, action_id):
        user = get_user_from_token(request)
        
        if not user:
            return {'error': 'not logged in'}, 401
        
        if user.role == 'CB':
            return {'error': 'collaborators cannot edit actions'}, 403
        
        if not is_valid_uuid(action_id):
            return {'message': f'no action with id {action_id} found'}, 404
        
        action = Action.get(action_id)
        
        if not action:
            return {'message': f'no action with id {action_id} found'}, 404

        if action.company_id != user.id and user.role == 'PM':
            return {'error': 'promoters cannot edit another promoter\'s actions'}, 403

        json_data = request.get_json()
        try:
            data = optional_action_schema.load(json_data)
        except ValidationError as err:
            return err.messages, 400

        action.name = not_none(data.get('name'), action.name)
        action.description = not_none(data.get('description'), action.description)
        action.kpi_indicator = not_none(data.get('kpi_indicator'), action.kpi_indicator)

        old_reward = action.reward
        old_target = action.kpi_target
        
        new_reward = not_none(data.get('reward'), action.reward)
        new_target = not_none(data.get('kpi_target'), action.kpi_target)
        
        if new_target <= action.kpi:
            return {'error': 'new KPI target must be bigger than the current KPI value'}, 400
        
        old_remaining_action_reward = (old_target - action.kpi) * old_reward
        new_remaining_action_reward = (new_target - action.kpi) * new_reward
        
        balance_change = new_remaining_action_reward - old_remaining_action_reward
        
        if balance_change > 0:
            blockchain_manager.mint(
                caller=ADMIN_ADDRESS,
                caller_key=PRIVATE_KEY,
                to=user.blockchain_public,
                value=balance_change
            )
        elif balance_change < 0:
            blockchain_manager.burn(
                caller=ADMIN_ADDRESS,
                caller_key=PRIVATE_KEY,
                from_acc=user.blockchain_public,
                value=abs(balance_change)
            )
        
        action.reward = new_reward
        action.kpi_target = new_target
        
        action.save()
        
        action = action.as_dict()
        action['company_name'] = User.get(action['company_id']).name
        
        return action, 200

    def delete(self, action_id):
        user = get_user_from_token(request)
        
        if not user:
            return {'error': 'not logged in'}, 401
        
        if user.role == 'CB':
            return {'error': 'collaborators cannot delete actions'}, 403
        
        if not is_valid_uuid(action_id):
            return {'message': f'no action with id {action_id} found'}, 404
        
        action = Action.get(action_id)
        
        if not action:
            return {'message': f'no action with id {action_id} found'}, 404

        if action.company_id != user.id and user.role == 'PM':
            return {'error': 'promoters cannot delete another promoter\'s actions'}, 403

        # remaining KPI to reward must get deleted
        balance_to_burn = (action.kpi_target - action.kpi) * action.reward
        
        Action.delete_one(action.id)
        blockchain_manager.burn(
            caller=ADMIN_ADDRESS,
            caller_key=PRIVATE_KEY,
            from_acc=User.get(action.company_id).blockchain_public, # remove balance from action owner, not request user
            value=balance_to_burn
        )

        return {'result': 'success'}, 204


class ActionRegister(Resource):
    def post(self, action_id):
        user = get_user_from_token(request)
        
        if not user:
            return {'error': 'not logged in'}, 401
        
        if user.role == 'PM':
            return {'error': 'promoters cannot register actions'}, 403
        
        old_balance = blockchain_manager.balance_of(user.blockchain_public)
        
        if not is_valid_uuid(action_id):
            return {'message': f'no action with id {action_id} found'}, 404
        
        action = Action.get(action_id)
        
        if not action:
            return {'message': f'no action with id {action_id} found'}, 404
        
        company = User.get(action.company_id)
        company_balance = blockchain_manager.balance_of(company.blockchain_public)
        
        # TODO check company balance on API instead of on the blockchain
        # TODO test if the validation works properly
        
        json_data = dict(request.form)
        try:
            data = action_register_schema.load(json_data)
        except ValidationError as err:
            return err.messages, 400
        
        kpi = data.get('kpi')   # 'multiplier' of the action
        url_proof = data.get('verification_url')        # external proof URL (e.g. Strava)
        image_proof = request.files.get('image_proof')  # mandatory photo proof (e.g. Strava)
        reward = action.reward * float(kpi)    # adjust to the contrat decimals
        
        if not kpi and not url_proof:
            return {'error': 'required at least one of the fields verification_url or image_proof' }, 400
        
        if IPFS_ON:
            ipfs_response = ipfs_add_file(image_proof)
            decoded_hash = '0x' + decode_hash(ipfs_response.json()['Hash'])
        else:
            decoded_hash = ''
        
        action_reward(
            from_address=company.blockchain_public,
            to_address=user.blockchain_public,
            from_balance=company_balance,
            action_id=action.id,
            reward=reward,
            img_hash=decoded_hash,
            url_proof=url_proof
        )
        
        action.kpi += int(kpi)
        action.save()
        
        return {
            'new_balance': blockchain_manager.balance_of(user.blockchain_public),
            'old_balance': old_balance
        }