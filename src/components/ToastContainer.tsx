import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, Info, X } from 'lucide-react';
import { Toast } from '../types';

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-success shrink-0" />,
          error: <XCircle className="w-5 h-5 text-danger shrink-0" />,
          warning: <AlertCircle className="w-5 h-5 text-accent shrink-0" />,
          info: <Info className="w-5 h-5 text-ink dark:text-white shrink-0" />,
        };

        const bgStyles = {
          success:
            'bg-white dark:bg-ink-soft border-emerald-300/80 dark:border-emerald-500/30',
          error: 'bg-white dark:bg-ink-soft border-red-300/80 dark:border-red-500/30',
          warning:
            'bg-white dark:bg-ink-soft border-amber-300/80 dark:border-accent/40',
          info: 'bg-white dark:bg-ink-soft border-ink/15 dark:border-white/15',
        };

        return (
          <div
            key={toast.id}
            className={`p-3.5 border rounded-xl flex items-start justify-between gap-3 pointer-events-auto shadow-lg tcb-toast-enter ${bgStyles[toast.type]}`}
          >
            <div className="flex items-start gap-2.5">
              {icons[toast.type]}
              <div>
                <p className="text-xs font-bold text-ink dark:text-white">{toast.title}</p>
                <p className="text-[11px] text-ink/60 dark:text-white/55 mt-0.5 leading-snug">
                  {toast.message}
                </p>
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 text-ink/35 dark:text-white/35 hover:text-ink dark:hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
