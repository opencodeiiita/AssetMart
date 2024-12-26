// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract AssetMart is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address payable owner;
    uint256 listingPrice = 0.025 ether;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool isListed;
        string tokenURI;
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
        require(msg.value == listingPrice, "Price must be equal to listing price");

        _tokenIds.increment();
        uint256 id = _tokenIds.current();

        _mint(msg.sender, id);
        _setTokenURI(id, tokenURI);

        transferFrom(msg.sender, address(this), id);
        _createMarketItem(id, price, tokenURI);

        emit ListingSuccess(id, msg.sender, address(this), price, true);
    }

    function _createMarketItem(uint256 id, uint256 price, string memory uri) private {
        idToMarketItem[id] = MarketItem(id, payable(msg.sender), payable(address(this)), price, true, uri);
    }

    function getAllNFTs() external view returns (MarketItem[] memory) {
        uint256 total = _tokenIds.current();
        uint256 count = 0;

        for (uint256 i = 1; i <= total; i++) {
            if (idToMarketItem[i].isListed) {
                count++;
            }
        }

        MarketItem[] memory items = new MarketItem[](count);
        uint256 idx = 0;

        for (uint256 i = 1; i <= total; i++) {
            if (idToMarketItem[i].isListed) {
                items[idx] = idToMarketItem[i];
                idx++;
            }
        }

        return items;
    }

    function getMyNFTs() external view returns (MarketItem[] memory) {
        uint256 total = _tokenIds.current();
        uint256 count = 0;

        for(uint256 i = 1; i <= total; i++) {
            if(idToMarketItem[i].isListed && idToMarketItem[i].seller == msg.sender) {
                count++;
            }
        }

        MarketItem[] memory items = new MarketItem[](count);
        uint256 idx = 0;

        for(uint256 i = 1; i <= total; i++) {
            if(idToMarketItem[i].isListed && idToMarketItem[i].seller == msg.sender) {
                items[idx] = idToMarketItem[i];
                idx++;
            }
        }

        return items;
    }
}