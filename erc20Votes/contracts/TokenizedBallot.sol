// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
/// @title Voting with delegation.

interface IVoteToken {
    function getPastVotes(address, uint256) external returns (uint256);
}

contract TokenizedBallot {

    // This is a type for a single proposal.
    struct Proposal {
        bytes32 name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }
    // A dynamically-sized array of `Proposal` structs.
    Proposal[] public proposals;

    //VoteToken contract
    IVoteToken public voteToken;

    //Target block umber
    uint256 public targetBlockNum;

    mapping(address => uint256) public votePowerSpent;

    /// Create a new ballot to choose one of `proposalNames`.
    constructor(bytes32[] memory proposalNames, address _tokenContract, uint256 _targetBlockNum) {
     
        voteToken = IVoteToken(_tokenContract);
        targetBlockNum = _targetBlockNum;
        // For each of the provided proposal names,
        // create a new proposal object and add it
        // to the end of the array.
        for (uint i = 0; i < proposalNames.length; i++) {
            // `Proposal({...})` creates a temporary
            // Proposal object and `proposals.push(...)`
            // appends it to the end of `proposals`.
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }


    /// Give your vote (including votes delegated to you)
    /// to proposal `proposals[proposal].name`.
    function vote(uint256 proposal, uint256 amount) external {
        uint256 vPower = votingPower(msg.sender);
        require(vPower >= amount, "trying to vote with more than allowed");
        votePowerSpent[msg.sender] += amount;
        proposals[proposal].voteCount += amount;
    }

    function votingPower(address account) public  returns(uint256) {
        return voteToken.getPastVotes(account, targetBlockNum) - votePowerSpent[account];
    }

    /// @dev Computes the winning proposal taking all
    /// previous votes into account.
    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    // Calls winningProposal() function to get the index
    // of the winner contained in the proposals array and then
    // returns the name of the winner
    function winnerName() external view
            returns (bytes32 winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }
}