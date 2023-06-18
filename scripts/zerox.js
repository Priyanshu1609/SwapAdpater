const hre = require("hardhat");

const main = async function () {
  // Get the chain id
  // const chainId = +(await hre.getChainId());
  // console.log("chainId", chainId);

  // if (!DEFAULT_ARGS[chainId]) {
  //   throw new Error(`No defaults provided for ${chainId}`);
  // }

  // Get the constructor args
  // const args = [process.env.UNIV2_ROUTER ?? DEFAULT_ARGS[chainId].UNIV2_ROUTER];
  const args = ["0xF91bB752490473B8342a3E964E855b9f9a2A668e"];

  // Get the deployer
  const [deployer] = await hre.ethers.getSigners();
  if (!deployer) {
    throw new Error(`Cannot find signer to deploy with`);
  }
  console.log("\n============================= Deploying ZeroXSwapper ===============================");
  console.log("deployer: ", deployer.address);
  console.log("constructorArgs:", args);

  const adapter = await hre.ethers.getContractFactory("ZeroXSwapper");
  const Adapter = await adapter.deploy(...args);

 
  console.log(`ZeroXSwapper deployed to ${Adapter.address}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

