import { AppKit, AppKitProvider, TonConnectConnector } from '@ton/appkit-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import {
  MANIFEST_URL,
  TONCENTER_BASE_URL,
  TONCENTER_API_KEY,
  NETWORK,
} from '@/utils/constants';

import '@ton/appkit-react/styles.css';

import { TelegramProvider } from '@/components/telegram/TelegramProvider';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { WalletInfo } from '@/components/wallet/WalletInfo';
import { Balance } from '@/components/wallet/Balance';
import { SendTon } from '@/components/transfer/SendTon';

// -------
// APPKIT
// -------

const kit = new AppKit({
  networks: {
    [NETWORK.chainId]: {
      apiClient: {
        url: TONCENTER_BASE_URL,
        ...(TONCENTER_API_KEY ? { key: TONCENTER_API_KEY } : {}),
      },
    },
  },
  connectors: [
    new TonConnectConnector({
      tonConnectOptions: {
        manifestUrl: MANIFEST_URL,
      },
    }),
  ],
});

// ------------
// QUERY CLIENT
// ------------

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

// -------------
// APP COMPONENT
// -------------

export function App() {
  return (
    <AppKitProvider appKit={kit}>
      <QueryClientProvider client={queryClient}>
        <TelegramProvider>
          <div className="page min-h-full px-4 py-6 flex flex-col gap-4 max-w-lg mx-auto">

            {/* Header */}
            <div style={{ paddingTop: 8 }}>
              <h1 style={{ fontSize: '22px', fontWeight: 700 }}>
                TON AppKit Starter
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--tg-text-secondary)', marginTop: 4 }}>
                A Telegram Mini App starter kit built with TON AppKit
              </p>
            </div>

            {/* Connect */}
            <WalletConnect />

            {/* Wallet info — only rendered when connected */}
            <WalletInfo />

            {/* Balance — only rendered when connected */}
            <Balance />

            {/* Send — only rendered when connected */}
            <SendTon />

          </div>
        </TelegramProvider>
      </QueryClientProvider>
    </AppKitProvider>
  );
}