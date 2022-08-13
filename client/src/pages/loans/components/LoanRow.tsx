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

interface LoanRow {
  loan: Loan
}

export const LoanRow = ({ loan }: LoanRow) => {
  const {
    loanID,
    loanRequester,
    requesterPFP,
    collateralID,
    collectionName,
    principal,
    interestRate,
    duration,
  } = loan
  console.log('loanid, rpfp', loanID, requesterPFP)
  const textColor = useColorModeValue('gray.700', 'white')
  return (
    <Tr>
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
        <Flex flexDirection="column">
          <Text
            fontSize="md"
            color={textColor}
            fontWeight="bold"
            minWidth="100%"
            my="0px"
          >
            {duration}
          </Text>
          <Text
            my="0px"
            fontSize="md"
            color={'gray.400'}
            fontWeight="bold"
            minWidth="100%"
          >
            DAYS
          </Text>
        </Flex>
      </Td>
      <Td>
        <Button variant={'dark'}>Fund</Button>
      </Td>
    </Tr>
  )
}
