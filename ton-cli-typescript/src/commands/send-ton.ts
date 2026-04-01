import { beginCell, internal, SendMode, toNano } from '@ton/core';
import { WalletContractV5R1 } from '@ton/ton';
import { mnemonicToPrivateKey } from '@ton/crypto';
import { getTonClient } from '../lib/clients.js';
import { resolveNetwork } from '../lib/network.js';
import { resolveMnemonic, parseMnemonic } from '../lib/mnemonic.js';
import { parseAddress, formatAddress } from '../lib/address.js';
import { explorerTx, explorerAddress, printDivider } from '../lib/format.js';
import { sleep } from '../lib/sleep.js';
import { config } from '../config.js';
import { SendTonOptions } from '../types/index.js';

export async function sendTon(opts: SendTonOptions): Promise<void> {
  if (!opts.to)     throw new Error('Provide --to <destination address>.');
  if (!opts.amount) throw new Error('Provide --amount <TON amount>.');

  const amount = parseFloat(opts.amount);
  if (isNaN(amount) || amount <= 0) {
    throw new Error(`Invalid amount: "${opts.amount}". Must be a positive number.`);
  }

  const network  = resolveNetwork(opts.network);
  const dest     = parseAddress(opts.to);
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

  const fromAddr = formatAddress(wallet.address, network);
  const toAddr   = formatAddress(dest, network);

  console.log(`\nSending TON on ${network}...`);
  printDivider();
  console.log(`From    : ${fromAddr}`);
  console.log(`To      : ${toAddr}`);
  console.log(`Amount  : ${opts.amount} TON`);
  if (opts.comment) console.log(`Comment : ${opts.comment}`);
  printDivider();

  const body = opts.comment
    ? beginCell().storeUint(0, 32).storeStringTail(opts.comment).endCell()
    : undefined;

  const seqno = await contract.getSeqno();

  await contract.sendTransfer({
    seqno,
    secretKey: keyPair.secretKey,
    sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
    messages: [internal({ to: dest, value: toNano(opts.amount), bounce: false, body })],
  });

  process.stdout.write('\nWaiting for confirmation...');
  let newSeqno = seqno;
  while (newSeqno === seqno) {
    await sleep(config.polling.intervalMs);
    newSeqno = await contract.getSeqno().catch(() => seqno);
    process.stdout.write('.');
  }

  const txRes  = await client.getTransactions(wallet.address, { limit: 1 });
  const txHash = txRes?.[0]?.hash().toString('hex') ?? null;

  console.log(`\n✅ Sent ${opts.amount} TON to ${toAddr}`);
  console.log(
    `   Explorer : ${txHash ? explorerTx(network, txHash) : explorerAddress(network, fromAddr)}`,
  );
}