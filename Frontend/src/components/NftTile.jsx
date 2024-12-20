import React from 'react';
import './NftTile.css';

const NftTile = ({ image, name, description }) => {
  return (
    <div className="nft-tile">
      <img src={image} alt={name} className="nft-image" />
      <div className="nft-details">
        <h3 className="nft-name">{name}</h3>
        <p className="nft-description">{description}</p>
      </div>
    </div>
  );
};

export default NftTile;
