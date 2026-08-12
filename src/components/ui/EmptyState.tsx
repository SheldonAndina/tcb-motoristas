import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}) => (
  <div className="flex flex-col items-center justify-center text-center py-14 px-6 rounded-2xl border border-dashed border-ink/15 dark:border-white/15 bg-white/50 dark:bg-ink-soft/40">
    <div className="w-12 h-12 rounded-2xl bg-accent-muted dark:bg-accent/15 text-accent flex items-center justify-center mb-4">
      {icon || <Inbox className="w-6 h-6" />}
    </div>
    <h3 className="text-sm font-extrabold text-ink dark:text-white">{title}</h3>
    {description && (
      <p className="text-xs text-ink/55 dark:text-white/50 mt-1.5 max-w-sm leading-relaxed">
        {description}
      </p>
    )}
    {actionLabel && onAction && (
      <Button variant="accent" size="sm" className="mt-4" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);
