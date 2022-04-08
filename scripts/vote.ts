import {
  developmentChains,
  proposalsFile,
  VOTING_DELAY,
} from "../hardhat-helper-config";
import * as fs from "fs";
import { ethers, network } from "hardhat";
import { moveBlocks } from "../utils/move-blocks";

const index = 0;
export const vote = async (proposalIndex: number) => {
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  const proposalId = proposals[network.config.chainId!][proposalIndex];
  // 0 = AGAINST, 1 = FOR
  const voteWay = 1;
  const governor = await ethers.getContract("GovernorContract");
  const reason = "Some Reason ";

  // VOTE
  const voteTxResponse = await governor.castVoteWithReason(
    proposalId,
    voteWay,
    reason
  );
  await voteTxResponse.wait(1);

  // TIME TRAVEL IF DEVELOPING LOL
  developmentChains.includes(network.name) &&
    (await moveBlocks(VOTING_DELAY + 1));

  console.log("[VOTE SUBMITTED]");
  console.log(voteTxResponse);
};

vote(index)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
