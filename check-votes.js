const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const DAO_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  
  const DAO_ABI = [
    "function getProposal(uint256 _proposalId) view returns (uint256, string memory, string memory, uint256, uint256, bool, uint256, uint256, uint256)"
  ];
  
  const provider = new ethers.JsonRpcProvider("http://localhost:8545");
  const dao = new ethers.Contract(DAO_ADDRESS, DAO_ABI, provider);
  
  console.log("📊 Checking Proposal Vote Counts:\n");
  
  for (let i = 1; i <= 3; i++) {
    const proposal = await dao.getProposal(i);
    console.log(`Proposal ${i}: "${proposal[1]}"`);
    console.log(`  Yes votes: ${proposal[6]}`);
    console.log(`  No votes: ${proposal[7]}`);
    console.log(`  Abstain votes: ${proposal[8]}`);
    console.log();
  }
}

main().catch(console.error);
