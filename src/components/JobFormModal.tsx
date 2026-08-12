import React, { useState } from 'react';
import { X, Save, Briefcase } from 'lucide-react';
import { JobOpening, JobStatus, LicenseCategory, MozambiqueProvince } from '../types';

interface JobFormModalProps {
  initialJob?: JobOpening | null;
  onSave: (job: Partial<JobOpening>) => void;
  onClose: () => void;
}

export const JobFormModal: React.FC<JobFormModalProps> = ({
  initialJob,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(initialJob?.title || '');
  const [location, setLocation] = useState(initialJob?.location || 'Maputo');
  const [province, setProvince] = useState<MozambiqueProvince>(
    initialJob?.province || 'Maputo Cidade'
  );
  const [category, setCategory] = useState<LicenseCategory>(
    initialJob?.category || 'Carta CE (Pesados Articulados)'
  );
  const [experienceYears, setExperienceYears] = useState<number>(
    initialJob?.experienceYears || 5
  );
  const [status, setStatus] = useState<JobStatus>(initialJob?.status || 'Aberta');
  const [salaryRange, setSalaryRange] = useState(
    initialJob?.salaryRange || '40.000 MT - 60.000 MT'
  );
  const [description, setDescription] = useState(
    initialJob?.description ||
      'Recrutamento para motorista de frota de transportes e logística da TCB - Transportes Carlos Bié.'
  );
  const [requirementsText, setRequirementsText] = useState(
    initialJob?.requirements?.join('\n') ||
      'Carta de Condução válida\nRegisto criminal sem antecedência\nMínimo de 3 anos de experiência em transporte pesado'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const reqArray = requirementsText
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    onSave({
      id: initialJob?.id,
      code: initialJob?.code || `TCB-VAG-2026-0${Math.floor(Math.random() * 90 + 10)}`,
      title,
      location,
      province,
      category,
      experienceYears: Number(experienceYears),
      publishDate: initialJob?.publishDate || new Date().toISOString().slice(0, 10),
      deadline: '2026-09-30',
      candidatesCount: initialJob?.candidatesCount || 0,
      status,
      salaryRange,
      description,
      requirements: reqArray,
      benefits: [
        'Salário compatível com o setor',
        'Seguro de saúde extensivo',
        'Uniforme e subsídio de viagem',
      ],
    });
  };

  const provincesList: MozambiqueProvince[] = [
    'Maputo Cidade',
    'Maputo Província',
    'Gaza',
    'Inhambane',
    'Sofala (Beira)',
    'Manica',
    'Tete',
    'Zambézia',
    'Nampula',
    'Cabo Delgado',
    'Niassa',
  ];

  return (
    <div className="fixed inset-0 bg-ink/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-ink-soft rounded-xl max-w-xl w-full p-6 shadow-xl border border-ink/10 dark:border-white/10 max-h-[90vh] overflow-y-auto space-y-4">
        <div className="flex items-center justify-between border-b border-ink/8 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-ink dark:text-white" />
            <div>
              <span className="text-[10px] font-bold text-ink/40 dark:text-white/40 uppercase tracking-widest block">GESTÃO DE VAGAS</span>
              <h3 className="text-base font-black text-ink dark:text-white tracking-tight">
                {initialJob ? 'Editar Vaga de Recrutamento' : 'Criar Nova Vaga de Emprego TCB'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-ink/40 dark:text-white/40 hover:text-ink dark:text-white rounded-xl hover:bg-paper-muted dark:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider text-[10px] mb-1">
              Título da Vaga *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Motorista de Pesados Articulados (CE) - Maputo/Beira"
              className="w-full p-2.5 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl font-bold text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider text-[10px] mb-1">
                Localização / Rota
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Maputo / Beira"
                className="w-full p-2.5 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl font-medium text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>

            <div>
              <label className="block font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider text-[10px] mb-1">Província</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value as MozambiqueProvince)}
                className="w-full p-2.5 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl font-bold text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                {provincesList.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider text-[10px] mb-1">
                Categoria de Carta Exigida
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as LicenseCategory)}
                className="w-full p-2.5 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl font-bold text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                <option value="Carta CE (Pesados Articulados)">Carta CE</option>
                <option value="Carta C (Pesados)">Carta C</option>
                <option value="Carta D (Autocarros)">Carta D (Autocarros)</option>
                <option value="Carta C1">Carta C1</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider text-[10px] mb-1">
                Experiência Mínima (Anos)
              </label>
              <input
                type="number"
                min={0}
                max={30}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full p-2.5 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl font-bold text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>

            <div>
              <label className="block font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider text-[10px] mb-1">
                Estado da Vaga
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as JobStatus)}
                className="w-full p-2.5 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl font-bold text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                <option value="Aberta">Aberta</option>
                <option value="Em Seleção">Em Seleção</option>
                <option value="Fechada">Fechada</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider text-[10px] mb-1">
                Intervalo Salarial Estimado
              </label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="Ex: 35.000 MT - 50.000 MT"
                className="w-full p-2.5 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl font-medium text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider text-[10px] mb-1">
              Descrição da Vaga
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl text-xs font-medium text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>

          <div>
            <label className="block font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider text-[10px] mb-1">
              Requisitos (um por linha)
            </label>
            <textarea
              rows={3}
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
              className="w-full p-2.5 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl text-xs font-medium text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-ink/8 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-paper-muted dark:bg-white/10 hover:bg-paper-muted dark:hover:bg-white/15 text-ink dark:text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-ink hover:bg-ink-soft dark:bg-white dark:text-ink dark:hover:bg-paper-muted text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Vaga</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
