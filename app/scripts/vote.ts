import { proposalsFile } from "../hardhat-helper-config";
import * as fs from "fs";
import { network } from "hardhat";
import { vote } from "./utils";

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

main(index)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
