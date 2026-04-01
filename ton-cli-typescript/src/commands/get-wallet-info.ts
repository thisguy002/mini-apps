import { getTonClient } from '../lib/clients.js';
import { resolveNetwork } from '../lib/network.js';
import { parseAddress, formatAddress, formatAddressBounceable } from '../lib/address.js';
import { explorerAddress, formatTon, printDivider } from '../lib/format.js';
import { GetWalletInfoOptions } from '../types/index.js';

export async function getWalletInfo(opts: GetWalletInfoOptions): Promise<void> {
  if (!opts.address) throw new Error('Provide --address <TON address>.');

  const network  = resolveNetwork(opts.network);
  const parsed   = parseAddress(opts.address);
  const address  = formatAddress(parsed, network);
  const bouncy   = formatAddressBounceable(parsed, network);
  const client   = getTonClient(network);
  const state    = await client.getContractState(parsed);

  const lastTxHash = state.lastTransaction?.hash ?? 'none';
  const lastTxLt   = state.lastTransaction?.lt   ?? 'none';

  console.log('\nWallet Info');
  printDivider();
  console.log(`Network     : ${network}`);
  console.log(`Status      : ${state.state}`);
  console.log(`Balance     : ${formatTon(state.balance)} TON`);
  console.log(`Address     : ${address}`);
  console.log(`Bounceable  : ${bouncy}`);
  console.log(`Last Tx Hash: ${lastTxHash}`);
  console.log(`Last Tx Lt  : ${lastTxLt}`);
  console.log(`Explorer    : ${explorerAddress(network, address)}`);
  printDivider();
}
