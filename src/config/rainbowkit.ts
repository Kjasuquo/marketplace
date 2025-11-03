
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, sepolia } from "wagmi/chains";

// ❗ Do NOT add "use client" here
export const wagmiConfig = getDefaultConfig({
  appName: "Marketplace",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  chains: [mainnet, polygon, sepolia],
  ssr: true,
});
