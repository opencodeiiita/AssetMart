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
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        transferFrom(msg.sender, address(this), newTokenId);

        _createMarketItem(newTokenId, price, tokenURI);

        emit ListingSuccess(newTokenId, msg.sender, address(this), price, true);
    }

    function _createMarketItem(uint256 tokenId, uint256 price, string memory tokenURI) private {
        idToMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            true,
            tokenURI
        );
    }


    // Helper Functions

    // Listing Price Update
    function updateListPrice(uint256 _listPrice) external {
        require(msg.sender == owner, "Only contract owner can update listing price");
        listingPrice = _listPrice;
    }

    // Listing Price Get
    function getListPrice() external view returns (uint256) {
        return listingPrice;
    }

    // Latest Token ID Get
    function getLatestIdToListedToken() external view returns (MarketItem memory) {
        require(_tokenIds.current() > 0, "No tokens listed yet");
        return idToMarketItem[_tokenIds.current()];
    }

    // Latest Token ID Detail Get
    function getListedTokenForId(uint256 tokenId) external view returns (MarketItem memory) {
        require(tokenId > 0 && tokenId <= _tokenIds.current(), "Invalid token ID");
        return idToMarketItem[tokenId];
    }

    // Current Token ID Get
    function getCurrentToken() external view returns (uint256) {
        return _tokenIds.current();
    }

    

    function getAllNFTs() external view returns (MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 activeCount = 0;

        // Count active listings
        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (idToMarketItem[i].isListed) {
                activeCount++;
            }
        }

        // Create array of active listings
        MarketItem[] memory activeItems = new MarketItem[](activeCount);
        uint256 currentIndex = 0;

        // Populate active listings array
        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (idToMarketItem[i].isListed) {
                activeItems[currentIndex] = idToMarketItem[i];
                currentIndex++;
            }
        }

        return activeItems;
    }

    function getMyNFTs() external view returns (MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 ownedCount = 0;

        // Count NFTs owned by the caller that are listed for sale
        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (
                idToMarketItem[i].isListed &&
                idToMarketItem[i].owner == msg.sender
            ) {
                ownedCount++;
            }
        }

        // Create array of owned NFTs
        MarketItem[] memory myNFTs = new MarketItem[](ownedCount);
        uint256 currentIndex = 0;

        // Populate owned NFTs array
        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (
                idToMarketItem[i].isListed &&
                idToMarketItem[i].owner == msg.sender
            ) {
                myNFTs[currentIndex] = idToMarketItem[i];
                currentIndex++;
            }
        }

        return myNFTs;
    }
}
