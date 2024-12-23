// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract AssetMart is ERC721URIStorage {
    struct Item {
        uint256 id;
        uint256 price;
        address payable owner;
        address payable seller;
        bool listed;
        string tokenURI;
    }
    
    mapping(uint256 => Item) public items;
    uint256 public nextTokenId = 1;
    uint256 public listingFee = 0.01 ether;
    
    event TokenCreated(uint256 indexed id, string tokenURI, uint256 price, address seller);
    event TokenUnlisted(uint256 indexed id);
    
    constructor() ERC721("AssetMart", "AM") {}
    
    function createToken(string memory _tokenURI, uint256 _price) 
        external 
        payable 
        returns (uint256) 
    {
        require(msg.value == listingFee, "Must pay listing fee");
        require(_price > 0, "Price must be greater than 0");
        
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        
        items[tokenId] = Item({
            id: tokenId,
            price: _price,
            owner: payable(address(this)),
            seller: payable(msg.sender),
            listed: true,
            tokenURI: _tokenURI
        });
        
        _transfer(msg.sender, address(this), tokenId);
        
        emit TokenCreated(tokenId, _tokenURI, _price, msg.sender);
        return tokenId;
    }
    
    function unlistToken(uint256 _tokenId) external {
        require(items[_tokenId].seller == msg.sender, "Only seller can unlist");
        require(items[_tokenId].listed, "Token not listed");
        
        items[_tokenId].listed = false;
        _transfer(address(this), items[_tokenId].seller, _tokenId);
        
        emit TokenUnlisted(_tokenId);
    }
    
    function getAllNFTs() external view returns (Item[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i < nextTokenId; i++) {
            if (items[i].listed) {
                activeCount++;
            }
        }
        
        Item[] memory activeItems = new Item[](activeCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i < nextTokenId; i++) {
            if (items[i].listed) {
                Item storage currentItem = items[i];
                activeItems[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        
        return activeItems;
    }
}
