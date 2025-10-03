// Deployment script using ethers.js
const { ethers } = require("hardhat");

async function main() {
  const SoulboundCertificate = await ethers.getContractFactory("SoulboundCertificate");
  const contract = await SoulboundCertificate.deploy();
  await contract.deployed();
  console.log("SoulboundCertificate deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
