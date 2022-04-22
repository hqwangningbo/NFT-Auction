import React from "react";

const NoContract = () => {
  return (
    <div className="jumbotron">
      <h3>NFT Auction Contract Is Not Detected In This Network.</h3>
      <hr className="my-4" />
      <p className="lead">
        Connect Metamask to Ropsten Testnet Or Localhost 8545 running a custom RPC like Ganache.
      </p>
    </div>
  );
};

export default NoContract;
