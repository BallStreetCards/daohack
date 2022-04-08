import { ethers } from "hardhat";
import {
  FUNC,
  NEW_STORE_VALUE,
  PROPOSAL_DESCRIPTION,
} from "../hardhat-helper-config";

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
};

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
