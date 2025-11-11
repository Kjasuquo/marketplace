// src/components/MyNFTs.tsx
"use client";

import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { MARKETPLACE_NFT_ABI, MARKETPLACE_NFT_ADDRESS } from "@/contracts/MarketplaceNFT";
import Image from "next/image";
import { useEffect, useState } from "react";

interface NFTMetadata {
  name?: string;
  image?: string;
}

export default function MyNFTs() {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<{ tokenId: number; metadata: NFTMetadata }[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Get total minted
  const { data: nextTokenId } = useReadContract({
    address: MARKETPLACE_NFT_ADDRESS,
    abi: MARKETPLACE_NFT_ABI,
    functionName: "nextTokenId",
  });

  const totalMinted = nextTokenId ? Number(nextTokenId) : 0;

  // 2. Build ownerOf calls for 0..totalMinted-1
  const ownerCalls = Array.from({ length: totalMinted }, (_, i) => ({
    address: MARKETPLACE_NFT_ADDRESS,
    abi: MARKETPLACE_NFT_ABI,
    functionName: "ownerOf",
    args: [BigInt(i)],
  }));

  const { data: owners } = useReadContracts({
    contracts: ownerCalls,
    query: { enabled: totalMinted > 0 },
  });

  // 3. Filter your tokens
  const yourTokenIds = owners
    ?.map((res, i) => (res.status === "success" && res.result === address ? i : null))
    .filter((id): id is number => id !== null) ?? [];

  // 4. Get tokenURI for your tokens
  const uriCalls = yourTokenIds.map((id) => ({
    address: MARKETPLACE_NFT_ADDRESS,
    abi: MARKETPLACE_NFT_ABI,
    functionName: "tokenURI",
    args: [BigInt(id)],
  }));

  const { data: uris } = useReadContracts({
    contracts: uriCalls,
    query: { enabled: yourTokenIds.length > 0 },
  });

  // 5. Fetch metadata
  useEffect(() => {
    if (!uris || uris.length === 0) {
      setLoading(false);
      return;
    }

    const load = async () => {
      const results = await Promise.all(
        uris.map(async (res, i) => {
          if (res.status !== "success" || !res.result) return null;
          let uri = res.result as string;
          if (uri.startsWith("ipfs://")) {
            uri = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
          }
          try {
            const meta: NFTMetadata = await fetch(uri).then(r => r.json());
            const image = meta.image?.replace("ipfs://", "https://ipfs.io/ipfs/");
            return { tokenId: yourTokenIds[i], metadata: { ...meta, image } };
          } catch {
            return { tokenId: yourTokenIds[i], metadata: { name: `Token #${yourTokenIds[i]}` } };
          }
        })
      );
      setNfts(results.filter(Boolean) as any);
      setLoading(false);
    };
    load();
  }, [uris, yourTokenIds]);

  // UI
  if (!isConnected) return <p className="text-center text-red-600">Connect wallet</p>;
  if (loading) return <p className="text-center text-blue-600">Loading your NFTs...</p>;
  if (yourTokenIds.length === 0) return <p className="text-center text-gray-600">You own 0 NFTs</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-purple-800">
        My NFTs ({yourTokenIds.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {nfts.map((nft) => (
          <div key={nft.tokenId} className="border rounded-xl overflow-hidden shadow-lg bg-white">
            {nft.metadata.image ? (
              <Image
                src={nft.metadata.image}
                alt={nft.metadata.name || "NFT"}
                width={400}
                height={400}
                className="w-full h-64 object-cover"
                unoptimized
              />
            ) : (
              <div className="bg-gray-200 h-64 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <div className="p-4">
              <h3 className="font-bold text-purple-900">
                {nft.metadata.name || `Token #${nft.tokenId}`}
              </h3>
              <p className="text-sm text-gray-600">ID: {nft.tokenId}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}