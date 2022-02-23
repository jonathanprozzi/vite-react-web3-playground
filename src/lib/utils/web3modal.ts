import WalletConnectProvider from "@walletconnect/web3-provider";

import { chainByID, chainByNetworkId } from "./chain";

declare let window: any;
const isInjected = () => window.ethereum?.chainId;

export const attemptInjectedChainData = () =>
  isInjected() ? chainByID(window.ethereum?.chainId) : chainByID("0x1");

const addNetworkProviders = (chainData: any) => {
  const allProviders: any = {};
  if (!chainData) {
    // this will fire if window.ethereum exists, but the user is on the wrong chain
    return false;
  }
  const providersToAdd = chainData.providers;
  if (providersToAdd.includes("walletconnect")) {
    allProviders.walletconnect = {
      network: chainData.network,
      package: WalletConnectProvider,
      options: {
        rpc: {
          1: `https://mainnet.infura.io/v3/${process.env.RPC_KEY}`,
          4: `https://rinkeby.infura.io/v3/${process.env.RPC_KEY}`,
          42: `https://kovan.infura.io/v3/${process.env.RPC_KEY}`,
          100: "https://dai.poa.network",
          137: "https://rpc-mainnet.maticvigil.com",
        },
      },
    };
  }
  // if (providersToAdd.includes('portis')) {
  //   allProviders.portis = {
  //     package: Portis,
  //     options: {
  //       id: process.env.REACT_APP_PORTIS_ID || '',
  //     },
  //   };
  // }
  // if (providersToAdd.includes('fortmatic')) {
  //   allProviders.fortmatic = {
  //     package: Fortmatic, // required
  //     options: {
  //       key: process.env.REACT_APP_FORTMATIC_KEY || '', // required
  //     },
  //   };
  // }
  return allProviders;
};

export const getProviderOptions = () =>
  addNetworkProviders(attemptInjectedChainData());

export const deriveChainId = (provider: any) => {
  if (provider.isMetaMask) {
    return provider.chainId;
  }
  if (provider.wc) {
    return chainByNetworkId(provider.chainId).chain_id;
  }
  // else if (provider.isPortis) {
  //   return chainByNetworkId(provider._portis.config.network.chainId).chain_id;
  // }
  return null;
};

export const deriveSelectedAddress = (provider: any) => {
  if (provider.isMetaMask) {
    return provider.selectedAddress;
  }
  if (provider.wc) {
    return provider.accounts[0];
  }
  // else if (provider.isPortis) {
  //   return provider._portis._selectedAddress;
  // }
  return null;
};
