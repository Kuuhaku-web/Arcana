import "./Navbar.css";
import logoImg from "../assets/logo_arcana.jpg";
import { useState } from "react";
import { connectWallet, addArcanaTokenToMetaMask, switchToLocalNetwork, isMetaMaskInstalled } from "../utils/web3";

// Navbar Component
const Navbar = ({ onNavigate, currentPage }) => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConnectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      alert('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setLoading(true);
    try {
      // Switch to localhost network
      await switchToLocalNetwork();

      // Connect wallet
      const { address } = await connectWallet();
      setAccount(address);

      // Add Arcana token to MetaMask
      await addArcanaTokenToMetaMask();

      alert(`Wallet connected: ${address}\nArcana token added to MetaMask!`);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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

      <button className="connect-wallet-btn" onClick={handleConnectWallet} disabled={loading}>
        <span>💵</span>
        <span>{loading ? 'Connecting...' : account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}</span>
      </button>
    </nav>
  );
};
export default Navbar;
