from flask import request
from flask_restful import Resource
from marshmallow import fields, Schema, ValidationError
from common.blockchain import blockchain_manager
from common.utils import get_user_from_token, is_valid_uuid
from database.models import User



class UserEditSchema(Schema):
    new_role = fields.Str()

user_edit_schema = UserEditSchema()


class UsersAdmin(Resource):
    def get(self):
        user = get_user_from_token(request)
        if not user:
            return {'error': 'JWT token not present on request'}, 401
        
        if user.role != 'AD':
            return {'error': 'user is not an administrator'}, 403

        users = User.all()
        user_dicts = [user.as_dict() for user in users]
        
        for user in user_dicts:
            user['balance'] = -1
            del user['blockchain_private']
        
        return user_dicts


class UsersAdminDetail(Resource):
    def put(self, user_id):
        user = get_user_from_token(request)
        if not user:
            return {'error': 'JWT token not present on request'}, 401
        
        if user.role != 'AD':
            return {'error': 'user is not an administrator'}, 403
        
        if not is_valid_uuid(user_id):
            return {'error': f'no user with id {user_id} found'}, 404
        
        to_update_user = User.get(user_id)
        
        if not to_update_user:
            return {'error': f'no user with id {user_id} found'}, 404
        
        json_data = request.get_json()
        try:
            data = user_edit_schema.load(json_data)
        except ValidationError as err:
            return err.messages, 400
        
        new_role = data.get('new_role')
        
        if new_role not in ['AD', 'PM', 'CB']:
            return {'error': 'invalid role. Valid role keys are AD, PM and CB'}
        
        to_update_user.role = new_role
        to_update_user.save()
        
        user_dict = to_update_user.as_dict()
        user_dict['balance'] = blockchain_manager.balance_of(user_dict.get('blockchain_public'))
        del user_dict['blockchain_private']
        
        return user_dict


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