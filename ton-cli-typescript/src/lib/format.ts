import { config } from '../config.js';
import { Network } from '../types/index.js';

const { dividerWidth, nanoton } = config.display;

// ── Dividers ───────────────────────────────────────────────────────────────

export const divider = () => '─'.repeat(dividerWidth);

// ── Nanoton conversion (BigInt-safe) ───────────────────────────────────────

/**
 * Convert nanotons to a display string using BigInt arithmetic.
 * Only converts to Number for the fractional remainder — safe for all real
 * TON amounts (max supply ~5B TON fits comfortably in Number for display).
 */
export function formatTon(nanotons: bigint | number | string, decimals = 4): string {
  const nano = BigInt(nanotons);
  const whole = nano / nanoton;
  const remainder = nano % nanoton;
  // Safe: remainder is always < 1e9 and whole fits in display range
  const fraction = Number(remainder) / Number(nanoton);
  return (Number(whole) + fraction).toFixed(decimals);
}

export function formatTokenAmount(
  raw: bigint | number | string,
  decimals: number,
  displayDecimals = 4,
): string {
  const divisor = BigInt(10 ** decimals);
  const value = BigInt(raw);
  const whole = value / divisor;
  const remainder = value % divisor;
  const fraction = Number(remainder) / Number(divisor);
  return (Number(whole) + fraction).toFixed(displayDecimals);
}

// ── Timestamp ──────────────────────────────────────────────────────────────

export function formatTimestamp(utime: number): string {
  return new Date(utime * 1000).toISOString().replace('T', ' ').slice(0, 19);
}

// ── Explorer URLs ──────────────────────────────────────────────────────────

export function explorerBase(network: Network): string {
  return `https://${network === 'testnet' ? 'testnet.' : ''}tonviewer.com`;
}

export function explorerTx(network: Network, hash: string): string {
  return `${explorerBase(network)}/transaction/${hash}`;
}

export function explorerAddress(network: Network, address: string): string {
  return `${explorerBase(network)}/${address}`;
}

// ── Console output helpers ─────────────────────────────────────────────────

export function printDivider(): void {
  console.log(divider());
}

export function printField(label: string, value: string, indent = 0): void {
  const pad = ' '.repeat(indent);
  console.log(`${pad}${label.padEnd(14)}: ${value}`);
}
