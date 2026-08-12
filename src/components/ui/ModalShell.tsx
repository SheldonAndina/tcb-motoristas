import React from 'react';
import { X } from 'lucide-react';

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
  footer?: React.ReactNode;
}

export const ModalShell: React.FC<ModalShellProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  footer,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-ink/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`bg-white dark:bg-ink-soft rounded-2xl w-full ${maxWidth} shadow-2xl border border-ink/10 dark:border-white/10 max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-start justify-between gap-3 p-5 sm:p-6 border-b border-ink/8 dark:border-white/10 sticky top-0 bg-white/95 dark:bg-ink-soft/95 backdrop-blur-sm z-10">
          <div>
            {subtitle && (
              <span className="text-[10px] font-bold text-ink/40 dark:text-white/40 uppercase tracking-widest block">
                {subtitle}
              </span>
            )}
            <h3 className="text-base font-extrabold text-ink dark:text-white tracking-tight">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-ink/40 hover:text-ink dark:text-white/40 dark:hover:text-white rounded-lg hover:bg-ink/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
        {footer && (
          <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 border-t border-ink/8 dark:border-white/10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
