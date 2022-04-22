import React from "react";

class NFTList extends React.Component{
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
            <div key={this.props.NFT.tokenID} className="mt-4" style={{marginLeft:40}}>
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
                    <span className="font-weight-bold">Current Owner</span>
                    :{" "}
                    {this.props.NFT.currentOwner}
                </p>
                <p>
                    <span className="font-weight-bold">Previous Owner</span>
                    :{" "}
                    {this.props.NFT.previousOwner}
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

                {
                    this.props.accountAddress === this.props.NFT.currentOwner ? (
                        !this.props.NFT.onSale ? (
                            <button
                                className="btn btn-outline-success mt-4 w-50"
                                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem",marginLeft:"20%" }}
                                onClick={ () => {
                                    let minBid = prompt("请输入最低成交价格");
                                    let duration = prompt("请输入拍卖周期");
                                    this.props.NFTContract.methods.beginAuction(this.props.NFT.tokenID, minBid, duration).send({ from: this.props.accountAddress, gas: '3000000'}).on("confirmation", () => {
                                        window.location.reload();
                                    });
                                }}
                            >
                                Sale
                            </button>
                        ) : (
                            <p style={{fontWeight:700,fontSize:15}}>
                                <span className="font-weight-bold">End Time</span> :{" "}
                                { this.parseDate(this.props.Auction.endTime-Date.parse(new Date())/1000)}
                            </p>
                        )
                    ) : (
                        this.props.NFT.onSale ? (
                            !this.props.Auction.ended ? (
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
                                        <span className="font-weight-bold" >End Time</span> :{" "}
                                        {
                                            this.parseDate(this.props.Auction.endTime-Date.parse(new Date())/1000)
                                        }
                                    </p>
                                <botton
                                    className="btn btn-outline-success mt-4 w-50"
                                    style={{ fontSize: "0.8rem", letterSpacing: "0.14rem",marginLeft:"15%" }}
                                    onClick={ () => {
                                        console.log(!this.props.Auction.ended)

                                        let bid = prompt("Please Enter Your Bidding Price");
                                        this.props.NFTContract.methods.increaseBid(
                                            this.props.NFT.tokenID, bid).send
                                            ({ from: this.props.accountAddress, gas: '3000000'});
                                      }}
                                >
                                    Bid
                                </botton>
                                </div>
                            ) : (
                                !this.props.Auction.claimed ? (
                                    this.props.accountAddress === this.props.Auction.highestBidder ? (
                                        <botton
                                            className="btn btn-outline-success mt-4 w-50"
                                            style={{ fontSize: "0.8rem", letterSpacing: "0.14rem",marginLeft:"15%" }}
                                            onClick={ () =>{
                                                this.props.NFTContract.methods.claimNFT(this.props.NFT.tokenID).send({from: this.props.accountAddress, value: this.props.Auction.highestBid, gas: '3000000'});
                                            }}
                                        >
                                            Claim
                                        </botton>
                                    ) : (
                                        <botton
                                            className="btn btn-outline-danger mt-4 w-50"
                                            style={{ fontSize: "0.8rem", letterSpacing: "0.14rem",marginLeft:"15%" }}
                                        >
                                            Waiting for Claim
                                        </botton>
                                    )
                                ) : (
                                    <div></div>
                                )
                            )
        
                        ) : (
                            <botton
                                className="btn btn-outline-danger mt-4 w-50"
                                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem",marginLeft:"15%"}}
                                onClick={()=>{
                                    alert("Not For Sales!")
                                }}
                            >
                                Not For sale
                            </botton>
                        )
                    )
                }
                <br/><br/>
            </div>
        )
    }
}

export default NFTList