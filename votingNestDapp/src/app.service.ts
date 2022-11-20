import { Injectable } from '@nestjs/common';
import { BigNumber, ethers } from 'ethers';
import * as tokenJson from '../assets/VoteToken.json';

const ERC20VOTES_TOKEN_ADDRESS = "0x395061A11f4dAD5feCAfB44da775FC6C5229CEDd";

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
  etherBalance: number | undefined;
  tokenBalance: number | undefined;
  votesBalance: number | undefined;
  tokenContract: ethers.Contract | undefined;

  paymentOrders: PaymentOrderDTO[];

  constructor(){
    this.provider = ethers.getDefaultProvider('goerli');
    this.erc20ContractFactory = new ethers.ContractFactory(
      tokenJson.abi,
      tokenJson.bytecode);
    this.wallet = ethers.Wallet.createRandom().connect(this.provider);
    this.tokenContract = new ethers.Contract(ERC20VOTES_TOKEN_ADDRESS, tokenJson.abi, this.wallet);
    //const signer = ethers.Wallet.fromMnemonic(process.env.ETH_M);
    this.paymentOrders = [];
  }

  getHello(): string {
    return 'Hello World!';
  }
  
  getElse(): string {
    return 'Hello Else!';
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

  createWallet(){
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

  vote(voteId: string){
    const newPaymentOrder = new PaymentOrderDTO();
  }
  getTokenAddress(){
    return ERC20VOTES_TOKEN_ADDRESS;
  }
  requestToken(){
  }

}
