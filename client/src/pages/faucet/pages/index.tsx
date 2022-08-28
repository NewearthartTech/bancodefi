import React from 'react'
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

const headers: string[] = [
  'DEAL',
  'COLLATERAL',
  'PRINCIPAL',
  'INTEREST',
  'DURATION',
  '',
]

const mintEthTokens = () => {}

const mintTezosTokens = () => {}

type FaucetVariant = 'ETH' | 'Tezos'

interface FaucetButtonProps {
  variant: FaucetVariant
  ERCAddress: string
}

const FaucetButton = ({ variant, ERCAddress }: FaucetButtonProps) => {
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
      <Text color="gray.400" fontSize={'12px'} my="0px">
        {ERCAddress}
      </Text>
      <Flex
        width="100%"
        bg="white"
        backgroundImage=" linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0.15625) 99.04%);"
        height="1px"
      ></Flex>
      <Button
        variant="dark"
        onClick={() => {
          variant === 'ETH' ? mintEthTokens() : mintTezosTokens()
        }}
      >
        {variant === 'ETH' ? 'Mint ETH NFT Tokens' : 'Mint XTZ Tokens'}
      </Button>
    </Card>
  )
}

const Faucet = () => {
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
      <Flex>
        <FaucetButton
          variant="ETH"
          ERCAddress="0x4f3b397423a83f7db2fdbe7a98fd34f0ea2c748a"
        />
        <FaucetButton
          variant="Tezos"
          ERCAddress="0x4f3b397423a83f7db2fdbe7a98fd34f0ea2c748a"
        />
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
