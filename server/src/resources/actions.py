from flask import request
from flask_restful import Resource
from datetime import datetime
from common.blockchain import blockchain_manager
from common.utils import get_user_from_token
from config import ADMIN_ADDRESS, IPFS_ON, IPFS_URL, PRIVATE_KEY
from database.models import Action, User, Transaction
import base58
import requests
import os
import time

def action_reward(*, from_address: str, to_address: str, from_balance: int, action_id: int, reward: int, img_hash: str, url_proof: str):
    admin_address = ADMIN_ADDRESS
    admin_key = PRIVATE_KEY
    reward = reward if from_balance > reward else from_balance

    tx_hash = blockchain_manager.processAction(
        caller=admin_address,
        caller_key=admin_key,
        promoter=from_address,
        to=to_address,
        action_id=action_id,
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


class ActionsAll(Resource):
    def get(self):
        actions = Action.all()
        action_dicts = [action.as_dict() for action in actions]
        for action in action_dicts:
            action['company_name'] = User.get(action['company_id']).name
        return action_dicts

    def post(self):
        if request.content_type != 'application/json':
            return {'error': 'only application/json is accepted'}, 400
        
        user = get_user_from_token(request)
        
        if user.role == 'CB':
            return {'error': 'collaborators cannot create actions'}, 403
        
        data = request.json
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
        
        return new_action.as_dict(), 201


class ActionsDetail(Resource):
    def get(self, action_id):
        action = Action.get(action_id)
        return action.as_dict()

    def put(self, action_id):
        if request.content_type != 'application/json':
            return {'error': 'only application/json is accepted'}, 400
        
        user = get_user_from_token(request)
        
        if user.role == 'CB':
            return {'error': 'collaborators cannot edit actions'}, 403
        
        action = Action.get(action_id)

        if action.company_id != user.id and user.role == 'PM':
            return {'error': 'promoters cannot edit another promoter\'s actions'}, 403

        data = request.json
        action.name = data.get('name')
        action.description = data.get('description')
        action.reward = data.get('reward')
        action.kpi_target = data.get('kpi_target')
        action.kpi_indicator = data.get('kpi_indicator')
        action.save()
        
        return action.as_dict(), 200

    def delete(self, action_id):
        user = get_user_from_token(request)
        
        if user.role == 'CB':
            return {'error': 'collaborators cannot delete actions'}, 403
        
        action = Action.get(action_id)

        if action.company_id != user.id and user.role == 'PM':
            return {'error': 'promoters cannot delete another promoter\'s actions'}, 403

        Action.delete_one(action.id)

        return {'result': 'success'}, 204


class ActionRegister(Resource):
    def post(self, action_id):
        # if request.content_type != 'multipart/form-data':
        #     return {'error': 'only multipart/form-data is accepted'}, 400
        
        user = get_user_from_token(request)
        action = Action.get(action_id)
        company = User.get(action.company_id)
        company_balance = blockchain_manager.balance_of(company.blockchain_public)
        
        data = dict(request.form)
        kpi = data.get('kpi')   # 'multiplier' of the action
        url_proof = data.get('verification_url')        # external optional proof URL (e.g. Strava)
        image_proof = request.files.get('image_proof')  # mandatory photo proof (e.g. Strava)
        reward = action.reward * float(kpi)    # adjust to the contrat decimals
        
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
        
        return {'success': True}