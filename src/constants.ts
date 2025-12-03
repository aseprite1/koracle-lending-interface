// Deployed contract addresses on Giwa Sepolia
export const ADDRESSES = {
  MORPHO: "0xf31D0A92Ab90096a5d895666B5dEDA3639d185B2" as const,
  UPETH: "0xc05bAe1723bd929306B0ab8125062Efc111fb338" as const, // loan token
  UPKRW: "0x159C54accF62C14C117474B67D2E3De8215F5A72" as const, // collateral token
  ORACLE: "0x258d90F00eEd27c69514A934379Aa41Cc03ea875" as const,
  IRM: "0xA99676204e008B511dA8662F9bE99e2bfA5afd63" as const,
} as const;

// Market ID (pre-calculated)
export const MARKET_ID =
  "0x5fdc9fa54b964034b39b1b36ec4b8b009bbf1448cdc951cbb05f647c42d9149f" as const;

// Market parameters
export const LLTV = 920000000000000000n; // 92% as BigInt

// Chain configuration
export const GIWA_SEPOLIA = {
  id: 91342,
  name: "Giwa Sepolia",
  network: "giwa-sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://sepolia-rpc.giwa.io"] },
    public: { http: ["https://sepolia-rpc.giwa.io"] },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://sepolia-explorer.giwa.io" },
  },
} as const;
