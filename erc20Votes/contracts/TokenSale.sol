// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

interface IPropCoin {
    function mint(address to, uint256 amount) external;
}

/// @title TokenSale
contract TokenSale {

    uint256 public ratio;
    IPropCoin public paymentCoin;

    constructor(uint256 ratio_, address paymentCoin_){
        ratio = ratio_;
        paymentCoin = IPropCoin(paymentCoin_);
    }
    function buyTokens() external payable{
        uint256 amount = msg.value / ratio;
        paymentCoin.mint(msg.sender, amount);
    }
    
}
