import { ethers } from "hardhat";
import { VoteToken__factory } from "../typechain-types";
import { TokenizedBallot__factory } from "../typechain-types/factories/contracts/TokenizedBallot.sol";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
//yarn run ts-node --files ./scripts/Deployment.ts "Proposal 1" "Proposal 2" "Proposal 3"

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  console.log("Deploying TokenVote ERC20 contract");
  
  //Print proposals
  console.log("proposals are: ");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index +1}: ${element}`);
  });

  //connect to provider
  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: "g1CS1wIDRIhZb0_9mofYmODfLJmh8vlH",
  });
  const wallet = new ethers.Wallet(process.env.ETH_P3);
  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();
  console.log(`W3 balance is ${signer.address} / ${balance} wei`);

  //local provider
  const accounts = await ethers.getSigners();

  
  //Deploy Contracts
  const voteTokenContractFactory = new VoteToken__factory(signer);
  const voteTokenContract = await voteTokenContractFactory.deploy();
  await voteTokenContract.deployed();
   console.log(`The VoteToken ERC20 smart contract was deployed at ${voteTokenContract.address}`)
 
  //Get lastBlock
  let blockNum;
  await provider.getBlockNumber().then(function(blockNumber) {
      blockNum = blockNumber;
      console.log("Current block number: " + blockNumber);
  });



  //  const tokenizedBallotFactory = new TokenizedBallot__factory(signer);
  //  const tokenizedBallotContract = await tokenizedBallotFactory.deploy(
  //     convertStringArrayToBytes32(PROPOSALS), voteTokenContract.address, blockNum
  //  );
  //   await tokenizedBallotContract.deployed();
  //   console.log(`The Tokenized Ballot smart contract was deployed at: 
  //       ${tokenizedBallotContract.address} with targetBlock ${blockNum}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});