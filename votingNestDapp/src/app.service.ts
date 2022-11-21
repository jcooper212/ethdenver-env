import { Injectable } from '@nestjs/common';
import { BigNumber, ethers } from 'ethers';
import * as tokenJson from '../assets/VoteToken.json';
import * as ballotJson from '../assets/TokenizedBallot.json';


const ERC20VOTES_TOKEN_ADDRESS = "0x395061A11f4dAD5feCAfB44da775FC6C5229CEDd";
const BALLOT_TOKEN_ADDRESS = "0xb55dFf80EB5B2813061Be67da8C681cdC139EACc";


export class PaymentOrderDTO {
  value: number;
  secret: string;
  id: number;
}

export class RequestPaymentOrderDTO {
  value: number;
  id: number;
  secret: string;
  receiver: string;
}

@Injectable()
export class AppService {

  provider: ethers.providers.BaseProvider;
  erc20ContractFactory;
  wallet: ethers.Wallet | undefined;
  signer: ethers.Wallet | undefined;
  voteSigner: ethers.Wallet | undefined;
  etherBalance: number | undefined;
  tokenBalance: number | undefined;
  votesBalance: number | undefined;
  tokenContract: ethers.Contract | undefined;
  ballotContract: ethers.Contract | undefined;
  votingAccount: string | undefined;
  mint_value: BigNumber | undefined;
  mint_unit: BigNumber | undefined;

  paymentOrders: PaymentOrderDTO[];

  constructor(){
    const provider = ethers.getDefaultProvider("goerli", {
      alchemy: "g1CS1wIDRIhZb0_9mofYmODfLJmh8vlH",
    });
    this.wallet = new ethers.Wallet(process.env.ETH_P3);
    this.signer = this.wallet.connect(provider);
    this.voteSigner = this.signer;
    this.votingAccount = this.signer.address;
    this.mint_value = ethers.utils.parseEther("1");
    this.mint_unit = this.mint_value.div(100);

  
    
    // this.erc20ContractFactory = new ethers.ContractFactory(
    //   tokenJson.abi,
    //   tokenJson.bytecode);
    // this.wallet = ethers.Wallet.createRandom().connect(this.provider);
    this.tokenContract = new ethers.Contract(ERC20VOTES_TOKEN_ADDRESS, tokenJson.abi, this.signer);
    this.ballotContract = new ethers.Contract(BALLOT_TOKEN_ADDRESS, ballotJson.abi, this.signer);

    //const signer = ethers.Wallet.fromMnemonic(process.env.ETH_M);
    this.paymentOrders = [];
  }
  
  getLastBlock(blockNum: string = 'latest') {
    return this.provider.getBlock(blockNum);
  }

  async getTotalSupply(address: string): Promise<number> {
    const contract = this.erc20ContractFactory
      .attach(address)
      .connect(this.provider);
      const totalSupply = await contract.totalSupply();
      return parseFloat(ethers.utils.formatEther(totalSupply));

  }

  async getAllowance(address: string,
    from: string,
    to: string): Promise<number> {
      const contract = this.erc20ContractFactory
        .attach(address)
        .connect(this.provider);
        const allowance = await contract.allowance(from,to);
        return parseFloat(ethers.utils.formatEther(allowance));

  }

  getPaymentOrder(id: number){
    const po = this.paymentOrders[id];
    return {value: po.value, secret: po.secret, id: po.id};
  }

  createPaymentOrder(value: number, secret: string) {
    const newPaymentOrder = new PaymentOrderDTO();
    newPaymentOrder.value = value;
    newPaymentOrder.secret = secret;
    newPaymentOrder.id = this.paymentOrders.length;
    this.paymentOrders.push(newPaymentOrder);
    return newPaymentOrder.id;
  }

  async requestPaymentOrder(id: number, secret: string, receiver: string) {
    const po = this.paymentOrders[id];
    if (secret != po.secret) throw new Error("WRONG secret");
    const signer = ethers.Wallet.createRandom().connect(this.provider);
    const contractInstance =  this.erc20ContractFactory
      .attach(ERC20VOTES_TOKEN_ADDRESS)
      .connect(signer);
    const tx = await contractInstance.mint(receiver, po.value);
    return tx.wait();
  }

  createAWallet(){
    this.wallet.getBalance().then((bal) => {
      this.etherBalance = parseFloat(ethers.utils.formatEther(bal));
    });
    this.tokenContract['balanceOf'](this.wallet.address).then(
      (tokenBal: BigNumber) => {
        this.tokenBalance = parseFloat(
          ethers.utils.formatEther(tokenBal)
        )
      });
      this.tokenContract['getVotes'](this.wallet.address).then(
        (voteBal: BigNumber) => {
          this.votesBalance = parseFloat(
            ethers.utils.formatEther(voteBal)
          )
        });
  }

  async giveRightToVote(){
    const mintTx = await this.tokenContract.mint(this.votingAccount, this.mint_value);
    await mintTx.wait();
    console.log(`Minted ${this.mint_value.toString()} units to account ${this.votingAccount}`);
    const bal = await this.tokenContract.balanceOf(this.votingAccount);
    var votes = await this.tokenContract.getVotes(this.votingAccount);
    console.log(`The balance is ${(await bal).toString()} for account ${this.votingAccount}
      with voting power ${votes.toString()}`);

    //Self Delegate
    var delegateTx = await this.tokenContract.connect(this.signer).delegate(this.votingAccount);
    await delegateTx.wait();
    votes = this.tokenContract.getVotes(this.votingAccount);
    console.log(`After delegate got ${(await votes).toString()} voting power for account ${this.votingAccount}`);
    return (await votes).toString();
  }

  async delegateVote(to_account: string){
    //const to_wallet = new ethers.Wallet(to_account);
    console.log(`delegate to ${to_account}`);
    const transferTx = await this.tokenContract.connect(this.signer).transfer(to_account, this.mint_unit);
    (await transferTx).wait();
    var votes = await this.tokenContract.getVotes(this.votingAccount);
    console.log(`After transfer VOTING ACCT got ${(await votes).toString()} voting power for account ${this.votingAccount}`)
    var delegateTx = await this.tokenContract.connect(this.signer).delegate(to_account);
    await delegateTx.wait();
    votes = await this.tokenContract.getVotes(this.votingAccount);
    console.log(`After delegation VOTING ACCT got ${(await votes).toString()} voting power for account ${this.votingAccount}`)
    votes = await this.tokenContract.getVotes(to_account);
    console.log(`After transfer DELEGATE_ACCT got ${(await votes).toString()} voting power for account ${to_account}`)
  }

  getTokenAddress(){
    return ERC20VOTES_TOKEN_ADDRESS;
  }
  
  getVotingAccount(){
    return this.votingAccount;
  }
  
  async getVotingAccountBalance(){
    const bal = await this.tokenContract.balanceOf(this.votingAccount);
    return (await bal).toString();
  }
  
  async getVotingPower(){
    const bal = await this.tokenContract.getVotes(this.votingAccount);
    return (await bal).toString();
  }
  
  async createNewWallet(){
    this.voteSigner = ethers.Wallet.createRandom().connect(this.provider);
    // this.ballotContract = new ethers.Contract(BALLOT_TOKEN_ADDRESS, ballotJson.abi, this.voteSigner);

    return this.voteSigner.address;
  }
  async vote(voteId: string){
    var votes = await this.tokenContract.getVotes(this.voteSigner.address);
    console.log(`Before Voting -- ${(await votes).toString()} voting power for account ${this.voteSigner.address}`);

    const voteTx = await this.ballotContract.connect(this.voteSigner).vote(voteId, 5000);
    (await voteTx).wait();

    var votes = await this.tokenContract.getVotes(this.voteSigner.address);
    console.log(`After Voting -- ${(await votes).toString()} voting power for account ${this.voteSigner.address}`);

    return this.voteSigner.address;
  }


}
