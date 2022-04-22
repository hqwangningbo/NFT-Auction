import React from "react";
import { CopyrightOutlined,AntDesignOutlined, DollarCircleOutlined, MailOutlined } from '@ant-design/icons';
import {Layout} from 'antd';
const t = Date.now();
const {Footer} = Layout;
const Footerr = () => {
  const defaultMessage = "Powered by Ant Design"
  const currentYear = new Date().getFullYear();
  return (
    <div className="jumbotron h-50" style={{textAlign:"center", fontSize:"18px"}}>
      <Footer>
          Crypto NFT Auction House {<DollarCircleOutlined />}
          <br/>
          {<CopyrightOutlined className="site-form-item-icon"/>}{`${currentYear} | ${defaultMessage}`} 
          <a href="https://ant.design"><AntDesignOutlined /></a>
          <br/>
          <span>Contact Me : {<MailOutlined/>} 2536935847@qq.com</span>
      </Footer>
      {/*<div style={{textAlign:"right"}}>{t}</div>*/}
      
    </div>
  );
};
export default Footerr;