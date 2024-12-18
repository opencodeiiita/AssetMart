// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    uint256 public listingFee = 0.01 ether;

    struct MarketItem {
        uint256 tokenId;
        uint256 price;
        address payable owner;
        address payable seller;
        bool isListed;
    }

    mapping(uint256 => MarketItem) public marketItems;

    event ListingSuccess(
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        bool isListed
    );

    constructor() ERC721("MarketplaceNFT", "MNFT") {}

    function createToken(string memory ipfsURL, uint256 price) public payable {
        require(msg.value == listingFee, "Insufficient listing fee");
        require(price > 0, "Price must be greater than zero");

        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, ipfsURL);

        // Save marketplace data
        _createMarketItem(newTokenId, price);

        emit ListingSuccess(newTokenId, address(0), msg.sender, price, true);
    }

    function _createMarketItem(uint256 tokenId, uint256 price) private {
        marketItems[tokenId] = MarketItem({
            tokenId: tokenId,
            price: price,
            owner: payable(address(0)),
            seller: payable(msg.sender),
            isListed: true
        });
    }

    function setListingFee(uint256 newFee) public onlyOwner {
        listingFee = newFee;
    }

    function getMarketItem(uint256 tokenId) public view returns (MarketItem memory) {
        return marketItems[tokenId];
    }
}
