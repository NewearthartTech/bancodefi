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
  Select,
  Image,
  Spinner,
} from '@chakra-ui/react'
// Custom components
import { capitalize } from 'lodash'
import {
  Card,
  CardHeader,
  CreditRating,
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
import { useState } from 'react'
import { Fonts } from '@banco/theme'
import { ListModal, ModalState } from '../components'
import {
  useAppDispatch,
  useAppSelector,
  actions,
  store,
  FormState,
} from '../state'
import { LoansApi, ALoan } from '../../../generated_server'
import { useConnect as useTzConnect } from '../../../web3/tzUtils'
import {
  useConnectCalls as useEvmConnect,
  getAlchemy,
} from '../../../web3/evmUtils'
import { AssetFaucet__factory } from '../../../evm_types'
import { getShortenedWalletAddress } from '@banco/utils'
import { IAsyncResult } from 'src/utils/asyncUtils'
import { Nft } from 'alchemy-sdk'

const headers: string[] = [
  'DEAL',
  'COLLATERAL',
  'PRINCIPAL',
  'INTEREST',
  'DURATION',
  '',
]

const verifyNFT = (formState: FormState, dispatch) => {
  dispatch(actions.setVerified(true))
}

type VerifiedStatus = 'unverified' | 'verifying' | 'errored' | 'verified'

const getVerifyingContext = (status: VerifiedStatus) => {
  switch (status) {
    case 'unverified':
      return 'Verify'
    case 'verifying':
      return 'Verifying'
    case 'errored':
      return 'Error'
    case 'verified':
      return 'Verified'
  }
}

interface NftInfo {
  ownerAddress: string
  formState: FormState
}

const NftInfo = ({ ownerAddress, formState }: NftInfo) => {
  const { connect: evmConnect } = useEvmConnect()
  const [nft, setNft] = useState<IAsyncResult<Nft>>()
  useEffect(() => {
    async function checkNft() {
      if (!formState.nftVerified) return
      try {
        setNft({ isLoading: true })

        const { account } = await evmConnect()

        const data = await getAlchemy().nft.getNftMetadata(
          '0x5180db8F5c931aaE63c74266b211F580155ecac8',
          '1590',
          // formState.erCaddress,
          // formState.tokenAddress,
        )

        setNft({ result: data })
      } catch (error: any) {
        setNft({ error })
      }
    }
    checkNft()
  }, [formState])
  console.log(nft)

  const loadingInfo = nft?.isLoading && (
    <Flex>
      <Text>Loading</Text>
      <Spinner />
    </Flex>
  )

  const errorInfo = nft?.error && (
    <Flex>
      <Text>Error: </Text>
      <Text>{nft.error}</Text>
    </Flex>
  )

  const nftName = nft?.result && (
    <Text>{nft.result.title !== '' ? nft.result.title : 'Test NFT'}</Text>
  )
  const nftDescription = nft?.result && (
    <Text>
      {nft.result.description !== ''
        ? nft.result.description
        : 'This is just a test NFT'}
    </Text>
  )
  const nftSRC =
    nft?.result?.media?.length > 0
      ? nft.result?.media[0]?.thumbnail
      : '/assets/img/blank-image.png'

  return (
    <Card w="520px" h="300px" mb="20px">
      <Flex alignItems="start" justifyContent={'flex-start'}>
        <Image src={nftSRC} h="300px" w="300px" />
        <Flex ml="20px" direction="column">
          <Text mt="0px" mb="10px" fontWeight={600} fontSize="24px">
            NFT Name
          </Text>
          {nftName}
          {loadingInfo}
          {errorInfo}
          <Text my="0px">Description</Text>
          {loadingInfo}
          {nftDescription}
        </Flex>
      </Flex>
    </Card>
  )
}

const ApplyNew = () => {
  const dispatch = useAppDispatch()
  const [verificationStatus, setVerificationStatus] = useState<VerifiedStatus>(
    'unverified',
  )
  const [verificationError, setVerificationError] = useState('')
  const [ownerAddress, setOwnerAddress] = useState('')
  const formState = useAppSelector((state) => state.form)
  let mainText = useColorModeValue('gray.700', 'gray.200')
  const inputBg = useColorModeValue('white', 'gray.800')
  const mainTeal = useColorModeValue('teal.300', 'teal.300')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalState, setModalState] = useState<ModalState>('processing')
  const [modalError, setModalError] = useState('')
  const [ethereumAccountConnected, setEthereumAccountConnected] = useState(
    false,
  )
  const [tezosAccountConnected, setTezosAccountConnected] = useState(false)
  useEffect(() => {
    const checkTezosConnection = async () => {
      try {
        await tzConnect()
        setTezosAccountConnected(true)
      } catch (error) {
        setTezosAccountConnected(false)
      }
    }

    const checkEthereumConnection = async () => {
      try {
        await evmConnect()
        setEthereumAccountConnected(true)
      } catch (error) {
        setEthereumAccountConnected(false)
      }
    }
    checkTezosConnection()
    checkEthereumConnection()
  })

  const tzConnect = useTzConnect()
  const { connect: evmConnect, readOnlyWeb3: evmRO } = useEvmConnect()
  return (
    <Flex direction={'column'}>
      <ListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        loadingState={modalState}
        modalError={modalError}
      />
      <Flex>
        <Heading mt="0px" fontFamily="Vesterbro">
          Borrow
        </Heading>
        <Heading
          ml="5px"
          mt="0px"
          fontFamily="Vesterbro"
          color="aquamarine.400"
        >
          Tezos
        </Heading>
      </Flex>
      <Flex>
        <Card
          mr="16px"
          p="40px 100px"
          w="420px"
          h="630px"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontWeight={600} fontSize="32px">
            Apply for an NFT Loan
          </Text>
          <Flex
            alignItems={'start'}
            width="100%"
            justifyContent={'center'}
            flexDirection="column"
          >
            <Text fontWeight={600} mb="8px">
              Upload NFT Collateral
            </Text>
            <InputGroup
              cursor="pointer"
              bg={inputBg}
              borderRadius="10px"
              me={{ sm: 'auto', md: '20px' }}
              _focus={{
                borderColor: { mainTeal },
              }}
              _active={{
                borderColor: { mainTeal },
              }}
              width="100%"
            >
              <Input
                fontSize="xs"
                color={mainText}
                placeholder="ERC721 Address"
                borderRadius="inherit"
                mr="4px"
                onChange={(e) => {
                  dispatch(actions.setERCAddress((e as any).target.value))
                }}
              />
              <Input
                fontSize="xs"
                color={mainText}
                placeholder="Token ID"
                borderRadius="inherit"
                mr="4px"
                onChange={(e) => {
                  dispatch(actions.setTokenAddress((e as any).target.value))
                }}
              />
              <Button
                variant="green"
                backgroundColor={verificationError ? 'red' : undefined}
                onClick={async () => {
                  try {
                    setVerificationStatus('verifying')

                    if (!formState.erCaddress || !formState.tokenAddress)
                      throw new Error('token adddress and Id are required')

                    const web3ro = await evmRO()

                    const ctx = AssetFaucet__factory.connect(
                      formState.erCaddress,
                      web3ro,
                    )

                    const tokenOwner = await ctx.ownerOf(formState.tokenAddress)

                    const { account: requesterEvmAddress } = await evmConnect()

                    if (
                      tokenOwner.toLowerCase() !=
                      requesterEvmAddress.toLowerCase()
                    )
                      throw new Error("You don't own this ")
                    setVerificationStatus('verified')
                    setOwnerAddress(tokenOwner)

                    verifyNFT(formState, dispatch)
                  } catch (error: any) {
                    //todo: Show connection error here
                    console.error(`failed to save ${error}`)
                    setVerificationStatus('errored')
                    setVerificationError(`${error}`)
                  }
                }}
              >
                {getVerifyingContext(verificationStatus)}
              </Button>
            </InputGroup>
            {verificationError !== '' && (
              <Text color="red">{verificationError}</Text>
            )}
          </Flex>
          <Flex
            alignItems={'start'}
            width="100%"
            justifyContent={'center'}
            flexDirection="column"
          >
            <Text fontWeight={600} mb="8px">
              Loan Amount
            </Text>
            <InputGroup
              cursor="pointer"
              bg={inputBg}
              borderRadius="10px"
              me={{ sm: 'auto', md: '20px' }}
              _focus={{
                borderColor: { mainTeal },
              }}
              _active={{
                borderColor: { mainTeal },
              }}
              width="100%"
            >
              <Input
                fontSize="xs"
                color={mainText}
                placeholder="Loan Amount in XTZ"
                borderRadius="inherit"
                mr="4px"
                type="number"
                onChange={(e) => {
                  dispatch(actions.setLoanAmount((e as any).target.value))
                }}
              />
            </InputGroup>
          </Flex>
          <Flex
            alignItems={'start'}
            width="100%"
            justifyContent={'center'}
            flexDirection="column"
          >
            <Text fontWeight={600} mb="8px">
              Loan Duration
            </Text>
            <InputGroup
              cursor="pointer"
              bg={inputBg}
              borderRadius="10px"
              me={{ sm: 'auto', md: '20px' }}
              _focus={{
                borderColor: { mainTeal },
              }}
              _active={{
                borderColor: { mainTeal },
              }}
              width="100%"
            >
              <Input
                fontSize="xs"
                color={mainText}
                placeholder="Duration"
                borderRadius="inherit"
                mr="4px"
                type="number"
                onChange={(e) => {
                  dispatch(actions.setloanDuration((e as any).target.value))
                }}
              />
              <Select
                placeholder={capitalize(formState.loanDurationWindow)}
                bg="gray.400"
                h="44px"
                onChange={(e) => {
                  dispatch(
                    actions.setLoanDurationWindow((e as any).target.value),
                  )
                }}
              >
                <option value="days">Days</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </Select>
            </InputGroup>
          </Flex>
          <Flex
            alignItems={'start'}
            width="100%"
            justifyContent={'center'}
            flexDirection="column"
          >
            <Text fontWeight={600} mb="8px">
              Interest Amount
            </Text>
            <InputGroup
              cursor="pointer"
              bg={inputBg}
              borderRadius="10px"
              me={{ sm: 'auto', md: '20px' }}
              _focus={{
                borderColor: { mainTeal },
              }}
              _active={{
                borderColor: { mainTeal },
              }}
              width="100%"
            >
              <Input
                fontSize="xs"
                color={mainText}
                placeholder="Interest Rate"
                borderRadius="inherit"
                mr="4px"
                type="number"
                onChange={(e) => {
                  dispatch(actions.setInterestAmount((e as any).target.value))
                }}
              />
            </InputGroup>
          </Flex>
          <Button
            width="100%"
            variant="aquamarine"
            disabled={!(ethereumAccountConnected && tezosAccountConnected)}
            background={
              !(ethereumAccountConnected && tezosAccountConnected)
                ? 'red.400'
                : 'aquamarine.400'
            }
            onClick={async () => {
              try {
                setIsModalOpen(true)

                const { accountPkh: requesterTzAddress } = await tzConnect()
                const { account: requesterEvmAddress } = await evmConnect()

                const api = new LoansApi(
                  undefined,
                  process.env.NEXT_PUBLIC_SERVER_URL,
                )

                const done = await api.apiLoansApplyPost({
                  ...formState,
                  requesterTzAddress,
                  requesterEvmAddress,
                })
                setModalState('success')
              } catch (error: any) {
                //todo: Show connection error here
                console.error(`failed to save ${error}`)
                setModalState('error')
                setModalError(`${error?.message || error}`)
              }
            }}
          >
            {!(ethereumAccountConnected && tezosAccountConnected)
              ? 'Please Connect Your Wallets'
              : 'List Loan Request'}
          </Button>
        </Card>
        <Flex flexDirection={'column'} w="520px">
          <NftInfo ownerAddress={ownerAddress} formState={formState} />
          <CreditRating />
        </Flex>
      </Flex>
    </Flex>
  )
}

export const ApplyNewPage = () => {
  // Chakra Color Mode

  const iconBoxInside = useColorModeValue('white', 'white')
  return (
    <Provider store={store}>
      <DefaultLayout>
        <Fonts />

        <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
          <ApplyNew />
        </Flex>
      </DefaultLayout>
    </Provider>
  )
}
