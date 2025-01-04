import React from "react";

function NftTile({ image, title, price, seller, onBuy }) {
  return (
    <div className="nft-tile">
      <img src={image} alt={title} className="nft-image" />
      <h3>{title}</h3>
      <p>Price: {price}</p>
      <p>Seller: {seller}</p>
      <button onClick={onBuy}>Buy this NFT</button>
    </div>
  );
}

export default NftTile;
