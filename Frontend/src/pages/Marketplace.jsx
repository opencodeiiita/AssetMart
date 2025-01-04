import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import NftTile from "../components/NftTile"; 
import WalletNavbar from "../components/WalletNavbar"; 
import AssetMartABI from "../AssetMartABI.json";

const CONTRACT_ADDRESS = "../Assetmart.sol"

function Marketplace() {

  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Buy NFT
  const buyNFT = async (tokenId, price) => {
    try {
      setLoading(true);
      const transaction = await contract.executeSale(tokenId, {
        value: ethers.utils.parseEther(price),
      });
      await transaction.wait();
      alert("Transaction successful!");
      fetchNFTs(); // Refresh NFT list
    } catch (err) {
      setError("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, AssetMartABI, signer);

        // Call the smart contract method to fetch all NFTs
        const nftsData = await contract.getAllNFTs();
        console.log("NFTs fetched: ", nftsData);
        setNfts(nftsData);
      } catch (err) {
        console.error("Error fetching NFTs:", err);
        setError("Failed to load NFTs. Please try again.");
      }
    };

    fetchNFTs();
  }, []);

  return (
    <div>
      <WalletNavbar />
      <h1>Marketplace</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {nfts.length === 0 && !loading && <p>No NFTs available for sale.</p>}
      <div className="nft-grid">
        {nfts.map((nft) => (
          <NftTile
            key={nft.tokenId}
            image={nft.image}
            title={`Token #${nft.tokenId}`}
            price={`${nft.price} ETH`}
            seller={nft.seller}
            onBuy={() => buyNFT(nft.tokenId, nft.price)}
          />
        ))}
      </div>
    </div>
  );
}

export default Marketplace;
