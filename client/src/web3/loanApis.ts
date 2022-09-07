import { LoansApi, ALoan, LoanStatus } from '../generated_server'
import { useConnect as useTzConnect } from './tzUtils'
import { useConnectCalls as useEvmConnect } from './evmUtils'
import { AssetFaucet__factory, AssetSide__factory } from '../evm_types'
import { useMemo } from 'react'
import constate from 'constate'
import { ethers } from 'ethers'
import { v4 as uuidv4 } from 'uuid'
import { char2Bytes } from '@taquito/utils'
import { SHA3, Keccak } from 'sha3'
import { getStatusNumberByEnum } from 'src/utils/asyncUtils'

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

  const decrypter = async (webAccount: string, encryptedMessage: string) => {
    try {
      const { web3 } = await evmConnect()

      const decrypted: string = await web3.provider.request({
        method: 'eth_decrypt',
        params: [encryptedMessage, webAccount],
      })

      return decrypted
    } catch (err: any) {
      throw new Error(
        `Your provider doesn't support encryption. please try metamask: ${err}`,
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

  //called by borrower
  async function repayLoan(loan: ALoan): Promise<string[]> {
    const api = new LoansApi(undefined, process.env.NEXT_PUBLIC_SERVER_URL)
    throw new Error('Not implemented')
    await api.apiLoansUpdatePost({
      ...loan,
      loanStatus: 'state_returned',
    })
  }

  //called by borrower
  async function acceptLoan(loan: ALoan): Promise<string[]> {
    const api = new LoansApi(undefined, process.env.NEXT_PUBLIC_SERVER_URL)

    const { accountPkh: requesterTzAddress } = await tzConnect()
    const { account: requesterEvmAddress } = await evmConnect()

    console.log(
      `tz account ${requesterTzAddress}, evmAddress ${requesterEvmAddress}`,
    )

    const { /*assetSide,*/ cashSide } = await contracts('writeEnabled')

    const { web3, account } = await evmConnect()

    const assetSide = AssetSide__factory.connect(
      process.env.NEXT_PUBLIC_EvmApp_address,
      web3.getSigner(account),
    )

    const loanId = loan.id

    const secret2 = evmPackedSecret(uuidv4())

    const returnLogs: string[] = []

    const { status: evmStatus } = await await assetSide.getContract1(loanId)

    const { secret1encrypted } = await await assetSide.getContract1(loanId)

    const secret1 = await decrypter(requesterEvmAddress, secret1encrypted)
    // debugger
    console.log('evmStatus, preimage, secrethash', evmStatus)

    if (evmStatus === getStatusNumberByEnum(LoanStatus.MovedToEscrow)) {
      console.log('loan has been accepted on asset side')
      returnLogs.push(`loan has already been accepted on the asset side`)
    } else {
      const tx = await assetSide.acceptLoan(loanId, secret1)

      returnLogs.push(`loan accepted on the asset side : ${tx.hash}`)
    }
    const byContractId = char2Bytes(loanId)
    // const hashedImage = tzSecrethash(decryptedImage)
    const decryptedBytes = char2Bytes(secret1)
    // const sha = ethers.utils.sha256(ethers.utils.toUtf8Bytes(decryptedImage))
    // const shaBytes = char2Bytes(sha)
    debugger

    const cashSideStorage: any = await cashSide.storage()
    const { status: tzStatus } = cashSideStorage.get(byContractId)

    if (tzStatus === getStatusNumberByEnum(LoanStatus.MovedToEscrow)) {
      console.log('loan has been accepted on cash side')
      returnLogs.push(`loan has already been accepted on the cash side`)
    } else {
      const opn = await cashSide.methods
        .acceptLoan(byContractId, decryptedBytes)
        .send()

      const results = await opn.confirmation()
      returnLogs.push(`loan accepted on the cash side : ${opn.opHash}`)
      console.log(`loan accepted on the cash side : ${opn.opHash}`)
    }

    await api.apiLoansUpdatePost({
      ...loan,
      loanStatus: 'state_movedToEscrow',
    })

    return returnLogs
  }

  //also called collect loan payment Called by lender
  async function releaseCollateral(loan: ALoan): Promise<string[]> {
    const api = new LoansApi(undefined, process.env.NEXT_PUBLIC_SERVER_URL)
    throw new Error('Not implemented')
    await api.apiLoansUpdatePost({
      ...loan,
      loanStatus: 'state_released',
    })
  }

  //Called by lender
  async function fundLoan(loan: ALoan): Promise<string[]> {
    const api = new LoansApi(undefined, process.env.NEXT_PUBLIC_SERVER_URL)

    const { accountPkh: lenderTzAddress } = await tzConnect()
    const { account: lenderEvmAddress } = await evmConnect()

    console.log(`tz account ${lenderTzAddress}, evmAddress ${lenderEvmAddress}`)

    const { /*assetSide,*/ cashSide } = await contracts('writeEnabled')

    const { web3, account } = await evmConnect()

    const assetSide = AssetSide__factory.connect(
      process.env.NEXT_PUBLIC_EvmApp_address,
      web3.getSigner(account),
    )

    const loanId = loan.id

    const secret2 = evmPackedSecret(uuidv4())

    const returnLogs: string[] = []

    const ecryptedSecret2 = await encrypter(lenderEvmAddress, secret2)

    // lets connect again
    const evmHashSecret2 = await evmSecrethash(secret2)
    const { status: evmStatus } = await await assetSide.getContract1(loanId)

    console.log('evmStatus', evmStatus)

    if (evmStatus === getStatusNumberByEnum(LoanStatus.BobFunded)) {
      console.log('loan has been filled on asset side')
      returnLogs.push(`loan has already been filled on the asset side`)
    } else {
      const tx = await assetSide.giveLoan(
        loanId,
        evmHashSecret2,
        ecryptedSecret2,
      )

      returnLogs.push(`loan filled on the asset side : ${tx.hash}`)
      console.log(`loan filled on the asset side : ${tx.hash}`)
    }
    const byContractId = char2Bytes(loanId)
    const hash2 = tzSecrethash(secret2)

    const cashSideStorage: any = await cashSide.storage()
    const { status: tzStatus } = cashSideStorage.get(byContractId)

    if (tzStatus === getStatusNumberByEnum(LoanStatus.BobFunded)) {
      console.log('loan has been filled on cash side')
      returnLogs.push(`loan has already been filled on the cash side`)
    } else {
      const opn = await cashSide.methods
        .giveLoan(byContractId, hash2)
        .send({ amount: loan.loanAmount })

      const results = await opn.confirmation()
      returnLogs.push(`loan filled on the cash side : ${opn.opHash}`)
      console.log(`loan filled on the cash side : ${opn.opHash}`)
    }

    await api.apiLoansUpdatePost({
      ...loan,
      loanStatus: 'state_bobFunded',
      lender: {
        tzAddress: lenderTzAddress,
        evmAddress: lenderEvmAddress,
      },
    })

    return returnLogs
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

    const loanEndsSolidityTime = currentTimeInSec + 3600 * 24 * loanDays

    const secret1 = evmPackedSecret(uuidv4())

    const exists = await assetSide.getContract1(loanId)

    const returnLogs: string[] = []

    if (!exists.tokenId.isZero()) {
      console.log('loan has been requested on asset side')
      returnLogs.push(`loan has already been requested on the asset side`)
    } else {
      const ecrypted = await encrypter(requesterEvmAddress, secret1)

      const asset = AssetFaucet__factory.connect(
        loan.erCaddress,
        web3.getSigner(),
      )

      const approvedFor = await asset.getApproved(loan.tokenAddress)

      if (
        approvedFor.toLocaleLowerCase() !=
        process.env.NEXT_PUBLIC_EvmApp_address
      ) {
        const apprTx = await asset.approve(
          process.env.NEXT_PUBLIC_EvmApp_address,
          loan.tokenAddress,
        )
        console.log(`approved with ${apprTx.hash}`)
        await apprTx.wait()
        returnLogs.push(`got conformation for approved with ${apprTx.hash}`)
        console.log(`got conformation for approved with ${apprTx.hash}`)
      } else {
        console.log('our contract is already approved')
        returnLogs.push('our contract is already approved')
      }

      // lets connect again
      const evmHash = await evmSecrethash(secret1)

      const tx = await assetSide.askForLoan(
        loan.erCaddress,
        loan.tokenAddress,
        requesterEvmAddress,
        evmHash,
        ecrypted,
        loanEndsSolidityTime,
      )

      returnLogs.push(`loan requested on the asset side : ${tx.hash}`)
    }

    const byContractId = char2Bytes(loanId)
    const hash1 = tzSecrethash(secret1)

    const cashSideStorage: any = await cashSide.storage()

    const existing = cashSideStorage.get(byContractId)

    if (existing) {
      console.log('we have already asked for loan on cash side')
      returnLogs.push('we have already asked for loan on cash side')
    } else {
      const amountMuTez = Number.parseFloat(loan.loanAmount.toString()) * 1000
      const interestMuTez =
        Number.parseFloat(loan.interestAmount.toString()) * 1000

      const opn = await cashSide.methods
        .askForLoan(
          byContractId,
          amountMuTez, //in mutez
          interestMuTez, //in mutez
          loanDays,
          hash1,
        )
        .send()

      const results = await opn.confirmation()

      returnLogs.push(`loan requested on the cash side : ${opn.opHash}`)
      console.log(`loan requested on the cash side : ${opn.opHash}`)
    }

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
      repayLoan,
      acceptLoan,
      releaseCollateral,
      fundLoan,
    }),
    [],
  )

  return { loanLogic }
}
