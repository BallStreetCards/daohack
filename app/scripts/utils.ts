import { ethers, network } from "hardhat";
import {
  developmentChains,
  FUNC,
  MIN_DELAY,
  networkConfig,
  NEW_STORE_VALUE,
  proposalsFile,
  PROPOSAL_DESCRIPTION,
  VOTING_DELAY,
  VOTING_PERIOD,
} from "../hardhat-helper-config";
import { moveBlocks } from "../utils/move-blocks";
import * as fs from "fs";
import { moveTime } from "../utils/move-time";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployGovernanceToken: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer, member1 } = await getNamedAccounts();
  log("[DEPLOYING GOVERNANCE TOKEN]");
  const governanceToken = await deploy("GovernanceToken", {
    from: deployer,
    args: [],
    log: true,
    // WAIT CONFIRMATION
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  });
  log(`[DEPLOYED GOVERNANCE TOKEN TO ADDRESS ${governanceToken.address}]`);

  await transfer(
    /*governanceToken.address,*/
    member1,
    "600000000000000000000000"
  );
  await delegate(deployer);
  log(`[DELEGATED]`);
};

// ALLOW SOMEONE ELSE TO VOTE
const delegate = async (
  // governanceTokenAddress: string,
  delegatedAccount: string
) => {
  const governanceToken = await ethers.getContract(
    "GovernanceToken"
    // governanceTokenAddress
  );
  const tx = await governanceToken.delegate(delegatedAccount);
  await tx.wait(1);
  console.log(
    `Checkpoints ${await governanceToken.numCheckpoints(delegatedAccount)}`
  );
};

// ALLOW SOMEONE ELSE TO VOTE
const transfer = async (
  // governanceTokenAddress: string,
  delegatedAccount: string,
  amount: string
) => {
  const governanceToken = await ethers.getContract(
    "GovernanceToken"
    // governanceTokenAddress
  );
  const tx = await governanceToken.transfer(delegatedAccount, amount);
  await tx.wait(1);
};

export const propose = async (
  args: any[],
  functionToCall: string,
  proposalDescription: string,
  signer?: string
): Promise<string> => {
  const governor = await ethers.getContract("GovernorContract", signer);
  const boxContract = await ethers.getContract("Box");
  const encodedFunctionCall = boxContract.interface.encodeFunctionData(
    functionToCall,
    args
  );
  console.log(
    `[PROPOSING ${functionToCall} on ${boxContract.address} with args [${args}] ]`
  );
  console.log(`[PROPOSAL DESCRIPTION: ${proposalDescription}]`);
  const proposeTx = await governor.propose(
    [boxContract.address],
    [0],
    [encodedFunctionCall],
    proposalDescription
  );

  // TIME TRAVEL TO VOTING PERIOD IF DEVELOPING
  developmentChains.includes(network.name) &&
    (await moveBlocks(VOTING_DELAY + 1));

  const proposeReceipt = await proposeTx.wait(1);
  const proposalId = proposeReceipt.events[0].args.proposalId;
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  proposals[network.config.chainId!.toString()] =
    proposals[network.config.chainId!.toString()] || [];
  proposals[network.config.chainId!.toString()].push(proposalId.toString());
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals));

  // INFO
  const proposalState = await governor.state(proposalId);
  const proposalSnapShot = await governor.proposalSnapshot(proposalId);
  const proposalDeadline = await governor.proposalDeadline(proposalId);
  console.log(`Current Proposal State: ${proposalState}`); // 1 = NOT PASSED, 0 = PASSED
  console.log(`Current Proposal Snapshot: ${proposalSnapShot}`); // WHAT BLOCK THE PROPOSAL WAS SNAPSHOT
  console.log(`Current Proposal Deadline: ${proposalDeadline}`); // BLOCK NUMBER VOTING EXPIRES

  return proposalId.toString();
};

export const queueAndExecute = async (
  args: any[] = [NEW_STORE_VALUE],
  functionToCall: string = FUNC,
  proposalId = PROPOSAL_DESCRIPTION
) => {
  const boxContract = await ethers.getContract("Box");
  const encodedFunctionCall = boxContract.interface.encodeFunctionData(
    functionToCall,
    args
  );
  const descriptionHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(proposalId)
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
  if (developmentChains.includes(network.name)) {
    await moveTime(MIN_DELAY + 1);
    await moveBlocks(1);
  }

  // WILL FAIL ON TESTNET
  const executeTx = await governor.execute(
    [boxContract.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  await executeTx.wait(1);
  const boxNewValue = await boxContract.retrieve();
  console.log(`[BOX VALUE]: ${boxNewValue.toString()}`);

  return boxNewValue;
};

// 0 = Against, 1 = For, 2 = Abstain for this example
export const vote = async (
  proposalId: string,
  voteWay: number,
  reason: string,
  signer?: string
) => {
  console.log(`[VOTING ${voteWay ? "IN FAVOUR" : "AGAINST "}]: ${reason}`);
  const governor = await ethers.getContract("GovernorContract", signer);
  const voteTx = await governor.castVoteWithReason(proposalId, voteWay, reason);
  const voteTxReceipt = await voteTx.wait(1);
  const proposalState = await governor.state(proposalId);
  console.log(`[PROPOSAL STATE]: ${proposalState}`);
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }
};
