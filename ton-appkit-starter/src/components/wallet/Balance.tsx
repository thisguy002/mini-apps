import { useEffect } from 'react';
import { useBalance } from '@ton/appkit-react';

import { formatBalance } from '@/utils/ton';
import { BALANCE_POLL_INTERVAL_MS } from '@/utils/constants';

import { SectionTitle } from '@/components/shared/SectionTitle';
import { Card } from '@/components/shared/Card';

export function Balance() {
  const { data: balance, isLoading, isError, refetch } = useBalance();

  useEffect(() => {
    const interval = setInterval(refetch, BALANCE_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div>
      <SectionTitle title="Balance" />
      <Card>
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="text-2xl">💎</span>
          <div className="flex-1">
            <p className="text-xs" style={{ color: 'var(--tg-text-secondary)' }}>Toncoin</p>
            {isLoading ? (
              <div className="skeleton w-24 h-5 mt-1" />
            ) : (
              <p className="text-xl font-bold">{formatBalance(balance)} TON</p>
            )}
          </div>
          {isError && (
            <button
              onClick={() => refetch()}
              className="text-xs px-3 py-1.5 rounded-full"
              style={{ background: 'var(--tg-surface-2)', color: 'var(--tg-text)' }}
            >
              Retry
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}