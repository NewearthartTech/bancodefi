import { ethers } from 'ethers'
import { useMemo, useRef, useState } from 'react'
import { ChainConfigs, InjectedWeb3 } from './injectedWeb3'
import constate from 'constate'

export const [EvmProvider, useConnectCalls] = constate(
    useWeb3,
    (v) => v.connectCtx
  )

function useWeb3() {
  const [chainConfigs, setChainConfigs] = useState<ChainConfigs>()
  const chainConfigsRef = useRef<ChainConfigs>()

  /*
    const injectedProvider = useMemo(() => {
      return (window as any)?.ethereum
        ? new ethers.providers.Web3Provider((window as any).ethereum)
        : undefined;
    }, []);
    */

  const getChainConfigs = async () => {
    if (chainConfigsRef.current) {
      return chainConfigsRef.current
    }

    /* TODO: load chain config from server
          chainConfigsRef.current = await fetchJsonAsync<chainConfigsModel>(
              fetch(`${connectTo.dataSvr}/api/nft/chainConfigs`));
          */

    chainConfigsRef.current = {
      chainInfo: {
        4: {
          hexChainId: '0x4',
          rpcProvider:
            'https://eth-rinkeby.alchemyapi.io/v2/wUa6CvTsOs5kmoeByPGofX8aa3xmiV-a',
          name: 'Rinkeby',
        },
      },
    }

    setChainConfigs(chainConfigsRef.current)

    return chainConfigsRef.current
  }

  const readOnlyWeb3 = async (chainId?: string) => {
    const chainConfigs = await getChainConfigs()
    if (!chainConfigs.chainInfo[chainId || 4]?.rpcProvider) {
      throw new Error(`chain Id ${chainId} not supported`)
    }

    /*
      const web3 = new ethers.providers.Web3Provider({
          host:chainConfigs.chainInfo[chainId||4]?.rpcProvider
      }); */

    const web3 = new ethers.providers.AlchemyProvider(
      chainId || 4,
      process.env.REACT_APP_ALCHEMY_API_KEY,
    )
    return web3
    //return new ROContractCalls(web3, chainConfigs) as IROContractCalls
  }

  const connect = async (props?: {
    chainId?: string
  }) => {
    const { chainId } = props || {}

    try {
      console.log('web3 connect called')

      const chainConfigs = await getChainConfigs()

      if ((window as any)?.ethereum) {
        console.log('web3 : connecting using injected')
        const caller = new InjectedWeb3()

        const {web3, account} = await caller.connect(chainConfigs, chainId||"4");

        return {web3, account};

        /*
        return new SignedContractCalls(
          await caller.connect(chainConfigs, chainId),
          chainConfigs,
        )
        */
      } else {
        // throw new Error("web3 : No injected Found");
        throw new Error('platform not supported')
      }
      // }

      /*
          const t = web3.getSigner().getAddress();
  
          const account = (await web3.getSigner())[0];
  
          if (account != web3AccountRef.current) {
              web3AccountRef.current = account;
              setWeb3Account(web3AccountRef.current);
          }
          */
    } catch (error: any) {
      console.error(`failed to connect to web3 :${error}`)
      throw error
    }
  }

  const connectCtx = useMemo(
    () => ({
      connect,
      readOnlyWeb3,
      //    getchainConfigs,
      //signingProviders,
      //    setWeb3Account
    }),
    [],
  )

  return { connectCtx /*, web3Account, chainConfigs */ }
}
