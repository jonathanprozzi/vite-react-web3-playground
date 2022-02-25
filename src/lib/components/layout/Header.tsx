import { useEffect, useState } from 'react';
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
import { useAdventureBadgeContract } from 'lib/hooks/useContract';
import { truncateAddress } from '../../utils/helpers';

import ThemeToggle from './ThemeToggle';

const Header = () => {
  const {
    address,
    provider,
    signer,
    requestWallet,
    disconnectDapp,
    userData,
  } = useInjectedProvider();
  const adventureBadgeContract = useAdventureBadgeContract(
    // FIXME: Replace in env (address where AdventureBadge.sol is deployed)
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    true,
  );
  const [tokenId, setTokenId] = useState<number>(0);

  const handleDisconnect = () => {
    disconnectDapp();
  };

  const handleConnect = () => {
    requestWallet();
  };
  const copyAddress = useClipboard(address);

  async function mintBadge(id: number) {
    try {
      if (id > 0) {
        console.log(id);
        const tx = await adventureBadgeContract?.mint(id, 1, []);
        console.log(tx);
        const receipt = await tx?.wait();
        console.log(receipt);
      } else {
        console.log(`${address} is unable to mint`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function getSomeData() {
      const level =
        (await adventureBadgeContract?.addressToTokenId(address)) || 0;
      const alreadyMinted = await adventureBadgeContract?.addressAlreadyMinted(
        address,
      );
      setTokenId(level);
      console.log(`level: ${level}`);
      console.log(`already minted: ${alreadyMinted}`);
    }
    if (provider && signer && adventureBadgeContract) {
      console.log(adventureBadgeContract);
      getSomeData();
    }
  }, [provider, signer, adventureBadgeContract]);

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
              {provider && signer ? (
                <Button onClick={() => mintBadge(tokenId)}>Mint</Button>
              ) : null}
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
