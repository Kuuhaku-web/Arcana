const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting deployment...");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  // Get account balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy CampusToken with initial supply
  const initialSupply = 1000000; // 1 juta token
  console.log(`\n🎓 Deploying CampusToken with ${initialSupply} initial supply...`);

  const CampusToken = await hre.ethers.getContractFactory("CampusToken");
  const campusToken = await CampusToken.deploy(initialSupply);

  await campusToken.waitForDeployment();
  const contractAddress = await campusToken.getAddress();

  console.log("✅ CampusToken deployed to:", contractAddress);

  // Get token info
  const name = await campusToken.name();
  const symbol = await campusToken.symbol();
  const totalSupply = await campusToken.totalSupply();
  const decimals = await campusToken.decimals();

  console.log("\n📊 Token Information:");
  console.log("   Name:", name);
  console.log("   Symbol:", symbol);
  console.log("   Decimals:", decimals.toString());
  console.log("   Total Supply:", hre.ethers.formatEther(totalSupply), symbol);
  console.log("   Owner:", await campusToken.owner());

  // Save contract address and ABI to file
  const contractData = {
    address: contractAddress,
    name: name,
    symbol: symbol,
    decimals: decimals.toString(),
    totalSupply: hre.ethers.formatEther(totalSupply),
    owner: deployer.address,
    network: hre.network.name,
    deployedAt: new Date().toISOString()
  };

  // Create src/contracts directory if not exists
  const contractsDir = path.join(__dirname, "../src/contracts");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Save contract info
  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify(contractData, null, 2)
  );

  // Copy ABI
  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/CampusToken.sol/CampusToken.json"
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  
  fs.writeFileSync(
    path.join(contractsDir, "CampusToken.json"),
    JSON.stringify({
      abi: artifact.abi,
      bytecode: artifact.bytecode
    }, null, 2)
  );

  console.log("\n💾 Contract info saved to src/contracts/");
  console.log("\n✨ Deployment completed successfully!");
  console.log("\n📝 Next steps:");
  console.log("   1. Copy contract address:", contractAddress);
  console.log("   2. Add to MetaMask: Network = Localhost, Chain ID = 1337");
  console.log("   3. Import token in MetaMask using contract address");
  console.log("   4. Start your React app and interact with the contract");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });