import { Component } from '@angular/core';
import { BigNumber, ethers } from 'ethers';
import lotteryInterface  from '../assets/Lottery.json';
import lotteryTokenInterface  from '../assets/LotteryToken.json';
import { HttpClient } from '@angular/common/http';

const LOTTERY_ADDRESS = "0x6e8Ea30fc113C862869EAFAf3701217cC9c5c17E"; //put in BE now
const LOTTERY_TOKEN_ADDRESS = "0xB9044E71c00D4Bf0269C474383aF3d5486024BF3";
const BET_PRICE = 0.01;
const BET_FEE = 0.02;
const TOKEN_RATIO = 1;

const ALCHEMY_API_KEY="g1CS1wIDRIhZb0_9mofYmODfLJmh8vlH";
const ETHERSCAN_API_KEY="14KQ8F8MHK4JDKYIVAMEJDCWF88MYIHZ8J";

declare global {
  interface Window {
    ethereum: any
  }
}
//const interface
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  wallet: ethers.Wallet | undefined;
  signer: ethers.Signer | undefined;
  walletAddress: string | undefined;

  provider: ethers.providers.BaseProvider | undefined;
  etherBalance: number | undefined = 0;
  lotteryContract: ethers.Contract | undefined;
  lotteryContractAddress: string | undefined;  
  tokenBalance: number | undefined = 0;
  lotteryTokenContract: ethers.Contract | undefined;
  lotteryTokenContractAddress: string | undefined;
  lotteryState: boolean | undefined;
  winnerName: string | undefined;
  winningProposal: number | undefined; 
  
  constructor(private http: HttpClient){}

  async createWallet() {
    // this.provider = new ethers.providers.AlchemyProvider("goerli", ALCHEMY_API_KEY); //ethers.getDefaultProvider("goerli", {alchemy: ALCHEMY_API_KEY, etherscan: ETHERSCAN_API_KEY});
    // this.wallet = ethers.Wallet.createRandom().connect(this.provider); //
    // this.signer = this.wallet;
    // this.walletAddress = this.wallet.address;
    // //console.log("create random wallet, pub key: "+ this.wallet.publicKey); //
    // //console.log("create random wallet, priv key: "+ this.wallet.privateKey); //if you want to re-import later
    // this.tokenContractAddress = ERC20_VOTES_ADDRESS;
    // this.ballotContractAddress = BALLOT_CONTRACT_ADDRESS;
    // this.tokenContract = new ethers.Contract( ERC20_VOTES_ADDRESS, tokenJsonInterface.abi, this.wallet); //note: for these this.provider works for read-only calls, but write calls like delegate need a real signer
    // this.ballotContract = new ethers.Contract( BALLOT_CONTRACT_ADDRESS , tokenizedBallotJsonInterface.abi, this.wallet); //could be hardcoded vs returning from API
    
    // //this.proposals = 

    // this.updateBlockchainInfo();
    // setInterval( this.updateBlockchainInfo.bind(this), 5000);

  }
  
  async connectWallet(){
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();    
    this.signer = signer;
    this.walletAddress = await this.signer.getAddress();
    console.log("walletAddress is: "+ this.walletAddress);
    const connected_account_addr = await signer.getAddress();
    console.log("Account:", connected_account_addr);    

    
    this.provider = provider; //ethers.getDefaultProvider("goerli", {alchemy: ALCHEMY_API_KEY, etherscan: ETHERSCAN_API_KEY});
    this.wallet = undefined; //hmmm is there no wallet?
    this.lotteryContractAddress = LOTTERY_ADDRESS;
    this.lotteryTokenContractAddress = LOTTERY_TOKEN_ADDRESS;
    this.lotteryContract = new ethers.Contract( LOTTERY_ADDRESS, lotteryInterface.abi, signer);
    this.lotteryTokenContract = new ethers.Contract( LOTTERY_TOKEN_ADDRESS , lotteryTokenInterface.abi, signer); //could be hardcoded vs returning from API

    ///////////////will remove this after build of front end
    this.checkState();
    //this.openBets("9000");
    this.displayBalance();
    this.displayTokenBalance();
    
    
    /////////////////will remove this after build of front end

    this.updateBlockchainInfo();
    setInterval( this.updateBlockchainInfo.bind(this), 5000);
  }
  importWallet(private_key: string){
    console.log('private_key from UI: '+ private_key);
    this.provider = new ethers.providers.AlchemyProvider("goerli", ALCHEMY_API_KEY); //ethers.getDefaultProvider("goerli", {alchemy: ALCHEMY_API_KEY, etherscan: ETHERSCAN_API_KEY});
    const wallet = new ethers.Wallet( private_key ?? "");
    const signer = wallet.connect(this.provider);
    this.wallet = signer;
    this.walletAddress = this.wallet.address;
    //console.log("create random wallet, pub key: "+ this.wallet.publicKey); //
    //console.log("create random wallet, priv key: "+ this.wallet.privateKey); //if you want to re-import later
    // this.tokenContractAddress = ERC20_VOTES_ADDRESS;
    // this.ballotContractAddress = BALLOT_CONTRACT_ADDRESS;
    // this.tokenContract = new ethers.Contract( ERC20_VOTES_ADDRESS, tokenJsonInterface.abi, signer); //note: for these this.provider works for read-only calls, but write calls like delegate need a real signer
    // this.ballotContract = new ethers.Contract( BALLOT_CONTRACT_ADDRESS , tokenizedBallotJsonInterface.abi, signer); //could be hardcoded vs returning from API

    this.updateBlockchainInfo();
    setInterval( this.updateBlockchainInfo.bind(this), 5000);
  }

  //////LOTTERY FUNCTIONS///
  async checkState() {
    ////const state = await this.lotteryContract.betsOpen();
    if (this.lotteryContract && this.provider){
        this.lotteryContract["betsOpen"]().then((state:boolean)=>{
          this.lotteryState = state;
          console.log(`The lottery is ${state ? "open" : "closed"}\n`);
        });
        console.log(`The lottery is ${this.lotteryState ? "open" : "closed"}\n`);
        //if (!this.lotteryState) return this.lotteryState;
        const currentBlock = await this.provider.getBlock("latest");
        const currentBlockDate = new Date(currentBlock.timestamp * 1000);
        const closingTime = await this.lotteryContract["betsClosingTime"]();
        //const receipt = await closingTime.wait();
        const closingTimeDate = new Date(closingTime.toNumber() * 1000);
        console.log(
          `The last block was mined at ${currentBlockDate.toLocaleDateString()} : ${currentBlockDate.toLocaleTimeString()}\n`
        );
        console.log(
          `lottery should close at  ${closingTimeDate.toLocaleDateString()} : ${closingTimeDate.toLocaleTimeString()}\n`
        );
    }
    return this.lotteryState;
  }  
  async openBets(duration: string) {
    if (this.lotteryContract && this.provider){
      const currentBlock = await this.provider.getBlock("latest");
      const tx = await this.lotteryContract["openBets"](currentBlock.timestamp + Number(duration));
      const receipt = await tx.wait();
      console.log(`Bets opened (${receipt.transactionHash})`);
    }
  }
  async displayBalance() {
    if (this.lotteryContract && this.provider && this.signer){
      const bal = await this.signer.getBalance();
      console.log(`The ETH balance for wallet ${this.walletAddress} is ${bal}`);
    }
  }  
  async displayTokenBalance() {
    if (this.lotteryTokenContract && this.provider && this.signer){
      const bal = await this.lotteryTokenContract["balanceOf"](this.walletAddress);
      console.log(`The Lottery Token balance for wallet ${this.walletAddress} is ${bal}`);
    }
  }  


  //////LOTTERY FUNCTIONS///





  async updateBlockchainInfo() {
    console.log('updateBlockchainInfo');
    console.log('walletAddress is: '+this.walletAddress);
    //console.log(this.tokenContractAddress);
    //console.log(this.wallet);
    let wallet_address: string;
    if( this.lotteryContract && (this.wallet || this.signer) && this.lotteryTokenContract) {
      //console.log('inside update');
      //this.tokenContract = new ethers.Contract(this.tokenContractAddress, tokenJsonInterface.abi, this.provider);
      this.lotteryTokenContract["balanceOf"](this.walletAddress).then((tokenBalanceBigNumber:BigNumber)=>{
        //console.log( tokenBalanceBigNumber );
        //console.log( ethers.utils.formatEther(tokenBalanceBigNumber) );
        this.tokenBalance = parseFloat( ethers.utils.formatEther(tokenBalanceBigNumber) );
      });

      if(this.wallet) {
        this.wallet.getBalance().then( (balanceBigNumber) => {
          this.etherBalance = parseFloat( ethers.utils.formatEther(balanceBigNumber) );
          //console.log( balanceBigNumber );
          //console.log( ethers.utils.formatEther(balanceBigNumber) );
        });
      } else if (this.signer) {
        this.signer.getBalance().then( (balanceBigNumber) => {
          this.etherBalance = parseFloat( ethers.utils.formatEther(balanceBigNumber) );
          //console.log( balanceBigNumber );
          //console.log( ethers.utils.formatEther(balanceBigNumber) );
        });
      }
    }
  }
  // vote(voteId: number|string, votePowerToUse: number|string){ //well it comes over as a string
  //   //const vote_id_int = parseInt(voteId);
  //   console.log(typeof votePowerToUse);
  //   if (typeof voteId == 'string') voteId = parseInt(voteId);
  //   if (typeof votePowerToUse == 'string') votePowerToUse = parseInt(votePowerToUse);
    
    
  //   let eth_vote_power = ethers.utils.parseEther( votePowerToUse.toString() );

  //   console.log(`voting for proposal: ${voteId} with power:  ${votePowerToUse} aka ( ${eth_vote_power} )`);
    
  //   //*
  //   if( this.ballotContract && this.wallet) {    
  //     //TODO: take this.ballotContract['vote'](voteId) //need to import the ballotJson at the top to do this
  //     this.ballotContract["vote"]( voteId, eth_vote_power ).then(()=>{
  //       console.log('is voting done?');
  //     });
  //   }
  //   //*/
  // }
  // async delegate(){
  //   //if(this.tokenContractAddress) {
  //     //this.tokenContract = new ethers.Contract(this.tokenContractAddress, tokenJsonInterface.abi, this.provider);
  //     if(this.tokenContract && this.wallet) { //hmmm compiler seems to want this
  //       console.log("need to delegate to yourself:"+ this.walletAddress )
  //       console.log("contract address"+ this.tokenContract.address+ ", this contracts signer: "+ (await this.tokenContract.signer.getAddress()) );
  //       this.tokenContract["delegate"]( this.walletAddress ).then(()=>{
  //         console.log('is delegation done?');
  //       });
  //     }
  //   //}
  // }
  // requestTokens(){
  //   //pass name id ?
  //   this.http.post<any>('http://localhost:3000/request-tokens', {address: this.walletAddress } ).subscribe( (ans)=>{//not a Promise, returns Observable 
  //     console.log(ans);
  //     return ans;
  //   });
  // }
  
  // async viewProposals(numberOfProposals: number) {
  //   //let ballot:unknown = this.ballotContract;
  //   if(this.ballotContract) {
  //     const proposals: { name: string, voteCount: number }[] = [];      
  //     let proposals_blockchain = await this.ballotContract['proposals'];//get it once
  //     for (let i = 0; i <= numberOfProposals - 1; i++) {        
  //       let proposalNameI = proposals_blockchain(i);
  //       let proposalNameString = ethers.utils.parseBytes32String(proposalNameI.name);
  //       let proposalVoteCount = proposalNameI.voteCount;
  //       proposals.push({"name": proposalNameString, "voteCount": parseInt(proposalVoteCount) });
  //     }
  //     return proposals;
  //   }
  //   return [];
  // }


  // async getProposals() {
  //   //const proposals = await this.viewProposals(3);
  //   //console.log(proposals);

  //   const proposals = [];
  //   if(this.ballotContract) { //try manual way as well
  //     let proposal1 = await this.ballotContract['proposals'](0);
  //     let proposal2 = await this.ballotContract['proposals'](1);
  //     let proposal3 = await this.ballotContract['proposals'](2);
  //     console.log('proposalName: '+ ethers.utils.parseBytes32String(proposal1.name) +', voteCount: '+ proposal1.voteCount + ", "+ ethers.utils.formatEther( proposal1.voteCount) );
  //     console.log('proposalName: '+ ethers.utils.parseBytes32String(proposal2.name) +', voteCount: '+ proposal2.voteCount + ", "+ ethers.utils.formatEther( proposal2.voteCount) );
  //     console.log('proposalName: '+ ethers.utils.parseBytes32String(proposal3.name) +', voteCount: '+ proposal3.voteCount + ", "+ ethers.utils.formatEther( proposal3.voteCount) );
  //     proposals.push({"name": ethers.utils.parseBytes32String(proposal1.name), "voteCount": parseInt(proposal1.voteCount) });
  //     proposals.push({"name": ethers.utils.parseBytes32String(proposal2.name), "voteCount": parseInt(proposal2.voteCount) });
  //     proposals.push({"name": ethers.utils.parseBytes32String(proposal3.name), "voteCount": parseInt(proposal3.voteCount) });
  //   }
  //   return proposals;
  // }


  // async getWinnerName(){
  //   if(this.ballotContract){
  //     let winnerName = await this.ballotContract['winnerName']();
  //     return ethers.utils.parseBytes32String(winnerName);
  //   } 
  //   return "";
  // }
  
  // async getWinningProposal(){
  //   if(this.ballotContract){
  //     let winningProposal = await this.ballotContract['winningProposal']();
  //     return winningProposal;
  //   } 
  //   return "";
  // }
  
}
