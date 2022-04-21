// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SubDAO.sol";

contract MainDAO is Ownable, ERC721URIStorage {
  uint256 private value;
  using Counters for Counters.Counter; 
  Counters.Counter private _tokenIds;

  constructor() ERC721("Factory NFT", "FTN") {
  }

  function createToken(string memory tokenURI) public returns (uint) {
    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();

    _mint(msg.sender, newItemId);
    _setTokenURI(newItemId, tokenURI);

    return newItemId;
  }

  // Emitted when the stored value changes
  event ValueChanged(uint256 newValue);

  // Stores a new value in the contract
  function store(uint256 newValue) public onlyOwner {
    value = newValue;
    emit ValueChanged(newValue);
  }
  
  // MINTING THE CARD
  function mint(string memory name) public onlyOwner returns (SubDAOProxy) {
    return new SubDAOProxy(name);
  }

  // Reads the last stored value
  function retrieve() public view returns (uint256) {
    return value;
  }
}
