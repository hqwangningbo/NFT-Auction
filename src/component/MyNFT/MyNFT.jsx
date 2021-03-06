import React, { useState, useEffect } from "react";
import MyNFTInfo from "./MyNFTInfo";
import {Row, Col, Card} from "antd"
const MyNFT = ({
    accountAddress,
    NFTs,
    NFTContract,
    NFTNumOfAccount,
    Auctions,
    currentTime, 
}) => {
    const [loading,setLoading] = useState(false);
    const [myNFTs, setMyNFTs] = useState([]);
    useEffect(() => {
        if(NFTs.length !== 0){
            if(NFTs[0].metaData !== undefined){
                setLoading(loading)
            }else{
                setLoading(false);
            }
        }
        const myNFTs = NFTs.filter(
            (NFT) => NFT.currentOwner === accountAddress
        );
        setMyNFTs(myNFTs);
    }, [NFTs]);

    return(
        <div>
            <div className="card mt-1">
                <div className="card-body align-items-center d-flex justify-content-center">
                    <h5>
                    Total Number of NFTs Own : {NFTNumOfAccount}
                    </h5>

                </div>
            </div>
            <div className="d-flex flex-wrap mb-2">
                {myNFTs.map((NFT) => {
                    return (
                        <div key={NFT.tokenID} style={{textAlign:"left",marginLeft:200,marginTop:40}} >
                                <a href={`${NFT.tokenURI}`} target="_blank" rel="noopener noreferrer"><img src={NFT.tokenURI} id="preview_img" width="250px" height="250px" alt=""></img><br/></a>
                                   <br/>
                            <MyNFTInfo
                                NFT={NFT}
                                accountAddress={accountAddress}
                                NFTContract={NFTContract}
                                Auction={Auctions[parseInt(NFT.tokenID)-1]}
                                currentTime={currentTime}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyNFT;