import { ethers } from "ethers";
import ArcanaDAOABI from "../contracts/ArcanaDAO.json";

// Simple ERC20 ABI untuk token functions yang penting
const TOKEN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)"
];

// Extract DAO ABI
const DAO_ABI = ArcanaDAOABI.abi;

export const QuadraticVotingUtil = {
  /**
   * Calculate cost berdasarkan quadratic voting
   * Cost = votes^2
   */
  calculateVoteCost: (votes) => {
    return votes * votes;
  },

  /**
   * Get DAO contract instance
   */
  getDaoContract: (daoAddress, signer) => {
    return new ethers.Contract(daoAddress, DAO_ABI, signer);
  },

  /**
   * Get Token contract instance
   */
  getTokenContract: (tokenAddress, signer) => {
    return new ethers.Contract(tokenAddress, TOKEN_ABI, signer);
  },

  /**
   * Cast vote dengan quadratic voting
   * @param {string} daoAddress - Address DAO
   * @param {string} tokenAddress - Address Token
   * @param {object} signer - ethers signer
   * @param {number} proposalId - ID proposal
   * @param {number} votes - Jumlah votes (akan dikuadratkan)
   * @param {number} choice - 1: yes, 2: no, 3: abstain
   */
  castVote: async (daoAddress, tokenAddress, signer, proposalId, votes, choice) => {
    try {
      console.log("🔄 Starting vote process...");
      console.log(`  DAO: ${daoAddress}`);
      console.log(`  Token: ${tokenAddress}`);
      console.log(`  Proposal: ${proposalId}, Votes: ${votes}, Choice: ${choice}`);

      const daoContract = new ethers.Contract(daoAddress, DAO_ABI, signer);
      const tokenContract = new ethers.Contract(tokenAddress, TOKEN_ABI, signer);

      // Calculate cost
      const voteCost = QuadraticVotingUtil.calculateVoteCost(votes);
      const voteCostWei = ethers.parseEther(voteCost.toString());
      console.log(`  Vote Cost: ${voteCost} ARC (${voteCostWei} wei)`);

      // Check balance
      const balance = await tokenContract.balanceOf(await signer.getAddress());
      console.log(`  Balance: ${ethers.formatEther(balance)} ARC`);
      if (balance < voteCostWei) {
        throw new Error(`Insufficient balance. Need ${voteCost} ARC, have ${ethers.formatEther(balance)} ARC`);
      }

      // Approve tokens before voting
      // Approve max possible cost (100 votes = 10,000 ARC)
      console.log("  ✏️ Setting up token approval...");
      try {
        const approveAmount = ethers.parseEther("10000"); // Max vote cost: 100^2
        const approveTx = await tokenContract.approve(daoAddress, approveAmount);
        console.log(`  Approve TX: ${approveTx.hash}`);
        await approveTx.wait();
        console.log(`  ✅ Approved 10,000 ARC`);
      } catch (approveError) {
        console.error("  ❌ Approval Error:", approveError.message);
        throw new Error(`Token approval failed: ${approveError.message}`);
      }

      // Cast vote
      console.log(`  🗳️ Casting ${votes} votes on proposal ${proposalId}...`);
      const voteTx = await daoContract.vote(proposalId, votes, choice);
      console.log(`  Vote TX: ${voteTx.hash}`);
      const receipt = await voteTx.wait();
      console.log(`  ✅ Vote confirmed in block ${receipt.blockNumber}`);

      return {
        success: true,
        txHash: voteTx.hash,
        voteCost: voteCost,
        message: `Vote cast successfully! Cost: ${voteCost} ARC`
      };
    } catch (error) {
      console.error("❌ Vote Error:", error);
      return {
        success: false,
        error: error.message || "Failed to cast vote"
      };
    }
  },

  /**
   * Get proposal details
   */
  getProposal: async (daoAddress, provider, proposalId) => {
    try {
      const daoContract = new ethers.Contract(daoAddress, DAO_ABI, provider);
      const proposal = await daoContract.getProposal(proposalId);
      
      return {
        id: proposal.id,
        title: proposal.title,
        description: proposal.description,
        createdAt: new Date(Number(proposal.createdAt) * 1000),
        votingDeadline: new Date(Number(proposal.votingDeadline) * 1000),
        executed: proposal.executed,
        yesVotes: Number(proposal.yesVotes),
        noVotes: Number(proposal.noVotes),
        abstainVotes: Number(proposal.abstainVotes),
        totalVotes: Number(proposal.yesVotes) + Number(proposal.noVotes) + Number(proposal.abstainVotes)
      };
    } catch (error) {
      return null;
    }
  },

  /**
   * Get all proposals
   */
  getAllProposals: async (daoAddress, provider) => {
    try {
      const daoContract = new ethers.Contract(daoAddress, DAO_ABI, provider);
      const totalProposals = await daoContract.getTotalProposals();
      
      const proposals = [];
      for (let i = 1; i <= totalProposals; i++) {
        const proposal = await daoContract.getProposal(i);
        proposals.push({
          id: Number(proposal.id),
          title: proposal.title,
          description: proposal.description,
          createdAt: new Date(Number(proposal.createdAt) * 1000),
          votingDeadline: new Date(Number(proposal.votingDeadline) * 1000),
          executed: proposal.executed,
          yesVotes: Number(proposal.yesVotes),
          noVotes: Number(proposal.noVotes),
          abstainVotes: Number(proposal.abstainVotes),
          totalVotes: Number(proposal.yesVotes) + Number(proposal.noVotes) + Number(proposal.abstainVotes)
        });
      }
      
      return proposals;
    } catch (error) {
      // Silent fail - don't log blockchain errors
      return [];
    }
  },

  /**
   * Check if voting is active
   */
  isVotingActive: async (daoAddress, provider, proposalId) => {
    try {
      const daoContract = new ethers.Contract(daoAddress, DAO_ABI, provider);
      return await daoContract.isVotingActive(proposalId);
    } catch (error) {
      return false;
    }
  },

  /**
   * Get all votes untuk proposal
   */
  getProposalVotes: async (daoAddress, provider, proposalId) => {
    try {
      const daoContract = new ethers.Contract(daoAddress, DAO_ABI, provider);
      const votes = await daoContract.getProposalVotes(proposalId);
      
      return votes.map(vote => ({
        voter: vote.voter,
        choice: vote.choice,
        tokensSpent: Number(vote.tokensSpent),
        choiceName: vote.choice === 1 ? "Yes" : vote.choice === 2 ? "No" : "Abstain"
      }));
    } catch (error) {
      return [];
    }
  }
};

export default QuadraticVotingUtil;
