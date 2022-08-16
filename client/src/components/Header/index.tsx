import { Button, Flex, Text } from '@chakra-ui/react'
import { WalletIcon } from '../Icons'
import { useEffect, useState } from 'react'
import { getShortenedWalletAddress } from 'src/utils'

export const Header = () => {
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState<boolean>(false)
  const [ethereumAccount, setEthereumAccount] = useState<string | null>(null)

  useEffect(() => {
    if ((window as any).ethereum) {
      //check if Metamask wallet is installed
      setIsMetamaskInstalled(true)
    }
  }, [])

  //Does the User have an Ethereum wallet/account?
  async function connectMetamaskWallet(): Promise<void> {
    //to get around type checking
    ;(window as any).ethereum
      .request({
        method: 'eth_requestAccounts',
      })
      .then((accounts: string[]) => {
        setEthereumAccount(accounts[0])
      })
      .catch((error: any) => {
        alert(`Something went wrong: ${error}`)
      })
  }

  return (
    <Flex
      mt="20px"
      w="100%"
      h="30px"
      justifyContent="flex-end"
      alignItems={'center'}
    >
      <WalletIcon w="20px" h="20px" mr="10px" />
      {ethereumAccount === null && (
        <Button
          variant="dark"
          onClick={isMetamaskInstalled ? connectMetamaskWallet : () => {}}
        >
          {isMetamaskInstalled ? 'Connect Wallet' : 'Install Metamask'}
        </Button>
      )}
      {ethereumAccount && (
        <Text>{getShortenedWalletAddress(ethereumAccount)}</Text>
      )}
    </Flex>
  )
}
