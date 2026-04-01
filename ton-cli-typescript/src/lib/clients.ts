import { TonClient } from '@ton/ton';
import { TonApiClient } from '@ton-api/client';
import { config } from '../config.js';
import { Network } from '../types/index.js';

/**
 * Returns a TonClient (toncenter JSON-RPC) for the given network.
 * Used for: wallet state, balance, seqno, sending transactions.
 */
export function getTonClient(network: Network): TonClient {
  const cfg = config.networks[network];
  return new TonClient({
    endpoint: `${cfg.url.replace(/\/$/, '')}/api/v2/jsonRPC`,
    apiKey: cfg.apiKey,
  });
}

/**
 * Returns a TonApiClient (tonapi.io) for the given network.
 * Used for: events, jettons, NFTs, decoded transaction data.
 *
 * Warns when TONAPI_KEY is absent — requests will be rate-limited.
 */
export function getTonApiClient(network: Network): TonApiClient {
  const apiKey = config.tonapi.apiKey;

  if (!apiKey) {
    console.warn(
      '⚠️  TONAPI_KEY is not set. Requests will be heavily rate-limited.\n' +
      '   Set TONAPI_KEY in .env.enc for reliable results.\n',
    );
  }

  return new TonApiClient({
    baseUrl: config.tonapi[network],
    apiKey,
  });
}