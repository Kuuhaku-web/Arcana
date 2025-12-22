# 🚀 Deploy ke Remix + Sepolia Testnet

## 📋 Persiapan

### 1. Wallet Setup
- Pastikan MetaMask sudah install
- **Switch ke Sepolia testnet** di MetaMask
- Dapatkan Sepolia ETH di: https://sepolia-faucet.pk910.de/

### 2. Siapkan File Contract
Dua file contract sudah ready untuk Remix:
- `CampusToken-Remix.sol` - Token contract
- `ArcanaDAO-Remix.sol` - DAO contract

---

## 🔧 Step 1: Deploy Token di Remix

### 1. Buka Remix IDE
- Kunjungi: https://remix.ethereum.org/

### 2. Import/Create File
- Klik "+" di file explorer
- Nama: `CampusToken.sol`
- Copy-paste isi dari `CampusToken-Remix.sol`

### 3. Compile Contract
- Klik tab "Solidity Compiler" (kiri)
- Compiler version: `0.8.20` atau lebih tinggi
- Klik "Compile CampusToken.sol"
- Tunggu hingga ✅ (hijau)

### 4. Deploy Token
- Klik tab "Deploy & run transactions" (kiri)
- **Environment**: Injected Provider (MetaMask)
- **Contract**: CampusToken
- **Constructor parameter**: `1000` (untuk initial supply 1000 token)
- Klik orange button "Deploy"
- Confirm di MetaMask popup
- Tunggu transaction confirm (~30 detik)

### 5. Catat Token Address
Token address akan muncul di bawah "Deployed Contracts"
**Contoh**: `0x1234...abcd`

---

## 🏛️ Step 2: Deploy DAO di Remix

### 1. Create File Baru
- Klik "+" di file explorer
- Nama: `ArcanaDAO.sol`
- Copy-paste isi dari `ArcanaDAO-Remix.sol`

### 2. Compile Contract
- Compiler sudah menggunakan yang sama
- Klik "Compile ArcanaDAO.sol"
- Tunggu hingga ✅

### 3. Deploy DAO
- Klik tab "Deploy & run transactions"
- **Contract**: ArcanaDAO
- **Constructor parameter**: Paste token address dari step sebelumnya
  - Format: `0x1234...abcd` (tanpa tanda kutip)
- Klik orange button "Deploy"
- Confirm di MetaMask
- Tunggu transaction confirm

### 4. Catat DAO Address
**Contoh**: `0x5678...efgh`

---

## ✅ Step 3: Test Voting di Remix

### 1. Setup Token
Di tab "Deploy & run transactions", cari "Deployed Contracts"

**Token Contract:**
- Expand token contract
- Klik `mint` function
- Parameters:
  - `to`: Wallet address Anda
  - `amount`: `1000`
  - `reason`: `"Testing voting"`
- Klik blue button
- Confirm di MetaMask

### 2. Approve DAO
**Token Contract:**
- Klik `approve` function
- Parameters:
  - `spender`: DAO address (dari deploy DAO)
  - `amount`: `1000000000000000000000` (1000 * 10^18)
- Klik blue button
- Confirm

### 3. Create Proposal
**DAO Contract:**
- Klik `createProposal` function
- Parameters:
  - `_title`: `"Test Proposal"`
  - `_description`: `"Testing voting mechanism"`
- Klik blue button
- Confirm

### 4. Cast Vote
**DAO Contract:**
- Klik `vote` function
- Parameters:
  - `_proposalId`: `1`
  - `_votes`: `1`
  - `_choice`: `1` (yes) atau `2` (no) atau `3` (abstain)
- Klik blue button
- Confirm
- ✅ Vote successful!

### 5. Check Results
**DAO Contract:**
- Klik `getProposal` (read function)
- Parameter: `1`
- Lihat vote results:
  - yesVotes
  - noVotes
  - abstainVotes

---

## 📊 Contoh Contract Address di Sepolia

Setelah deploy, Anda akan punya:

```
Token Address:  0x.....................
DAO Address:    0x.....................
Your Wallet:    0x.....................(dari MetaMask)
```

---

## 🔗 Verify di Block Explorer

1. Kunjungi: https://sepolia.etherscan.io/
2. Paste contract address
3. Lihat semua transactions dan state

---

## 🆘 Troubleshooting

| Error | Solusi |
|-------|--------|
| "MetaMask is not connected" | Klik icon MetaMask → Connect to website |
| "Wrong chain" | Switch ke Sepolia testnet di MetaMask |
| "Insufficient gas" | Minta Sepolia ETH dari faucet |
| "Compilation error" | Update compiler version ke 0.8.20 |
| "Deploy failed" | Check gas fee dan wallet balance |

---

## 💾 Simpan Addresses

Setelah deploy, simpan di file atau notepad:

```
SEPOLIA DEPLOYMENT
==================
Token Address: 0x...
DAO Address: 0x...
Wallet Address: 0x...
Deploy Date: [date]
```

---

## ✨ Done!

Contracts sudah live di Sepolia testnet! 🎉

Sekarang bisa:
- ✅ Create proposals
- ✅ Vote on proposals
- ✅ Check results
- ✅ Share dengan orang lain

Semua data simpan di blockchain Sepolia! 🔗
