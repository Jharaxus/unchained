# Unchained Web3-Backend
Blockchain-backend of the Unchained App

## Setup
To run this backend locally, you first have to download the foundry tools.
> This can be done by following the steps described [here](https://book.getfoundry.sh/getting-started/installation)

Once foundry is setup, run the following commands to load the project:
> forge install

At this point, running `forge install` should succeed without any error.

## Running the tests
To run the tests locally, simply run `forge test`

## Deploying the smart conctracts locally
### Deploying a local blockchain
First, you need to start `anvil` which is a tool that emulates a blockchain directly on your computer.

We need to interact with *smart contracts* already deployed so we will clone the current state of the Ethereum blockchain and use it as the start of our local one.

To fetch this state, you will need a valid *API key* from the rpc provider Infura (this step can be adapted to other rpc providers), which you can get by creating a free account [here](https://app.infura.io/register).
Then, you can simply run:
> anvil --fork-url https://mainnet.infura.io/v3/YOUR_INFURA_KEY

Before completing this step, take note of the **Available Accounts** and **Private Keys** displayed when the blockchain started, you will need them later (at least 1 of each).

### Deploying the smart contracts
First, create a **.env** file at the root of this project. It should look like this:
```
PRIVATE_KEY=ONE_OF_THE_PRIVATE_KEYS_GIVEN_BY_ANVIL
PUBLIC_KEY=THE_ASSOCIATED_PUBLIC_KEY
```
Then, you can deploy any contract in the **src/** folder by running its corresponding script located in the **script/** folder:
> forge script script/SCRIPT_PATH:SCRIPT_CONTRACT_NAME --fork-url http://localhost:*port_number_of_anvil* --broadcast

For example, if you want to deploy the **AlphaStrategyVault** contract and `anvil` is listening tour your port **8545**, run the following command:
> forge script script/strategies/AlphaStrategyVault.s.sol:AlphaStrategyVaultScript --fork-url http://localhost:8545 --broadcast