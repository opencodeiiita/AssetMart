// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AssetMart is ERC721URIStorage, Ownable {
    constructor() ERC721("AssetMart", "AM") {}

    function createNFT(address recipient, uint256 tokenId, string memory tokenMetadata) public onlyOwner {
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, tokenMetadata);
    }
}
