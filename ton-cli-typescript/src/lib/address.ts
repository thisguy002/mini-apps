import { Address } from '@ton/core';
import { Network } from '../types/index.js';

export interface FormattedAddress {
  nonBounceable: string;
  bounceable: string;
  raw: Address;
}

export function parseAddress(input: string): Address {
  try {
    return Address.parse(input);
  } catch {
    throw new Error(`Invalid TON address: "${input}"`);
  }
}

export function formatAddress(address: Address, network: Network): string {
  return address.toString({ bounceable: false, testOnly: network === 'testnet' });
}

export function formatAddressBounceable(address: Address, network: Network): string {
  return address.toString({ bounceable: true, testOnly: network === 'testnet' });
}

export function parseAndFormat(input: string, network: Network): FormattedAddress {
  const raw = parseAddress(input);
  return {
    raw,
    nonBounceable: formatAddress(raw, network),
    bounceable: formatAddressBounceable(raw, network),
  };
}
