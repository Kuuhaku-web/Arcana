import "./Navbar.css";
import logoImg from "../assets/logo_arcana.jpg";

// Navbar Component
const Navbar = ({ onNavigate, currentPage }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logoImg} alt="Arcana Logo" className="logo-image" />
        <span className="logo-text">Arcana</span>
      </div>

      <div className="navbar-menu">
        <a href="#home" className={`nav-link ${currentPage === "home" ? "active" : ""}`} onClick={() => onNavigate("home")}>
          Home
        </a>
        <a href="#campus" className={`nav-link ${currentPage === "campus" ? "active" : ""}`} onClick={() => onNavigate("campus")}>
          Campus
        </a>
        <a href="#dao" className={`nav-link ${currentPage === "dao" ? "active" : ""}`} onClick={() => onNavigate("dao")}>
          DAO
        </a>
        <a href="#token" className={`nav-link ${currentPage === "token" ? "active" : ""}`} onClick={() => onNavigate("token")}>
          Token
        </a>
        <a href="#stake" className={`nav-link ${currentPage === "stake" ? "active" : ""}`} onClick={() => onNavigate("stake")}>
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
