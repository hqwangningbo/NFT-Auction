pragma solidity >=0.4.22 <0.9.0;

import "./erc721/ERC721.sol";
import "./erc721/ERC721Holder.sol";
import "./utils/Counters.sol";

contract NBToken is ERC721,ERC721Holder{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor () public ERC721("NB Token","NB"){}

    function _baseURI() internal view override returns(string memory){
        return "http://www.wangningbo.com/#";
    }

   function mintNft(address receiver) external  returns (uint256) {
        _tokenIds.increment();
        uint256 newNftTokenId = _tokenIds.current();
        _mint(receiver, newNftTokenId);
        return newNftTokenId;
    }



}
