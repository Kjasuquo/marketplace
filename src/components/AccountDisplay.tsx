"use client";
import { useAccount } from "wagmi";

export default function AccountDisplay() {
  const { address, isConnected } = useAccount();

  if (!isConnected) return <p>Not connected</p>;
  return <p>Connected wallet : {address}</p>;
}
