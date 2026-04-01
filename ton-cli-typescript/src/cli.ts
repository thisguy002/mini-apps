// =============================================================================
// Arg parsing, help text, command routing
// =============================================================================

import { readFileSync } from 'fs';
const { version: VERSION } = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf-8')
);

// ── TTY / colour helpers ───────────────────────────────────────────────────
const isTTY  = process.stdout.isTTY === true;
const bold   = (s: string) => isTTY ? `\x1b[1m${s}\x1b[0m`  : s;
const dim    = (s: string) => isTTY ? `\x1b[2m${s}\x1b[0m`  : s;
const cyan   = (s: string) => isTTY ? `\x1b[36m${s}\x1b[0m` : s;
const yellow = (s: string) => isTTY ? `\x1b[33m${s}\x1b[0m` : s;
const green  = (s: string) => isTTY ? `\x1b[32m${s}\x1b[0m` : s;

// ── JSON mode ──────────────────────────────────────────────────────────────
let _jsonMode = false;
export const isJsonMode = () => _jsonMode;

// ── Arg helpers ────────────────────────────────────────────────────────────
function hasFlag(args: string[], ...flags: string[]): boolean {
  return args.some(a => flags.includes(a));
}

function removeFlags(args: string[], ...flags: string[]): string[] {
  return args.filter(a => !flags.includes(a));
}

function getFlagValue(args: string[], flag: string): string | undefined {
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) return args[idx + 1];
  const prefix = flag + '=';
  return args.find(a => a.startsWith(prefix))?.slice(prefix.length);
}

// ── Help builders ──────────────────────────────────────────────────────────
function row(command: string, desc: string, indent = 2): string {
  const pad = 42 - indent;
  return `${' '.repeat(indent)}${bold(command.padEnd(pad))}${dim(desc)}`;
}

function flg(name: string, desc: string): string {
  return `${' '.repeat(4)}${yellow(name.padEnd(40))}${dim(desc)}`;
}

function section(title: string): string {
  return `\n  ${cyan(title)}`;
}

function buildHelp(): string {
  return [
    '',
    `  ${bold('ton-cli')} ${dim('—')} TypeScript toolkit for TON blockchain development`,
    `  ${dim('v' + VERSION)}`,
    '',
    `  ${dim('Usage:')}  ${bold('ton-cli')} ${dim('<command> [flags]')}`,
    '',
    section('Wallet'),
    row('create-wallet',     'Generate a new TON wallet keypair'),
    row('initialize-wallet', 'Deploy wallet contract on-chain (required before first send)'),
    row('get-wallet-info',   'Show balance and status for any TON address'),
    row('get-wallet-assets', 'List jettons and NFTs held by a TON address'),
    '',
    section('Transactions'),
    row('send-ton',          'Send TON to an address'),
    row('get-transaction',   'Show details for a single transaction by hash'),
    row('get-tx-history',    'Show recent transactions for a TON address'),
    '',
    section('Tokens'),
    row('get-jetton-info',   'Show jetton info, or all jettons owned by a wallet'),
    '',
    section('Global Flags'),
    flg('--network <testnet|mainnet>', 'Target network (default: testnet)'),
    flg('--json',                      'Output raw JSON for scripting'),
    flg('--help, -h',                  'Show help (works per-command too)'),
    flg('--version, -v',               'Show version'),
    '',
    `  ${dim('Examples:')}`,
    `    ${green('ton-cli create-wallet')}`,
    `    ${green('ton-cli get-wallet-info --address <addr> --network mainnet')}`,
    `    ${green('ton-cli send-ton --to <addr> --amount 0.5 --comment "gm"')}`,
    `    ${green('ton-cli get-tx-history --address <addr> --limit 20')}`,
    `    ${green('ton-cli get-jetton-info --address <addr> --json')}`,
    '',
  ].join('\n');
}

const commandHelp: Record<string, () => string> = {
  'create-wallet': () => [
    '',
    `  ${bold('ton-cli create-wallet')} ${dim('— Generate a new TON wallet')}`,
    '',
    `  ${dim('Generates a fresh mnemonic, keypair, and wallet address.')}`,
    `  ${dim('Does not deploy anything on-chain.')}`,
    '',
    flg('--network <testnet|mainnet>', 'Address format to use (default: testnet)'),
    '',
    `  ${dim('Example:')}`,
    `    ${green('ton-cli create-wallet')}`,
    `    ${green('ton-cli create-wallet --network mainnet')}`,
    '',
  ].join('\n'),

  'initialize-wallet': () => [
    '',
    `  ${bold('ton-cli initialize-wallet')} ${dim('— Deploy wallet contract on-chain')}`,
    '',
    `  ${dim('TON wallets must be deployed before they can send transactions.')}`,
    `  ${dim('Requires a funded address. Will poll until balance is detected.')}`,
    '',
    flg('--network <testnet|mainnet>', 'Target network (default: testnet)'),
    flg('--mnemonic "<phrase>"',       'Wallet mnemonic (defaults to WALLET_MNEMONIC in .env.enc)'),
    '',
    `  ${dim('Example:')}`,
    `    ${green('ton-cli initialize-wallet --network testnet')}`,
    `    ${green('ton-cli initialize-wallet --mnemonic "word1 word2 ..."')}`,
    '',
    `  ${dim('Testnet faucets:')}`,
    `    ${dim('https://t.me/testgiver_ton_bot')}`,
    '',
  ].join('\n'),

  'send-ton': () => [
    '',
    `  ${bold('ton-cli send-ton')} ${dim('— Send TON to an address')}`,
    '',
    flg('--to <address>',              'Destination TON address (required)'),
    flg('--amount <number>',           'Amount in TON, e.g. 0.5 (required)'),
    flg('--comment <text>',            'Optional text memo'),
    flg('--network <testnet|mainnet>', 'Target network (default: testnet)'),
    flg('--mnemonic "<phrase>"',       'Wallet mnemonic (defaults to WALLET_MNEMONIC in .env.enc)'),
    '',
    `  ${dim('Example:')}`,
    `    ${green('ton-cli send-ton --to <addr> --amount 0.5')}`,
    `    ${green('ton-cli send-ton --to <addr> --amount 1 --comment "gm" --network mainnet')}`,
    '',
  ].join('\n'),

  'get-wallet-info': () => [
    '',
    `  ${bold('ton-cli get-wallet-info')} ${dim('— Show wallet balance and status')}`,
    '',
    flg('--address <address>',         'TON address to look up (required)'),
    flg('--network <testnet|mainnet>', 'Target network (default: testnet)'),
    flg('--json',                      'Output as JSON'),
    '',
    `  ${dim('Example:')}`,
    `    ${green('ton-cli get-wallet-info --address <addr>')}`,
    `    ${green('ton-cli get-wallet-info --address <addr> --network mainnet --json')}`,
    '',
  ].join('\n'),

  'get-wallet-assets': () => [
    '',
    `  ${bold('ton-cli get-wallet-assets')} ${dim('— List jettons and NFTs')}`,
    '',
    flg('--address <address>',         'TON address to look up (required)'),
    flg('--network <testnet|mainnet>', 'Target network (default: testnet)'),
    flg('--limit <number>',            'Max results for jettons and NFTs (default: 10)'),
    flg('--jettons-limit <number>',    'Override max jettons'),
    flg('--nft-limit <number>',        'Override max NFTs'),
    flg('--json',                      'Output as JSON'),
    '',
    `  ${dim('Example:')}`,
    `    ${green('ton-cli get-wallet-assets --address <addr>')}`,
    `    ${green('ton-cli get-wallet-assets --address <addr> --limit 50 --network mainnet')}`,
    '',
  ].join('\n'),

  'get-transaction': () => [
    '',
    `  ${bold('ton-cli get-transaction')} ${dim('— Show a single transaction by hash')}`,
    '',
    flg('--hash <hash>',               'Full transaction hash (required)'),
    flg('--network <testnet|mainnet>', 'Target network (default: testnet)'),
    flg('--json',                      'Output as JSON'),
    '',
    `  ${dim('Example:')}`,
    `    ${green('ton-cli get-transaction --hash <hash>')}`,
    `    ${green('ton-cli get-transaction --hash <hash> --network mainnet')}`,
    '',
  ].join('\n'),

  'get-tx-history': () => [
    '',
    `  ${bold('ton-cli get-tx-history')} ${dim('— Show recent transactions for an address')}`,
    '',
    flg('--address <address>',         'TON address to look up (required)'),
    flg('--limit <number>',            'Number of transactions (default: 10)'),
    flg('--network <testnet|mainnet>', 'Target network (default: testnet)'),
    flg('--json',                      'Output as JSON'),
    '',
    `  ${dim('Example:')}`,
    `    ${green('ton-cli get-tx-history --address <addr>')}`,
    `    ${green('ton-cli get-tx-history --address <addr> --limit 25 --network mainnet')}`,
    '',
  ].join('\n'),

  'get-jetton-info': () => [
    '',
    `  ${bold('ton-cli get-jetton-info')} ${dim('— Show jetton info or jettons owned by a wallet')}`,
    '',
    `  ${dim('Pass a jetton minter address to get token details.')}`,
    `  ${dim('Pass a wallet address to list all jettons it holds.')}`,
    '',
    flg('--address <address>',         'Jetton minter or wallet address (required)'),
    flg('--network <testnet|mainnet>', 'Target network (default: testnet)'),
    flg('--json',                      'Output as JSON'),
    '',
    `  ${dim('Example:')}`,
    `    ${green('ton-cli get-jetton-info --address <minter-addr>')}`,
    `    ${green('ton-cli get-jetton-info --address <wallet-addr> --network mainnet')}`,
    '',
  ].join('\n'),
};

// ── run() — called by bin/ton-cli.ts ──────────────────────────────────────
export async function run(): Promise<void> {
  let args = process.argv.slice(2);

  // --json global flag
  if (hasFlag(args, '--json')) {
    _jsonMode = true;
    args = removeFlags(args, '--json');
  }

  // --version / version
  if (hasFlag(args, '--version', '-v') || args[0] === 'version') {
    console.log(VERSION);
    return;
  }

  const [command, ...rest] = args;

  // No args or top-level --help
  if (!command || hasFlag(args, '--help', '-h')) {
    const subject = command && !command.startsWith('-') ? command : undefined;
    console.log(subject && commandHelp[subject] ? commandHelp[subject]() : buildHelp());
    return;
  }

  // Per-command --help:  ton-cli send-ton --help
  if (hasFlag(rest, '--help', '-h')) {
    console.log(commandHelp[command]?.() ?? buildHelp());
    return;
  }

  // Resolve shared options once, pass into every command
  const network = (getFlagValue(args, '--network') ?? 'testnet') as 'testnet' | 'mainnet';

  const opts = {
    network,
    address:      getFlagValue(args, '--address'),
    hash:         getFlagValue(args, '--hash'),
    to:           getFlagValue(args, '--to'),
    amount:       getFlagValue(args, '--amount'),
    comment:      getFlagValue(args, '--comment'),
    mnemonic:     getFlagValue(args, '--mnemonic'),
    limit:        getFlagValue(args, '--limit'),
    jettonsLimit: getFlagValue(args, '--jettons-limit'),
    nftLimit:     getFlagValue(args, '--nft-limit'),
  };

  // Required-flag guards — fail fast before importing anything
  function need(value: string | undefined, flag: string): string {
    if (!value) { console.error(`\n❌  ${flag} is required\n`); process.exit(1); }
    return value;
  }

  switch (command) {
    case 'create-wallet': {
      const { createWallet } = await import('./commands/create-wallet.js');
      return createWallet(opts);
    }

    case 'initialize-wallet': {
      const { initializeWallet } = await import('./commands/initialize-wallet.js');
      return initializeWallet(opts);
    }

    case 'send-ton': {
      const { sendTon } = await import('./commands/send-ton.js');
      return sendTon({ ...opts, to: need(opts.to, '--to <address>'), amount: need(opts.amount, '--amount <TON>') });
    }

    case 'get-wallet-info': {
      const { getWalletInfo } = await import('./commands/get-wallet-info.js');
      return getWalletInfo({ ...opts, address: need(opts.address, '--address') });
    }

    case 'get-wallet-assets': {
      const { getWalletAssets } = await import('./commands/get-wallet-assets.js');
      return getWalletAssets({ ...opts, address: need(opts.address, '--address') });
    }

    case 'get-transaction': {
      const { getTransaction } = await import('./commands/get-transaction.js');
      return getTransaction({ ...opts, hash: need(opts.hash, '--hash') });
    }

    case 'get-tx-history': {
      const { getTransactions } = await import('./commands/get-tx-history.js');
      return getTransactions({ ...opts, address: need(opts.address, '--address') });
    }

    case 'get-jetton-info': {
      const { getJettonInfo } = await import('./commands/get-jetton-info.js');
      return getJettonInfo({ ...opts, address: need(opts.address, '--address') });
    }

    default:
      console.error(`\n❌  Unknown command: ${bold(command)}\n`);
      console.log(buildHelp());
      process.exit(1);
  }
}