// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NBToken is ERC721Enumerable{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor () ERC721("NB Token","NB"){}

    function _baseURI() internal pure override returns(string memory){
        return "http://www.wangningbo.com/#";
    }

   function mintNft(address receiver) external  returns (uint256) {
        _tokenIds.increment();
        uint256 newNftTokenId = _tokenIds.current();
        _mint(receiver, newNftTokenId);
        return newNftTokenId;
    }
}