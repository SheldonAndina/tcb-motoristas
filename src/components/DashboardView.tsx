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
  Calendar,
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
    { label: 'Motoristas', value: totalDrivers, hint: 'Registados', icon: Users, page: 'drivers' as ActivePage },
    {
      label: 'Aprovados', value: approvedDrivers,
      hint: totalDrivers > 0 ? `${Math.round((approvedDrivers / totalDrivers) * 100)}% aptos` : '0% aptos',
      icon: CheckCircle2, page: 'drivers' as ActivePage, tone: 'success' as const,
    },
    { label: 'Em análise', value: pendingDrivers, hint: 'Pendentes', icon: Clock, page: 'drivers' as ActivePage, tone: 'warning' as const },
    { label: 'Rejeitados', value: rejectedDrivers, hint: 'Inaptos', icon: XCircle, page: 'drivers' as ActivePage, tone: 'danger' as const },
    { label: 'Vagas abertas', value: openJobs, hint: 'Em seleção', icon: Briefcase, page: 'jobs' as ActivePage },
    { label: 'Candidaturas', value: totalApplications, hint: 'No funil', icon: GitPullRequest, page: 'applications' as ActivePage },
  ];

  const toneIcon: Record<string, string> = {
    success: 'text-success',
    warning: 'text-accent',
    danger: 'text-danger',
  };

  return (
    <div className="space-y-5">
      {/* ── Hero strip ── */}
      <div className="relative overflow-hidden rounded-xl bg-ink text-white border border-white/10 px-5 py-5 sm:px-7 sm:py-6">
        <div className="absolute inset-y-0 right-0 w-1/2 tcb-hero-image opacity-[0.15] bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/92 to-ink/50" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-1">
              Transportes Carlos Bié
            </p>
            <h2 className="text-2xl font-bold tracking-tight leading-tight">
              Recrutamento &amp; frota
            </h2>
            <p className="text-sm text-white/60 mt-1">
              Admissão de motoristas, validação INATRO e vagas activas.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-white/65">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">{pendingDrivers} em análise</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">{pendingDocsCount} docs pendentes</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">{openJobs} vagas abertas</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={onOpenDriverForm}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-ink text-[12px] font-bold rounded-xl hover:bg-paper-muted transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Motorista
            </button>
            <button
              onClick={onOpenJobForm}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-white/25 text-white text-[12px] font-bold rounded-xl hover:bg-white/10 transition-colors"
            >
              <Briefcase className="w-4 h-4" />
              Criar vaga
            </button>
          </div>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <button
              key={kpi.label}
              type="button"
              onClick={() => onNavigate(kpi.page)}
              className="text-left tcb-panel rounded-xl p-4 hover:border-ink/20 dark:hover:border-white/20 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-medium text-ink/45 dark:text-white/40 leading-tight">
                  {kpi.label}
                </span>
                <Icon className={`w-4 h-4 shrink-0 ${kpi.tone ? toneIcon[kpi.tone] : 'text-ink/35 dark:text-white/35'}`} />
              </div>
              <p className="text-2xl font-extrabold text-ink dark:text-white tracking-tight tabular-nums">{kpi.value}</p>
              <p className="text-[11px] text-ink/40 dark:text-white/35 mt-0.5">{kpi.hint}</p>
            </button>
          );
        })}
      </div>

      {/* ── Alerta docs pendentes ── */}
      {pendingDocsCount > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-accent/25 dark:border-accent/35 bg-accent/[0.07] dark:bg-accent/[0.12] px-5 py-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-ink dark:text-white">{pendingDocsCount} documento(s) por validar</p>
              <p className="text-xs text-ink/55 dark:text-white/50 mt-0.5">Cartas e BIs aguardam verificação.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('documents')}
            className="shrink-0 w-full sm:w-auto px-5 py-2.5 text-[12px] font-bold rounded-xl bg-ink dark:bg-white text-white dark:text-ink hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Validar agora
          </button>
        </div>
      )}

      {/* ── Grid: frota + vagas ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Frota por carta */}
        <div className="tcb-panel rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-ink dark:text-white">Frota por carta</h3>
            <span className="text-[10px] font-bold text-ink/35 dark:text-white/30 tracking-widest">INATRO</span>
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
                  <span className="font-medium truncate">{row.label}</span>
                  <span className="font-mono text-ink/50 dark:text-white/45 ml-2 shrink-0">{row.count}</span>
                </div>
                <div className="w-full bg-ink/5 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-accent h-full rounded-full transition-all duration-500"
                    style={{ width: `${totalDrivers > 0 ? Math.max(4, (row.count / totalDrivers) * 100) : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => onNavigate('drivers')}
            className="mt-5 pt-4 border-t border-ink/8 dark:border-white/[0.08] w-full flex items-center justify-between text-xs font-semibold text-ink/55 dark:text-white/45 hover:text-ink dark:hover:text-white transition-colors"
          >
            Ver lista completa <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Vagas abertas */}
        <div className="lg:col-span-2 tcb-panel rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-ink dark:text-white">Vagas abertas</h3>
              <p className="text-xs text-ink/45 dark:text-white/40 mt-0.5">Oportunidades activas</p>
            </div>
            <button
              onClick={() => onNavigate('jobs')}
              className="text-xs font-semibold text-ink/55 dark:text-white/45 hover:text-ink dark:hover:text-white inline-flex items-center gap-1 transition-colors"
            >
              Gerir ({jobs.length}) <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {jobs.slice(0, 4).map((job) => (
              <div
                key={job.id}
                className="p-4 border border-ink/8 dark:border-white/[0.08] rounded-xl hover:border-ink/20 dark:hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono text-ink/35 dark:text-white/30">{job.code}</span>
                  <StatusBadge status={job.status} />
                </div>
                <p className="text-sm font-bold text-ink dark:text-white line-clamp-1">{job.title}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-ink/45 dark:text-white/40">
                  <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                  <span>·</span>
                  <span className="truncate">{job.category}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-ink/6 dark:border-white/[0.06] flex items-center justify-between text-[11px]">
                  <span className="text-ink/40 dark:text-white/35 font-mono">{job.candidatesCount} candidato(s)</span>
                  <button
                    onClick={() => onNavigate('applications')}
                    className="font-semibold text-ink dark:text-white hover:underline"
                  >
                    Ver candidaturas
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Candidaturas recentes — cards em mobile, tabela em desktop ── */}
      <div className="tcb-panel rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-ink dark:text-white">Candidaturas recentes</h3>
            <p className="text-xs text-ink/45 dark:text-white/40 mt-0.5">Últimos processos submetidos</p>
          </div>
          <button
            onClick={() => onNavigate('applications')}
            className="text-xs font-semibold text-ink/55 dark:text-white/45 hover:text-ink dark:hover:text-white inline-flex items-center gap-1 transition-colors"
          >
            Ver funil completo <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile: cards */}
        <div className="sm:hidden space-y-3">
          {applications.slice(0, 5).map((app) => (
            <div key={app.id} className="flex items-start gap-3 p-3 rounded-xl border border-ink/8 dark:border-white/[0.08]">
              <img
                src={app.driverPhoto}
                alt=""
                className="w-10 h-10 rounded-full object-cover shrink-0 border border-ink/10 dark:border-white/10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-bold text-ink dark:text-white leading-tight truncate">{app.driverName}</p>
                  <StatusBadge status={app.stage} />
                </div>
                <p className="text-[11px] text-ink/55 dark:text-white/45 mt-0.5 truncate">{app.jobTitle}</p>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-ink/40 dark:text-white/35">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{app.appliedDate}</span>
                  <button
                    onClick={() => onSelectDriver(app.driverId)}
                    className="font-semibold text-ink dark:text-white hover:underline"
                  >
                    Perfil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: tabela */}
        <div className="hidden sm:block overflow-x-auto -mx-1">
          <table className="w-full text-left text-sm min-w-[600px]">
            <thead className="text-[11px] font-semibold text-ink/40 dark:text-white/35 border-b border-ink/8 dark:border-white/[0.08]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Motorista</th>
                <th className="py-2.5 px-3 font-semibold">Vaga</th>
                <th className="py-2.5 px-3 font-semibold hidden md:table-cell">Carta</th>
                <th className="py-2.5 px-3 font-semibold hidden lg:table-cell">Data</th>
                <th className="py-2.5 px-3 font-semibold">Fase</th>
                <th className="py-2.5 px-3 font-semibold text-right"> </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5 dark:divide-white/[0.05]">
              {applications.slice(0, 5).map((app) => (
                <tr key={app.id} className="hover:bg-ink/[0.02] dark:hover:bg-white/[0.02]">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img src={app.driverPhoto} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-ink dark:text-white text-[13px] truncate">{app.driverName}</p>
                        <p className="text-[11px] font-mono text-ink/40 dark:text-white/35">{app.driverPhone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-[13px] text-ink dark:text-white truncate max-w-[180px]">{app.jobTitle}</p>
                    <p className="text-[11px] text-ink/40 dark:text-white/35">{app.jobLocation}</p>
                  </td>
                  <td className="py-3 px-3 text-[12px] text-ink/70 dark:text-white/65 hidden md:table-cell">
                    {app.driverCategory}
                  </td>
                  <td className="py-3 px-3 text-[12px] font-mono text-ink/45 dark:text-white/40 hidden lg:table-cell">
                    {app.appliedDate}
                  </td>
                  <td className="py-3 px-3"><StatusBadge status={app.stage} /></td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectDriver(app.driverId)}
                      className="px-3 py-1.5 text-[11px] font-bold rounded-lg border border-ink/12 dark:border-white/12 text-ink dark:text-white hover:bg-ink/5 dark:hover:bg-white/5 transition-colors"
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
