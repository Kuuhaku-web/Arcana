import "./Home.css";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

export default function Home( {onNavigate, currentPage} ) {
  return (
<div className="app">
  <Navbar onNavigate={onNavigate} currentPage={currentPage} />

  <main className="main-content">
    {/* Hero Section */}
    <div className="hero-section">
      <div className="welcome-badge">
        <span>Welcome to Decentralized Education</span>
      </div>

      <h1 className="hero-title">
        <span style={{color: '#ffffff'}}>The</span> <span className="text-purple">University of Tomorrow</span>
        <span className="text-blue">,</span> <span style={{color: '#ffffff'}}>Built Today</span>
      </h1>

      <p className="hero-description">Arcana is a community-owned campus powered by blockchain, transparent governance, and tokenomics. Access global education, earn through contribution, and shape your learning experience.</p>

      <div className="hero-buttons">
        <button className="btn-primary" onClick={() => onNavigate("campus")}>Join the Campus</button>
        <button className="btn-secondary" onClick={() => onNavigate("dao")}>Explore DAO</button>
      </div>
    </div>

    {/* Stats Section */}
    <div className="stats-section">
      <div className="stat-item">
        <div className="stat-value">1000+</div>
        <div className="stat-label">Active Students</div>
      </div>
      <div className="stat-item">
        <div className="stat-value">50+</div>
        <div className="stat-label">Courses</div>
      </div>
      <div className="stat-item">
        <div className="stat-value">$2M+</div>
        <div className="stat-label">Tokenomics Value</div>
      </div>
      <div className="stat-item">
        <div className="stat-value">100%</div>
        <div className="stat-label">Transparent</div>
      </div>
    </div>

    {/* Problems Section */}
    <div className="problems-section">
      <h2 className="section-title">Problems with Traditional Education</h2>
      <p className="section-subtitle">The current education system is centralized, opaque, and inflexible. Let's change that.</p>

      <div className="problems-grid">
        <div className="problem-card">
          <div className="problem-icon purple-icon">🏛️</div>
          <h3 className="problem-title">Centralized Control</h3>
          <p className="problem-description">Institutions make all decisions without student input, limiting innovation and responsiveness.</p>
        </div>

        <div className="problem-card">
          <div className="problem-icon purple-icon">👁️</div>
          <h3 className="problem-title">Lack of Transparency</h3>
          <p className="problem-description">Hidden fees, opaque governance, and unclear criteria leave students in the dark.</p>
        </div>

        <div className="problem-card">
          <div className="problem-icon purple-icon">📜</div>
          <h3 className="problem-title">Diploma Forgery Risk</h3>
          <p className="problem-description">Credentials can be forged. Employers struggle to verify authenticity.</p>
        </div>

        <div className="problem-card">
          <div className="problem-icon purple-icon">📚</div>
          <h3 className="problem-title">Rigid Curriculum</h3>
          <p className="problem-description">Fixed programs don't adapt to market needs or individual learning paths.</p>
        </div>
      </div>
    </div>

    {/* Solutions Section */}
    <div className="solutions-section">
      <h2 className="section-title">How Arcana Solves It</h2>
      <p className="section-subtitle">Decentralized technology meets education for unprecedented transparency and community control.</p>

      <div className="solutions-grid">
        <div className="solution-card">
          <div className="solution-icon">✓</div>
          <h3 className="solution-title">NFT Diplomas</h3>
          <p className="solution-description">Tamper-proof, blockchain-verified credentials that employers can instantly verify on-chain.</p>
          <a href="#" className="solution-link">
            Learn more →
          </a>
        </div>

        <div className="solution-card">
          <div className="solution-icon">👥</div>
          <h3 className="solution-title">DAO Governance</h3>
          <p className="solution-description">Every stakeholder votes on curriculum, fees, and platform decisions. True community ownership.</p>
          <a href="#" className="solution-link">
            Learn more →
          </a>
        </div>

        <div className="solution-card">
          <div className="solution-icon">📈</div>
          <h3 className="solution-title">Flexible Curriculum</h3>
          <p className="solution-description">Community proposes and votes on courses. Learn what matters to the industry, not just tradition.</p>
          <a href="#" className="solution-link">
            Learn more →
          </a>
        </div>
      </div>
    </div>

    {/* Platform Features */}
    <div className="features-section">
      <h2 className="section-title">Platform Features</h2>

      <div className="features-grid">
        <div className="feature-card">
          <h3 className="feature-title">Learn-to-Earn</h3>
          <p className="feature-description">Earn tokens for course completion, mentoring, and community contribution</p>
        </div>

        <div className="feature-card">
          <h3 className="feature-title">Membership Tiers</h3>
          <p className="feature-description">Bronze, Silver, Gold - with increasing benefits and voting power</p>
        </div>

        <div className="feature-card">
          <h3 className="feature-title">Smart Contracts</h3>
          <p className="feature-description">Automated payments, credential issuance, and DAO governance</p>
        </div>

        <div className="feature-card">
          <h3 className="feature-title">Global Access</h3>
          <p className="feature-description">Study from anywhere with affordable, borderless education</p>
        </div>
      </div>
    </div>

    {/* CTA Section */}
    <div className="cta-section">
      <h2 className="cta-title">Ready to Join the Future of Education?</h2>
      <p className="cta-subtitle">Connect your wallet and start exploring opportunities in our decentralized campus today.</p>

      <div className="cta-buttons">
        <button className="btn-gradient" onClick={() => onNavigate("stake")}>Stake Tokens Now</button>
        <button className="btn-outline">Read Documentation</button>
      </div>
    </div>
  </main>

  <Footer onNavigate={onNavigate} />
</div>
  )
}