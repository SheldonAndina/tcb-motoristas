import React, { useState } from 'react';
import {
  Eye,
  ChevronRight,
  ChevronLeft,
  Search,
  Phone,
  Calendar,
  MapPin,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  Filter,
  Users,
  TrendingUp,
  Award,
} from 'lucide-react';
import { CandidateApplication, ApplicationStage } from '../types';

/* ─── helpers ──────────────────────────────────────────────────────────── */

function hasUsablePhoto(url?: string) {
  if (!url) return false;
  const t = url.trim();
  return t !== '' && t !== 'null' && t !== 'undefined';
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short' });
  } catch {
    return dateStr;
  }
}

function daysSince(dateStr: string) {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86_400_000);
    if (days === 0) return 'hoje';
    if (days === 1) return 'ontem';
    return `há ${days}d`;
  } catch {
    return '';
  }
}

/* ─── avatar ────────────────────────────────────────────────────────────── */

function CandidateAvatar({ name, photo, size = 'md' }: { name: string; photo?: string; size?: 'sm' | 'md' | 'lg' }) {
  const [failed, setFailed] = useState(false);
  const dim = size === 'lg' ? 'w-12 h-12 text-sm' : size === 'sm' ? 'w-8 h-8 text-[10px]' : 'w-10 h-10 text-xs';
  const colors = [
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  ];
  const colorClass = colors[name.charCodeAt(0) % colors.length];

  if (hasUsablePhoto(photo) && !failed) {
    return (
      <img
        src={photo}
        alt=""
        onError={() => setFailed(true)}
        className={`${dim} rounded-full object-cover shrink-0 border-2 border-white dark:border-ink-soft shadow-sm`}
      />
    );
  }
  return (
    <div className={`${dim} rounded-full shrink-0 flex items-center justify-center font-bold border-2 border-white dark:border-ink-soft shadow-sm ${colorClass}`}>
      {getInitials(name)}
    </div>
  );
}

/* ─── star rating ───────────────────────────────────────────────────────── */

function StarRating({ value, onChange }: { value?: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          onMouseEnter={() => onChange && setHover(n)}
          onMouseLeave={() => onChange && setHover(0)}
          className={`transition-colors ${onChange ? 'cursor-pointer' : 'cursor-default pointer-events-none'}`}
          title={`${n} estrela${n > 1 ? 's' : ''}`}
        >
          <Star
            className={`w-3 h-3 ${(hover || value || 0) >= n ? 'fill-accent text-accent' : 'text-ink/20 dark:text-white/20'}`}
          />
        </button>
      ))}
    </div>
  );
}

/* ─── stage config ──────────────────────────────────────────────────────── */

interface StageConfig {
  label: string;
  color: string;         // top border
  headerBg: string;      // column header background
  headerText: string;
  badge: string;         // count badge
  icon: React.ReactNode;
}

const STAGE_CONFIG: Record<ApplicationStage, StageConfig> = {
  Candidatura: {
    label: 'Candidatura',
    color: 'border-t-slate-400 dark:border-t-slate-500',
    headerBg: 'bg-slate-50 dark:bg-slate-800/30',
    headerText: 'text-slate-600 dark:text-slate-400',
    badge: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  'Em Análise': {
    label: 'Em Análise',
    color: 'border-t-blue-400',
    headerBg: 'bg-blue-50 dark:bg-blue-900/20',
    headerText: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    icon: <Search className="w-3.5 h-3.5" />,
  },
  Entrevista: {
    label: 'Entrevista',
    color: 'border-t-violet-400',
    headerBg: 'bg-violet-50 dark:bg-violet-900/20',
    headerText: 'text-violet-600 dark:text-violet-400',
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    icon: <Users className="w-3.5 h-3.5" />,
  },
  'Teste Prático': {
    label: 'Teste Prático',
    color: 'border-t-amber-400',
    headerBg: 'bg-amber-50 dark:bg-amber-900/20',
    headerText: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    icon: <TrendingUp className="w-3.5 h-3.5" />,
  },
  Aprovado: {
    label: 'Aprovado',
    color: 'border-t-emerald-500',
    headerBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    headerText: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    icon: <Award className="w-3.5 h-3.5" />,
  },
  Rejeitado: {
    label: 'Rejeitado',
    color: 'border-t-red-400',
    headerBg: 'bg-red-50 dark:bg-red-900/20',
    headerText: 'text-red-500 dark:text-red-400',
    badge: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300',
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

const STAGES: ApplicationStage[] = [
  'Candidatura',
  'Em Análise',
  'Entrevista',
  'Teste Prático',
  'Aprovado',
  'Rejeitado',
];

/* ─── card ──────────────────────────────────────────────────────────────── */

function AppCard({
  app,
  stage,
  onSelectDriver,
  onChangeStage,
}: {
  app: CandidateApplication;
  stage: ApplicationStage;
  onSelectDriver: (id: string) => void;
  onChangeStage: (id: string, s: ApplicationStage) => void;
}) {
  const stageIdx = STAGES.indexOf(stage);
  const canAdvance = stage !== 'Aprovado' && stage !== 'Rejeitado';
  const canReject = stage !== 'Aprovado' && stage !== 'Rejeitado';
  const canBack = stageIdx > 0 && stage !== 'Aprovado' && stage !== 'Rejeitado';

  return (
    <article className="group bg-white dark:bg-ink-soft rounded-2xl border border-ink/[0.07] dark:border-white/[0.07] shadow-sm hover:shadow-md hover:border-ink/15 dark:hover:border-white/15 transition-all duration-200 overflow-hidden">
      {/* Top accent strip */}
      <div className={`h-0.5 w-full ${STAGE_CONFIG[stage].color.replace('border-t-', 'bg-')}`} />

      <div className="p-4 space-y-3.5">
        {/* Header: avatar + nome + vaga */}
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <CandidateAvatar name={app.driverName} photo={app.driverPhoto} size="md" />
            {stage === 'Aprovado' && (
              <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 w-4 h-4 text-emerald-500 bg-white dark:bg-ink-soft rounded-full" />
            )}
            {stage === 'Rejeitado' && (
              <XCircle className="absolute -bottom-0.5 -right-0.5 w-4 h-4 text-red-500 bg-white dark:bg-ink-soft rounded-full" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => onSelectDriver(app.driverId)}
              className="text-[13px] font-bold text-ink dark:text-white text-left leading-tight hover:text-accent dark:hover:text-accent transition-colors line-clamp-1"
            >
              {app.driverName}
            </button>
            <p className="text-[11px] text-ink/50 dark:text-white/45 mt-0.5 font-medium">
              {app.driverCategory}
            </p>
            {app.rating !== undefined && (
              <div className="mt-1">
                <StarRating value={app.rating} />
              </div>
            )}
          </div>
        </div>

        {/* Vaga */}
        <div className="px-3 py-2.5 rounded-xl bg-ink/[0.035] dark:bg-white/[0.05] border border-ink/[0.06] dark:border-white/[0.06]">
          <div className="flex items-start gap-2">
            <Briefcase className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-ink dark:text-white leading-snug line-clamp-2">
                {app.jobTitle}
              </p>
              {app.jobLocation && (
                <p className="text-[11px] text-ink/45 dark:text-white/40 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {app.jobLocation}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Meta: data + telefone */}
        <div className="flex items-center justify-between text-[11px] text-ink/45 dark:text-white/40">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 shrink-0" />
            <span>{formatDate(app.appliedDate)}</span>
            <span className="text-ink/30 dark:text-white/25">·</span>
            <span>{daysSince(app.appliedDate)}</span>
          </span>
          {app.driverPhone && (
            <a
              href={`tel:${app.driverPhone}`}
              className="flex items-center gap-1 hover:text-ink dark:hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 shrink-0" />
              <span className="font-mono">{app.driverPhone}</span>
            </a>
          )}
        </div>

        {/* Notes preview */}
        {app.notes && (
          <p className="text-[11px] text-ink/50 dark:text-white/40 italic leading-snug line-clamp-2 border-l-2 border-accent/40 pl-2">
            {app.notes}
          </p>
        )}
      </div>

      {/* Footer: acções */}
      <div className="px-4 py-3 border-t border-ink/[0.06] dark:border-white/[0.06] bg-ink/[0.015] dark:bg-white/[0.02] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onSelectDriver(app.driverId)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg text-ink/60 dark:text-white/55 hover:bg-ink/6 dark:hover:bg-white/8 hover:text-ink dark:hover:text-white transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          Ver perfil
        </button>

        <div className="flex items-center gap-1">
          {/* Rejeitar directamente */}
          {canReject && (
            <button
              type="button"
              onClick={() => onChangeStage(app.id, 'Rejeitado')}
              className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
              title="Rejeitar candidatura"
            >
              <XCircle className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Voltar etapa */}
          {canBack && (
            <button
              type="button"
              onClick={() => onChangeStage(app.id, STAGES[stageIdx - 1])}
              className="p-1.5 rounded-lg text-ink/40 dark:text-white/35 hover:bg-ink/5 dark:hover:bg-white/8 hover:text-ink dark:hover:text-white transition-colors"
              title="Etapa anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Avançar */}
          {canAdvance && (
            <button
              type="button"
              onClick={() => {
                const next = STAGES[stageIdx + 1];
                if (next) onChangeStage(app.id, next);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-ink dark:bg-white text-white dark:text-ink text-[11px] font-bold hover:opacity-85 active:scale-95 transition-all"
            >
              Avançar
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Aprovado — apenas voltar */}
          {stage === 'Aprovado' && (
            <button
              type="button"
              onClick={() => onChangeStage(app.id, 'Teste Prático')}
              className="p-1.5 rounded-lg text-ink/40 dark:text-white/35 hover:bg-ink/5 dark:hover:bg-white/8 hover:text-ink dark:hover:text-white transition-colors"
              title="Voltar a Teste Prático"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/* ─── main view ─────────────────────────────────────────────────────────── */

interface ApplicationsPipelineViewProps {
  applications: CandidateApplication[];
  onSelectDriver: (driverId: string) => void;
  onChangeStage: (applicationId: string, newStage: ApplicationStage) => void;
}

export const ApplicationsPipelineView: React.FC<ApplicationsPipelineViewProps> = ({
  applications,
  onSelectDriver,
  onChangeStage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState<'all' | ApplicationStage>('all');

  const total = applications.length;
  const approved = applications.filter((a) => a.stage === 'Aprovado').length;
  const active = applications.filter(
    (a) => a.stage !== 'Aprovado' && a.stage !== 'Rejeitado'
  ).length;
  const convRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  const filtered = applications.filter((app) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      !q ||
      app.driverName.toLowerCase().includes(q) ||
      app.jobTitle.toLowerCase().includes(q) ||
      app.driverPhone.includes(q);
    const matchStage = filterStage === 'all' || app.stage === filterStage;
    return matchSearch && matchStage;
  });

  return (
    <div className="space-y-6">
      {/* ── Cabeçalho ── */}
      <div className="tcb-panel rounded-2xl p-5 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-accent mb-1">
            Pipeline de admissão
          </p>
          <h2 className="text-xl font-bold text-ink dark:text-white tracking-tight">
            Funil de Candidaturas
          </h2>
          <p className="text-sm text-ink/50 dark:text-white/45 mt-1">
            Candidatura → Análise → Entrevista → Teste Prático → Decisão
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          {/* Filtro por etapa */}
          <div className="relative">
            <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink/35 dark:text-white/35" />
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value as typeof filterStage)}
              className="w-full sm:w-44 pl-8 pr-3 py-2.5 bg-paper-muted dark:bg-ink-muted border border-ink/10 dark:border-white/[0.09] rounded-xl text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/35 appearance-none"
            >
              <option value="all">Todas as etapas</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Pesquisa */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink/35 dark:text-white/35" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar candidato, vaga…"
              className="w-full sm:w-56 pl-9 pr-3 py-2.5 bg-paper-muted dark:bg-ink-muted border border-ink/10 dark:border-white/[0.09] rounded-xl text-sm text-ink dark:text-white placeholder:text-ink/35 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/35"
            />
          </div>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: total, icon: <Users className="w-4 h-4" />, color: 'text-ink/60 dark:text-white/55' },
          { label: 'Em processo', value: active, icon: <Clock className="w-4 h-4" />, color: 'text-blue-500' },
          { label: 'Aprovados', value: approved, icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-500' },
          { label: 'Taxa aprovação', value: `${convRate}%`, icon: <TrendingUp className="w-4 h-4" />, color: 'text-accent' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="tcb-panel rounded-2xl px-4 py-3.5 flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-ink/5 dark:bg-white/8 ${color}`}>{icon}</div>
            <div>
              <p className="text-[11px] font-medium text-ink/50 dark:text-white/40">{label}</p>
              <p className="text-xl font-extrabold text-ink dark:text-white leading-none mt-0.5">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Kanban board ── */}
      <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-1 sm:px-1 snap-x snap-mandatory scroll-smooth" style={{WebkitOverflowScrolling: 'touch'}}>
        {STAGES.map((stage) => {
          const cfg = STAGE_CONFIG[stage];
          const appsInStage = filtered.filter((a) => a.stage === stage);

          return (
            <div
              key={stage}
              className={`flex flex-col min-w-[260px] w-[260px] sm:min-w-[285px] sm:w-[285px] rounded-2xl border border-ink/[0.07] dark:border-white/[0.07] border-t-[3px] ${cfg.color} snap-start overflow-hidden shrink-0`}
            >
              {/* Column header */}
              <div className={`px-4 py-3 flex items-center justify-between ${cfg.headerBg}`}>
                <div className="flex items-center gap-2">
                  <span className={cfg.headerText}>{cfg.icon}</span>
                  <span className={`text-[13px] font-bold ${cfg.headerText}`}>{cfg.label}</span>
                </div>
                <span className={`min-w-[1.6rem] h-5 px-1.5 inline-flex items-center justify-center text-[11px] font-bold rounded-md ${cfg.badge}`}>
                  {appsInStage.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 p-3 space-y-3 bg-ink/[0.015] dark:bg-black/10 min-h-[120px]">
                {appsInStage.length === 0 ? (
                  <div className="py-12 text-center text-xs text-ink/35 dark:text-white/30 border border-dashed border-ink/10 dark:border-white/10 rounded-xl">
                    Sem candidatos
                  </div>
                ) : (
                  appsInStage.map((app) => (
                    <AppCard
                      key={app.id}
                      app={app}
                      stage={stage}
                      onSelectDriver={onSelectDriver}
                      onChangeStage={onChangeStage}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
