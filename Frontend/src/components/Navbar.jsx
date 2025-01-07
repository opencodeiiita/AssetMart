import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ walletAddress, connectWallet }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">AssetMart</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Marketplace</Link>
        </li>
        <li>
          <Link to="/nft-sell">Sell NFT</Link>
        </li>
        <li>
          <Link to="/nft-listing">NFT Listing</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
      <button onClick={connectWallet} className="connect-wallet">
        {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...` : "Connect Wallet"}
      </button>
    </nav>
  );
}

export default Navbar;
