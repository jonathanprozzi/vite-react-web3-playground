import * as React from 'react';
import { useState, useEffect, useContext, createContext, useRef } from 'react';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import { useQuery } from '@apollo/client';
import { supportedChains } from '../utils/chain';
import {
  deriveChainId,
  deriveSelectedAddress,
  getProviderOptions,
} from '../utils/web3modal';

export const InjectedProviderContext: any = createContext(null);

interface InjectedProviderProps {
  children: any;
}

export const InjectedProvider: React.FC<InjectedProviderProps> = ({
  children,
}: InjectedProviderProps) => {
  const [injectedProvider, setInjectedProvider] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [injectedChain, setInjectedChain] = useState<any>(null);
  const [web3Modal, setWeb3Modal] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  const hasListeners: any = useRef(null);

  const connectProvider = async () => {
    const providerOptions = getProviderOptions();

    const defaultModal = new Web3Modal({
      providerOptions: getProviderOptions(),
      cacheProvider: true,
      theme: 'dark',
    });

    if (!providerOptions) {
      setInjectedProvider(null);
      setAddress(null);
      setWeb3Modal(defaultModal);
      window.localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
      return;
    }

    const localWeb3Modal = new Web3Modal({
      providerOptions,
      cacheProvider: true,
      theme: 'dark',
    });

    const provider = await localWeb3Modal.connect();
    provider.selectedAddress = deriveSelectedAddress(provider);
    const chainId = deriveChainId(provider);

    const chain = {
      ...supportedChains[chainId],
      chainId,
    };

    const web3: any = new Web3(provider);
    if (web3?.currentProvider?.selectedAddress) {
      setInjectedProvider(web3);
      setAddress(web3.currentProvider.selectedAddress);
      setInjectedChain(chain);
      setWeb3Modal(localWeb3Modal);
    }
  };

  useEffect(() => {
    if (window.localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER')) {
      connectProvider();
    }
  }, []);

  useEffect(() => {
    const handleChainChange = () => {
      console.log('CHAIN CHANGE');
      connectProvider();
    };
    const accountsChanged = () => {
      console.log('ACCOUNT CHANGE');
      connectProvider();
    };

    const unsub = () => {
      if (injectedProvider?.currentProvider) {
        injectedProvider.currentProvider.removeListener(
          'accountsChanged',
          accountsChanged,
        );
        injectedProvider.currentProvider.removeListener(
          'chainChanged',
          handleChainChange,
        );
      }
    };

    if (injectedProvider?.currentProvider && !hasListeners.current) {
      injectedProvider.currentProvider
        .on('accountsChanged', accountsChanged)
        .on('chainChanged', handleChainChange);
      hasListeners.current = true;
    }
    return () => unsub();
  }, [injectedProvider]);

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
        injectedChain,
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
    injectedChain,
    address,
    web3Modal,
    setUserData,
    userData,
  } = useContext(InjectedProviderContext);
  return {
    injectedProvider,
    requestWallet,
    disconnectDapp,
    injectedChain,
    web3Modal,
    address,
    setUserData,
    userData,
  };
};
