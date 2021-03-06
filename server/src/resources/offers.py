from flask import request
from flask_restful import Resource
from datetime import datetime
from marshmallow import fields, Schema, ValidationError
from src.common.blockchain import blockchain_manager
from src.common.utils import get_user_from_token, is_valid_uuid, not_none
from src.config import ADMIN_ADDRESS, PRIVATE_KEY
from src.database.models import Offer, Transaction, User


def offer_redeem(*, buyer_address: str, offer_id: int):
    admin_address = ADMIN_ADDRESS
    admin_key = PRIVATE_KEY
    offer = Offer.get(offer_id)
    
    value = int(offer.price)
    
    tx_hash = blockchain_manager.burn(
        caller=admin_address,
        caller_key=admin_key,
        from_acc=buyer_address,
        value=value
    )
    
    transaction = Transaction(
        date=datetime.now(),
        transaction_hash=tx_hash,
        sender_address=buyer_address,
        receiver_address=admin_address,
        quantity=value,
        transaction_info=f'Offer id-{offer_id} payment',
        img_ipfs_hash='',
        external_proof_url=''
    )
    transaction.save()


class OfferSchema(Schema):
    id = fields.Str(dump_only=True)
    name = fields.Str(required=True)
    description = fields.Str()
    price = fields.Float(required=True)
    company_id = fields.Str()

class OptionalOfferSchema(Schema):
    id = fields.Str(dump_only=True)
    name = fields.Str()
    description = fields.Str()
    price = fields.Float()
    company_id = fields.Str()
    
offer_schema = OfferSchema()
optional_offer_schema = OptionalOfferSchema()


class OffersAll(Resource):
    def get(self):
        user = get_user_from_token(request)

        if not user:
            return {'error': 'not logged in'}, 401
        
        if user.role == 'PM':
            offers = Offer.get_by_company(user.id)
        else:
            offers = Offer.all()
        
        offer_dicts = [offer.as_dict() for offer in offers]
        for offer in offer_dicts:
            offer['company_name'] = User.get(offer['company_id']).name
        return offer_dicts

    def post(self):
        user = get_user_from_token(request)

        if not user:
            return {'error': 'not logged in'}, 401
        
        if user.role == 'CB':
            return {'error': 'collaborators cannot create offers'}, 403
        
        json_data = request.get_json()
        try:
            data = offer_schema.load(json_data)
        except ValidationError as err:
            return err.messages, 400

        new_offer = Offer(
            name=data.get('name'),
            description=data.get('description'),
            price=data.get('price'),
            company_id=user.id
        )
        new_offer.save()
        
        offer = new_offer.as_dict()
        offer['company_name'] = User.get(offer['company_id']).name
        
        return offer, 201


class OffersDetail(Resource):
    def get(self, offer_id):
        if not is_valid_uuid(offer_id):
            return {'message': f'no offer with id {offer_id} found'}, 404

        offer = Offer.get(offer_id)
        if not offer:
            return {'message': f'no offer with id {offer_id} found'}, 404
        offer_dict = offer.as_dict()
        offer_dict['company_name'] = User.get(offer.company_id).name

        return offer_dict

    def put(self, offer_id):
        user = get_user_from_token(request)
        
        if not user:
            return {'error': 'not logged in'}, 401
        
        if user.role == 'CB':
            return {'error': 'collaborators cannot edit offers'}, 403

        if not is_valid_uuid(offer_id):
            return {'message': f'no offer with id {offer_id} found'}, 404

        offer = Offer.get(offer_id)
        
        if not offer:
            return {'message': f'no offer with id {offer_id} found'}, 404

        if offer.company_id != user.id and user.role == 'PM':
            return {'error': 'promoters cannot edit another promoter\'s offers'}, 403

        json_data = request.get_json()
        try:
            data = optional_offer_schema.load(json_data)
        except ValidationError as err:
            return err.messages, 400

        offer.name = not_none(data.get('name'), offer.name)
        offer.description = not_none(data.get('description'), offer.description)
        offer.price = not_none(data.get('price'), offer.price)
        offer.save()
        
        offer = offer.as_dict()
        offer['company_name'] = User.get(offer['company_id']).name
        
        return offer, 200

    def delete(self, offer_id):
        user = get_user_from_token(request)
        
        if not user:
            return {'error': 'not logged in'}, 401
        
        if user.role == 'CB':
            return {'error': 'collaborators cannot delete offers'}, 403

        if not is_valid_uuid(offer_id):
            return {'message': f'no offer with id {offer_id} found'}, 404
        
        offer = Offer.get(offer_id)
        
        if not offer:
            return {'message': f'no offer with id {offer_id} found'}, 404

        if offer.company_id != user.id and user.role == 'PM':
            return {'error': 'promoters cannot delete another promoter\'s offers'}, 403

        Offer.delete_one(offer.id)

        return {'result': 'success'}, 204


class OfferRedeem(Resource):
    def post(self, offer_id):
        user = get_user_from_token(request)
        
        if not user:
            return {'error': 'not logged in'}, 401
        
        if user.role == 'PM':
            return {'error': 'promoters cannot redeem offers'}
        
        if not is_valid_uuid(offer_id):
            return {'message': f'no offer with id {offer_id} found'}, 404
        
        if not Offer.exists(offer_id):
            return {'message': f'no offer with id {offer_id} found'}, 404
        
        offer_redeem(
            buyer_address=user.blockchain_public,
            offer_id=offer_id
        )
        
        return {'success': True}