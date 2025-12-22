const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const DAO_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  
  const TOKEN_ABI = [
    "function balanceOf(address account) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function mint(address to, uint256 amount, string memory reason) external"
  ];
  
  const DAO_ABI = [
    "function vote(uint256 _proposalId, uint256 _votes, uint8 _choice) external",
    "function getProposal(uint256 _proposalId) view returns (uint256, string memory, string memory, uint256, uint256, bool, uint256, uint256, uint256)",
    "function calculateVoteCost(uint256 _votes) view returns (uint256)",
    "function createProposal(string memory _title, string memory _description) external"
  ];
  
  const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, deployer);
  const dao = new ethers.Contract(DAO_ADDRESS, DAO_ABI, deployer);
  
  console.log("🧪 Testing complete vote flow...\n");
  console.log(`📝 Using account: ${deployer.address}\n`);
  
  // 1. Check balance
  let balance = await token.balanceOf(deployer.address);
  console.log(`1️⃣ Initial balance: ${ethers.formatEther(balance)} ARC`);
  
  // 2. Mint tokens if needed
  if (balance === 0n) {
    console.log(`   Minting 10000 ARC tokens...`);
    try {
      const mintTx = await token.mint(deployer.address, ethers.parseEther("10000"), "Testing voting");
      await mintTx.wait();
      balance = await token.balanceOf(deployer.address);
      console.log(`   ✅ Minted! New balance: ${ethers.formatEther(balance)} ARC`);
    } catch (mintError) {
      console.log(`   ❌ Mint failed:`, mintError.message);
      return;
    }
  }
  
  // 3. Check/create proposal
  console.log(`\n2️⃣ Checking proposals...`);
  try {
    const proposal = await dao.getProposal(1);
    console.log(`   ✅ Proposal 1 exists: "${proposal[1]}"`);
    console.log(`   Deadline: ${new Date(Number(proposal[4]) * 1000)}`);
  } catch (e) {
    console.log(`   Creating new proposal...`);
    try {
      const createTx = await dao.createProposal(
        "Test Proposal",
        "Testing quadratic voting mechanism"
      );
      await createTx.wait();
      console.log(`   ✅ Proposal created!`);
    } catch (createError) {
      console.log(`   ❌ Error:`, createError.message);
      return;
    }
  }
  
  // 4. Calculate vote cost
  const voteCost = await dao.calculateVoteCost(1); // 1 vote = 1^2 = 1 token
  console.log(`\n3️⃣ Vote cost for 1 vote: ${ethers.formatEther(voteCost)} ARC`);
  
  // 5. Check and set approval
  console.log(`\n4️⃣ Managing token approvals...`);
  let allowance = await token.allowance(deployer.address, DAO_ADDRESS);
  console.log(`   Current allowance: ${ethers.formatEther(allowance)} ARC`);
  
  if (allowance < voteCost) {
    console.log(`   Approving DAO to spend tokens...`);
    try {
      const approveTx = await token.approve(DAO_ADDRESS, ethers.parseEther("10000"));
      const approveReceipt = await approveTx.wait();
      allowance = await token.allowance(deployer.address, DAO_ADDRESS);
      console.log(`   ✅ Approved: ${approveTx.hash}`);
      console.log(`   New allowance: ${ethers.formatEther(allowance)} ARC`);
    } catch (approveError) {
      console.log(`   ❌ Approval failed:`, approveError.message);
      if (approveError.data) console.log(`   Error data:`, approveError.data);
      return;
    }
  } else {
    console.log(`   ✅ Already approved!`);
  }
  
  // 6. Try voting
  console.log(`\n5️⃣ Casting vote...`);
  try {
    console.log(`   Voting on proposal 1 with 1 vote (choice=1 for yes)...`);
    const voteTx = await dao.vote(1, 1, 1); // proposalId=1, votes=1, choice=1
    console.log(`   TX sent: ${voteTx.hash}`);
    
    const receipt = await voteTx.wait();
    console.log(`   ✅ VOTE SUCCESSFUL!`);
    console.log(`   Block: ${receipt.blockNumber}`);
    console.log(`   Gas: ${receipt.gasUsed}`);
    console.log(`\n🎉 VOTING TEST PASSED!`);
  } catch (error) {
    console.log(`   ❌ VOTE FAILED!`);
    console.log(`   Error: ${error.message}`);
    
    if (error.data) {
      console.log(`   Raw error data: ${error.data}`);
    }
    
    if (error.reason) {
      console.log(`   Reason: ${error.reason}`);
    }
    
    // Debug info
    console.log(`\n   🔍 Debug info:`);
    try {
      const balance2 = await token.balanceOf(deployer.address);
      const allowance2 = await token.allowance(deployer.address, DAO_ADDRESS);
      console.log(`   - Balance: ${ethers.formatEther(balance2)} ARC`);
      console.log(`   - Allowance: ${ethers.formatEther(allowance2)} ARC`);
      console.log(`   - Vote cost: ${ethers.formatEther(voteCost)} ARC`);
    } catch (debugErr) {
      console.log(`   Could not get debug info`);
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
