import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button, TextArea } from './ui';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'primary' | 'warning';
  requiresReason?: boolean;
  onConfirm: (reason?: string) => void;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  confirmVariant = 'danger',
  requiresReason = false,
  onConfirm,
  onClose,
}) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(reason);
    setReason('');
  };

  const variantMap = {
    danger: 'danger' as const,
    primary: 'primary' as const,
    warning: 'accent' as const,
  };

  return (
    <div className="fixed inset-0 bg-ink/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-ink-soft rounded-2xl max-w-md w-full p-6 shadow-xl border border-ink/10 dark:border-white/10 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-danger-muted dark:bg-red-500/15 text-danger rounded-xl shrink-0 border border-red-200 dark:border-red-500/25">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-ink/40 dark:text-white/40 uppercase tracking-widest block">
              Confirmação
            </span>
            <h3 className="text-base font-extrabold text-ink dark:text-white tracking-tight">
              {title}
            </h3>
          </div>
        </div>

        <p className="text-xs text-ink dark:text-white/80 font-medium leading-relaxed bg-paper-muted dark:bg-ink/50 p-3 rounded-xl border border-ink/8 dark:border-white/10">
          {message}
        </p>

        <form onSubmit={handleConfirmSubmit} className="space-y-4 text-xs">
          {requiresReason && (
            <TextArea
              label="Motivo / Justificativa *"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Descreva o motivo desta ação para registo em auditoria…"
              required
            />
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-ink/8 dark:border-white/10">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant={variantMap[confirmVariant]} size="sm">
              {confirmLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
