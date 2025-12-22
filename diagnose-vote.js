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
    "function decimals() view returns (uint8)",
    "function transferFrom(address from, address to, uint256 amount) returns (bool)"
  ];
  
  const DAO_ABI = [
    "function vote(uint256 _proposalId, uint256 _votes, uint8 _choice) external",
    "function getProposal(uint256 _proposalId) view returns (uint256, string memory, string memory, uint256, uint256, bool, uint256, uint256, uint256)",
    "function calculateVoteCost(uint256 _votes) view returns (uint256)",
    "function createProposal(string memory _title, string memory _description) external"
  ];
  
  const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, deployer);
  const dao = new ethers.Contract(DAO_ADDRESS, DAO_ABI, deployer);
  
  console.log("🔍 DIAGNOSING VOTE ISSUE...\n");
  
  // Step 1: Check balance
  const balance = await token.balanceOf(deployer.address);
  console.log(`1️⃣ Balance: ${ethers.formatEther(balance)} ARC`);
  
  // Step 2: Check proposals exist
  try {
    const proposal = await dao.getProposal(1);
    console.log(`2️⃣ Proposal 1 exists: "${proposal[1]}"`);
    console.log(`   Deadline: ${new Date(Number(proposal[4]) * 1000)}`);
  } catch (e) {
    console.log(`2️⃣ Error getting proposal:`, e.message);
    console.log("   Creating proposal instead...");
    try {
      const createTx = await dao.createProposal("Test Proposal", "Testing voting mechanism");
      await createTx.wait();
      console.log("   ✅ Proposal created!");
    } catch (createError) {
      console.log("   ❌ Error creating proposal:", createError.message);
      return;
    }
  }
  
  // Step 3: Calculate vote cost
  const voteCost = await dao.calculateVoteCost(1); // 1 vote = 1^2 = 1 token
  console.log(`\n3️⃣ Vote cost calculation:`);
  console.log(`   Cost for 1 vote: ${ethers.formatEther(voteCost)} ARC`);
  
  // Step 4: Check current allowance
  const currentAllowance = await token.allowance(deployer.address, DAO_ADDRESS);
  console.log(`\n4️⃣ Current allowance: ${ethers.formatEther(currentAllowance)} ARC`);
  
  // Step 5: Approve if needed
  if (currentAllowance < voteCost) {
    console.log(`\n5️⃣ Approving tokens...`);
    const approveAmount = ethers.parseEther("10000"); // Approve 10000 ARC
    try {
      const approveTx = await token.approve(DAO_ADDRESS, approveAmount);
      const approveReceipt = await approveTx.wait();
      console.log(`   ✅ Approved: ${approveTx.hash}`);
      
      const newAllowance = await token.allowance(deployer.address, DAO_ADDRESS);
      console.log(`   New allowance: ${ethers.formatEther(newAllowance)} ARC`);
    } catch (error) {
      console.log(`   ❌ Approval failed:`, error.message);
      if (error.data) console.log(`   Data:`, error.data);
      return;
    }
  } else {
    console.log(`\n5️⃣ Already approved, skipping...`);
  }
  
  // Step 6: Try voting with detailed error handling
  console.log(`\n6️⃣ Attempting vote...`);
  try {
    const voteTx = await dao.vote(1, 1, 1); // proposalId=1, votes=1, choice=1(yes)
    console.log(`   TX: ${voteTx.hash}`);
    const receipt = await voteTx.wait();
    console.log(`   ✅ Vote successful!`);
    console.log(`   Block: ${receipt.blockNumber}`);
    console.log(`   Gas used: ${receipt.gasUsed}`);
  } catch (error) {
    console.log(`   ❌ Vote failed:`);
    console.log(`   Message: ${error.message}`);
    
    if (error.data) {
      console.log(`   Raw data: ${error.data}`);
      
      // Try to decode error
      try {
        const iface = new ethers.Interface(DAO_ABI);
        const decoded = iface.parseError(error.data);
        console.log(`   Decoded error: ${decoded?.name || 'Unknown'}`);
        console.log(`   Args:`, decoded?.args || 'None');
      } catch (decodeError) {
        console.log(`   Could not decode error`);
      }
    }
    
    if (error.reason) {
      console.log(`   Reason: ${error.reason}`);
    }
    
    // Additional debugging
    console.log(`\n   🔍 DEBUG INFO:`);
    try {
      const balance2 = await token.balanceOf(deployer.address);
      const allowance2 = await token.allowance(deployer.address, DAO_ADDRESS);
      const proposal2 = await dao.getProposal(1);
      
      console.log(`   Balance: ${ethers.formatEther(balance2)} ARC`);
      console.log(`   Allowance: ${ethers.formatEther(allowance2)} ARC`);
      console.log(`   Proposal voting deadline: ${proposal2[4]}`);
      console.log(`   Current block time: ${(await hre.ethers.provider.getBlock('latest')).timestamp}`);
      console.log(`   Voting active: ${Number(proposal2[4]) > (await hre.ethers.provider.getBlock('latest')).timestamp}`);
    } catch (debugError) {
      console.log(`   Error getting debug info:`, debugError.message);
    }
  }
}

main().catch(console.error);
