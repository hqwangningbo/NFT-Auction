import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://github.com/hqwangningbo/NFT-Auction" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="NFT-Auction"
        subTitle="ClockAuction 1.0"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
