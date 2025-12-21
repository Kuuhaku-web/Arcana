import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import "./Token.css";

const Token = ({ onNavigate, currentPage }) => {
  const tokenStats = [
    {
      id: 1,
      value: "$5.2M",
      label: "Total Supply",
      colorClass: "text-purple",
    },
    {
      id: 2,
      value: "$2.4",
      label: "Current Price",
      colorClass: "text-blue",
    },
    {
      id: 3,
      value: "15K+",
      label: "Token Holders",
      colorClass: "text-purple",
    },
  ];

  const utilities = [
    {
      title: "Course Payments",
      description: "Pay for courses directly with ARCANA tokens. No intermediaries, no hidden fees, just transparent education financing. Token holders receive 10% discounts on all course enrollments.",
      icon: "📖",
      tags: ["Direct Payments", "10% Discount", "Instant Settlement"],
      theme: "purple",
    },
    {
      title: "Lecturer Compensation",
      description: "Instructors earn ARCANA directly from course enrollments and community contributions. Fair, transparent, and instant payments. No publisher taking a cut.",
      icon: "👥",
      tags: ["Direct Earnings", "Fair Compensation", "Bonus Incentives"],
      theme: "blue",
    },
    {
      title: "Mint Academic NFT Credentials",
      description: "Upon course completion, mint your diploma as an NFT. Use ARCANA tokens to cover minting and verification fees. Credentials are forever recorded on-chain and instantly verifiable by employers.",
      icon: "🏅",
      tags: ["NFT Minting", "On-Chain Records", "Employer Verified"],
      theme: "purple",
    },
    {
      title: "DAO Governance & Voting",
      description: "Your ARCANA tokens grant you voting power in the DAO. Vote on curriculum, treasury allocation, and platform improvements. Earn rewards for active participation in governance.",
      icon: "📈",
      tags: ["Voting Power", "Earn Rewards", "Governance Rights"],
      theme: "purple",
    },
    {
      title: "Staking & Passive Income",
      description: "Stake your ARCANA tokens to earn passive rewards. Higher staking tiers unlock premium benefits like tuition discounts, early course access, and exclusive seminars with expert lecturers.",
      icon: "🔒",
      tags: ["Passive Yield", "Tier Benefits", "Flexible Duration"],
      theme: "blue",
    },
    {
      title: "Grants & Bounty Programs",
      description: "Earn ARCANA through community contributions: create content, mentor students, contribute code, or participate in research. The DAO rewards meaningful contributions to the platform.",
      icon: "⚡",
      tags: ["Content Creation", "Mentorship", "Open Source"],
      theme: "purple",
    },
  ];

  const distribution = [
    { label: "Community & Users", value: 40, color: "linear-gradient(90deg, #a855f7, #3b82f6)" },
    { label: "Staking Rewards", value: 25, color: "#a855f7" },
    { label: "Team & Development", value: 15, color: "#8b5cf6" },
    { label: "Partnerships & Marketing", value: 12, color: "#6366f1" },
    { label: "Treasury Reserve", value: 8, color: "#3b82f6" },
  ];

  // Data untuk Vesting
  const vesting = [
    { label: "Community", schedule: "Immediate" },
    { label: "Team", schedule: "4-year linear vesting" },
    { label: "Staking Rewards", schedule: "Released over 5 years" },
    { label: "Partnerships", schedule: "Milestone-based unlock" },
    { label: "Treasury", schedule: "DAO governance controlled" },
  ];

  // Data untuk Why Choose ARCANA
  const reasons = [
    { title: "Transparent", desc: "All transactions recorded on-chain. No hidden fees or manipulation." },
    { title: "Educational Focus", desc: "Token designed specifically for education, not hype or speculation." },
    { title: "Community Governed", desc: "Token holders collectively decide the platform's future direction." },
    { title: "Passive Rewards", desc: "Earn yields by staking tokens. Your wealth compounds over time." },
    { title: "Utility First", desc: "Real use cases across courses, governance, credentials, and more." },
    { title: "Fair Distribution", desc: "Community receives 40% of initial supply. Truly decentralized." },
  ];

  return (
    <div className="token-page">
      <Navbar onNavigate={onNavigate} currentPage={currentPage} />

      <main className="token-container">
        {/* Header Section */}
        <section className="token-header">
          <h1 className="token-title">ARCANA Token Utility</h1>
          <p className="token-subtitle">The native token of Kura-Kura powers education, governance, and community rewards. Discover how ARCANA drives the decentralized campus ecosystem.</p>
        </section>

        {/* Stats Grid */}
        <section className="token-stats-section">
          <div className="stats-grid">
            {tokenStats.map((stat) => (
              <div key={stat.id} className="token-stat-card">
                <div className={`stat-value ${stat.colorClass}`}>{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="ecosystem-section">
          <h2 className="ecosystem-title">How ARCANA Powers the Ecosystem</h2>

          <div className="utility-list">
            {utilities.map((item, index) => (
              <div key={index} className="utility-card">
                <div className={`utility-icon-box ${item.theme}-gradient`}>{item.icon}</div>
                <div className="utility-content">
                  <h3 className="utility-card-title">{item.title}</h3>
                  <p className="utility-card-desc">{item.description}</p>
                  <div className="utility-tags">
                    {item.tags.map((tag, i) => (
                      <span key={i} className={`tag ${item.theme}-tag`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION: Token Distribution & Allocation --- */}
        <section className="distribution-section">
          <h2 className="section-title-center">Token Distribution & Allocation</h2>
          <div className="distribution-grid">
            {/* Initial Supply Card */}
            <div className="dist-card">
              <h3 className="card-inner-title">Initial Supply</h3>
              <div className="chart-container">
                {distribution.map((item, index) => (
                  <div key={index} className="chart-row">
                    <div className="chart-info">
                      <span>{item.label}</span>
                      <span className="font-bold">{item.value} %</span>
                    </div>
                    <div className="bar-bg">
                      <div className="bar-fill" style={{ width: `${item.value}%`, background: item.color }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vesting Schedule Card */}
            <div className="dist-card">
              <h3 className="card-inner-title">Vesting Schedule</h3>
              <div className="vesting-list">
                {vesting.map((item, index) => (
                  <div key={index} className="vesting-row">
                    <span className="text-gray">{item.label}</span>
                    <span className="text-dim">{item.schedule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION: Why Choose ARCANA --- */}
        <section className="why-section">
          <h2 className="section-title-center">Why Choose ARCANA?</h2>
          <div className="reasons-grid">
            {reasons.map((reason, index) => (
              <div key={index} className="reason-card">
                <h4 className="reason-title">{reason.title}</h4>
                <p className="reason-desc">{reason.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION: CTA --- */}
        <section className="cta-section">
          <h2 className="cta-title">Ready to Join the ARCANA Ecosystem?</h2>
          <p className="cta-subtitle">Get ARCANA tokens today. Use them to learn, govern, and earn rewards.</p>
          <button className="cta-btn-gradient">Get ARCANA Tokens</button>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default Token;
