import {
  createWallet,
  supplyCollateralUPKRW,
  borrowUPETH,
} from "../src/morpho";
import { getMarketStats, getEthPriceInKrw } from "../src/utils";

async function main() {
  const privateKey = process.env.PRIVATE_KEY as `0x${string}`;

  if (!privateKey) {
    throw new Error("PRIVATE_KEY environment variable not set");
  }

  console.log("=== Borrow UPETH Example ===\n");

  const wallet = createWallet(privateKey);
  console.log("Wallet address:", wallet.account.address);

  // Get ETH price
  const ethPrice = await getEthPriceInKrw();
  console.log(`\n1 ETH = ${ethPrice.toFixed(0)} KRW`);

  // Step 1: Supply collateral (10M UPKRW)
  console.log("\n[1/2] Supplying 10,000,000 UPKRW as collateral...");
  const collateralHash = await supplyCollateralUPKRW(wallet, "10000000");
  console.log("Collateral tx:", collateralHash);

  // Step 2: Borrow UPETH
  // With 92% LLTV and 10M KRW collateral:
  // Max borrow = (10M / ethPrice) * 0.92
  // Example: (10M / 4,566,000) * 0.92 = 2.01 ETH
  // We'll borrow 1.5 ETH to be safe
  console.log("\n[2/2] Borrowing 1.5 UPETH...");
  const borrowHash = await borrowUPETH(wallet, "1.5");
  console.log("Borrow tx:", borrowHash);

  // Get market stats
  console.log("\nMarket stats:");
  const stats = await getMarketStats();
  console.log(stats);

  console.log("\nDone! You have borrowed 1.5 UPETH.");
  console.log("Remember to repay before liquidation!");
}

main().catch(console.error);
