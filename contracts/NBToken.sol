pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "./Counter.sol";

contract NBToken is ERC721Token{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
      
    constructor (string _name, string _symbol) public ERC721Token(_name, _symbol){}

   //发行NFT
   function mintNft(address receiver, string tokenURI) external  returns (uint256) {
        _tokenIds.increment();

        uint256 newNftTokenId = _tokenIds.current();
        _mint(receiver, newNftTokenId);
        _setTokenURI(newNftTokenId, tokenURI);
        return newNftTokenId;
    }
    
}