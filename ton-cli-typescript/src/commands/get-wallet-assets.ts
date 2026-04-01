import { getTonApiClient } from '../lib/clients.js';
import { resolveNetwork, parseLimitOption } from '../lib/network.js';
import { parseAddress, formatAddress } from '../lib/address.js';
import { explorerAddress, formatTokenAmount, printDivider } from '../lib/format.js';
import { GetWalletAssetsOptions } from '../types/index.js';

const DEFAULT_LIMIT = 10;

export async function getWalletAssets(opts: GetWalletAssetsOptions): Promise<void> {
  if (!opts.address) throw new Error('Provide --address <TON address>.');

  const network      = resolveNetwork(opts.network);
  const parsed       = parseAddress(opts.address);
  const address      = formatAddress(parsed, network);
  const sharedLimit  = parseLimitOption(opts.limit, DEFAULT_LIMIT);
  const jettonsLimit = parseLimitOption(opts.jettonsLimit, sharedLimit);
  const nftLimit     = parseLimitOption(opts.nftLimit, sharedLimit);
  const client       = getTonApiClient(network);

  console.log(`\nWallet Assets — ${address}`);
  console.log(`Network: ${network}`);

  const [jettonsRes, nftsRes] = await Promise.all([
    client.accounts.getAccountJettonsBalances(parsed).catch(() => ({ balances: [] })),
    client.accounts.getAccountNftItems(parsed).catch(() => ({ nftItems: [] })),
  ]);

  // ── Jettons ──────────────────────────────────────────────────────────────
  console.log('\n── Jettons ' + '─'.repeat(41));

  if (!jettonsRes.balances.length) {
    console.log('  No jettons found.');
  } else {
    const total   = jettonsRes.balances.length;
    const jettons = jettonsRes.balances.slice(0, jettonsLimit);

    for (const j of jettons) {
      const decimals = j.jetton.decimals ?? 9;
      const amount   = formatTokenAmount(BigInt(j.balance), decimals, 2);
      const minter   = j.jetton.address.toString({ bounceable: true, testOnly: network === 'testnet' });
      console.log(`  ${(j.jetton.symbol ?? 'UNKNOWN').padEnd(10)} ${amount.padStart(18)}  ${j.jetton.name ?? ''}`);
      console.log(`    Minter  : ${minter}`);
      console.log(`    Link    : ${explorerAddress(network, minter)}`);
    }

    if (total > jettonsLimit) console.log(`  ... and ${total - jettonsLimit} more`);
  }

  // ── NFTs ──────────────────────────────────────────────────────────────────
  console.log('\n── NFTs ' + '─'.repeat(44));

  if (!nftsRes.nftItems.length) {
    console.log('  No NFTs found.');
  } else {
    const total = nftsRes.nftItems.length;
    const nfts  = nftsRes.nftItems.slice(0, nftLimit);

    for (const nft of nfts) {
      const name       = nft.metadata?.name ?? 'Unnamed NFT';
      const collection = nft.collection?.name ?? '';
      console.log(`  ${name}`);
      if (collection) console.log(`    Collection : ${collection}`);
      console.log(`    Address    : ${nft.address}`);
    }

    if (total > nftLimit) console.log(`  ... and ${total - nftLimit} more`);
  }

  printDivider();
}
