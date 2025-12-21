const hre = require("hardhat");

async function checkBalance() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const deployerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  
  // Load contract
  const CampusToken = await hre.ethers.getContractFactory("CampusToken");
  const token = CampusToken.attach(contractAddress);
  
  // Check balance
  const balance = await token.balanceOf(deployerAddress);
  const totalSupply = await token.totalSupply();
  const name = await token.name();
  const symbol = await token.symbol();
  const decimals = await token.decimals();
  
  console.log("📊 Token Information:");
  console.log("   Name:", name);
  console.log("   Symbol:", symbol);
  console.log("   Decimals:", decimals.toString());
  console.log("   Contract Address:", contractAddress);
  console.log("\n💰 Balance Information:");
  console.log("   Deployer Address:", deployerAddress);
  console.log("   Balance (wei):", balance.toString());
  console.log("   Balance (tokens):", hre.ethers.formatEther(balance), symbol);
  console.log("   Total Supply:", hre.ethers.formatEther(totalSupply), symbol);
}

checkBalance()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
