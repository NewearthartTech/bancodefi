import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { BytesLike } from "ethers";

import { AssetSide } from "../typechain-types/contracts/AssetSide";
import { AssetFaucet } from "../typechain-types/contracts/AssetFaucet";

let assetSide:AssetSide;
let faucet:AssetFaucet;

let contractId: BytesLike;

const preImage1 = ethers.utils.sha256(ethers.utils.toUtf8Bytes("SECRET1"));
const preImage2 = ethers.utils.sha256(ethers.utils.toUtf8Bytes("SECRET2"));

describe("HAPPY PATH", function () {
  describe("SETUP", () => {
    it("all contracts should deploy", async function () {
        const _assetFactory = await ethers.getContractFactory("AssetSide");
        assetSide = await _assetFactory.deploy();

        const _faucetFactory = await ethers.getContractFactory("AssetFaucet");
        faucet = await _faucetFactory.deploy();
    });

    it("STEP I: Alex requests a loan", async function () {
        const [deployer, alex, bob] = await ethers.getSigners();

        const tx1 = await faucet.connect(alex).giveMe();
        await tx1.wait();

        expect( await faucet.ownerOf(1)).to.be.eq(alex.address);

        const tx2 = await faucet.connect(alex).approve(assetSide.address,1);
        await tx2.wait();

      const secret1Hash = generateSecretHash(preImage1);

      const currentTimeInSec = Math.round(new Date().getTime() / 1000);
      const tomorrow = currentTimeInSec + 3600 * 24;
      const afterTomorrow = tomorrow + 3600 * 24;
      const loanEnds = currentTimeInSec + 3600 * 24 * 7; //loan good for 7 days
      const releaseEnd = loanEnds + 3600 * 24; //day after loan ends

        console.log('asset approved asking for loan');

        const tx3 = await assetSide.connect(alex).askForLoan(
            faucet.address,1,
            alex.address,secret1Hash,"",
            loanEnds);
        await tx3.wait();

      contractId = await assetSide.computeContractId(
        alex.address,
        faucet.address,
        1
      );

        const contract_assetSide = await assetSide.getContract1(contractId);
        expect(contract_assetSide.alexWallet).to.be.eq(alex.address);

        expect(await faucet.ownerOf(1)).to.be.eq(assetSide.address);

      const loanAmount = ethers.utils.parseUnits("1.0", "ether");
        const interestAmount = loanAmount.mul(20).div(100);

    });
  });

  describe("SCENARIO I: Alex & Bob walk the happy path", () => {
    loadBeforeAndAfter();
    it("STEP II: Bob accepts the loan", async () => {
      const [_deployer, _alex, bob] = await ethers.getSigners();

      const secret2Hash = generateSecretHash(preImage2);


      const tx2 = await assetSide
        .connect(bob)
        .giveLoan(contractId, secret2Hash, preImage2);
      await tx2.wait();

      const contract_assetSide = await assetSide.getContract1(contractId);
      expect(contract_assetSide.bobsWalet).to.equal(bob.address);
    });

    it("STEP III: Alex collects the loaned funds", async () => {
      const [_deployer, alex, bob] = await ethers.getSigners();


      const tx2 = await assetSide
        .connect(bob)
        .acceptLoan(contractId, preImage1);
      await tx2.wait();

      const contract_assetSide = await assetSide.getContract2(contractId);
      expect(contract_assetSide.preimage1).to.equal(preImage1);
    });

    it("STEP IV: Alex repays the loan", async () => {
      /* TODO*/
    });
  });

  /* HELPER FUNCTIONS */

  const generateSecretHash = (secret: String) => {
    const abiCoder = new ethers.utils.AbiCoder();
    const encoded = abiCoder.encode(["bytes32"], [secret]);
    return ethers.utils.keccak256(encoded);
  };

  function loadBeforeAndAfter() {
    before(async () => {
      /* DEPLOY CONTRACTS */
      const _assetfactory = await ethers.getContractFactory("AssetSide");
      assetSide = await _assetfactory.deploy();


      const _faucetfactory = await ethers.getContractFactory("AssetFaucet");
      faucet = await _faucetfactory.deploy();

      /* GIVE NFT TO ALEX */
      const [_deployer, alex, _bob] = await ethers.getSigners();

      const tx1 = await faucet.connect(alex).giveMe();
      await tx1.wait();

      expect(await faucet.ownerOf(1)).to.be.eq(alex.address);

      /* ALEX APPROVES NFT SPEND BY ASSET SIDE CONTRACT */

      const tx2 = await faucet.connect(alex).approve(assetSide.address, 1);
      await tx2.wait();

      /* ALEX REQUESTS LOAN ON ASSET SIDE */
      const secret1Hash = generateSecretHash(preImage1);

      const currentTimeInSec = Math.round(new Date().getTime() / 1000);
      const tomorrow = currentTimeInSec + 3600 * 24;
      const afterTomorrow = tomorrow + 3600 * 24;
      const loanEnds = currentTimeInSec + 3600 * 24 * 7; //loan good for 7 days
      const releaseEnd = loanEnds + 3600 * 24; //day after loan ends

      const tx3 = await assetSide
        .connect(alex)
        .askForLoan(
          faucet.address,
          1,
          alex.address,
          secret1Hash,
          preImage1,
          tomorrow
          
        );
      await tx3.wait();

      contractId = await assetSide.computeContractId(
        alex.address,
        faucet.address,
        1
      );

      /* ALEX REQUESTS LOAN ON CASH SIDE */
      const loanAmount = ethers.utils.parseUnits("1.0", "ether");
      const interestAmount = loanAmount.mul(20).div(100);

    });
    after(async () => {
      /* TEARDOWN */
      await hre.network.provider.send("hardhat_reset");
    });
  }
});