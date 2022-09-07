import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.9",
};

if (process.env.DEPLOYER_PRIVATE_KEY) {
  config.networks = {
    /* our testnet */
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/bced4aee73954d9bb24a860ac21062b5`,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY}`],
    },
  };
}

export default config;
