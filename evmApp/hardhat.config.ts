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
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY}`],
    },

  };
}


export default config;
