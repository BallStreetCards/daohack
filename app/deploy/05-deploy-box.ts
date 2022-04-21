import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployMainDAO: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  log("[DEPLOYING MAIN DAO]");
  const daoDeployment = await deploy("MainDAO", {
    from: deployer,
    args: [],
    log: true,
  });
  const timeLock = await ethers.getContract("TimeLock");
  const daoContract = await ethers.getContract("MainDAO");

  const transferOwnerTx = await daoContract.transferOwnership(timeLock.address);
  await transferOwnerTx.wait(1);
  log("[TRANSFERRED MAINDAO TO TIMELOCK]");
};
export default deployMainDAO;
