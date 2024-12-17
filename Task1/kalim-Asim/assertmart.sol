// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AssetMart is ERC721, Ownable {
    uint256 private _currentTokenId;

    // Constructor with name and symbol
    constructor() ERC721("AssetMart", "AM") {
        _currentTokenId = 0;
    }

    // Function to mint a new NFT
    function mint(address to) external onlyOwner returns (uint256) {
        _currentTokenId++;
        _mint(to, _currentTokenId);
        return _currentTokenId;
    }

    // Function to get the current token ID
    function currentTokenId() external view returns (uint256) {
        return _currentTokenId;
    }
}
