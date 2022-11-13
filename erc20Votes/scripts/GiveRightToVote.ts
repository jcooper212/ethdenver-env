import { ethers } from "hardhat";
import { VoteToken__factory } from "../typechain-types";
import { TokenizedBallot__factory } from "../typechain-types/factories/contracts/TokenizedBallot.sol";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
const MINT_VALUE = ethers.utils.parseEther("10");

//yarn run ts-node --files ./scripts/Deployment.ts "Proposal 1" "Proposal 2" "Proposal 3"

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  console.log("Tokenized Ballot - Give Right to Vote");
  

  //Deploy Contract
  const accounts = await ethers.getSigners();
  const VOTING_ACCOUNT = accounts[1].address;
  const contractFactory = new VoteToken__factory(accounts[0]);
  const contract = await contractFactory.deploy();
  await contract.deployed();
  console.log(`VoteToken deployed at ${contract.address}`)

  

    //Mint tokens
    const mintTx = await contract.mint(VOTING_ACCOUNT, MINT_VALUE);
    await mintTx.wait();
    console.log(`Minted ${MINT_VALUE.toString()} units to account ${VOTING_ACCOUNT}`);
    const bal = await contract.balanceOf(VOTING_ACCOUNT);
    var votes = await contract.getVotes(VOTING_ACCOUNT);
    console.log(`The balance is ${(await bal).toString()} for account ${VOTING_ACCOUNT}
      with voting power ${votes.toString()}`);

    //Self Delegate
    var delegateTx = await contract.connect(accounts[1]).delegate(VOTING_ACCOUNT);
    await delegateTx.wait();
    votes = contract.getVotes(VOTING_ACCOUNT);
    console.log(`After delegate got ${(await votes).toString()} voting power for account ${VOTING_ACCOUNT}`)

  

  //  const tokenizedBallotFactory = new TokenizedBallot__factory(accounts[0]);
  //  const tokenizedBallotContract = await tokenizedBallotFactory.deploy(
  //     convertStringArrayToBytes32(PROPOSALS), voteTokenContract.address, lastBlock.number
  //  );
  //   await tokenizedBallotContract.deployed();
  //   console.log(`The Tokenized Ballot smart contract was deployed at: 
  //       ${tokenizedBallotContract.address} with targetBlock ${lastBlock.number -1}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});