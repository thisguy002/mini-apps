import { getTonApiClient } from '../lib/clients.js';
import { resolveNetwork } from '../lib/network.js';
import { formatAddress } from '../lib/address.js';
import { explorerTx, formatTimestamp, formatTon, printDivider } from '../lib/format.js';
import { GetTransactionOptions } from '../types/index.js';

export async function getTransaction(opts: GetTransactionOptions): Promise<void> {
  if (!opts.hash) throw new Error('Provide --hash <transaction hash>.');

  const network = resolveNetwork(opts.network);
  const client  = getTonApiClient(network);
  const tx      = await client.blockchain.getBlockchainTransaction(opts.hash);

  const time    = formatTimestamp(tx.utime);
  const account = formatAddress(tx.account.address, network);
  const fees    = formatTon(BigInt(tx.totalFees), 6);
  const status  = !tx.success
    ? tx.computePhase?.success === false
      ? '❌ Failed (compute)'
      : tx.actionPhase?.success === false
      ? '❌ Failed (action)'
      : '❌ Failed'
    : '✅ Success';

  console.log(`\nTransaction ${opts.hash}`);
  printDivider();
  console.log(`   Time    : ${time}`);
  console.log(`   Status  : ${status}`);
  console.log(`   Account : ${account}`);
  console.log(`   Fees    : ${fees} TON`);

  const inMsg = tx.inMsg;
  if (inMsg) {
    const value   = inMsg.value ? `+${formatTon(BigInt(inMsg.value))} TON` : '';
    const srcAddr = inMsg.source?.address
      ? formatAddress(inMsg.source.address, network)
      : 'external';
    const opcode  = inMsg.opCode ? `op=${inMsg.opCode}` : '';
    const bounced = inMsg.bounced ? ' ↩ bounced' : '';
    console.log(`   ← In    : ${value}  from ${srcAddr}  ${opcode}${bounced}`.trimEnd());
    if (inMsg.decodedBody) {
      console.log(`     Body   : ${JSON.stringify(inMsg.decodedBody)}`);
    }
  }

  for (const out of tx.outMsgs ?? []) {
    const value   = out.value ? `-${formatTon(BigInt(out.value))} TON` : '-0 TON';
    const dstAddr = out.destination?.address
      ? formatAddress(out.destination.address, network)
      : 'unknown';
    const opcode  = out.opCode ? `op=${out.opCode}` : '';
    const bounced = out.bounced ? ' ↩ bounced' : '';
    console.log(`   → Out   : ${value}  to ${dstAddr}  ${opcode}${bounced}`.trimEnd());
  }

  printDivider();
  console.log(`   Link    : ${explorerTx(network, opts.hash)}`);
}
