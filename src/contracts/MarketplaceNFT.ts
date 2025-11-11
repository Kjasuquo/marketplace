import abi from "./MarketplaceNFT.json";

export const MARKETPLACE_NFT_ABI = abi as readonly any[];

export const MARKETPLACE_NFT_ADDRESS =
  process.env.NEXT_PUBLIC_MARKETPLACE_NFT_CONTRACT! as `0x${string}`;
