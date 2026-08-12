import React from 'react';

type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const tones: Record<BadgeTone, string> = {
  neutral:
    'bg-ink/5 text-ink/65 border-ink/10 dark:bg-white/8 dark:text-white/65 dark:border-white/10',
  accent:
    'bg-accent/10 text-accent-fg border-accent/20 dark:bg-accent/15 dark:text-amber-100/90 dark:border-accent/25',
  success:
    'bg-success/10 text-success border-success/20 dark:bg-success/15 dark:text-emerald-300/90',
  warning:
    'bg-accent/10 text-accent-fg border-accent/20 dark:bg-accent/15 dark:text-amber-100/90',
  danger:
    'bg-danger/10 text-danger border-danger/20 dark:bg-danger/15 dark:text-red-300/90',
  info: 'bg-ink/5 text-ink/60 border-ink/10 dark:bg-white/8 dark:text-white/60 dark:border-white/10',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  tone = 'neutral',
  className = '',
}) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide border ${tones[tone]} ${className}`}
  >
    {children}
  </span>
);
