from flask import request
from flask_restful import Resource
from src.common.utils import get_user_from_token
from src.database.models import Transaction, User

class TransactionsAll(Resource):
    def get(self):
        user = get_user_from_token(request)
        
        if user.role == 'AD':
            transactions = Transaction.all()
        else:
            transactions = Transaction.get_by_address(user.blockchain_public)
        transaction_dicts = [transaction.as_dict() for transaction in transactions]
        
        # Add user data
        for transaction in transaction_dicts:
            sender_user = User.get_by_address(transaction['sender_address'])
            receiver_user = User.get_by_address(transaction['receiver_address'])
            transaction['sender_email'] = sender_user.email
            transaction['receiver_email'] = receiver_user.email
            transaction['sender_name'] = sender_user.name
            transaction['receiver_name'] = receiver_user.name
            transaction['date'] = str(transaction.get('date'))

        return transaction_dicts