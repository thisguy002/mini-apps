import { Network } from '@ton/appkit-react';

const env = import.meta.env;

// -----------
// NETWORK
// -----------

export const TONCENTER_API_KEY = env.VITE_TONCENTER_API_KEY as string | undefined;
export const NETWORK = Network.testnet();
export const TONCENTER_BASE_URL = 'https://testnet.toncenter.com';
export const TONSCAN_BASE_URL = 'https://testnet.tonscan.org';
export const NETWORK_LABEL = NETWORK.chainId === '-3' ? 'Testnet' : 'Mainnet';
export const IS_TESTNET = NETWORK.chainId === '-3';

// -------------
// TON CONNECT
// -------------

export const MANIFEST_URL = env.VITE_MANIFEST_URL as string ?? 'https://tonconnect-sdk-demo-dapp.vercel.app/tonconnect-manifest.json';

// ---------
// BALANCE
// ---------

export const BALANCE_POLL_INTERVAL_MS = 10_000;
export const TON_DECIMALS = 9;

// -------------
// ENVIRONMENT
// -------------

export const IS_TMA = Boolean(
  typeof window !== 'undefined' &&
  window.Telegram?.WebApp?.initData
);