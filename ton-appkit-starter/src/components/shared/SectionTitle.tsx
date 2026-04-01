interface SectionTitleProps {
  title: string;
}

export function SectionTitle({ title }: SectionTitleProps) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider px-1 pb-2" style={{ color: 'var(--tg-text-secondary)' }}>
      {title}
    </p>
  );
}