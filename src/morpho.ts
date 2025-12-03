import {
  createPublicClient,
  createWalletClient,
  http,
  parseUnits,
  type Address,
  type Hash,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { ADDRESSES, GIWA_SEPOLIA } from "./constants";
import { marketParams } from "./market";
import morphoAbi from "./abis/IMorpho.json";
import erc20Abi from "./abis/ERC20.json";

// Create clients
export const publicClient = createPublicClient({
  chain: GIWA_SEPOLIA,
  transport: http(),
});

export function createWallet(privateKey: `0x${string}`) {
  const account = privateKeyToAccount(privateKey);
  return createWalletClient({
    account,
    chain: GIWA_SEPOLIA,
    transport: http(),
  });
}

/**
 * Supply UPETH to earn interest
 * @param walletClient Wallet client with private key
 * @param amountEth Amount of UPETH to supply (e.g., "100" for 100 UPETH)
 * @returns Transaction hash
 */
export async function supplyUPETH(
  walletClient: ReturnType<typeof createWallet>,
  amountEth: string
): Promise<Hash> {
  const assets = parseUnits(amountEth, 18);

  // 1. Approve UPETH
  const approveHash = await walletClient.writeContract({
    address: ADDRESSES.UPETH,
    abi: erc20Abi,
    functionName: "approve",
    args: [ADDRESSES.MORPHO, assets],
  });
  await publicClient.waitForTransactionReceipt({ hash: approveHash });

  // 2. Supply
  const supplyHash = await walletClient.writeContract({
    address: ADDRESSES.MORPHO,
    abi: morphoAbi,
    functionName: "supply",
    args: [marketParams, assets, 0n, walletClient.account.address, "0x"],
  });

  return supplyHash;
}

/**
 * Supply UPKRW as collateral
 * @param walletClient Wallet client with private key
 * @param amountKrw Amount of UPKRW (e.g., "1000000" for 1M UPKRW)
 * @returns Transaction hash
 */
export async function supplyCollateralUPKRW(
  walletClient: ReturnType<typeof createWallet>,
  amountKrw: string
): Promise<Hash> {
  const assets = parseUnits(amountKrw, 18);

  // 1. Approve UPKRW
  const approveHash = await walletClient.writeContract({
    address: ADDRESSES.UPKRW,
    abi: erc20Abi,
    functionName: "approve",
    args: [ADDRESSES.MORPHO, assets],
  });
  await publicClient.waitForTransactionReceipt({ hash: approveHash });

  // 2. Supply collateral
  const supplyHash = await walletClient.writeContract({
    address: ADDRESSES.MORPHO,
    abi: morphoAbi,
    functionName: "supplyCollateral",
    args: [marketParams, assets, walletClient.account.address, "0x"],
  });

  return supplyHash;
}

/**
 * Borrow UPETH using UPKRW collateral
 * @param walletClient Wallet client with private key
 * @param amountEth Amount of UPETH to borrow (e.g., "10" for 10 UPETH)
 * @returns Transaction hash
 */
export async function borrowUPETH(
  walletClient: ReturnType<typeof createWallet>,
  amountEth: string
): Promise<Hash> {
  const assets = parseUnits(amountEth, 18);

  const hash = await walletClient.writeContract({
    address: ADDRESSES.MORPHO,
    abi: morphoAbi,
    functionName: "borrow",
    args: [
      marketParams,
      assets,
      0n,
      walletClient.account.address,
      walletClient.account.address,
    ],
  });

  return hash;
}

/**
 * Repay borrowed UPETH
 * @param walletClient Wallet client with private key
 * @param amountEth Amount of UPETH to repay (e.g., "10" for 10 UPETH)
 * @returns Transaction hash
 */
export async function repayUPETH(
  walletClient: ReturnType<typeof createWallet>,
  amountEth: string
): Promise<Hash> {
  const assets = parseUnits(amountEth, 18);

  // 1. Approve UPETH
  const approveHash = await walletClient.writeContract({
    address: ADDRESSES.UPETH,
    abi: erc20Abi,
    functionName: "approve",
    args: [ADDRESSES.MORPHO, assets],
  });
  await publicClient.waitForTransactionReceipt({ hash: approveHash });

  // 2. Repay
  const repayHash = await walletClient.writeContract({
    address: ADDRESSES.MORPHO,
    abi: morphoAbi,
    functionName: "repay",
    args: [marketParams, assets, 0n, walletClient.account.address, "0x"],
  });

  return repayHash;
}

/**
 * Liquidate a position using custom liquidation (kimchi premium)
 * @param walletClient Wallet client with private key
 * @param borrower Address of the borrower to liquidate
 * @param seizedAssets Amount of collateral to seize
 * @returns Transaction hash
 */
export async function customLiquidate(
  walletClient: ReturnType<typeof createWallet>,
  borrower: Address,
  seizedAssets: string
): Promise<Hash> {
  const assets = parseUnits(seizedAssets, 18);

  const hash = await walletClient.writeContract({
    address: ADDRESSES.MORPHO,
    abi: morphoAbi,
    functionName: "customLiquidate",
    args: [marketParams, borrower, assets, 0n, "0x"],
  });

  return hash;
}
