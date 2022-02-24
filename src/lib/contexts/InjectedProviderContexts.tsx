import * as React from 'react';
import { useState, useEffect, useContext, createContext, useRef } from 'react';
import { ethers, providers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { NetworkConnector } from '@web3-react/network-connector';
import Web3Modal from 'web3modal';
import { getProviderOptions } from '../utils/web3modal';

export const InjectedProviderContext: any = createContext(null);
// TODO: Change network on env (prod should use Polygon prod - chain id 137)
export const network = new NetworkConnector({
  urls: {
    80001: `https://polygon-mumbai.g.alchemy.com/v2/${
      import.meta.env.VITE_ALCHEMY_API_KEY
    }`,
  },
  defaultChainId: 80001,
});
interface InjectedProviderProps {
  children: any;
}

export const InjectedProvider: React.FC<InjectedProviderProps> = ({
  children,
}: InjectedProviderProps) => {
  const { activate, account, connector, chainId, library } = useWeb3React();
  const [web3ModalConnection, setWeb3ModalConnection] = useState<any>();
  const [
    injectedProvider,
    setInjectedProvider,
  ] = useState<providers.Web3Provider | null>(null);
  const [address, setAddress] = useState<any>(null);
  const [web3Modal, setWeb3Modal] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  const hasListeners: any = useRef(null);

  const connectProvider = async () => {
    const providerOptions = getProviderOptions();
    const modal = new Web3Modal({
      providerOptions,
      cacheProvider: true,
      theme: 'dark',
    });

    if (!providerOptions) {
      setInjectedProvider(null);
      setAddress(null);
      window.localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
      return;
    }

    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();

    setWeb3Modal(modal);
    setWeb3ModalConnection(connection);
    setInjectedProvider(provider);
    setAddress(signerAddress);
  };

  useEffect(() => {
    if (window.localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER')) {
      connectProvider();
    }

    if (activate) {
      activate(network);
    }
  }, []);

  useEffect(() => {
    // can change this to view status of nft (if can claim, already claimed, etc.)
    async function getBlock(provider: providers.AlchemyProvider) {
      console.log(await provider.getBlockNumber());
    }

    if (library) {
      getBlock(library);
    }
  }, [chainId, account, library]);

  useEffect(() => {
    const handleChainChange = (chainId: number) => {
      console.log(`CHAIN CHANGE: ${chainId}`);
      connectProvider();
    };
    const handleAccountsChange = (accounts: string[]) => {
      console.log(`ACCOUNT CHANGE: ${accounts}`);
      connectProvider();
    };

    if (web3ModalConnection && !hasListeners.current) {
      web3ModalConnection.on('accountsChanged', handleAccountsChange);
      web3ModalConnection.on('chainChanged', handleChainChange);
      hasListeners.current = true;
    }
    return () => {
      if (web3ModalConnection) {
        web3ModalConnection.removeAllListeners([
          'accountsChanged',
          'chainChanged',
        ]);
      }
    };
  }, [web3ModalConnection]);

  const requestWallet = async () => {
    connectProvider();
  };

  const disconnectDapp = async () => {
    const defaultModal = new Web3Modal({
      providerOptions: getProviderOptions(),
      cacheProvider: true,
      theme: 'dark',
    });

    setInjectedProvider(null);
    setAddress(null);
    setWeb3Modal(defaultModal);
    web3Modal.clearCachedProvider();
  };

  return (
    <InjectedProviderContext.Provider
      value={{
        injectedProvider,
        requestWallet,
        disconnectDapp,
        address,
        web3Modal,
        setUserData,
        userData,
      }}
    >
      {children}
    </InjectedProviderContext.Provider>
  );
};

export const useInjectedProvider = () => {
  const {
    injectedProvider,
    requestWallet,
    disconnectDapp,
    address,
    web3Modal,
    setUserData,
    userData,
  } = useContext(InjectedProviderContext);
  return {
    injectedProvider,
    requestWallet,
    disconnectDapp,
    web3Modal,
    address,
    setUserData,
    userData,
  };
};
