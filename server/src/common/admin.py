from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from src.database.db import db_session
from src.database.models import User, Campaign, Action, Offer, Transaction


def create_admin(app):
    app.config['FLASK_ADMIN_SWATCH'] = 'cosmo'
    admin = Admin(app, name='socialcoin', template_mode='bootstrap3')

    admin.add_view(ModelView(User, db_session))
    admin.add_view(ModelView(Campaign, db_session))
    admin.add_view(ModelView(Action, db_session))
    admin.add_view(ModelView(Offer, db_session))
    admin.add_view(ModelView(Transaction, db_session))
