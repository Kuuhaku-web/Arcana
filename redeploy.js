const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Re-deploying all contracts...\n");
  
  try {
    const [deployer] = await hre.ethers.getSigners();
    console.log("📝 Deploying with account:", deployer.address);
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance), "ETH\n");
    
    // Deploy CampusToken
    console.log("1️⃣ Deploying CampusToken...");
    const CampusToken = await hre.ethers.getContractFactory("CampusToken");
    const token = await CampusToken.deploy(1000000);
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log("   ✅ CampusToken deployed at:", tokenAddress);
    
    // Deploy ArcanaDAO
    console.log("\n2️⃣ Deploying ArcanaDAO...");
    const ArcanaDAO = await hre.ethers.getContractFactory("ArcanaDAO");
    const dao = await ArcanaDAO.deploy(tokenAddress);
    await dao.waitForDeployment();
    const daoAddress = await dao.getAddress();
    console.log("   ✅ ArcanaDAO deployed at:", daoAddress);
    
    // Mint tokens
    console.log("\n3️⃣ Minting tokens...");
    const mintTx = await token.mint(deployer.address, 1000000, "Initial allocation");
    const mintReceipt = await mintTx.wait();
    console.log("   ✅ Minted 1,000,000 ARC tokens");
    
    // Create test proposals
    console.log("\n4️⃣ Creating test proposals...");
    const proposals = [
      {
        title: "Increase Community Fund to 50% of Treasury",
        description: "Proposal to allocate 50% of DAO treasury to community grants and development funds."
      },
      {
        title: "Launch New Advanced DeFi Course",
        description: "Create and fund a new advanced DeFi strategies course with expert lecturers."
      },
      {
        title: "Implement Quadratic Voting Rewards",
        description: "Introduce reward system for active voting participants in governance."
      }
    ];
    
    for (const proposal of proposals) {
      const tx = await dao.createProposal(proposal.title, proposal.description);
      await tx.wait();
      console.log("   ✅ Created:", proposal.title);
    }
    
    // Save contract addresses
    console.log("\n5️⃣ Saving contract addresses...");
    const contractsDir = path.join(__dirname, "src/contracts");
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir, { recursive: true });
    }
    
    const contracts = {
      TOKEN_ADDRESS: tokenAddress,
      DAO_ADDRESS: daoAddress,
      NETWORK: "localhost"
    };
    
    fs.writeFileSync(
      path.join(contractsDir, "deployed-addresses.json"),
      JSON.stringify(contracts, null, 2)
    );
    
    console.log("   ✅ Contracts saved");
    
    console.log("\n✨ Deployment Complete!\n");
    console.log("📋 NEW CONTRACT ADDRESSES:");
    console.log("   TOKEN:", tokenAddress);
    console.log("   DAO:  ", daoAddress);
    console.log("\n⚠️  UPDATE these addresses in src/Dao.jsx!");
    
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    process.exit(1);
  }
}

main().then(() => {
  console.log("\n✅ Done!");
  process.exit(0);
}).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
