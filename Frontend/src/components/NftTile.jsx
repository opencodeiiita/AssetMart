import React from "react";
import './NftTile.css';

const NFTTile = ({ nft, onBuy }) => {
  return (
    <div className="nft-tile">
      <img src={nft.image} alt={nft.name} className="nft-image" />
      <h2>{nft.name}</h2>
      <p>Price: {nft.price} ETH</p>
      <p>Seller: {nft.seller}</p>
      <button onClick={() => onBuy(nft)}>Buy this NFT</button>
    </div>
  );
};

export default NFTTile;
