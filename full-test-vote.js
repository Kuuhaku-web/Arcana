const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const DAO_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  
  const TOKEN_ABI = [
    "function balanceOf(address account) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function increaseAllowance(address spender, uint256 addedValue) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ];
  
  const DAO_ABI = [
    "function vote(uint256 _proposalId, uint256 _votes, uint8 _choice) external",
    "function getProposal(uint256 _proposalId) view returns (uint256, string memory, string memory, uint256, uint256, bool, uint256, uint256, uint256)"
  ];
  
  const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, deployer);
  const dao = new ethers.Contract(DAO_ADDRESS, DAO_ABI, deployer);
  
  console.log("🧪 Testing vote flow...\n");
  
  // 1. Check balance
  const balance = await token.balanceOf(deployer.address);
  console.log(`1️⃣ Balance: ${ethers.formatEther(balance)} ARC`);
  
  // 2. Check proposal exists
  try {
    const proposal = await dao.getProposal(1);
    console.log(`2️⃣ Proposal 1 exists: "${proposal[1]}"`);
    console.log(`   Deadline: ${new Date(Number(proposal[4]) * 1000)}`);
  } catch (e) {
    console.log(`2️⃣ Error getting proposal:`, e.message);
    return;
  }
  
  // 3. Approve
  const voteCost = 1n; // 1 ARC
  const approveTx = await token.approve(DAO_ADDRESS, ethers.parseEther(voteCost.toString()));
  const approveReceipt = await approveTx.wait();
  console.log(`3️⃣ Approved: ${approveTx.hash}`);
  
  // 4. Check allowance
  const allowance = await token.allowance(deployer.address, DAO_ADDRESS);
  console.log(`4️⃣ Allowance: ${ethers.formatEther(allowance)} ARC`);
  
  // 5. Try voting
  console.log(`5️⃣ Attempting vote...`);
  try {
    const voteTx = await dao.vote(1, 1, 1);
    console.log(`   TX: ${voteTx.hash}`);
    const receipt = await voteTx.wait();
    console.log(`   ✅ Vote successful!`);
  } catch (error) {
    console.log(`   ❌ Vote failed:`, error.message);
    if (error.data) console.log(`   Data:`, error.data);
  }
}

main().catch(console.error);
