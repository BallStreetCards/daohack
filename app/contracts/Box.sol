// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./SubDAO.sol";

contract Box is Ownable {
  uint256 private value;

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
