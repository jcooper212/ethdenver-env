import { ethers } from "hardhat";
import { VoteToken__factory } from "../typechain-types";

const MINT_VALUE = ethers.utils.parseEther("10");

async function main() {
  console.log("VoteToken");

  //Deploy Contract
  const accounts = await ethers.getSigners();
  const contractFactory = new VoteToken__factory(accounts[0]);
  const contract = await contractFactory.deploy();
  await contract.deployed();
  console.log(`VoteToken deployed at ${contract.address}`)

  //Mint tokens
  const mintTx = await contract.mint(accounts[1].address, MINT_VALUE);
  await mintTx.wait();
  console.log(`Minted ${MINT_VALUE.toString()} units to account ${accounts[1].address}`);
  const bal = contract.balanceOf(accounts[1].address);
  console.log(`The balance is ${(await bal).toString()} for account ${accounts[1].address}`);


  //Check voting power
  var votes = contract.getVotes(accounts[1].address);
  console.log(`Got ${(await votes).toString()} voting power for account ${accounts[1].address}`)

  //Self Delegate
  var delegateTx = await contract.connect(accounts[1]).delegate(accounts[1].address);
  await delegateTx.wait();
  votes = contract.getVotes(accounts[1].address);
  console.log(`After delegate got ${(await votes).toString()} voting power for account ${accounts[1].address}`)

  //Transfer tokens
  const transferTx = await contract.connect(accounts[1]).transfer(accounts[2].address, MINT_VALUE.div(2));
  (await transferTx).wait();
  votes = contract.getVotes(accounts[1].address);
  console.log(`After transfer Account1 got ${(await votes).toString()} voting power for account ${accounts[1].address}`)
  delegateTx = await contract.connect(accounts[2]).delegate(accounts[2].address);
  await delegateTx.wait();
  votes = contract.getVotes(accounts[2].address);
  console.log(`After transfer Account2 got ${(await votes).toString()} voting power for account ${accounts[1].address}`)

  //CheckPast Voting power
  const lastBlock = await ethers.provider.getBlock("latest");
  console.log(`Current block is ${lastBlock.number}`);
  const pastVotes = await contract.getPastVotes(accounts[1].address,
    lastBlock.number - 1);
    console.log(`Account1 Past Votes  were ${(await pastVotes).toString()} voting power for account ${accounts[1].address}`)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//Homework 3
//Deployment.ts
//GiveRightToVote.ts -- give voting tokens
//Delegate.ts -- delegating voting power
//Vote.ts -- casting votes
//VotingPower.ts -- checking vote power
//ReviewResults.ts -- querying results