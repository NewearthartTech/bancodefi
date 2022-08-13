import React from 'react'

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
} from '@chakra-ui/react'
// Custom components
import { Card, CardHeader, DashboardTableRow } from '@banco/components'
import { IoCheckmarkDoneCircleSharp } from 'react-icons/io5'
import { LoanRow } from './components'
import { loanTableData } from '@banco/variables'
import { DefaultLayout } from '@banco/layouts'

const headers: string[] = [
  'DEAL',
  'COLLATERAL',
  'PRINCIPAL',
  'INTEREST',
  'DURATION',
  '',
]

const data = loanTableData

const Loans = () => {
  const textColor = useColorModeValue('gray.700', 'white')
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
      <Card p="16px" overflowX={{ sm: 'scroll', xl: 'hidden' }}>
        <Text>Loan Requests</Text>
        <Table variant="simple" color={textColor}>
          <Thead>
            <Tr my=".8rem" ps="0px">
              {headers.map((caption, idx) => {
                return (
                  <Th color="gray.400" key={idx} ps={idx === 0 ? '0px' : null}>
                    {caption}
                  </Th>
                )
              })}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((row) => {
              return <LoanRow loan={row} />
            })}
          </Tbody>
        </Table>
      </Card>
    </Flex>
  )
}

export const LoanPage = () => {
  // Chakra Color Mode

  const iconBoxInside = useColorModeValue('white', 'white')
  return (
    <DefaultLayout>
      <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
        <Loans />
      </Flex>
    </DefaultLayout>
  )
}
