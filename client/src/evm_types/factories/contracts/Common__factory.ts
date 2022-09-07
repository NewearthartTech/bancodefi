/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { Common, CommonInterface } from "../../contracts/Common";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_alexWallet",
        type: "address",
      },
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "computeContractId",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_contractId",
        type: "bytes32",
      },
    ],
    name: "getContract1",
    outputs: [
      {
        internalType: "string",
        name: "secret1encrypted",
        type: "string",
      },
      {
        internalType: "string",
        name: "secret2encrypted",
        type: "string",
      },
      {
        internalType: "address",
        name: "assetContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "loanAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "loanInterest",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lenderDeposit",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "bobsWalet",
        type: "address",
      },
      {
        internalType: "address",
        name: "alexWallet",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "status",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_contractId",
        type: "bytes32",
      },
    ],
    name: "getContract2",
    outputs: [
      {
        internalType: "bytes32",
        name: "secret1Hash",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "secret2Hash",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "preimage1",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "preimage2",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "reqTill",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "acceptTill",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lockedTill",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "releaseTill",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class Common__factory {
  static readonly abi = _abi;
  static createInterface(): CommonInterface {
    return new utils.Interface(_abi) as CommonInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Common {
    return new Contract(address, _abi, signerOrProvider) as Common;
  }
}
