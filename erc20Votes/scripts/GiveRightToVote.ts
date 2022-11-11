import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
const contractAddress = "0xe36555Edfc41c8d8b12DE16043E9C17834C83F3b";
const targetAddress = "0xda20b99355aDb20129149D29eb7Ae9d70469E251";
const denverAddress = "0x43610EC8743998A8D95831447BC2E59382c60775";


function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  console.log("GiveRightTo Vote");
  //const proposals = process.argv.slice(2);
  console.log(process.argv);

  //connect to provider
  //yarn run ts-node --files ./scripts/GiveRightToVote.ts

  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: "g1CS1wIDRIhZb0_9mofYmODfLJmh8vlH"
    });
  const wallet = new ethers.Wallet(process.env.ETH_PA0);
  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();
  console.log(`balance is ${signer.address} / ${balance} wei`);

  //Give Right to vote
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = await ballotContractFactory.attach(contractAddress);
  const tx = await ballotContract.giveRightToVote(denverAddress);
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