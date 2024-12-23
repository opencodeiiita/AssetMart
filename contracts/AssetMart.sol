// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract AssetMart is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds; // To keep track of token IDs

    address payable owner; // Owner of the contract
    uint256 listingPrice = 0.025 ether; // Default listing price

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool isListed;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    event ListingSuccess(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool isListed
    );

    constructor() ERC721("AssetMart", "AM") {
        owner = payable(msg.sender);
    }

    function createToken(string memory tokenURI, uint256 price) public payable {
        require(price > 0, "Price must be at least 1 wei");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId); // Mint the token
        _setTokenURI(newTokenId, tokenURI); // Set the metadata URI

        // Transfer the token to the contract for selling
        transferFrom(msg.sender, address(this), newTokenId);

        // Call function to save to the marketplace
        _createMarketItem(newTokenId, price);

        // Emit event for successful listing
        emit ListingSuccess(newTokenId, msg.sender, address(this), price, true);
    }

    function _createMarketItem(uint256 tokenId, uint256 price) private {
        idToMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)), // Initially owned by the contract
            price,
            true
        );
    }
}
