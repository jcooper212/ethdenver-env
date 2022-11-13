import { ethers } from "hardhat";
import { VoteToken__factory } from "../typechain-types";
import { TokenizedBallot__factory } from "../typechain-types/factories/contracts/TokenizedBallot.sol";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
const MINT_VALUE = ethers.utils.parseEther("10");
const TOKENIZED_BALLOT_CONTRACT = '0x1a992c6688a8F57b9DDBaa59A830052ECf9ce3E7';
const VOTE_TOKEN_CONTRACT = '0x9E05990FBc73717C7F195fAD0177AD3B3b6A541a';

//yarn run ts-node --files ./scripts/Deployment.ts "Proposal 1" "Proposal 2" "Proposal 3"

async function main() {
  console.log("Tokenized Ballot - Vote");
  
  //connect to provider
  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: "g1CS1wIDRIhZb0_9mofYmODfLJmh8vlH",
  });
  const wallet = new ethers.Wallet(process.env.ETH_P4); //Delegate account votes
  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();
  console.log(`W4 balance is ${signer.address} / ${balance} wei`);

  //Attach Contracts
  const accounts = await ethers.getSigners();
  const VOTING_ACCOUNT = signer.address;
  const DELEGATE_TO_ACCOUNT = '0x43610EC8743998A8D95831447BC2E59382c60775';
  const contractFactory = new VoteToken__factory(signer);
  const contract = await contractFactory.attach(VOTE_TOKEN_CONTRACT);
  const ballotFactory = new TokenizedBallot__factory(signer);
  const ballotContract = await ballotFactory.attach(TOKENIZED_BALLOT_CONTRACT);


    //CheckPast Voting power
    // const lastBlock = await ethers.provider.getBlock("latest");
    // console.log(`Current block is ${lastBlock.number}`);
    let blockNum;
    await provider.getBlockNumber().then(function(blockNumber) {
        blockNum = blockNumber;
        console.log("Current block number: " + blockNumber);
    });
    const pastVotes = await contract.getPastVotes(DELEGATE_TO_ACCOUNT,
      blockNum-1);
      console.log(`Account1 Past Votes  were ${(await pastVotes).toString()} voting power for account ${DELEGATE_TO_ACCOUNT}`);
  
    //Vote
    var votes = await contract.getVotes(DELEGATE_TO_ACCOUNT);
    console.log(`Before Voting -- ${(await votes).toString()} voting power for account ${DELEGATE_TO_ACCOUNT}`);

    const voteTx = await ballotContract.connect(signer).vote(1, MINT_VALUE.div(10));
    (await voteTx).wait();

    var votes = await contract.getVotes(DELEGATE_TO_ACCOUNT);
    console.log(`After Voting -- ${(await votes).toString()} voting power for account ${DELEGATE_TO_ACCOUNT}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});