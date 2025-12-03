import { createWallet, customLiquidate } from "../src/morpho";
import { getKimchiPremium, getMarketStats } from "../src/utils";

async function main() {
  const privateKey = process.env.PRIVATE_KEY as `0x${string}`;

  if (!privateKey) {
    throw new Error("PRIVATE_KEY environment variable not set");
  }

  console.log("=== Custom Liquidate Example ===\n");

  const wallet = createWallet(privateKey);
  console.log("Liquidator address:", wallet.account.address);

  // Check kimchi premium
  const kimchiPremium = await getKimchiPremium();
  console.log(`\nKimchi Premium: ${(kimchiPremium * 100).toFixed(2)}%`);

  // Check if above threshold (3%)
  if (kimchiPremium < 0.03) {
    console.log("Kimchi premium is below 3% threshold.");
    console.log("Cannot liquidate based on kimchi premium condition.");
    return;
  }

  console.log("Kimchi premium is above 3%! Liquidation possible.");

  // Replace with actual borrower address
  const borrowerAddress = "0xBORROWER_ADDRESS_HERE" as `0x${string}`;

  // Liquidate by seizing 1000 UPKRW collateral
  console.log(`\nLiquidating ${borrowerAddress}...`);
  console.log("Seizing 1000 UPKRW collateral...");

  const hash = await customLiquidate(wallet, borrowerAddress, "1000");
  console.log("Liquidation tx:", hash);

  // Get market stats
  console.log("\nMarket stats after liquidation:");
  const stats = await getMarketStats();
  console.log(stats);

  console.log("\nDone! Liquidation profit earned.");
}

main().catch(console.error);
