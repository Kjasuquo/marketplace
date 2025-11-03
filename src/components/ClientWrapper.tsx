"use client";

import { Providers } from "../config/provider/wallet";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="flex justify-center p-6">
        <ConnectButton />
      </div>
      {children}
    </Providers>
  );
}
