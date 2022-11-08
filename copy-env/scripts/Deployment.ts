import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";

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
  console.log("Deploying Ballot contract");
  console.log("proposals: ");
  //const proposals = process.argv.slice(2);
  console.log(process.argv);
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index +1}: ${element}`);
  });

  //connect to provider
  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: "g1CS1wIDRIhZb0_9mofYmODfLJmh8vlH",
});
  const wallet = new ethers.Wallet("8ebbb65b71ed921e654a26f34a7be951907239cdfea4ae6989bbe645de2399fa");
  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();;
  console.log(`balance is ${signer.address} / ${balance} wei`);
  //contractAddress = process.argv[2];
  //targetAddress = process.argv[3];
  //const ballotContract = await ballotContractFactory.attach(contractAddress);
  //const tx = await ballotContract.giveRightToVote(targetAddress)
  //await tx.wait();
  //console.log(tx.hash)
  
  //const ballotFactory = await ethers.getContractFactory("Ballot");
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = await ballotContractFactory.deploy(
     convertStringArrayToBytes32(PROPOSALS)
   );
   await ballotContract.deployed();
   console.log(`The ballot smart contract was deployed at ${ballotContract.address}`)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});