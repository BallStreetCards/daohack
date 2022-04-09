import {
  developmentChains,
  proposalsFile,
  VOTING_DELAY,
  VOTING_PERIOD,
} from "../hardhat-helper-config";
import * as fs from "fs";
import { ethers, network } from "hardhat";
import { moveBlocks } from "../utils/move-blocks";

const index = 0;
async function main(proposalIndex: number) {
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  // SWAPPALE
  const proposalId = proposals[network.config.chainId!][proposalIndex];
  // 0 = NO, 1 = YES
  const voteWay = 1;
  const reason = "I like";
  await vote(proposalId, voteWay, reason);
}

// 0 = Against, 1 = For, 2 = Abstain for this example
export const vote = async (
  proposalId: string,
  voteWay: number,
  reason: string
) => {
  console.log(`[VOTING FOR ${voteWay ? "IN FAVOUR" : "AGAINST "}]: ${reason}`);
  const governor = await ethers.getContract("GovernorContract");
  const voteTx = await governor.castVoteWithReason(proposalId, voteWay, reason);
  const voteTxReceipt = await voteTx.wait(1);
  const proposalState = await governor.state(proposalId);
  console.log(`[PROPOSAL STATE]: ${proposalState}`);
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }
};

main(index)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
