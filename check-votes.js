const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const DAO_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  
  const TOKEN_ABI = [
    "function balanceOf(address account) view returns (uint256)",
    "function allowance(address owner, address spender) view returns (uint256)"
  ];
  
  const DAO_ABI = [
    "function getProposal(uint256 _proposalId) view returns (uint256, string memory, string memory, uint256, uint256, bool, uint256, uint256, uint256)",
    "function proposalCount() view returns (uint256)",
    "function isVotingActive(uint256 _proposalId) view returns (bool)"
  ];
  
  const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, deployer);
  const dao = new ethers.Contract(DAO_ADDRESS, DAO_ABI, deployer);
  
  console.log("\n📊 VOTING STATUS CHECK");
  console.log("=" .repeat(50));
  console.log(`📝 Account: ${deployer.address}\n`);
  
  // Check balance
  const balance = await token.balanceOf(deployer.address);
  console.log(`💰 Token Balance: ${ethers.formatEther(balance)} ARC`);
  
  // Check allowance
  const allowance = await token.allowance(deployer.address, DAO_ADDRESS);
  console.log(`✅ DAO Allowance: ${ethers.formatEther(allowance)} ARC\n`);
  
  // Check proposals
  const count = await dao.proposalCount();
  console.log(`📋 Total Proposals: ${count}\n`);
  
  if (count > 0n) {
    for (let i = 1n; i <= count; i++) {
      const proposal = await dao.getProposal(i);
      const isActive = await dao.isVotingActive(i);
      
      console.log(`Proposal #${Number(i)}:`);
      console.log(`  Title: ${proposal[1]}`);
      console.log(`  Status: ${proposal[5] ? '✅ Executed' : (isActive ? '🗳️ Voting Active' : '❌ Voting Ended')}`);
      console.log(`  Deadline: ${new Date(Number(proposal[4]) * 1000).toLocaleString()}`);
      console.log(`  Vote Results:`);
      console.log(`    ✔ Yes votes:    ${Number(proposal[6])}`);
      console.log(`    ✘ No votes:     ${Number(proposal[7])}`);
      console.log(`    ⊙ Abstain:      ${Number(proposal[8])}`);
      
      const totalVotes = Number(proposal[6]) + Number(proposal[7]) + Number(proposal[8]);
      if (totalVotes > 0) {
        console.log(`    📊 Total:       ${totalVotes} votes`);
        const yesPercent = ((Number(proposal[6]) / totalVotes) * 100).toFixed(1);
        console.log(`    👍 Support:     ${yesPercent}%`);
      }
      console.log();
    }
  } else {
    console.log("⚠️ No proposals found.\n");
  }
  
  console.log("=" .repeat(50));
}

main().catch(console.error);
