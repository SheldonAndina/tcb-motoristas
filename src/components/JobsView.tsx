import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  MapPin,
  Calendar,
  Users,
  Award,
  CheckCircle2,
  Clock,
  XCircle,
  Edit,
  Eye,
  Trash2,
  PlusCircle,
  X,
  Building,
  ArrowRight,
} from 'lucide-react';
import { JobOpening, JobStatus, LicenseCategory, MozambiqueProvince } from '../types';

interface JobsViewProps {
  jobs: JobOpening[];
  onOpenCreateJob: () => void;
  onEditJob: (job: JobOpening) => void;
  onCloseJob: (jobId: string) => void;
  onSelectJob: (job: JobOpening) => void;
  onNavigateApplications: () => void;
}

export const JobsView: React.FC<JobsViewProps> = ({
  jobs,
  onOpenCreateJob,
  onEditJob,
  onCloseJob,
  onSelectJob,
  onNavigateApplications,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredJobs = jobs.filter((j) => {
    if (filterStatus === 'ALL') return true;
    return j.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white dark:bg-ink-soft border border-gray-200 dark:border-white/[0.08] rounded-md p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">
            PORTAL DE VAGAS CORPORATIVAS
          </span>
          <h2 className="text-lg font-black text-black dark:text-white tracking-tight mt-0.5">
            Gestão de Vagas de Recrutamento TCB
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
            Oportunidades corporativas abertas para admissão de novos motoristas de frota
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-gray-50 dark:bg-ink-muted border border-gray-200 dark:border-white/10 rounded-md text-xs font-bold text-black dark:text-white focus:outline-none"
          >
            <option value="ALL">Todas as Vagas</option>
            <option value="Aberta">Abertas</option>
            <option value="Em Seleção">Em Seleção</option>
            <option value="Fechada">Fechadas</option>
          </select>

          <button
            onClick={onOpenCreateJob}
            className="flex items-center gap-1.5 px-4 py-2 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black text-xs font-bold rounded-md transition-colors uppercase tracking-wider shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Nova Vaga</span>
          </button>
        </div>
      </div>

      {/* Candidate Apply From Home Info Banner */}
      <div className="bg-emerald-950/80 border border-emerald-800/80 text-emerald-100 rounded-md p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-md shrink-0">
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-white">
              Candidatura de Casa para Motoristas Activa
            </p>
            <p className="text-[11px] text-emerald-200/90 mt-0.5">
              Os motoristas podem consultar e candidatar-se diretamente de casa a estas vagas pelo Portal do Candidato sem precisar de credenciais.
            </p>
          </div>
        </div>
      </div>

      {/* Jobs Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white dark:bg-ink-soft border border-slate-200/80 dark:border-white/[0.08] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-900 dark:hover:border-white transition-all duration-200 flex flex-col justify-between space-y-5 group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2.5 py-1 bg-slate-100 dark:bg-ink-muted rounded-md">
                  {job.code}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    job.status === 'Aberta'
                      ? 'bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                      : job.status === 'Em Seleção'
                      ? 'bg-amber-100/80 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                      : 'bg-slate-100 dark:bg-ink-muted text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {job.status}
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug group-hover:text-black dark:group-hover:text-slate-100 transition-colors">
                {job.title}
              </h3>

              <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300 font-medium bg-slate-50/80 dark:bg-ink-muted p-4 rounded-xl border border-slate-100 dark:border-white/[0.08]">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span>
                    {job.location} ({job.province})
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Award className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span>Exigência: <strong className="text-slate-900 dark:text-white font-extrabold">{job.category}</strong> • Mín. {job.experienceYears} Anos Exp.</span>
                </div>

                {job.salaryRange && (
                  <div className="pt-1.5 flex items-center justify-between border-t border-slate-200/60 dark:border-white/10/60 mt-2">
                    <span className="text-[10px] uppercase font-extrabold text-slate-400 dark:text-slate-500 tracking-wider">Remuneração:</span>
                    <span className="text-[11px] font-extrabold text-slate-900 dark:text-white bg-white dark:bg-ink-muted px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-white/10 inline-block uppercase tracking-wider font-mono">
                      {job.salaryRange}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-3.5 leading-relaxed font-medium">
                {job.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/[0.08] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold">
                <div className="p-1.5 bg-slate-100 dark:bg-ink-muted rounded-lg">
                  <Users className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                </div>
                <span>{job.candidatesCount} Candidato(s)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onSelectJob(job)}
                  className="px-3.5 py-2 bg-gradient-to-r from-slate-900 to-black dark:from-white dark:to-slate-100 text-white dark:text-black hover:from-black hover:to-slate-900 font-extrabold rounded-xl transition-all flex items-center gap-1.5 uppercase tracking-wider text-[10px] shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Detalhes</span>
                </button>

                <button
                  onClick={() => onEditJob(job)}
                  className="p-2 bg-slate-100 dark:bg-ink-muted hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white rounded-xl transition-colors"
                  title="Editar Vaga"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>

                {job.status !== 'Fechada' && (
                  <button
                    onClick={() => onCloseJob(job.id)}
                    className="p-2 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 rounded-xl transition-colors"
                    title="Fechar Vaga"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
