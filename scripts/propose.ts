import { ethers, network } from "hardhat";
import {
  developmentChains,
  FUNC,
  NEW_STORE_VALUE,
  proposalsFile,
  PROPOSAL_DESCRIPTION,
  VOTING_DELAY,
} from "../hardhat-helper-config";
import { moveBlocks } from "../utils/move-blocks";
import * as fs from "fs";

export const propose = async (
  args: any[],
  functionToCall: string,
  proposalDescription: string
) => {
  const governor = await ethers.getContract("GovernorContract");
  const boxContract = await ethers.getContract("Box");
  const encodedFunctionCall = boxContract.interface.encodeFunctionData(
    functionToCall,
    args
  );
  console.log(
    `[PROPOSING ${functionToCall} on ${boxContract.address} with ${args}]`
  );
  console.log(`[PROPOSAL DESCRIPTION: ${proposalDescription}]`);
  const proposeTx = await governor.propose(
    [boxContract.address],
    [0],
    [encodedFunctionCall],
    proposalDescription
  );
  const proposeReceipt = await proposeTx.wait(1);

  // TIME TRAVEL IF DEVELOPING LOL
  developmentChains.includes(network.name) &&
    (await moveBlocks(VOTING_DELAY + 1));

  const proposalId = proposeReceipt.events[0].args.proposalId;
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  proposals[network.config.chainId!.toString()].push(proposalId.toString());
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals));
};

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
