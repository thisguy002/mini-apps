interface FormFieldProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  min?: string;
  step?: string;
  autoComplete?: string;
  spellCheck?: boolean;
  disabled?: boolean;
}

export function FormField({
  placeholder,
  value,
  onChange,
  error,
  type = 'text',
  min,
  step,
  autoComplete,
  spellCheck,
  disabled,
}: FormFieldProps) {
  return (
    <div>
      <input
        className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all ${error ? 'ring-1 ring-red-500' : ''}`}
        style={{ background: 'var(--tg-surface-2)', color: 'var(--tg-text)', border: 'none' }}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type={type}
        min={min}
        step={step}
        autoComplete={autoComplete}
        spellCheck={spellCheck}
        disabled={disabled}
      />
      {error && (
        <p className="text-xs mt-1" style={{ color: 'var(--tg-error)' }}>{error}</p>
      )}
    </div>
  );
}