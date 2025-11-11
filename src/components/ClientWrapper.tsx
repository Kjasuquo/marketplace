"use client";

import { useEffect, useState } from "react";
import { Providers } from "../config/provider/wallet";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import AccountDisplay from "./AccountDisplay";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // ✅ Prevent SSR vs client mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null; // Render nothing until client hydration
  }

  return (
    <Providers>
      <div className="flex justify-center p-6">
        <ConnectButton />
        <AccountDisplay />
      </div>
      {children}
    </Providers>
  );
}
