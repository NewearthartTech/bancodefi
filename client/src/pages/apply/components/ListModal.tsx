import {
  CheckIcon,
  CloseIcon,
  IconBox,
  LoadingIcon,
  TezosLogo,
} from '@banco/components'
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
} from '@chakra-ui/react'
import NextLink from 'next/link'

export type ModalState = 'processing' | 'success' | 'error'

interface ListModalProps {
  isOpen: boolean
  onClose: () => void
  loadingState: ModalState
  modalError?: string
}

const getModalContent = (state: ModalState, error?: string) => {
  switch (state) {
    case 'processing':
      return (
        <Flex direction={'column'} alignItems="center" pb="40px">
          <Text fontFamily={'Vesterbro'} fontSize="64px">
            Loan Listing
          </Text>

          <Spinner h="200px" w="200px" thickness="4px" color="green.300" />
        </Flex>
      )

    case 'success':
      return (
        <Flex direction={'column'} alignItems="center" pb="40px">
          <Text fontFamily={'Vesterbro'} fontSize="64px">
            Loan Listed
          </Text>

          <CheckIcon color="aquamarine.400" w="200px" h="200px" />
          <NextLink href={'/loans'}>
            <Button variant={'dark'} mt="20px" borderRadius={'10px'}>
              Go to Marketplace
            </Button>
          </NextLink>
        </Flex>
      )
    case 'error':
      return (
        <Flex
          direction={'column'}
          alignItems="center"
          pb="40px"
          justifyContent={'center'}
        >
          <Text fontFamily={'Vesterbro'} fontSize="64px" textAlign={'center'}>
            Listing Failed
          </Text>
          <IconBox
            color="white"
            w="200px"
            h="200px"
            bg="red"
            borderRadius="50%"
          >
            <CloseIcon w="200px" h="200px" />
          </IconBox>
          <Text color="red.400">{error}</Text>
          <Button
            variant={'dark'}
            mt="20px"
            borderRadius={'10px'}
            onClick={() => {
              navigator.clipboard.writeText(error)
            }}
          >
            Copy Error
          </Button>
        </Flex>
      )
  }
}

export const ListModal = ({
  isOpen,
  onClose,
  loadingState,
  modalError,
}: ListModalProps) => {
  const modalContent = getModalContent(loadingState, modalError)
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>{modalContent} </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
