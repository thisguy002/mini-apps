export interface TxResult {
  boc: string;
}

export type TxStatus =
  | { kind: 'idle' }
  | { kind: 'pending' }
  | { kind: 'success'; result: TxResult }
  | { kind: 'error'; message: string };

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

export interface TelegramContextValue {
  isTMA: boolean;
  colorScheme: 'light' | 'dark';
  isReady: boolean;
  user: TelegramUser | null;
}