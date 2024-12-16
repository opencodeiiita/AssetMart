// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AssetMart is ERC721, Ownable, ReentrancyGuard {
    uint256 public nextTokenId;
    string private _baseTokenURI;
    uint256 public mintingCap = 10000;
    
    constructor() ERC721("AssetMart", "AM") {
        nextTokenId = 1;
        _baseTokenURI = "https://api.assetmart.com/metadata/"; 
    }

    event TokenMinted(address to, uint256 tokenId);

    function mint(address to) external onlyOwner nonReentrant {
        require(nextTokenId <= mintingCap, "AssetMart: Minting cap reached");

        uint256 tokenId = nextTokenId;
        _safeMint(to, tokenId);
        nextTokenId++;

        emit TokenMinted(to, tokenId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI; 
    }

    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "AssetMart: You must own the token to burn it");
        _burn(tokenId);
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function setMintingCap(uint256 cap) external onlyOwner {
        mintingCap = cap;
    }
}
