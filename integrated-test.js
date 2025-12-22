const hre = require("hardhat");
const { ethers } = hre;
const fs = require("fs");

async function main() {
  console.log("🚀 STARTING COMPLETE TEST FLOW...\n");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log(`📝 Using account: ${deployer.address}\n`);
  
  // ============ STEP 1: DEPLOY OR GET EXISTING CONTRACTS ============
  console.log("=" .repeat(50));
  console.log("STEP 1: CONTRACT DEPLOYMENT");
  console.log("=" .repeat(50));
  
  let tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  let daoAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  
  const TOKEN_ABI = [
    "function balanceOf(address account) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function mint(address to, uint256 amount) external"
  ];
  
  const DAO_ABI = [
    "function vote(uint256 _proposalId, uint256 _votes, uint8 _choice) external",
    "function getProposal(uint256 _proposalId) view returns (uint256, string memory, string memory, uint256, uint256, bool, uint256, uint256, uint256)",
    "function calculateVoteCost(uint256 _votes) view returns (uint256)",
    "function createProposal(string memory _title, string memory _description) external",
    "function proposalCount() view returns (uint256)"
  ];
  
  let token = new ethers.Contract(tokenAddress, TOKEN_ABI, deployer);
  let dao = new ethers.Contract(daoAddress, DAO_ABI, deployer);
  
  // Check if contracts exist by trying to call them
  let contractsExist = false;
  try {
    const count = await dao.proposalCount();
    console.log(`✅ Existing DAO contract found (${daoAddress})`);
    console.log(`   Proposals: ${count}`);
    contractsExist = true;
  } catch (e) {
    console.log(`⚠️  Could not connect to existing contracts`);
    console.log(`   Deploying new contracts...`);
    
    try {
      // Deploy Token
      console.log(`\n📦 Deploying CampusToken...`);
      const CampusToken = await hre.ethers.getContractFactory("CampusToken");
      token = await CampusToken.deploy();
      await token.waitForDeployment();
      tokenAddress = await token.getAddress();
      console.log(`   ✅ Token deployed to: ${tokenAddress}`);
      
      // Mint some tokens for testing
      console.log(`\n💰 Minting tokens...`);
      const mintTx = await token.mint(deployer.address, ethers.parseEther("10000"));
      await mintTx.wait();
      console.log(`   ✅ Minted 10000 ARC tokens`);
      
      // Deploy DAO
      console.log(`\n🏛️  Deploying ArcanaDAO...`);
      const ArcanaDAO = await hre.ethers.getContractFactory("ArcanaDAO");
      dao = await ArcanaDAO.deploy(tokenAddress);
      await dao.waitForDeployment();
      daoAddress = await dao.getAddress();
      console.log(`   ✅ DAO deployed to: ${daoAddress}`);
      
      contractsExist = true;
    } catch (deployError) {
      console.error(`❌ Deployment failed:`, deployError.message);
      return;
    }
  }
  
  // ============ STEP 2: VERIFY SETUP ============
  console.log(`\n${"=" .repeat(50)}`);
  console.log("STEP 2: VERIFY SETUP");
  console.log("=" .repeat(50));
  
  const balance = await token.balanceOf(deployer.address);
  console.log(`📊 Token Balance: ${ethers.formatEther(balance)} ARC`);
  
  if (balance === 0n) {
    console.log(`\n⚠️  No tokens! Attempting to mint...`);
    try {
      const mintTx = await token.mint(deployer.address, ethers.parseEther("10000"));
      await mintTx.wait();
      const newBalance = await token.balanceOf(deployer.address);
      console.log(`✅ Minted 10000 ARC, new balance: ${ethers.formatEther(newBalance)}`);
    } catch (mintError) {
      console.log(`❌ Mint failed:`, mintError.message);
      return;
    }
  }
  
  // ============ STEP 3: CREATE PROPOSAL ============
  console.log(`\n${"=" .repeat(50)}`);
  console.log("STEP 3: PROPOSAL");
  console.log("=" .repeat(50));
  
  let proposalId = 1;
  try {
    const proposal = await dao.getProposal(1);
    console.log(`✅ Proposal 1 exists: "${proposal[1]}"`);
  } catch (e) {
    console.log(`📝 Creating new proposal...`);
    try {
      const createTx = await dao.createProposal(
        "Test Governance Proposal",
        "Testing the quadratic voting mechanism"
      );
      const receipt = await createTx.wait();
      console.log(`✅ Proposal created!`);
      proposalId = 1;
    } catch (createError) {
      console.log(`❌ Proposal creation failed:`, createError.message);
      return;
    }
  }
  
  // ============ STEP 4: APPROVE TOKENS ============
  console.log(`\n${"=" .repeat(50)}`);
  console.log("STEP 4: APPROVE TOKENS FOR VOTING");
  console.log("=" .repeat(50));
  
  const voteCost = await dao.calculateVoteCost(1); // 1^2 = 1 token
  console.log(`🎫 Cost for 1 vote: ${ethers.formatEther(voteCost)} ARC`);
  
  const currentAllowance = await token.allowance(deployer.address, daoAddress);
  console.log(`📋 Current allowance: ${ethers.formatEther(currentAllowance)} ARC`);
  
  if (currentAllowance < voteCost) {
    console.log(`\n❌ Insufficient allowance, approving tokens...`);
    try {
      const approveAmount = ethers.parseEther("10000");
      const approveTx = await token.approve(daoAddress, approveAmount);
      const approveReceipt = await approveTx.wait();
      const newAllowance = await token.allowance(deployer.address, daoAddress);
      console.log(`✅ Approved ${ethers.formatEther(approveAmount)} ARC`);
      console.log(`   TX: ${approveTx.hash}`);
    } catch (approveError) {
      console.log(`❌ Approval failed:`, approveError.message);
      if (approveError.data) {
        console.log(`   Raw error: ${approveError.data}`);
      }
      return;
    }
  } else {
    console.log(`✅ Already approved, skipping...`);
  }
  
  // ============ STEP 5: VOTE ============
  console.log(`\n${"=" .repeat(50)}`);
  console.log("STEP 5: CASTING VOTE");
  console.log("=" .repeat(50));
  
  try {
    console.log(`🗳️  Voting on proposal ${proposalId}...`);
    const voteTx = await dao.vote(proposalId, 1, 1); // 1 vote, choice=yes
    console.log(`📤 TX sent: ${voteTx.hash}`);
    
    const voteReceipt = await voteTx.wait();
    console.log(`✅ VOTE SUCCESSFUL!`);
    console.log(`   Block: ${voteReceipt.blockNumber}`);
    console.log(`   Gas used: ${voteReceipt.gasUsed}`);
    console.log(`\n🎉 VOTING TEST COMPLETED SUCCESSFULLY!`);
    
  } catch (voteError) {
    console.log(`❌ VOTE FAILED:`);
    console.log(`   Error: ${voteError.message}`);
    
    if (voteError.data) {
      console.log(`   Raw data: ${voteError.data}`);
    }
    
    if (voteError.reason) {
      console.log(`   Reason: ${voteError.reason}`);
    }
    
    // Additional debugging
    console.log(`\n🔍 DEBUGGING INFO:`);
    try {
      const balance2 = await token.balanceOf(deployer.address);
      const allowance2 = await token.allowance(deployer.address, daoAddress);
      const proposal = await dao.getProposal(proposalId);
      const blockData = await hre.ethers.provider.getBlock('latest');
      
      console.log(`   Balance: ${ethers.formatEther(balance2)} ARC`);
      console.log(`   Allowance: ${ethers.formatEther(allowance2)} ARC`);
      console.log(`   Vote cost: ${ethers.formatEther(voteCost)} ARC`);
      console.log(`   Current time: ${blockData.timestamp}`);
      console.log(`   Deadline: ${proposal[4]}`);
      console.log(`   Voting active: ${blockData.timestamp <= Number(proposal[4])}`);
      console.log(`   Executed: ${proposal[5]}`);
    } catch (debugError) {
      console.log(`   Error getting debug info:`, debugError.message);
    }
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
