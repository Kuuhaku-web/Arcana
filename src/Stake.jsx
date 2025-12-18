import "./Stake.css";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import { useState } from "react";

// Stake Component
const Stake = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "Are staking rewards guaranteed?",
      answer: "No. Rewards depend on platform revenue and are distributed monthly. The DAO governs the reward distribution mechanism to ensure fairness and sustainability.",
    },
    {
      question: "Can I change tiers?",
      answer: "Yes. You can upgrade or downgrade at any time. Upgrades are instant. Downgrades follow the unstaking schedule to ensure fair reward distribution.",
    },
    {
      question: "What if the token price drops?",
      answer: "Staking rewards are real value. Even if price fluctuates, you earn additional tokens, which compounds your holdings. Long-term holders benefit from accumulation regardless of short-term price movements.",
    },
    {
      question: "Are there risks?",
      answer: "Smart contracts are audited by independent security firms. However, all blockchain investments carry market risk. Only stake what you can afford to hold long-term.",
    },
    {
      question: "Can I stake with a hardware wallet?",
      answer: "Yes. Any Web3-compatible wallet (MetaMask, Ledger, Trezor, etc.) works with Kura-Kura staking. Hardware wallets provide the highest security for your assets.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };
  return (
    <div className="stake-page">
      <Navbar onNavigate={onNavigate} />

      <main className="stake-content">
        {/* Hero Section */}
        <div className="stake-hero">
          <h1 className="stake-title">Staking & Membership</h1>
          <p className="stake-description">Stake ARCANA tokens and unlock exclusive benefits. Choose your membership tier to get discounts, earn passive rewards, and access premium features.</p>
        </div>

        {/* Why Stake Section */}
        <section className="why-stake-section">
          <h2 className="section-title">Why Stake ARCANA?</h2>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value purple">+25%</div>
              <p className="stat-label">Average APY on staked tokens</p>
            </div>

            <div className="stat-card">
              <div className="stat-value blue">99%</div>
              <p className="stat-label">Platform uptime guarantee</p>
            </div>

            <div className="stat-card">
              <div className="stat-value pink">$12M+</div>
              <p className="stat-label">Total staked in ecosystem</p>
            </div>
          </div>
        </section>

        {/* Membership Tiers */}
        <section className="tiers-section">
          <h2 className="section-title">Membership Tiers</h2>

          <div className="tiers-grid">
            {/* Bronze Tier */}
            <div className="tier-card bronze">
              <div className="tier-icon bronze-icon">🔒</div>
              <h3 className="tier-name">Bronze</h3>

              <div className="tier-staking">
                <p className="staking-label">Minimum Staking</p>
                <p className="staking-amount">100 ARCANA</p>
                <p className="staking-usd">≈ $ 240</p>
              </div>

              <div className="tier-reward">
                <p className="reward-label">Monthly Reward</p>
                <p className="reward-amount">~ 2.50 ARCANA</p>
                <p className="reward-apy">~ 30.0 % APY</p>
              </div>

              <div className="tier-benefits">
                <p className="benefits-title">Benefits:</p>
                <ul className="benefits-list">
                  <li>5% course tuition discount</li>
                  <li>Access to community forum</li>
                  <li>Monthly community calls</li>
                  <li>Early access to new courses (1 week)</li>
                  <li>Basic support</li>
                </ul>
              </div>

              <button className="tier-stake-btn">Stake 100 ARCANA</button>
            </div>

            {/* Silver Tier */}
            <div className="tier-card silver popular">
              <div className="popular-badge">MOST POPULAR</div>
              <div className="tier-icon silver-icon">⚡</div>
              <h3 className="tier-name">Silver</h3>

              <div className="tier-staking">
                <p className="staking-label">Minimum Staking</p>
                <p className="staking-amount">500 ARCANA</p>
                <p className="staking-usd">≈ $ 1,200</p>
              </div>

              <div className="tier-reward">
                <p className="reward-label">Monthly Reward</p>
                <p className="reward-amount">~ 15.00 ARCANA</p>
                <p className="reward-apy">~ 36.0 % APY</p>
              </div>

              <div className="tier-benefits">
                <p className="benefits-title">Benefits:</p>
                <ul className="benefits-list">
                  <li>15% course tuition discount</li>
                  <li>Priority support</li>
                  <li>Early access to new courses (2 weeks)</li>
                  <li>Monthly exclusive seminars</li>
                  <li>Voting power boost (1.5x)</li>
                  <li>Exclusive Discord channel</li>
                  <li>Content creator opportunities</li>
                </ul>
              </div>

              <button className="tier-stake-btn gradient">Stake 500 ARCANA</button>
            </div>

            {/* Gold Tier */}
            <div className="tier-card gold">
              <div className="tier-icon gold-icon">👑</div>
              <h3 className="tier-name">Gold</h3>

              <div className="tier-staking">
                <p className="staking-label">Minimum Staking</p>
                <p className="staking-amount">2,000 ARCANA</p>
                <p className="staking-usd">≈ $ 4,800</p>
              </div>

              <div className="tier-reward">
                <p className="reward-label">Monthly Reward</p>
                <p className="reward-amount">~ 75.00 ARCANA</p>
                <p className="reward-apy">~ 45.0 % APY</p>
              </div>

              <div className="tier-benefits">
                <p className="benefits-title">Benefits:</p>
                <ul className="benefits-list">
                  <li>25% course tuition discount</li>
                  <li>Premium 24/7 support</li>
                  <li>Early access to new courses (3 weeks)</li>
                  <li>Weekly exclusive seminars with top lecturers</li>
                  <li>Voting power boost (3x)</li>
                  <li>VIP Discord channel</li>
                  <li>Course co-creation rights</li>
                  <li>Governance proposal creation rights</li>
                  <li>NFT credential priority minting</li>
                  <li>Annual Kura-Kura summit invitation</li>
                </ul>
              </div>

              <button className="tier-stake-btn">Stake 2000 ARCANA</button>
            </div>
          </div>
        </section>

        {/* How Staking Works */}
        <section className="how-it-works-section">
          <h2 className="section-title">How Staking Works</h2>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Connect Wallet</h3>
              <p className="step-description">Connect your Web3 wallet to the Kura-Kura platform.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Choose Tier</h3>
              <p className="step-description">Select Bronze, Silver, or Gold membership that fits your needs.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Stake Tokens</h3>
              <p className="step-description">Deposit the minimum required ARCANA tokens to activate your tier.</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h3 className="step-title">Earn & Enjoy</h3>
              <p className="step-description">Start earning monthly rewards and unlock all tier benefits immediately.</p>
            </div>
          </div>
        </section>

        {/* Flexible Unstaking */}
        <section className="unstaking-section">
          <div className="unstaking-card">
            <h2 className="unstaking-title">Flexible Unstaking</h2>
            <p className="unstaking-description">Your tokens are never locked. You can unstake at any time with no penalties. However, unstaking immediately reduces your membership benefits.</p>

            <div className="unstaking-options">
              <div className="unstaking-option">
                <p className="option-label">Instant Unstake</p>
                <p className="option-value">Immediate withdrawal, benefits end</p>
              </div>

              <div className="unstaking-option">
                <p className="option-label">7-Day Notice</p>
                <p className="option-value">Earn 2x rewards for 7 days</p>
              </div>

              <div className="unstaking-option">
                <p className="option-label">30-Day Notice</p>
                <p className="option-value">Earn 3x rewards for 30 days</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2 className="section-title">Frequently Asked Questions</h2>

          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${openFaq === index ? "active" : ""}`}>
                <button className="faq-question" onClick={() => toggleFaq(index)}>
                  <span>{faq.question}</span>
                  <span className="faq-icon">{openFaq === index ? "▲" : "▼"}</span>
                </button>

                {openFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Stake;
