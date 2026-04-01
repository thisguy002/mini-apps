import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  padding?: boolean;
}

export function Card({ children, padding = false }: CardProps) {
  return (
    <div
      className={`rounded-2xl overflow-hidden ${padding ? 'p-4' : ''}`}
      style={{ background: 'var(--tg-surface)' }}
    >
      {children}
    </div>
  );
}