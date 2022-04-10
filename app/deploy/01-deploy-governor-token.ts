import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { networkConfig } from "../hardhat-helper-config";

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

export default deployGovernanceToken;
deployGovernanceToken.tags = ["all", "governor"];
