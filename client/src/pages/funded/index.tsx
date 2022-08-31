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
  Grid,
  GridItem,
} from '@chakra-ui/react'
// Custom components
import {
  Card,
  CardHeader,
  DashboardTableRow,
  IconBox,
  RadioSelect,
  SearchBar,
  SwitchSelect,
  TriangleIcon,
  SwitchSection,
  FilterSectionChild,
  FilterSection,
  SwitchSectionProps,
  CreditRating,
} from '@banco/components'
import { IoCheckmarkDoneCircleSharp } from 'react-icons/io5'
import { clone } from 'lodash'
import { FundBorrowRow, LoanActivity } from '@banco/components'
import { loanTableData } from '@banco/variables'
import { DefaultLayout } from '@banco/layouts'
import { SearchIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import {
  actions,
  useAppDispatch,
  useAppSelector,
  store,
  FILTER_SECTIONS,
  FilterState,
  Filter,
  BooleanFilter,
  RangeFilter,
} from './state'
import { Loan } from 'src/types'

import { LoansApi } from 'src/generated_server'
import { useConnectCalls as useEvmConnect } from 'src/web3/evmUtils'
const headers: string[] = [
  'DEAL',
  'COLLATERAL',
  'PRINCIPAL',
  'INTEREST',
  'STATUS',
  'DUE DATE',
]

const data = loanTableData

const Funded = () => {
  const [currLoan, setCurrLoan] = useState<Loan>()
  const textColor = useColorModeValue('gray.700', 'white')
  const dispatch = useAppDispatch()
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([])

  const { connect: evmConnect, readOnlyWeb3: evmRO } = useEvmConnect()

  useEffect(() => {
    const getLoans = async () => {
      const api = new LoansApi(undefined, process.env.NEXT_PUBLIC_SERVER_URL)
      const { account: requesterEvmAddress } = await evmConnect()
      const {
        data: rawLoans,
      } = await api.apiLoansByLenderEvmAddressEvmAddressGet(requesterEvmAddress)

      setFilteredLoans(rawLoans)
    }
    getLoans()
  }, [])

  return (
    <Flex direction={'column'}>
      <Flex>
        <Heading mt="0px" fontFamily="Vesterbro">
          Loans
        </Heading>
        <Heading
          ml="5px"
          mt="0px"
          fontFamily="Vesterbro"
          color="aquamarine.400"
        >
          Funded
        </Heading>
      </Flex>
      <Flex>
        <Card
          p="16px"
          overflowX={{ sm: 'scroll', xl: 'hidden' }}
          w="70%"
          mr="20px"
        >
          <Text>Your Loans</Text>
          <Grid templateColumns={'2fr 2fr 1fr 1fr 1fr 1fr'}>
            {headers.map((caption, idx) => {
              return <GridItem color="gray.400">{caption}</GridItem>
            })}
          </Grid>
          <Grid
            templateColumns={'2fr 2fr 1fr 1fr 1fr 1fr'}
            overflowY={'scroll'}
            maxH="600px"
          >
            {filteredLoans.map((row) => {
              return (
                <FundBorrowRow
                  loan={row}
                  key={row.id}
                  setLoanData={setCurrLoan}
                  selected={currLoan === row}
                />
              )
            })}
          </Grid>
        </Card>
        <Flex w="30%" flexDirection={'column'} mr="20px">
          <Card h="100%" w="100%">
            <Text>Activity</Text>
            {currLoan && <LoanActivity loan={currLoan} page="funded" />}
            {!currLoan && (
              <Text color={'gray.400'}>Select a loan to view activity</Text>
            )}
          </Card>
        </Flex>
      </Flex>
    </Flex>
  )
}

export const FundedPage = () => {
  // Chakra Color Mode

  const iconBoxInside = useColorModeValue('white', 'white')
  return (
    <Provider store={store}>
      <DefaultLayout>
        <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
          <Funded />
        </Flex>
      </DefaultLayout>
    </Provider>
  )
}
