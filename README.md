# Soulbound Certificate Platform

A full-stack dApp for issuing, storing, and verifying student certificates as non-transferable (soulbound) NFTs on Ethereum-compatible blockchains (Polygon Mumbai, Goerli, etc).

---

## Features
- **University Dashboard:** Mint certificates as soulbound NFTs
- **Student Dashboard:** View owned certificates in wallet
- **Employer Verification:** Instantly verify certificates on-chain
- **Backend:** Store and pin metadata to IPFS
- **Smart Contract:** ERC-721, non-transferable, gas-optimized

---

## Folder Structure
```
contracts/   # Solidity smart contract + deploy script + sample metadata
frontend/    # React.js frontend (dashboards)
backend/     # Node.js/Express backend for metadata + IPFS
```

---

## Quick Start

### 1. Clone & Install
```bash
npm install -g hardhat
cd contracts
npm install
cd ../backend
npm install
cd ../frontend
npm install
```

### 2. Deploy Smart Contract
- Edit `contracts/deploy.js` if needed
- Deploy to Polygon Mumbai or Goerli:
```bash
npx hardhat run --network mumbai deploy.js
```
- Copy deployed contract address

### 3. Configure Frontend
- After running the deploy-and-save script, the address is written to `frontend/src/contract-address.json` automatically. No manual pasting needed.

### 4. Start Backend
```bash
cd backend
cp .env.example .env # Add your Web3.Storage token
npm start
```

### 5. Start Frontend
```bash
cd frontend
npm start
```

---

## Demo Workflow
1. **University:** Connect wallet, fill form, mint certificate
2. **Student:** Connect wallet, view certificates
3. **Employer:** Enter token ID, verify authenticity, view metadata

---

## Example Certificate Metadata
See `contracts/sample_metadata.json` for a ready-to-use example.

---

## Tech Stack
- Solidity, Hardhat, OpenZeppelin
- React.js, Ethers.js, Web3Modal
- Node.js, Express, web3.storage (IPFS)

---

## Notes
- Use MetaMask on Polygon Mumbai, Sepolia, or Goerli testnet
- Backend must be running for IPFS pinning
- All code is modular, clean, and ready for production
- See DEVELOPER_GUIDE.md for full technical details and update instructions

---

## License
MIT
