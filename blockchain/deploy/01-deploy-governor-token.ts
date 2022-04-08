import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { networkConfig } from "../hardhat-helper-config";

const deployGovernanceToken: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("[DEPLOYING GOVERNANCE TOKEN]");
  const governanceToken = await deploy("GovernanceToken", {
    from: deployer,
    args: [],
    log: true,
    // WAIT CONFIRMATION
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  });
  log(`[DEPLOYED GOVERNANCE TOKEN TO ADDRESS ${governanceToken.address}]`);

  await delegate(governanceToken.address, deployer);
  log(`[DELEGATED]`);
};

// ALLOW SOMEONE ELSE TO VOTE
const delegate = async (
  governanceTokenAddress: string,
  delegatedAccount: string
) => {
  const governanceToken = await ethers.getContractAt(
    "GovernanceToken",
    governanceTokenAddress
  );
  const tx = await governanceToken.delegate(delegatedAccount);
  await tx.wait(1);
  console.log(
    `Checkpoints ${await governanceToken.numCheckpoints(delegatedAccount)}`
  );
};

export default deployGovernanceToken;
deployGovernanceToken.tags = ["all", "governor"];
