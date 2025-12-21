import React, { useState } from "react";
import Navbar from "./components/Navbar.jsx"; // Pastikan path benar
import Footer from "./components/Footer.jsx"; // Pastikan path benar
import VotingModal from "./components/VotingModal.jsx";
import QuadraticVotingUtil from "./utils/quadraticVoting.js";
import "./Dao.css";

const Dao = ({ onNavigate, currentPage }) => {
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [votingLoading, setVotingLoading] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Contract addresses (from deployment)
  const DAO_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Dummy proposals untuk fallback (moved here so it's available in useEffect)
  const dummyProposals = [
    {
      id: 1,
      title: "Increase Community Fund to 50% of Treasury",
      status: "Active",
      description: "Proposal to allocate 50% of DAO treasury to community grants and development funds.",
      proposer: "Dr. Sarah Chen",
      category: "Treasury",
      timeLeft: "3 days left",
      createdAt: new Date(),
      votingDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      executed: false,
      yesVotes: 7850,
      noVotes: 1200,
      abstainVotes: 450,
      totalVotes: 9500,
      votes: {
        yes: "7,850",
        no: "1,200",
        abstain: "450",
      },
      progress: 82.6,
      quorum: {
        reached: true,
        current: "9,500",
        required: "5,000",
      },
    },
    {
      id: 2,
      title: "Launch New Advanced DeFi Course",
      status: "Active",
      description: "Create and fund a new advanced DeFi strategies course with Dr. James Park as lecturer.",
      proposer: "Emma Thompson",
      category: "Curriculum",
      timeLeft: "5 days left",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      votingDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      executed: false,
      yesVotes: 6200,
      noVotes: 980,
      abstainVotes: 320,
      totalVotes: 7500,
      votes: {
        yes: "6,200",
        no: "980",
        abstain: "320",
      },
      progress: 82.7,
      quorum: {
        reached: true,
        current: "7,500",
        required: "5,000",
      },
    },
  ];

  // Fetch proposals dari smart contract
  React.useEffect(() => {
    setLoading(true);
    // Tampilkan demo proposals langsung
    setProposals(dummyProposals);
    setLoading(false);
  }, []);

  const votingStats = [
    {
      label: "Voting Power",
      value: "2,500",
      subValue: "16.7 % of total",
      colorClass: "text-purple",
      icon: "👥", // Mewakili kekuatan suara/populasi
    },
    {
      label: "Tokens Staked",
      value: "5,000",
      subValue: "ARCANA tokens locked",
      colorClass: "text-blue",
      icon: "📈", // Mewakili pertumbuhan/staking
    },
    {
      label: "Active Votes",
      value: "2",
      subValue: "In active proposals",
      colorClass: "text-indigo",
      icon: "☑️", // Mewakili voting/pilihan
    },
    {
      label: "Voting Rewards",
      value: "0.125",
      subValue: "ARCANA earned",
      colorClass: "text-green",
      icon: "✔️", // Mewakili keberhasilan/hadiah
    },
  ];

  const governanceSteps = [
    {
      title: "Community Voting",
      description: "All ARCANA token holders can vote on proposals. Your voting power is proportional to your staked tokens.",
      icon: "👥",
      colorClass: "icon-purple",
    },
    {
      title: "Transparent Voting",
      description: "All votes are recorded on-chain and visible to the community. No hidden votes or manipulation.",
      icon: "🗳️", // Icon kotak suara
      colorClass: "icon-blue",
    },
    {
      title: "Earn Rewards",
      description: "Voting participants earn rewards in ARCANA tokens. The more you engage, the more you earn.",
      icon: "📈",
      colorClass: "icon-indigo",
    },
  ];

  // Handle voting
  const handleOpenVotingModal = (proposal) => {
    setSelectedProposal(proposal);
    setShowVotingModal(true);
  };

  const handleVote = async (proposalId, votes, choice) => {
    setVotingLoading(true);
    try {
      // Get signer from MetaMask
      if (!window.ethereum) {
        return {
          success: false,
          error: "MetaMask not found. Please install MetaMask."
        };
      }

      const { BrowserProvider } = await import("ethers");
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Cast vote
      const result = await QuadraticVotingUtil.castVote(
        DAO_ADDRESS,
        TOKEN_ADDRESS,
        signer,
        proposalId,
        votes,
        choice
      );

      // Jika vote berhasil, just show success message
      if (result.success) {
        console.log("Vote berhasil!");
      }

      return result;
    } catch (error) {
      console.error("Vote error:", error);
      return {
        success: false,
        error: error.message || "Failed to cast vote"
      };
    } finally {
      setVotingLoading(false);
    }
  };

  return (
    <div className="dao-page">
      <Navbar onNavigate={onNavigate} currentPage={currentPage} />

      <main className="dao-container">
        {/* Header Section */}
        <section className="dao-header">
          <h1 className="dao-title">DAO Governance</h1>
          <p className="dao-subtitle">Participate in decentralized decision-making. Vote on proposals, shape the future of Arcana, and earn voting rewards.</p>
        </section>

        {/* Profile Section */}
        <section className="voting-profile-section">
          <h2 className="section-title">Your Voting Profile</h2>

          <div className="stats-grid">
            {votingStats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-header">
                  <span className="stat-emoji">{stat.icon}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
                <div className={`stat-value ${stat.colorClass}`}>{stat.value}</div>
                <div className="stat-subvalue">{stat.subValue}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Active Proposals Section */}
        <section className="proposals-section">
          <div className="section-header">
            <h2 className="section-title">Active Proposals</h2>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#a78bfa" }}>
              <p>⏳ Loading proposals from blockchain...</p>
            </div>
          ) : proposals.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#a78bfa" }}>
              <p>📭 No proposals yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="proposals-list">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="proposal-card">
                {/* Header: Title & Badge */}
                <div className="card-top-row">
                  <h3 className="proposal-title">
                    {proposal.title}
                    <span className="status-badge-pill">{proposal.status}</span>
                  </h3>
                </div>

                <p className="proposal-desc">{proposal.description}</p>

                {/* Meta Info Row */}
                <div className="proposal-meta-row">
                  <span className="meta-text">
                    Created: <span className="text-white">{proposal.createdAt ? proposal.createdAt.toLocaleDateString() : 'N/A'}</span>
                  </span>
                  <span className="meta-text">
                    Deadline: <span className="text-white">{proposal.votingDeadline ? proposal.votingDeadline.toLocaleDateString() : 'N/A'}</span>
                  </span>
                  <span className="meta-text time-info">
                    {proposal.executed ? "✅ Executed" : "🗳️ Active"}
                  </span>
                </div>

                {/* Votes Grid */}
                <div className="votes-grid">
                  <div className="vote-stat">
                    <span className="vote-label">Yes Votes</span>
                    <span className="vote-number text-green">{proposal.yesVotes.toLocaleString()}</span>
                  </div>
                  <div className="vote-stat">
                    <span className="vote-label">No Votes</span>
                    <span className="vote-number text-red">{proposal.noVotes.toLocaleString()}</span>
                  </div>
                  <div className="vote-stat">
                    <span className="vote-label">Abstain</span>
                    <span className="vote-number text-white">{proposal.abstainVotes.toLocaleString()}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-section">
                  <div className="progress-labels">
                    <span>Voting Progress</span>
                    <span>
                      {proposal.totalVotes > 0 
                        ? ((proposal.yesVotes / proposal.totalVotes) * 100).toFixed(1) 
                        : 0}% in favor
                    </span>
                  </div>
                  <div className="progress-track">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: proposal.totalVotes > 0 
                          ? ((proposal.yesVotes / proposal.totalVotes) * 100) + '%'
                          : '0%'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Footer: Quorum */}
                <div className="quorum-footer">
                  <span className="quorum-icon">✅</span>
                  <span className="quorum-text text-green">
                    Total Votes: {proposal.totalVotes.toLocaleString()}
                  </span>
                </div>

                {/* Vote Button */}
                <div className="proposal-vote-button">
                  <button
                    className="vote-btn-primary"
                    onClick={() => handleOpenVotingModal(proposal)}
                    disabled={votingLoading}
                  >
                    {votingLoading ? "⏳ Processing..." : "🗳️ Cast Your Vote"}
                  </button>
                </div>
              </div>
            ))}
            </div>
          )}
        </section>

        {/* --- BAGIAN BARU: How DAO Governance Works --- */}
        <section className="governance-info-section">
          <h2 className="info-section-title">How DAO Governance Works</h2>

          <div className="info-grid">
            {governanceSteps.map((step, index) => (
              <div key={index} className="info-card">
                <div className={`info-icon-box ${step.colorClass}`}>
                  <span className="info-icon">{step.icon}</span>
                </div>
                <h3 className="info-title">{step.title}</h3>
                <p className="info-desc">{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Voting Modal */}
      {showVotingModal && selectedProposal && (
        <VotingModal
          proposal={selectedProposal}
          onVote={handleVote}
          onClose={() => setShowVotingModal(false)}
          voteCostCalculator={QuadraticVotingUtil.calculateVoteCost}
        />
      )}

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default Dao;
