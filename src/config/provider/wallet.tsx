"use client";

import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 1️⃣ Wallet + chain config
export const config = getDefaultConfig({
  appName: "Marketplace",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  chains: [mainnet, polygon, sepolia],
  ssr: false,
});

// 2️⃣ React Query client
const queryClient = new QueryClient();

// 3️⃣ Wrap providers
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
