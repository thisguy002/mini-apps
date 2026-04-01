import { type ReactNode } from 'react';

interface CardRowProps {
  label: string;
  children: ReactNode;
  divider?: boolean;
  onClick?: () => void;
}

export function CardRow({ label, children, divider = false, onClick }: CardRowProps) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 ${onClick ? 'cursor-pointer' : ''}`}
      style={{ borderBottom: divider ? '1px solid var(--tg-divider)' : undefined }}
      onClick={onClick}
    >
      <span className="text-sm" style={{ color: 'var(--tg-text-secondary)' }}>{label}</span>
      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  );
}