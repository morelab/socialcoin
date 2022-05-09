import pytest
from src.common.blockchain import blockchain_manager
from src.database.models import Campaign, Action
import json


@pytest.fixture()
def base_data(test_admin):
    user, token = test_admin

    Campaign.query.delete()
    Action.query.delete()

    campaign = Campaign(
        name='test campaign',
        description='test campaign description',
        company_id=user.id,
    )
    campaign.save()

    action1 = Action(
        name='action 1',
        description='action description 1',
        reward='100',
        kpi_target='1000',
        kpi_indicator='indicator 1',
        company_id=user.id,
        campaign_id=campaign.id,
    )
    action2 = Action(
        name='action 2',
        description='action description 2',
        reward='200',
        kpi_target='2000',
        kpi_indicator='indicator 2',
        company_id=user.id,
        campaign_id=campaign.id,
    )
    action3 = Action(
        name='action 3',
        description='action description 3',
        reward='300',
        kpi_target='3000',
        kpi_indicator='indicator 3',
        company_id=user.id,
        campaign_id=campaign.id,
    )
    action1.save()
    action2.save()
    action3.save()

    yield [campaign, [action1, action2, action3]]

# TODO: important things to test
# 1.- Minting of coins, deletion, etc
# 2.- Registration of actions, minting, error returning, etc


# /api/actions
# GET
def test_get_actions(client, base_data, test_admin):
    campaign, action_list = base_data
    user, token = test_admin
    
    response = client.get('/api/actions', headers={
        'Authorization': f'bearer {token}'
    })
    
    assert response.status_code == 200
    assert len(response.json) == len(action_list)


def test_get_actions_no_token(client):
    response = client.get('/api/actions')
    assert response.status_code == 401


def test_get_actions_promoter(client, test_promoter):
    user, token = test_promoter
    
    promoter_campaign = Campaign(
        name='campaign',
        description='campaign description',
        company_id=user.id
    )
    promoter_campaign.save()
    
    promoter_action = Action(
        name='promoter action',
        description='description',
        reward=100,
        kpi_target=1000,
        kpi_indicator='indicator',
        company_id=user.id,
        campaign_id=promoter_campaign.id
    )
    promoter_action.save()
    
    response = client.get('/api/actions', headers={
        'Authorization': f'bearer {token}'
    })
    
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0].get('name') == 'promoter action'


# POST
def test_post_actions(client, base_data, test_admin):
    campaign, action_list = base_data
    user, token = test_admin
    
    # TODO clean user balance
    
    base_balance = blockchain_manager.balance_of(user.blockchain_public)
        
    base_reward = 10
    base_target = 10
    
    response = client.post('/api/actions', headers = {
        'Authorization': f'bearer {token}'
    }, json={
        'name': 'test action',
        'description': 'test action description',
        'reward': base_reward,
        'kpi_target': base_target,
        'kpi_indicator': 'test indicator',
        'campaign_id': campaign.id
    })
    
    assert response.status_code == 201
    
    all_actions = Action.query.all()
    assert len(all_actions) == len(action_list) + 1
    
    total_investment = base_reward * base_target

    # NOTE blockchain_manager.balance(user.blockchain_public) can't be called directly
    # because the DB connection is closed after each request
    response = client.get('/api/users/balance', headers={
        'Authorization': f'bearer {token}'
    })
    new_balance = response.json.get('balance')
    
    assert new_balance == base_balance + total_investment


def test_post_actions_no_token(client):
    response = client.post('/api/actions')
    assert response.status_code == 401


def test_post_actions_collaborators(client, test_collaborator):
    user, token = test_collaborator
    
    response = client.post('/api/actions', headers={
        'Authorization': f'bearer {token}'
    })
    
    assert response.status_code == 403


def test_post_actions_no_data(client, test_admin):
    user, token = test_admin
    
    response = client.post('/api/actions', headers={
        'Authorization': f'bearer {token}'
    })
    
    assert response.status_code == 400


def test_post_actions_validation_error(client, test_admin):
    user, token = test_admin
    
    response = client.post('/api/actions', headers={
        'Authorization': f'bearer {token}'
    }, json={
        'name': 'just name causes error'
    })
    
    assert response.status_code == 400
    assert 'Missing data' in json.dumps(response.json)


def test_post_actions_invalid_campaign_id(client, test_admin):
    user, token = test_admin
    
    response = client.post('/api/actions', headers={
        'Authorization': f'bearer {token}'
    }, json={
        'name': 'name',
        'description': 'description',
        'reward': 100,
        'kpi_target': 1000,
        'kpi_indicator': 'indicator',
        'campaign_id': 'invalid'
    })
    
    assert response.status_code == 404


def test_post_actions_campaign_not_found(client, test_admin):
    user, token = test_admin
    
    response = client.post('/api/actions', headers={
        'Authorization': f'bearer {token}'
    }, json={
        'name': 'name',
        'description': 'description',
        'reward': 100,
        'kpi_target': 1000,
        'kpi_indicator': 'indicator',
        'campaign_id': '98563840-df4c-4a88-bd37-6874263b022b'
    })
    
    assert response.status_code == 404


# /api/actions/:action_id
# GET
def test_get_action(client, base_data, test_admin):
    campaign, action_list = base_data
    user, token = test_admin
    
    action = action_list[0]
    response = client.get(f'/api/actions/{action.id}', headers={
        'Authorization': f'bearer {token}'
    })
    
    assert response.status_code == 200
    assert response.json.get('name') == action.name


def test_get_action_invalid_uuid(client, test_admin):
    user, token = test_admin
    
    response = client.get(f'/api/actions/404', headers={
        'Authorization': f'bearer {token}'
    })
    
    assert response.status_code == 404


def test_get_action_not_found(client, test_admin):
    user, token = test_admin
    
    response = client.get(f'/api/actions/f0b4657f-0bb1-4db8-8ed5-c99ad51c00f5', headers={
        'Authorization': f'bearer {token}'
    })
    
    assert response.status_code == 404


# PUT
# TODO reflect target changes in the blockchain (i.e. call mint() or burn() accordingly)
def test_put_action(client, base_data, test_admin):
    campaign, action_list = base_data
    user, token = test_admin
        
    base_balance = blockchain_manager.balance_of(user.blockchain_public)

    base_reward = 10
    base_target = 10
    
    response = client.post('/api/actions', headers = {
        'Authorization': f'bearer {token}'
    }, json={
        'name': 'test action',
        'description': 'test action description',
        'reward': base_reward,
        'kpi_target': base_target,
        'kpi_indicator': 'test indicator',
        'campaign_id': campaign.id
    })
    
    assert response.status_code == 201
    created_action = Action.get(response.json.get('id'))
    
    all_actions = Action.query.all()
    assert len(all_actions) == len(action_list) + 1
    
    total_investment = base_reward * base_target
    
    response = client.get('/api/users/balance', headers={
        'Authorization': f'bearer {token}'
    })
    new_balance = response.json.get('balance')
    
    assert new_balance == base_balance + total_investment
    
    response = client.put(f'/api/actions/{created_action.id}', headers={
        'Authorization': f'bearer {token}'
    }, json={
        'reward': 12,
        'kpi_target': 14
    })
    
    assert response.status_code == 200
    assert response.json.get('reward') == 12
    assert response.json.get('kpi_target') == 14
    
    response = client.get('/api/users/balance', headers={
        'Authorization': f'bearer {token}'
    })
    final_balance = response.json.get('balance')
    
    assert final_balance == new_balance + 68


# DELETE
# TODO reflect deletion in the blockchain (call burn() for the remaining KPI)



# /api/actions/:action:id/register
# POST
# TODO