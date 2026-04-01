import { useState } from 'react';
import { useTonAddress, useTonWallet } from '@tonconnect/ui-react';
import { useTelegram } from '@/components/telegram/TelegramProvider';

import { 
  getAddressExplorerUrl, 
  getNetworkLabel, 
  getNetworkStyle, 
  getWalletName, 
  shortenAddress 
} from '@/utils/ton';

import { SectionTitle } from '@/components/shared/SectionTitle';
import { Card } from '@/components/shared/Card';
import { CardRow } from '@/components/shared/CardRow';

export function WalletInfo() {
  const address = useTonAddress();
  const wallet = useTonWallet();
  const [copied, setCopied] = useState(false);
  const { user } = useTelegram();

  if (!address || !wallet) return null;

  const networkLabel = getNetworkLabel(wallet.account.chain);
  const networkStyle = getNetworkStyle(wallet.account.chain);
  const walletName = getWalletName(wallet.device);
  const explorerUrl = getAddressExplorerUrl(address);
  const shortAddress = shortenAddress(address);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <SectionTitle title={`${user?.first_name || 'anon'}'s Wallet`} />
      <Card>
        <CardRow label="App" divider>
          <span className="text-sm font-medium">{walletName}</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={networkStyle}>
            {networkLabel}
          </span>
        </CardRow>

        <CardRow label="Address" divider onClick={handleCopy}>
          <span className="text-sm font-mono" style={{ color: 'var(--tg-accent)' }}>
            {copied ? '✅ Copied' : shortAddress + ' 📋'}
          </span>
        </CardRow>

        <CardRow label="Explorer">
          
        <a  href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm"
            style={{ color: 'var(--tg-accent)' }}
          >
            Tonscan ↗
          </a>
        </CardRow>
      </Card>
    </div>
  );
}