//todo: (dee) Feel free to MOVE this to it's proper organization please
import React, { useState } from 'react'
import {
  useConnectCalls as useEvmConnect,
  getAlchemy,
} from '../src/web3/evmUtils'
import { AssetFaucet__factory } from '../src/evm_types'
import { Flex, useColorModeValue, Button, Spinner } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import { DefaultLayout } from '@banco/layouts'
import { Fonts } from '@banco/theme'
import { IAsyncResult, ShowError } from 'src/utils/asyncUtils'
import { OwnedNft } from 'alchemy-sdk'

const TestFaucet = () => {
  const [mintNFT, setMintNFT] = useState<IAsyncResult<string>>()

  const [checkBalance, setCheckbalance] = useState<IAsyncResult<OwnedNft[]>>()

  const { connect: evmConnect } = useEvmConnect()

  async function checkMyBalance() {
    try {
      setCheckbalance({ isLoading: true })

      const { account } = await evmConnect()

      const { ownedNfts } = await getAlchemy().nft.getNftsForOwner(account, {
        contractAddresses: [process.env.NEXT_PUBLIC_AssetFaucet_address],
      })

      setCheckbalance({ result: ownedNfts })
    } catch (error: any) {
      setCheckbalance({ error })
    }
  }

  return (
    <Flex direction={'column'} justifyContent="center" alignItems="center">
      {mintNFT?.isLoading && <Spinner />}

      {mintNFT?.error && <ShowError error={mintNFT.error} />}

      {mintNFT?.result && (
        <>
          <h3>{mintNFT?.result}</h3>
          <small>
            Contract Address: {process.env.NEXT_PUBLIC_AssetFaucet_address}
          </small>
        </>
      )}

      <Button
        disabled={mintNFT?.isLoading}
        style={{ maxWidth: '20rem' }}
        onClick={async () => {
          try {
            setMintNFT({ isLoading: true })

            const { web3 } = await evmConnect()

            const asset = AssetFaucet__factory.connect(
              process.env.NEXT_PUBLIC_AssetFaucet_address,
              web3.getSigner(),
            )

            const tx = await asset.giveMe()

            checkMyBalance()

            setMintNFT({ result: `your NFT is minted using tx: ${tx.hash}` })
          } catch (error: any) {
            setMintNFT({ error })
          }
        }}
      >
        Give me a TEST NFT
      </Button>

      <Button
        disabled={mintNFT?.isLoading}
        style={{ maxWidth: '20rem', marginTop:"2rem" }}
        onClick={() => checkMyBalance}>
        Check my balance
      </Button>

      <hr />
      <h2>Owned NFTs</h2>

      {checkBalance?.isLoading && <Spinner />}

      {checkBalance?.error && <ShowError error={checkBalance.error} />}

      {(checkBalance?.result || []).map((nft, i) => (
        <div key={i}>
          <span style={{ marginRight: '1rem' }}>{nft.contract.address}</span>:
          <span style={{ marginLeft: '1rem' }}>{nft.tokenId}</span>
        </div>
      ))}
    </Flex>
  )
}

const TestFaucetPage = () => {
  // Chakra Color Mode

  const iconBoxInside = useColorModeValue('white', 'white')
  return (
    <DefaultLayout>
      <Fonts />

      <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
        <TestFaucet />
      </Flex>
    </DefaultLayout>
  )
}

export default TestFaucetPage
