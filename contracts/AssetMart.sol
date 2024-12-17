// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract AssetMart is ERC721URIStorage {
    constructor() ERC721("AssetMart", "AM") {
        owner = payable(msg.sender);
    }
}
