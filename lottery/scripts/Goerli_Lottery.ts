//import { ethers } from "hardhat";
import * as readline from "readline";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Lottery, LotteryToken, Lottery__factory, LotteryToken__factory } from "../typechain-types";
import { ethers } from "ethers";

let contract: Lottery;
let token: LotteryToken;
let accounts: SignerWithAddress[];
let signer: ethers.Wallet;

const BET_PRICE = 0.01;
const BET_FEE = 0.02;
const TOKEN_RATIO = 1;
const LOTTERY_CONTRACT_ADDRESS ='';
//Arian: from Jamshed's orig address: 0x6e8Ea30fc113C862869EAFAf3701217cC9c5c17E

//LotteryToken is deployed at 0xB9044E71c00D4Bf0269C474383aF3d5486024BF3
//const LOTTERY_CONTRACT_ADDRESS ='0x5e22603e0321e4B3e146f701B33CeAC328E13c62';
//Lottery is deployed at 0x5e22603e0321e4B3e146f701B33CeAC328E13c62
//LotteryToken is deployed at 0xEA76460bE2971bd5003D058D6494972ECA7C4d06


//Arian: 
const MM_0_PRIVATE_KEY="PUT_HERE";
//^^ 
const MM_1_PRIVATE_KEY="PUT_HERE";
//^^ 

const ALCHEMY_API_KEY="MwLDDsXrUc33uY_JtGf7si7uJbd0cyQy";

async function main() {
  await initContracts();
  //await initAccounts();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  //mainMenu(rl);
}

async function initContracts() {
  ///goerli  
  //connect to provider
    const provider = ethers.getDefaultProvider("goerli", {
      alchemy: ALCHEMY_API_KEY
    });
    const wallet = new ethers.Wallet(MM_0_PRIVATE_KEY);
    signer = wallet.connect(provider);
    const balance = await signer.getBalance();
    console.log(`W3 balance is ${signer.address} / ${balance} wei`);
  
    //local provider
    //accounts = await ethers.getSigners();
    ///goerli

  //const contractFactory = await ethers.getContractFactory("Lottery");
  console.log(`ratio conversions: fee is ${ethers.utils.parseEther(BET_FEE.toFixed(18)).div(1e15)}
    & price is ${ethers.utils.parseEther(BET_PRICE.toFixed(18)).div(1e15)} 
    & ratio is ${ethers.utils.parseEther("1").div(1e14)}
    & ratio in wei is ${ethers.utils.parseEther("1").div(1e14)}`);

  const contractFactory = new Lottery__factory(signer);
  if (LOTTERY_CONTRACT_ADDRESS == ''){
      contract = await contractFactory.deploy(
        "LotteryToken",
        "LT0",
        TOKEN_RATIO,
        ethers.utils.parseEther(BET_PRICE.toFixed(18)).div(1e15),
        ethers.utils.parseEther(BET_FEE.toFixed(18)).div(1e15)
      );
      await contract.deployed();
  } else {
    contract = contractFactory.attach(LOTTERY_CONTRACT_ADDRESS);
  }
  console.log(`Lottery is deployed at ${contract.address}`);
  const tokenAddress = await contract.paymentToken();
  //const tokenFactory = await ethers.getContractFactory("LotteryToken");
  const tokenFactory = new LotteryToken__factory(signer);
  token = tokenFactory.attach(tokenAddress);
  console.log(`LotteryToken is deployed at ${token.address}`);
}

async function initAccounts() {
  //accounts = await ethers.getSigners();
}
/*
async function mainMenu(rl: readline.Interface) {
  menuOptions(rl);
}

function menuOptions(rl: readline.Interface) {
  rl.question(
    "Select operation: \n Options: \n [0]: Exit \n [1]: Check state \n [2]: Open bets \n [3]: Top up account tokens \n [4]: Bet with account \n [5]: Close bets \n [6]: Check player prize \n [7]: Withdraw \n [8]: Burn tokens \n",
    async (answer: string) => {
      console.log(`Selected: ${answer}\n`);
      const option = Number(answer);
      switch (option) {
        case 0:
          rl.close();
          return;
        case 1:
          await checkState();
          mainMenu(rl);
          break;
        case 2:
          rl.question("Input duration (in seconds)\n", async (duration) => {
            try {
              await openBets(duration);
            } catch (error) {
              console.log("error\n");
              console.log({ error });
            }
            mainMenu(rl);
          });
          break;
        case 3:
          rl.question("What account (index) to use?\n", async (index) => {
            await displayBalance(index);
            rl.question("Buy how many tokens?\n", async (amount) => {
              try {
                await buyTokens(index, amount);
                await displayBalance(index);
                await displayTokenBalance(index);
              } catch (error) {
                console.log("error\n");
                console.log({ error });
              }
              mainMenu(rl);
            });
          });
          break;
        case 4:
          rl.question("What account (index) to use?\n", async (index) => {
            await displayTokenBalance(index);
            rl.question("Bet how many times?\n", async (amount) => {
              try {
                await bet(index, amount);
                await displayTokenBalance(index);
              } catch (error) {
                console.log("error\n");
                console.log({ error });
              }
              mainMenu(rl);
            });
          });
          break;
        case 5:
          try {
            await closeLottery();
          } catch (error) {
            console.log("error\n");
            console.log({ error });
          }
          mainMenu(rl);
          break;
        case 6:
          rl.question("What account (index) to use?\n", async (index) => {
            const prize = await displayPrize(index);
            if (Number(prize) > 0) {
              rl.question(
                "Do you want to claim your prize? [Y/N]\n",
                async (answer) => {
                  if (answer.toLowerCase() === "y") {
                    try {
                      await claimPrize(index, prize);
                    } catch (error) {
                      console.log("error\n");
                      console.log({ error });
                    }
                  }
                  mainMenu(rl);
                }
              );
            } else {
              mainMenu(rl);
            }
          });
          break;
        case 7:
          await displayTokenBalance("0");
          await displayOwnerPool();
          rl.question("Withdraw how many tokens?\n", async (amount) => {
            try {
              await withdrawTokens(amount);
            } catch (error) {
              console.log("error\n");
              console.log({ error });
            }
            mainMenu(rl);
          });
          break;
        case 8:
          rl.question("What account (index) to use?\n", async (index) => {
            await displayTokenBalance(index);
            rl.question("Burn how many tokens?\n", async (amount) => {
              try {
                await burnTokens(index, amount);
              } catch (error) {
                console.log("error\n");
                console.log({ error });
              }
              mainMenu(rl);
            });
          });
          break;
        default:
          throw new Error("Invalid option");
      }
    }
  );
}

async function checkState() {
  const state = await contract.betsOpen();
  console.log(`The lottery is ${state ? "open" : "closed"}\n`);
  if (!state) return;
  const currentBlock = await ethers.provider.getBlock("latest");
  const currentBlockDate = new Date(currentBlock.timestamp * 1000);
  const closingTime = await contract.betsClosingTime();
  const closingTimeDate = new Date(closingTime.toNumber() * 1000);
  console.log(
    `The last block was mined at ${currentBlockDate.toLocaleDateString()} : ${currentBlockDate.toLocaleTimeString()}\n`
  );
  console.log(
    `lottery should close at  ${closingTimeDate.toLocaleDateString()} : ${closingTimeDate.toLocaleTimeString()}\n`
  );
}

async function openBets(duration: string) {
  const currentBlock = await ethers.provider.getBlock("latest");
  const tx = await contract.connect(signer).openBets(currentBlock.timestamp + Number(duration));
  const receipt = await tx.wait();
  console.log(`Bets opened (${receipt.transactionHash})`);
}

async function displayBalance(index: string) {
  const balanceBN = await signer.getBalance();
  const balance = ethers.utils.formatEther(balanceBN);
  console.log(
    `The account of address ${
      accounts[Number(index)].address
    } has ${balance} ETH\n`
  );
}

async function buyTokens(index: string, amount: string) {
  const tx = await contract.connect(signer).purchaseTokens({
    value: ethers.utils.parseEther(amount).div(1e14),
  });
  const receipt = await tx.wait();
  console.log(`Tokens bought (${receipt.transactionHash})\n`);
}

async function displayTokenBalance(index: string) {
  const balanceBN = await token.connect(signer).balanceOf(signer.address);
  const balance = ethers.utils.formatEther(balanceBN);
  console.log(
    `The account of address ${
      accounts[Number(index)].address
    } has ${balance} LT0\n`
  );
}

async function bet(index: string, amount: string) {
  const allowTx = await token
    .connect(signer)
    .approve(contract.address, ethers.constants.MaxUint256);
  await allowTx.wait();
  const tx = await contract.connect(signer).betMany(amount);
  const receipt = await tx.wait();
  console.log(`Bets placed (${receipt.transactionHash})\n`);
}

async function closeLottery() {
  const tx = await contract.connect(signer).closeLottery();
  const receipt = await tx.wait();
  console.log(`Bets closed (${receipt.transactionHash})\n`);
}

async function displayPrize(index: string): Promise<string> {
  const prizeBN = await contract.connect(signer).prize(accounts[Number(index)].address);
  const prize = ethers.utils.formatEther(prizeBN);
  console.log(
    `The account of address ${
      accounts[Number(index)].address
    } has earned a prize of ${prize} Tokens\n`
  );
  return prize;
}

async function claimPrize(index: string, amount: string) {
  const tx = await contract
    .connect(signer)
    .prizeWithdraw(ethers.utils.parseEther(amount));
  const receipt = await tx.wait();
  console.log(`Prize claimed (${receipt.transactionHash})\n`);
}

async function displayOwnerPool() {
  const balanceBN = await contract.connect(signer).ownerPool();
  const balance = ethers.utils.formatEther(balanceBN);
  console.log(`The owner pool has (${balance}) Tokens \n`);
}

async function withdrawTokens(amount: string) {
  const tx = await contract.connect(signer).ownerWithdraw(ethers.utils.parseEther(amount));
  const receipt = await tx.wait();
  console.log(`Withdraw confirmed (${receipt.transactionHash})\n`);
}

async function burnTokens(index: string, amount: string) {
  const allowTx = await token
    .connect(signer)
    .approve(contract.address, ethers.constants.MaxUint256);
  const receiptAllow = await allowTx.wait();
  console.log(`Allowance confirmed (${receiptAllow.transactionHash})\n`);
  const tx = await contract
    .connect(signer)
    .returnTokens(ethers.utils.parseEther(amount));
  const receipt = await tx.wait();
  console.log(`Burn confirmed (${receipt.transactionHash})\n`);
}
*/

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
