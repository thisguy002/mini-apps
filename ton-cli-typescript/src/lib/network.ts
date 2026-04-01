import { Network } from '../types/index.js';

export function resolveNetwork(value: unknown): Network {
  return value === 'mainnet' ? 'mainnet' : 'testnet';
}

export function parseLimitOption(value: string | undefined, fallback: number, max = 100): number {
  if (value === undefined) return fallback;
  const n = parseInt(value, 10);
  if (isNaN(n) || n < 1) return fallback;
  return Math.min(n, max);
}
