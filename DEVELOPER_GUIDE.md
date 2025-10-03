# Developer Guide: Soulbound Certificate Platform

This guide explains the full stack, how to run the prototype locally, how to deploy to testnets, and how to safely update or extend each part of the system.

---

## Architecture Overview

- Smart contracts (Solidity, Hardhat) in `contracts/`
  - `SoulboundCertificate.sol` implements a non-transferable (soulbound) ERC-721 with on-chain validation and metadata URIs (IPFS)
  - Uses OpenZeppelin libraries and ERC721Enumerable for token enumeration
- Backend API (Node/Express) in `backend/`
  - IPFS pinning via web3.storage
  - Example endpoint to serve sample metadata
- Frontend (React + Ethers) in `frontend/`
  - University dashboard: mint certificates
  - Student dashboard: view owned certificates
  - Employer verification: verify token authenticity and read metadata
  - Web3Auth optional login flow

Data flow:
- University submits certificate data on the frontend → backend pins metadata to IPFS → backend returns `ipfs://…` URI → frontend calls contract `mintCertificate(student, uri)`.
- Employer verifies via `verifyCertificate(tokenId)` and reads `tokenURI(tokenId)`.

---

## Prerequisites

- Node.js LTS (>= 18)
- NPM or Yarn (examples use npm)
- Wallet (MetaMask) with testnet funds if deploying to a public testnet

---

## Environment Configuration

1) Contracts (.env)
- Create `contracts/.env` from `.env.example` and set:
```bash path=null start=null
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
SEPOLIA_RPC_URL=https://YOUR_RPC_ENDPOINT
```

2) Backend (.env)
- Create `backend/.env` from `.env.example` and set:
```bash path=null start=null
WEB3STORAGE_TOKEN=YOUR_WEB3_STORAGE_API_TOKEN
PORT=5001
```

3) Frontend
- Optional: Edit `frontend/src/web3auth.js` with your Web3Auth `clientId` and RPC settings, or keep as-is for local prototyping.

---

## Install Dependencies

- Contracts
```bash path=null start=null
cd contracts
npm install
```

- Backend
```bash path=null start=null
cd backend
npm install
```

- Frontend
```bash path=null start=null
cd frontend
npm install
```

---

## Compile and Deploy Contracts

- Compile
```bash path=null start=null
cd contracts
npm run compile
```

- Deploy to local Hardhat node (optional)
```bash path=null start=null
# in one terminal, run: npx hardhat node
# in another terminal:
cd contracts
npm run deploy:local
```

- Deploy to Sepolia testnet and auto-sync frontend address + ABI
```bash path=null start=null
cd contracts
npm run deploy:save:sepolia
```
This writes the deployed address to `frontend/src/contract-address.json` and the ABI to `frontend/src/abi/SoulboundCertificate.json`.

Note: A plain deployment script also exists at `contracts/deploy.js`.

---

## Run Backend

- Start backend (IPFS pinning and example endpoint)
```bash path=null start=null
cd backend
npm run start
# or: npm run dev (with nodemon)
```
- The pinning endpoint: `POST http://localhost:5001/api/pin`
  - Body: certificate metadata JSON
  - Returns: `{ uri: "ipfs://<cid>/metadata.json" }`

---

## Run Frontend

```bash path=null start=null
cd frontend
npm start
```
- App runs at http://localhost:3000
- Tabs:
  - University: Connect (Web3Auth), fill form, Mint
  - Student: Connect wallet (Web3Modal/MetaMask), view owned certificates
  - Employer: Enter token ID, Verify and read metadata

---

## Smart Contract Details

- File: `contracts/SoulboundCertificate.sol`
  - Standards: ERC-721 (URIStorage) + ERC721Enumerable
  - Non-transferable (soulbound): transfers are blocked in `_beforeTokenTransfer` unless minting or burning
  - State:
    - `uint256 public nextTokenId;`
    - `mapping(uint256 => bool) public validCertificates;`
  - Events:
    - `event CertificateMinted(address indexed student, uint256 indexed tokenId, string metadataURI);`
  - External functions:
    - `mintCertificate(address student, string memory metadataURI) external onlyOwner` — mints new soulbound NFT to `student`
    - `verifyCertificate(uint256 tokenId) external view returns (bool)` — checks existence and validity
    - `revokeCertificate(uint256 tokenId) external onlyOwner` — marks as invalid

Ownership model: Only the contract owner (the deploying account) can mint and revoke certificates by default. You can swap to a role-based model with OpenZeppelin AccessControl if needed.

Enumeration: ERC721Enumerable enables student dashboards to enumerate owned tokens via `tokenOfOwnerByIndex`.

---

## Frontend Contract Integration

- Address: `frontend/src/contract-address.json` is updated by deployment script
- ABI: `frontend/src/abi/SoulboundCertificate.json` is written on deploy (if you use it)
- Current components use minimal inline ABIs for reads/writes; you can import the ABI JSON instead if preferred

Example: importing ABI in a component
```js path=null start=null
import abi from "../abi/SoulboundCertificate.json";
import addressJson from "../contract-address.json";

const CONTRACT_ADDRESS = addressJson.address;
const CONTRACT_ABI = abi;
```

---

## Changing Networks

- Update `contracts/.env` with the correct RPC URL and fund the `PRIVATE_KEY` on that network
- Re-deploy using `npm run deploy:save:sepolia` (or create an additional script for your new network)
- Frontend will auto-pick the new address written to `frontend/src/contract-address.json`

---

## Updating the Contract

1) Edit `contracts/SoulboundCertificate.sol`
2) Re-compile: `npm run compile`
3) Re-deploy and sync: `npm run deploy:save:sepolia`
4) Restart frontend if it’s running (to pick any ABI/address changes)

If you introduce breaking changes (new functions, changed signatures), update any frontend component ABIs or switch to importing the generated ABI JSON.

---

## Updating the Backend

- Business logic lives in `backend/index.js`
- To change pinning service or add new endpoints, extend this file
- Keep `WEB3STORAGE_TOKEN` secret in `.env`. Never commit it.

---

## Updating the Frontend

- Components live in `frontend/src/components/`
- Key files: `App.js`, `web3auth.js`, and dashboard components
- Contract address is read from `frontend/src/contract-address.json`
- If you change contract interfaces, update the ABIs in components or import the generated ABI JSON

---

## Security and Secrets

- Never hardcode private keys or access tokens
- Use `.env` files and environment variables
- Do not print sensitive values in logs or commit them to version control

---

## Troubleshooting

- Error: `tokenOfOwnerByIndex` not found → Ensure contract includes ERC721Enumerable and has been redeployed
- Backend IPFS pinning errors → Verify `WEB3STORAGE_TOKEN` is set and valid
- Frontend shows old address → Re-deploy with `deploy-and-save` script to refresh `contract-address.json`
- RPC/Network issues → Confirm RPC URL is reachable and account is funded with test ETH

---

## Suggested Next Steps (optional)

- Add role-based minting (AccessControl) for multiple universities
- Write unit tests with Hardhat for core functions
- Persist issued certificates off-chain in a database for indexing and search
- Add Etherscan/Blockscout verification in deployment pipelines
