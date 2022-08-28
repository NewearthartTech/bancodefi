import { ethers } from "hardhat";

//npx hardhat run scripts/deployAssetFacuet.ts --network rinkeby
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying Contract with the account:", deployer.address);
  console.log(
    `Account Balance: ${ethers.utils.formatEther(
      await deployer.getBalance()
    )} [eth]`
  );

  const factory = await ethers.getContractFactory("AssetFaucet");
  const assetFaucet = await factory.deploy();

  console.log(`AssetFaucet deployed to ${assetFaucet.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
