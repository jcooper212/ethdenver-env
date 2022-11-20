import { Controller, Get, Param } from '@nestjs/common';
import { AppService, RequestPaymentOrderDTO, PaymentOrderDTO } from './app.service';
import {Body, Post, Query} from '@nestjs/common/decorators';
import {ethers} from 'ethers';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("last-block")
  getlastBlock() {
    return this.appService.getLastBlock();
  }

  @Get("block/:number")
  getBlock(@Param('number') number: string) {
    return this.appService.getLastBlock(number);
  }
  
  @Get("total-supply/:address")
    getTotalSupply(@Param('address') address: string): Promise<number> {
    return this.appService.getTotalSupply(address);
  }

  @Get("allowance")
  getAllowance(@Query('address') address: string,
    @Query('from') from: string,
    @Query('to')  to: string): Promise<number> {
    return this.appService.getAllowance(address, from, to);
  }


  @Get("payment-order/:id")
  getPaymentOrder(@Param('id') id: number): any {
    return this.appService.getPaymentOrder(id);
  }

  @Post('payment-order')
  createPaymentOrder(@Body() body: PaymentOrderDTO) : number {
    return this.appService.createPaymentOrder(body.value, body.secret);
  }

  @Post('request-payment')
  requestPaymentOrder(@Body() body: RequestPaymentOrderDTO) : Promise<any> {
    return this.appService.requestPaymentOrder(body.value, body.secret, body.receiver);
  }
}
