import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import {
  Flex,
  useColorModeValue,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  Text,
  Heading,
  InputGroup,
  InputLeftElement,
  IconButton,
  Input,
  Button,
  Spinner,
} from '@chakra-ui/react'
// Custom components
import {
  Card,
  CardHeader,
  DashboardTableRow,
  EthLogo,
  IconBox,
  ProfileIcon,
  ProfileIcon2,
  RadioSelect,
  SearchBar,
  SwitchSelect,
  TezosLogo,
  TriangleIcon,
} from '@banco/components'
import { DefaultLayout } from '@banco/layouts'
import { SearchIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import { Loan } from 'src/types'
import Link from 'next/link'

import { useConnectCalls as useEvmConnect, getAlchemy } from 'src/web3/evmUtils'
import { AssetFaucet__factory } from 'src/evm_types'
import { IAsyncResult, ShowError } from 'src/utils/asyncUtils'
import { OwnedNft } from 'alchemy-sdk'
import { OwnedNfts } from '../components'

const headers: string[] = [
  'DEAL',
  'COLLATERAL',
  'PRINCIPAL',
  'INTEREST',
  'DURATION',
  '',
]

const mintEthTokens = () => {}

type FaucetVariant = 'ETH' | 'Tezos'

interface FaucetButtonProps {
  variant: FaucetVariant
  checkMyBalance: () => void
  mintNFT: IAsyncResult<string>
  setMintNFT: React.Dispatch<React.SetStateAction<IAsyncResult<string>>>
}

const FaucetButton = ({
  variant,
  checkMyBalance,
  mintNFT,
  setMintNFT,
}: FaucetButtonProps) => {
  const { connect: evmConnect } = useEvmConnect()

  return (
    <Card
      p="30px"
      w="300px"
      h="300px"
      alignItems="center"
      justifyContent="space-between"
      mr="30px"
    >
      <IconBox
        color={'white'}
        bg={variant === 'ETH' ? 'gray.100' : 'tezosBlue.400'}
        h="90px"
        w="90px"
        borderRadius="50%"
      >
        {variant === 'ETH' ? (
          <EthLogo w="60px" h="60px" />
        ) : (
          <TezosLogo w="60px" h="60px" />
        )}
      </IconBox>
      <Text fontWeight={700} fontSize="18px">
        {variant === 'ETH' ? 'ERC721 Test Tokens' : 'FA.1 Test Tokens'}
      </Text>
      <Flex
        width="100%"
        bg="white"
        backgroundImage=" linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0.15625) 99.04%);"
        height="1px"
      ></Flex>
      <Button
        variant="dark"
        disabled={mintNFT?.isLoading}
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
    </Card>
  )
}

const Faucet = () => {
  const [checkBalance, setCheckbalance] = useState<IAsyncResult<OwnedNft[]>>()

  const [mintNFT, setMintNFT] = useState<IAsyncResult<string>>()

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

  useEffect(() => {
    const checkBalance = async () => {
      try {
        const { account } = await evmConnect()
        if (account) {
          checkMyBalance()
        }
      } catch (err) {
        console.error(err)
      }
    }
    checkBalance()
  }, [])

  return (
    <Flex direction={'column'}>
      <Flex>
        <Heading mt="0px" fontFamily="Vesterbro">
          Get Free
        </Heading>
        <Heading
          ml="5px"
          mt="0px"
          fontFamily="Vesterbro"
          color="aquamarine.400"
        >
          Test Tokens
        </Heading>
      </Flex>
      {mintNFT && (
        <Card mb="16px">
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
        </Card>
      )}
      <Flex>
        <FaucetButton
          variant="ETH"
          checkMyBalance={checkMyBalance}
          mintNFT={mintNFT}
          setMintNFT={setMintNFT}
        />
        <OwnedNfts checkBalance={checkBalance} />
      </Flex>
    </Flex>
  )
}

export const FaucetPage = () => {
  // Chakra Color Mode

  const iconBoxInside = useColorModeValue('white', 'white')
  return (
    <DefaultLayout>
      <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
        <Faucet />
      </Flex>
    </DefaultLayout>
  )
}
