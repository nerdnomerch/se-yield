# OraPay - Buy Now, Pay Never DeFi Platform

OraPay is the first Buy Now Pay Never DeFi platform on SEI Network where users can shop using rewards from their deposits while keeping their original deposit intact.

![OraPay Banner](https://via.placeholder.com/1200x300/4F46E5/FFFFFF?text=OraPay)

## 🚀 Overview

OraPay revolutionizes the DeFi shopping experience by allowing users to make purchases using only the yield generated from their deposits, while keeping their principal amount safe and intact. This innovative approach combines the benefits of yield farming with practical utility.

## ✨ Key Features

- 🛡️ **Keep Your Deposit Safe** - Your deposited money remains untouched
- 💰 **Fixed 5% APY** - Stable and predictable yield on deposits
- 🛍️ **Shop Without Spending** - Use upfront rewards at partner merchants
- ⏰ **Flexible Withdrawals** - Access deposits after 30-day minimum period
- ⚡ **SEI Network Powered** - Built on SEI's fast and efficient blockchain

## 🏗️ Project Structure

The project consists of two main components:

- `orapay-frontend/` - Next.js frontend application with TypeScript
- `orapay-contracts/` - Solidity smart contracts using Foundry

## 🔧 Tech Stack

### Frontend
- Next.js 14 with App Router
- TypeScript
- TailwindCSS with shadcn/ui components
- RainbowKit for wallet connection
- wagmi for blockchain interactions
- viem for Ethereum interactions
- Framer Motion for animations

### Smart Contracts
- Solidity 0.8.24
- Foundry for development and testing
- OpenZeppelin contracts for security standards
- SEI Network compatibility

## 📝 Contract Architecture

The protocol consists of the following main contracts:

1. **Token Contracts**:
   - MockUSDC: A mock USDC token for testing
   - PSYLD: Principal OraPay token received by users when depositing
   - YSYLD: Yield OraPay token received by the platform

2. **Core Protocol**:
   - Treasury: Manages protocol fees and payments
   - MockYieldProtocol: Simulates a yield-generating protocol
   - FundsVault: Main contract for user deposits and yield management

3. **Auxiliary Contracts**:
   - Faucet: Provides test tokens to users
   - Merchant: Manages marketplace listings and purchases

## 🌐 Contract Addresses (SEI Testnet)

```
USDC_ADDRESS=0x953e5610c73c989fe7c75d3d67be0a1e44a8e797
PSYLD_ADDRESS=0x13cf4e3e284d34c575ceeccb0791ca535a657da2
YSYLD_ADDRESS=0xf12cd252ca50781ec88c2d8832ca4f9c4bf11d82
TREASURY_ADDRESS=0xd2b0838ff0818e9aa185a712576cb3ee0885deda
YIELD_PROTOCOL_ADDRESS=0x0d5cb2123da148b83872c6977265b3a77b2e208d
FUNDS_VAULT_ADDRESS=0xe5f56371f2c27cbbd3dd8eecedcd3b53847c6b05
FAUCET_ADDRESS=0x0814c0e18f8a275f58a4a74aa5183f9e0dd324e6
MERCHANT_ADDRESS=0x7456733cb8d301cbee45c89e0aeb46edda511e7e
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Foundry (for smart contract development)
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/orapay.git
cd orapay
```

2. Install dependencies for both projects
```bash
# Frontend
cd orapay-frontend
pnpm install

# Contracts
cd ../orapay-contracts
forge install
```

3. Set up environment variables
```bash
# Frontend
cd orapay-frontend
cp .env.example .env.local
# Edit .env.local with your values

# Contracts
cd ../orapay-contracts
cp .env.example .env
# Edit .env with your values
```

4. Run the development environment
```bash
# Frontend
cd orapay-frontend
pnpm dev

# Contracts
cd orapay-contracts
forge test
```

## 🧪 Testing

### Frontend
```bash
cd orapay-frontend
pnpm test
```

### Smart Contracts
```bash
cd orapay-contracts
forge test
```

For detailed test coverage:
```bash
forge coverage
```

## 📦 Deployment

### Frontend
The frontend is configured for deployment on Vercel:

```bash
cd orapay-frontend
pnpm build
```

### Smart Contracts
To deploy to SEI testnet:

```bash
cd orapay-contracts
make deploy-sei-testnet-no-sei
```

For contract verification:
```bash
make verify-sei CONTRACT_ADDRESS=<address> CONTRACT_NAME=<name>
```

## 📚 Documentation

- Frontend: See `orapay-frontend/README.md` for detailed frontend documentation
- Smart Contracts: See `orapay-contracts/README.md` for detailed contract documentation
- Deployment: See `orapay-contracts/DEPLOYMENT.md` for deployment instructions

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For questions or support, please open an issue in the repository.
