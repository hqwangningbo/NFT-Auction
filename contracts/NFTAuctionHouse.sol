// SPDX-License-Identifier: GPL3.0
pragma solidity ^0.8.0;

// import ERC721 iterface
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// NFT smart contract
contract NFTAuctionHouse is ERC721URIStorage{
    string public collectionName; //contract's token collection name
    string public collectionNameSymbol; //contract's token symbol
    uint256 public NFTCounter; //total number of crypto

    struct NFT {
        uint256 tokenID;
        string tokenName;
        string tokenURI;
        address payable mintedBy;
        address payable currentOwner;
        address payable previousOwner;
        uint256 price;
        uint256 transNum;
        bool onSale;
    }

    struct Auction {
        uint256 minBid;
        address payable highestBidder;
        uint256 highestBid;
        uint endTime;
        bool ended;
        bool claimed;
    }

    mapping(uint256 => NFT) public allNFTs;
    mapping(uint256 => Auction) public AuctionsOfNFT;
    mapping(uint256 => mapping(address => uint256)) public fundsByBidder; //map tokenID to fundsByBidder
    mapping(address => uint256[]) public attendAuctions;
    mapping(address => uint) public attendAuctionsNum;

    // check if token name exists
    mapping(string => bool) public tokenNameExists;
    // check if token URI exists
    mapping(string => bool) public tokenURIExists;
    //initial
    constructor() ERC721("NFT Collection", "NFT") {
        collectionName = name();
        collectionNameSymbol = symbol();
    }

    modifier notZeroAddress() {
        require(
            msg.sender != address(0),
            "The fucntion caller is zero address account."
        );
        _;
    }

    modifier isOwner(uint256 _tokenID) {
        require(
            msg.sender == ownerOf(_tokenID),
            "Only owner can call this function."
        );
        _;
    }

    modifier notOwner(uint256 _tokenID) {
        require(
            msg.sender != ownerOf(_tokenID),
            "Owner cannot call this function."
        );
        _;
    }

    modifier notEnded(uint256 _tokenID) {
        Auction memory auction = AuctionsOfNFT[_tokenID];
        require(
            block.timestamp <= auction.endTime,
            "Auction already ended."
        );
        _;
    }

    modifier tokenExist(uint256 _tokenID) {
        require(
            _exists(_tokenID),
            "Token ID does not exist."
        );
        _;
    }

    function getTime() public view returns (uint) {
        return block.timestamp;
    }

    //create a new nft
    function createNFT(string memory _name, string memory _tokenURI, uint256 _price) external notZeroAddress{
        NFTCounter++;
        require(!_exists(NFTCounter)); //check if token exist
        require(!tokenURIExists[_tokenURI]); //check if token uri already exists
        require(!tokenNameExists[_name]); //check if token name already exists

        _safeMint(msg.sender, NFTCounter); // create token
        _setTokenURI(NFTCounter, _tokenURI);

        tokenURIExists[_tokenURI] = true;
        tokenNameExists[_name] = true;

        NFT memory newNFT = NFT(
            NFTCounter,
            _name,
            _tokenURI,
            payable(msg.sender),
            payable(msg.sender),
            payable(address(0)),
            _price,
            0,
            false
        );
        allNFTs[NFTCounter] = newNFT;
    } 
    
    // get owner of the token
    function getTokenOwner(uint256 _tokenID) public view returns  (address) {
        address _tokenOwner = ownerOf(_tokenID);
        return _tokenOwner;
    }
  
    // get metadata of the token
    function getTokenMetaData(uint _tokenID) public view returns  (string memory) {
        string memory tokenMetaData = tokenURI(_tokenID);
        return tokenMetaData;
    }
  
    // get total number of tokens owned by an address
    function getTotalNumberOfTokensOwnedByAnAddress(address _owner) public view returns(uint256) {
        uint256 totalNumberOfTokensOwned = balanceOf(_owner);
        return totalNumberOfTokensOwned;
    }
    
    function beginAuction(uint256 _tokenID, uint256 _minBid, uint _duration) tokenExist(_tokenID) isOwner(_tokenID) public returns (bool success) {
        uint _endTime = block.timestamp+_duration;
        NFT memory nft = allNFTs[_tokenID];
        nft.onSale = true;
        Auction memory newAuction = Auction(
            _minBid,
            payable(msg.sender),
            _minBid,
            _endTime,
            false,
            false
        );

        allNFTs[_tokenID] = nft;
        AuctionsOfNFT[_tokenID] = newAuction;
        return true;
    }

    function increaseBid(uint256 _tokenID, uint256 newBid) tokenExist(_tokenID) notOwner(_tokenID) notEnded(_tokenID) public returns (bool success) {
        Auction memory auction = AuctionsOfNFT[_tokenID];
        if (newBid <= auction.highestBid) revert();

        NFT memory nft = allNFTs[_tokenID];
        nft.price = newBid;
        allNFTs[_tokenID] = nft;
        
        attendAuctionsNum[msg.sender] += 1;
        attendAuctions[msg.sender].push(_tokenID);
        fundsByBidder[_tokenID][msg.sender] = newBid;
        auction.highestBidder = payable(msg.sender);
        auction.highestBid = newBid;
        AuctionsOfNFT[_tokenID] = auction;
        return true;
    }

    function endAuction(uint256 _tokenID) tokenExist(_tokenID) public returns (bool success) {
        Auction memory auction = AuctionsOfNFT[_tokenID];
        require(block.timestamp >= auction.endTime, "Auction not yet ended.");

        auction.ended = true;

        AuctionsOfNFT[_tokenID] = auction;
        return true;
    }

    function claimNFT(uint256 _tokenID) public payable tokenExist(_tokenID) notZeroAddress returns (bool success) {
        Auction memory auction = AuctionsOfNFT[_tokenID];
        // require(auction.ended);
        require(auction.ended, "Auction not yet ended.");
        require(!auction.claimed);
        require(msg.sender == auction.highestBidder);
        // get the token's owner
        address tokenOwner = ownerOf(_tokenID);
        // token's owner should not be an zero address account
        require(tokenOwner != address(0));

        NFT memory nft = allNFTs[_tokenID];
        _transfer(tokenOwner, msg.sender, _tokenID);
        // // get owner of the token
        // address payable sendTo = nft.currentOwner;
        // send token's worth of ethers to the owner
        payable(tokenOwner).transfer(msg.value);
        nft.previousOwner = nft.currentOwner;
        nft.currentOwner = payable(msg.sender);
        nft.price = auction.highestBid;
        nft.transNum += 1;
        nft.onSale = false;
        allNFTs[_tokenID] = nft;
        return true;
    }

}