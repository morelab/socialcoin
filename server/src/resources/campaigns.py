from flask import request
from flask_restful import Resource
from common.utils import get_user_from_token
from database.models import Campaign, User

# TODO validation with Marshmallow https://marshmallow.readthedocs.io/en/stable/examples.html#quotes-api-flask-sqlalchemy

class CampaignsAll(Resource):
    def get(self):
        campaigns = Campaign.all()
        campaign_dicts = [campaign.as_dict() for campaign in campaigns]
        for campaign in campaign_dicts:
            campaign['company_name'] = User.get(campaign['company_id']).name
        return campaign_dicts

    def post(self):
        if request.content_type != 'application/json':
            return {'error': 'only application/json is accepted'}, 400
        
        user = get_user_from_token(request)
        
        if user.role == 'CB':
            return {'error': 'collaborators cannot create campaigns'}, 403

        data = request.json
        new_campaign = Campaign(
            name=data.get('name'),
            description=data.get('description'),
            company_id=user.id
        )
        new_campaign.save()
        
        return new_campaign.as_dict(), 201


class CampaignsByCompany(Resource):
    def get(self):
        users = User.all()
        companies = filter(lambda user: user.role != 'CB', users)
        result = []
        
        for company in companies:
            campaign_list = Campaign.get_by_company(company.id)
            if campaign_list.count() > 0:
                c = company.as_dict()
                del c['blockchain_private']
                del c['picture_url']
                result.append({
                    'company': c,
                    'campaigns': [campaign.as_dict() for campaign in campaign_list]
                })
        
        return result


class CampaignsDetail(Resource):
    def get(self, campaign_id):
        campaign = Campaign.get(campaign_id)
        return campaign.as_dict()

    def put(self, campaign_id):
        if request.content_type != 'application/json':
            return {'error': 'only application/json is accepted'}, 400
    
        user = get_user_from_token(request)
        
        if user.role == 'CB':
            return {'error': 'collaborators cannot edit campaigns'}, 403
        
        campaign = Campaign.get(campaign_id)

        if campaign.company_id != user.id and user.role == 'PM':
            return {'error': 'promoters cannot edit another promoter\'s campaigns'}, 403

        data = request.json
        campaign.name = data.get('name')
        campaign.description = data.get('description')
        campaign.save()
        
        return campaign.as_dict(), 200

    def delete(self, campaign_id):
        user = get_user_from_token(request)
        
        if user.role == 'CB':
            return {'error': 'collaborators cannot delete campaigns'}, 403
        
        campaign = Campaign.get(campaign_id)

        if campaign.company_id != user.id and user.role == 'PM':
            return {'error': 'promoters cannot delete another promoter\'s campaigns'}, 403

        Campaign.delete_one(campaign.id)

        return {'result': 'success'}, 204