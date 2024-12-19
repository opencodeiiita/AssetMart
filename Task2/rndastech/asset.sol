// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AssetMart is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
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

    constructor() ERC721("AssetMart", "AM") {
        nextTokenId = 1;
    }

    function createToken(string memory uri, uint256 price) external payable {
        require(msg.value == fee, "Fee required");
        require(price > 0, "Invalid price");

        uint256 tokenId = nextTokenId;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        nextTokenId++;

        _transfer(msg.sender, address(this), tokenId);
        
        items[tokenId] = Item({
            id: tokenId,
            price: price,
            owner: payable(address(this)),
            seller: payable(msg.sender),
            listed: true
        });

        emit TokenMinted(msg.sender, tokenId);
        emit ListingSuccess(tokenId, address(this), msg.sender, price, true);
    }
}
