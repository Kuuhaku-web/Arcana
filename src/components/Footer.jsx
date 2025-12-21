import "./Footer.css";
import logoImg from "../assets/logo_arcana.jpg";

export default function Footer({ onNavigate }) {
  return (
    <>
      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-col">
            <div className="footer-logo">
              <img src={logoImg} alt="Arcana Logo" className="logo-image" />
              <span className="logo-text">Arcana</span>
            </div>
            <p className="footer-description">Community-owned university powered by blockchain, DAO governance, and tokenomics.</p>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links">
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate("home"); }}>Home</a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate("campus"); }}>Campus</a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate("dao"); }}>DAO Governance</a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate("token"); }}>Token Utility</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Community</h4>
            <ul className="footer-links">
              <li>
                <a href="#">Discord</a>
              </li>
              <li>
                <a href="#">Twitter</a>
              </li>
              <li>
                <a href="#">GitHub</a>
              </li>
              <li>
                <a href="#">Forum</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Legal</h4>
            <ul className="footer-links">
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Documentation</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
