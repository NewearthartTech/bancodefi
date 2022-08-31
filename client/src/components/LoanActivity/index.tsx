import { Loan } from 'src/types/'
import {
  Avatar,
  Button,
  Flex,
  FlexProps,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { getShortenedWalletAddress } from 'src/utils'

interface LoanActivityRow {
  info: string
  date: string
}

interface LoanActivityProps extends FlexProps {
  loan: Loan
  page: 'borrowed' | 'funded'
}

const repayLoan = (loan: Loan) => {}
const claimLoan = (loan: Loan) => {}
const claimRepayment = (loan: Loan) => {}

const getLoanActivityByID = (loan: string): LoanActivityRow[] => {
  return [
    {
      info: ' Tz Collateral has been approved',
      date: '08-11-2022 04:35:29',
    },
  ]
}

export const LoanActivity = ({ loan, page, ...props }: LoanActivityProps) => {
  const { id, requesterEvmAddress, loanStatus } = loan
  const loanActivity = getLoanActivityByID(id)

  const textColor = useColorModeValue('gray.700', 'white')
  return (
    <Flex flexDirection={'column'} {...props}>
      <Flex
        align="center"
        py=".8rem"
        minWidth="100%"
        flexWrap="nowrap"
        pb="20px"
        borderBottom="solid 1px"
        borderBottomColor="gray.300"
      >
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
            LID: {getShortenedWalletAddress(id)}
          </Text>
          <Text
            my="0px"
            fontSize="md"
            color={'gray.400'}
            fontWeight="bold"
            minWidth="100%"
          >
            By: {getShortenedWalletAddress(requesterEvmAddress)}
          </Text>
        </Flex>
        {loanStatus === 'state_movedToEscrow' && page === 'borrowed' && (
          <Button
            variant="dark"
            onClick={() => {
              claimLoan(loan)
            }}
            ml="auto"
          >
            Claim Loan
          </Button>
        )}
        {loanStatus === 'state_released' && page === 'borrowed' && (
          <Button
            variant="dark"
            onClick={() => {
              repayLoan(loan)
            }}
            ml="auto"
          >
            Repay Loan
          </Button>
        )}

        {loanStatus === 'state_returned' && page === 'funded' && (
          <Button
            variant="dark"
            onClick={() => {
              claimRepayment(loan)
            }}
            ml="auto"
          >
            Claim Repayment
          </Button>
        )}
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
