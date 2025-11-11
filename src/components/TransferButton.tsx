// components/TransferButton.tsx
"use client";

import { useState } from "react";
import { useWriteContract, useAccount } from "wagmi";
import { MARKETPLACE_NFT_ABI, MARKETPLACE_NFT_ADDRESS } from "@/contracts/MarketplaceNFT";

export default function TransferButton() {
  const { address, isConnected } = useAccount();
  const [toAddress, setToAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const { writeContract, isPending, error } = useWriteContract();

  const handleTransfer = () => {
    // Validate only when user clicks
    if (!isConnected || !address) {
      alert("Please connect your wallet");
      return;
    }
    if (!toAddress || !toAddress.startsWith("0x") || toAddress.length !== 42) {
      alert("Enter a valid recipient address (0x...)");
      return;
    }
    if (!tokenId || isNaN(Number(tokenId))) {
      alert("Enter a valid token ID (number)");
      return;
    }

    writeContract({
      address: MARKETPLACE_NFT_ADDRESS,
      abi: MARKETPLACE_NFT_ABI,
      functionName: "transferNFT",
      args: [address, toAddress as `0x${string}`, BigInt(tokenId)],
    });
  };

  return (
    <div className="space-y-4 p-6 bg-white rounded-xl shadow-md max-w-md mx-auto">
      <h3 className="text-lg font-bold">Transfer NFT</h3>

      {/* Recipient Input */}
      <input
        type="text"
        placeholder="Recipient: 0x..."
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      {/* Token ID Input */}
      <input
        type="text"
        placeholder="Token ID (e.g. 1)"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value.replace(/\D/g, ""))} // Only numbers
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      {/* Transfer Button */}
      <button
        onClick={handleTransfer}
        disabled={isPending || !isConnected}
        className={`w-full p-3 rounded-lg font-bold text-white transition ${
          isPending || !isConnected
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700"
        }`}
      >
        {isPending ? "Sending..." : "Transfer NFT"}
      </button>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm">
          Error: {(error as any).shortMessage || "Transaction failed"}
        </p>
      )}
    </div>
  );
}