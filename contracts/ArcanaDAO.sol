// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ArcanaDAO
 * @dev DAO dengan Quadratic Voting untuk Arcana Campus
 */
contract ArcanaDAO is Ownable {
    IERC20 public token; // Token ARC untuk voting
    
    // Proposal struktur
    struct Proposal {
        uint256 id;
        string title;
        string description;
        uint256 createdAt;
        uint256 votingDeadline;
        bool executed;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 abstainVotes;
    }
    
    // Vote struktur (untuk tracking quadratic voting)
    struct Vote {
        uint256 proposalId;
        address voter;
        uint8 choice; // 1: yes, 2: no, 3: abstain
        uint256 tokensSpent; // Token yang digunakan untuk voting (berdasarkan quadratic voting)
    }
    
    // Mapping
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => Vote[]) public votes;
    mapping(uint256 => mapping(address => uint256)) public voterTokensSpent; // Tracking token yang sudah dipakai voter
    mapping(address => uint256) public votingPower; // Voting power per address (untuk future staking rewards)
    
    uint256 public proposalCount = 0;
    uint256 public votingDuration = 7 days; // 7 hari voting
    
    // Events
    event ProposalCreated(uint256 indexed proposalId, string title, address indexed creator);
    event VoteCast(uint256 indexed proposalId, address indexed voter, uint8 choice, uint256 tokensSpent);
    event ProposalExecuted(uint256 indexed proposalId);
    
    constructor(address _tokenAddress) Ownable(msg.sender) {
        token = IERC20(_tokenAddress);
    }
    
    /**
     * @dev Create proposal baru
     * @param _title Judul proposal
     * @param _description Deskripsi proposal
     */
    function createProposal(string memory _title, string memory _description) external onlyOwner {
        proposalCount++;
        
        Proposal storage newProposal = proposals[proposalCount];
        newProposal.id = proposalCount;
        newProposal.title = _title;
        newProposal.description = _description;
        newProposal.createdAt = block.timestamp;
        newProposal.votingDeadline = block.timestamp + votingDuration;
        newProposal.executed = false;
        
        emit ProposalCreated(proposalCount, _title, msg.sender);
    }
    
    /**
     * @dev Quadratic voting - Menghitung cost untuk vote
     * Rumus: cost = votes^2
     * @param _votes Jumlah votes yang ingin dicast
     * @return cost Token yang diperlukan
     */
    function calculateVoteCost(uint256 _votes) public pure returns (uint256) {
        return _votes * _votes;
    }
    
    /**
     * @dev Cast vote dengan quadratic voting
     * @param _proposalId ID proposal
     * @param _votes Jumlah votes yang ingin dicast (1-100)
     * @param _choice 1: yes, 2: no, 3: abstain
     */
    function vote(uint256 _proposalId, uint256 _votes, uint8 _choice) external {
        require(_proposalId > 0 && _proposalId <= proposalCount, "Invalid proposal");
        require(_votes > 0 && _votes <= 100, "Votes must be 1-100");
        require(_choice >= 1 && _choice <= 3, "Choice must be 1-3");
        
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp <= proposal.votingDeadline, "Voting ended");
        require(!proposal.executed, "Proposal already executed");
        
        // Calculate token cost dengan quadratic voting
        uint256 tokenCost = calculateVoteCost(_votes);
        
        // Check balance
        require(token.balanceOf(msg.sender) >= tokenCost, "Insufficient tokens");
        
        // Transfer tokens ke contract (sebagai "locked" voting tokens)
        require(
            token.transferFrom(msg.sender, address(this), tokenCost),
            "Token transfer failed"
        );
        
        // Record vote
        Vote memory newVote = Vote({
            proposalId: _proposalId,
            voter: msg.sender,
            choice: _choice,
            tokensSpent: tokenCost
        });
        
        votes[_proposalId].push(newVote);
        voterTokensSpent[_proposalId][msg.sender] += tokenCost;
        
        // Update proposal votes
        if (_choice == 1) {
            proposal.yesVotes += _votes;
        } else if (_choice == 2) {
            proposal.noVotes += _votes;
        } else {
            proposal.abstainVotes += _votes;
        }
        
        emit VoteCast(_proposalId, msg.sender, _choice, tokenCost);
    }
    
    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 _proposalId) external view returns (
        uint256 id,
        string memory title,
        string memory description,
        uint256 createdAt,
        uint256 votingDeadline,
        bool executed,
        uint256 yesVotes,
        uint256 noVotes,
        uint256 abstainVotes
    ) {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.id,
            proposal.title,
            proposal.description,
            proposal.createdAt,
            proposal.votingDeadline,
            proposal.executed,
            proposal.yesVotes,
            proposal.noVotes,
            proposal.abstainVotes
        );
    }
    
    /**
     * @dev Get all votes untuk proposal
     */
    function getProposalVotes(uint256 _proposalId) external view returns (Vote[] memory) {
        return votes[_proposalId];
    }
    
    /**
     * @dev Check voting status
     */
    function isVotingActive(uint256 _proposalId) external view returns (bool) {
        return block.timestamp <= proposals[_proposalId].votingDeadline && !proposals[_proposalId].executed;
    }
    
    /**
     * @dev Execute proposal jika voting selesai
     */
    function executeProposal(uint256 _proposalId) external onlyOwner {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp > proposal.votingDeadline, "Voting not finished");
        require(!proposal.executed, "Already executed");
        
        proposal.executed = true;
        emit ProposalExecuted(_proposalId);
    }
    
    /**
     * @dev Get total proposals
     */
    function getTotalProposals() external view returns (uint256) {
        return proposalCount;
    }
}
