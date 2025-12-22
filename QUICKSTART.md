# ⚡ Quick Start - Voting System

## 🚀 In 3 Easy Steps

### Step 1️⃣: Start the Blockchain (Terminal 1)
```bash
npm run node
```
Wait for: `Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/`

### Step 2️⃣: Deploy Contracts (Terminal 2)
```bash
npx hardhat run deploy-local.js --network localhost
```
This creates the token, DAO, and a test proposal.

### Step 3️⃣: Start Frontend (Terminal 3)
```bash
npm run dev
```

## 🔗 Configure MetaMask

1. Open MetaMask
2. Click network dropdown → "Add Network Manually"
3. Enter:
   - Network Name: `Localhost 8545`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency: `ETH`
4. Click "Save"
5. MetaMask should show ~1000 ARC tokens

## 🗳️ Cast a Vote

1. Go to the DAO page
2. Click "Vote" on any proposal
3. Select:
   - Vote type: Yes/No/Abstain
   - Number of votes: 1-100
4. See cost: 1² = 1 ARC
5. Click "Vote Yes" (or your choice)
6. MetaMask popup appears → Click "Confirm"
7. Wait for transaction (~10 seconds)
8. See ✅ "Vote cast successfully!"

## 📊 Check Results

```bash
npx hardhat run check-votes.js --network localhost
```

## 🧪 Run Tests

```bash
npm test
```

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot connect to localhost:8545" | Make sure `npm run node` is running in Terminal 1 |
| MetaMask shows wrong network | Switch to "Localhost 8545" in MetaMask dropdown |
| No ARC tokens in wallet | Run `deploy-local.js` script |
| Vote button disabled | Check if you have enough tokens (1000 ARC) |
| Transaction fails | Reload page and try again |

## 📚 More Info

- Read: `VOTING_SETUP.md` for detailed setup
- Read: `VOTING_FIXES.md` for what was fixed
- Run: `npm test` to verify everything works

## ✅ You're Ready!

The voting system is now fully functional and tested. Vote away! 🎉
