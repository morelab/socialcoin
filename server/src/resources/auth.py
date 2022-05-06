from flask import make_response, redirect, request
from flask_restful import Resource
from xml.dom import ValidationErr
from urllib.parse import urlencode
from typing import Dict, Any
from src.common.blockchain import generate_keys
from src.config import ADMIN_EMAIL, APP_SECRET, BASE_BACKEND_URL, BASE_FRONTEND_URL, BLOCKCHAIN_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NETWORK
from src.database.models import User
import jwt
import requests

GOOGLE_ACCESS_TOKEN_OBTAIN_URL = 'https://oauth2.googleapis.com/token'
GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'
SECRET_KEY = APP_SECRET

def add_account_to_allowlist(address):
    """Adds an account to the permissioned blockchain allowlist."""
    data = '{"jsonrpc":"2.0","method":"perm_addAccountsToAllowlist","params":[["' + address + '"]], "id":1}'
    response = requests.post(BLOCKCHAIN_URL, data=data)
    return response

def get_access_token(*, code: str, redirect_uri: str) -> str:
    data = {
        'code': code,
        'client_id': GOOGLE_CLIENT_ID,
        'client_secret': GOOGLE_CLIENT_SECRET,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code'
    }
    print(data)
    
    response = requests.post(GOOGLE_ACCESS_TOKEN_OBTAIN_URL, data=data)
    
    if not response.ok:
        # TODO: check best error type to use
        print(response)
        print(response.text)
        raise ValidationErr('Failed to obtain access token from Google')
    
    access_token = response.json()['access_token']
    return access_token


def get_user_info(*, access_token: str) -> Dict[str, Any]:
    response = requests.get(
        GOOGLE_USER_INFO_URL,
        params={'access_token': access_token}
    )
    
    if not response.ok:
        # TODO: check best error type to use
        raise ValidationErr('Failed to obtain user info from Google')
    
    return response.json()


def retrieve_or_create_user(**profile_data) -> User:
    user = User.get_by_email(profile_data.get('email'))
    
    if user:
        return user

    keys = generate_keys()

    user = User(**profile_data, blockchain_public=keys.get('address'), blockchain_private=keys.get('key'))
    user.save()
    
    try:
        # add the new created account to the Besu allowlist, only when using ethereum
        if NETWORK == 'ethereum':
            add_account_to_allowlist(keys.get('address'))
    except:
        print('Error adding an account to the Besu allowlist')
    
    return user


class GoogleLogin(Resource):
    def get(self):
        # TODO: validation with marshmallow https://marshmallow.readthedocs.io/en/stable/
        data = dict(request.args)
        # authuser, code/error, hd, prompt, scope
        # print(json.dumps(data, sort_keys=True, indent=4))
        
        login_url = f'{BASE_FRONTEND_URL}'
        
        code = data.get('code')
        error = data.get('error')
        
        # verify that the authentication has been successfull
        if error or not code:
            params = urlencode({'error': error})
            print(f'# Authentication error. Error params: {params}')
            return redirect(f'{login_url}?{params}')
        
        # retrieve 'access_token' of the user
        domain = BASE_BACKEND_URL
        redirect_uri = f'{domain}/api/login'
        
        access_token = get_access_token(code=code, redirect_uri=redirect_uri)
        
        # retrieve user data
        user_data = get_user_info(access_token=access_token)
        
        # retrieve user from database
        profile_data = {
            'email': user_data['email'],
            'name': user_data.get('name', ''),
            'picture_url': user_data.get('picture', ''),
            'role': 'AD' if user_data['email'] == ADMIN_EMAIL else 'CB'
        }
        
        user = retrieve_or_create_user(**profile_data)
        
        # create JWT login session
        token = jwt.encode({
            'user': user.as_dict()
        }, SECRET_KEY, algorithm="HS256")
        
        # redirect the user
        response = make_response(redirect(f'{BASE_FRONTEND_URL}/#/dashboard'))
        response.set_cookie('jwt_token', token, samesite='None', secure=True, httponly=True)

        return response


class Logout(Resource):
    def post(self):
        response = make_response({'result': 'logged out'}, 202)
        response.delete_cookie('jwt_token', samesite='None', secure=True, httponly=True)
        return response