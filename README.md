# Decentralized Voting System

This project is a decentralized application (DApp) for a voting system that uses Solidity for smart contracts and React for the frontend. The smart contract manages the voting process where blockchain addresses represent voters, ensuring secure and transparent voting. The frontend allows users to submit their votes and view current polling results in real-time.

## Features

- **Secure Voting**: Prevents double voting and ensures voter confidentiality.
- **Real-Time Polling Results**: Users can see the current results of the voting process.
- **Blockchain Integration**: Uses Solidity for smart contract implementation and deploys on a testnet for demonstration.

## Technologies Used

- **Frontend**: React, Vite, MUI (Material-UI), React Query
- **Backend**: Solidity for smart contracts
- **Blockchain**: Ethereum - BSC (testnet deployment)
- **Styling**: Emotion
- **Build Tool**: Vite
- **TypeScript**: For type safety and better development experience

## Getting Started

### Prerequisites

- Node.js (v14 or above)
- npm or yarn
- Crypto Wallet extension installed on your browser or WalletConnect

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/VTAkbay/voting-app.git
   cd voting-app
   ```

2. Install dependencies:

   ```bash
   npm install
   #or
   yarn install
   ```

3. Create an .env.local file based on .env.local.example and update the environment variables as needed. This file should contain the necessary configuration for connecting to your blockchain network and any other required environment settings.

## Running the Application

1. Start the development server:

   ```bash
   npm run dev
   #or
   yarn dev
   ```

2. Open your browser and navigate to http://localhost:5173.

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [MUI](https://mui.com/)
- [Ethereum](https://ethereum.org/)
- [Wagmi](https://wagmi.sh/)
