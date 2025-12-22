// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ArcanaDAO
 * @dev DAO dengan Quadratic Voting untuk Arcana Campus
 */

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract ArcanaDAO {
    IERC20 public token;
    address public owner;
    
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
    
    struct Vote {
        uint256 proposalId;
        address voter;
        uint8 choice;
        uint256 tokensSpent;
    }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => Vote[]) public votes;
    mapping(uint256 => mapping(address => uint256)) public voterTokensSpent;
    mapping(address => uint256) public votingPower;
    
    uint256 public proposalCount = 0;
    uint256 public votingDuration = 7 days;
    
    event ProposalCreated(uint256 indexed proposalId, string title, address indexed creator);
    event VoteCast(uint256 indexed proposalId, address indexed voter, uint8 choice, uint256 tokensSpent);
    event ProposalExecuted(uint256 indexed proposalId);
    
    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
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
    
    function calculateVoteCost(uint256 _votes) public pure returns (uint256) {
        return _votes * _votes;
    }
    
    function vote(uint256 _proposalId, uint256 _votes, uint8 _choice) external {
        require(_proposalId > 0 && _proposalId <= proposalCount, "Invalid proposal");
        require(_votes > 0 && _votes <= 100, "Votes must be 1-100");
        require(_choice >= 1 && _choice <= 3, "Choice must be 1-3");
        
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp <= proposal.votingDeadline, "Voting ended");
        require(!proposal.executed, "Proposal already executed");
        
        uint256 tokenCost = calculateVoteCost(_votes);
        
        require(token.balanceOf(msg.sender) >= tokenCost, "Insufficient tokens");
        
        require(
            token.transferFrom(msg.sender, address(this), tokenCost),
            "Token transfer failed"
        );
        
        Vote memory newVote = Vote({
            proposalId: _proposalId,
            voter: msg.sender,
            choice: _choice,
            tokensSpent: tokenCost
        });
        
        votes[_proposalId].push(newVote);
        voterTokensSpent[_proposalId][msg.sender] += tokenCost;
        
        if (_choice == 1) {
            proposal.yesVotes += _votes;
        } else if (_choice == 2) {
            proposal.noVotes += _votes;
        } else {
            proposal.abstainVotes += _votes;
        }
        
        emit VoteCast(_proposalId, msg.sender, _choice, tokenCost);
    }
    
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
    
    function getProposalVotes(uint256 _proposalId) external view returns (Vote[] memory) {
        return votes[_proposalId];
    }
    
    function isVotingActive(uint256 _proposalId) external view returns (bool) {
        return block.timestamp <= proposals[_proposalId].votingDeadline && !proposals[_proposalId].executed;
    }
    
    function executeProposal(uint256 _proposalId) external onlyOwner {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp > proposal.votingDeadline, "Voting not finished");
        require(!proposal.executed, "Already executed");
        
        proposal.executed = true;
        emit ProposalExecuted(_proposalId);
    }
    
    function getTotalProposals() external view returns (uint256) {
        return proposalCount;
    }
}
