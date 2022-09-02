import {
  CheckIcon,
  CloseIcon,
  IconBox,
  LoadingIcon,
  TezosLogo,
} from '@banco/components'
import { Loan } from '@banco/types'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Text,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useState } from 'react'
import { getShortenedWalletAddress } from '@banco/utils'
import numeral from 'numeral'
import { useLoanCalls } from 'src/web3/loanApis'

export type ModalState = 'initial' | 'processing' | 'success' | 'error'

interface FundModalProps {
  isOpen: boolean
  onClose: () => void
  loan: Loan
}

const getModalButton = (fundLoan) => {
  const [modalState, setModalState] = useState<ModalState>('initial')
  const [modalError, setModalError] = useState('')
  switch (modalState) {
    case 'initial':
      return (
        <Flex
          alignItems="center"
          justifyContent="flex-end"
          width="100%"
          my="20px"
        >
          <Button variant="dark" onClick={fundLoan}>
            Fund Loan
          </Button>
        </Flex>
      )
    case 'processing':
      return (
        <Flex
          alignItems="center"
          justifyContent="flex-end"
          width="100%"
          my="20px"
        >
          <Spinner mr="20px" />
          <Button variant="dark" disabled>
            Funding Loan
          </Button>
        </Flex>
      )

    case 'success':
      return (
        <Flex
          alignItems="center"
          justifyContent="flex-end"
          width="100%"
          my="20px"
        >
          <Text mr="20px">Loan Funded</Text>

          <NextLink href={'/loans'}>
            <Button variant={'green'}>Go to Marketplace</Button>
          </NextLink>
        </Flex>
      )
    case 'error':
      return (
        <Flex
          alignItems="center"
          justifyContent="flex-end"
          width="100%"
          my="20px"
        >
          <Flex direction={'column'}>
            <Text mr="20px" my="0px">
              Funding Failed:
            </Text>
            <Text color="red.400" mr="20px" my="0px">
              {modalError}
            </Text>
          </Flex>
          <Button
            variant={'dark'}
            mt="20px"
            borderRadius={'10px'}
            onClick={() => {
              navigator.clipboard.writeText(modalError)
            }}
          >
            Copy Error
          </Button>
        </Flex>
      )
  }
}

export const FundModal = ({ isOpen, onClose, loan }: FundModalProps) => {
  if (!loan) {
    return <></>
  }
  const {
    id,
    requesterTzAddress,
    erCaddress,
    loanAmount,
    interestAmount,
    loanDuration,
    loanDurationWindow,
  } = loan
  const { fundLoan } = useLoanCalls()

  const modalButton = getModalButton(() => {
    fundLoan(loan)
  })
  const textColor = useColorModeValue('gray.700', 'white')
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent width={'800px'} maxWidth="1000px">
          <ModalBody>
            <Flex width={'100%'} direction="column">
              <Text
                fontSize="32px"
                fontWeight="extrabold"
                alignSelf={'center'}
                mb="20px"
              >
                Fund Loan Request
              </Text>

              <Flex
                width="100%"
                bg="white"
                backgroundImage=" linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0.15625) 99.04%);"
                height="2px"
              ></Flex>
              <Flex my="20px">
                <Flex flexDirection="column" pl="10px" mr="30px">
                  <Text
                    fontSize="md"
                    color={textColor}
                    fontWeight="bold"
                    minWidth="100%"
                    my="0px"
                  >
                    Loan ID: {id}
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
                <Flex flexDirection="column" pl="10px">
                  <Text
                    fontSize="md"
                    color={textColor}
                    fontWeight="bold"
                    minWidth="100%"
                    my="0px"
                  >
                    {getShortenedWalletAddress(erCaddress)}
                  </Text>
                  <Text
                    my="0px"
                    fontSize="md"
                    color={'gray.400'}
                    fontWeight="bold"
                    minWidth="100%"
                  >
                    Contract Address
                  </Text>
                </Flex>
              </Flex>
              <Flex
                width="100%"
                bg="white"
                backgroundImage=" linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0.15625) 99.04%);"
                height="2px"
              ></Flex>
              <Flex my="20px" justifyContent={'space-between'}>
                <Flex flexDirection="column" pl="10px" mr="30px">
                  <Text
                    mt="0px"
                    fontSize="md"
                    color={'gray.400'}
                    minWidth="100%"
                  >
                    PRINCIPAL
                  </Text>
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
                <Flex flexDirection="column" pl="10px" mr="30px">
                  <Text
                    mt="0px"
                    fontSize="md"
                    color={'gray.400'}
                    minWidth="100%"
                  >
                    INTEREST
                  </Text>
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
                <Flex flexDirection="column" pl="10px" mr="30px">
                  <Text
                    mt="0px"
                    fontSize="md"
                    color={'gray.400'}
                    minWidth="100%"
                  >
                    DURATION
                  </Text>
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
                </Flex>
              </Flex>

              <Flex
                width="100%"
                bg="white"
                backgroundImage=" linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0.15625) 99.04%);"
                height="2px"
              ></Flex>
              {modalButton}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
