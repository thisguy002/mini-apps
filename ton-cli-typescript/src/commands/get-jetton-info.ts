import { getTonApiClient } from '../lib/clients.js';
import { resolveNetwork } from '../lib/network.js';
import { parseAddress, formatAddressBounceable } from '../lib/address.js';
import { explorerAddress, formatTokenAmount, printDivider } from '../lib/format.js';
import { GetJettonInfoOptions } from '../types/index.js';

export async function getJettonInfo(opts: GetJettonInfoOptions): Promise<void> {
  if (!opts.address) throw new Error('Provide --address <jetton minter or wallet address>.');

  const network = resolveNetwork(opts.network);
  const parsed  = parseAddress(opts.address);
  const client  = getTonApiClient(network);

  // Try minter first — fall back to wallet (shows all owned jettons)
  try {
    const jetton   = await client.jettons.getJettonInfo(parsed);
    const minter   = formatAddressBounceable(jetton.metadata.address, network);
    const admin    = jetton.admin?.address
      ? jetton.admin.address.toString({ bounceable: false, testOnly: network === 'testnet' })
      : 'renounced';
    const decimals = Number(jetton.metadata.decimals ?? 9);
    const supply   = formatTokenAmount(BigInt(jetton.totalSupply), decimals, decimals);
    const mintable = jetton.mintable ? 'Yes' : 'No (fixed supply)';

    console.log('\nJetton Info');
    printDivider();
    console.log(`   Name      : ${jetton.metadata.name}`);
    console.log(`   Symbol    : ${jetton.metadata.symbol}`);
    console.log(`   Decimals  : ${decimals}`);
    console.log(`   Supply    : ${Number(supply).toLocaleString()} ${jetton.metadata.symbol}`);
    console.log(`   Mintable  : ${mintable}`);
    console.log(`   Admin     : ${admin}`);
    console.log(`   Minter    : ${minter}`);
    if (jetton.metadata.description) console.log(`   Desc      : ${jetton.metadata.description}`);
    if (jetton.metadata.image)       console.log(`   Image     : ${jetton.metadata.image}`);
    console.log(`   Holders   : ${jetton.holdersCount.toLocaleString()}`);
    printDivider();
    console.log(`   Explorer  : ${explorerAddress(network, minter)}`);

  } catch {
    // Not a minter address — show all jettons owned by this wallet
    const res = await client.accounts.getAccountJettonsBalances(parsed);

    if (!res.balances.length) {
      console.log('\nNo jettons found for this address.');
      return;
    }

    console.log(`\nJettons owned by ${opts.address}`);
    printDivider();

    for (const bal of res.balances) {
      const decimals = bal.jetton.decimals ?? 9;
      const amount   = formatTokenAmount(BigInt(bal.balance), decimals, 2);
      const minter   = formatAddressBounceable(bal.jetton.address, network);
      console.log(`   ${(bal.jetton.symbol ?? '?').padEnd(10)} ${Number(amount).toLocaleString().padStart(20)}  ${bal.jetton.name ?? ''}`);
      console.log(`              Minter : ${minter}`);
      console.log(`              Link   : ${explorerAddress(network, minter)}`);
    }

    printDivider();
  }
}
