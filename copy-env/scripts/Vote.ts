import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
const contractAddress = "0xe36555Edfc41c8d8b12DE16043E9C17834C83F3b";
const targetAddress = process.env.ETH_W3
const denverAddress = process.env.ETH_W4;


function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  console.log("Vote");
  //const proposals = process.argv.slice(2);
  console.log(process.argv);

  //connect to provider
  //yarn run ts-node --files ./scripts/GiveRightToVote.ts

  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ETH_GOERLI_KEY
    });
  const wallet = new ethers.Wallet(process.env.ETH_P4);
  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();
  console.log(`balance is ${signer.address} / ${balance} wei`);

  //Give Right to vote
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = await ballotContractFactory.attach(contractAddress);
  const tx = await ballotContract.connect(signer).vote(1);
  await tx.wait();
  console.log(tx.hash);
  //for denver
//   tx = await ballotContract.giveRightToVote(denverAddress)
//   await tx.wait();
//   console.log(tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});