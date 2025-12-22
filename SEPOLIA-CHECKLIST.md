# ⚡ Checklist Deploy ke Sepolia

## ✅ Pre-Deployment

- [ ] MetaMask installed
- [ ] Switched to **Sepolia testnet**
- [ ] Have Sepolia ETH (dari faucet)
- [ ] Files ready:
  - [ ] `CampusToken-Remix.sol`
  - [ ] `ArcanaDAO-Remix.sol`

## 🔧 Deployment Steps

### Token Contract
- [ ] Buka Remix: https://remix.ethereum.org/
- [ ] Create file `CampusToken.sol`
- [ ] Copy-paste dari `CampusToken-Remix.sol`
- [ ] Compile (Solidity 0.8.20)
- [ ] Deploy dengan parameter: `1000`
- [ ] **Save token address**

### DAO Contract
- [ ] Create file `ArcanaDAO.sol`
- [ ] Copy-paste dari `ArcanaDAO-Remix.sol`
- [ ] Compile
- [ ] Deploy dengan parameter: **[token address dari step sebelumnya]**
- [ ] **Save DAO address**

## 🧪 Testing

### Mint Token
- [ ] Token → `mint()`
- [ ] Parameters:
  - to: Your wallet
  - amount: `1000`
  - reason: `"Testing"`
- [ ] Confirm

### Approve DAO
- [ ] Token → `approve()`
- [ ] Parameters:
  - spender: [DAO address]
  - amount: `1000000000000000000000`
- [ ] Confirm

### Create Proposal
- [ ] DAO → `createProposal()`
- [ ] Parameters:
  - _title: `"Test Proposal"`
  - _description: `"Testing voting"`
- [ ] Confirm

### Vote
- [ ] DAO → `vote()`
- [ ] Parameters:
  - _proposalId: `1`
  - _votes: `1`
  - _choice: `1` (yes)
- [ ] Confirm
- [ ] ✅ Check success

### Verify
- [ ] DAO → `getProposal(1)` → check votes
- [ ] Etherscan → search DAO address

## 📝 Hasil Final

Save ini di file:
```
Token Address:  0x...
DAO Address:    0x...
Network:        Sepolia
Date:           [date]
```

---

**DONE! 🎉 Contracts live di Sepolia!**
