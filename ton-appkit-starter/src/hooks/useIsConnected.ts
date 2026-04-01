import { useTonWallet } from '@tonconnect/ui-react';

export function useIsConnected(): boolean {
  return useTonWallet() !== null;
}