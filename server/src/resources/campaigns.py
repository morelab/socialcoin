from flask import request
from flask_restful import Resource
from marshmallow import fields, Schema, ValidationError
from common.utils import get_user_from_token, is_valid_uuid, not_none
from database.models import Campaign, User


class CampaignSchema(Schema):
    id = fields.Str(dump_only=True)
    name = fields.Str(required=True)
    description = fields.Str(required=True)
    company_id = fields.Str()
    
class OptionalCampaignSchema(Schema):
    id = fields.Str(dump_only=True)
    name = fields.Str()
    description = fields.Str()
    company_id = fields.Str(dump_only=True)

campaign_schema = CampaignSchema()
optional_campaign_schema = OptionalCampaignSchema()


class CampaignsAll(Resource):
    def get(self):
        campaigns = Campaign.all()
        campaign_dicts = [campaign.as_dict() for campaign in campaigns]
        for campaign in campaign_dicts:
            campaign['company_name'] = User.get(campaign['company_id']).name
        return campaign_dicts

    def post(self):
        user = get_user_from_token(request)
        
        if not user:
            return {'error': 'not logged in'}, 401
        
        if user.role == 'CB':
            return {'error': 'collaborators cannot create campaigns'}, 403

        json_data = request.get_json()
        if not json_data:
            return {"error": "no input data provided"}, 400

        try:
            data = campaign_schema.load(json_data)
        except ValidationError as err:
            return err.messages, 400
        
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
        if not is_valid_uuid(campaign_id):
            return {'message': f'no campaign with id {campaign_id} found'}, 404

        campaign = Campaign.get(campaign_id)

        if not campaign:
            return {'message': f'no campaign with id {campaign_id} found'}, 404

        return campaign.as_dict()

    def put(self, campaign_id):
        user = get_user_from_token(request)
        
        if not user:
            return {'error': 'not logged in'}, 401

        if user.role == 'CB':
            return {'error': 'collaborators cannot edit campaigns'}, 403
        
        if not is_valid_uuid(campaign_id):
            return {'message': f'no campaign with id {campaign_id} found'}, 404
        
        campaign = Campaign.get(campaign_id)
        
        if not campaign:
            return {'message': f'no campaign with id {campaign_id} found'}, 404

        if campaign.company_id != user.id and user.role == 'PM':
            return {'error': 'promoters cannot edit another promoter\'s campaigns'}, 403

        json_data = request.get_json()
        try:
            data = optional_campaign_schema.load(json_data)
        except ValidationError as err:
            return err.messages, 400

        # TODO find out if there's a cleaner way to do this
        campaign.name = not_none(data.get('name'), campaign.name)
        campaign.description = not_none(data.get('description'), campaign.description)
        campaign.save()
        
        return campaign.as_dict(), 200

    def delete(self, campaign_id):
        user = get_user_from_token(request)
        
        if not user:
            return {'error': 'not logged in'}, 401
        
        if user.role == 'CB':
            return {'error': 'collaborators cannot delete campaigns'}, 403
        
        if not is_valid_uuid(campaign_id):
            return {'message': f'no campaign with id {campaign_id} found'}, 404
        
        campaign = Campaign.get(campaign_id)
        
        if not campaign:
            return {'message': f'no campaign with id {campaign_id} found'}, 404

        if campaign.company_id != user.id and user.role == 'PM':
            return {'error': 'promoters cannot delete another promoter\'s campaigns'}, 403

        Campaign.delete_one(campaign.id)

        return {'result': 'success'}, 204