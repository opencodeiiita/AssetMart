// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    struct NFT {
        uint256 id;
        address owner;
        string metadata;
        uint256 price;
        bool isActive; // Indicates if the NFT is currently on sale
    }

    NFT[] public nfts; // Array to store NFTs
    uint256 public totalNFTs; // Count of all NFTs

    // Function to add an NFT to the marketplace (for example purposes)
    function addNFT(string memory metadata, uint256 price) external {
        nfts.push(NFT(totalNFTs, msg.sender, metadata, price, true));
        totalNFTs++;
    }

    // Function to mark an NFT as sold (for example purposes)
    function markNFTSold(uint256 nftId) external {
        require(nftId < totalNFTs, "NFT does not exist");
        require(nfts[nftId].isActive, "NFT is not on sale");
        nfts[nftId].isActive = false;
    }

    // Function to fetch all active NFTs
    function getAllNFTs() external view returns (NFT[] memory) {
        uint256 activeCount = 0;

        // Count active NFTs
        for (uint256 i = 0; i < nfts.length; i++) {
            if (nfts[i].isActive) {
                activeCount++;
            }
        }

        // Create an array for active NFTs
        NFT[] memory activeNFTs = new NFT[](activeCount);
        uint256 index = 0;

        // Populate the array with active NFTs
        for (uint256 i = 0; i < nfts.length; i++) {
            if (nfts[i].isActive) {
                activeNFTs[index] = nfts[i];
                index++;
            }
        }

        return activeNFTs;
    }
}
