import {
  getMarketStats,
  getEthPriceInKrw,
  getKimchiPremium,
  getCurrentAPR,
} from "../src/utils";

async function main() {
  console.log("=== Market Statistics ===\n");

  // Get all stats at once
  const stats = await getMarketStats();

  console.log("Total Supply:", stats.totalSupply, "UPETH");
  console.log("Total Borrow:", stats.totalBorrow, "UPETH");
  console.log("Utilization:", stats.utilizationPercent, "%");
  console.log("Current APR:", stats.aprPercent, "%");
  console.log("\nETH Price:", stats.ethPriceKrw, "KRW");
  console.log("Kimchi Premium:", stats.kimchiPremiumPercent, "%");

  // Individual queries
  console.log("\n=== Detailed Info ===\n");

  const ethPrice = await getEthPriceInKrw();
  console.log("1 ETH =", ethPrice.toFixed(0), "KRW");

  const kimchi = await getKimchiPremium();
  console.log("Kimchi Premium:", (kimchi * 100).toFixed(4), "%");

  const apr = await getCurrentAPR();
  console.log("APR:", (apr * 100).toFixed(4), "%");

  // Check liquidation condition
  console.log("\n=== Liquidation Status ===");
  if (kimchi >= 0.03) {
    console.log("ALERT: Kimchi premium above 3%! Custom liquidation active.");
  } else {
    console.log("Kimchi premium below threshold. No custom liquidation.");
  }
}

main().catch(console.error);
