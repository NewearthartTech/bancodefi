import { Loan, LoanStatus } from 'src/types'
import {
  Avatar,
  AvatarGroup,
  Flex,
  Icon,
  Progress,
  Td,
  Text,
  Tr,
  Button,
  useColorModeValue,
} from '@chakra-ui/react'
import React from 'react'
import numeral from 'numeral'
import dayjs from 'dayjs'

interface LoanRow {
  loan: Loan
  key: string
  setLoanData: (loan: Loan) => void
}

const getStatusColor = (state: LoanStatus) => {
  switch (state) {
    case 'ACTIVE':
      return 'yellow.400'
    case 'DEFAULTED':
      return 'red.400'
    case 'REPAID':
      return 'green.300'
    case 'OPEN':
      return 'tezosBlue.400'
  }
}

const getDueDateText = (loan: Loan) => {
  if (loan.status === 'OPEN') {
    return '---'
  } else {
    const nowTime = dayjs()
    const dueTime = dayjs(loan.dueDate)
    const dayDiff = dueTime.diff(nowTime, 'days')
    if (dayDiff > 0) {
      return `${dayDiff} Day${dayDiff > 1 ? 's' : ''}`
    }
    const hourDiff = dueTime.diff(dueTime, 'hours')
    if (hourDiff > 0) {
      return `${hourDiff} Hour${hourDiff > 1 ? 's' : ''}`
    }
    const minuteDiff = dueTime.diff(dueTime, 'minutes')
    if (minuteDiff > 0) {
      return `${minuteDiff} Minute${minuteDiff > 1 ? 's' : ''}`
    }
    return 'PASSED'
  }
}

export const FundBorrowRow = ({ loan, key, setLoanData }: LoanRow) => {
  const {
    loanID,
    loanRequester,
    requesterPFP,
    collateralID,
    collectionName,
    principal,
    interestRate,
    status,
  } = loan
  const textColor = useColorModeValue('gray.700', 'white')
  const statusColor = getStatusColor(status)
  const showDueDate = status === 'OPEN'
  const dueDateText = getDueDateText(loan).split(' ')

  return (
    <Tr
      key={key}
      onClick={() => setLoanData(loan)}
      _hover={{
        cursor: 'pointer',
        bg: 'gray.100',
      }}
    >
      <Td minWidth={{ sm: '125px' }} pl="0px">
        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          <Avatar
            name="Ryan Florence"
            _hover={{ zIndex: '3', cursor: 'pointer' }}
            key={requesterPFP}
            src={requesterPFP}
          />
          <Flex flexDirection="column" pl="10px">
            <Text
              fontSize="md"
              color={textColor}
              fontWeight="bold"
              minWidth="100%"
              my="0px"
            >
              Loan ID: {loanID}
            </Text>
            <Text
              my="0px"
              fontSize="md"
              color={'gray.400'}
              fontWeight="bold"
              minWidth="100%"
            >
              By: {loanRequester}
            </Text>
          </Flex>
        </Flex>
      </Td>
      <Td>
        <Flex flexDirection="column">
          <Text
            fontSize="md"
            color={textColor}
            fontWeight="bold"
            minWidth="100%"
            my="0px"
          >
            {collateralID}
          </Text>
          <Text
            my="0px"
            fontSize="md"
            color={'gray.400'}
            fontWeight="bold"
            minWidth="100%"
          >
            {collectionName}
          </Text>
        </Flex>
      </Td>
      <Td>
        <Flex flexDirection="column">
          <Text
            fontSize="md"
            color={textColor}
            fontWeight="bold"
            minWidth="100%"
            my="0px"
          >
            {numeral(principal).format('0,0')}
          </Text>
          <Text
            my="0px"
            fontSize="md"
            color={'gray.400'}
            fontWeight="bold"
            minWidth="100%"
          >
            USD
          </Text>
        </Flex>
      </Td>
      <Td>
        <Flex flexDirection="column">
          <Text
            fontSize="md"
            color={textColor}
            fontWeight="bold"
            minWidth="100%"
            my="0px"
          >
            {numeral(interestRate).format('0.00')}
          </Text>
          <Text
            my="0px"
            fontSize="md"
            color={'gray.400'}
            fontWeight="bold"
            minWidth="100%"
          >
            APR
          </Text>
        </Flex>
      </Td>

      <Td>
        <Text color={statusColor} fontWeight={700}>
          {status}
        </Text>
      </Td>
      <Td>
        <Flex flexDirection="column">
          {dueDateText.length > 1 ? (
            <>
              <Text
                fontSize="md"
                color={textColor}
                fontWeight="bold"
                minWidth="100%"
                my="0px"
              >
                {dueDateText[0]}
              </Text>

              <Text
                my="0px"
                fontSize="md"
                color={'gray.400'}
                fontWeight="bold"
                minWidth="100%"
              >
                {dueDateText[1]}
              </Text>
            </>
          ) : (
            <Text
              my="0px"
              fontSize="md"
              color={'gray.400'}
              fontWeight="bold"
              minWidth="100%"
            >
              {dueDateText}
            </Text>
          )}
        </Flex>
      </Td>
    </Tr>
  )
}
