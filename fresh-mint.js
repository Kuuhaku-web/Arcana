const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  // MetaMask Account #0
  const metamaskAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  
  const TOKEN_ABI = [
    "function mint(address to, uint256 amount, string memory reason) returns (bool)",
    "function balanceOf(address account) view returns (uint256)"
  ];
  
  const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, deployer);
  
  console.log("🪙 Minting 1,000 ARC tokens to MetaMask...");
  console.log(`Target: ${metamaskAddress}\n`);
  
  try {
    // Mint exactly 1,000 ARC (mint function will multiply by 10^18)
    const tx = await token.mint(metamaskAddress, "1000", "Voting participation");
    console.log(`TX: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`✅ Success!\n`);
    
    // Check balance
    const balance = await token.balanceOf(metamaskAddress);
    console.log(`New balance: ${ethers.formatEther(balance)} ARC`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main().catch(console.error);
