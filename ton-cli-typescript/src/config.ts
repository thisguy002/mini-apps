import * as envEnc from '@chainlink/env-enc';
import { Network } from './types/index.js';

envEnc.config();

// ── Helpers ────────────────────────────────────────────────────────────────

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

function optionalEnv(key: string): string | undefined {
  return process.env[key] || undefined;
}

// ── Config ─────────────────────────────────────────────────────────────────

export const config = {
  defaultNetwork: 'testnet' as Network,

  networks: {
    testnet: {
      url: 'https://testnet.toncenter.com',
      globalId: -3,
      get apiKey() { return requireEnv('TESTNET_API_KEY'); },
    },
    mainnet: {
      url: 'https://toncenter.com',
      globalId: -239,
      get apiKey() { return requireEnv('MAINNET_API_KEY'); },
    },
  },

  wallet: {
    workchain: 0 as const,
    minDeployValue: '0.005',
    get mnemonic() { return optionalEnv('WALLET_MNEMONIC'); },
  },

  tonapi: {
    mainnet: 'https://tonapi.io',
    testnet: 'https://testnet.tonapi.io',
    get apiKey() { return optionalEnv('TONAPI_KEY'); },
  },

  polling: {
    attempts: 30,
    intervalMs: 5_000,
  },

  display: {
    nanoton: 1_000_000_000n,
    dividerWidth: 60,
  },
} as const;
