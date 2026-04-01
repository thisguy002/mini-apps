import { mnemonicValidate } from '@ton/crypto';
import { config } from '../config.js';

const MNEMONIC_WORD_COUNT = 24;

/**
 * Resolve mnemonic from CLI flag or env var.
 * Warns the user if mnemonic was passed as a CLI flag (visible in process list).
 */
export function resolveMnemonic(cliMnemonic?: string): string {
  if (cliMnemonic) {
    console.warn(
      '\n⚠️  Security warning: passing --mnemonic on the command line exposes it\n' +
      '   in your shell history and process list. Prefer storing it in .env.enc\n' +
      '   and omitting the --mnemonic flag.\n',
    );
    return cliMnemonic.trim();
  }

  const envMnemonic = config.wallet.mnemonic;
  if (!envMnemonic) {
    throw new Error(
      'No mnemonic provided. Set WALLET_MNEMONIC in .env.enc or pass --mnemonic.',
    );
  }

  return envMnemonic.trim();
}

/**
 * Split mnemonic string into words and validate.
 * Throws a descriptive error rather than failing deep in key derivation.
 */
export async function parseMnemonic(raw: string): Promise<string[]> {
  const words = raw.split(/\s+/).filter(Boolean);

  if (words.length !== MNEMONIC_WORD_COUNT) {
    throw new Error(
      `Invalid mnemonic: expected ${MNEMONIC_WORD_COUNT} words, got ${words.length}.`,
    );
  }

  const valid = await mnemonicValidate(words);
  if (!valid) {
    throw new Error('Invalid mnemonic: BIP39 validation failed.');
  }

  return words;
}
