// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AssetMart is ERC721URIStorage, Ownable {
    constructor() ERC721("AssetMart", "AM") {
        // Custom initialization if needed
    }

    /**
     * @dev Mint a new token.
     * @param to The address that will own the minted token.
     * @param tokenId The ID of the token to be minted.
     * @param tokenURI The metadata URI for the token.
     */
    function mint(address to, uint256 tokenId, string memory tokenURI) public onlyOwner {
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }
}
