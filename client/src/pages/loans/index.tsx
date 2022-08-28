import React, { useMemo } from 'react'
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
  IconBox,
  RadioSelect,
  SearchBar,
  SwitchSelect,
  TriangleIcon,
  SwitchSection,
  FilterSectionChild,
  FilterSection,
  SwitchSectionProps,
} from '@banco/components'
import { IoCheckmarkDoneCircleSharp } from 'react-icons/io5'
import { clone } from 'lodash'
import { LoanRow } from './components'
import { loanTableData } from '@banco/variables'
import { DefaultLayout } from '@banco/layouts'
import { SearchIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react'
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

const headers: string[] = [
  'DEAL',
  'COLLATERAL',
  'PRINCIPAL',
  'INTEREST',
  'DURATION',
  '',
]

const applyMinMax = (
  loans: Loan[],
  filters: FilterState,
  attributeAccessor: (loan: Loan) => boolean | number,
) => {}

const applyFilter = (
  loans: Loan[],
  filter: Filter,
  attributeAccessor: (loan: Loan) => boolean | number,
): Loan[] => {
  switch (filter.filterType) {
    case 'boolean':
      const { enabled } = filter.filterInfo as BooleanFilter
      return loans.filter((loan) => {
        const comparedAttribute = attributeAccessor(loan) as boolean
        return enabled === comparedAttribute
      })
    case 'range':
      const { min, max } = filter.filterInfo as RangeFilter
      return loans.filter((loan) => {
        const comparedAttribute = attributeAccessor(loan) as number
        return comparedAttribute >= min && comparedAttribute <= max
      })
  }
}

const filterLoans = (loans: Loan[], filters: FilterState): Loan[] => {
  const { principalAmountRange, interestRange, durationRange } = filters
  console.log('filtering', loans)
  let newLoans = clone(loans)
  newLoans = applyFilter(
    newLoans,
    {
      filterType: 'range',
      filterInfo: {
        min: principalAmountRange[0],
        max: principalAmountRange[1],
      },
    },
    (loan) => loan.loanAmount,
  )
  newLoans = applyFilter(
    newLoans,
    {
      filterType: 'range',
      filterInfo: {
        min: interestRange[0],
        max: interestRange[1],
      },
    },
    (loan) => loan.interestAmount,
  )
  newLoans = applyFilter(
    newLoans,
    {
      filterType: 'range',
      filterInfo: {
        min: durationRange[0],
        max: durationRange[1],
      },
    },
    (loan) => loan.loanDuration,
  )
  return newLoans
}

const Loans = () => {
  const textColor = useColorModeValue('gray.700', 'white')
  const dispatch = useAppDispatch()
  const filterState = useAppSelector((state) => state.filter)
  const [rawLoans, setRawLoans] = useState<Loan[]>([])
  const filteredLoans = useMemo(() => filterLoans(rawLoans, filterState), [
    rawLoans,
    filterState,
  ])

  useEffect(() => {
    const getLoans = async () => {
      const api = new LoansApi(undefined, process.env.NEXT_PUBLIC_SERVER_URL)
      const { data: rawLoans } = await api.apiLoansListLoansStatusGet(
        'state_created',
      )

      setRawLoans(rawLoans)
    }
    getLoans()
  }, [])

  return (
    <Flex direction={'column'}>
      <Flex>
        <Heading mt="0px" fontFamily="Vesterbro">
          Lend
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
          p="16px"
          overflowX={{ sm: 'scroll', xl: 'hidden' }}
          w="248px"
          mr="10px"
        >
          <Text>Filter</Text>
          <SearchBar />
          {FILTER_SECTIONS.map((section) => {
            return (
              <FilterSection
                name={section.name}
                children={section.children}
                dispatch={dispatch}
                key={section.name}
              ></FilterSection>
            )
          })}
        </Card>
        <Card p="16px" overflowX={{ sm: 'scroll', xl: 'hidden' }}>
          <Text>Loan Requests</Text>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" ps="0px" key="header">
                {headers.map((caption, idx) => {
                  return (
                    <Th
                      color="gray.400"
                      key={idx}
                      ps={idx === 0 ? '0px' : null}
                    >
                      {caption}
                    </Th>
                  )
                })}
              </Tr>
            </Thead>
            <Tbody>
              {filteredLoans.map((row) => {
                return <LoanRow loan={row} key={row.id} />
              })}
            </Tbody>
          </Table>
        </Card>
      </Flex>
    </Flex>
  )
}

export const LoanPage = () => {
  // Chakra Color Mode

  const iconBoxInside = useColorModeValue('white', 'white')
  return (
    <Provider store={store}>
      <DefaultLayout>
        <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
          <Loans />
        </Flex>
      </DefaultLayout>
    </Provider>
  )
}
