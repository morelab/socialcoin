from config import APP_SECRET
from database.models import User
from uuid import UUID
import jwt

def get_user_from_token(request) -> dict:
    cookie_token: str = request.cookies.get('jwt_token')
    header_token: str = request.headers.get('Authorization')

    if cookie_token:
        token = cookie_token
    elif header_token and header_token.lower().startswith('bearer'):
        token = header_token[7:]
    else:
        return None

    try:
        decoded_user = jwt.decode(token, APP_SECRET, algorithms=["HS256"]).get('user')
        user_email = decoded_user.get('email')
        user = User.get_by_email(user_email)
        return user
    except jwt.InvalidSignatureError as err:
        print(err)
        return None
    
def is_valid_uuid(value, version=4):
    try:
        uuid = UUID(str(value), version=version)
    except ValueError:
        return False
    return str(uuid) == str(value)

def not_none(s, d):
    if s is None:
        return d
    return s