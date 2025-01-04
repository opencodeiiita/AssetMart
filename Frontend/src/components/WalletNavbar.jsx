import React, { useState } from "react";
import { ethers } from "ethers";

function WalletNavbar() {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);

  // Function to connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        setError(null);
      } catch (err) {
        setError("Failed to connect wallet. Please try again.");
      }
    } else {
      setError("MetaMask is not installed. Please install it to use the app.");
    }
  };

  return (
    <nav style={styles.navbar}>
      <h1 style={styles.title}>AssetMart</h1>
      <div>
        {account ? (
          <p style={styles.account}>
            Connected: {`${account.slice(0, 6)}...${account.slice(-4)}`}
          </p>
        ) : (
          <button style={styles.button} onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#333",
    color: "white",
  },
  title: {
    margin: 0,
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  account: {
    color: "#FFD700",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: "12px",
    marginTop: "8px",
  },
};

export default WalletNavbar;
