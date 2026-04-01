import { TONSCAN_BASE_URL, TONCENTER_API_KEY, TONCENTER_BASE_URL } from '@/utils/constants';

// -------
// AMOUNT
// -------

// Formats a fractional TON balance string for display (e.g. "1.5" → "1.50")
export function formatBalance(balance: string | undefined): string {
  if (!balance) return '0.00';
  const num = parseFloat(balance);
  return isNaN(num) ? '0.00' : num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

// -------
// ADDRESS
// -------

// Shortens a TON address for display (e.g. "UQAb...x9Kf")
export function shortenAddress(address: string): string {
  if (!address) return '';
  return address.slice(0, 6) + '...' + address.slice(-4);
}

// Returns a Tonscan explorer URL for a given wallet address
export function getAddressExplorerUrl(address: string): string {
  return TONSCAN_BASE_URL + '/address/' + address;
}

// Returns the wallet app name from device info, with a fallback
export function getWalletName(device?: { appName?: string }): string {
  return device?.appName ?? 'TON Wallet';
}

// -------
// NETWORK
// -------

// Returns a human-readable network label — Testnet ("-3") or Mainnet ("-239")
export function getNetworkLabel(chain: string): string {
  return chain === '-3' ? 'Testnet' : 'Mainnet';
}

// Returns badge styles for the network label — yellow for testnet, green for mainnet
export function getNetworkStyle(chain: string): { background: string; color: string } {
  return chain === '-3'
    ? { background: 'rgba(245,166,35,0.15)', color: 'var(--tg-warning)' }
    : { background: 'rgba(49,181,69,0.15)', color: 'var(--tg-success)' };
}

// -------
// POLLING
// -------

// Polls a function at a fixed interval until it returns true or max attempts is reached
// Returns a cleanup function to cancel polling early
export function pollFor(
  fn: () => Promise<boolean>,
  intervalMs: number,
  maxAttempts: number,
  onDone: () => void,
): () => void {
  let attempts = 0;
  const interval = setInterval(async () => {
    attempts++;
    const done = await fn();
    if (done || attempts >= maxAttempts) {
      clearInterval(interval);
      onDone();
    }
  }, intervalMs);
  return () => clearInterval(interval);
}

// ---
// API
// ---

// Fetches the most recent transaction hash for a given wallet address via TonCenter API
// Uses raw fetch instead of @ton/ton SDK to avoid a heavy dependency for a single call
// Returns null on failure or if no transactions are found
export async function fetchLatestTxHash(address: string): Promise<string | null> {
  const apiKey = TONCENTER_API_KEY ? '&api_key=' + TONCENTER_API_KEY : '';
  const url = TONCENTER_BASE_URL + '/api/v3/transactions?account=' + address + '&limit=5&sort=desc' + apiKey;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.transactions?.length > 0) {
      return data.transactions[0].hash as string;
    }
  } catch {
    // silent fail — polling will retry
  }
  return null;
}

// ------
// ERRORS
// ------

// Maps raw TON Connect SDK error messages to human-readable strings
export function parseTxError(error: Error): string {
  const msg = error.message;
  if (msg.includes('UserRejectsError') || msg.includes('User rejects')) return 'Transaction cancelled';
  if (msg.includes("Wrong 'address' format")) return 'Invalid recipient address';
  if (msg.includes('validation failed')) return 'Invalid transaction details';
  if (msg.includes('insufficient funds')) return 'Insufficient balance';
  return 'Something went wrong';
}