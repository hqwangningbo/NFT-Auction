import React from "react";
import {Route, HashRouter,Routes, BrowserRouter} from "react-router-dom";
import {Layout} from 'antd'
import './App.css';
import Web3 from "web3"
import Loading from "./component/Loading/Loading"
import Home from "./component/Home/Home"
import Metamask from "./component/Connect/Metamask"
import NoContract from "./component/Connect/NoContract"
import Create from "./component/Create/Create"
import HeaderBar from "./component/Layout/HeaderBar"
import Footerr from "./component/Layout/Footerr"
import Market from "./component/Market/Market"
import MyNFT from "./component/MyNFT/MyNFT"
import About from "./component/About/About"
import AboutNFT from "./component/About/AboutNFT"
import Search from "./component/Search/Search"
import NotFound from "./component/NotFound"
import NFTAuctionHouse from "./build/contracts/NFTAuctionHouse.json";
const {Footer} = Layout;
class App extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      loading : true,
      metamaskConnected : false,
      contractDetected : false,
      accountAddress : "",
      accountBalance : "",
      NFTContract: null,
      NFTCount : 0,
      NFTs: [],
      NFTNumOfAccount: 0,
      Auctions: [],
      currentTime: null,
    };
  }
  componentDidMount(){
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillMount = async () =>{
    await this.loadingWeb3();
    await this.loadingBlockchain();
  }
  componentWillUnmount(){
    clearInterval(this.timerID)
  }

  tick = async() => {
    if(this.state.NFTContract){
      let currentTime = await this.state.NFTContract.methods.getTime().call();
      console.log("time : ", currentTime)
      this.setState({currentTime});
    }
  }

  loadingWeb3 = async() =>{
    console.log("load web3")
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert("Ethereum Browser Not Detected!")
    }
  }

  loadingBlockchain = async () => {
    console.log("load blockchain")
    const web3 = window.web3;
    const account = await web3.eth.getAccounts();
    if(account.length === 0){
      this.setState({
        metamaskConnected : false
      })
    }
    else{
      this.setState({
        metamaskConnected : true,
        loading:true,
        accountAddress : account[0],
      })
      let balance = await web3.eth.getBalance(account[0])
      balance = web3.utils.fromWei(balance, "ether")
      this.setState({
        accountBalance : balance,
        loading:false,
      })

      const netID = await web3.eth.net.getId();
      const netData = NFTAuctionHouse.networks[netID];
      if(netData){
        this.setState({loading: true});
        const NFTContract = new web3.eth.Contract(
            NFTAuctionHouse.abi,
            netData.address
        );
        this.setState({NFTContract});
        this.setState({contractDetected: true});
        
        const NFTCount = await NFTContract.methods.NFTCounter().call();
        this.setState({NFTCount});
        for(let i = 1 ; i <= NFTCount ; i++){
          const nft = await NFTContract.methods.allNFTs(i).call();
          this.setState({NFTs: [...this.state.NFTs, nft],});
          const auction = await NFTContract.methods.AuctionsOfNFT(i).call();
          this.setState({Auctions: [...this.state.Auctions, auction],})
        }
        let NFTNumOfAccount = await NFTContract.methods.getTotalNumberOfTokensOwnedByAnAddress(this.state.accountAddress).call();
        this.setState({NFTNumOfAccount});
        this.setState({loading: false});

      }
    }
  }

  connectToMetamask = async () =>{
    console.log("connect metamask")
    await window.ethereum.enable();
    this.setState({
      metamaskConnected : true,
    })
    window.location.reload();
  }

  render(){
    return(
      <div>
        {
          !this.state.metamaskConnected ? (
            <Metamask connectToMetamask={this.connectToMetamask}/>
          ) : ! this.state.contractDetected ? (
              <NoContract/>
          ) : this.state.loading ? (
              <Loading/>
          ) : (
              <BrowserRouter basename="/">
                <HeaderBar/>
                <Routes>
                  <Route
                      path="/"
                      exact
                      element={
                          <Home
                              accountAddress={this.state.accountAddress}
                              accountBalance={this.state.accountBalance}
                              NFTCount={this.state.NFTCount}
                          />
                      }
                  />
                  <Route
                      path="/market"
                      exact
                      element={
                          <Market 
                              accountAddress={this.state.accountAddress}
                              NFTs={this.state.NFTs}
                              NFTCount={this.state.NFTCount}
                              NFTContract={this.state.NFTContract}
                              Auctions={this.state.Auctions}
                          />
                      }
                  />
                  <Route
                      path="/create"
                      exact
                      element={
                          <Create
                              accountAddress={this.state.accountAddress}
                              NFTContract={this.state.NFTContract}
                          />
                      }
                  />
                  <Route
                      path="/my-nfts"
                      exact
                      element={
                          <MyNFT
                              accountAddress={this.state.accountAddress}
                              NFTs={this.state.NFTs}
                              NFTNumOfAccount={this.state.NFTNumOfAccount}
                              NFTContract={this.state.NFTContract}
                              Auctions={this.state.Auctions}
                              currentTime={this.state.currentTime}
                          />
                      }
                  />
                  <Route
                      path="/search"
                      exact
                      element={
                          <Search
                              accountAddress={this.state.accountAddress}
                              NFTs={this.state.NFTs}
                              NFTCount={this.state.NFTCount}
                              NFTContract={this.state.NFTContract}
                              Auctions={this.state.Auctions}
                          />
                      }
                  />
                  <Route
                      path="/aboutme"
                      exact
                      element={
                          <About/>
                      }
                  />
                  <Route
                      path="/aboutnft"
                      exact
                      element={
                          <AboutNFT/>
                      }
                  />
                  <Route
                      path="*"
                      element={
                          <NotFound/>
                      }
                  />
                </Routes>
                <Layout>
                  <Footer>
                    <Footerr/>
                  </Footer>
                </Layout>
                
              </BrowserRouter>
              )
        }
      </div>
    )
  }
}

export default App;
