import { ethers } from 'ethers';
import CampusTokenABI from '../contracts/CampusToken.json';
import ArcanaDAOABI from '../contracts/ArcanaDAO.json';
import contractAddress from '../contracts/contract-address.json';

// Check if MetaMask is installed
export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

// Switch to Sepolia network
export const switchToSepolia = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    // Try to switch to Sepolia (chainId: 0xaa36a7 = 11155111)
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }]
    });
    console.log('Switched to Sepolia network');
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0xaa36a7',
              chainName: 'Sepolia',
              rpcUrls: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18
              }
            }
          ]
        });
        console.log('Sepolia network added and switched');
      } catch (addError) {
        console.error('Failed to add Sepolia network:', addError);
        throw addError;
      }
    } else {
      console.error('Failed to switch to Sepolia:', switchError);
      throw switchError;
    }
  }
};

// Connect to MetaMask
export const connectWallet = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
  }

  try {
    // Switch to Sepolia first
    await switchToSepolia();

    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    // Get provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    // Verify network
    const network = await provider.getNetwork();
    if (network.chainId !== 11155111n) {
      throw new Error(`Wrong network! Connected to chainId ${network.chainId}, expected 11155111 (Sepolia)`);
    }

    console.log('Connected wallet:', address);
    console.log('Network:', network.name);

    return {
      provider,
      signer,
      address,
      accounts
    };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

// Get contract instance
export const getContract = async () => {
  try {
    const { signer } = await connectWallet();
    const contract = new ethers.Contract(
      contractAddress.token,
      CampusTokenABI.abi,
      signer
    );
    return contract;
  } catch (error) {
    console.error('Error getting contract:', error);
    throw error;
  }
};

// Get DAO contract instance
export const getDAOContract = async () => {
  try {
    const { signer } = await connectWallet();
    const contract = new ethers.Contract(
      contractAddress.dao,
      ArcanaDAOABI.abi,
      signer
    );
    return contract;
  } catch (error) {
    console.error('Error getting DAO contract:', error);
    throw error;
  }
};

// Get token balance
export const getBalance = async (address) => {
  try {
    const contract = await getContract();
    const balance = await contract.balanceOf(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting balance:', error);
    throw error;
  }
};

// Get readable balance
export const getReadableBalance = async (address) => {
  try {
    const contract = await getContract();
    const balance = await contract.getReadableBalance(address);
    return balance.toString();
  } catch (error) {
    console.error('Error getting readable balance:', error);
    throw error;
  }
};

// Transfer tokens
export const transferTokens = async (toAddress, amount) => {
  try {
    const contract = await getContract();
    const amountInWei = ethers.parseEther(amount.toString());
    
    const tx = await contract.transfer(toAddress, amountInWei);
    console.log('Transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt.hash);
    
    return receipt;
  } catch (error) {
    console.error('Error transferring tokens:', error);
    throw error;
  }
};

// Mint tokens (only owner)
export const mintTokens = async (toAddress, amount, reason) => {
  try {
    const contract = await getContract();
    
    const tx = await contract.mint(toAddress, amount, reason);
    console.log('Minting transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Minting confirmed:', receipt.hash);
    
    return receipt;
  } catch (error) {
    console.error('Error minting tokens:', error);
    throw error;
  }
};

// Award academic points (only owner)
export const awardAcademicPoints = async (studentAddress, points) => {
  try {
    const contract = await getContract();
    
    const tx = await contract.awardAcademicPoints(studentAddress, points);
    console.log('Award points transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Award points confirmed:', receipt.hash);
    
    return receipt;
  } catch (error) {
    console.error('Error awarding points:', error);
    throw error;
  }
};

// Get academic points
export const getAcademicPoints = async (studentAddress) => {
  try {
    const contract = await getContract();
    const points = await contract.getAcademicPoints(studentAddress);
    return points.toString();
  } catch (error) {
    console.error('Error getting academic points:', error);
    throw error;
  }
};

// Reward student with tokens (only owner)
export const rewardStudent = async (studentAddress, tokenAmount) => {
  try {
    const contract = await getContract();
    
    const tx = await contract.rewardStudent(studentAddress, tokenAmount);
    console.log('Reward transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Reward confirmed:', receipt.hash);
    
    return receipt;
  } catch (error) {
    console.error('Error rewarding student:', error);
    throw error;
  }
};

// Get token info
export const getTokenInfo = async () => {
  try {
    const contract = await getContract();
    
    const name = await contract.name();
    const symbol = await contract.symbol();
    const totalSupply = await contract.totalSupply();
    const decimals = await contract.decimals();
    
    return {
      name,
      symbol,
      totalSupply: ethers.formatEther(totalSupply),
      decimals: decimals.toString(),
      address: contractAddress.address
    };
  } catch (error) {
    console.error('Error getting token info:', error);
    throw error;
  }
};

// Listen to Transfer events
export const listenToTransfers = (callback) => {
  if (!isMetaMaskInstalled()) return;

  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(
    contractAddress.address,
    CampusTokenABI.abi,
    provider
  );

  contract.on('TokensTransferred', (from, to, amount, event) => {
    callback({
      from,
      to,
      amount: ethers.formatEther(amount),
      event
    });
  });

  return () => {
    contract.removeAllListeners('TokensTransferred');
  };
};

// Add localhost network to MetaMask
export const addLocalNetwork = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x539', // 1337 in hex
        chainName: 'Localhost 8545',
        nativeCurrency: {
          name: 'Ethereum',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['http://127.0.0.1:8545'],
        blockExplorerUrls: null
      }]
    });
    console.log('Localhost network added to MetaMask');
  } catch (error) {
    console.error('Error adding network:', error);
    throw error;
  }
};

// Switch to localhost network
export const switchToLocalNetwork = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x539' }] // 1337 in hex
    });
    console.log('Switched to localhost network');
  } catch (error) {
    // If network doesn't exist, add it
    if (error.code === 4902) {
      await addLocalNetwork();
    } else {
      console.error('Error switching network:', error);
      throw error;
    }
  }
};

// Add Arcana token to MetaMask
export const addArcanaTokenToMetaMask = async () => {
  try {
    if (!contractAddress.token) {
      throw new Error('Token address not configured');
    }

    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: contractAddress.token,
          symbol: contractAddress.symbol,
          decimals: parseInt(contractAddress.decimals),
          image: 'https://raw.githubusercontent.com/MetaMask/test-dapp/main/logo.png',
        },
      },
    });
    
    if (wasAdded) {
      console.log('Arcana token added to MetaMask');
      return true;
    } else {
      console.log('Token addition was rejected by user');
      return false;
    }
  } catch (error) {
    console.error('Error adding token to MetaMask:', error);
    throw error;
  }
};

// Add Hardhat Localhost Network to MetaMask
export const addLocalhostNetwork = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed.');
  }

  try {
    const wasAdded = await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x7a69', // 31337 in decimal
          chainName: 'Hardhat Localhost',
          rpcUrls: ['http://localhost:8545'],
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
          },
          blockExplorerUrls: [],
        },
      ],
    });
    console.log('Hardhat network added to MetaMask');
    return wasAdded;
  } catch (error) {
    console.error('Error adding Hardhat network:', error);
    throw error;
  }
};

// Switch to Hardhat Network
export const switchToLocalhostNetwork = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed.');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x7a69' }], // 31337 in hex
    });
    console.log('Switched to Hardhat network');
  } catch (error) {
    // If network doesn't exist, add it
    if (error.code === 4902) {
      await addLocalhostNetwork();
      await switchToLocalhostNetwork();
    } else {
      console.error('Error switching network:', error);
      throw error;
    }
  }
};
