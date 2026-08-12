import React from 'react';
import { X, MapPin, Calendar, Award, CheckCircle2, Users, Briefcase } from 'lucide-react';
import { JobOpening, CandidateApplication } from '../types';

interface JobDetailModalProps {
  job: JobOpening | null;
  applications: CandidateApplication[];
  onClose: () => void;
  onSelectDriver: (driverId: string) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  applications,
  onClose,
  onSelectDriver,
}) => {
  if (!job) return null;

  const jobApplications = applications.filter((app) => app.jobId === job.id);

  return (
    <div className="fixed inset-0 bg-ink/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-ink-soft rounded-xl max-w-2xl w-full p-6 shadow-xl border border-ink/10 dark:border-white/10 max-h-[90vh] overflow-y-auto space-y-5">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-2 border-b border-ink/8 dark:border-white/10 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold text-ink/40 dark:text-white/40 uppercase tracking-widest block">
              {job.code} • PUBLICADA EM {job.publishDate}
            </span>
            <h3 className="text-base font-black text-ink dark:text-white mt-0.5 tracking-tight">
              {job.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-ink/40 dark:text-white/40 hover:text-ink dark:text-white rounded-xl hover:bg-paper-muted dark:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Facts Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl">
            <span className="text-[10px] font-bold text-ink/40 dark:text-white/40 uppercase tracking-widest block mb-1">LOCALIZAÇÃO</span>
            <span className="font-bold text-ink dark:text-white">{job.location}</span>
          </div>

          <div className="p-3 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl">
            <span className="text-[10px] font-bold text-ink/40 dark:text-white/40 uppercase tracking-widest block mb-1">CATEGORIA EXIGIDA</span>
            <span className="font-bold text-ink dark:text-white">{job.category}</span>
          </div>

          <div className="p-3 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl">
            <span className="text-[10px] font-bold text-ink/40 dark:text-white/40 uppercase tracking-widest block mb-1">EXPERIÊNCIA MÍNIMA</span>
            <span className="font-bold text-ink dark:text-white">{job.experienceYears} Anos</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-[10px] font-bold text-ink/40 dark:text-white/40 uppercase tracking-widest mb-1.5">
            DESCRIÇÃO DA FUNÇÃO
          </h4>
          <p className="text-xs text-ink dark:text-white leading-relaxed bg-paper-muted dark:bg-ink/50 p-3 rounded-xl border border-ink/10 dark:border-white/10 font-medium">
            {job.description}
          </p>
        </div>

        {/* Requirements */}
        <div>
          <h4 className="text-[10px] font-bold text-ink/40 dark:text-white/40 uppercase tracking-widest mb-2">
            REQUISITOS OBRIGATÓRIOS (TCB)
          </h4>
          <ul className="space-y-1.5 text-xs text-ink dark:text-white font-medium">
            {job.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <div>
            <h4 className="text-[10px] font-bold text-ink/40 dark:text-white/40 uppercase tracking-widest mb-2">
              BENEFÍCIOS OFERECIDOS
            </h4>
            <ul className="space-y-1 text-xs text-ink dark:text-white font-medium list-disc list-inside">
              {job.benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Applicants List Section */}
        <div className="pt-3 border-t border-ink/10 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold text-ink/40 dark:text-white/40 uppercase tracking-widest">
              Candidatos Inscritos para esta Vaga ({jobApplications.length})
            </h4>
          </div>

          {jobApplications.length === 0 ? (
            <p className="text-xs text-ink/50 dark:text-white/45 italic">
              Nenhuma candidatura registrada até ao momento para esta vaga.
            </p>
          ) : (
            <div className="space-y-2">
              {jobApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-3 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={app.driverPhoto}
                      alt={app.driverName}
                      className="w-8 h-8 rounded-full object-cover border border-ink/10 dark:border-white/10"
                    />
                    <div>
                      <p className="text-xs font-bold text-ink dark:text-white">
                        {app.driverName}
                      </p>
                      <p className="text-[10px] text-ink/50 dark:text-white/45">
                        Fase: <strong className="text-ink dark:text-white">{app.stage}</strong> • Submetido em{' '}
                        {app.appliedDate}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onSelectDriver(app.driverId);
                    }}
                    className="px-3 py-1 bg-ink hover:bg-ink-soft dark:bg-white dark:text-ink dark:hover:bg-paper-muted text-white text-[10px] font-bold rounded-xl uppercase tracking-wider transition-colors"
                  >
                    Ver Perfil
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close button */}
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
