import { Loan } from '@banco/types/'
import { Avatar, Flex, Text, useColorModeValue } from '@chakra-ui/react'

interface LoanActivityRow {
  info: string
  date: string
}

interface LoanActivityProps {
  loan: Loan
}

const getLoanActivityByID = (loan: string): LoanActivityRow[] => {
  return [
    {
      info: ' Tz Collateral has been approved',
      date: '08-11-2022 04:35:29',
    },
  ]
}

export const LoanActivity = ({ loan }: LoanActivityProps) => {
  const { loanID, loanRequester, requesterPFP } = loan
  const loanActivity = getLoanActivityByID(loanID)

  const textColor = useColorModeValue('gray.700', 'white')
  return (
    <Flex flexDirection={'column'}>
      <Flex
        align="center"
        py=".8rem"
        minWidth="100%"
        flexWrap="nowrap"
        pb="20px"
        borderBottom="solid 1px"
        borderBottomColor="gray.300"
      >
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

      {loanActivity.map((activity) => {
        return (
          <Flex>
            <Text color="gray.400">{`* ${activity.date} --- ${activity.info}`}</Text>
          </Flex>
        )
      })}
    </Flex>
  )
}
