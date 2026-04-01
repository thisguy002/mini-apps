export type Network = 'mainnet' | 'testnet';

// ── Per-command option interfaces ──────────────────────────────────────────

export interface CreateWalletOptions {
  network: Network;
}

export interface InitializeWalletOptions {
  network: Network;
  mnemonic?: string;
}

export interface SendTonOptions {
  network: Network;
  to: string;
  amount: string;
  comment?: string;
  mnemonic?: string;
}

export interface GetWalletInfoOptions {
  network: Network;
  address: string;
}

export interface GetWalletAssetsOptions {
  network: Network;
  address: string;
  limit?: string;
  jettonsLimit?: string;
  nftLimit?: string;
}

export interface GetTxHistoryOptions {
  network: Network;
  address: string;
  limit?: string;
}

export interface GetTransactionOptions {
  network: Network;
  hash: string;
}

export interface GetJettonInfoOptions {
  network: Network;
  address: string;
}
