import { ChakraProvider } from '@chakra-ui/react';
import { Web3ReactProvider } from '@web3-react/core';
import { providers } from 'ethers';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { InjectedProvider } from 'lib/contexts/InjectedProviderContexts';

// fonts
import '@fontsource/raleway/latin.css';
import '@fontsource/inter/latin.css';

import App from './App';
import { theme } from './lib/styles/customTheme';

const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;

function getLibrary(): providers.AlchemyProvider {
  return new providers.AlchemyProvider('maticmum', ALCHEMY_API_KEY);
}

ReactDOM.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <InjectedProvider>
          <App />
        </InjectedProvider>
      </Web3ReactProvider>
    </ChakraProvider>
  </StrictMode>,
  document.getElementById('root'),
);
