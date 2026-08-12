import React from 'react';
import { X, FileText, Check, XCircle, ShieldCheck, Download, AlertCircle } from 'lucide-react';
import { DriverDocument, DocumentStatus } from '../types';

interface DocumentViewerModalProps {
  document: DriverDocument | null;
  onClose: () => void;
  onValidate: (docId: string, status: DocumentStatus) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document: doc,
  onClose,
  onValidate,
}) => {
  if (!doc) return null;

  return (
    <div className="fixed inset-0 bg-ink/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-ink-soft rounded-xl max-w-xl w-full p-6 shadow-xl border border-ink/10 dark:border-white/10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink/8 dark:border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black text-white rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-ink/40 dark:text-white/40 uppercase tracking-widest block">VISUALIZADOR DE DOCUMENTO</span>
              <h3 className="text-sm font-extrabold text-ink dark:text-white">{doc.name}</h3>
              <p className="text-[10px] text-ink/40 dark:text-white/40 font-mono">
                {doc.fileName} • {doc.fileSize}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-ink/40 dark:text-white/40 hover:text-ink dark:text-white rounded-xl hover:bg-paper-muted dark:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simulated Document Preview Canvas */}
        <div className="bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl p-6 min-h-[200px] flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-16 h-16 bg-white dark:bg-ink-soft rounded-xl border border-ink/10 dark:border-white/10 flex items-center justify-center text-ink dark:text-white shadow-xs">
            <ShieldCheck className="w-8 h-8 text-ink dark:text-white" />
          </div>

          <div>
            <span className="text-xs font-bold text-ink dark:text-white uppercase tracking-wider block">
              Documento Oficial TCB Moçambique
            </span>
            <span className="text-[10px] text-ink/50 dark:text-white/45 font-medium block mt-0.5">
              Tipo: {doc.type} • Carregado em: {doc.uploadDate}
            </span>
          </div>

          <div className="px-3 py-1 bg-white dark:bg-ink-soft rounded-xl border border-ink/10 dark:border-white/10 text-[10px] font-mono font-bold text-ink dark:text-white uppercase tracking-wider shadow-2xs">
            Digitalização Verificada • ID: {doc.id}
          </div>
        </div>

        {/* Status Badge & Actions */}
        <div className="p-3 bg-paper-muted dark:bg-ink/50 rounded-xl border border-ink/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[10px] font-bold text-ink/40 dark:text-white/40 uppercase tracking-widest block">Estado Atual</span>
            <span
              className={`font-bold inline-block mt-0.5 text-[10px] uppercase tracking-wider ${
                doc.status === 'Válido'
                  ? 'text-[#059669]'
                  : doc.status === 'Rejeitado'
                  ? 'text-[#DC2626]'
                  : 'text-[#D97706]'
              }`}
            >
              {doc.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onValidate(doc.id, 'Válido');
                onClose();
              }}
              className="px-3 py-1.5 bg-[#059669] hover:bg-emerald-700 text-white text-[10px] font-bold rounded-xl uppercase tracking-wider flex items-center gap-1 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Aprovar</span>
            </button>

            <button
              onClick={() => {
                onValidate(doc.id, 'Rejeitado');
                onClose();
              }}
              className="px-3 py-1.5 bg-[#DC2626] hover:bg-red-700 text-white text-[10px] font-bold rounded-xl uppercase tracking-wider flex items-center gap-1 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Rejeitar</span>
            </button>
          </div>
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-paper-muted dark:bg-white/10 hover:bg-paper-muted dark:hover:bg-white/15 text-ink dark:text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
