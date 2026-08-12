import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  label?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'A carregar…',
}) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <Loader2 className="w-8 h-8 text-accent animate-spin" />
    <p className="text-xs font-bold uppercase tracking-widest text-ink/50 dark:text-white/45">
      {label}
    </p>
  </div>
);
