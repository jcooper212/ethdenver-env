import { ethers } from "hardhat";
import { VoteToken__factory } from "../typechain-types";
import { TokenizedBallot__factory } from "../typechain-types/factories/contracts/TokenizedBallot.sol";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
const MINT_VALUE = ethers.utils.parseEther("10");
const TOKENIZED_BALLOT_CONTRACT = '0x1a992c6688a8F57b9DDBaa59A830052ECf9ce3E7';
const VOTE_TOKEN_CONTRACT = '0x9E05990FBc73717C7F195fAD0177AD3B3b6A541a';

//yarn run ts-node --files ./scripts/Deployment.ts "Proposal 1" "Proposal 2" "Proposal 3"

async function main() {
  console.log("Tokenized Ballot - Give Right to Vote");
  
  //connect to provider
  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: "g1CS1wIDRIhZb0_9mofYmODfLJmh8vlH",
  });
  const wallet = new ethers.Wallet(process.env.ETH_P3);
  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();
  console.log(`W3 balance is ${signer.address} / ${balance} wei`);

  //Attach Contracts
  const accounts = await ethers.getSigners();
  const VOTING_ACCOUNT = signer.address;
  const DELEGATE_TO_ACCOUNT = '0x43610EC8743998A8D95831447BC2E59382c60775';
  const contractFactory = new VoteToken__factory(signer);
  const contract = await contractFactory.attach(VOTE_TOKEN_CONTRACT);
  const ballotFactory = new TokenizedBallot__factory(signer);
  const ballotContract = await ballotFactory.attach(TOKENIZED_BALLOT_CONTRACT);


    //Winning Proposal
    const winningProposal = await ballotContract.winningProposal();
    const winnerName = await ballotContract.winnerName();
    console.log(`Winning proposal is ${(await winningProposal).toNumber()} and name ${(await winnerName).toString()}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});