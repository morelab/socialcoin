from abc import ABCMeta, abstractmethod
from coincurve import PublicKey
from secrets import token_bytes
from sha3 import keccak_256
from web3 import Web3
import os


def generate_keys():
    """Return a new random ethereum address with its private key."""
    private_key = keccak_256(token_bytes(32)).digest()
    public_key = PublicKey.from_valid_secret(private_key).format(compressed=False)[1:]
    address = keccak_256(public_key).digest()[-20:]
    return {'address': '0x' + address.hex(), 'key': private_key.hex()}


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
        self.w3 = Web3(Web3.HTTPProvider(os.environ.get('BLOCKCHAIN_URL')))
        
        abi = open('contractABI.txt').read()
        self.contract = self.w3.eth.contract(address=Web3.toChecksumAddress(os.environ.get('CONTRACT_ADDRESS')), abi=abi)


    def balance_of(self, address):
        """Returns the balance of the input address."""
        return self.contract.functions.balanceOf(address).call()


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
        signed_tx = self.w3.eth.account.signTransaction(transaction, private_key=caller_key)
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
        signed_tx = self.w3.eth.account.signTransaction(transaction, private_key=caller_key)
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
        signed_tx = self.w3.eth.account.signTransaction(transaction, private_key=caller_key)
        return self.w3.eth.sendRawTransaction(signed_tx.rawTransaction)


class FabricManager(BlockchainManager):
    # TODO: API calls
    def __init__(self) -> None:
        super().__init__()


    def balance_of(self, address):
        pass


    def mint(self, caller, caller_key, to, value):
        pass


    def burn(self, caller, caller_key, from_acc, value):
        pass


    def processAction(self, caller, caller_key, promoter, to, action_id, reward, time, ipfs_hash):
        pass


def getBlockchainManager(network):
    if network == 'fabric':
        return FabricManager()
    if network == 'ethereum':
        return EthereumManager()