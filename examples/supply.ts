import { createWallet, supplyUPETH } from "../src/morpho";
import { getMarketStats } from "../src/utils";

async function main() {
  // IMPORTANT: Replace with your private key!
  const privateKey = process.env.PRIVATE_KEY as `0x${string}`;

  if (!privateKey) {
    throw new Error("PRIVATE_KEY environment variable not set");
  }

  console.log("=== Supply UPETH Example ===\n");

  // Create wallet
  const wallet = createWallet(privateKey);
  console.log("Wallet address:", wallet.account.address);

  // Get market stats before
  console.log("\nMarket stats before:");
  const statsBefore = await getMarketStats();
  console.log(statsBefore);

  // Supply 100 UPETH
  console.log("\nSupplying 100 UPETH...");
  const hash = await supplyUPETH(wallet, "100");
  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmation...");

  // Get market stats after
  console.log("\nMarket stats after:");
  const statsAfter = await getMarketStats();
  console.log(statsAfter);

  console.log("\nDone! You are now earning interest on your UPETH.");
}

main().catch(console.error);
