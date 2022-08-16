import { Button, Flex, Text } from '@chakra-ui/react'
import { WalletIcon } from '../Icons'
import { useEffect, useState } from 'react'
import { getShortenedWalletAddress } from 'src/utils'
import { TempleWallet } from '@temple-wallet/dapp'
import { TezosToolkit } from '@taquito/taquito'
export const Header = () => {
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState<boolean>(false)
  const [isTempleInstalled, setIsTempleInstalled] = useState<boolean>(false)
  const [ethereumAccount, setEthereumAccount] = useState<string | null>(null)
  const [tezosAccountAddress, setTezosAccountAddress] = useState<string>('')

  const [tezosAccount, setTezosAccount] = useState<TezosToolkit | null>(null)
  const wallet = new TempleWallet('Banco')

  useEffect(() => {
    if ((window as any).ethereum) {
      //check if Metamask wallet is installed
      setIsMetamaskInstalled(true)
    }
  }, [])

  useEffect(() => {
    TempleWallet.isAvailable().then((available) => {
      setIsTempleInstalled(available)
    })
  }, [])

  useEffect(() => {
    if (tezosAccount) {
      tezosAccount.wallet
        .pkh()
        .then((pubKey: string) => setTezosAccountAddress(pubKey))
    }
  }, [tezosAccount])

  //Does the User have an Ethereum wallet/account?
  const connectMetamaskWallet = (): Promise<void> => {
    return (window as any).ethereum
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

  //Does the User have an Ethereum wallet/account?
  const connectTempleWallet = async (): Promise<void> => {
    await wallet.connect('mainnet')
    const tezos = wallet.toTezos()
    setTezosAccount(tezos)
  }

  const isWalletConnected = tezosAccount || ethereumAccount

  return (
    <Flex
      mt="20px"
      w="100%"
      h="30px"
      justifyContent="flex-end"
      alignItems={'center'}
    >
      <WalletIcon w="30px" h="30px" mr="20px" />
      {!isWalletConnected && (
        <Button
          variant="dark"
          onClick={
            isMetamaskInstalled
              ? connectMetamaskWallet
              : () => window.open('https://metamask.io/', '_blank')
          }
          mr="20px"
        >
          {isMetamaskInstalled ? 'Connect Metamask' : 'Install Metamask'}
        </Button>
      )}
      {ethereumAccount && (
        <Text>{getShortenedWalletAddress(ethereumAccount)}</Text>
      )}
      {!isWalletConnected && (
        <Button
          variant="dark"
          onClick={
            isTempleInstalled
              ? connectTempleWallet
              : () => window.open('https://templewallet.com/', '_blank')
          }
        >
          {isTempleInstalled
            ? 'Connect Temple Wallet'
            : 'Install Temple Wallet'}
        </Button>
      )}
      {tezosAccount && (
        <Text>{getShortenedWalletAddress(tezosAccountAddress)}</Text>
      )}
    </Flex>
  )
}
