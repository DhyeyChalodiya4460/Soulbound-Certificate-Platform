// Deploy contract and save address + ABI to frontend automatically
const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  const SoulboundCertificate = await ethers.getContractFactory("SoulboundCertificate");
  const contract = await SoulboundCertificate.deploy();
  await contract.deployed();
  console.log("SoulboundCertificate deployed to:", contract.address);

  // Paths
  const frontendDir = path.join(__dirname, "..", "..", "frontend", "src");
  const addrPath = path.join(frontendDir, "contract-address.json");
  const abiDir = path.join(frontendDir, "abi");
  const abiOutPath = path.join(abiDir, "SoulboundCertificate.json");

  // Ensure abi directory exists
  fs.mkdirSync(abiDir, { recursive: true });

  // Save address to frontend
  fs.writeFileSync(addrPath, JSON.stringify({ address: contract.address }, null, 2));
  console.log("Contract address saved to frontend/src/contract-address.json");

  // Save ABI to frontend
  const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "SoulboundCertificate.sol", "SoulboundCertificate.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const abi = artifact.abi;
  fs.writeFileSync(abiOutPath, JSON.stringify(abi, null, 2));
  console.log("ABI saved to frontend/src/abi/SoulboundCertificate.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
