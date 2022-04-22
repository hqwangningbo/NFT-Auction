import React from "react"
import { useState,useEffect } from "react";
import {Row, Col} from "antd"
import NFTList from "./NFTList"

const Market = ({
    NFTs,
    accountAddress,
    NFTCount,
    NFTContract,
    Auctions,
}) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(NFTs.length !== 0){
            if(NFTs[0].metaData !== undefined){
                setLoading(loading);
            }
            else setLoading(false);
        }
    }, [NFTs]);

    return(
        <div>
            <div className="jumbotron">
                <h1 className="display-5"> NFT 市场</h1>
                </div>
            <div className="d-flex flex-wrap mb-2">
                {NFTs.map((NFT) => {
                    return(
                        //,border:"1px dashed #000"
                        <div key={NFT.tokenID} style={{textAlign:"left",marginLeft:200,marginTop:40,height:800,width:600}}>
                                    <img src={NFT.tokenURI} style={{marginLeft:"20%"}} id="preview_img" width="250px" height="250px" alt=""></img>

                                    {/*<p>*/}
                                    {/*    <span className="font-weight-bold">Image Preview URL</span>*/}
                                    {/*    :{" "}*/}
                                    {/*    <a href={`${NFT.tokenURI}`} target="_blank" rel="noopener noreferrer">{NFT.tokenURI}</a>*/}
                                    {/*</p>*/}
                                    <NFTList NFT={NFT}
                                        accountAddress={accountAddress}
                                        NFTContract={NFTContract}
                                        Auction={Auctions[parseInt(NFT.tokenID)-1]}
                                    />
                        </div>
                    )
                })}
            </div>
            
        </div>
    )
}

export default Market;