import React, { useState } from 'react';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  ShieldCheck,
  FileText,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Printer,
  Edit,
  Download,
  Eye,
  Star,
  FileCheck,
  UserCheck,
  Check,
  Building,
} from 'lucide-react';
import { Driver, DriverDocument, DriverStatus, DocumentStatus } from '../types';

interface DriverProfileViewProps {
  driver: Driver;
  onBack: () => void;
  onEdit: (driver: Driver) => void;
  onChangeDriverStatus: (driverId: string, status: DriverStatus, notes?: string) => void;
  onValidateDocument: (driverId: string, documentId: string, status: DocumentStatus) => void;
  onPreviewDocument: (doc: DriverDocument) => void;
}

export const DriverProfileView: React.FC<DriverProfileViewProps> = ({
  driver,
  onBack,
  onEdit,
  onChangeDriverStatus,
  onValidateDocument,
  onPreviewDocument,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'experience'>('overview');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<DriverStatus>(driver.status);
  const [statusNote, setStatusNote] = useState('');

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChangeDriverStatus(driver.id, newStatus, statusNote);
    setShowStatusModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const isLicenseExpiringSoon = () => {
    const expiry = new Date(driver.licenseExpiryDate).getTime();
    const now = new Date().getTime();
    const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return daysLeft < 60;
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-ink-soft hover:bg-paper-muted dark:bg-white/10 border border-ink/10 dark:border-white/10 text-ink dark:text-white text-xs font-bold rounded-xl transition-colors self-start uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar à Lista</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-paper-muted dark:bg-white/10 hover:bg-black hover:text-white text-ink dark:text-white text-xs font-bold rounded-xl border border-ink/10 dark:border-white/10 transition-colors uppercase tracking-wider"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Ficha</span>
          </button>

          <button
            onClick={() => onEdit(driver)}
            className="flex items-center gap-1.5 px-4 py-2 bg-ink hover:bg-ink-soft dark:bg-white dark:text-ink dark:hover:bg-paper-muted text-white text-xs font-bold rounded-xl transition-colors uppercase tracking-wider"
          >
            <Edit className="w-4 h-4" />
            <span>Editar Motorista</span>
          </button>

          <button
            onClick={() => setShowStatusModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-ink text-white hover:bg-ink-soft dark:bg-white dark:text-ink text-xs font-bold rounded-xl transition-colors uppercase tracking-wider"
          >
            <UserCheck className="w-4 h-4" />
            <span>Alterar Estado</span>
          </button>
        </div>
      </div>

      {/* Main Header Profile Card */}
      <div className="bg-white dark:bg-ink-soft border border-ink/10 dark:border-white/10 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <img
              src={driver.photo}
              alt={driver.fullName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border-2 border-ink/10 dark:border-white/10 shrink-0"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-black text-ink dark:text-white tracking-tight">
                  {driver.fullName}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    driver.status === 'Aprovado'
                      ? 'bg-[#D1FAE5] text-[#059669]'
                      : driver.status === 'Rejeitado'
                      ? 'bg-[#FEE2E2] text-[#DC2626]'
                      : 'bg-[#FEF3C7] text-[#D97706]'
                  }`}
                >
                  {driver.status}
                </span>
              </div>

              <p className="text-xs font-bold text-ink/60 dark:text-white/55 uppercase tracking-wider">
                {driver.licenseCategory} • ID: {driver.id}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-ink/60 dark:text-white/55 font-medium">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-ink/40 dark:text-white/40" />
                  {driver.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-ink/40 dark:text-white/40" />
                  {driver.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-ink/40 dark:text-white/40" />
                  {driver.city}, {driver.province}
                </span>
              </div>
            </div>
          </div>

          {/* Key Quick Badges */}
          <div className="bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 p-4 rounded-xl space-y-2 shrink-0 md:w-64">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink/40 dark:text-white/40 font-bold uppercase tracking-wider text-[10px]">Experiência:</span>
              <span className="font-extrabold text-ink dark:text-white">
                {driver.experienceYears} Anos
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink/40 dark:text-white/40 font-bold uppercase tracking-wider text-[10px]">Nº da Carta:</span>
              <span className="font-mono font-bold text-ink dark:text-white">
                {driver.licenseNumber}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink/40 dark:text-white/40 font-bold uppercase tracking-wider text-[10px]">Validade Carta:</span>
              <span
                className={`font-mono font-bold ${
                  isLicenseExpiringSoon() ? 'text-[#D97706]' : 'text-ink dark:text-white'
                }`}
              >
                {driver.licenseExpiryDate}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-ink/10 dark:border-white/10">
              <span className="text-ink/40 dark:text-white/40 font-bold uppercase tracking-wider text-[10px]">Candidatado em:</span>
              <span className="font-mono text-ink/70 dark:text-white/65">{driver.applicationDate}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 pt-4 border-t border-ink/10 dark:border-white/10 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors uppercase tracking-wider ${
              activeTab === 'overview'
                ? 'bg-black text-white'
                : 'bg-paper-muted dark:bg-white/10 text-ink dark:text-white hover:bg-paper-muted dark:hover:bg-white/15'
            }`}
          >
            Visão Geral & Dados
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 uppercase tracking-wider ${
              activeTab === 'documents'
                ? 'bg-black text-white'
                : 'bg-paper-muted dark:bg-white/10 text-ink dark:text-white hover:bg-paper-muted dark:hover:bg-white/15'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Documentos Enviados ({driver.documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('experience')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 uppercase tracking-wider ${
              activeTab === 'experience'
                ? 'bg-black text-white'
                : 'bg-paper-muted dark:bg-white/10 text-ink dark:text-white hover:bg-paper-muted dark:hover:bg-white/15'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Histórico Profissional</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Info Box */}
          <div className="lg:col-span-2 bg-white dark:bg-ink-soft border border-ink/10 dark:border-white/10 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-ink dark:text-white border-b border-ink/8 dark:border-white/10 pb-2 uppercase tracking-wider">
              Informações Pessoais & Contactos
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-ink/40 dark:text-white/40 font-bold uppercase tracking-widest text-[10px] block">Nome Completo</span>
                <span className="font-bold text-ink dark:text-white text-sm">
                  {driver.fullName}
                </span>
              </div>

              <div>
                <span className="text-ink/40 dark:text-white/40 font-bold uppercase tracking-widest text-[10px] block">
                  Número de BI / NUIT
                </span>
                <span className="font-mono font-bold text-ink dark:text-white">
                  BI: {driver.biNumber} • NUIT: {driver.nuitNumber}
                </span>
              </div>

              <div>
                <span className="text-ink/40 dark:text-white/40 font-bold uppercase tracking-widest text-[10px] block">Telefone Primário</span>
                <span className="font-mono font-bold text-ink dark:text-white">
                  {driver.phone}
                </span>
              </div>

              <div>
                <span className="text-ink/40 dark:text-white/40 font-bold uppercase tracking-widest text-[10px] block">Email Corporativo/Pessoal</span>
                <span className="font-medium text-ink dark:text-white">{driver.email}</span>
              </div>

              <div>
                <span className="text-ink/40 dark:text-white/40 font-bold uppercase tracking-widest text-[10px] block">Data de Nascimento</span>
                <span className="font-medium text-ink dark:text-white">{driver.birthDate}</span>
              </div>

              <div>
                <span className="text-ink/40 dark:text-white/40 font-bold uppercase tracking-widest text-[10px] block">Género</span>
                <span className="font-medium text-ink dark:text-white">{driver.gender}</span>
              </div>

              <div>
                <span className="text-ink/40 dark:text-white/40 font-bold uppercase tracking-widest text-[10px] block">Província / Cidade</span>
                <span className="font-medium text-ink dark:text-white">
                  {driver.city}, {driver.province}
                </span>
              </div>

              <div>
                <span className="text-ink/40 dark:text-white/40 font-bold uppercase tracking-widest text-[10px] block">Morada Completa</span>
                <span className="font-medium text-ink dark:text-white">{driver.address}</span>
              </div>
            </div>

            {driver.bio && (
              <div className="pt-3 border-t border-ink/8 dark:border-white/10">
                <span className="text-ink/40 dark:text-white/40 font-bold uppercase tracking-widest text-[10px] block mb-1">
                  Resumo / Apresentação do Motorista
                </span>
                <p className="text-xs text-ink/80 dark:text-white/80 bg-paper-muted dark:bg-ink/50 p-3 rounded-xl border border-ink/10 dark:border-white/10 font-medium">
                  {driver.bio}
                </p>
              </div>
            )}
          </div>

          {/* License & Evaluation Card */}
          <div className="bg-white dark:bg-ink-soft border border-ink/10 dark:border-white/10 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-ink dark:text-white border-b border-ink/8 dark:border-white/10 pb-2 uppercase tracking-wider">
              Carta de Condução & Avaliação
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-paper-muted dark:bg-ink/50 rounded-xl border border-ink/10 dark:border-white/10">
                <span className="text-ink/40 dark:text-white/40 font-bold uppercase tracking-widest text-[10px] block">Categoria Oficial</span>
                <span className="text-sm font-black text-ink dark:text-white">
                  {driver.licenseCategory}
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 border border-ink/10 dark:border-white/10 rounded-xl">
                <span className="text-ink/40 dark:text-white/40 font-bold uppercase tracking-wider text-[10px]">Emissão:</span>
                <span className="font-mono font-bold text-ink dark:text-white">
                  {driver.licenseIssueDate}
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 border border-ink/10 dark:border-white/10 rounded-xl">
                <span className="text-ink/40 dark:text-white/40 font-bold uppercase tracking-wider text-[10px]">Validade:</span>
                <span className="font-mono font-bold text-ink dark:text-white">
                  {driver.licenseExpiryDate}
                </span>
              </div>

              {driver.notes && (
                <div className="p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl text-[#92400E]">
                  <span className="font-bold block text-[10px] uppercase tracking-wider">
                    Notas de Avaliação TCB
                  </span>
                  <p className="text-xs mt-1 font-medium">{driver.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-white dark:bg-ink-soft border border-ink/10 dark:border-white/10 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-ink/8 dark:border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-bold text-ink/40 dark:text-white/40 uppercase tracking-widest block">DOCUMENTAÇÃO</span>
              <h3 className="text-sm font-black text-ink dark:text-white">
                Validação de Documentos Oficiais
              </h3>
              <p className="text-xs text-ink/50 dark:text-white/45 font-medium">
                Verifique a autenticidade dos ficheiros submetidos pelo candidato
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {driver.documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 border border-ink/10 dark:border-white/10 rounded-xl bg-paper-muted dark:bg-ink/50/50 hover:bg-white dark:bg-ink-soft transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-black text-white rounded-xl shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink dark:text-white">{doc.name}</h4>
                      <p className="text-[10px] text-ink/50 dark:text-white/45 font-mono">
                        {doc.fileName} ({doc.fileSize})
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      doc.status === 'Válido'
                        ? 'bg-[#D1FAE5] text-[#059669]'
                        : doc.status === 'Rejeitado'
                        ? 'bg-[#FEE2E2] text-[#DC2626]'
                        : 'bg-[#FEF3C7] text-[#D97706]'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>

                {doc.notes && (
                  <p className="text-[11px] text-ink/70 dark:text-white/65 bg-white dark:bg-ink-soft p-2 rounded border border-ink/10 dark:border-white/10 italic font-medium">
                    "{doc.notes}"
                  </p>
                )}

                <div className="pt-2 border-t border-ink/10 dark:border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onPreviewDocument(doc)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-ink-soft hover:bg-black hover:text-white text-ink dark:text-white text-[10px] font-bold rounded-xl border border-ink/15 dark:border-white/15 uppercase tracking-wider transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Visualizar Ficheiro</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onValidateDocument(driver.id, doc.id, 'Válido')}
                      className="px-2.5 py-1.5 bg-[#059669] hover:bg-emerald-700 text-white text-[10px] font-bold rounded uppercase tracking-wider flex items-center gap-1"
                      title="Aprovar Documento"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Validar</span>
                    </button>

                    <button
                      onClick={() => onValidateDocument(driver.id, doc.id, 'Rejeitado')}
                      className="px-2.5 py-1.5 bg-[#DC2626] hover:bg-red-700 text-white text-[10px] font-bold rounded uppercase tracking-wider flex items-center gap-1"
                      title="Rejeitar Documento"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Rejeitar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'experience' && (
        <div className="bg-white dark:bg-ink-soft border border-ink/10 dark:border-white/10 rounded-xl p-6 shadow-sm space-y-4">
          <span className="text-[10px] font-bold text-ink/40 dark:text-white/40 uppercase tracking-widest block">HISTÓRICO</span>
          <h3 className="text-sm font-black text-ink dark:text-white border-b border-ink/8 dark:border-white/10 pb-3">
            Histórico e Experiência Anterior em Transportes
          </h3>

          {driver.workHistory.length === 0 ? (
            <p className="text-xs text-ink/50 dark:text-white/45 italic font-medium">
              Nenhuma experiência profissional anterior registrada.
            </p>
          ) : (
            <div className="space-y-4">
              {driver.workHistory.map((work) => (
                <div
                  key={work.id}
                  className="p-4 border border-ink/10 dark:border-white/10 rounded-xl bg-paper-muted dark:bg-ink/50/50 space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-ink dark:text-white" />
                      <h4 className="text-xs font-black text-ink dark:text-white">
                        {work.companyName}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-ink/50 dark:text-white/45 uppercase tracking-wider">
                      {work.startDate} — {work.endDate}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-ink dark:text-white uppercase tracking-wider">
                    Função: {work.roleTitle}
                  </p>
                  <p className="text-xs text-ink/70 dark:text-white/65 font-medium">
                    <strong>Veículos Operados:</strong> {work.vehicleTypes}
                  </p>
                  <p className="text-xs text-ink/70 dark:text-white/65 leading-relaxed font-medium">
                    <strong>Responsabilidades:</strong> {work.responsibilities}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Alterar Estado Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-ink/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-ink-soft rounded-xl max-w-md w-full p-6 shadow-2xl border border-ink/10 dark:border-white/10">
            <span className="text-[10px] font-bold text-ink/40 dark:text-white/40 uppercase tracking-widest block">RECRUTAMENTO TCB</span>
            <h3 className="text-base font-black text-ink dark:text-white mb-1">
              Alterar Estado do Motorista
            </h3>
            <p className="text-xs text-ink/50 dark:text-white/45 font-medium mb-4">
              Atualize o estado de recrutamento de <strong>{driver.fullName}</strong>.
            </p>

            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider mb-1">
                  Novo Estado
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as DriverStatus)}
                  className="w-full px-3 py-2 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl text-xs font-bold text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  <option value="Pendente">Pendente (Aguardando)</option>
                  <option value="Em análise">Em análise pela equipa de RH</option>
                  <option value="Aprovado">Aprovado para contratação</option>
                  <option value="Rejeitado">Rejeitado / Inapto</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider mb-1">
                  Justificativa / Observações
                </label>
                <textarea
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Introduza notas para a equipa TCB..."
                  className="w-full p-2.5 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl text-xs text-ink dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-3.5 py-2 text-[10px] font-bold text-ink dark:text-white bg-paper-muted dark:bg-white/10 hover:bg-paper-muted dark:hover:bg-white/15 rounded-xl uppercase tracking-wider"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ink hover:bg-ink-soft dark:bg-white dark:text-ink dark:hover:bg-paper-muted text-white text-[10px] font-bold rounded-xl uppercase tracking-wider"
                >
                  Confirmar Estado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
