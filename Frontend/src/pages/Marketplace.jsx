import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import NFTTile from "../components/NFTTile";
import contractABI from "../AssetMartABI.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const Marketplace = ({ walletAddress, connectWallet }) => {
  
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch NFTs from the smart contract
  const fetchNFTs = async () => {
    setIsLoading(true);
    try {
      if (!window.ethereum) {
        alert("MetaMask is required to fetch NFTs.");
        return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const fetchedNFTs = await contract.getAllNFTs();
      const formattedNFTs = fetchedNFTs.map((nft) => ({
        tokenId: nft.tokenId.toString(),
        name: nft.name,
        image: nft.image, // Assuming IPFS link or URL is stored
        price: ethers.utils.formatEther(nft.price), // Convert price from Wei to ETH
        seller: nft.seller,
      }));
      setNfts(formattedNFTs);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to buy an NFT
  const handleBuyNFT = async (nft) => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is required to buy NFTs.");
        return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const transaction = await contract.executeSale(nft.tokenId, {
        value: ethers.utils.parseEther(nft.price), // Convert price back to Wei
      });
      console.log("Transaction pending:", transaction.hash);

      await transaction.wait();
      alert("Transaction successful!");
      // Refresh the NFT list after purchase
      fetchNFTs();
    } catch (error) {
      console.error("Error buying NFT:", error);
      alert("Transaction failed!");
    }
  };

  // Fetch NFTs on component load
  useEffect(() => {
    fetchNFTs();
  }, []);

  return (
    <div>
      <div className="marketplace">
        <h1>Marketplace</h1>
        {!walletAddress && (
          <button onClick={connectWallet} className="connect-wallet">
            Connect Wallet
          </button>
        )}
        {isLoading ? (
          <p>Loading NFTs...</p>
        ) : nfts.length > 0 ? (
          <div className="nft-grid">
            {nfts.map((nft) => (
              <NFTTile key={nft.tokenId} nft={nft} onBuy={handleBuyNFT} />
            ))}
          </div>
        ) : (
          <p>No NFTs available for sale.</p>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
