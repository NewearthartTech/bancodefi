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
import { getShortenedWalletAddress } from 'src/utils'

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
    <Tr key={id} overflowX="scroll">
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
            {loanDuration}
          </Text>
          <Text
            my="0px"
            fontSize="md"
            color={'gray.400'}
            fontWeight="bold"
            minWidth="100%"
          >
            {loanDurationWindow}
          </Text>
        </Flex>
      </Td>
      <Td>
        <Button
          variant={'dark'}
          onClick={() => {
            setCurrentLoan(loan)
            setShowModal(true)
          }}
        >
          Fund
        </Button>
      </Td>
    </Tr>
  )
}
