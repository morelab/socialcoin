from abc import ABCMeta, abstractmethod
from coincurve import PublicKey
from hfc.fabric import Client
from secrets import token_bytes
from sha3 import keccak_256
from web3 import Web3
import asyncio
import os


def generate_keys():
    """Return a new random ethereum address with its private key."""
    private_key = keccak_256(token_bytes(32)).digest()
    public_key = PublicKey.from_valid_secret(
        private_key).format(compressed=False)[1:]
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
        self.contract = self.w3.eth.contract(address=Web3.toChecksumAddress(
            os.environ.get('CONTRACT_ADDRESS')), abi=abi)

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
        # TODO: add 'credentialStore', 'orderers' keys in connection profile
        client = Client(net_profile="./blockchain/fabric/connection-profile.json")

        print(f'Organizations: {client.organizations}')  # orgs in the network
        print(f'Peers: {client.peers}')  # peers in the network
        print(f'Orderers: {client.orderers}')  # orderers in the network
        print(f'CAs: {client.CAs}')  # ca nodes in the network

        # Prepare User Id? => https://github.com/hyperledger/fabric-sdk-py/blob/main/docs/source/tutorial.md#12-prepare-user-id-optionally
        loop = asyncio.get_event_loop()
        centralbank_admin = client.get_user('URL', 'Admin')
        client.new_channel('mainchannel')

    def balance_of(self, address):
        args = [address]
        response = self.loop.run_until_complete(self.client.chaincode_query(
            requestor=self.centralbank_admin,
            channel_name='mainchannel',
            peers=['peer0.org1.example.com'],
            args=args,
            cc_name='socialcoin'
        ))

    def mint(self, caller, caller_key, to, value):
        args = [to, value]
        response = self.loop.run_until_complete(self.client.chaincode_invoke(
            requestor=self.centralbank_admin,
            channel_name='mainchannel',
            peers=['peer0.org1.example.com'],
            args=args,
            cc_name='socialcoin',
            # for being sure chaincode invocation has been commited in the ledger, default is on tx event
            wait_for_event=True,
            # cc_pattern='^invoked*' # if you want to wait for chaincode event and you have a `stub.SetEvent("invoked", value)` in your chaincode
        ))

    def burn(self, caller, caller_key, from_acc, value):
        args = [from_acc, value]
        response = self.loop.run_until_complete(self.client.chaincode_invoke(
            requestor=self.centralbank_admin,
            channel_name='mainchannel',
            peers=['peer0.org1.example.com'],
            args=args,
            cc_name='socialcoin',
            # for being sure chaincode invocation has been commited in the ledger, default is on tx event
            wait_for_event=True,
            # cc_pattern='^invoked*' # if you want to wait for chaincode event and you have a `stub.SetEvent("invoked", value)` in your chaincode
        ))

    def processAction(self, caller, caller_key, promoter, to, action_id, reward, time, ipfs_hash):
        args = [promoter, to, action_id, reward, time, ipfs_hash]
        response = self.loop.run_until_complete(self.client.chaincode_invoke(
            requestor=self.centralbank_admin,
            channel_name='mainchannel',
            peers=['peer0.org1.example.com'],
            args=args,
            cc_name='socialcoin',
            # for being sure chaincode invocation has been commited in the ledger, default is on tx event
            wait_for_event=True,
            # cc_pattern='^invoked*' # if you want to wait for chaincode event and you have a `stub.SetEvent("invoked", value)` in your chaincode
        ))


def getBlockchainManager(network):
    """Blockchain Manager Factory"""
    if network == 'fabric':
        return FabricManager()
    if network == 'ethereum':
        return EthereumManager()
