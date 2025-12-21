const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const DAO_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  
  const TOKEN_ABI = [
    "function approve(address spender, uint256 amount) returns (bool)",
    "function balanceOf(address account) view returns (uint256)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ];
  
  const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, deployer);
  
  console.log("🧪 Testing Approve Function...\n");
  
  const decimals = await token.decimals();
  console.log(`Token decimals: ${decimals}`);
  
  const balance = await token.balanceOf(deployer.address);
  console.log(`Deployer balance: ${ethers.formatEther(balance)} tokens`);
  
  // Test small approval first
  const smallAmount = ethers.parseEther("10");
  console.log(`\n📝 Testing approval of 10 tokens (${smallAmount} wei)...`);
  
  try {
    const tx = await token.approve(DAO_ADDRESS, smallAmount);
    console.log(`TX Hash: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`✅ Approval successful in block ${receipt.blockNumber}`);
    
    const allowance = await token.allowance(deployer.address, DAO_ADDRESS);
    console.log(`Allowance: ${ethers.formatEther(allowance)} tokens`);
  } catch (error) {
    console.error("❌ Approve failed:", error.message);
    if (error.data) {
      console.error("Error data:", error.data);
    }
  }
}

main().catch(console.error);
