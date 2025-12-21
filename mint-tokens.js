const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  // First MetaMask test account (from Hardhat)
  // This is Account #0 from "npx hardhat node" output
  const metamaskAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  
  const TOKEN_ABI = [
    "function mint(address to, uint256 amount, string memory reason) returns (bool)",
    "function balanceOf(address account) view returns (uint256)"
  ];
  
  const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, deployer);
  
  console.log("🪙 Minting tokens to MetaMask account...");
  console.log(`Target address: ${metamaskAddress}`);
  
  const amountToMint = "10000"; // 10,000 tokens (DON'T use parseEther - mint function handles decimals)
  
  try {
    const tx = await token.mint(metamaskAddress, amountToMint, "Voting participation");
    console.log(`TX Hash: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`✅ Minted successfully in block ${receipt.blockNumber}`);
    
    // Check balance
    const balance = await token.balanceOf(metamaskAddress);
    console.log(`\nNew balance: ${ethers.formatEther(balance)} tokens`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main().catch(console.error);
