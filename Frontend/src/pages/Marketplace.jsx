import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import NFTTile from "../components/NFTTile";
import contractABI from "../AssetMartABI.json";
import { GetIpfsUrlFromPinata } from "../../../pinata";

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
  
      // Fetch all NFT transactions
      const transactions = await contract.getAllNFTs();
  
      const items = await Promise.all(
        transactions.map(async (transaction) => {
          let tokenURI = await contract.tokenURI(transaction.tokenId);
          tokenURI = GetIpfsUrlFromPinata(tokenURI); // Convert IPFS URL if needed
          const meta = await axios.get(tokenURI); // Fetch metadata from the token URI
          const metadata = meta.data;
  
          const price = ethers.utils.formatUnits(transaction.price.toString(), "ether");
          const item = {
            price,
            tokenId: transaction.tokenId.toNumber(),
            seller: transaction.seller,
            owner: transaction.owner,
            image: metadata.image, // Extracted image URL
            name: metadata.name, // Extracted name
            description: metadata.description, // Extracted description
          };
  
          return item;
        })
      );
  
      setNfts(items); // Update state with the formatted NFTs
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    } finally {
      setIsLoading(false);
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
