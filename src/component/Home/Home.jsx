import React from 'react';
import {Button} from "antd";
import {Link} from "react-router-dom";

const Home = ({ accountAddress, accountBalance, NFTCount }) => {
    console.log("home")
    return (
      <div>
        <div className="jumbotron">
          <h1>Crypto NFT Auction House</h1>
          <p></p>
          <p className="lead">
            欢迎来到 NFT 拍卖行，
            您可以创建自己的 ERC721 标准的 NFT 并在市场上出售。
          </p>
          <hr className="my-5" />
          <div style={{textAlign:"center"}}>
            <p>
              <span className="font-weight-bold" style={{fontSize:"25px",fontStyle:"initial"}}>
              市场上的 NFT 总数 : {NFTCount} <br/>
              </span><br/>
            </p>
          </div>
          <hr className="my-5" />
          <p className="lead">账户地址 :
          <h3>{accountAddress}</h3>
          </p>
          <p className="lead">账户余额 :
          <h3>{accountBalance} ETH</h3>
          </p>
          <p>
            <div style={{marginTop:40,marginLeft:0,width:800}} >
              <Link to="/market">
                <button type="button" className="btn btn-outline-primary"
                        style={{fontSize:20,color:"#f7f7f9",backgroundColor:"#1a1a1a"}}
                >探索
                </button>
              </Link>
              <Link to="/create">
                <button style={{marginLeft:10,fontSize:20}}
                        type="button" className="btn btn-outline-primary">创建
                </button>
              </Link>

            </div>
          </p>
        </div>
      </div>
    );
  };

export default Home;