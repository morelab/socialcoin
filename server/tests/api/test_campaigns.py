import pytest
import json
from src.database.models import Campaign


@pytest.fixture()
def base_data(test_admin):
    user, token = test_admin

    Campaign.query.delete()
    campaign1 = Campaign(
        name='campaign1', description='description1', company_id=user.id
    )
    campaign2 = Campaign(
        name='campaign2', description='description2', company_id=user.id
    )
    campaign3 = Campaign(
        name='campaign3', description='description3', company_id=user.id
    )
    campaign1.save()
    campaign2.save()
    campaign3.save()

    yield [user, token, [campaign1, campaign2, campaign3]]


# /api/campaigns
# GET
def test_get_campaigns(client, base_data):
    user, token, base_campaign_list = base_data

    response = client.get(
        '/api/campaigns', headers={'Authorization': f'bearer {token}'}
    )

    assert len(response.json) == len(base_campaign_list)
    assert base_campaign_list[0].name in json.dumps(response.json)


def test_get_campaigns_no_token(client):
    response = client.get('/api/campaigns')

    assert response.status_code == 401


def test_get_campaigns_only_promoter(client, base_data, test_promoter):
    user, token, base_campaign_list = base_data
    promoter, promoter_token = test_promoter

    promoter_campaign = Campaign(
        name='promoter campaign',
        description='promoter campaign description',
        company_id=promoter.id,
    )
    promoter_campaign.save()

    response = client.get(
        '/api/campaigns', headers={'Authorization': f'bearer {promoter_token}'}
    )

    assert len(response.json) == 1
    assert response.json[0].get('name') == promoter_campaign.name


# POST
def test_post_campaigns(client, base_data):
    user, token, base_campaign_list = base_data

    response = client.post('/api/campaigns', headers={
        'Authorization': f'bearer {token}'
    }, json={
        'name': 'test campaign',
        'description': 'test campaign description'
    })

    assert response.status_code == 201
    assert response.json.get('name') == 'test campaign'

    all_campaigns = Campaign.query.all()
    
    assert len(all_campaigns) == len(base_campaign_list) + 1


def test_post_campaigns_no_token(client):
    response = client.post('/api/campaigns')

    assert response.status_code == 401


def test_post_campaigns_collaborator(client, test_collaborator):
    user, token = test_collaborator
    
    response = client.post('/api/campaigns', headers={
        'Authorization': f'bearer {token}'
    })
    
    assert response.status_code == 403


def test_post_campaigns_no_data(client, base_data):
    user, token, base_campaign_list = base_data

    response = client.post('/api/campaigns', headers={
        'Authorization': f'bearer {token}'
    })
    
    assert response.status_code == 400
    assert 'no input data' in json.dumps(response.json)


def test_post_campaigns_validation_error(client, base_data):
    user, token, base_campaign_list = base_data

    response = client.post('/api/campaigns', headers={
        'Authorization': f'bearer {token}'
    }, json={
        'description': 'test campaign description'
    })
    
    assert response.status_code == 400
    assert 'name' in json.dumps(response.json)


# /api/campaigns/company
# GET TODO


# /api/campaigns/:campaign_id
# GET
def test_get_campaign(client, base_data):
    user, token, base_campaign_list = base_data
    
    response = client.get(f'/api/campaigns/{base_campaign_list[0].id}')
    
    assert response.status_code == 200
    assert response.json.get('name') == base_campaign_list[0].name


def test_get_campaign_invalid_uuid(client):
    response = client.get('/api/campaigns/404')
    
    assert response.status_code == 404


def test_get_campaign_not_found(client):
    response = client.get('/api/campaigns/1ab26796-ffde-453a-baf7-b155b54711f4')
    assert response.status_code == 404


# PUT
def test_put_campaign(client, base_data):
    user, token, base_campaign_list = base_data
    
    base_campaign = base_campaign_list[0]
    response = client.put(f'/api/campaigns/{base_campaign.id}', headers={
        'Authorization': f'bearer {token}'
    }, json={
        'name': 'new name'
    })
    
    assert response.status_code == 200
    assert response.json.get('name') == 'new name'


def test_put_campaign_no_token(client):
    response = client.put('/api/campaigns/401')
    assert response.status_code == 401


def test_put_campaign_collaborator(client, test_collaborator):
    user, token = test_collaborator
    response = client.put('/api/campaigns/403', headers={
        'Authorization': f'bearer {token}'
    })
    
    assert response.status_code == 403


def test_put_campaign_invalid_uuid(client, base_data):
    user, token, base_campaign_list = base_data
    
    response = client.put('/api/campaigns/404', headers={
        'Authorization': f'bearer {token}'
    })
    assert response.status_code == 404


def test_put_campaign_not_found(client, base_data):
    user, token, base_campaign_list = base_data
    
    response = client.put('/api/campaigns/85cc9259-2264-41bf-abb1-3724d7316891', headers={
        'Authorization': f'bearer {token}'
    })
    
    assert response.status_code == 404


def test_put_campaign_restricted_access(client, base_data, test_promoter):
    user, token, base_campaign_list = base_data
    promoter, promoter_token = test_promoter
    
    response = client.put(f'/api/campaigns/{base_campaign_list[0].id}', headers={
        'Authorization': f'bearer {promoter_token}'
    })
    
    assert response.status_code == 403


def test_put_campaign_validation_error(client, base_data):
    user, token, base_campaign_list = base_data

    response = client.put(f'/api/campaigns/{base_campaign_list[0].id}', headers={
        'Authorization': f'bearer {token}'
    }, json={
        'invalid_field': 'error'
    })
    
    assert response.status_code == 400


# DELETE
def test_delete_campaign(client, base_data):
    user, token, base_campaign_list = base_data
    
    base_campaign = base_campaign_list[0]
    response = client.delete(f'/api/campaigns/{base_campaign.id}', headers={
        'Authorization': f'bearer {token}'
    })
    
    assert response.status_code == 204

    all_campaigns = Campaign.query.all()
    assert len(all_campaigns) == len(base_campaign_list) - 1


def test_delete_campaign_no_token(client):
    response = client.delete('/api/campaigns/401')
    assert response.status_code == 401


def test_delete_campaign_collaborator(client, test_collaborator):
    user, token = test_collaborator
    
    response = client.delete('/api/campaigns/403', headers={
        'Authorization': f'bearer {token}'
    })
    
    assert response.status_code == 403


def test_delete_campaign_invalid_uuid(client, base_data):
    user, token, base_budget_list = base_data
    
    response = client.delete('/api/campaigns/404', headers={
        'Authorization': f'bearer {token}'
    })
    
    assert response.status_code == 404


def test_delete_campaign_not_found(client, base_data):
    user, token, base_budget_list = base_data
    
    response = client.delete('/api/campaigns/99bba363-aea6-4927-b388-ecce5a0ba136', headers={
        'Authorization': f'bearer {token}'
    })
    
    assert response.status_code == 404


def test_delete_campaign_restricted_access(client, base_data, test_promoter):
    user, token, base_campaign_list = base_data
    promoter, promoter_token = test_promoter
    
    response = client.delete(f'/api/campaigns/{base_campaign_list[0].id}', headers={
        'Authorization': f'bearer {promoter_token}'
    })
    
    assert response.status_code == 403