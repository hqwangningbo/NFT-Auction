pragma solidity >=0.4.22 <0.9.0;
import "./utils/Counters.sol";
import "./erc721/ERC721Holder.sol";
import "./NBToken.sol";
contract Auction  is ERC721Holder{
    using Counters for Counters.Counter;
    Counters.Counter private prodcutId;

    NBToken public tokenAddress;  //NBToken实例化
    uint256[] public allProducts; //所有拍卖商品ID
    mapping(uint256=>Product) public prodcutMap; //商品ID和商品映射
    struct Product{
        uint256 prodcutId; //商品ID
        address seller;   //卖家
        address buyer; //买家
        uint256 lowestPrice; //最低价
        uint256 highestPrice; //最高价
        uint256 nftTokenId; //nft tokenID
        string desc; //描述
        uint8 status; //状态
    }

    //声明事件，改变时会触发事件
    event HighestPriceIncrease(address buyer,uint price);
    event AcutionEnded(address winner,uint amount);
    event publishProducted(address seller,uint256 lowestPrice,uint256 nftTokenId,string desc);

    constructor (address _tokenAddress) public{
        tokenAddress = NBToken(_tokenAddress);
    }
    //发布商品
    function publishProduct(uint256 _lowestPrice,uint256 _nftTokenId,string calldata _desc) public{
        require(msg.sender == tokenAddress.ownerOf(_nftTokenId),"is not you");
         prodcutId.increment();
         uint256 newProdcutId = prodcutId.current();
        //  tokenAddress.approve(address(this),_nftTokenId);
         tokenAddress.safeTransferFrom(msg.sender,address(this),_nftTokenId);
        allProducts.push(newProdcutId);
        prodcutMap[newProdcutId] = Product(newProdcutId,msg.sender,address(0),_lowestPrice,_lowestPrice,_nftTokenId,_desc,0);
        emit publishProducted(msg.sender,_lowestPrice,_nftTokenId,_desc);
    }

    //竞拍出价
    function bid(uint256 _productId) payable  public {
        Product storage product = prodcutMap[_productId];
        //判断此账户出价是否高于最高出价
        require(msg.value > product.highestPrice);
        product.buyer = msg.sender;
        product.highestPrice = msg.value;
        payable(address(this)).transfer(msg.value);
        emit HighestPriceIncrease(msg.sender,msg.value);
    }
    //拍卖结束后发送最高出价给受益人
    function acutionEnd(uint256 _productId) payable public{
        Product storage product = prodcutMap[_productId];
        require(msg.sender == product.seller);
        if(product.buyer != address(0)){
         payable(product.seller).transfer(product.highestPrice);
         //转移之前要用户对本合同进行授权approve
         tokenAddress.safeTransferFrom(address(this),product.buyer,product.nftTokenId);
        }
        product.status = 1;
        //触发结束事件
        emit AcutionEnded(product.buyer,product.highestPrice);

    }
    fallback() external payable {}
}

