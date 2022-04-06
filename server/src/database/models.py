from __future__ import annotations
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, or_
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, backref
from .db import Base, db_session
import uuid

class User(Base):
    __tablename__ = 'user'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)

    # CB = collaborator
    # PM = promoter
    # AD = administrator
    role = Column(String(15), nullable=False, default='CB')

    blockchain_public = Column(String(127))
    blockchain_private = Column(String(127))    
    picture_url = Column(String(255))

    # Only for promoters/administrators
    campaigns = relationship('Campaign', backref=backref('user'))
    actions = relationship('Action', backref=backref('user'))
    offers = relationship('Offer', backref=backref('user'))

    def __init__(self, name, email, blockchain_public, blockchain_private, picture_url, role):
        self.name = name
        self.email = email
        self.blockchain_public = blockchain_public
        self.blockchain_private = blockchain_private
        self.picture_url = picture_url
        
        if not (role == 'CB' or role == 'PM' or role == 'AD'):
            raise ValueError('Invalid role code')
        self.role = role
    
    def __repr__(self):
        return f'<User {self.name!r}>'
    
    def save(self):
        if not self.id:
            db_session.add(self)
        db_session.commit()
        # db_session.expunge() # REVIEW necessary when using a single session?
    
    def as_dict(self):
        user = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        user['id'] = str(user.get('id'))
        return user
    
    @staticmethod
    def all():
        return User.query.all()

    @staticmethod
    def get(user_id) -> User:
        return User.query.get(user_id)

    @staticmethod
    def get_by_address(blockchain_address) -> User:
        return User.query.filter_by(blockchain_public=blockchain_address).first()
    
    @staticmethod
    def get_by_email(user_email) -> User:
        return User.query.filter_by(email=user_email).first()

    @staticmethod
    def get_role_by_email(user_email) -> str:
        result = User.query.filter_by(email=user_email).first()
        return result.role
    
    @staticmethod
    def exists(user_email) -> bool:
        return User.query.filter_by(email=user_email).first() is not None


class Campaign(Base):
    __tablename__ = 'campaign'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(80), nullable=False)
    description = Column(String, nullable=False)

    company_id = Column(UUID(as_uuid=True), ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    actions = relationship('Action', backref=backref('campaign'))

    def __init__(self, name, description, company_id):
        self.name = name
        self.description = description
        self.company_id = company_id    # TODO revise, check role, etc

    def __repr__(self):
        return f'<Campaign {self.name!r}>'
    
    def save(self):
        if not self.id:
            db_session.add(self)
        db_session.commit()
        # db_session.expunge() # REVIEW necessary when using a single session?
        
    def as_dict(self):
        campaign = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        campaign['id'] = str(campaign.get('id'))
        campaign['company_id'] = str(campaign.get('company_id'))
        return campaign

    @staticmethod
    def all():
        return Campaign.query.all()

    @staticmethod
    def get(campaign_id) -> Campaign:
        return Campaign.query.get(campaign_id)

    @staticmethod
    def get_by_company(company_id) -> Campaign:
        return Campaign.query.filter_by(company_id=company_id)

    @staticmethod
    def delete_one(campaign_id):
        campaign = Campaign.query.get(campaign_id)
        db_session.delete(campaign)
        db_session.commit()


class Action(Base):
    __tablename__ = 'action'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(80), nullable=False)
    description = Column(String(255), nullable=False)
    reward = Column(Float, nullable=False)
    kpi = Column(Integer, default=0)
    kpi_target = Column(Integer, default=0)
    kpi_indicator = Column(String(127), nullable=False)

    company_id = Column(UUID(as_uuid=True), ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    campaign_id = Column(UUID(as_uuid=True), ForeignKey('campaign.id', ondelete='CASCADE'), nullable=False)

    def __init__(self, name, description, reward, kpi_target, kpi_indicator, company_id, campaign_id):
        self.name = name
        self.description = description
        self.reward = reward
        self.kpi = 0
        self.kpi_target = kpi_target
        self.kpi_indicator = kpi_indicator

        self.company_id = company_id
        self.campaign_id = campaign_id

    def __repr__(self):
        return f'<Action {self.name!r}>'
    
    def save(self):
        if not self.id:
            db_session.add(self)
        db_session.commit()
        # db_session.expunge() # REVIEW necessary when using a single session?
        
    def as_dict(self):
        action = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        action['id'] = str(action.get('id'))
        action['company_id'] = str(action.get('company_id'))
        action['campaign_id'] = str(action.get('campaign_id'))
        return action
    
    @staticmethod
    def all():
        return Action.query.all()

    @staticmethod
    def get(action_id) -> Action:
        return Action.query.get(action_id)

    @staticmethod
    def get_by_company(company_id) -> Action:
        return Action.query.filter_by(company_id=company_id).first()
    
    @staticmethod
    def get_by_campaign(campaign_id) -> Action:
        return Action.query.filter_by(campaign_id=campaign_id).first()

    @staticmethod
    def delete_one(action_id):
        action = Action.query.get(action_id)
        db_session.delete(action)
        db_session.commit()



class Offer(Base):
    __tablename__ = 'offer'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(80), nullable=False)
    description = Column(String(511))
    price = Column(Float, nullable=False)

    company_id = Column(UUID(as_uuid=True), ForeignKey('user.id', ondelete='CASCADE'), nullable=False)

    def __init__(self, name, description, price, company_id):
        self.name = name
        self.description = description
        self.price = price
        self.company_id = company_id

    def __repr__(self):
        return f'<Offer {self.name!r}>'
    
    def save(self):
        if not self.id:
            db_session.add(self)
        db_session.commit()
        # db_session.expunge() # REVIEW necessary when using a single session?
        
    def as_dict(self):
        offer = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        offer['id'] = str(offer.get('id'))
        offer['company_id'] = str(offer.get('company_id'))
        return offer
    
    @staticmethod
    def all():
        return Offer.query.all()

    @staticmethod
    def get(offer_id) -> Offer:
        return Offer.query.get(offer_id)

    @staticmethod
    def get_by_company(company_id) -> Offer:
        return Offer.query.filter_by(company_id=company_id)
    
    @staticmethod
    def delete_one(offer_id):
        offer = Offer.query.get(offer_id)
        db_session.delete(offer)
        db_session.commit()



class Transaction(Base):
    __tablename__ = 'transaction'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    date = Column(DateTime, nullable=False)
    transaction_hash = Column(String(255), nullable=False)
    sender_address = Column(String(127), nullable=False)
    receiver_address = Column(String(127), nullable=False)
    quantity = Column(Float, nullable=False)
    transaction_info = Column(String(511), nullable=False)  # payment, redemption, etc
    img_ipfs_hash = Column(String(255))                     # image or screenshot of the action proof
    external_proof_url = Column(String(255))                # external optional proof url (e.g. Strava)

    def __init__(self, date, transaction_hash, sender_address, receiver_address, quantity, transaction_info, img_ipfs_hash, external_proof_url):
        self.date = date    # REVIEW if this works
        self.transaction_hash = transaction_hash
        self.sender_address = sender_address
        self.receiver_address = receiver_address
        self.quantity = quantity
        self.transaction_info = transaction_info
        self.img_ipfs_hash = img_ipfs_hash
        self.external_proof_url = external_proof_url

    def __repr__(self):
        return f'<Transaction {self.transaction_hash!r} ({self.date!r}) >'

    def save(self):
        if not self.id:
            db_session.add(self)
        db_session.commit()
        # db_session.expunge() # REVIEW necessary when using a single session?
        
    def as_dict(self):
        transaction = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        transaction['id'] = str(transaction.get('id'))
        return transaction

    @staticmethod
    def all():
        return Transaction.query.order_by(Transaction.date.desc())

    @staticmethod
    def get(transaction_id):
        return Transaction.query.get(transaction_id)

    @staticmethod
    def get_by_address(address):
        return Transaction.query.filter(or_(
            Transaction.sender_address == address,
            Transaction.receiver_address == address
        )).order_by(Transaction.date.desc())