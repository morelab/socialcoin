from abc import ABCMeta, abstractmethod
from coincurve import PublicKey
from secrets import token_bytes
from pathlib import Path
from sha3 import keccak_256
from web3 import Web3
from config import BLOCKCHAIN_URL, CONTRACT_ADDRESS, FABRIC_ADMIN_PWD, FABRIC_ADMIN_USER, FABRIC_LOGIN_URL, FABRIC_TRANSACTION_URL, NETWORK
import requests


s = requests.Session()


def generate_keys():
    """Return a new random ethereum address with its private key."""
    private_key = keccak_256(token_bytes(32)).digest()
    public_key = PublicKey.from_valid_secret(
        private_key).format(compressed=False)[1:]
    address = keccak_256(public_key).digest()[-20:]
    return {'address': '0x' + address.hex(), 'key': private_key.hex()}


def fabric_login():
    headers = {
        "Content-Type": "application/json; charset=utf-8"
    }
    data = {
        "userID": FABRIC_ADMIN_USER,
        "password": FABRIC_ADMIN_PWD
    }
    response = s.post(
        FABRIC_LOGIN_URL,
        headers=headers,
        json=data
    )


def fabric_send_transaction(method, *params):
    headers = {
        "Content-Type": "application/json; charset=utf-8"
    }
    data = {
        "fn": method,
        "args": [*params]
    }
    if method == 'balanceOf':
        response = s.post(
            f'{FABRIC_TRANSACTION_URL}/evaluate',
            headers=headers,
            json=data
        )
        return int(response.content.decode("utf-8"))
    else:
        response = s.post(
            f'{FABRIC_TRANSACTION_URL}/submit',
            headers=headers,
            json=data
        )
        return response.content.decode("utf-8")


class BlockchainManager(metaclass=ABCMeta):
    @abstractmethod
    def balance_of(self, address):
        pass

    @abstractmethod
    def mint(self, caller, caller_key, to, value):
        pass

    @abstractmethod
    def burn(self, caller, caller_key, from_acc, value):
        pass

    @abstractmethod
    def processAction(self, caller, caller_key, promoter, to, action_id, reward, time, ipfs_hash):
        pass


class EthereumManager(BlockchainManager):
    def __init__(self) -> None:
        self.w3 = Web3(Web3.HTTPProvider(BLOCKCHAIN_URL))

        p = Path(__file__).with_name('contractABI.json')
        abi = p.open('r').read()
        self.contract = self.w3.eth.contract(address=Web3.toChecksumAddress(CONTRACT_ADDRESS), abi=abi)

    def balance_of(self, address):
        """Returns the balance of the input address."""
        valid_address = Web3.toChecksumAddress(address)
        return self.contract.functions.balanceOf(valid_address).call()

    def mint(self, caller, caller_key, to, value):
        """Allows an administrator to mint/generate an amount of coins to the 'to' address."""
        transaction = self.contract.functions.mint(
            to, int(value)
        ).buildTransaction({
            'gas': 10000000,
            'gasPrice': self.w3.toWei(self.w3.eth.gas_price, 'gwei'),
            'from': caller,
            'nonce': self.w3.eth.getTransactionCount(caller, 'pending')
        })
        signed_tx = self.w3.eth.account.signTransaction(
            transaction, private_key=caller_key)
        return self.w3.eth.sendRawTransaction(signed_tx.rawTransaction)

    def burn(self, caller, caller_key, from_acc, value):
        """Allows an administrator to burn/delete and amount of coins from the 'from_acc' address."""
        transaction = self.contract.functions.burn(
            from_acc, int(value)
        ).buildTransaction({
            'gas': 10000000,
            'gasPrice': self.w3.toWei(self.w3.eth.gas_price, 'gwei'),
            'from': caller,
            'nonce': self.w3.eth.getTransactionCount(caller, 'pending')
        })
        signed_tx = self.w3.eth.account.signTransaction(
            transaction, private_key=caller_key)
        return self.w3.eth.sendRawTransaction(signed_tx.rawTransaction)

    def processAction(self, caller, caller_key, promoter, to, action_id, reward, time, ipfs_hash):
        """Registers a collaborator's good action on the blockchain and gives them credit for its completion."""
        transaction = self.contract.functions.processAction(
            promoter, to, action_id, reward, time, ipfs_hash
        ).buildTransaction({
            'gas': 10000000,
            'gasPrice': self.w3.toWei(self.w3.eth.gas_price, 'gwei'),
            'from': caller,
            'nonce': self.w3.eth.getTransactionCount(caller, 'pending')
        })
        signed_tx = self.w3.eth.account.signTransaction(
            transaction, private_key=caller_key)
        return self.w3.eth.sendRawTransaction(signed_tx.rawTransaction)


class FabricManager(BlockchainManager):
    def __init__(self):
        # self.connect_sid = fabric_login()
        fabric_login()

    def balance_of(self, address):
        try:
            balance = fabric_send_transaction('balanceOf', address)
            return balance
        except:
            return 0

    def mint(self, caller, caller_key, to, value):
        try:
            fabric_send_transaction('mint', to, value)
            return ''
        except:
            return 0

    def burn(self, caller, caller_key, from_acc, value):
        try:
            fabric_send_transaction('Burn', from_acc, value)
            return ''
        except:
            return 0

    def processAction(self, caller, caller_key, promoter, to, action_id, reward, time, ipfs_hash):
        try:
            fabric_send_transaction('processAction', promoter, to, action_id, reward, time, ipfs_hash)
        except:
            return 0


def getBlockchainManager(network):
    """Blockchain Manager Factory"""
    if network == 'fabric':
        return FabricManager()
    elif network == 'ethereum':
        return EthereumManager()
    else:
        return None

blockchain_manager = getBlockchainManager(NETWORK)