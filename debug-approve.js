const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const DAO_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  
  const [deployer] = await hre.ethers.getSigners();
  
  const TOKEN_ABI = [
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)"
  ];
  
  const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, deployer);
  
  console.log("🧪 Testing direct approve...\n");
  
  const amount = ethers.parseEther("2500"); // 2500 ARC
  console.log(`Approving ${ethers.formatEther(amount)} tokens to DAO...`);
  
  try {
    const tx = await token.approve(DAO_ADDRESS, amount);
    console.log(`TX: ${tx.hash}`);
    const receipt = await tx.wait();
    
    if (receipt.status === 1) {
      console.log(`✅ Approved successfully!\n`);
      
      const allowance = await token.allowance(deployer.address, DAO_ADDRESS);
      console.log(`Allowance: ${ethers.formatEther(allowance)}`);
    } else {
      console.log(`❌ Transaction failed!`);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Data:", error.data);
  }
}

main().catch(console.error);
