import React from "react";
import { Link } from "react-router-dom";

const Headerbar = () => {
    console.log("header")
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link to="/" className="navbar-brand ml-2">
            加密 NFT 拍卖行
        </Link>
        <button
          className="navbar-toggler"
          data-toggle="collapse"
          data-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="navbarNav" className="collapse navbar-collapse">
          <ul
            style={{ fontSize: "0.8rem", letterSpacing: "0.2rem" }}
            className="navbar-nav ml-auto"
          >
            <li className="nav-item">
              <Link to="/market" className="nav-link">
                市场
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/create" className="nav-link">
                创建
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/my-nfts" className="nav-link">
                我的NFTs
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/search" className="nav-link">
                搜索
              </Link>
            </li>
            <li className="nav-item">
                <Link to="/aboutme" className="nav-link">
                    有关我
                </Link>
            </li>
            <li className="nav-item">
                <Link to="/aboutnft" className="nav-link">
                    有关NFT
                </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Headerbar;
