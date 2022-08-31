import { Loan } from 'src/types'
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
import { LoanStatus } from 'src/generated_server'
import { getShortenedWalletAddress } from 'src/utils'

interface LoanRow {
  loan: Loan
  key: string
  setLoanData: (loan: Loan) => void
  selected?: boolean
}

//dee:todo // what is status here
const status = 'unknown'

const getStatusColorAndCopy = (state: LoanStatus): string[] => {
  switch (state) {
    case 'state_created':
      return ['Pending', 'yellow.400']
    case 'state_bobFunded':
      return ['Funded', 'yellow.400']
    case 'state_movedToEscrow':
      return ['Active', 'yellow.400']
    case 'state_refundToBob':
      return ['Repaid', 'green.300']
    case 'state_returned':
      return ['Repaid', 'green.300']
    case 'state_released':
      return ['Lender Deposit Returned', 'green.300']
    case 'state_refundToAlex':
      return ['Collateral Returned', 'green.300']

    case 'state_defaulted':
      return ['Defaulted', 'red.400']
    case 'state_fortified':
      return ['Lender Defaulted', 'red.400']
  }
}

const getDueDateText = (loan: Loan) => {
  if (loan.loanStatus === 'state_created') {
    return '---'
  } else {
    const nowTime = dayjs()
    const dueTime = dayjs(loan.loanDuration)
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
    return 'EXPIRED'
  }
}

export const FundBorrowRow = ({
  loan,
  key,
  setLoanData,
  selected,
}: LoanRow) => {
  const {
    id,
    requesterTzAddress,
    erCaddress,
    loanAmount,
    interestAmount,
    loanStatus,
  } = loan
  const textColor = useColorModeValue('gray.700', 'white')
  const [statusText, statusColor] = getStatusColorAndCopy(loanStatus)
  const dueDateText = getDueDateText(loan).split(' ')
  console.log(selected, 'selected')
  return (
    <Tr
      key={key}
      onClick={() => setLoanData(loan)}
      _hover={{
        cursor: 'pointer',
        bg: 'aquamarine.100',
      }}
      bg={selected && 'aquamarine.100'}
    >
      <Td minWidth={{ sm: '125px' }} pl="0px">
        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          {/* <Avatar
            name="Ryan Florence"
            _hover={{ zIndex: '3', cursor: 'pointer' }}
            key={requesterPFP}
            src={requesterPFP}
          /> */}
          <Flex flexDirection="column" pl="10px">
            <Text
              fontSize="md"
              color={textColor}
              fontWeight="bold"
              minWidth="100%"
              my="0px"
            >
              Loan ID: {getShortenedWalletAddress(id)}
            </Text>
            <Text
              my="0px"
              fontSize="md"
              color={'gray.400'}
              fontWeight="bold"
              minWidth="100%"
            >
              By: {getShortenedWalletAddress(requesterTzAddress)}
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
            {getShortenedWalletAddress(erCaddress)}
          </Text>
          {/* <Text
            my="0px"
            fontSize="md"
            color={'gray.400'}
            fontWeight="bold"
            minWidth="100%"
          >
            {collectionName}
          </Text> */}
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
            {numeral(loanAmount).format('0,0')}
          </Text>
          <Text
            my="0px"
            fontSize="md"
            color={'gray.400'}
            fontWeight="bold"
            minWidth="100%"
          >
            XTZ
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
            {numeral(interestAmount).format('0.00')}
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
          {statusText}
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
