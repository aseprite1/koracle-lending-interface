import { formatUnits } from "viem";
import { publicClient } from "./morpho";
import { ADDRESSES, MARKET_ID } from "./constants";
import { type MarketInfo } from "./market";
import oracleAbi from "./abis/IOracle.json";
import morphoAbi from "./abis/IMorpho.json";

/**
 * Get current ETH price in KRW from oracle
 * @returns Price (1 ETH = X KRW)
 */
export async function getEthPriceInKrw(): Promise<number> {
  const price = await publicClient.readContract({
    address: ADDRESSES.ORACLE,
    abi: oracleAbi,
    functionName: "price",
  });

  // Price is scaled by 1e36, we need to convert
  // 1 UPKRW = price * UPETH (in 1e36 scale)
  // So 1 UPETH = 1e36 / price UPKRW
  const ethPriceInKrw = Number(formatUnits(1000000000000000000000000000000000000n / (price as bigint), 18));
  return ethPriceInKrw;
}

/**
 * Get kimchi premium percentage
 * @returns Kimchi premium (e.g., 0.0145 = 1.45%)
 */
export async function getKimchiPremium(): Promise<number> {
  const premium = await publicClient.readContract({
    address: ADDRESSES.ORACLE,
    abi: oracleAbi,
    functionName: "kimchiPremium",
  });

  return Number(formatUnits(premium as bigint, 18));
}

/**
 * Get custom metric from oracle
 * @returns Custom metric value
 */
export async function getCustomMetric(): Promise<number> {
  const metric = await publicClient.readContract({
    address: ADDRESSES.ORACLE,
    abi: oracleAbi,
    functionName: "customMetric",
  });

  return Number(formatUnits(metric as bigint, 18));
}

/**
 * Get market information
 * @returns Market state
 */
export async function getMarketInfo(): Promise<MarketInfo> {
  const marketData = await publicClient.readContract({
    address: ADDRESSES.MORPHO,
    abi: morphoAbi,
    functionName: "market",
    args: [MARKET_ID],
  });

  const [
    totalSupplyAssets,
    totalSupplyShares,
    totalBorrowAssets,
    totalBorrowShares,
    lastUpdate,
    fee,
  ] = marketData as [bigint, bigint, bigint, bigint, bigint, bigint];

  return {
    totalSupplyAssets,
    totalSupplyShares,
    totalBorrowAssets,
    totalBorrowShares,
    lastUpdate,
    fee,
  };
}

/**
 * Calculate current APR based on utilization
 * Formula: APR = Utilization (in IrmMock)
 * @returns APR as decimal (e.g., 0.5 = 50%)
 */
export async function getCurrentAPR(): Promise<number> {
  const marketInfo = await getMarketInfo();

  if (marketInfo.totalSupplyAssets === 0n) {
    return 0;
  }

  // Utilization = totalBorrowAssets / totalSupplyAssets
  const utilization =
    Number(formatUnits(marketInfo.totalBorrowAssets, 18)) /
    Number(formatUnits(marketInfo.totalSupplyAssets, 18));

  // In IrmMock, APR = Utilization
  return utilization;
}

/**
 * Get utilization rate
 * @returns Utilization (e.g., 0.5 = 50%)
 */
export async function getUtilization(): Promise<number> {
  const marketInfo = await getMarketInfo();

  if (marketInfo.totalSupplyAssets === 0n) {
    return 0;
  }

  return (
    Number(formatUnits(marketInfo.totalBorrowAssets, 18)) /
    Number(formatUnits(marketInfo.totalSupplyAssets, 18))
  );
}

/**
 * Format big number to readable string
 * @param value BigInt value
 * @param decimals Token decimals
 * @param precision Display precision
 * @returns Formatted string
 */
export function formatAmount(
  value: bigint,
  decimals: number = 18,
  precision: number = 2
): string {
  const num = Number(formatUnits(value, decimals));
  return num.toFixed(precision);
}

/**
 * Get all market stats at once
 * @returns Market statistics
 */
export async function getMarketStats() {
  const [marketInfo, ethPrice, kimchiPremium, apr, utilization] =
    await Promise.all([
      getMarketInfo(),
      getEthPriceInKrw(),
      getKimchiPremium(),
      getCurrentAPR(),
      getUtilization(),
    ]);

  return {
    totalSupply: formatAmount(marketInfo.totalSupplyAssets),
    totalBorrow: formatAmount(marketInfo.totalBorrowAssets),
    ethPriceKrw: ethPrice.toFixed(0),
    kimchiPremiumPercent: (kimchiPremium * 100).toFixed(2),
    aprPercent: (apr * 100).toFixed(2),
    utilizationPercent: (utilization * 100).toFixed(2),
  };
}
