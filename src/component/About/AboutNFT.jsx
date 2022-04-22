import { Typography, Switch } from 'antd';
import React from "react"
const { Paragraph} = Typography;

const AboutNFT = () => {
  const [ellipsis, setEllipsis] = React.useState(true);

  return (
    <div>
    <div className="jumbotron">
        <h1 className="display-10">关于 NFT & DAPP</h1>
    </div>
    <div className='jumbotron'>
      <p className='lead'>
        不可替代的代币 ( NFT ) 是存储在区块链上的不可互换的[需要澄清]数据单元，是一种数字分类帐，可以出售和交易。 [1] NFT 数据单元的类型可能与照片、视频和音频等数字文件相关联。由于每个代币都是唯一可识别的，因此 NFT 不同于区块链加密货币，例如比特币。
      </p>
      <p className='lead'>
        NFT 账本声称提供公开的真实性证明或所有权证明，但 NFT 所传达的合法权利可能不确定。NFT 不限制底层数字文件的共享或复制，不一定传达数字文件的版权，也不阻止创建具有相同关联文件的 NFT。
      </p>
      <p>
      <p className='lead'>
        去中心化应用程序（DApp、dApp、Dapp、DApp 或 DAPP）是可以自主运行的应用程序，通常通过使用智能合约，在去中心化计算、区块链系统上运行。与传统应用程序一样，DApp 为其用户提供一些功能或实用程序。但是，与传统应用程序不同，DApp 无需人工干预即可运行，也不属于任何一个实体，而是 DApp 分发代表所有权的代币。这些代币根据编程算法分配给系统用户，稀释了 DApp 的所有权和控制权。没有任何一个实体控制系统，应用程序变得去中心化。去中心化应用程序已经通过分布式账本技术（DLT）得到普及，例如构建 DApp 的以太坊区块链。
      </p>
      <a href='https://www.theverge.com/22310188/nft-explainer-what-is-blockchain-crypto-art-faq'
        style={{color:"blue",fontSize:"18px"}} target="_blank" 
      >
        What is NFT?
      </a>
      <br/>
      <a href='https://ethereum.org/en/developers/docs/dapps/'
        style={{color:"blue",fontSize:"18px"}} target="_blank" 
      >
        What is DAPP?
      </a>
      &nbsp;<br/><br/> 
      <a href='https://ethereum.org/en/nft/' target="_blank" >
        <h5 className='font-weight'>点击这里了解更多</h5>
      </a>
      </p>
    </div>
    </div>
  );
};

export default AboutNFT;