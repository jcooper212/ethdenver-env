import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { Property } from "../typechain-types/contracts";
import { Property__factory } from "../typechain-types/factories/contracts";
import { PropCoin__factory } from "../typechain-types/factories/contracts/PropCoin__factory";
import { TokenSale__factory } from "../typechain-types/factories/TokenSale__factory";

const TEST_RATIO = 5;

describe("NFT Shop", async () => {
    let accounts: SignerWithAddress[];
    let tokenSaleContract: TokenSale;
    let paymentContract: PropCoin;
    let propContract: Property;
    let propCoinContractFactory: PropCoin__factory;
    let propertyContractFactory: Property__factory;
    let tokenSaleContractFactory: TokenSale__factory;

  beforeEach(async () => {
    [accounts,
        propCoinContractFactory,
        propertyContractFactory,
        tokenSaleContractFactory
    ]  = await Promise.all([
        ethers.getSigners(),
        ethers.getContractFactory("PropCoin"),
        ethers.getContractFactory("Property"),
        ethers.getContractFactory("TokenSale")
    ]);
    paymentContract = await propCoinContractFactory.deploy();
    await paymentContract.deployed();

    tokenSaleContract = await tokenSaleContractFactory.deploy(TEST_RATIO,
            paymentContract.address);
    await tokenSaleContract.deployed();
    const MINTER_ROLE = await paymentContract.MINTER_ROLE();
    const roleTx = await paymentContract.grantRole(MINTER_ROLE,
        tokenSaleContract.address);
  });

  describe("When the Shop contract is deployed", async () => {
    it("defines the ratio as provided in parameters", async () => {
        const ratio = await tokenSaleContract.ratio();
        expect(ratio).to.eq(TEST_RATIO);
    });

    it("uses a valid ERC20 as payment token", async () => {
        const paymentAddress = await tokenSaleContract.paymentCoin();
        const paymentContract = propCoinContractFactory.attach(paymentAddress);
        await expect(paymentContract.totalSupply()).not.to.be.reverted;
    });
  });

  describe("When a user purchase an ERC20 from the Token contract", async () => {
    const buyValue = ethers.utils.parseEther("1");
    let ethBalBefore: BigNumber;

    beforeEach(async () => {
        ethBalBefore = await(accounts[1]).getBalance();
        const tx = await tokenSaleContract
            .connect(accounts[1])
            .buyTokens({value: buyValue});
            const txRec = await tx.wait();
            const gasUsed = txRec.gasUsed;
            const PricePerGas = txRec.effectiveGasPrice;
            const gasCosts = gasUsed.mul(PricePerGas);
    });

    it("charges the correct amount of ETH", async () => {
        const ethBalAfter = await(accounts[1]).getBalance();
        const diff = ethBalBefore.sub(ethBalAfter);
        const expDiff = buyValue.add(gasCosts);
        const error = diff.sub(expDiff);
        expect(error).to.eq(0);
    });

    it("gives the correct amount of tokens", async () => {
        const bal = paymentContract.balanceOf(accounts[1].address);
        const expBal = buyValue.div(TEST_RATIO);
        expect(bal).to.eq(expBal);
    });
  });

  describe("When a user burns an ERC20 at the Token contract", async () => {
    it("gives the correct amount of ETH", async () => {
      throw new Error("Not implemented");
    });

    it("burns the correct amount of tokens", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When a user purchase a NFT from the Shop contract", async () => {
    it("charges the correct amount of ETH", async () => {
      throw new Error("Not implemented");
    });

    it("updates the owner account correctly", async () => {
      throw new Error("Not implemented");
    });

    it("update the pool account correctly", async () => {
      throw new Error("Not implemented");
    });

    it("favors the pool with the rounding", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When a user burns their NFT at the Shop contract", async () => {
    it("gives the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });
    it("updates the pool correctly", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When the owner withdraw from the Shop contract", async () => {
    it("recovers the right amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });

    it("updates the owner account correctly", async () => {
      throw new Error("Not implemented");
    });
  });
});