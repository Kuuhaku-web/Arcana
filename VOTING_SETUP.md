# 🗳️ Arcana DAO Voting - Setup Guide

## ✅ Issues Fixed

The voting error was due to several issues in the frontend voting code:

1. **Token Cost Calculation Error**: The vote cost (1, 4, 9, 16...) was being incorrectly converted using `parseEther()`, which added extra decimals
2. **Missing Error Handling**: Errors from the contract weren't being properly caught and displayed
3. **Approval Issues**: Token approval amount wasn't correctly configured
4. **Contract Address Issues**: Contracts need to be properly deployed before voting

## 🚀 How to Setup for Frontend Testing

### Step 1: Start the Local Blockchain Node
```bash
npm run node
```

This starts a Hardhat local node at `http://127.0.0.1:8545`

### Step 2: Deploy Contracts (in a new terminal)
```bash
npx hardhat run deploy-local.js --network localhost
```

This will:
- Deploy the CampusToken contract
- Deploy the ArcanaDAO contract
- Create a test proposal
- Mint tokens and approve them
- Save contract addresses to `src/contracts/contract-address.json`
- Display the contract addresses

### Step 3: Configure MetaMask

Add a custom network in MetaMask:
- **Network Name**: Localhost 8545
- **RPC URL**: http://127.0.0.1:8545
- **Chain ID**: 31337
- **Currency Symbol**: ETH

### Step 4: Update Frontend Contract Addresses (if needed)

If contract addresses changed, update `src/Dao.jsx`:
```javascript
const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const DAO_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
```

Or read them from the deployed file:
```javascript
import deployedAddresses from '../contracts/deployed-addresses.json';
const TOKEN_ADDRESS = deployedAddresses.token;
const DAO_ADDRESS = deployedAddresses.dao;
```

### Step 5: Start the Frontend
```bash
npm run dev
```

Then navigate to the DAO page and vote!

## 🧪 Testing

Run the automated tests:
```bash
npm test
```

This will verify:
- Token deployment and balance ✅
- Proposal creation ✅
- Vote cost calculations (quadratic voting) ✅
- Token approval flow ✅
- Actual voting transaction ✅
- Vote recording ✅

## 🔧 Voting Mechanism

The quadratic voting cost formula is:
```
Cost = Votes²
```

Examples:
- 1 vote = 1² = 1 token
- 2 votes = 2² = 4 tokens
- 5 votes = 5² = 25 tokens
- 10 votes = 10² = 100 tokens
- 100 votes = 100² = 10,000 tokens (max)

## 📝 Vote Choices

Users can vote:
- **1** for "Yes"
- **2** for "No"
- **3** for "Abstain"

## ❌ If Voting Still Fails

Check these things:

1. **MetaMask is on localhost 8545**
   - Go to MetaMask settings → Networks → Check "Localhost 8545"

2. **Hardhat node is running**
   - Terminal should show "Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/"

3. **Contracts are deployed**
   - Run: `npx hardhat run deploy-local.js --network localhost`

4. **Sufficient tokens**
   - Check balance in MetaMask or with: `npx hardhat run check-balance.js --network localhost`

5. **Proposal exists**
   - Deploy script creates a test proposal automatically

6. **Browser console logs**
   - Open browser DevTools → Console to see detailed error messages

## 📊 Current Contract Addresses

After deployment, the addresses will be:
- **Token**: 0x5FbDB2315678afecb367f032d93F642f64180aa3
- **DAO**: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

These are deterministic addresses for the default Hardhat accounts.

## 🎯 Next Steps

- Test voting on different proposals
- Check proposal results with: `npx hardhat run check-votes.js --network localhost`
- Explore the quadratic voting impact on voting power
