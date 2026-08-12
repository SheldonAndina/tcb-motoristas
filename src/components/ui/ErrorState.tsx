import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Algo correu mal',
  description = 'Não foi possível carregar os dados. Tente novamente.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center text-center py-14 px-6 rounded-2xl border border-danger/20 bg-danger-muted/40 dark:bg-red-500/10">
    <div className="w-12 h-12 rounded-2xl bg-danger/10 text-danger flex items-center justify-center mb-4">
      <AlertCircle className="w-6 h-6" />
    </div>
    <h3 className="text-sm font-extrabold text-ink dark:text-white">{title}</h3>
    <p className="text-xs text-ink/55 dark:text-white/50 mt-1.5 max-w-sm leading-relaxed">
      {description}
    </p>
    {onRetry && (
      <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
        <RefreshCw className="w-3.5 h-3.5" />
        Tentar novamente
      </Button>
    )}
  </div>
);
