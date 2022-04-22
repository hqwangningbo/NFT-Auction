import React from "react";

export default class MyNFTInfo extends React.Component{
    constructor(props){
        super(props);
    }
    parseDate = (times) => {
        if(times<=0){
            return "00时"+"00分"+"00秒"
        }
        let h = parseInt(times / 60 / 60 % 24); //时
        h = h < 10 ? '0' + h : h; //不足补0
        let m = parseInt(times / 60 % 60); // 分
        m = m < 10 ? '0' + m : m;
        let s = parseInt(times % 60); // 当前的秒
        s = s < 10 ? '0' + s : s;
        return h.toString()+"时"+m.toString()+"分"+s.toString()+"秒"
    }

    render(){
        return(
            <div>
                <div key={this.props.NFT.tokenID} className="mt-4">
                <p>
                    <span className="font-weight-bold">tokenID</span>
                    :{" "}
                    {this.props.NFT.tokenID}
                </p>
                <p>
                    <span className="font-weight-bold">Name</span>
                    :{" "}
                    {this.props.NFT.tokenName}
                </p>
                <p>
                    <span className="font-weight-bold">Created By</span>
                    :{" "}
                    {this.props.NFT.mintedBy}
                </p>
                <p>
                    <span className="font-weight-bold">Previous Owner</span>
                    :{" "}
                    {this.props.NFT.previousOwner}
                </p>
                <p>
                    <span className="font-weight-bold">Current Owner</span>
                    :{" "}
                    {this.props.NFT.currentOwner}
                </p>
                <p>
                    <span className="font-weight-bold">Price</span>
                    :{" "}
                    {window.web3.utils.fromWei(this.props.NFT.price,"Ether")} ETH
                </p>
                <p>
                    <span className="font-weight-bold">Number of Transfer</span>
                    :{" "}
                    {this.props.NFT.transNum}
                </p>
                </div>
                {this.props.NFT.onSale ? (
                      <div>
                      <p>
                          <span className="font-weight-bold">Highest Bidder</span> :{" "}
                          {this.props.Auction.highestBidder}
                      </p>
                      <p>
                          <span className="font-weight-bold">Highest Bid</span> :{" "}
                          {this.props.Auction.highestBid}
                      </p>
                      <p style={{fontWeight:700,fontSize:15}}>
                          <span className="font-weight-bold">End Time</span> :{" "}
                          {this.parseDate(this.props.Auction.endTime-Date.parse(new Date())/1000)}
                      </p>
                      {this.props.currentTime >= this.props.Auction.endTime ? (
                        !this.props.Auction.ended ? (
                          <button
                          className="btn btn-outline-success mt-4 w-50"
                          style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                          onClick={ () => {
                            this.props.NFTContract.methods.endAuction(this.props.NFT.tokenID).send({ from: this.props.accountAddress, gas: '3000000'}).on("confirmation", () => {
                              window.location.reload();
                            });
                          }}
                          >
                            End
                          </button>
                        ) : (
                          <botton
                          className="btn btn-outline-danger mt-4 w-50"
                          style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                          >
                              Waiting for Claim
                          </botton>
                        )
                        
                      ) : (
                        <button
                        className="btn btn-outline-success mt-4 w-50"
                        style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                      >
                        Not Ended
                      </button>
                      )}
                      </div>
                    ) : (
                      <button
                        className="btn btn-outline-success mt-4 w-50"
                        style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                        onClick={ () => {
                          let minBid = prompt("Please Enter Minimum Bidding Price");
                          let duration = prompt("Please Enter Duration For Sales");
                          this.props.NFTContract.methods.beginAuction(this.props.NFT.tokenID, minBid, duration).send({ from: this.props.accountAddress, gas: '3000000'}).on("confirmation", () => {
                            window.location.reload();
                          });
                        }}
                      >
                        Sell
                      </button>
                    )}
            </div>
        )
    }
}