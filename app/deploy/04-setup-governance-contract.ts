import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { exec } from "child_process";
import { ADDRESS_ZERO } from "../hardhat-helper-config";

const setupContracts: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const timeLock = await ethers.getContract("TimeLock", deployer);
  const governor = await ethers.getContract("GovernorContract", deployer);

  log("[SETTING UP ROLES]");
  // ONLY GOVERNOR CAN SEND TO TIMELOCKS

  const proposerRole = await timeLock.PROPOSER_ROLE();
  const executorRole = await timeLock.EXECUTOR_ROLE();
  const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

  // GOVERNOR IS THE ONLY ONE THAT CAN PROPOSE
  const proposerTx = await timeLock.grantRole(proposerRole, governor.address);
  await proposerTx.wait(1);
  // ANYBODY CAN EXECUTE ONCE PROPOSAL GOES THROUGH
  const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO);
  await executorTx.wait(1);
  // REVOKE ROLE FROM DEPLOYER. NO ONE BUT GOVERNOR CAN MESS WITH TIMELOCK AFTER THIS IS CALLED.
  const revokeTx = await timeLock.revokeRole(adminRole, deployer);
  await revokeTx.wait(1);
};

export default setupContracts;
