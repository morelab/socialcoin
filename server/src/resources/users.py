from flask import request
from flask_restful import Resource
from common.blockchain import blockchain_manager
from common.utils import get_user_from_token


class UsersSelf(Resource):
    def get(self):
        user = get_user_from_token(request)
        if not user:
            return {'error': 'JWT token not present on request'}, 401
        
        user_dict = user.as_dict()
        user_dict['balance'] = blockchain_manager.balance_of(user_dict.get('blockchain_public'))
        del user_dict['blockchain_private']
        
        return user_dict

    def put(self):
        if request.content_type != 'application/json':
            return {'error': 'only application/json is accepted'}, 400

        user = get_user_from_token(request)
        if not user:
            return {'error': 'JWT token not present on request'}, 401

        data = request.json
        name = data.get('name')
        
        if name:
            user.name = name
            user.save()
        
        user_dict = user.as_dict()
        user_dict['balance'] = blockchain_manager.balance_of(user_dict.get('blockchain_public'))
        del user_dict['blockchain_private']
        
        return user_dict


class UserBalance(Resource):
    def get(self):
        user = get_user_from_token(request)
        balance = blockchain_manager.balance_of(user.blockchain_public)
        return {'balance': balance}