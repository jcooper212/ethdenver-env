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

  //Deploy Contract
  const accounts = await ethers.getSigners();
  const VOTING_ACCOUNT = signer.address;
  const DELEGATED_ACCOUNT = process.env.ETH_W4;
  const contractFactory = new VoteToken__factory(signer);
  const contract = await contractFactory.attach(VOTE_TOKEN_CONTRACT);

    //Mint tokens
    const mintTx = await contract.mint(VOTING_ACCOUNT, MINT_VALUE);
    await mintTx.wait();
    console.log(`Minted ${MINT_VALUE.toString()} units to account ${VOTING_ACCOUNT}`);
    const bal = await contract.balanceOf(VOTING_ACCOUNT);
    var votes = await contract.getVotes(VOTING_ACCOUNT);
    console.log(`The balance is ${(await bal).toString()} for account ${VOTING_ACCOUNT}
      with voting power ${votes.toString()}`);

    //Self Delegate
    var delegateTx = await contract.connect(signer).delegate(VOTING_ACCOUNT);
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