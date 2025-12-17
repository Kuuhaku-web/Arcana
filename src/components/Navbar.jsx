import "./Navbar.css";

// Navbar Component
const Navbar = ({ onNavigate}) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="logo-icon">A</div>
        <span className="logo-text">Arcana</span>
      </div>

      <div className="navbar-menu">
        <a href="#home" className="nav-link" onClick={() => onNavigate("home")}>
          Home
        </a>
        <a href="#campus" className="nav-link" onClick={() => onNavigate("campus")}>
          Campus
        </a>
        <a href="#" className="nav-link">
          DAO
        </a>
        <a href="#" className="nav-link">
          Token
        </a>
        <a href="#" className="nav-link">
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