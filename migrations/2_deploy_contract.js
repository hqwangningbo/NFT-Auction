const NFTAuctionHouse = artifacts.require("NFTAuctionHouse");

module.exports = function(deployer){
    deployer.deploy(NFTAuctionHouse);
};