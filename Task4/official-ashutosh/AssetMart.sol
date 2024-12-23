// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract AssetMart is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct MarketItem {
        uint256 id;
        address payable seller;
        address payable owner;
        uint256 price;
        bool active;
        string data;
    }

    mapping(uint256 => MarketItem) private items;

    event MarketItemCreated(
        uint256 id,
        address seller,
        address owner,
        uint256 price,
        bool active,
        string data
    );

    constructor() ERC721("AssetMart", "AM") {}

    function createNFT(string memory data, uint256 price) public {
        require(price > 0, "Price must be greater than zero");

        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, data);

        items[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            true,
            data
        );

        emit MarketItemCreated(tokenId, msg.sender, address(this), price, true, data);
    }

    function getAllNFTs() external view returns (MarketItem[] memory) {
        uint256 total = _tokenIds.current();
        uint256 activeCount = 0;

        for (uint256 i = 1; i <= total; i++) {
            if (items[i].active) {
                activeCount++;
            }
        }

        MarketItem[] memory activeNFTs = new MarketItem[](activeCount);
        uint256 index = 0;

        for (uint256 i = 1; i <= total; i++) {
            if (items[i].active) {
                activeNFTs[index] = items[i];
                index++;
            }
        }

        return activeNFTs;
    }
}
