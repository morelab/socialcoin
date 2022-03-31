# DeustoCoin

Adaptation to Smart Contracts and Hyperledger Besu of [Deustocoin, by Jorge El Busto](https://github.com/bu5to/deustoCoin). Created for MORElab from Deusto University.

Deustocoin is a project that intends to promote the motto "Blockchain for Good" and contribute to a better world through a social coin using the emerging technology that is Blockchain.

# Overview

## How does it work?

The web application works as follows: 

Both members of the university and promoters of campaigns belonging to external companies can operate on the app. The promoters can create campaigns and actions that intend to comply with the [United Nations' SDGs (Sustainable Development Goals)](https://sdgs.un.org/goals). Examples of those actions are using recyclable coffee cups or walking/cycling to the university instead of using a car. They can monitor the Key Performance Indicators (KPIs) of the campaigns and actions, and observe their progress on graphics.

Members of the university, referred to as 'collaborators', can then complete those actions to earn a reward in UDCoin, a cryptocurrency based on the Ethereum ERC20 standard (more details below). This coin can then be exchanged for offers created by the companies, such as food, drinks, or discounts on other products; it can also be sent to other collaborators. The system is compatible with both Ethereum and [Hyperledger Fabric](https://www.hyperledger.org/use/fabric) smart contracts.

Some users may be administrators, to manage and watch over the usage of the system.


## Technical aspects

The API is written in [Flask](https://flask.palletsprojects.com/en/2.0.x/), a Python framework, and the web client is written in [React](https://reactjs.org/). The communication with the ethereum blockchain is done through the [Python version of Web3](https://web3py.readthedocs.io/en/stable/), or with a dedicated API in the case of the Hyperledger Fabric blockchain. Other technologies used are IPFS (used to save action realization proofs) or Google App Engine (to carry out authentication).

In the original project, the coins where based on the ether token and sent using raw transactions on the blockchain. In this reimplementation, the system has been redesigned to rely on a Solidity/Fabric Smart Contract, which can be read in [server/contracts/ethereum/socialcoin.sol](server/contracts/ethereum/socialcoin.sol). This contract is based on the Ethereum [ERC20 Token Standard](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/). This contract can be deployed on the Ethereum network, but a different approach is being tested and explored, based on [Hyperledger Besu](https://www.hyperledger.org/use/besu). The contract can be also found implemented using Hyperledger Fabric smart contracts in [server/contracts/fabric/](server/contracts/fabric/).

Besu is an Ethereum client developed by the Linux Foundation that supports the creation of private and permissioned networks. As it has been previously mentioned, this application tries to comply with the UN's Sustainable Development Goals, an intention which is not currently compatible with the high energy usage of blockchains like Ethereum or Bitcoin. That is why for now the plan is to deploy the system in a smaller network that uses the [Proof of Authority](https://en.wikipedia.org/wiki/Proof_of_authority) consensus protocol, which consumes a lot less energy and works better with our approach. Besu also supports gas-free networks (with no transaction fees) which greatly improves the final user experience.

This way, the web app would be deployed on a centralized server, while the currency management would be carried out in a decentralized blockchain, combining the best of both worlds.


## Cloud deployment
The original application is currently [deployed in Heroku](https://deustocoin.herokuapp.com), without the use of smart contracts or Besu.

# Execution

## Web client
The web client requires [npm](https://www.npmjs.com/) to be run.

A '```.env```' file must be created in the client root containing the following environmental variables:
- REACT_APP_GOOGLE_CLIENT_ID: Google OAuth client ID of the application
- REACT_APP_BASE_BACKEND_URL: URL of the backend server

We can run the app in the following way:
```
# Navigate to the directory
cd client/

# Install dependencies
npm install

# Run the app in development mode on http://localhost:3000
npm start
```

## API server
The API has been developed using [Python 3.8.10](https://www.python.org/downloads/release/python-3810/).

A '```config.py```' file must be created in the [server/src](server/src/) root containing the following environmental variables:
- DATABASE_URL: URL of the backend database
- APP_SECRET: secret key for the API server

- GOOGLE_CLIENT_ID: Google OAuth client ID of the application
- GOOGLE_CLIENT_SECRET: Google OAuth client password of the application

- BLOCKCHAIN_URL: URL of the blockchain network (used only with Ethereum)
- ADMIN_ADDRESS: blockchain address of the administrator account
- PRIVATE_KEY: blockchain private key of the administrator account
- CONTRACT_ADDRESS: address of the smart contract (used only with Ethereum)

- NETWORK: used blockchain network (either 'ethereum' or 'fabric')
- FABRIC_ADMIN_USER: Fabric API admin user email
- FABRIC_ADMIN_PWD: Fabric API admin user password
- FABRIC_LOGIN_URL: Fabric API url for login
- FABRIC_TRANSACTION_URL: Fabric API url for transaction submitting

- IPFS_ON: if set to ```True```, proof files will be uploaded to IPFS
- IPFS_URL: URL for the used IPFS Daemon

- BASE_BACKEND_URL: base URL for the backend server
- BASE_FRONTEND_URL: base URL for the frontend server

The API server can be run the following way:
### Initial instalation
```
# Navigate to the directory
cd server

# Create a virtual environment for the API
python -m venv venv

# ...and enter the virtual environment
source venv/bin/activate        # Linux/MacOS
.\venv\Scripts\Activate.ps1     # Windows (Powershell)
.\venv\Scripts\Activate.bat     # Windows (cmd.exe)

# Install all required libraries
pip install -r requirements.txt

python src/app.py
```

### Normal execution
```
# Navigate to the directory
cd server

# Enter the virtual environment
source venv/bin/activate        # Linux/MacOS
.\venv\Scripts\Activate.ps1     # Windows (Powershell)
.\venv\Scripts\Activate.bat     # Windows (cmd.exe)

# Execute the server
python src/app.py
```

### Exit the virtual environment
```
deactivate
```