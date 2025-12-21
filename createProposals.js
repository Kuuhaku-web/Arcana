const hre = require("hardhat");

async function main() {
  const DAO_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  
  const [owner] = await hre.ethers.getSigners();
  console.log("📝 Creating proposal with account:", owner.address);
  
  const ArcanaDAO = await hre.ethers.getContractFactory("ArcanaDAO");
  const dao = ArcanaDAO.attach(DAO_ADDRESS);
  
  // Create test proposals
  const proposals = [
    {
      title: "Increase Community Fund to 50% of Treasury",
      description: "Proposal to allocate 50% of DAO treasury to community grants and development funds."
    },
    {
      title: "Launch New Advanced DeFi Course",
      description: "Create and fund a new advanced DeFi strategies course with expert lecturers."
    },
    {
      title: "Implement Quadratic Voting Rewards",
      description: "Introduce reward system for active voting participants in governance."
    }
  ];
  
  for (const proposal of proposals) {
    console.log(`\n📋 Creating proposal: "${proposal.title}"`);
    const tx = await dao.createProposal(proposal.title, proposal.description);
    await tx.wait();
    console.log("✅ Proposal created successfully!");
  }
  
  // Get total proposals
  const total = await dao.getTotalProposals();
  console.log(`\n📊 Total proposals: ${total}`);
  
  // Get all proposals
  console.log("\n📜 All Proposals:");
  for (let i = 1; i <= total; i++) {
    const proposal = await dao.getProposal(i);
    console.log(`\nProposal #${i}:`);
    console.log(`  Title: ${proposal.title}`);
    console.log(`  Yes Votes: ${proposal.yesVotes}`);
    console.log(`  No Votes: ${proposal.noVotes}`);
    console.log(`  Abstain Votes: ${proposal.abstainVotes}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
