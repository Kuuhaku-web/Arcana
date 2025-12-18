import React from "react";
import Navbar from "./components/Navbar.jsx"; // Pastikan path benar
import Footer from "./components/Footer.jsx"; // Pastikan path benar
import "./Dao.css";

const Dao = ({ onNavigate, currentPage }) => {
  const proposals = [
    {
      id: 1,
      title: "Increase Community Fund to 50% of Treasury",
      status: "Active",
      description: "Proposal to allocate 50% of DAO treasury to community grants and development funds.",
      proposer: "Dr. Sarah Chen",
      category: "Treasury",
      timeLeft: "3 days left",
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
                    Proposed by <span className="text-white">{proposal.proposer}</span>
                  </span>
                  <span className="meta-text">
                    Category: <span className="text-white">{proposal.category}</span>
                  </span>
                  <span className="meta-text time-info">🕒 {proposal.timeLeft}</span>
                </div>

                {/* Votes Grid */}
                <div className="votes-grid">
                  <div className="vote-stat">
                    <span className="vote-label">Yes Votes</span>
                    <span className="vote-number text-green">{proposal.votes.yes}</span>
                  </div>
                  <div className="vote-stat">
                    <span className="vote-label">No Votes</span>
                    <span className="vote-number text-red">{proposal.votes.no}</span>
                  </div>
                  <div className="vote-stat">
                    <span className="vote-label">Abstain</span>
                    <span className="vote-number text-white">{proposal.votes.abstain}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-section">
                  <div className="progress-labels">
                    <span>Voting Progress</span>
                    <span>{proposal.progress} % in favor</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${proposal.progress}%` }}></div>
                  </div>
                </div>

                {/* Footer: Quorum */}
                <div className="quorum-footer">
                  <span className="quorum-icon">✅</span>
                  <span className="quorum-text text-green">
                    Quorum reached ( {proposal.quorum.current} / {proposal.quorum.required} required )
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dao;
