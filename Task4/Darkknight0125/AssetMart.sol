// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract AssetMart is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    address payable public owner;

    struct NFT {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool isActive;
    }

    mapping(uint256 => NFT) private _nfts;

    constructor() ERC721("AssetMart", "AM") {
        owner = payable(msg.sender);
    }

    function createNFT(string memory tokenURI, uint256 price) public {
        require(price > 0, "Price must be greater than zero.");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        _nfts[newTokenId] = NFT({
            tokenId: newTokenId,
            seller: payable(msg.sender),
            owner: payable(address(0)),
            price: price,
            isActive: true
        });
    }

    function buyNFT(uint256 tokenId) public payable {
        NFT storage nft = _nfts[tokenId];
        require(nft.isActive, "NFT is not for sale.");
        require(msg.value == nft.price, "Incorrect price.");

        nft.seller.transfer(msg.value);
        nft.owner = payable(msg.sender);
        nft.isActive = false;

        _transfer(address(this), msg.sender, tokenId);
    }

    function getAllNFTs() public view returns (NFT[] memory) {
        uint256 totalItems = _tokenIds.current();
        uint256 activeItems = 0;

        for (uint256 i = 1; i <= totalItems; i++) {
            if (_nfts[i].isActive) {
                activeItems++;
            }
        }

        NFT[] memory items = new NFT[](activeItems);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= totalItems; i++) {
            if (_nfts[i].isActive) {
                items[currentIndex] = _nfts[i];
                currentIndex++;
            }
        }

        return items;
    }
}
