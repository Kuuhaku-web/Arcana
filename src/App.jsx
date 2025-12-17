import "./App.css";
import Navbar from "./components/Navbar.jsx";

// Main App Component
const App = () => {
  return (
    <div className="app">
      <Navbar />

      <main className="main-content">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="welcome-badge">
            <span>Welcome to Decentralized Education</span>
          </div>

          <h1 className="hero-title">
            The <span className="text-purple">University of Tomorrow</span>
            <span className="text-blue">,</span> Built Today
          </h1>

          <p className="hero-description">Arcana is a community-owned campus powered by blockchain, transparent governance, and tokenomics. Access global education, earn through contribution, and shape your learning experience.</p>

          <div className="hero-buttons">
            <button className="btn-primary">Join the Campus</button>
            <button className="btn-secondary">Explore DAO</button>
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
      </main>
    </div>
  );
};

export default App;
