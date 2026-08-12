import React from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Briefcase,
  GitPullRequest,
  ArrowUpRight,
  PlusCircle,
  MapPin,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Driver, JobOpening, CandidateApplication, ActivePage } from '../types';
import { StatusBadge } from './ui';

interface DashboardViewProps {
  drivers: Driver[];
  jobs: JobOpening[];
  applications: CandidateApplication[];
  onNavigate: (page: ActivePage) => void;
  onSelectDriver: (driverId: string) => void;
  onOpenDriverForm: () => void;
  onOpenJobForm: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  drivers,
  jobs,
  applications,
  onNavigate,
  onSelectDriver,
  onOpenDriverForm,
  onOpenJobForm,
}) => {
  const totalDrivers = drivers.length;
  const approvedDrivers = drivers.filter((d) => d.status === 'Aprovado').length;
  const pendingDrivers = drivers.filter(
    (d) => d.status === 'Pendente' || d.status === 'Em análise'
  ).length;
  const rejectedDrivers = drivers.filter((d) => d.status === 'Rejeitado').length;
  const openJobs = jobs.filter((j) => j.status === 'Aberta' || j.status === 'Em Seleção').length;
  const totalApplications = applications.length;

  const categoryCounts = {
    CE: drivers.filter((d) => d.licenseCategory.includes('CE')).length,
    C: drivers.filter((d) => d.licenseCategory === 'Carta C (Pesados)').length,
    D: drivers.filter((d) => d.licenseCategory.includes('D')).length,
    C1: drivers.filter((d) => d.licenseCategory === 'Carta C1').length,
  };

  const pendingDocsCount = drivers.reduce(
    (acc, d) => acc + d.documents.filter((doc) => doc.status === 'Pendente').length,
    0
  );

  const kpis = [
    {
      label: 'Motoristas',
      value: totalDrivers,
      hint: 'Registados',
      icon: Users,
      page: 'drivers' as ActivePage,
    },
    {
      label: 'Aprovados',
      value: approvedDrivers,
      hint:
        totalDrivers > 0
          ? `${Math.round((approvedDrivers / totalDrivers) * 100)}% aptos`
          : '0% aptos',
      icon: CheckCircle2,
      page: 'drivers' as ActivePage,
      tone: 'success' as const,
    },
    {
      label: 'Em análise',
      value: pendingDrivers,
      hint: 'Pendentes',
      icon: Clock,
      page: 'drivers' as ActivePage,
      tone: 'warning' as const,
    },
    {
      label: 'Rejeitados',
      value: rejectedDrivers,
      hint: 'Inaptos',
      icon: XCircle,
      page: 'drivers' as ActivePage,
      tone: 'danger' as const,
    },
    {
      label: 'Vagas abertas',
      value: openJobs,
      hint: 'Em seleção',
      icon: Briefcase,
      page: 'jobs' as ActivePage,
    },
    {
      label: 'Candidaturas',
      value: totalApplications,
      hint: 'No funil',
      icon: GitPullRequest,
      page: 'applications' as ActivePage,
    },
  ];

  const toneIcon: Record<string, string> = {
    success: 'text-success',
    warning: 'text-accent',
    danger: 'text-danger',
  };

  return (
    <div className="space-y-6">
      {/* Header strip — flat, no glow */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-1">
        <div>
          <p className="text-[11px] font-semibold text-accent tracking-wide mb-1">
            TCB Moçambique
          </p>
          <h2 className="text-2xl sm:text-[1.75rem] font-semibold text-ink dark:text-white tracking-tight">
            Recrutamento & frota
          </h2>
          <p className="text-sm text-ink/50 dark:text-white/45 mt-1 max-w-lg">
            Admissão de motoristas, validação INATRO e vagas activas.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenDriverForm}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink dark:bg-white text-white dark:text-ink text-[12px] font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            <PlusCircle className="w-4 h-4" />
            Cadastrar motorista
          </button>
          <button
            onClick={onOpenJobForm}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-ink/15 dark:border-white/15 text-ink dark:text-white text-[12px] font-semibold rounded-lg hover:bg-ink/5 dark:hover:bg-white/5 transition-colors"
          >
            <Briefcase className="w-4 h-4" />
            Criar vaga
          </button>
        </div>
      </div>

      {/* KPIs — solid panels, no gradients */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <button
              key={kpi.label}
              type="button"
              onClick={() => onNavigate(kpi.page)}
              className="text-left tcb-panel rounded-xl p-4 hover:border-ink/20 dark:hover:border-white/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-ink/45 dark:text-white/40">
                  {kpi.label}
                </span>
                <Icon
                  className={`w-4 h-4 ${
                    kpi.tone ? toneIcon[kpi.tone] : 'text-ink/35 dark:text-white/35'
                  }`}
                />
              </div>
              <p className="text-2xl font-semibold text-ink dark:text-white tracking-tight tabular-nums">
                {kpi.value}
              </p>
              <p className="text-[11px] text-ink/40 dark:text-white/35 mt-1">{kpi.hint}</p>
            </button>
          );
        })}
      </div>

      {pendingDocsCount > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-accent/25 dark:border-accent/35 bg-accent/[0.07] dark:bg-accent/[0.12] px-5 py-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-ink dark:text-white">
                {pendingDocsCount} documento(s) por validar
              </p>
              <p className="text-xs text-ink/55 dark:text-white/50 mt-1 leading-relaxed">
                Cartas e BIs aguardam verificação da equipa de recrutamento.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('documents')}
            className="shrink-0 px-5 py-2.5 text-[12px] font-semibold rounded-lg bg-ink dark:bg-white text-white dark:text-ink hover:opacity-90"
          >
            Validar agora
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="tcb-panel rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-ink dark:text-white">
              Frota por carta
            </h3>
            <span className="text-[10px] font-medium text-ink/35 dark:text-white/30 tracking-wide">
              INATRO
            </span>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Carta CE — articulados', count: categoryCounts.CE },
              { label: 'Carta C — pesados', count: categoryCounts.C },
              { label: 'Carta D — autocarros', count: categoryCounts.D },
              { label: 'Carta C1 — ligeiros', count: categoryCounts.C1 },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex justify-between text-xs text-ink dark:text-white mb-1.5">
                  <span className="font-medium">{row.label}</span>
                  <span className="font-mono text-ink/50 dark:text-white/45">{row.count}</span>
                </div>
                <div className="w-full bg-ink/5 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-ink/70 dark:bg-white/70 h-full rounded-full"
                    style={{
                      width: `${totalDrivers > 0 ? (row.count / totalDrivers) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('drivers')}
            className="mt-5 pt-4 border-t border-ink/8 dark:border-white/[0.08] w-full flex items-center justify-between text-xs font-medium text-ink/55 dark:text-white/45 hover:text-ink dark:hover:text-white"
          >
            Ver lista completa
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="lg:col-span-2 tcb-panel rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-ink dark:text-white">
                Vagas abertas
              </h3>
              <p className="text-xs text-ink/45 dark:text-white/40 mt-0.5">
                Oportunidades activas de recrutamento
              </p>
            </div>
            <button
              onClick={() => onNavigate('jobs')}
              className="text-xs font-medium text-ink/55 dark:text-white/45 hover:text-ink dark:hover:text-white inline-flex items-center gap-1"
            >
              Gerir ({jobs.length})
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {jobs.slice(0, 4).map((job) => (
              <div
                key={job.id}
                className="p-4 border border-ink/8 dark:border-white/[0.08] rounded-lg hover:border-ink/20 dark:hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono text-ink/35 dark:text-white/30">
                    {job.code}
                  </span>
                  <StatusBadge status={job.status} />
                </div>
                <p className="text-sm font-semibold text-ink dark:text-white line-clamp-1">
                  {job.title}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-ink/45 dark:text-white/40">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.location}
                  </span>
                  <span>·</span>
                  <span>{job.category}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-ink/6 dark:border-white/[0.06] flex items-center justify-between text-[11px]">
                  <span className="text-ink/40 dark:text-white/35 font-mono">
                    {job.candidatesCount} candidato(s)
                  </span>
                  <button
                    onClick={() => onNavigate('applications')}
                    className="font-medium text-ink dark:text-white hover:underline"
                  >
                    Ver candidaturas
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tcb-panel rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-ink dark:text-white">
              Candidaturas recentes
            </h3>
            <p className="text-xs text-ink/45 dark:text-white/40 mt-0.5">
              Últimos processos submetidos
            </p>
          </div>
          <button
            onClick={() => onNavigate('applications')}
            className="text-xs font-medium text-ink/55 dark:text-white/45 hover:text-ink dark:hover:text-white inline-flex items-center gap-1"
          >
            Ver funil completo
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-left text-sm">
            <thead className="text-[11px] font-medium text-ink/40 dark:text-white/35 border-b border-ink/8 dark:border-white/[0.08]">
              <tr>
                <th className="py-2.5 px-3 font-medium">Motorista</th>
                <th className="py-2.5 px-3 font-medium">Vaga</th>
                <th className="py-2.5 px-3 font-medium">Carta</th>
                <th className="py-2.5 px-3 font-medium">Data</th>
                <th className="py-2.5 px-3 font-medium">Fase</th>
                <th className="py-2.5 px-3 font-medium text-right"> </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5 dark:divide-white/[0.05]">
              {applications.slice(0, 5).map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-ink/[0.02] dark:hover:bg-white/[0.02]"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.driverPhoto}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-ink dark:text-white text-[13px]">
                          {app.driverName}
                        </p>
                        <p className="text-[11px] font-mono text-ink/40 dark:text-white/35">
                          {app.driverPhone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-[13px] text-ink dark:text-white truncate max-w-[220px]">
                      {app.jobTitle}
                    </p>
                    <p className="text-[11px] text-ink/40 dark:text-white/35">
                      {app.jobLocation}
                    </p>
                  </td>
                  <td className="py-3 px-3 text-[12px] text-ink/70 dark:text-white/65">
                    {app.driverCategory}
                  </td>
                  <td className="py-3 px-3 text-[12px] font-mono text-ink/45 dark:text-white/40">
                    {app.appliedDate}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={app.stage} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectDriver(app.driverId)}
                      className="px-3 py-1.5 text-[11px] font-semibold rounded-lg border border-ink/12 dark:border-white/12 text-ink dark:text-white hover:bg-ink/5 dark:hover:bg-white/5"
                    >
                      Perfil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
