/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { ethers } from 'ethers';
import Fortmatic from 'fortmatic';
import { shallowRef, watchEffect } from 'vue';

interface Web3Provider {
  selectedAddress?: string;
  enable(): Promise<string[]>;
  send<T>(
    payload: { method: string; params?: Array<any> },
    callback: (error: any, response: T) => void
  ): void;
  on?: (
    event: 'accountsChanged' | 'chainChanged' | 'disconnect',
    fn: (account: string[]) => void
  ) => void;
  removeListener?: (
    event: 'accountsChanged',
    fn?: (account: string[]) => void
  ) => void;
}

interface MetaMaskProvider extends Web3Provider {
  isMetaMask: true;
}

export interface ProviderData {
  enable?: () => Promise<void>;
  accounts: string[];
  provider?: ethers.providers.Provider;
  isReloadNeeded?: true;
  sendEth?(receiver: string, amount: number): Promise<string>;
}

// Access to windows.ethereum (MetaMask)
const ethereum = (window as any).ethereum as MetaMaskProvider | undefined;

export function getWeb3Provider(): Web3Provider {
  if (ethereum) {
    console.debug('[Ethers] Using MetaMask');
    return ethereum;
  } else {
    const fortmatic = new Fortmatic('pk_test_020AE141CA2B2D02', 'ropsten');
    console.debug('[Ethers] Using Fortmatic');
    return fortmatic.getProvider();
  }
}

export function useEthers() {
  const data = shallowRef<ProviderData>({ accounts: [] });

  function reject() {
    data.value = { isReloadNeeded: true, accounts: [] };
  }

  watchEffect((onInvalidate) => {
    const run = async () => {
      const nativeProvider = getWeb3Provider();
      const provider = new ethers.providers.Web3Provider(nativeProvider);

      async function sendEth(receiver: string, amount: number) {
        console.log(
          `payWithMetamask(receiver=${receiver}, strEther=${amount})`
        );

        // Acccounts now exposed
        const params = [
          {
            from: await provider.getSigner().getAddress(),
            to: receiver,
            value: ethers.utils
              .parseUnits(amount.toString(), 'ether')
              .toHexString(),
          },
        ];

        const transactionHash = (await provider.send(
          'eth_sendTransaction',
          params
        )) as string;
        console.log(`transactionHash is ${transactionHash}`);
        // return provider.getSigner().sendTransaction(params);
        return transactionHash;
      }

      const enable = async () => {
        console.debug('[Ethers] Enable wallet: ', nativeProvider);
        await nativeProvider.enable();
        data.value = {
          provider,
          accounts: await provider.listAccounts(),
          sendEth,
        };
      };

      if (nativeProvider.selectedAddress) {
        await enable();
      } else {
        data.value = { enable, accounts: [] };
      }

      if (nativeProvider.on) {
        const onAccountsChange = (accounts: string[]) => {
          console.debug(
            '[Ethers] onAccountsChanged',
            accounts,
            nativeProvider.removeListener
          );
          data.value = {
            provider,
            accounts,
            sendEth,
          };
        };
        nativeProvider.on('accountsChanged', onAccountsChange);
        nativeProvider.on('chainChanged', reject);
        nativeProvider.on('disconnect', reject);

        onInvalidate(() => {
          nativeProvider.removeListener?.('accountsChanged', onAccountsChange);
        });
      }
    };
    void run();
  });

  return data;
}
