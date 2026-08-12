import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Filter,
  Search,
  FileText,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { Driver, DriverDocument, DocumentStatus } from '../types';

interface DocumentsManagementViewProps {
  drivers: Driver[];
  onSelectDriver: (driverId: string) => void;
  onValidateDocument: (driverId: string, docId: string, newStatus: DocumentStatus) => void;
  onPreviewDocument: (doc: DriverDocument) => void;
}

export const DocumentsManagementView: React.FC<DocumentsManagementViewProps> = ({
  drivers,
  onSelectDriver,
  onValidateDocument,
  onPreviewDocument,
}) => {
  const [filterDocStatus, setFilterDocStatus] = useState<string>('Pendente');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Flatten all documents with driver context
  const allDocsWithDriver = drivers.flatMap((d) =>
    d.documents.map((doc) => ({
      ...doc,
      driverId: d.id,
      driverName: d.fullName,
      driverPhoto: d.photo,
      driverPhone: d.phone,
      driverBI: d.biNumber,
    }))
  );

  const filteredDocs = allDocsWithDriver.filter((doc) => {
    const matchStatus = filterDocStatus === 'ALL' || doc.status === filterDocStatus;
    const matchSearch =
      searchTerm === '' ||
      doc.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
              GESTÃO DOCUMENTAL
            </span>
            <h2 className="text-lg font-black text-black tracking-tight mt-0.5">
              Validação e Controlo de Documentos TCB
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Controlo centralizado de BIs, Cartas de Condução, Atestados e Registos Criminais
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterDocStatus}
              onChange={(e) => setFilterDocStatus(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-xs font-bold text-black focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="ALL">Todos os Documentos</option>
              <option value="Pendente">Pendentes de Validação</option>
              <option value="Válido">Validados / Aprovados</option>
              <option value="Rejeitado">Rejeitados</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por nome do motorista ou nome do documento..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-xs font-medium text-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      {/* Documents Grid List */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white dark:bg-ink-soft border border-slate-200/80 dark:border-white/[0.08] rounded-2xl p-12 text-center shadow-sm">
          <FileCheck className="w-10 h-10 text-slate-300 dark:text-zinc-700 mx-auto mb-2" />
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Nenhum documento encontrado
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            Não existem ficheiros na categoria selecionada ({filterDocStatus}).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-ink-soft border border-slate-200/80 dark:border-white/[0.08] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-900 dark:hover:border-white transition-all duration-200 flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2.5 py-0.5 bg-slate-100 dark:bg-ink-muted rounded-md">
                    {doc.type}
                  </span>
                  <span
                    className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      doc.status === 'Válido'
                        ? 'bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                        : doc.status === 'Rejeitado'
                        ? 'bg-red-100/80 dark:bg-red-950/60 text-red-700 dark:text-red-400'
                        : 'bg-amber-100/80 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={doc.driverPhoto}
                    alt={doc.driverName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-white/10 shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0">
                    <button
                      onClick={() => onSelectDriver(doc.driverId)}
                      className="text-xs font-black text-slate-900 dark:text-white hover:underline block text-left truncate"
                    >
                      {doc.driverName}
                    </button>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-bold">
                      BI: {doc.driverBI}
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 p-3.5 bg-slate-50/80 dark:bg-ink-muted border border-slate-100 dark:border-white/[0.08] rounded-xl text-xs space-y-1 font-medium">
                  <p className="font-extrabold text-slate-900 dark:text-white">{doc.name}</p>
                  <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-medium">
                    {doc.fileName} ({doc.fileSize})
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    Submetido em {doc.uploadDate}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/[0.08] flex items-center justify-between gap-2">
                <button
                  onClick={() => onPreviewDocument(doc)}
                  className="px-3 py-2 bg-slate-100 dark:bg-ink-muted hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 uppercase tracking-wider text-[10px] transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver Ficheiro</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      onValidateDocument(doc.driverId, doc.id, 'Válido')
                    }
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold rounded-xl uppercase tracking-wider transition-all shadow-2xs"
                  >
                    Aprovar
                  </button>

                  <button
                    onClick={() =>
                      onValidateDocument(doc.driverId, doc.id, 'Rejeitado')
                    }
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] font-extrabold rounded-xl uppercase tracking-wider transition-all shadow-2xs"
                  >
                    Rejeitar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
