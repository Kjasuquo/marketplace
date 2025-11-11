import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MarketplaceNFTModule", (m) => {
  // Deploy the MarketplaceNFT contract (no constructor args)
  const marketplaceNFT = m.contract("MarketplaceNFT");

  return { marketplaceNFT };
});