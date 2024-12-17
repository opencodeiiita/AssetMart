// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AssetMart is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("AssetMart", "AM") {}

    // Function to create NFT new NFTs
    function createNFT(address recipient, uint256 tokenId, string memory tokenMetadata) public onlyOwner {
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, tokenMetadata);
    }
}
