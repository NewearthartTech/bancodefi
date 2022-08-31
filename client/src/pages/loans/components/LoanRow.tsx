import { Loan } from 'src/types'
import {
  Avatar,
  AvatarGroup,
  Flex,
  Icon,
  Progress,
  Text,
  Tr,
  Button,
  useColorModeValue,
  GridItem,
} from '@chakra-ui/react'
import React from 'react'
import numeral from 'numeral'
import { getShortenedWalletAddress } from 'src/utils'
import { capitalize } from 'lodash'
import { columnWidths } from '../'

interface LoanRow {
  loan: Loan
  setCurrentLoan: (loan: Loan) => void
  setShowModal: (show: boolean) => void
}

export const LoanRow = ({ loan, setCurrentLoan, setShowModal }: LoanRow) => {
  const {
    id,
    requesterTzAddress,
    erCaddress,
    loanAmount,
    interestAmount,
    loanDuration,
    loanDurationWindow,
  } = loan
  const textColor = useColorModeValue('gray.700', 'white')
  return (
    <>
      <GridItem
        py="10px"
        borderBottom={'solid 1px'}
        borderBottomColor="gray.100"
      >
        <Flex flexDirection="column" width={columnWidths.DEAL}>
          <Text fontSize="md" color={textColor} fontWeight="bold" my="0px">
            Loan ID: {getShortenedWalletAddress(id)}
          </Text>
          <Text my="0px" fontSize="md" color={'gray.400'} fontWeight="bold">
            By: {getShortenedWalletAddress(requesterTzAddress)}
          </Text>
        </Flex>
      </GridItem>
      <GridItem
        py="10px"
        borderBottom={'solid 1px'}
        borderBottomColor="gray.100"
      >
        <Flex flexDirection="column">
          <Text fontSize="md" color={textColor} fontWeight="bold" my="0px">
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
      </GridItem>
      <GridItem
        py="10px"
        borderBottom={'solid 1px'}
        borderBottomColor="gray.100"
      >
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
      </GridItem>
      <GridItem
        py="10px"
        borderBottom={'solid 1px'}
        borderBottomColor="gray.100"
      >
        <Flex flexDirection="column">
          <Text
            fontSize="md"
            color={textColor}
            fontWeight="bold"
            minWidth="100%"
            my="0px"
          >
            {numeral(interestAmount).format('0.00')}%
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
      </GridItem>
      <GridItem
        py="10px"
        borderBottom={'solid 1px'}
        borderBottomColor="gray.100"
      >
        <Flex flexDirection="column">
          <Text
            fontSize="md"
            color={textColor}
            fontWeight="bold"
            minWidth="100%"
            my="0px"
          >
            {loanDuration}
          </Text>
          <Text
            my="0px"
            fontSize="md"
            color={'gray.400'}
            fontWeight="bold"
            minWidth="100%"
          >
            {capitalize(loanDurationWindow)}
          </Text>
        </Flex>
      </GridItem>
      <GridItem
        py="10px"
        borderBottom={'solid 1px'}
        borderBottomColor="gray.100"
      >
        <Button
          variant={'dark'}
          onClick={() => {
            setCurrentLoan(loan)
            setShowModal(true)
          }}
        >
          Fund
        </Button>
      </GridItem>
    </>
  )
}
