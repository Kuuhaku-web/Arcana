const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying ArcanaDAO with Quadratic Voting...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  // Token contract address (dari deployment sebelumnya)
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  // Deploy ArcanaDAO
  const ArcanaDAO = await hre.ethers.getContractFactory("ArcanaDAO");
  const dao = await ArcanaDAO.deploy(tokenAddress);
  
  await dao.waitForDeployment();
  const daoAddress = await dao.getAddress();
  
  console.log("\n✅ ArcanaDAO deployed to:", daoAddress);
  
  // Save contract info
  const contractsDir = path.join(__dirname, "../src/contracts");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }
  
  const daoData = {
    address: daoAddress,
    tokenAddress: tokenAddress,
    name: "ArcanaDAO",
    votingType: "Quadratic Voting",
    votingDuration: "7 days",
    deployedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(
    path.join(contractsDir, "ArcanaDAO.json"),
    JSON.stringify({
      address: daoAddress,
      tokenAddress: tokenAddress,
      name: "ArcanaDAO",
      deployedAt: new Date().toISOString()
    }, null, 2)
  );
  
  console.log("💾 DAO contract info saved to src/contracts/");
  console.log("\n📋 Contract Information:");
  console.log("   - DAO Address:", daoAddress);
  console.log("   - Token Address:", tokenAddress);
  console.log("   - Voting Type: Quadratic Voting");
  console.log("   - Voting Duration: 7 days");
  console.log("\n✨ Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
