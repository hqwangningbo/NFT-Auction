// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
interface IClockAuction {


    event AuctionCreated(address indexed nftAddress, uint256 indexed tokenId, uint256 indexed startingPrice, uint256 endingPrice, uint256 duration);
    event AuctionSuccessful(address indexed nftAddress, uint256 indexed tokenId, uint256 indexed totalPrice, address winner);
    event AuctionCancelled(address indexed nftAddress, uint256 indexed tokenId);

    function withdrawBalance() external;
    function createAuction(address _nftAddress,uint256 _tokenId,uint256 _startingPrice,uint256 _endingPrice,uint256 _duration,address _seller) external;
    function bid(address _nftAddress, uint256 _tokenId) external payable;
    function cancelAuction(address _nftAddress, uint256 _tokenId) external;
    function cancelAuctionWhenPaused(address _nftAddress, uint256 _tokenId) external;
    function getAuction(address _nftAddress, uint256 _tokenId) external view returns(
        address seller,
        uint256 startingPrice,
        uint256 endingPrice,
        uint256 duration,
        uint256 startedAt
    );
    function getCurrentPrice(address _nftAddress, uint256 _tokenId) external view returns (uint256);

}