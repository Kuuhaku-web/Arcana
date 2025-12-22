import { ethers } from "ethers";
import ArcanaDAOABI from "../contracts/ArcanaDAO.json";
import CampusTokenABI from "../contracts/CampusToken.json";
import contractAddress from "../contracts/contract-address.json";

// Use full ABI from contract
const TOKEN_ABI = CampusTokenABI.abi;
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
      // Validate and use correct addresses from config
      const finalDaoAddress = contractAddress.dao || daoAddress;
      const finalTokenAddress = contractAddress.token || tokenAddress;

      console.log("🔄 Starting vote process...");
      console.log(`  DAO: ${finalDaoAddress}`);
      console.log(`  Token: ${finalTokenAddress}`);
      console.log(`  Proposal: ${proposalId}, Votes: ${votes}, Choice: ${choice}`);

      const daoContract = new ethers.Contract(finalDaoAddress, DAO_ABI, signer);
      const tokenContract = new ethers.Contract(finalTokenAddress, TOKEN_ABI, signer);

      // Calculate cost (this is already in token units: 1^2=1, 2^2=4, etc)
      const voteCost = QuadraticVotingUtil.calculateVoteCost(votes);
      // Convert to wei format for token decimals (tokens have 18 decimals)
      const voteCostWei = ethers.parseEther(voteCost.toString());
      console.log(`  Vote Cost: ${voteCost} tokens = ${ethers.formatEther(voteCostWei)} ARC`);

      // Check balance
      const balance = await tokenContract.balanceOf(await signer.getAddress());
      console.log(`  Balance: ${ethers.formatEther(balance)} ARC`);
      if (balance < voteCostWei) {
        throw new Error(`Insufficient balance. Need ${voteCost} tokens (${ethers.formatEther(voteCostWei)} ARC), have ${ethers.formatEther(balance)} ARC`);
      }

      // Check current allowance before approving
      console.log("  ✏️ Checking token allowance...");
      const userAddress = await signer.getAddress();
      const currentAllowance = await tokenContract.allowance(userAddress, finalDaoAddress);
      console.log(`  Current allowance: ${ethers.formatEther(currentAllowance)} ARC`);
      
      // Only approve exact amount needed (no extra margin)
      const approveAmount = voteCostWei; // Exact amount only
      
      if (currentAllowance < approveAmount) {
        console.log("  ✏️ Setting up token approval...");
        try {
          console.log(`  Requesting approval for ${ethers.formatEther(approveAmount)} ARC...`);
          
          const approveTx = await tokenContract.approve(finalDaoAddress, approveAmount);
          console.log(`  Approve TX: ${approveTx.hash}`);
          const approveReceipt = await approveTx.wait();
          console.log(`  ✅ Approved!`);
          
          if (!approveReceipt || approveReceipt.status !== 1) {
            throw new Error("Approval transaction failed");
          }
        } catch (approveError) {
          console.error("  ❌ Approval Error:", approveError);
          throw new Error(`Token approval failed: ${approveError.message || approveError.reason || 'Unknown error'}`);
        }
      } else {
        console.log("  ✅ Allowance already sufficient, skipping approval");
      }

      // Cast vote
      console.log(`  🗳️ Casting ${votes} votes on proposal ${proposalId} (choice: ${choice})...`);
      let voteTx = null;
      try {
        voteTx = await daoContract.vote(BigInt(proposalId), BigInt(votes), BigInt(choice));
        console.log(`  Vote TX: ${voteTx.hash}`);
        const receipt = await voteTx.wait();
        if (!receipt || receipt.status !== 1) {
          throw new Error("Vote transaction failed");
        }
        console.log(`  ✅ Vote confirmed in block ${receipt.blockNumber}`);
        
        return {
          success: true,
          txHash: voteTx.hash,
          voteCost: voteCost,
          message: `Vote cast successfully! Cost: ${voteCost} ARC`
        };
      } catch (voteError) {
        console.error("  ❌ Vote Error:", voteError);
        // Try to extract error message
        let errorMsg = voteError.message || "Unknown error";
        if (voteError.reason) {
          errorMsg = voteError.reason;
        }
        if (voteError.data) {
          errorMsg = `Transaction reverted: ${voteError.data}`;
        }
        throw new Error(`Vote failed: ${errorMsg}`);
      }
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
