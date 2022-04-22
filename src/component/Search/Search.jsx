import React, { useState } from "react";

const Search = (props) => {
  const [tokenIdForOwner, setTokenIdForOwner] = useState("");
  const [tokenOwner, setTokenOwner] = useState("");
  const [tokenIdForOwnerNotFound, setTokenIdForOwnerNotFound] = useState(false);

  const [tokenIdForMetadata, setTokenIdForMetadata] = useState("");
  const [tokenMetadata, setTokenMetadata] = useState("");
  const [tokenMetadataLink, setTokenMetadataLink] = useState("");
  const [tokenIdForMetadataNotFound, setTokenIdForMetadataNotFound] = useState(false);

  const getTokenOwner = async (e) => {
    e.preventDefault();
    try {
      const owner = await props.NFTContract.methods.getTokenOwner(tokenIdForOwner).call();
      setTokenOwner(owner);
      setTimeout(() => {
        setTokenOwner("");
        setTokenIdForOwner("");
      }, 5000);
    } catch (e) {
      setTokenIdForOwnerNotFound(true);
      setTokenIdForOwner("");
    }
  };

  const getTokenMetadata = async (e) => {
    e.preventDefault();
    try {
      const metadata = await props.NFTContract.methods.getTokenMetaData(tokenIdForMetadata).call();
      setTokenMetadata(metadata.substr(0, 60) + "..." + metadata.slice(metadata.length - 5));
      setTokenMetadataLink(metadata);
      setTimeout(() => {
        setTokenMetadata("");
        setTokenIdForMetadata("");
      }, 5000);
    } catch (e) {
      setTokenIdForMetadataNotFound(true);
      setTokenIdForMetadata("");
    }
  };

  return (
    <div>
      <div className="card mt-1">
        <div className="jumbotron">
            <h1 className="display-5">通过 TokenID 搜索NFT拥有者 & 原数据</h1>
        </div>
      </div>
      <div className="p-4 mt-1 border">
        <div className="row">
          <div className="col-md-12">
            <h5>搜索NFT拥有者</h5>
            <form onSubmit={getTokenOwner}>
              <div className="form-group">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={tokenIdForOwner}
                  placeholder="Enter tokenID"
                  onChange={(e) => setTokenIdForOwner(e.target.value)}
                />
              </div>
              <button className="mt-3 btn btn-outline-primary" 
                style={{ width:"250px",textAlign:"center",background:"white",fontSize: "1.0rem", letterSpacing: "0.10rem" }} type="submit">
                Search Owner
              </button>
              {tokenIdForOwnerNotFound ? (
                <div className="alert alert-danger alert-dissmissible mt-4">
                  <button type="button" className="close" data-dismiss="alert">
                    <span>&times;</span>
                  </button>
                  <strong>Token ID Does Not Exist</strong>
                </div>
              ) : null}
            </form>
            <p className="mt-4">Token Owner : {tokenOwner}</p>
          </div>
          <div className="mt-4 col-md-12">
            <h5>搜索Token原数据</h5>
            <form onSubmit={getTokenMetadata}>
              <div className="form-group">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={tokenIdForMetadata}
                  placeholder="Enter tokenID"
                  onChange={(e) => setTokenIdForMetadata(e.target.value)}
                />
              </div>
              <button className="mt-3 btn btn-outline-primary"
                style={{ width:"250px",textAlign:"center",background:"white",fontSize: "1.0rem", letterSpacing: "0.10rem" }} type="submit">
                Search Metadata
              </button>
              {tokenIdForMetadataNotFound ? (
                <div className="alert alert-danger alert-dissmissible mt-4">
                  <button type="button" className="close" data-dismiss="alert">
                    <span>&times;</span>
                  </button>
                  <strong>Token ID Does Not Exist</strong>
                </div>
              ) : null}
            </form>
            <p className="mt-4">
              Token Metadata :  &nbsp;
              <a
                href={`${tokenMetadataLink}`}
                style={{color:"blue"}}
                target="_blank"
                rel="noopener noreferrer"
              >
                {tokenMetadataLink}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
