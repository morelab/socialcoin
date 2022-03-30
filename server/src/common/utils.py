from database.models import User
from config import APP_SECRET
import jwt

def get_user_from_token(request) -> User:
    if 'jwt_token' not in request.cookies:
        print('error retrieving user data')
        return None
    
    secret_key = APP_SECRET
    token = request.cookies.get('jwt_token')
    decoded_user = jwt.decode(token, APP_SECRET, algorithms=["HS256"]).get('user')

    user_email = decoded_user.get('email')
    user = User.get_by_email(user_email)
    
    return user