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
  Select,
  Image,
} from '@chakra-ui/react'
// Custom components
import { capitalize } from 'lodash'
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
import { IoCheckmarkDoneCircleSharp } from 'react-icons/io5'
import { clone } from 'lodash'
import {
  FilterSection,
  FilterSectionChild,
  LoanRow,
  SwitchSection,
  SwitchSectionProps,
} from './components'
import { loanTableData } from '@banco/variables'
import { DefaultLayout } from '@banco/layouts'
import { SearchIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import { Loan } from 'src/types'
import { Fonts } from '@banco/theme'
import { ListModal } from '../components'
import {
  useAppDispatch,
  useAppSelector,
  actions,
  store,
  FormState,
} from '../state'

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

const ApplyNew = () => {
  const dispatch = useAppDispatch()
  const formState = useAppSelector((state) => state.form)
  let mainText = useColorModeValue('gray.700', 'gray.200')
  const inputBg = useColorModeValue('white', 'gray.800')
  const mainTeal = useColorModeValue('teal.300', 'teal.300')
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <Flex direction={'column'}>
      <ListModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
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
                  dispatch(actions.setERCAddress(e.target.value))
                }}
              />
              <Input
                fontSize="xs"
                color={mainText}
                placeholder="Token ID"
                borderRadius="inherit"
                mr="4px"
                onChange={(e) => {
                  dispatch(actions.setTokenAddress(e.target.value))
                }}
              />
              <Button
                variant="green"
                onClick={() => {
                  verifyNFT(formState, dispatch)
                }}
              >
                Verify
              </Button>
            </InputGroup>
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
                  dispatch(actions.setLoanAmount(e.target.value))
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
                  dispatch(actions.setloanDuration(e.target.value))
                }}
              />
              <Select
                placeholder={capitalize(formState.loanDurationWindow)}
                bg="gray.400"
                h="44px"
                onChange={(e) => {
                  dispatch(actions.setLoanDurationWindow(e.target.value))
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
                  dispatch(actions.setInterestAmount(e.target.value))
                }}
              />
            </InputGroup>
          </Flex>
          <Button
            width="100%"
            variant="aquamarine"
            onClick={() => {
              setIsModalOpen(true)
            }}
          >
            List Loan Request
          </Button>
        </Card>
        <Flex flexDirection={'column'}>
          <Card w="520px" h="300px" mb="20px">
            <Flex alignItems="start" justifyContent={'flex-start'}>
              <Image src="/assets/img/blank-image.png" h="300px" w="300px" />
              <Flex ml="20px" direction="column">
                <Text mt="0px" mb="10px" fontWeight={600} fontSize="24px">
                  NFT Name
                </Text>
                <Text my="0px">Collection Name</Text>
                <Text mt="0px">Owner Address</Text>
              </Flex>
            </Flex>
          </Card>
          <Card w="520px" h="300px">
            <Flex direction={'column'} alignItems="center">
              <Text fontSize={32}>Your Credit Rating</Text>
              <Flex>
                <Text
                  color="gray.400"
                  fontSize={48}
                  my="0px"
                  fontFamily={'Vesterbro'}
                >
                  -
                </Text>
                <Text my="0px" fontFamily={'Vesterbro'} fontSize={48}>
                  /100
                </Text>
              </Flex>
              <Text color="gray.400">No Rating</Text>
            </Flex>
          </Card>
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
