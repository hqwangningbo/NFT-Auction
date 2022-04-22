import React from "react";

const Metamask = ({ connectToMetamask }) => {
  return (
    <div className="jumbotron">
      <h1 className="display-3">
        NFT Auction House
      </h1>
      <p className="lead">
        Welcome to NFT Auction House
        <br/>
        You Can Create Your Own ERC721 implemented <i>NFTs</i> and Sell Them On The Market.
      </p>
      <hr className="my-4" />
      <button
        onClick={connectToMetamask}
        className="btn btn-secondary d-flex align-items-center"
        style={{ background:"lightgrey",fontSize: "1.0rem", letterSpacing: "0.10rem" }}
      >
        Connect Metamask{" "}
      </button>
    </div>
  );
};

export default Metamask;
