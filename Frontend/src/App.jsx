import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import Marketplace from './pages/Marketplace';
import NFTSell from './pages/NFTSell';
import NFTListing from './pages/NFTListing';
import Profile from './pages/Profile';

function App() {

  return (
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/nft-sell" element={<NFTSell />} />
          <Route path="/nft-listing" element={<NFTListing />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    );
}

export default App
