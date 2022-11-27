import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

describe("Ballot", function () {
  let ballotContract: Ballot;
  let accounts: SignerWithAddress[];

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    const ballotFactory = await ethers.getContractFactory("Ballot");
    ballotContract = await ballotFactory.deploy(
      convertStringArrayToBytes32(PROPOSALS)
    );
    await ballotContract.deployed();
  });

  describe("when the contract is deployed", function () {
    it("has the provided proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
          PROPOSALS[index]
        );
      }
    });

    it("has zero votes for all proposals", async function () {
      // TODO
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(proposal.voteCount).to.eq(0);
        }
    });
    it("sets the deployer address as chairperson", async function () {
      const chairperson = await ballotContract.chairperson();
      expect(chairperson).to.eq(accounts[0].address);
    });
    it("sets the voting weight for the chairperson as 1", async function () {
      const chairVoter = await ballotContract.voters(accounts[0].address);
      expect(chairVoter.weight).to.eq(1);
    });
  });

  describe("when the chairperson interacts with the giveRightToVote function in the contract", function () {
    this.beforeEach(async() =>{
        const selectVoter = accounts[1].address;
        const acc1Voter = await ballotContract.voters(selectVoter);
        //console.log(({acc1Voter}));
        const tx = await ballotContract.giveRightToVote(selectVoter);
        await tx.wait();
    })
    it("gives right to vote for another address", async function () {
        const acc1Voter = await ballotContract.voters(accounts[1].address);
        expect(acc1Voter.weight).to.eq(1);
    });
    it("can not give right to vote for someone that has voted", async function () {
      const voteTx = await ballotContract.connect(accounts[1].address).vote(0);
      await voteTx.wait();
      await expect (
        ballotContract.giveRightToVote(accounts[1].address)
      ).to.be.revertedWith("The voter already voted.");
    });
    it("can not give right to vote for someone that has already voting rights", async function () {
      const selectVoter  = accounts[1].address;
      await expect(
        ballotContract.giveRightToVote(selectVoter)).to.be.revertedWithoutReason();
    });
  });

  describe("when the voter interact with the vote function in the contract", function () {
    // TODO
    it("should register the vote", async () => {
        const voteTx = await ballotContract.connect(accounts[1].address).vote(0);
        await voteTx.wait();
        await expect (
          ballotContract.giveRightToVote(accounts[1].address)
        ).to.be.revertedWith("The voter already voted.`");
      });
  });

  describe("when the voter interact with the delegate function in the contract", function () {
    // TODO
    it("should transfer voting power", async () => {
    
        //expect(acc2Voter.weight).to.eq(0);
        var tx = await ballotContract.giveRightToVote(accounts[1].address);
        await tx.wait();
        tx = await ballotContract.giveRightToVote(accounts[2].address);
        await tx.wait();
        var acc2Voter = await ballotContract.voters(accounts[2].address);
        expect(acc2Voter.weight).to.eq(1);
        acc2Voter = await ballotContract.voters(accounts[1].address);
        expect(acc2Voter.weight).to.eq(1);
        const voteTx = await ballotContract.delegate(accounts[2].address);
        await voteTx.wait();
        acc2Voter = await ballotContract.voters(accounts[2].address);
        expect(acc2Voter.weight).to.eq(2);
    });
  });

  describe("when the an attacker interact with the giveRightToVote function in the contract", function () {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when the an attacker interact with the vote function in the contract", function () {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when the an attacker interact with the delegate function in the contract", function () {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interact with the winningProposal function before any votes are cast", function () {
    // TODO
    it("should return 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interact with the winningProposal function after one vote is cast for the first proposal", function () {
    // TODO
    it("should return 0", async () => {
        tx = await ballotContract.vote(0);
        await voteTx.wait();

    });
  });

  describe("when someone interact with the winnerName function before any votes are cast", function () {
    // TODO
    it("should return name of proposal 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interact with the winnerName function after one vote is cast for the first proposal", function () {
    // TODO
    it("should return name of proposal 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interact with the winningProposal function and winnerName after 5 random votes are cast for the proposals", function () {
    // TODO
    it("should return the name of the winner proposal", async () => {
      throw Error("Not implemented");
    });
  });
});