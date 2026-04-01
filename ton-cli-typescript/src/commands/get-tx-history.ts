import { getTonApiClient } from '../lib/clients.js';
import { resolveNetwork, parseLimitOption } from '../lib/network.js';
import { parseAddress, formatAddress } from '../lib/address.js';
import { explorerTx, formatTimestamp, formatTon, formatTokenAmount, printDivider } from '../lib/format.js';
import { GetTxHistoryOptions } from '../types/index.js';

export async function getTransactions(opts: GetTxHistoryOptions): Promise<void> {
  if (!opts.address) throw new Error('Provide --address <TON address>.');

  const network = resolveNetwork(opts.network);
  const limit   = parseLimitOption(opts.limit, 10);
  const parsed  = parseAddress(opts.address);
  const address = formatAddress(parsed, network);
  const client  = getTonApiClient(network);

  console.log(`\nTransactions for ${address}`);
  console.log(`Network: ${network} | Showing last ${limit}\n`);
  printDivider();

  const res = await client.accounts.getAccountEvents(parsed, { limit, subject_only: true });

  if (!res.events.length) {
    console.log('No transactions found.');
    return;
  }

  for (const event of res.events) {
    const time   = formatTimestamp(event.timestamp);
    const status = event.inProgress
      ? '⏳ Pending'
      : event.actions.some(a => a.status === 'failed') ? '❌ Failed' : '✅ Success';
    const fees   = event.extra !== undefined
      ? `${formatTon(Math.abs(Number(event.extra)), 9)} TON ${Number(event.extra) >= 0 ? 'received' : 'spent'}`
      : '';

    console.log(`🕐 ${time}`);
    console.log(`   Status  : ${status}`);
    console.log(`   Event   : ${event.eventId}`);

    for (const action of event.actions) {
      const ok = action.status === 'failed' ? '❌ Failed' : '✅';

      if (action.type === 'TonTransfer' && action.TonTransfer) {
        const a     = action.TonTransfer;
        const from  = formatAddress(a.sender.address,    network);
        const to    = formatAddress(a.recipient.address, network);
        const value = formatTon(BigInt(a.amount));
        console.log(`   ${ok} TON Transfer    ${value} TON`);
        console.log(`      From : ${from}`);
        console.log(`      To   : ${to}`);
        if (a.comment) console.log(`      Note : ${a.comment}`);

      } else if (action.type === 'JettonTransfer' && action.JettonTransfer) {
        const a    = action.JettonTransfer;
        const from = a.sender?.address   ? formatAddress(a.sender.address,    network) : 'unknown';
        const to   = a.recipient?.address ? formatAddress(a.recipient.address, network) : 'unknown';
        const amt  = formatTokenAmount(BigInt(a.amount), a.jetton.decimals ?? 9);
        console.log(`   ${ok} Jetton Transfer  ${amt} ${a.jetton.symbol}`);
        console.log(`      From : ${from}`);
        console.log(`      To   : ${to}`);
        if (a.comment) console.log(`      Note : ${a.comment}`);

      } else if (action.type === 'JettonMint' && action.JettonMint) {
        const a   = action.JettonMint;
        const to  = formatAddress(a.recipient.address, network);
        const amt = formatTokenAmount(BigInt(a.amount), a.jetton.decimals ?? 9);
        console.log(`   ${ok} Jetton Mint      ${amt} ${a.jetton.symbol}`);
        console.log(`      To   : ${to}`);

      } else if (action.type === 'JettonBurn' && action.JettonBurn) {
        const a   = action.JettonBurn;
        const amt = formatTokenAmount(BigInt(a.amount), a.jetton.decimals ?? 9);
        console.log(`   ${ok} Jetton Burn      ${amt} ${a.jetton.symbol}`);

      } else if (action.type === 'NftItemTransfer' && action.NftItemTransfer) {
        const a    = action.NftItemTransfer;
        const from = a.sender?.address    ? formatAddress(a.sender.address,    network) : 'unknown';
        const to   = a.recipient?.address ? formatAddress(a.recipient.address, network) : 'unknown';
        console.log(`   ${ok} NFT Transfer`);
        console.log(`      From : ${from}`);
        console.log(`      To   : ${to}`);

      } else if (action.type === 'ContractDeploy' && action.ContractDeploy) {
        const addr = formatAddressFromAction(action.ContractDeploy.address, network, true);
        console.log(`   ${ok} Contract Deploy`);
        console.log(`      Addr : ${addr}`);

      } else if (action.type === 'SmartContractExec' && action.SmartContractExec) {
        const a    = action.SmartContractExec;
        const from = formatAddress(a.executor.address, network);
        const to   = formatAddress(a.contract.address, network);
        const ton  = formatTon(BigInt(a.tonAttached));
        console.log(`   ${ok} Contract Call    op=${a.operation}  ${ton} TON`);
        console.log(`      From : ${from}`);
        console.log(`      To   : ${to}`);

      } else {
        console.log(`   ${ok} ${action.type}`);
      }
    }

    if (fees) console.log(`   Net     : ${fees}`);
    console.log(`   Link    : ${explorerTx(network, event.eventId)}`);
    printDivider();
  }
}

// Helper for ContractDeploy which gives us an Address object directly
function formatAddressFromAction(address: { toString(opts: object): string }, network: string, bounceable: boolean): string {
  return address.toString({ bounceable, testOnly: network === 'testnet' });
}
