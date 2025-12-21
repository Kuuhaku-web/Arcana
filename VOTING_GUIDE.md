# 🗳️ Quadratic Voting Implementation Guide

## Apa Itu Quadratic Voting?

Quadratic Voting adalah sistem voting di mana biaya voting meningkat secara kuadratik. Artinya:
- 1 vote = 1 token
- 2 votes = 4 tokens (2²)
- 3 votes = 9 tokens (3²)
- 5 votes = 25 tokens (5²)

**Keuntungan:**
- Mencegah whale (individu dengan banyak token) mendominasi voting
- Lebih demokratis dan adil
- Mendorong partisipasi yang thoughtful, bukan spam voting

---

## Setup & Deployment

### Smart Contract Addresses
- **DAO Contract:** `0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9`
- **Token Contract:** `0x5FbDB2315678afecb367f032d93F642f64180aa3`

### Smart Contract Features
```solidity
✅ createProposal(title, description) - Create proposal
✅ vote(proposalId, votes, choice) - Cast vote
✅ calculateVoteCost(votes) - Hitung biaya voting
✅ getProposal(proposalId) - Fetch proposal details
✅ isVotingActive(proposalId) - Check voting status
✅ getProposalVotes(proposalId) - Get all votes
```

---

## Frontend Integration

### 1. VotingModal Component (`src/components/VotingModal.jsx`)
- UI popup untuk voting
- Input jumlah votes (1-100)
- Live cost calculation
- Error handling

### 2. QuadraticVotingUtil (`src/utils/quadraticVoting.js`)
Utility functions:
```javascript
QuadraticVotingUtil.calculateVoteCost(votes)
  → Returns: votes²

QuadraticVotingUtil.castVote(daoAddress, tokenAddress, signer, proposalId, votes, choice)
  → Returns: { success, txHash, voteCost, message/error }

QuadraticVotingUtil.getProposal(daoAddress, provider, proposalId)
  → Returns: Proposal details

QuadraticVotingUtil.isVotingActive(daoAddress, provider, proposalId)
  → Returns: boolean

QuadraticVotingUtil.getProposalVotes(daoAddress, provider, proposalId)
  → Returns: Array of votes
```

### 3. Dao.jsx Integration
- Import VotingModal dan QuadraticVotingUtil
- State management untuk modal
- handleVote function dengan MetaMask integration
- Vote button di proposal cards

---

## How to Use (User Perspective)

### Voting Flow:
1. User lihat proposal di DAO page
2. Klik tombol "🗳️ Cast Your Vote"
3. VotingModal muncul
4. User pilih: Yes / No / Abstain
5. User input jumlah votes (1-100)
6. Modal tunjukkan cost: votes²
7. User klik "Vote [Choice]"
8. MetaMask approve request
9. Smart contract catat vote
10. Modal tutup, success message

### Example:
```
User ingin vote "Yes" dengan 5 votes pada proposal #1

Modal tampilkan:
- Choice selected: Yes
- Votes: 5
- Cost: 25 ARC (5² = 25)

User klik "Vote Yes"
↓
MetaMask approve 25 ARC token spending
↓
Smart contract transfer 25 ARC ke DAO
↓
Smart contract record: 5 yes votes untuk proposal #1
↓
User account di smart contract: -25 ARC (locked)
```

---

## Configuration

### Change Contract Addresses
Edit di `src/Dao.jsx`:
```jsx
const DAO_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
```

### Voting Duration
Default: 7 hari (di smart contract)
Edit di `contracts/ArcanaDAO.sol`:
```solidity
uint256 public votingDuration = 7 days;
```

---

## Testing

### Create Test Proposal
```javascript
const daoContract = new ethers.Contract(DAO_ADDRESS, DAO_ABI, signer);
await daoContract.createProposal(
  "Test Proposal",
  "This is a test proposal"
);
```

### Cast Vote
```javascript
const result = await QuadraticVotingUtil.castVote(
  DAO_ADDRESS,
  TOKEN_ADDRESS,
  signer,
  1,        // proposalId
  5,        // votes (will cost 25 tokens)
  1         // choice: 1=yes, 2=no, 3=abstain
);
```

### Check Proposal
```javascript
const proposal = await QuadraticVotingUtil.getProposal(
  DAO_ADDRESS,
  provider,
  1
);
console.log(proposal.yesVotes, proposal.noVotes, proposal.abstainVotes);
```

---

## Architecture

```
Dao.jsx
├── State: showVotingModal, selectedProposal, votingLoading
├── handleOpenVotingModal() → Opens modal with selected proposal
├── handleVote() → Calls QuadraticVotingUtil.castVote()
│
└── VotingModal Component
    ├── Input: votes (1-100)
    ├── Input: choice (Yes/No/Abstain)
    ├── Display: Cost calculation (votes²)
    └── onVote() → handleVote() from parent
        │
        └── QuadraticVotingUtil.castVote()
            ├── Get MetaMask signer
            ├── Calculate cost (votes²)
            ├── Approve token spending
            └── Call smart contract vote()
                └── ArcanaDAO contract
                    ├── Transfer tokens
                    ├── Record vote
                    └── Update proposal state
```

---

## Error Handling

Common errors dan solusi:

### "Insufficient tokens"
- User tidak punya cukup token untuk voting cost
- Cost = votes²
- Solution: Mint/transfer lebih banyak ARC token

### "MetaMask not found"
- User belum install MetaMask
- Solution: Install MetaMask extension

### "Voting ended"
- Voting deadline sudah berlalu
- Solution: Tunggu proposal baru

### "Invalid proposal"
- proposalId tidak valid
- Solution: Check proposal ID yang benar

---

## Files Created/Modified

### Created:
- `src/contracts/ArcanaDAO.sol` - Smart contract
- `src/utils/quadraticVoting.js` - Utility functions
- `src/components/VotingModal.jsx` - Voting UI component
- `src/components/VotingModal.css` - Modal styling
- `contracts/ArcanaDAO.sol` - DAO contract
- `deployDAO.js` - Deploy script

### Modified:
- `src/Dao.jsx` - Integration dengan VotingModal
- `src/Dao.css` - Styling untuk vote button

---

## Next Steps

1. **Test Voting** - Coba cast votes di UI
2. **Monitor Proposals** - Check vote counts di smart contract
3. **Create More Proposals** - Add governance items
4. **Reward System** - Implement voting rewards

---

## Notes

- Voting tokens di-lock di smart contract selama voting period
- Setelah voting selesai, tokens bisa di-claim kembali
- Semua votes di-record on-chain (transparent)
- Max 100 votes per user per proposal
