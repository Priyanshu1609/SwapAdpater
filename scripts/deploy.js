// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
// const  { DEFAULT_ARGS } = require("./index");

async function main() {
  // Get the chain id
  // const chainId = +(await hre.getChainId());
  // console.log("chainId", chainId);

  // if (!DEFAULT_ARGS[chainId]) {
  //   throw new Error(`No defaults provided for ${chainId}`);
  // }

  // Get the constructor args
  // const args = [process.env.CONNEXT ?? DEFAULT_ARGS[chainId].CONNEXT];
  const args = ["0xFCa08024A6D4bCc87275b1E4A1E22B71fAD7f649"];

  // Get the deployer
  const [deployer] = await hre.ethers.getSigners();
  if (!deployer) {
    throw new Error(`Cannot find signer to deploy with`);
  }
  console.log("\n============================= Deploying SwapAndXCall ===============================");
  console.log("deployer: ", deployer.address);
  console.log("constructorArgs:", args);

  const adapter = await hre.ethers.getContractFactory("SwapAndXCall");
  const Adapter = await adapter.deploy(...args);

  // // Deploy contract
  // const adapter = await hre.deployments.deploy("SwapAndXCall", {
  //   from: deployer.address,
  //   args: args,
  //   skipIfAlreadyDeployed: true,
  //   log: true,
  //   // deterministicDeployment: true,
  // });
  console.log(`SwapAndXCall deployed to ${Adapter.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
