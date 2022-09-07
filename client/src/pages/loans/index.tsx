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
import { LoansApi, LoanStatus } from 'src/generated_server'
import { getDaysFromDuration } from '@banco/utils'
import { FundModal } from './components/FundModal'
import { getStatusNumberByEnum } from 'src/utils/asyncUtils'

const headers: string[] = [
  'DEAL',
  'COLLATERAL',
  'PRINCIPAL',
  'INTEREST',
  'DURATION',
  '',
]

export const columnWidths = {
  DEAL: '200px',
  COLLATERAL: '200px',
  PRINCIPAL: '80px',
  INTEREST: '80px',
  DURARTION: '80px',
  '': '120px',
}

const applyMinMax = (
  loans: Loan[],
  attributeAccessor: (loan: Loan) => number,
  setMin: (min: number) => void,
  setMax: (max: number) => void,
  setRange: ([min, max]: number[]) => void,
  dispatch: any,
) => {
  const minVal = loans.reduce((prevMin, currLoan) => {
    return Math.min(prevMin, attributeAccessor(currLoan))
  }, attributeAccessor(loans[0]))
  const maxVal = loans.reduce((prevMax, currLoan) => {
    return Math.max(prevMax, attributeAccessor(currLoan))
  }, attributeAccessor(loans[0]))
  dispatch(setMin(minVal))
  dispatch(setMax(maxVal))
  dispatch(setRange([minVal, maxVal]))
}

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
  if (loans.length === 0) return loans
  const { principalAmountRange, interestRange, durationRange } = filters
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
    (loan) => getDaysFromDuration(loan.loanDurationWindow, loan.loanDuration),
  )

  return newLoans
}

const Loans = () => {
  const textColor = useColorModeValue('gray.700', 'white')
  const dispatch = useAppDispatch()
  const filterState = useAppSelector((state) => state.filter)
  const [rawLoans, setRawLoans] = useState<Loan[]>([])
  const [currentLoan, setCurrentLoan] = useState<Loan>(null)
  const [showFundModal, setShowFundModal] = useState(false)
  const filteredLoans = useMemo(() => filterLoans(rawLoans, filterState), [
    rawLoans,
    filterState,
  ])
  const [filterSections, setFilterSections] = useState<React.ReactChild[]>([])
  getStatusNumberByEnum(LoanStatus.BobFunded)
  useEffect(() => {
    dispatch(actions.setFilterSections(FILTER_SECTIONS))
  }, [])

  useEffect(() => {
    const getLoans = async () => {
      const api = new LoansApi(undefined, process.env.NEXT_PUBLIC_SERVER_URL)
      const { data: rawLoans } = await api.apiLoansListLoansStatusGet(
        'state_created',
      )
      if (rawLoans.length === 0) {
        setRawLoans(rawLoans)
        return
      }
      applyMinMax(
        rawLoans,
        (loan) => loan.loanAmount,
        actions.setPrincipalAmountMin,
        actions.setPrincipalAmountMax,
        actions.setPrincipalAmount,
        dispatch,
      )

      applyMinMax(
        rawLoans,
        (loan) => loan.interestAmount,
        actions.setInterestAmountMin,
        actions.setInterestAmountMax,
        actions.setInterest,
        dispatch,
      )

      applyMinMax(
        rawLoans,
        (loan) =>
          getDaysFromDuration(loan.loanDurationWindow, loan.loanDuration),
        actions.setDurationMin,
        actions.setDurationMax,
        actions.setDuration,
        dispatch,
      )

      setRawLoans(rawLoans)
    }
    getLoans()
  }, [])

  useEffect(() => {
    const sections = filterState.filterSections.map((section, index) => {
      return (
        <FilterSection
          name={section.name}
          children={section.children}
          dispatch={dispatch}
          key={index}
          filterState={filterState}
        ></FilterSection>
      )
    })
    setFilterSections(sections)
  }, [filterState])

  return (
    <Flex direction={'column'}>
      <FundModal
        isOpen={showFundModal}
        onClose={() => {
          setShowFundModal(false)
        }}
        loan={currentLoan}
      />
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
          {filterSections}
        </Card>
        <Card p="16px" w="1000px">
          <Text>Loan Requests</Text>
          <Grid templateColumns={'2fr 2fr 1fr 1fr 1fr 1fr'}>
            {headers.map((caption, idx) => {
              return <GridItem color="gray.400">{caption}</GridItem>
            })}
          </Grid>
          <Grid
            templateColumns={'2fr 2fr 1fr 1fr 1fr 1fr'}
            overflowY="scroll"
            maxH={'600px'}
          >
            {filteredLoans.map((row) => {
              return (
                <LoanRow
                  loan={row}
                  key={row.id}
                  setCurrentLoan={setCurrentLoan}
                  setShowModal={setShowFundModal}
                />
              )
            })}
          </Grid>
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
