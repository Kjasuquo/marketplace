"use client";

import { useState } from "react";
import { useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import {
  MARKETPLACE_NFT_ABI,
  MARKETPLACE_NFT_ADDRESS,
} from "@/contracts/MarketplaceNFT";

export default function MintButton() {
  const { address } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  const [toAddress, setToAddress] = useState("");

  const mintNFT = () => {
    if (!address) return alert("Connect wallet first");
    if (!toAddress) return alert("Enter a recipient address");

    writeContract({
      address: MARKETPLACE_NFT_ADDRESS,
      abi: MARKETPLACE_NFT_ABI,
      functionName: "mint",
      args: [
        toAddress,
        "ipfs://bafkreibqwiett36coxzypr36xx6zfd3rfihoh2hbhhi4472e4zyfe6pata",
      ],
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Recipient Address"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
        className="p-2 border rounded-md"
      />
      <button
        onClick={mintNFT}
        disabled={isPending}
        className="p-3 bg-blue-600 text-white rounded-lg"
      >
        {isPending ? "Minting..." : "Mint NFT"}
      </button>
    </div>
  );
}
