
# Rock Paper Scissor Game on Base Sepolia

## Project Overview
A decentralized Rock Paper Scissor game built on the Base Sepolia testnet using Solidity and Hardhat. This project demonstrates smart contract development, deployment, and interaction on an EVM-compatible blockchain.

## Features
- Create new game instances.
- Join existing games as a second player.
- Players can choose their moves (Rock, Paper, or Scissor) using a commit-reveal scheme to ensure fairness.
- The winner of the game receives an NFT as a reward.

## Technologies Used
- **Solidity:** Smart contract language.
- **Hardhat:** Ethereum development environment for compiling, deploying, testing, and debugging smart contracts.
- **Base Sepolia:** The testnet used for deployment.
- **Bun:** JavaScript runtime and package manager.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone git@github.com:ardefishel/web3-base-RPS-game.git
    cd rps-game-contract
    ```
2.  **Install dependencies:**
    ```bash
    bun install
    ```

## Key Commands

### Compile Contracts
```bash
bunx hardhat build
```

### Run Tests
```bash
bunx hardhat test
```

### Deploy Contract (using Hardhat Ignition)
To deploy the contract to Base Sepolia, ensure you have configured your `hardhat.config.ts` with the appropriate network details and a private key.
```bash
bunx hardhat ignition deploy ignition/modules/RPSGame.module.ts --network baseSepolia
```

### Play the Game
After deployment, you can interact with the game using the provided script.
```bash
bunx hardhat run scripts/playRPS.ts --network baseSepolia
```
_Note: You might need to update the `playRPS.ts` script with the deployed contract address._

### Verify Contract
After deployment, you can verify your contract on Etherscan (or BaseScan for Base Sepolia) using:
```bash
npx hardhat verify --network baseSepolia <deployed_contract_address>
```
_Replace `<deployed_contract_address>` with the actual address of your deployed RPSGame contract._