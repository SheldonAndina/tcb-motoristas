import React, { useState } from 'react';
import {
  Eye,
  ChevronRight,
  ChevronLeft,
  Search,
  Phone,
  Calendar,
} from 'lucide-react';
import { CandidateApplication, ApplicationStage } from '../types';

interface ApplicationsPipelineViewProps {
  applications: CandidateApplication[];
  onSelectDriver: (driverId: string) => void;
  onChangeStage: (applicationId: string, newStage: ApplicationStage) => void;
}

function hasUsablePhoto(url?: string) {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return false;
  return true;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function CandidateAvatar({
  name,
  photo,
  size = 'md',
}: {
  name: string;
  photo?: string;
  size?: 'md' | 'lg';
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const showPhoto = hasUsablePhoto(photo) && !imgFailed;
  const dim = size === 'lg' ? 'w-12 h-12 text-sm' : 'w-11 h-11 text-xs';

  if (showPhoto) {
    return (
      <img
        src={photo}
        alt=""
        onError={() => setImgFailed(true)}
        className={`${dim} rounded-full object-cover shrink-0 border border-ink/10 dark:border-white/10`}
      />
    );
  }

  return (
    <div
      className={`${dim} rounded-full shrink-0 flex items-center justify-center font-semibold tracking-wide bg-ink/8 text-ink/70 dark:bg-white/10 dark:text-white/80 border border-ink/10 dark:border-white/10`}
      title="Sem fotografia — iniciais do candidato"
      aria-label={`Avatar de ${name}`}
    >
      {getInitials(name)}
    </div>
  );
}

export const ApplicationsPipelineView: React.FC<ApplicationsPipelineViewProps> = ({
  applications,
  onSelectDriver,
  onChangeStage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const stagesList: ApplicationStage[] = [
    'Candidatura',
    'Em Análise',
    'Entrevista',
    'Teste Prático',
    'Aprovado',
    'Rejeitado',
  ];

  const filteredApplications = applications.filter((app) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      app.driverName.toLowerCase().includes(q) ||
      app.jobTitle.toLowerCase().includes(q) ||
      app.driverPhone.toLowerCase().includes(q)
    );
  });

  const stageAccent: Record<ApplicationStage, string> = {
    Candidatura: 'border-t-ink/40 dark:border-t-white/35',
    'Em Análise': 'border-t-accent',
    Entrevista: 'border-t-accent',
    'Teste Prático': 'border-t-accent',
    Aprovado: 'border-t-success',
    Rejeitado: 'border-t-danger',
  };

  return (
    <div className="space-y-5">
      <div className="tcb-panel rounded-xl p-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold text-accent tracking-wide mb-1">
            Pipeline de admissão
          </p>
          <h2 className="text-xl font-semibold text-ink dark:text-white tracking-tight">
            Funil de seleção
          </h2>
          <p className="text-sm text-ink/50 dark:text-white/45 mt-1">
            Candidatura → Análise → Entrevista → Teste → Decisão
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink/35 dark:text-white/35" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar candidato…"
            className="w-full pl-9 pr-3 py-2.5 bg-paper-muted dark:bg-ink-muted border border-ink/10 dark:border-white/[0.09] rounded-lg text-sm text-ink dark:text-white placeholder:text-ink/35 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/35"
          />
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1">
        {stagesList.map((stage) => {
          const appsInStage = filteredApplications.filter((app) => app.stage === stage);

          return (
            <div
              key={stage}
              className={`tcb-panel rounded-xl p-4 flex flex-col min-w-[280px] w-[280px] sm:min-w-[300px] sm:w-[300px] border-t-[3px] ${stageAccent[stage]}`}
            >
              <div className="flex items-center justify-between pb-3 mb-1 border-b border-ink/8 dark:border-white/[0.08]">
                <span className="text-[13px] font-semibold text-ink dark:text-white">
                  {stage}
                </span>
                <span className="min-w-[1.5rem] h-6 px-2 inline-flex items-center justify-center text-[11px] font-semibold rounded-md bg-ink/8 text-ink/70 dark:bg-white/10 dark:text-white/80">
                  {appsInStage.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 pt-2">
                {appsInStage.length === 0 ? (
                  <div className="py-10 px-4 text-center text-xs text-ink/40 dark:text-white/35 border border-dashed border-ink/12 dark:border-white/10 rounded-lg">
                    Sem candidatos
                  </div>
                ) : (
                  appsInStage.map((app) => (
                    <article
                      key={app.id}
                      className="rounded-xl border border-ink/8 dark:border-white/[0.08] bg-paper/60 dark:bg-ink-muted/40 p-4 space-y-3.5 hover:border-ink/20 dark:hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <CandidateAvatar name={app.driverName} photo={app.driverPhoto} />
                        <div className="min-w-0 flex-1 pt-0.5">
                          <button
                            type="button"
                            onClick={() => onSelectDriver(app.driverId)}
                            className="text-[13px] font-semibold text-ink dark:text-white text-left leading-snug hover:underline"
                          >
                            {app.driverName}
                          </button>
                          <p className="text-[11px] text-ink/50 dark:text-white/45 mt-1 leading-snug">
                            {app.driverCategory}
                          </p>
                          {!hasUsablePhoto(app.driverPhoto) && (
                            <p className="text-[10px] text-ink/35 dark:text-white/30 mt-1">
                              Sem foto · iniciais
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5 text-[12px]">
                        <p className="font-medium text-ink dark:text-white leading-snug line-clamp-2">
                          {app.jobTitle}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink/45 dark:text-white/40">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {app.appliedDate}
                          </span>
                          {app.driverPhone && (
                            <span className="inline-flex items-center gap-1 truncate max-w-full">
                              <Phone className="w-3 h-3 shrink-0" />
                              {app.driverPhone}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-ink/8 dark:border-white/[0.08]">
                        <button
                          type="button"
                          onClick={() => onSelectDriver(app.driverId)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-lg text-ink/65 dark:text-white/60 hover:bg-ink/5 dark:hover:bg-white/8 hover:text-ink dark:hover:text-white transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Perfil
                        </button>

                        <div className="flex items-center gap-1">
                          {stage !== 'Candidatura' && (
                            <button
                              type="button"
                              onClick={() => {
                                const i = stagesList.indexOf(stage);
                                if (i > 0) onChangeStage(app.id, stagesList[i - 1]);
                              }}
                              className="p-2 rounded-lg text-ink/45 dark:text-white/40 hover:bg-ink/5 dark:hover:bg-white/8 hover:text-ink dark:hover:text-white transition-colors"
                              title="Etapa anterior"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                          )}

                          {stage !== 'Aprovado' && stage !== 'Rejeitado' && (
                            <button
                              type="button"
                              onClick={() => {
                                const i = stagesList.indexOf(stage);
                                if (i < stagesList.length - 1) {
                                  onChangeStage(app.id, stagesList[i + 1]);
                                }
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-ink dark:bg-white text-white dark:text-ink text-[11px] font-semibold hover:opacity-90 transition-opacity"
                              title="Avançar"
                            >
                              Avançar
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
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
