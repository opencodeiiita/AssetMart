// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AssetMart is ERC721, Ownable, ReentrancyGuard {
    uint256 public nextTokenId;
    uint256 public mintingCap = 10000;

    constructor() ERC721("AssetMart", "AM") {
        nextTokenId = 1;
    }

    event TokenMinted(address to, uint256 tokenId);

    function mint(address to) external onlyOwner nonReentrant {
        require(nextTokenId <= mintingCap, "AssetMart: Minting cap reached");

        uint256 tokenId = nextTokenId;
        _safeMint(to, tokenId);
        nextTokenId++;

        emit TokenMinted(to, tokenId);
    }
}
