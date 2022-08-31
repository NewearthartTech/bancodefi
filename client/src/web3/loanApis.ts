import { LoansApi, ALoan } from '../generated_server'
import { useConnect as useTzConnect } from './tzUtils'
import { useConnectCalls as useEvmConnect } from './evmUtils'
import { AssetFaucet__factory, AssetSide__factory } from '../evm_types'
import { useMemo } from 'react'
import constate from 'constate'
import { ethers } from 'ethers'
import { v4 as uuidv4 } from 'uuid'
import { char2Bytes } from '@taquito/utils'
import { SHA3, Keccak } from 'sha3'

//NOT sure whey there need to be require and cannot be imported
const ethUtil = require('ethereumjs-util')
const sigUtil = require('eth-sig-util')

function addDays(days: number) {
  var date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

export const [LoanApiProvider, useLoanCalls] = constate(
  useLoanLogic,
  (v) => v.loanLogic,
)

function useLoanLogic() {
  const tzConnect = useTzConnect()
  const { connect: evmConnect, readOnlyWeb3: evmRO } = useEvmConnect()

  function tzSecrethash(secret: string) {
    const hash = new SHA3(256)

    hash.update(secret)

    const j = hash.digest({ buffer: Buffer.alloc(32), format: 'hex' })

    return j
  }

  function evmPackedSecret(secret: string) {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(secret)) || ''
  }

  async function evmSecrethash(packedSecret: string) {
    const encoder = new ethers.utils.AbiCoder()
    const encoded = encoder.encode(['bytes32'], [packedSecret])
    return ethers.utils.keccak256(encoded)
  }

  async function encrypter(webAccount: string, data: string) {
    try {
      const { web3 } = await evmConnect()

      const encryptionPublicKey = await web3.provider.request({
        method: 'eth_getEncryptionPublicKey',
        params: [webAccount],
      })

      const k = sigUtil.encrypt(
        encryptionPublicKey,
        { data },
        'x25519-xsalsa20-poly1305',
      )

      const encryptedMessage: string = ethUtil.bufferToHex(
        Buffer.from(JSON.stringify(k), 'utf8'),
      )

      return encryptedMessage
    } catch (err: any) {
      throw new Error(
        `You provide doesn't support encryption. please try metamask: ${err}`,
      )
    }
  }

  async function contracts(mode: 'readonly' | 'writeEnabled') {
    const { tezos, accountPkh: requesterTzAddress } = await tzConnect()

    console.log(`using account ${requesterTzAddress}`)

    //const web3 = mode === 'readonly' ? await evmRO() : (await evmConnect()).web3

    //  const web3 = (await evmConnect()).web3

    /*
    const assetSide = AssetSide__factory.connect(
      process.env.NEXT_PUBLIC_EvmApp_address,
      web3.getSigner(),
    )
*/
    const cashSide = await tezos.wallet.at(
      process.env.NEXT_PUBLIC_TzApp_address,
    )

    return {
      //assetSide,
      cashSide,
    }
  }

  ///Throws exception if NFT is invalid
  async function ensureNftIsValid({
    erCaddress,
    tokenId,
  }: {
    erCaddress: string
    tokenId: string
  }) {
    if (!erCaddress || !tokenId)
      throw new Error('token address and Id are required')

    const web3ro = await evmRO()

    const ctx = AssetFaucet__factory.connect(erCaddress, web3ro)

    const tokenOwner = await ctx.ownerOf(tokenId)

    const { account: requesterEvmAddress } = await evmConnect()

    if (tokenOwner.toLowerCase() != requesterEvmAddress.toLowerCase())
      throw new Error("You don't own this ")
  }

  async function applyForLoan(loan: ALoan) {
    const api = new LoansApi(undefined, process.env.NEXT_PUBLIC_SERVER_URL)

    const { accountPkh: requesterTzAddress } = await tzConnect()
    const { account: requesterEvmAddress } = await evmConnect()

    console.log(
      `tz account ${requesterTzAddress}, evmAddress ${requesterEvmAddress}`,
    )

    const { /*assetSide,*/ cashSide } = await contracts('writeEnabled')

    const loanAmountWei = ethers.utils.parseEther(loan.loanAmount.toString())

    const { web3, account } = await evmConnect()

    const assetSide = AssetSide__factory.connect(
      process.env.NEXT_PUBLIC_EvmApp_address,
      web3.getSigner(account),
    )

    const loanId = await assetSide.computeContractId(
      requesterEvmAddress,
      loan.erCaddress,
      loan.tokenAddress,
    )

    const currentTimeInSec = Math.round(new Date().getTime() / 1000)

    let loanDays = loan.loanDuration
    //dee: todo: lets use Moments or something to be exact about the duration is Days
    switch (loan.loanDurationWindow) {
      case 'months':
        loanDays = loan.loanDuration * 30
        break
      case 'years':
        loanDays = loan.loanDuration * 365
        break
    }

    const loanEnds = currentTimeInSec + 3600 * 24 * loanDays

    const secret1 = evmPackedSecret(uuidv4())

    const exists = await assetSide.getContract1(loanId)

    const returnLogs: string[] = []

    if (!exists.tokenId.isZero()) {
      console.log('loan has been requested')
      returnLogs.push(`loan has already been requested on the asset side`)
    } else {
      const ecrypted = await encrypter(requesterEvmAddress, secret1)
      const tx = await assetSide.askForLoan(
        loan.erCaddress,
        loan.tokenAddress,
        requesterEvmAddress,
        evmSecrethash(secret1),
        ecrypted,
        loanEnds,
      )

      returnLogs.push(`loan requested on the asset side : ${tx.hash}`)
    }

    const byContractId = char2Bytes(loanId)
    const hash1 = tzSecrethash(secret1)

    const opn = await cashSide.methods
      .askForLoan(
        byContractId,
        hash1,
        loan.loanAmount * 1000, //in mutez
        loan.interestAmount * 1000, //in mutez
        addDays(loanEnds),
      )
      .send()

    const results = await opn.confirmation()

    returnLogs.push(`loan requested on the cash side : ${opn.opHash}`)

    await api.apiLoansUpdatePost({
      ...loan,
      id: loanId,
      requesterTzAddress,
      requesterEvmAddress,
    })

    return returnLogs
  }

  const loanLogic = useMemo(
    () => ({
      applyForLoan,
      ensureNftIsValid,
    }),
    [],
  )

  return { loanLogic }
}
