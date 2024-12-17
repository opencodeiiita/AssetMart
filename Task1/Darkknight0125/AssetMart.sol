// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AssetMart is ERC721, Ownable {
    uint256 public tokenCounter;

    // Constructor to initialize name and symbol
    constructor() ERC721("AssetMart", "AM") {
        tokenCounter = 0;
    }

    // Function to mint an NFT
    function mintNFT(address recipient) public onlyOwner returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _safeMint(recipient, newTokenId);
        tokenCounter += 1;
        return newTokenId;
    }
}
