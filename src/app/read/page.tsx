"use client";

import ReadNFT from "@/components/readNFT";

export default function Home() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Marketplace</h1>
      <ReadNFT />
    </div>
  );
}