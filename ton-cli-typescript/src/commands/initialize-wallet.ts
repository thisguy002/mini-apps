import { mnemonicToPrivateKey } from '@ton/crypto';
import { internal, SendMode, toNano } from '@ton/core';
import { WalletContractV5R1 } from '@ton/ton';
import { getTonClient } from '../lib/clients.js';
import { resolveNetwork } from '../lib/network.js';
import { resolveMnemonic, parseMnemonic } from '../lib/mnemonic.js';
import { formatAddress, formatAddressBounceable } from '../lib/address.js';
import { explorerAddress, formatTon } from '../lib/format.js';
import { sleep } from '../lib/sleep.js';
import { config } from '../config.js';
import { InitializeWalletOptions } from '../types/index.js';

export async function initializeWallet(opts: InitializeWalletOptions): Promise<void> {
  const network  = resolveNetwork(opts.network);
  const raw      = resolveMnemonic(opts.mnemonic);
  const words    = await parseMnemonic(raw);
  const keyPair  = await mnemonicToPrivateKey(words);
  const wallet   = WalletContractV5R1.create({
    workchain: 0,
    publicKey: keyPair.publicKey,
    walletId: { networkGlobalId: config.networks[network].globalId },
  });
  const client   = getTonClient(network);
  const contract = client.open(wallet);

  const address    = formatAddress(wallet.address, network);
  const bounceable = formatAddressBounceable(wallet.address, network);

  console.log(`\nNetwork     : ${network}`);
  console.log(`Address     : ${address}`);
  console.log(`Bounceable  : ${bounceable}`);
  console.log(`Explorer    : ${explorerAddress(network, address)}\n`);

  const currentSeqno = await contract.getSeqno().catch(() => 0);
  if (currentSeqno > 0) {
    console.log('✅ Wallet already active.');
    return;
  }

  let balance = await client.getBalance(wallet.address).catch(() => 0n);

  if (balance === 0n) {
    console.log('No balance detected. Fund this address first:\n');
    console.log('  https://t.me/testgiver_ton_bot\n');
    process.stdout.write('Waiting for funds');
    while (balance === 0n) {
      await sleep(config.polling.intervalMs);
      balance = await client.getBalance(wallet.address).catch(() => 0n);
      process.stdout.write('.');
    }
    console.log();
  }

  console.log(`Balance     : ${formatTon(balance)} TON`);
  console.log('Initializing...');

  await contract.sendTransfer({
    seqno: 0,
    secretKey: keyPair.secretKey,
    sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
    messages: [
      internal({
        to: wallet.address,
        value: toNano(config.wallet.minDeployValue),
        bounce: false,
      }),
    ],
  });

  let seqno = 0;
  process.stdout.write('Confirming...');
  while (seqno === 0) {
    await sleep(config.polling.intervalMs);
    seqno = await contract.getSeqno().catch(() => 0);
    process.stdout.write('.');
  }

  console.log(`\n✅ Wallet initialized! Seqno: ${seqno}`);
}