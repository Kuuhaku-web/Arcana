import "./Footer.css";

export default function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-col">
            <div className="footer-logo">
              <div className="logo-icon">A</div>
              <span className="logo-text">Arcana</span>
            </div>
            <p className="footer-description">Community-owned university powered by blockchain, DAO governance, and tokenomics.</p>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Campus</a>
              </li>
              <li>
                <a href="#">DAO Governance</a>
              </li>
              <li>
                <a href="#">Token Utility</a>
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
