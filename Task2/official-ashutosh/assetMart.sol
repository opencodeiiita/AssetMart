pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AssetMart is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private ids;

    address payable public owner;
    uint256 public fee = 0.01 ether;

    struct Item {
        uint256 id;
        uint256 price;
        address payable owner;
        address payable seller;
        bool listed;
    }

    mapping(uint256 => Item) public items;

    event Listed(uint256 indexed id, address owner, address seller, uint256 price, bool listed);

    constructor() ERC721("AssetMart", "AM") {
        owner = payable(msg.sender);
    }

    function createToken(string memory uri, uint256 price) public payable {
        require(msg.value == fee, "Fee required");
        require(price > 0, "Invalid price");

        ids.increment();
        uint256 id = ids.current();

        _mint(msg.sender, id);
        _setTokenURI(id, uri);

        _transfer(msg.sender, address(this), id);

        _addItem(id, price);

        emit Listed(id, address(this), msg.sender, price, true);
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

    function setFee(uint256 newFee) public onlyOwner {
        fee = newFee;
    }

    function getItem(uint256 id) public view returns (Item memory) {
        return items[id];
    }
}