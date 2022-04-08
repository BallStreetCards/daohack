import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

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
  });
  log(`[DEPLOYED GOVERNANCE TOKEN TO ADDRESS ${governanceToken.address}]`);
};
export default deployGovernanceToken;
