import "./Navbar.css";

// Navbar Component
const Navbar = ({ onNavigate, currentPage }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="logo-icon">A</div>
        <span className="logo-text">Arcana</span>
      </div>

      <div className="navbar-menu">
        <a 
          href="#home" 
          className={`nav-link ${currentPage === "home" ? "active" : ""}`}
          onClick={() => onNavigate("home")}
        >
          Home
        </a>
        <a 
          href="#campus" 
          className={`nav-link ${currentPage === "campus" ? "active" : ""}`}
          onClick={() => onNavigate("campus")}
        >
          Campus
        </a>
        <a href="#" className="nav-link">
          DAO
        </a>
        <a href="#" className="nav-link">
          Token
        </a>
        <a 
          href="#stake" 
          className={`nav-link ${currentPage === "stake" ? "active" : ""}`}
          onClick={() => onNavigate("stake")}
        >
          Stake
        </a>
      </div>

      <button className="connect-wallet-btn">
        <span>💵</span>
        <span>Connect Wallet</span>
      </button>
    </nav>
  );
};
export default Navbar;
