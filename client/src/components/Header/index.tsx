import { Button, Flex, Text, Image } from '@chakra-ui/react'
import { WalletIcon } from '../Icons'
import { useEffect, useState } from 'react'
import { getShortenedWalletAddress } from 'src/utils'
import { TempleWallet } from '@temple-wallet/dapp'
import { TezosToolkit } from '@taquito/taquito'
import { Card, MetaMaskIcon } from '@banco/components'
import NextLink from 'next/link'

export const Header = () => {
  const [ethereumAccount, setEthereumAccount] = useState<string | null>(null)
  const [tezosAccountAddress, setTezosAccountAddress] = useState<string>('')

  const [tezosAccount, setTezosAccount] = useState<TezosToolkit | null>(null)
  const [showWallets, setShowWallets] = useState(false)
  const wallet = new TempleWallet('MetaBanc')

  useEffect(() => {
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
      // @ts-ignore
      await wallet.connect('ghostnet')
      const tezos = wallet.toTezos()
      setTezosAccount(tezos)
    }
    try {
      connectMetamaskWallet()
      connectTempleWallet()
    } catch {}
  }, [])

  useEffect(() => {
    if (tezosAccount) {
      tezosAccount.wallet
        .pkh()
        .then((pubKey: string) => setTezosAccountAddress(pubKey))
    }
  }, [tezosAccount])

  const HeaderDropdownContent = () => {
    return (
      <Flex
        position="absolute"
        top="60px"
        zIndex={10}
        onMouseLeave={() => {
          setShowWallets(false)
        }}
      >
        <Card direction="column" alignItems="center">
          <Text mb="10px" mt="0px">
            Connected Wallets
          </Text>

          <Flex
            width="100%"
            bg="white"
            backgroundImage=" linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0.15625) 99.04%);"
            height="2px"
            mb="10px"
          ></Flex>
          {ethereumAccount && (
            <Flex width="200px" justifyContent={'center'} alignItems="center">
              <MetaMaskIcon w="24px" h="24px" mr="10px" />
              <Text color="gray.400" mb="10px">
                {getShortenedWalletAddress(ethereumAccount)}
              </Text>
            </Flex>
          )}

          <Flex
            width="100%"
            bg="white"
            backgroundImage=" linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0.15625) 99.04%);"
            height="2px"
            mb="10px"
          ></Flex>
          {tezosAccount && (
            <Flex width="200px" justifyContent={'center'} alignItems="center">
              <Image
                src="/assets/img/templewallet.jpeg"
                width="24px"
                height={'24px'}
                mr="10px"
              ></Image>

              <Text color="gray.400">
                {getShortenedWalletAddress(tezosAccountAddress)}
              </Text>
            </Flex>
          )}
        </Card>
      </Flex>
    )
  }

  return (
    <Flex
      mt="20px"
      w="100%"
      h="30px"
      justifyContent="flex-end"
      alignItems={'center'}
      position="relative"
      zIndex={10}
    >
      <NextLink href={'https://mercurilabs.gitbook.io/metabanc/'} passHref>
        <Button variant="transparent-with-icon">Litepaper</Button>
      </NextLink>
      <NextLink href={'/faucet'} passHref>
        <Button variant="transparent-with-icon">Faucet</Button>
      </NextLink>
      <WalletIcon w="30px" h="30px" mr="20px" />
      <Button
        onClick={() => {
          setShowWallets(true)
        }}
        variant="transparent-with-icon"
      >
        Wallets
      </Button>
      {showWallets && <HeaderDropdownContent />}
    </Flex>
  )
}
