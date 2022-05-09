from dotenv import load_dotenv
import pytest
import jwt
from src.app import app
from src.config import APP_SECRET
from src.database.models import User


@pytest.fixture(scope='session', autouse=True)
def load_env():
  load_dotenv(dotenv_path='../')


@pytest.fixture()
def app_fixture():
  app_obj = app
  yield app_obj


@pytest.fixture()
def client(app_fixture):
  return app_fixture.test_client()


@pytest.fixture()
def runner(app_fixture):
  return app_fixture.test_cli_runner()


@pytest.fixture()
def test_admin():
  User.query.delete()
  user = User(
    name='testAD',
    email='admin@socialcoin.com',
    blockchain_public='0x27470cC7071bdC882742016Ae058FFCB780DDDDe',
    blockchain_private='56f5af8448563c6c61e1a990c086e2f0deccf01661ebcb440f1414dc84e13970',
    picture_url='',
    role='AD'
  )
  user.save()

  jwt_token = jwt.encode({
    'user': user.as_dict()
  }, APP_SECRET, algorithm='HS256')
  
  if (type(jwt_token) == bytes):
    jwt_token = jwt_token.decode('utf-8')
  
  yield [user, jwt_token]


@pytest.fixture()
def test_promoter():
  user = User(
    name='testPM',
    email='promoter@socialcoin.com',
    blockchain_public='0x3E7daF3afAc78dB2B20A1e7659660E5b67801Fb2',
    blockchain_private='9056b003c0322f5c57bee9cdc77efd83fdc7fbfcdcb12a307af220a827c34647',
    picture_url='',
    role='PM'
  )
  user.save()

  jwt_token = jwt.encode({
    'user': user.as_dict()
  }, APP_SECRET, algorithm='HS256')
  
  if (type(jwt_token) == bytes):
    jwt_token = jwt_token.decode('utf-8')
  
  yield [user, jwt_token]


@pytest.fixture()
def test_collaborator():
  user = User(
    name='testCB',
    email='collaborator@socialcoin.com',
    blockchain_public='0xE3b87e2f28e07c9B47f23b9e405579b8a9c8B6B8',
    blockchain_private='cbe17c65a740bfbed645db66e3d08eda368d3c2e2da57d7c1ef4f667ce60ef68',
    picture_url='',
    role='CB'
  )
  user.save()

  jwt_token = jwt.encode({
    'user': user.as_dict()
  }, APP_SECRET, algorithm='HS256')
  
  if (type(jwt_token) == bytes):
    jwt_token = jwt_token.decode('utf-8')
  
  yield [user, jwt_token]