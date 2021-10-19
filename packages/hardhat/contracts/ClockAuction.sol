// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IClockAuction.sol";
import "./Pausable.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
contract ClockAuction is Pausable, IClockAuction{
    constructor(uint256 _cut) {
        require(_cut <= 10000);
        ownerCut = _cut;
    }
        // Represents an auction on an NFT
    struct Auction {
        // Address of the NFT
        address nftAddress;
        // Current owner of NFT
        address seller;
        // Price (in wei) at beginning of auction
        uint128 startingPrice;
        // Price (in wei) at end of auction
        uint128 endingPrice;
        // Duration (in seconds) of auction
        uint64 duration;
        // Time when auction started
        // NOTE: 0 if this auction has been concluded
        uint64 startedAt;
    }

    // Cut owner takes on each auction, measured in basis points (1/100 of a percent).
    // Values 0-10,000 map to 0%-100%
    uint256 public ownerCut;

    // Map from token ID to their corresponding auction.
    mapping (address => mapping(uint256 => Auction)) nftToTokenIdToAuction;
    
    modifier canBeStoredWith64Bits(uint256 _value) {
        require(_value <= 18446744073709551615);
        _;
    }

    modifier canBeStoredWith128Bits(uint256 _value) {
        require(_value < 340282366920938463463374607431768211455);
        _;
    }
    
    function withdrawBalance() external override{
        require(msg.sender == owner());
        payable(msg.sender).transfer(address(this).balance);   
    }
    function createAuction(address _nftAddress,
    uint256 _tokenId,
    uint256 _startingPrice,
    uint256 _endingPrice,
    uint256 _duration,
    address _seller) public 
        whenNotPaused  
        canBeStoredWith128Bits(_startingPrice)
        canBeStoredWith128Bits(_endingPrice)
        canBeStoredWith64Bits(_duration) virtual override{
        require(_owns(_nftAddress,msg.sender,_tokenId),"Permission denied");
        _escrow(_nftAddress,msg.sender,_tokenId);
        Auction memory auction = Auction(
         _nftAddress,
            _seller,
            uint128(_startingPrice),
            uint128(_endingPrice),
            uint64(_duration),
            uint64(block.timestamp)
        );
        _addAuction(_nftAddress, _tokenId, auction);
        
    }
    function bid(address _nftAddress, uint256 _tokenId) public payable whenNotPaused virtual override{
        // _bid will throw if the bid or funds transfer fails
        _bid(_nftAddress, _tokenId, msg.value);
        _transfer(_nftAddress, msg.sender, _tokenId);
    }
    function cancelAuction(address _nftAddress, uint256 _tokenId) public virtual override{
        Auction storage auction = nftToTokenIdToAuction[_nftAddress][_tokenId];
        require(_isOnAuction(auction));
        address seller = auction.seller;
        require(msg.sender == seller);
        _cancelAuction(_nftAddress, _tokenId, seller);
    }
    function cancelAuctionWhenPaused(address _nftAddress, uint256 _tokenId) public whenPaused
        onlyOwner virtual override{
        Auction storage auction = nftToTokenIdToAuction[_nftAddress][_tokenId];
        require(_isOnAuction(auction));
        _cancelAuction(_nftAddress, _tokenId, auction.seller);
    }
    function getAuction(address _nftAddress, uint256 _tokenId) public view virtual override returns(
        address seller,
        uint256 startingPrice,
        uint256 endingPrice,
        uint256 duration,
        uint256 startedAt
    ){
        Auction storage auction = nftToTokenIdToAuction[_nftAddress][_tokenId];
        require(_isOnAuction(auction));
        return (
            auction.seller,
            auction.startingPrice,
            auction.endingPrice,
            auction.duration,
            auction.startedAt
        );
        
    }
    function getCurrentPrice(address _nftAddress, uint256 _tokenId) public view virtual override returns (uint256){
        Auction storage auction = nftToTokenIdToAuction[_nftAddress][_tokenId];
        require(_isOnAuction(auction));
        return _currentPrice(auction);
    }
    function _getNft(address _nft) internal pure returns (ERC721) {
        ERC721 candidateContract = ERC721(_nft);
        //require(candidateContract.implementsERC721());
        return candidateContract;
    }
    function _owns(address _nft, address _claimant, uint256 _tokenId) internal view returns (bool) {
        ERC721 nonFungibleContract = _getNft(_nft);
        return (nonFungibleContract.ownerOf(_tokenId) == _claimant);
    }
    function _escrow(address _nft, address _owner, uint256 _tokenId) internal {
        ERC721 nonFungibleContract = _getNft(_nft);

        // it will throw if transfer fails
        nonFungibleContract.transferFrom(_owner, address(this), _tokenId);
    }
    function _addAuction(address _nft, uint256 _tokenId, Auction memory _auction) internal {
        // Require that all auctions have a duration of
        // at least one minute. (Keeps our math from getting hairy!)
        require(_auction.duration >= 1 minutes);

        nftToTokenIdToAuction[_nft][_tokenId] = _auction;
        
        emit AuctionCreated(
            address(_nft),
            uint256(_tokenId),
            uint256(_auction.startingPrice),
            uint256(_auction.endingPrice),
            uint256(_auction.duration)
        );
    }
    function _isOnAuction(Auction storage _auction) internal view returns (bool) {
        return (_auction.startedAt > 0);
    }
    function _cancelAuction(address _nft, uint256 _tokenId, address _seller) internal {
        _removeAuction(_nft, _tokenId);
        _transfer(_nft, _seller, _tokenId);
        emit AuctionCancelled(_nft, _tokenId);
    }
    function _removeAuction(address _nft, uint256 _tokenId) internal {
        delete nftToTokenIdToAuction[_nft][_tokenId];
    }
    function _transfer(address _nft, address _receiver, uint256 _tokenId) internal {
        ERC721 nonFungibleContract = _getNft(_nft);

        // it will throw if transfer fails
        nonFungibleContract.transferFrom(address(this),_receiver, _tokenId);
    }
    function _bid(address _nft, uint256 _tokenId, uint256 _bidAmount)
        internal 
        returns (uint256)
    {
        // Get a reference to the auction struct
        Auction storage auction = nftToTokenIdToAuction[_nft][_tokenId];

        // Explicitly check that this auction is currently live.
        // (Because of how Ethereum mappings work, we can't just count
        // on the lookup above failing. An invalid _tokenId will just
        // return an auction object that is all zeros.)
        require(_isOnAuction(auction));

        // Check that the incoming bid is higher than the current
        // price
        uint256 price = _currentPrice(auction);
        require(_bidAmount >= price);

        // Grab a reference to the seller before the auction struct
        // gets deleted.
        address seller = auction.seller;

        // The bid is good! Remove the auction before sending the fees
        // to the sender so we can't have a reentrancy attack.
        _removeAuction(_nft, _tokenId);

        // Transfer proceeds to seller (if there are any!)
        if (price > 0) {
            //  Calculate the auctioneer's cut.
            // (NOTE: _computeCut() is guaranteed to return a
            //  value <= price, so this subtraction can't go negative.)
            uint256 auctioneerCut = _computeCut(price);
            uint256 sellerProceeds = price - auctioneerCut;

            // NOTE: Doing a transfer() in the middle of a complex
            // method like this is generally discouraged because of
            // reentrancy attacks and DoS attacks if the seller is
            // a contract with an invalid fallback function. We explicitly
            // guard against reentrancy attacks by removing the auction
            // before calling transfer(), and the only thing the seller
            // can DoS is the sale of their own asset! (And if it's an
            // accident, they can call cancelAuction(). )
            payable(seller).transfer(sellerProceeds);
        }

        // Tell the world!
        emit AuctionSuccessful(_nft, _tokenId, price, msg.sender);

        return price;
    }
    function _computeCut(uint256 _price) internal view returns (uint256) {
        // NOTE: We don't use SafeMath (or similar) in this function because
        //  all of our entry functions carefully cap the maximum values for
        //  currency (at 128-bits), and ownerCut <= 10000 (see the require()
        //  statement in the ClockAuction constructor). The result of this
        //  function is always guaranteed to be <= _price.
        return _price * ownerCut / 10000;
    }
    function _currentPrice(Auction storage _auction)
        internal
        view
        returns (uint256)
    {
        uint256 secondsPassed = 0;
        
        // A bit of insurance against negative values (or wraparound).
        // Probably not necessary (since Ethereum guarnatees that the
        // now variable doesn't ever go backwards).
        if (block.timestamp > _auction.startedAt) {
            secondsPassed = block.timestamp - _auction.startedAt;
        }

        return _computeCurrentPrice(
            _auction.startingPrice,
            _auction.endingPrice,
            _auction.duration,
            secondsPassed
        );
    }
     function _computeCurrentPrice(
        uint256 _startingPrice,
        uint256 _endingPrice,
        uint256 _duration,
        uint256 _secondsPassed
    )
        internal
        pure
        returns (uint256)
    {
        // NOTE: We don't use SafeMath (or similar) in this function because
        //  all of our public functions carefully cap the maximum values for
        //  time (at 64-bits) and currency (at 128-bits). _duration is
        //  also known to be non-zero (see the require() statement in
        //  _addAuction())
        if (_secondsPassed >= _duration) {
            // We've reached the end of the dynamic pricing portion
            // of the auction, just return the end price.
            return _endingPrice;
        } else {
            // Starting price can be higher than ending price (and often is!), so
            // this delta can be negative.
            int256 totalPriceChange = int256(_endingPrice) - int256(_startingPrice);
            
            // This multiplication can't overflow, _secondsPassed will easily fit within
            // 64-bits, and totalPriceChange will easily fit within 128-bits, their product
            // will always fit within 256-bits.
            int256 currentPriceChange = totalPriceChange * int256(_secondsPassed) / int256(_duration);
            
            // currentPriceChange can be negative, but if so, will have a magnitude
            // less that _startingPrice. Thus, this result will always end up positive.
            int256 currentPrice = int256(_startingPrice) + currentPriceChange;
            
            return uint256(currentPrice);
        }
    }

    fallback() external payable{}
    receive() external payable{}

}