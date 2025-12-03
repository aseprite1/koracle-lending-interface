import { ADDRESSES, LLTV, MARKET_ID } from "./constants";

// MarketParams structure (matches Morpho Blue)
export interface MarketParams {
  loanToken: `0x${string}`;
  collateralToken: `0x${string}`;
  oracle: `0x${string}`;
  irm: `0x${string}`;
  lltv: bigint;
}

// UPKRW/UPETH market parameters
export const marketParams: MarketParams = {
  loanToken: ADDRESSES.UPETH,
  collateralToken: ADDRESSES.UPKRW,
  oracle: ADDRESSES.ORACLE,
  irm: ADDRESSES.IRM,
  lltv: LLTV,
};

// Market object with ID
export const market = {
  params: marketParams,
  id: MARKET_ID as `0x${string}`,
};

// Market info type
export interface MarketInfo {
  totalSupplyAssets: bigint;
  totalSupplyShares: bigint;
  totalBorrowAssets: bigint;
  totalBorrowShares: bigint;
  lastUpdate: bigint;
  fee: bigint;
}
