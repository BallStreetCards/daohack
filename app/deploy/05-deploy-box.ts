import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployBox: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  log("[DEPLOYING BOX]");
  const boxDeployment = await deploy("Box", {
    from: deployer,
    args: [],
    log: true,
  });
  const timeLock = await ethers.getContract("TimeLock");
  const boxContract = await ethers.getContract("Box");

  const transferOwnerTx = await boxContract.transferOwnership(timeLock.address);
  await transferOwnerTx.wait(1);
  log("[TRANSFERRED BOX TO TIMELOCK]");
};
export default deployBox;
