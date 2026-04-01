import { mnemonicNew, mnemonicToPrivateKey } from '@ton/crypto';
import { WalletContractV5R1 } from '@ton/ton';
import { resolveNetwork } from '../lib/network.js';
import { formatAddress, formatAddressBounceable } from '../lib/address.js';
import { explorerAddress, printDivider } from '../lib/format.js';
import { config } from '../config.js';
import { CreateWalletOptions } from '../types/index.js';

export async function createWallet(opts: CreateWalletOptions): Promise<void> {
  const network = resolveNetwork(opts.network);

  console.log(`\nGenerating new TON wallet on ${network}...`);

  const words    = await mnemonicNew(24);
  const mnemonic = words.join(' ');
  const keyPair  = await mnemonicToPrivateKey(words);
  const wallet = WalletContractV5R1.create({
    workchain: 0,
    publicKey: keyPair.publicKey,
    walletId: { networkGlobalId: config.networks[network].globalId },
  });

  const address    = formatAddress(wallet.address, network);
  const bounceable = formatAddressBounceable(wallet.address, network);

  console.log('\n=== NEW TON WALLET CREATED ===');
  printDivider();
  console.log(`Network     : ${network}`);
  console.log(`Address     : ${address}`);
  console.log(`Bounceable  : ${bounceable}`);
  console.log(`Public Key  : ${keyPair.publicKey.toString('hex')}`);
  console.log(`Private Key : ${keyPair.secretKey.toString('hex')}`);
  console.log(`\nMnemonic :\n${mnemonic}`);
  console.log('\n⚠️  Save your mnemonic — it cannot be recovered!');
  console.log(`Explorer    : ${explorerAddress(network, address)}`);
  printDivider();
}