from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api, Resource
from common.admin import create_admin
from config import APP_SECRET
from database.db import init_db, db_session
from resources import *

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = APP_SECRET
api = Api(app)

init_db()
create_admin(app)


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()
    

class Home(Resource):
    def get(self):
        # TODO API endpoint docs
        return 'running'


# flask_restful API routes
api.add_resource(Home, '/')

api.add_resource(GoogleLogin, '/api/login')
api.add_resource(Logout, '/api/logout')

api.add_resource(CampaignsAll, '/api/campaigns')
api.add_resource(CampaignsByCompany, '/api/campaigns/company')
api.add_resource(CampaignsDetail, '/api/campaigns/<string:campaign_id>')

api.add_resource(ActionsAll, '/api/actions')
api.add_resource(ActionsDetail, '/api/actions/<string:action_id>')
api.add_resource(ActionRegister, '/api/actions/<string:action_id>/register')

api.add_resource(OffersAll, '/api/offers')
api.add_resource(OffersDetail, '/api/offers/<string:offer_id>')
api.add_resource(OfferRedeem, '/api/offers/<string:offer_id>/redeem')

api.add_resource(TransactionsAll, '/api/transactions')

api.add_resource(UsersSelf, '/api/users/self')
api.add_resource(UserBalance, '/api/users/balance')

# TODO error handlers https://flask.palletsprojects.com/en/2.1.x/errorhandling/

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
