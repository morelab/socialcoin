from flask import request
from flask_restful import Resource
from datetime import datetime
from common.blockchain import blockchain_manager
from common.utils import get_user_from_token
from config import ADMIN_ADDRESS, PRIVATE_KEY
from database.models import Offer, Transaction, User


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
    

class OffersAll(Resource):
    def get(self):
        offers = Offer.all()
        offer_dicts = [offer.as_dict() for offer in offers]
        for offer in offer_dicts:
            offer['company_name'] = User.get(offer['company_id']).name
        return offer_dicts

    def post(self):
        if request.content_type != 'application/json':
            return {'error': 'only application/json is accepted'}, 400
        
        user = get_user_from_token(request)
        
        if user.role == 'CB':
            return {'error': 'collaborators cannot create offers'}, 403
        
        data = request.json
        new_offer = Offer(
            name=data.get('name'),
            description=data.get('description'),
            price=data.get('price'),
            company_id=user.id
        )
        new_offer.save()
        
        return new_offer.as_dict(), 201


class OffersDetail(Resource):
    def get(self, offer_id):
        offer = Offer.get(offer_id)
        offer_dict = offer.as_dict()
        offer_dict['company_name'] = User.get(offer.company_id).name
        return offer_dict

    def put(self, offer_id):
        if request.content_type != 'application/json':
            return {'error': 'only application/json is accepted'}, 400
        
        user = get_user_from_token(request)
        
        if user.role == 'CB':
            return {'error': 'collaborators cannot edit offers'}, 403
        
        offer = Offer.get(offer_id)

        if offer.company_id != user.id and user.role == 'PM':
            return {'error': 'promoters cannot edit another promoter\'s offers'}, 403

        data = request.json
        offer.name = data.get('name')
        offer.description = data.get('description')
        offer.price = data.get('price')
        offer.save()
        
        return offer.as_dict(), 200

    def delete(self, offer_id):
        user = get_user_from_token(request)
        
        if user.role == 'CB':
            return {'error': 'collaborators cannot delete offers'}, 403
        
        offer = Offer.get(offer_id)

        if offer.company_id != user.id and user.role == 'PM':
            return {'error': 'promoters cannot delete another promoter\'s offers'}, 403

        Offer.delete_one(offer.id)

        return {'result': 'success'}, 204


class OfferRedeem(Resource):
    def post(self, offer_id):
        user = get_user_from_token(request)
        
        offer_redeem(
            buyer_address=user.blockchain_public,
            offer_id=offer_id
        )
        
        return {'success': True}