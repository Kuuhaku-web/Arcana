const hre = require("hardhat");
const { expect } = require("chai");
const { ethers } = hre;

describe("Arcana DAO - Voting Tests", function () {
  let token;
  let dao;
  let deployer;

  before(async function () {
    [deployer] = await ethers.getSigners();
    
    // Deploy CampusToken
    const CampusToken = await ethers.getContractFactory("CampusToken");
    token = await CampusToken.deploy(1000); // 1000 tokens initial supply
    await token.waitForDeployment();
    console.log(`\n📦 Token deployed to: ${await token.getAddress()}`);
    
    // Deploy ArcanaDAO
    const ArcanaDAO = await ethers.getContractFactory("ArcanaDAO");
    dao = await ArcanaDAO.deploy(await token.getAddress());
    await dao.waitForDeployment();
    console.log(`🏛️  DAO deployed to: ${await dao.getAddress()}\n`);
  });

  describe("Vote Flow", function () {
    it("Step 1: Should have initial token balance", async function () {
      const balance = await token.balanceOf(deployer.address);
      console.log(`   Balance: ${ethers.formatEther(balance)} ARC`);
      expect(balance).to.be.gt(0n);
    });

    it("Step 2: Should create a proposal", async function () {
      const countBefore = await dao.proposalCount();
      console.log(`   Proposals before: ${countBefore}`);
      
      const createTx = await dao.createProposal(
        "Test Governance Proposal",
        "Testing the quadratic voting mechanism"
      );
      await createTx.wait();
      
      const countAfter = await dao.proposalCount();
      console.log(`   Proposals after: ${countAfter}`);
      expect(countAfter).to.equal(countBefore + 1n);
    });

    it("Step 3: Should calculate vote cost correctly", async function () {
      const cost1 = await dao.calculateVoteCost(1);
      const cost10 = await dao.calculateVoteCost(10);
      console.log(`   Cost for 1 vote: ${cost1} tokens (expected 1)`);
      console.log(`   Cost for 10 votes: ${cost10} tokens (expected 100)`);
      expect(cost1).to.equal(1n); // 1^2 = 1
      expect(cost10).to.equal(100n); // 10^2 = 100
    });

    it("Step 4: Should approve DAO to spend tokens", async function () {
      const daoAddress = await dao.getAddress();
      const allowanceBefore = await token.allowance(deployer.address, daoAddress);
      console.log(`   Allowance before: ${ethers.formatEther(allowanceBefore)} ARC`);
      
      const approveTx = await token.approve(daoAddress, ethers.parseEther("10000"));
      await approveTx.wait();
      
      const allowanceAfter = await token.allowance(deployer.address, daoAddress);
      console.log(`   Allowance after: ${ethers.formatEther(allowanceAfter)} ARC`);
      expect(allowanceAfter).to.equal(ethers.parseEther("10000"));
    });

    it("Step 5: Should successfully vote on proposal", async function () {
      const proposalBefore = await dao.getProposal(1);
      console.log(`   Proposal before vote:`);
      console.log(`     - Yes votes: ${proposalBefore[6]}`);
      console.log(`     - No votes: ${proposalBefore[7]}`);
      
      const voteTx = await dao.vote(1, 1, 1); // proposalId=1, votes=1, choice=1(yes)
      const receipt = await voteTx.wait();
      console.log(`   TX: ${voteTx.hash}`);
      console.log(`   Block: ${receipt.blockNumber}`);
      expect(receipt.status).to.equal(1); // Success
      console.log(`   ✅ VOTE SUCCESSFUL!`);
    });

    it("Step 6: Should verify vote was recorded", async function () {
      const proposal = await dao.getProposal(1);
      console.log(`   Proposal: "${proposal[1]}"`);
      console.log(`   Yes votes: ${proposal[6]}`);
      console.log(`   No votes: ${proposal[7]}`);
      console.log(`   Abstain votes: ${proposal[8]}`);
      expect(proposal[6]).to.equal(1n); // Exactly 1 yes vote from previous step
    });
  });
});
