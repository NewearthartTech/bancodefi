import { ethers } from "hardhat";

//npx hardhat run scripts/deployAssetSide.ts --network rinkeby
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying Contract with the account:", deployer.address);
  console.log(
    `Account Balance: ${ethers.utils.formatEther(
      await deployer.getBalance()
    )} [eth]`
  );

  const factory = await ethers.getContractFactory("AssetSide");
  const contract = await factory.deploy();

  await contract.deployed();

  console.log(`AssetSide deployed to ${contract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
