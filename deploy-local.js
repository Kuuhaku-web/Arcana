const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const { ethers } = hre;

async function main() {
  console.log("🚀 DEPLOYING CONTRACTS FOR LOCAL TESTING\n");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log(`📝 Deploying with account: ${deployer.address}\n`);
  
  // ===== DEPLOY TOKEN =====
  console.log("=" .repeat(50));
  console.log("DEPLOYING CAMPUS TOKEN");
  console.log("=" .repeat(50));
  
  const CampusToken = await hre.ethers.getContractFactory("CampusToken");
  const token = await CampusToken.deploy(1000); // 1000 tokens initial
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log(`✅ Token deployed to: ${tokenAddress}`);
  
  // ===== DEPLOY DAO =====
  console.log(`\n${"=" .repeat(50)}`);
  console.log("DEPLOYING ARCANA DAO");
  console.log("=" .repeat(50));
  
  const ArcanaDAO = await hre.ethers.getContractFactory("ArcanaDAO");
  const dao = await ArcanaDAO.deploy(tokenAddress);
  await dao.waitForDeployment();
  const daoAddress = await dao.getAddress();
  console.log(`✅ DAO deployed to: ${daoAddress}`);
  
  // ===== CREATE PROPOSAL =====
  console.log(`\n${"=" .repeat(50)}`);
  console.log("CREATING TEST PROPOSAL");
  console.log("=" .repeat(50));
  
  const proposalTx = await dao.createProposal(
    "Increase Community Fund to 50% of Treasury",
    "This proposal seeks to increase the community fund allocation to 50% of the treasury."
  );
  await proposalTx.wait();
  console.log(`✅ Proposal created`);
  
  // ===== MINT TOKENS TO DEPLOYER =====
  console.log(`\n${"=" .repeat(50)}`);
  console.log("MINTING TOKENS");
  console.log("=" .repeat(50));
  
  const balance = await token.balanceOf(deployer.address);
  console.log(`✅ Deployer balance: ${ethers.formatEther(balance)} ARC`);
  
  // ===== APPROVE TOKENS =====
  console.log(`\n${"=" .repeat(50)}`);
  console.log("APPROVING TOKENS FOR DAO");
  console.log("=" .repeat(50));
  
  const approveAmount = ethers.parseEther("100000");
  const approveTx = await token.approve(daoAddress, approveAmount);
  await approveTx.wait();
  console.log(`✅ Approved ${ethers.formatEther(approveAmount)} ARC for DAO`);
  
  // ===== SAVE CONFIG =====
  console.log(`\n${"=" .repeat(50)}`);
  console.log("SAVING CONFIGURATION");
  console.log("=" .repeat(50));
  
  // Update contract-address.json
  const contractAddressPath = path.join(__dirname, "src/contracts/contract-address.json");
  const contractAddressData = {
    token: tokenAddress,
    dao: daoAddress,
    name: "Arcana",
    symbol: "ARC",
    decimals: "18",
    network: "localhost",
    deployedAt: new Date().toISOString()
  };
  fs.writeFileSync(contractAddressPath, JSON.stringify(contractAddressData, null, 2));
  console.log(`✅ Saved contract addresses to contract-address.json`);
  
  // Save deployed addresses to a separate file for easy access
  const deployedAddressesPath = path.join(__dirname, "src/contracts/deployed-addresses.json");
  fs.writeFileSync(deployedAddressesPath, JSON.stringify(contractAddressData, null, 2));
  console.log(`✅ Saved to deployed-addresses.json`);
  
  // ===== SUMMARY =====
  console.log(`\n${"=" .repeat(50)}`);
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=" .repeat(50));
  console.log(`\n📋 Configuration Summary:`);
  console.log(`   Token Address:    ${tokenAddress}`);
  console.log(`   DAO Address:      ${daoAddress}`);
  console.log(`   Deployer Address: ${deployer.address}`);
  console.log(`   Token Balance:    ${ethers.formatEther(balance)} ARC`);
  console.log(`   DAO Approval:     ${ethers.formatEther(approveAmount)} ARC`);
  console.log(`\n⚠️  IMPORTANT FOR FRONTEND:`);
  console.log(`   Update Dao.jsx with these addresses:`);
  console.log(`   const TOKEN_ADDRESS = "${tokenAddress}";`);
  console.log(`   const DAO_ADDRESS = "${daoAddress}";`);
  console.log(`\n📱 MetaMask Network Settings:`);
  console.log(`   Network Name: Localhost 8545`);
  console.log(`   RPC URL: http://127.0.0.1:8545`);
  console.log(`   Chain ID: 31337`);
  console.log(`   Currency: ETH`);
  console.log(`\n✅ Ready to vote! The test proposal is available for voting.\n`);
}

main().catch((error) => {
  console.error("Deployment error:", error);
  process.exit(1);
});
