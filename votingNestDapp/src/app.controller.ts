import { Controller, Get, Param } from '@nestjs/common';
import { AppService, RequestPaymentOrderDTO, PaymentOrderDTO } from './app.service';
import {Body, Post, Query} from '@nestjs/common/decorators';
import {ethers} from 'ethers';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("last-block")
  getlastBlock() {
    return this.appService.getLastBlock();
  }

  @Get("block/:number")
  getBlock(@Param('number') number: string) {
    return this.appService.getLastBlock(number);
  }
  
  @Get("total-supply")
    getTotalSupply(@Query('address') address: string): Promise<number> {
    return this.appService.getTotalSupply(address);
  }

  // @Get("allowance")
  // getAllowance(@Query('address') address: string,
  //   @Query('from') from: string,
  //   @Query('to')  to: string): Promise<number> {
  //   return this.appService.getAllowance(address, from, to);
  // }


  // @Get("payment-order/:id")
  // getPaymentOrder(@Param('id') id: number): any {
  //   return this.appService.getPaymentOrder(id);
  // }

  // @Post('payment-order')
  // createPaymentOrder(@Body() body: PaymentOrderDTO) : number {
  //   return this.appService.createPaymentOrder(body.value, body.secret);
  // }

  // @Post('request-payment')
  // requestPaymentOrder(@Body() body: RequestPaymentOrderDTO) : Promise<any> {
  //   return this.appService.requestPaymentOrder(body.value, body.secret, body.receiver);
  // }

////Voting DAPP functions
  @Get("voting-token-address")
  getTokenAddress() : any {
    return this.appService.getTokenAddress();
  }

  @Get("voting-account")
  getVotingAccount() : any {
    return this.appService.getVotingAccount();
  }
  @Get("voting-balance")
  getVotingAccountBalance() : any {
    return this.appService.getVotingAccountBalance();
  }
  @Get("voting-power")
  getVotingPower() : any {
    return this.appService.getVotingPower();
  }
  @Get("voting-mint")
  giveRightToVote() : any {
    return this.appService.giveRightToVote();
  }
  @Get("voting-delegate")
  delegateVote(@Param('address') address: string) : any {
    console.log(`delg votes ${address}`);
    return this.appService.delegateVote(address);
  }
  @Get("voting-vote")
  vote(@Param('proposal') proposal: string) : any {
    return this.appService.vote(proposal);
  }
  @Get("voting-create-wallet")
  createNewWallet() : any {
    return this.appService.createNewWallet();
  }

}
