import './WalletConnect.css';
import { useState, useEffect } from 'react';
import {
  connectWallet,
  getBalance,
  getTokenInfo,
  transferTokens,
  mintTokens,
  awardAcademicPoints,
  getAcademicPoints,
  rewardStudent,
  switchToLocalhostNetwork,
  addLocalhostNetwork,
  isMetaMaskInstalled
} from '../utils/web3';

function WalletConnect() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('0');
  const [tokenInfo, setTokenInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [mintTo, setMintTo] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [mintReason, setMintReason] = useState('');
  const [studentAddress, setStudentAddress] = useState('');
  const [points, setPoints] = useState('');
  const [academicPoints, setAcademicPoints] = useState('0');

  useEffect(() => {
    // Check if already connected
    checkConnection();

    // Listen to account changes
    if (isMetaMaskInstalled()) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (isMetaMaskInstalled()) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (!isMetaMaskInstalled()) return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        await handleConnect();
      }
    } catch (err) {
      console.error('Error checking connection:', err);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount(null);
      setBalance('0');
    } else {
      handleConnect();
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    setError('');

    try {
      // Add and switch to localhost network first
      await addLocalhostNetwork();
      await switchToLocalhostNetwork();

      // Connect wallet
      const { address } = await connectWallet();
      setAccount(address);

      // Get balance
      const bal = await getBalance(address);
      setBalance(bal);

      // Get token info
      const info = await getTokenInfo();
      setTokenInfo(info);

      console.log('Connected successfully');
    } catch (err) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await transferTokens(transferTo, transferAmount);
      
      // Refresh balance
      const bal = await getBalance(account);
      setBalance(bal);
      
      setTransferTo('');
      setTransferAmount('');
      alert('Transfer successful!');
    } catch (err) {
      console.error('Transfer error:', err);
      setError(err.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMint = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await mintTokens(mintTo, mintAmount, mintReason);
      
      alert('Minting successful!');
      setMintTo('');
      setMintAmount('');
      setMintReason('');
      
      // Refresh token info
      const info = await getTokenInfo();
      setTokenInfo(info);
    } catch (err) {
      console.error('Mint error:', err);
      setError(err.message || 'Minting failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAwardPoints = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await awardAcademicPoints(studentAddress, points);
      alert('Points awarded successfully!');
      setStudentAddress('');
      setPoints('');
    } catch (err) {
      console.error('Award points error:', err);
      setError(err.message || 'Award points failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckPoints = async () => {
    setLoading(true);
    setError('');

    try {
      const pts = await getAcademicPoints(studentAddress);
      setAcademicPoints(pts);
    } catch (err) {
      console.error('Check points error:', err);
      setError(err.message || 'Failed to get points');
    } finally {
      setLoading(false);
    }
  };

  const handleRewardStudent = async () => {
    setLoading(true);
    setError('');

    try {
      await rewardStudent(studentAddress, points);
      alert('Student rewarded successfully!');
      setStudentAddress('');
      setPoints('');
    } catch (err) {
      console.error('Reward student error:', err);
      setError(err.message || 'Reward student failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isMetaMaskInstalled()) {
    return (
      <div className="wallet-container">
        <h2>MetaMask Not Detected</h2>
        <p>Please install MetaMask to use this application.</p>
        <a 
          href="https://metamask.io/download/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Install MetaMask
        </a>
      </div>
    );
  }

  return (
    <div className="wallet-container">
      <h1>🎓 Decentralized Campus - Token Dashboard</h1>

      {error && <div className="error-message">{error}</div>}

      {!account ? (
        <div className="connect-section">
          <h2>Connect Your Wallet</h2>
          <button 
            onClick={handleConnect} 
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Connecting...' : 'Connect MetaMask'}
          </button>
        </div>
      ) : (
        <div className="connected-section">
          <div className="account-info">
            <h2>Account Information</h2>
            <p><strong>Address:</strong> {account}</p>
            <p><strong>Balance:</strong> {balance} {tokenInfo?.symbol || 'CAMP'}</p>
          </div>

          {tokenInfo && (
            <div className="token-info">
              <h2>Token Information</h2>
              <p><strong>Name:</strong> {tokenInfo.name}</p>
              <p><strong>Symbol:</strong> {tokenInfo.symbol}</p>
              <p><strong>Total Supply:</strong> {tokenInfo.totalSupply}</p>
              <p><strong>Contract:</strong> {tokenInfo.address}</p>
            </div>
          )}

          <div className="actions-grid">
            {/* Transfer Tokens */}
            <div className="action-card">
              <h3>Transfer Tokens</h3>
              <form onSubmit={handleTransfer}>
                <input
                  type="text"
                  placeholder="Recipient Address"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  required
                  step="0.01"
                />
                <button type="submit" disabled={loading} className="btn-secondary">
                  {loading ? 'Processing...' : 'Transfer'}
                </button>
              </form>
            </div>

            {/* Mint Tokens (Owner Only) */}
            <div className="action-card">
              <h3>Mint Tokens (Owner Only)</h3>
              <form onSubmit={handleMint}>
                <input
                  type="text"
                  placeholder="Recipient Address"
                  value={mintTo}
                  onChange={(e) => setMintTo(e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Reason"
                  value={mintReason}
                  onChange={(e) => setMintReason(e.target.value)}
                  required
                />
                <button type="submit" disabled={loading} className="btn-secondary">
                  {loading ? 'Minting...' : 'Mint'}
                </button>
              </form>
            </div>

            {/* Award Academic Points */}
            <div className="action-card">
              <h3>Award Academic Points (Owner Only)</h3>
              <form onSubmit={handleAwardPoints}>
                <input
                  type="text"
                  placeholder="Student Address"
                  value={studentAddress}
                  onChange={(e) => setStudentAddress(e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Points"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  required
                />
                <button type="submit" disabled={loading} className="btn-secondary">
                  {loading ? 'Processing...' : 'Award Points'}
                </button>
              </form>
            </div>

            {/* Check Academic Points */}
            <div className="action-card">
              <h3>Check Academic Points</h3>
              <input
                type="text"
                placeholder="Student Address"
                value={studentAddress}
                onChange={(e) => setStudentAddress(e.target.value)}
              />
              <button 
                onClick={handleCheckPoints} 
                disabled={loading || !studentAddress}
                className="btn-secondary"
              >
                {loading ? 'Checking...' : 'Check Points'}
              </button>
              {academicPoints !== '0' && (
                <p className="points-result">Points: {academicPoints}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WalletConnect;