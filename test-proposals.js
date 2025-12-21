const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  console.log("🔍 Checking deployed contracts...\n");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Connected account:", deployer.address);
  
  const DAO_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  // Load ABIs
  const DAO_ABI = [
    "function getTotalProposals() view returns (uint256)",
    "function getProposal(uint256 _proposalId) view returns (uint256 id, string memory title, string memory description, uint256 createdAt, uint256 votingDeadline, bool executed, uint256 yesVotes, uint256 noVotes, uint256 abstainVotes)",
    "function calculateVoteCost(uint256 _votes) pure returns (uint256)"
  ];
  
  const TOKEN_ABI = [
    "function balanceOf(address account) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)"
  ];
  
  const dao = new ethers.Contract(DAO_ADDRESS, DAO_ABI, deployer);
  const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, deployer);
  
  // Check total proposals
  console.log("\n📋 Checking Proposals:");
  const totalProposals = await dao.getTotalProposals();
  console.log(`Total proposals: ${totalProposals}`);
  
  // Get each proposal
  for (let i = 1; i <= totalProposals; i++) {
    try {
      const proposal = await dao.getProposal(i);
      console.log(`\n✅ Proposal ${i}:`);
      console.log(`   Title: ${proposal.title}`);
      console.log(`   Description: ${proposal.description}`);
      console.log(`   Votes - Yes: ${proposal.yesVotes}, No: ${proposal.noVotes}, Abstain: ${proposal.abstainVotes}`);
      console.log(`   Voting Active: ${Date.now() < Number(proposal.votingDeadline) * 1000}`);
    } catch (error) {
      console.log(`❌ Error getting proposal ${i}:`, error.message);
    }
  }
  
  // Check token balance
  console.log("\n💰 Token Info:");
  const balance = await token.balanceOf(deployer.address);
  console.log(`Balance: ${ethers.formatEther(balance)} tokens`);
  
  // Test vote cost calculation
  console.log("\n📐 Vote Cost Calculation:");
  const costs = [1, 2, 3, 4, 5];
  for (const votes of costs) {
    const cost = await dao.calculateVoteCost(votes);
    console.log(`  ${votes} votes = ${cost} tokens cost`);
  }
}

main().catch(console.error);
