# Web3-Base-RPS-Game

This repository features a Rock-Paper-Scissors (RPS) game built on a web3 platform, leveraging a smart contract. It showcases a basic decentralized application (dApp) structure with contract deployment and interaction.

## Deployed Contract

The RPS game contract is deployed and verified on the Sepolia Base network.

- **Address:** `0xa91d131430a9fEd44A211FA3DEcA510e6a18BC58`
- **Basescan:** [https://sepolia.basescan.org/address/0xa91d131430a9fEd44A211FA3DEcA510e6a18BC58#code](https://sepolia.basescan.org/address/0xa91d131430a9fEd44A211FA3DEcA510e6a18BC58#code)

## Project Structure

-   `rps-game-contract/`: Smart contract, deployment scripts, and tests.
-   `rps-game-web/`: (Future) Web interface for contract interaction.

## Local Development

To set up locally:

1.  **Clone the repository.**
2.  **Install dependencies** in `rps-game-contract/`:
    ```bash
    cd rps-game-contract
    bun install
    ```
3.  **Compile contract:** `bunx hardhat compile`
4.  **Run tests:** `bunx hardhat test`
