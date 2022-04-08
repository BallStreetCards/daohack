import { ethers, network } from "hardhat";
import {
  developmentChains,
  FUNC,
  MIN_DELAY,
  NEW_STORE_VALUE,
  PROPOSAL_DESCRIPTION,
  VOTING_DELAY,
} from "../hardhat-helper-config";
import { moveBlocks } from "../utils/move-blocks";
import { moveTime } from "../utils/move-time";

export const queueAndExecute = async () => {
  const args = [NEW_STORE_VALUE];
  const boxContract = await ethers.getContract("Box");
  const encodedFunctionCall = boxContract.interface.encodeFunctionData(
    FUNC,
    args
  );
  const descriptionHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION)
  );

  const governor = await ethers.getContract("GovernorContract");
  console.log("[QUEUEING]");

  const queueTx = await governor.queue(
    [boxContract.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );

  await queueTx.wait(1);
  // TIME TRAVEL IF DEVELOPING LOL
  developmentChains.includes(network.name) &&
    (await moveTime(MIN_DELAY + 1)) &&
    (await moveBlocks(VOTING_DELAY + 1));

  const executeTx = governor.execute(
    [boxContract.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  await executeTx.wait(1);
  const boxNewValue = await boxContract.retrieve();
  console.log(`[BOX VALUE]: ${boxNewValue.toString()}`);
};

queueAndExecute()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
