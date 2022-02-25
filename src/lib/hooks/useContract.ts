import { useMemo } from 'react';
import { Contract } from 'ethers';

import AdventureBadgeJson from '../contstants/AdventureBadge.json';
import { getContract } from '../utils';
import { useInjectedProvider } from './../contexts/InjectedProviderContexts';
import { AdventureBadge } from '../typechain/AdventureBadge';

// returns null on errors
function useContract<T extends Contract = Contract>(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true,
): T | null {
  const { provider, address: userAddress } = useInjectedProvider();

  return useMemo(() => {
    if (!address || !ABI || !provider) return null;
    try {
      return getContract(
        address,
        ABI,
        provider,
        withSignerIfPossible && userAddress ? userAddress : undefined,
      );
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [address, ABI, provider, withSignerIfPossible, userAddress]) as T | null;
}

export function useAdventureBadgeContract(
  contractAddress: string,
  withSignerIfPossible?: boolean,
): AdventureBadge | null {
  return useContract(
    contractAddress,
    AdventureBadgeJson.abi,
    withSignerIfPossible,
  );
}
