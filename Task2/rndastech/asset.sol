// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AssetMart is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 public nextTokenId;
    uint256 public mintingCap = 10000;
    uint256 public fee = 0.01 ether;

    struct Item {
        uint256 id;
        uint256 price;
        address payable owner;
        address payable seller;
        bool listed;
    }

    mapping(uint256 => Item) public items;

    event TokenMinted(address to, uint256 tokenId);
    event ListingSuccess(uint256 indexed id, address owner, address seller, uint256 price, bool listed);
    event TransferSuccess(uint256 indexed id, address from, address to);

    constructor() ERC721("AssetMart", "AM") {
        nextTokenId = 1;
    }

    function createToken(string memory uri, uint256 price) external payable nonReentrant {
        require(msg.value == fee, "Fee required");
        require(price > 0, "Invalid price");
        require(nextTokenId <= mintingCap, "AssetMart: Minting cap reached");

        uint256 tokenId = nextTokenId;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        nextTokenId++;

        _transfer(msg.sender, address(this), tokenId);
        emit TransferSuccess(tokenId, msg.sender, address(this));

        _addItem(tokenId, price);

        emit ListingSuccess(tokenId, address(this), msg.sender, price, true);
    }

    function _addItem(uint256 id, uint256 price) private {
        items[id] = Item({
            id: id,
            price: price,
            owner: payable(address(this)),
            seller: payable(msg.sender),
            listed: true
        });
    }

    function setFee(uint256 newFee) external onlyOwner {
        fee = newFee;
    }

    function getItem(uint256 id) external view returns (Item memory) {
        return items[id];
    }
}
