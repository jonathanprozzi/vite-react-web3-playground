import {
  Box,
  Flex,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Icon,
  useClipboard,
} from '@chakra-ui/react';
import {
  FaCopy,
  FaRegSun,
  FaCaretDown,
  FaRegTimesCircle,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useInjectedProvider } from '../../contexts/InjectedProviderContexts';
import { truncateAddress } from '../../utils/helpers';

import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { address, requestWallet, disconnectDapp, userData } =
    useInjectedProvider();
  const handleDisconnect = () => {
    disconnectDapp();
  };

  const handleConnect = () => {
    requestWallet();
  };
  const copyAddress = useClipboard(address);

  return (
    <Flex
      as='header'
      width='full'
      align='center'
      alignSelf='flex-start'
      justifyContent='center'
      gridGap={2}
    >
      <Link to='/'>
        <Heading as='h1' size='sm'>
          vite-react-chakra-starter
        </Heading>
      </Link>
      <HStack>
        {address ? (
          <>
            <Menu offset={[0, 5]} placement='bottom-end'>
              <MenuButton
                as={Button}
                rightIcon={<Icon as={FaCaretDown} color='raid' />}
                borderRadius='md'
                borderWidth='1px'
                color='whiteAlpha.900'
                borderColor='raid'
                paddingX={4}
              >
                {userData?.member?.ensName
                  ? userData?.member?.ensName
                  : truncateAddress(address)}
              </MenuButton>
              <MenuList backgroundColor='gray.800' minWidth='none'>
                <MenuItem onClick={() => console.log('hi')}>
                  <HStack spacing={2}>
                    <Icon as={FaRegSun} />
                    <Box>Profile</Box>
                  </HStack>
                </MenuItem>
                <MenuItem onClick={copyAddress.onCopy}>
                  <HStack spacing={2}>
                    <Icon as={FaCopy} />
                    <Box>
                      {copyAddress.hasCopied ? 'Copied' : 'Copy Address'}
                    </Box>
                  </HStack>
                </MenuItem>
                <MenuItem onClick={handleDisconnect}>
                  <HStack spacing={2}>
                    <Icon as={FaRegTimesCircle} color='red.300' />
                    <Box color='red.300'>Sign Out</Box>
                  </HStack>
                </MenuItem>
              </MenuList>
            </Menu>
          </>
        ) : (
          <Button
            variant='outline'
            color='whiteAlpha.900'
            borderColor='raid'
            onClick={handleConnect}
          >
            Connect
          </Button>
        )}
      </HStack>
      <Box marginLeft='auto'>
        <ThemeToggle />
      </Box>
    </Flex>
  );
};

export default Header;
