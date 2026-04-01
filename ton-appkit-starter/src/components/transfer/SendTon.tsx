import { useState, useCallback } from 'react';
import { useIsConnected } from '@/hooks/useIsConnected';

import { parseTxError } from '@/utils/ton';
import { type TxStatus } from '@/types';

import { SendTonButton } from '@ton/appkit-react';
import { TransactionStatus } from '@/components/transfer/TransactionStatus';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Card } from '@/components/shared/Card';
import { FormField } from '@/components/shared/FormField';

interface SendFormValues {
  recipient: string;
  amount: string;
  comment: string;
}

export function SendTon() {
  const isConnected = useIsConnected();
  const initialValues: SendFormValues = { recipient: '', amount: '', comment: '' };
  const [values, setValues] = useState<SendFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof SendFormValues, string>>>({});
  const [txStatus, setTxStatus] = useState<TxStatus>({ kind: 'idle' });

  const handleChange = (field: keyof SendFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSuccess = useCallback((result: { boc: string }) => {
    setTxStatus({ kind: 'success', result });
    setValues(initialValues);
  }, []);

  const handleError = (error: Error) => {
    setTxStatus({ kind: 'error', message: parseTxError(error) });
  };

  if (!isConnected) return null;

  return (
    <div>
      <SectionTitle title="Send TON" />
      <Card padding>
        <div className="flex flex-col gap-3">
          <FormField
            placeholder="Recipient address (UQ...)"
            value={values.recipient}
            onChange={handleChange('recipient')}
            error={errors.recipient}
            autoComplete="off"
            spellCheck={false}
          />

          <FormField
            placeholder="Amount (TON)"
            value={values.amount}
            onChange={handleChange('amount')}
            error={errors.amount}
            type="number"
            min="0"
            step="0.01"
          />

          <FormField
            placeholder="Comment (optional)"
            value={values.comment}
            onChange={handleChange('comment')}
          />

          <SendTonButton
            recipientAddress={values.recipient}
            amount={values.amount}
            comment={values.comment.trim() || undefined}
            text="📤 Send TON"
            onSuccess={handleSuccess}
            onError={handleError}
            className="w-full py-3 rounded-full font-semibold text-sm"
            disabled={txStatus.kind === 'pending' || !values.recipient || !values.amount}
          />
        </div>
      </Card>
      <TransactionStatus status={txStatus} onDismiss={() => setTxStatus({ kind: 'idle' })} />
    </div>
  );
}