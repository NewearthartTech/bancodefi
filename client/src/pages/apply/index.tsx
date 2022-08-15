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

const headers: string[] = [
  'DEAL',
  'COLLATERAL',
  'PRINCIPAL',
  'INTEREST',
  'DURATION',
  '',
]

const Apply = () => {
  return (
    <Flex direction={'column'}>
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
          p="30px"
          w="300px"
          h="300px"
          alignItems="center"
          justifyContent="space-between"
        >
          <IconBox
            color={'white'}
            bg={'teal.400'}
            h="90px"
            w="90px"
            borderRadius="50%"
            me="12px"
          >
            <ProfileIcon2 w="38px" h="38px" />
          </IconBox>
          <Text fontWeight={700}>NFT Loans</Text>
          <Text color="gray.400">ETH NFT Backed Loans</Text>
          <Flex
            width="100%"
            bg="white"
            backgroundImage=" linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0.15625) 99.04%);"
            height="1px"
          ></Flex>
          <Flex>
            <IconBox
              color={'white'}
              bg={'gray.100'}
              h="30px"
              w="30px"
              borderRadius="50%"
              me="12px"
            >
              <EthLogo w="20px" h="20px" />
            </IconBox>
            <IconBox
              color={'white'}
              bg={'tezosBlue.400'}
              h="30px"
              w="30px"
              borderRadius="50%"
              me="12px"
            >
              <TezosLogo w="20px" h="20px" />
            </IconBox>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  )
}

export const ApplyPage = () => {
  // Chakra Color Mode

  const iconBoxInside = useColorModeValue('white', 'white')
  return (
    <DefaultLayout>
      <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
        <Apply />
      </Flex>
    </DefaultLayout>
  )
}
