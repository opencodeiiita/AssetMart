import './App.css'
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import Marketplace from './pages/Marketplace';
import NFTSell from './pages/NFTSell';
import NFTListing from './pages/NFTListing';
import Profile from './pages/Profile';

function App() {

  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is required to connect your wallet.");
        return;
      }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  };

  return (
      <Router>
        <Navbar walletAddress={walletAddress} connectWallet={connectWallet} />
        <Routes>
          <Route path="/"
            element={
              <Marketplace walletAddress={walletAddress} connectWallet={connectWallet} />
            }
          />
          <Route path="/nft-sell" element={<NFTSell />} />
          <Route path="/nft-listing" element={<NFTListing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/nft/:nftName" element={<NFTPage />} />
        </Routes>
      </Router>
    );
}

export default App
