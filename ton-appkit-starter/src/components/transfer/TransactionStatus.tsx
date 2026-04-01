import { useEffect, useState } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';

import { fetchLatestTxHash, pollFor } from '@/utils/ton';
import { TONSCAN_BASE_URL } from '@/utils/constants';
import type { TxStatus } from '@/types';

interface TransactionStatusProps {
  status: TxStatus;
  onDismiss: () => void;
}

export function TransactionStatus({ status, onDismiss }: TransactionStatusProps) {
  const address = useTonAddress();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (status.kind !== 'success' || !address) return;

    setIsConfirming(true);
    setTxHash(null);

    const stop = pollFor(
      async () => {
        const hash = await fetchLatestTxHash(address);
        if (hash) {
          setTxHash(hash);
          setIsConfirming(false);
          return true;
        }
        return false;
      },
      2000,
      10,
      () => setIsConfirming(false),
    );

    return stop;
  }, [status, address]);

  useEffect(() => {
    if (status.kind === 'idle' || status.kind === 'pending') return;
    const delay = status.kind === 'success' ? 12_000 : 8_000;
    const timer = setTimeout(onDismiss, delay);
    return () => clearTimeout(timer);
  }, [status, onDismiss]);

  if (status.kind === 'idle' || status.kind === 'pending') {
    return null;
  }

  const isSuccess = status.kind === 'success';
  const explorerUrl = txHash ? TONSCAN_BASE_URL + '/tx/' + txHash : null;
  const errorMessage = status.kind === 'error' ? status.message : '';
  const bg = isSuccess ? '#1a3a23' : '#3a1a1a';
  const borderColor = isSuccess ? 'rgba(49,181,69,0.3)' : 'rgba(229,57,53,0.3)';
  const textColor = isSuccess ? 'var(--tg-success)' : 'var(--tg-error)';

  return (
    <div
      className="toast fixed bottom-6 left-1/2 flex items-start gap-3 px-4 py-3 rounded-2xl shadow-xl"
      style={{ minWidth: 280, maxWidth: 'calc(100vw - 32px)', background: bg, border: '1px solid ' + borderColor }}
    >
      <span className="text-lg">{isSuccess ? '✅' : '❌'}</span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: textColor }}>
          {isSuccess ? 'Transaction sent' : 'Transaction failed'}
        </p>

        {isSuccess && (
          isConfirming ? (
            <p className="text-xs" style={{ color: 'var(--tg-text-secondary)' }}>
              ⏳ Confirming...
            </p>
          ) : explorerUrl ? (
            
            <a  
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs"
              style={{ color: 'var(--tg-text-secondary)' }}
            >
              View on Tonscan ↗
            </a>
          ) : (
            <p className="text-xs" style={{ color: 'var(--tg-text-secondary)' }}>
              Transaction submitted
            </p>
          )
        )}

        {!isSuccess && (
          <p className="text-xs truncate" style={{ color: 'var(--tg-text-secondary)' }}>
            {errorMessage}
          </p>
        )}
      </div>

      <button
        onClick={onDismiss}
        className="text-sm"
        style={{ color: 'var(--tg-text-secondary)' }}
      >
        ✕
      </button>
    </div>
  );
}