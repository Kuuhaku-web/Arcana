const hre = require("hardhat");

async function mintTokens() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const recipientAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Account yang ingin menerima token
  const amount = 1000000; // 1 juta token
  
  const [owner] = await hre.ethers.getSigners();
  console.log("🔑 Using account:", owner.address);
  
  // Load contract
  const CampusToken = await hre.ethers.getContractFactory("CampusToken");
  const token = CampusToken.attach(contractAddress);
  
  // Check current balance
  const balanceBefore = await token.balanceOf(recipientAddress);
  console.log("\n📊 Balance sebelum mint:");
  console.log("   Address:", recipientAddress);
  console.log("   Balance:", hre.ethers.formatEther(balanceBefore), "ARC");
  
  // Mint tokens
  console.log("\n⏳ Minting", amount, "ARC tokens...");
  const tx = await token.mint(recipientAddress, amount, "Initial allocation for user");
  await tx.wait();
  
  // Check balance after
  const balanceAfter = await token.balanceOf(recipientAddress);
  console.log("\n✅ Mint berhasil!");
  console.log("   Balance setelah mint:", hre.ethers.formatEther(balanceAfter), "ARC");
  console.log("   Transaction hash:", tx.hash);
}

mintTokens()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
