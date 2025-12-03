# Lending Interface

Interface library for CustomMorpho lending protocol on Giwa Sepolia testnet.

## Features

- ✅ **Supply UPETH** - Earn interest on your UPETH
- ✅ **Borrow UPETH** - Use UPKRW as collateral
- ✅ **Custom Liquidation** - Kimchi premium based liquidation
- ✅ **Market Stats** - Real-time APR, utilization, prices

## Installation

```bash
npm install
```

## Quick Start

### 1. Set up environment variables

```bash
export PRIVATE_KEY=0x...your_private_key
```

### 2. Check market stats

```bash
npm run example:stats
```

### 3. Supply UPETH (earn interest)

```bash
npm run example:supply
```

### 4. Borrow UPETH (using UPKRW collateral)

```bash
npm run example:borrow
```

### 5. Liquidate (if kimchi premium > 3%)

```bash
npm run example:liquidate
```

## Deployed Contracts (Giwa Sepolia)

| Contract | Address |
|----------|---------|
| **CustomMorpho** | `0xf31D0A92Ab90096a5d895666B5dEDA3639d185B2` |
| **UPETH** (loan token) | `0xc05bAe1723bd929306B0ab8125062Efc111fb338` |
| **UPKRW** (collateral) | `0x159C54accF62C14C117474B67D2E3De8215F5A72` |
| **Oracle** | `0x258d90F00eEd27c69514A934379Aa41Cc03ea875` |
| **IRM** | `0xA99676204e008B511dA8662F9bE99e2bfA5afd63` |

**Market ID**: `0x5fdc9fa54b964034b39b1b36ec4b8b009bbf1448cdc951cbb05f647c42d9149f`

## Usage

### Supply UPETH

```typescript
import { createWallet, supplyUPETH } from "./src/morpho";

const wallet = createWallet(process.env.PRIVATE_KEY);
const hash = await supplyUPETH(wallet, "100"); // Supply 100 UPETH
console.log("Transaction:", hash);
```

### Borrow UPETH

```typescript
import { createWallet, supplyCollateralUPKRW, borrowUPETH } from "./src/morpho";

const wallet = createWallet(process.env.PRIVATE_KEY);

// 1. Supply collateral
await supplyCollateralUPKRW(wallet, "10000000"); // 10M UPKRW

// 2. Borrow
await borrowUPETH(wallet, "1.5"); // Borrow 1.5 UPETH
```

### Check Liquidation Opportunity

```typescript
import { getKimchiPremium, customLiquidate } from "./src/morpho";

const kimchi = await getKimchiPremium();

if (kimchi >= 0.03) {
  // Kimchi premium > 3%, can liquidate!
  await customLiquidate(wallet, borrowerAddress, "1000");
}
```

### Get Market Stats

```typescript
import { getMarketStats } from "./src/utils";

const stats = await getMarketStats();
console.log(stats);
// {
//   totalSupply: "10000.00",
//   totalBorrow: "1000.00",
//   ethPriceKrw: "4566000",
//   kimchiPremiumPercent: "1.45",
//   aprPercent: "10.00",
//   utilizationPercent: "10.00"
// }
```

## API Reference

### morpho.ts

- `supplyUPETH(wallet, amount)` - Supply UPETH to earn interest
- `supplyCollateralUPKRW(wallet, amount)` - Supply UPKRW as collateral
- `borrowUPETH(wallet, amount)` - Borrow UPETH
- `repayUPETH(wallet, amount)` - Repay borrowed UPETH
- `customLiquidate(wallet, borrower, seizedAssets)` - Liquidate with custom conditions

### utils.ts

- `getEthPriceInKrw()` - Get current ETH price in KRW
- `getKimchiPremium()` - Get kimchi premium percentage
- `getCurrentAPR()` - Get current interest rate
- `getUtilization()` - Get market utilization
- `getMarketInfo()` - Get detailed market state
- `getMarketStats()` - Get all stats at once

## Market Parameters

- **Loan Token**: UPETH (test ETH token)
- **Collateral Token**: UPKRW (test KRW token)
- **LLTV**: 92% (liquidation threshold)
- **IRM**: Simple utilization model (APR = Utilization)
- **Oracle**: 1 ETH = 4,566,000 KRW (mock)
- **Kimchi Premium Threshold**: 3%

## Custom Liquidation

This protocol supports **kimchi premium based liquidation**:

1. **Normal liquidation**: When collateral value < LLTV (92%)
2. **Kimchi premium liquidation**: When kimchi premium > 3%
3. **Custom metric liquidation**: Based on custom oracle metrics

## Development

```bash
# Build
npm run build

# Run examples
npm run example:supply
npm run example:borrow
npm run example:liquidate
npm run example:stats
```

## License

MIT

## Author

KORACLE

---

**Network**: Giwa Sepolia Testnet
**Chain ID**: 91342
**RPC**: https://sepolia-rpc.giwa.io
**Explorer**: https://sepolia-explorer.giwa.io
