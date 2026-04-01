import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { useIsConnected } from '@/hooks/useIsConnected';
import { shortenAddress } from '@/utils/ton';

export function WalletConnect() {
  const [tonConnectUI] = useTonConnectUI();
  const isConnected = useIsConnected();

  const address = useTonAddress();
  const shortAddress = shortenAddress(address);

  if (isConnected) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: 'var(--tg-surface)' }}>
        <span className="text-xl">💎</span>
        <div className="flex-1">
          <p className="text-xs" style={{ color: 'var(--tg-text-secondary)' }}>Connected</p>
          <p className="text-sm font-semibold">{shortAddress}</p>
        </div>
        <button
          onClick={() => tonConnectUI.disconnect()}
          className="text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ color: 'var(--tg-error)', background: 'rgba(229,57,53,0.1)' }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => tonConnectUI.openModal()}
      className="w-full py-3 rounded-full font-semibold text-sm"
      style={{ background: 'var(--tg-accent)', color: '#fff' }}
    >
      💎 Connect Wallet
    </button>
  );
}