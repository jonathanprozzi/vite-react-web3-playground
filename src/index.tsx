import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { InjectedProvider } from 'lib/contexts/InjectedProviderContexts';

// fonts
import '@fontsource/raleway/latin.css';
import '@fontsource/inter/latin.css';

import App from './App';
import { theme } from './lib/styles/customTheme';

ReactDOM.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <InjectedProvider>
        <App />
      </InjectedProvider>
    </ChakraProvider>
  </StrictMode>,
  document.getElementById('root'),
);
