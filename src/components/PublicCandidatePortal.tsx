import React, { useState } from 'react';
import {
  Truck,
  Briefcase,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  Upload,
  ArrowLeft,
  Search,
  Building,
  ShieldCheck,
  Send,
  Clock,
  ChevronRight,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Sun,
  Moon,
} from 'lucide-react';
import {
  JobOpening,
  LicenseCategory,
  MozambiqueProvince,
  Driver,
  CandidateApplication,
  DriverDocument,
} from '../types';
import { Logo } from './Logo';

interface PublicCandidatePortalProps {
  jobs: JobOpening[];
  drivers: Driver[];
  applications: CandidateApplication[];
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onApplyFromHome: (
    newDriver: Omit<Driver, 'id'>,
    selectedJobId?: string
  ) => void;
  onClose: () => void;
}

export const PublicCandidatePortal: React.FC<PublicCandidatePortalProps> = ({
  jobs,
  drivers,
  applications,
  darkMode,
  onToggleDarkMode,
  onApplyFromHome,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'apply' | 'track'>('jobs');
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);

  // Filter States for Jobs
  const [filterProvince, setFilterProvince] = useState<string>('Todas');
  const [filterCategory, setFilterCategory] = useState<string>('Todas');

  // Tracking State
  const [trackQuery, setTrackQuery] = useState<string>('');
  const [trackedDriver, setTrackedDriver] = useState<Driver | null>(null);
  const [trackedApps, setTrackedApps] = useState<CandidateApplication[]>([]);
  const [hasSearchedTrack, setHasSearchedTrack] = useState<boolean>(false);

  // Application Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [biNumber, setBiNumber] = useState('');
  const [nuitNumber, setNuitNumber] = useState('');
  const [province, setProvince] = useState<MozambiqueProvince>('Maputo Cidade');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [birthDate, setBirthDate] = useState('1992-05-14');
  const [gender, setGender] = useState<'Masculino' | 'Feminino'>('Masculino');

  // Driving License Details
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseCategory, setLicenseCategory] = useState<LicenseCategory>(
    'Carta CE (Pesados Articulados)'
  );
  const [licenseIssueDate, setLicenseIssueDate] = useState('2018-03-10');
  const [licenseExpiryDate, setLicenseExpiryDate] = useState('2028-03-10');
  const [experienceYears, setExperienceYears] = useState<number>(5);
  const [bio, setBio] = useState('');

  // Documents attached state (simulated)
  const [attachedBi, setAttachedBi] = useState<string | null>(null);
  const [attachedLicense, setAttachedLicense] = useState<string | null>(null);
  const [attachedMedical, setAttachedMedical] = useState<string | null>(null);

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  // Available Job Openings filtered
  const openJobsList = jobs.filter((j) => j.status === 'Aberta' || j.status === 'Em Seleção');

  const filteredJobs = openJobsList.filter((j) => {
    const matchProvince =
      filterProvince === 'Todas' || j.province === filterProvince;
    const matchCategory =
      filterCategory === 'Todas' || j.category === filterCategory;
    return matchProvince && matchCategory;
  });

  const handleStartApply = (job?: JobOpening) => {
    if (job) {
      setSelectedJob(job);
      setLicenseCategory(job.category);
      setProvince(job.province);
    } else {
      setSelectedJob(null);
    }
    setActiveTab('apply');
    setSubmittedCode(null);
  };

  const handleFileSimulate = (
    docType: 'bi' | 'license' | 'medical',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files && files[0]) {
      const fileName = files[0].name;
      if (docType === 'bi') setAttachedBi(fileName);
      if (docType === 'license') setAttachedLicense(fileName);
      if (docType === 'medical') setAttachedMedical(fileName);
    }
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !biNumber || !licenseNumber) {
      alert('Por favor preencha os campos obrigatórios (Nome, BI, Telefone e Carta).');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      // Construct Mock Documents
      const initialDocs: DriverDocument[] = [
        {
          id: `DOC-BI-${Date.now()}`,
          type: 'BI',
          name: 'Bilhete de Identidade Nacional',
          fileName: attachedBi || 'BI_Digitalizado.pdf',
          fileSize: '1.2 MB',
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'Pendente',
        },
        {
          id: `DOC-DRV-${Date.now()}`,
          type: 'Carta de Condução',
          name: `Carta de Condução - ${licenseCategory}`,
          fileName: attachedLicense || 'Carta_Conducao_Digitalizada.pdf',
          fileSize: '1.8 MB',
          uploadDate: new Date().toISOString().split('T')[0],
          expiryDate: licenseExpiryDate,
          status: 'Pendente',
        },
      ];

      if (attachedMedical) {
        initialDocs.push({
          id: `DOC-MED-${Date.now()}`,
          type: 'Atestado Médico',
          name: 'Atestado de Aptidão Física e Mental',
          fileName: attachedMedical,
          fileSize: '950 KB',
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'Pendente',
        });
      }

      const generatedCode = `CND-${Math.floor(100000 + Math.random() * 900000)}`;

      const newDriverPayload: Omit<Driver, 'id'> = {
        fullName,
        photo:
          gender === 'Feminino'
            ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        phone,
        email: email || `${phone.replace(/\s+/g, '')}@motorista.co.mz`,
        biNumber,
        nuitNumber: nuitNumber || `10${Math.floor(10000000 + Math.random() * 90000000)}`,
        licenseNumber,
        licenseCategory,
        licenseIssueDate,
        licenseExpiryDate,
        experienceYears: Number(experienceYears) || 3,
        status: 'Pendente',
        applicationDate: new Date().toISOString().split('T')[0],
        province,
        city: city || province,
        address: address || 'Endereço residencial do motorista',
        birthDate,
        gender,
        bio: bio || `Candidatura submetida via Portal do Motorista em Casa. Experiência de ${experienceYears} anos.`,
        workHistory: [
          {
            id: `WH-${Date.now()}`,
            companyName: 'Experiência Anterior Informada',
            roleTitle: `Motorista (${licenseCategory})`,
            startDate: '2020-01-01',
            endDate: '2025-12-31',
            vehicleTypes: licenseCategory,
            responsibilities: bio || 'Transporte operacional e condução defensiva.',
          },
        ],
        documents: initialDocs,
        assignedJobId: selectedJob ? selectedJob.id : undefined,
      };

      onApplyFromHome(newDriverPayload, selectedJob ? selectedJob.id : undefined);
      setSubmittedCode(generatedCode);
    }, 800);
  };

  const handleSearchTracking = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearchedTrack(true);
    if (!trackQuery.trim()) return;

    const queryClean = trackQuery.trim().toLowerCase();
    const foundDriver = drivers.find(
      (d) =>
        d.biNumber.toLowerCase().includes(queryClean) ||
        d.phone.replace(/\s+/g, '').includes(queryClean) ||
        d.fullName.toLowerCase().includes(queryClean) ||
        d.licenseNumber.toLowerCase().includes(queryClean)
    );

    if (foundDriver) {
      setTrackedDriver(foundDriver);
      const apps = applications.filter((a) => a.driverId === foundDriver.id);
      setTrackedApps(apps);
    } else {
      setTrackedDriver(null);
      setTrackedApps([]);
    }
  };

  return (
    <div className="min-h-screen tcb-surface text-ink dark:text-white font-sans antialiased flex flex-col transition-colors duration-200">
      <header className="sticky top-0 z-40 tcb-panel border-b border-ink/8 dark:border-white/[0.08] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Logo size="md" variant="auto" />
          <div className="hidden sm:block h-6 w-px bg-ink/10 dark:bg-white/10" />
          <div className="hidden sm:block min-w-0">
            <p className="text-[10px] font-semibold text-accent tracking-wide">
              Portal de candidatura
            </p>
            <p className="text-xs text-ink/50 dark:text-white/45 truncate">
              Candidatura pública · Motoristas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-ink/60 dark:text-white/60 hover:bg-ink/5 dark:hover:bg-white/10 rounded-lg border border-ink/10 dark:border-white/10 transition-colors"
            title="Alternar tema"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-2 border border-ink/12 dark:border-white/12 text-ink dark:text-white text-[12px] font-semibold rounded-lg hover:bg-ink/5 dark:hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Portal de gestão</span>
          </button>
        </div>
      </header>

      {/* Full-bleed hero — brand first */}
      <div className="relative min-h-[58vh] sm:min-h-[62vh] overflow-hidden bg-ink text-white flex items-end">
        <div className="absolute inset-0 tcb-hero-image scale-[1.03]" />
        <div className="absolute inset-0 tcb-hero-scrim" />
        <div className="absolute inset-x-0 top-0 h-1 bg-accent" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8 pb-10 pt-24 space-y-5">
          <Logo size="lg" variant="light" />
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.05] max-w-2xl">
            Conduza com a TCB
          </h2>
          <p className="text-sm sm:text-base text-white/70 max-w-xl leading-relaxed font-medium">
            Candidate-se de casa para vagas de condução em Maputo, Beira, Nampula e rotas interprovinciais.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              onClick={() => handleStartApply()}
              className="px-6 py-3.5 bg-white text-ink hover:bg-white/90 font-semibold text-[13px] rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Candidatar-me agora</span>
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className="px-6 py-3.5 bg-transparent text-white border border-white/25 hover:bg-white/10 font-semibold text-[13px] rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Acompanhar candidatura</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-ink-soft/80 border-b border-ink/8 dark:border-white/10 px-4 sm:px-8 sticky top-[57px] z-30 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex items-center gap-2 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 text-xs font-bold rounded-xl uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'jobs'
                ? 'bg-ink dark:bg-white text-white dark:text-ink'
                : 'text-ink/55 dark:text-white/50 hover:bg-ink/5 dark:hover:bg-white/10'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Vagas ({openJobsList.length})</span>
          </button>

          <button
            onClick={() => {
              setSelectedJob(null);
              setActiveTab('apply');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'apply'
                ? 'bg-ink dark:bg-white text-white dark:text-ink'
                : 'text-ink/55 dark:text-white/50 hover:bg-ink/5 dark:hover:bg-white/10'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Formulário</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2 text-xs font-bold rounded-xl uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'track'
                ? 'bg-ink dark:bg-white text-white dark:text-ink'
                : 'text-ink/55 dark:text-white/50 hover:bg-ink/5 dark:hover:bg-white/10'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Consultar estado</span>
          </button>
        </div>
      </div>

      {/* Main Container Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* TAB 1: JOBS LISTING */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white dark:bg-ink-soft border border-ink/10 dark:border-white/10 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-ink dark:text-white uppercase tracking-tight">
                  Oportunidades de Emprego em Destaque
                </h3>
                <p className="text-xs text-ink/50 dark:text-white/45 font-medium">
                  Selecione a vaga correspondente à sua província e categoria de carta de condução.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Province Select */}
                <div>
                  <label className="block text-[10px] font-bold text-ink/40 dark:text-white/40 uppercase tracking-widest mb-1">
                    Província
                  </label>
                  <select
                    value={filterProvince}
                    onChange={(e) => setFilterProvince(e.target.value)}
                    className="p-2 bg-gray-50 dark:bg-ink-muted border border-ink/10 dark:border-white/10 dark:border-white/10 rounded-xl text-xs font-medium text-ink dark:text-white focus:outline-none"
                  >
                    <option value="Todas">Todas as Províncias</option>
                    <option value="Maputo Cidade">Maputo Cidade</option>
                    <option value="Maputo Província">Maputo Província</option>
                    <option value="Sofala (Beira)">Sofala (Beira)</option>
                    <option value="Nampula">Nampula</option>
                    <option value="Tete">Tete</option>
                    <option value="Manica">Manica</option>
                    <option value="Zambézia">Zambézia</option>
                    <option value="Inhambane">Inhambane</option>
                    <option value="Gaza">Gaza</option>
                  </select>
                </div>

                {/* Category Select */}
                <div>
                  <label className="block text-[10px] font-bold text-ink/40 dark:text-white/40 uppercase tracking-widest mb-1">
                    Carta
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="p-2 bg-gray-50 dark:bg-ink-muted border border-ink/10 dark:border-white/10 dark:border-white/10 rounded-xl text-xs font-medium text-ink dark:text-white focus:outline-none"
                  >
                    <option value="Todas">Todas as Cartas</option>
                    <option value="Carta CE (Pesados Articulados)">Carta CE</option>
                    <option value="Carta C (Pesados)">Carta C</option>
                    <option value="Carta D (Autocarros)">Carta D</option>
                    <option value="Carta C1">Carta C1</option>
                    <option value="Carta B (Ligeiros)">Carta B</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Jobs Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white dark:bg-ink-soft border border-ink/10 dark:border-white/10 rounded-xl p-5 shadow-sm hover:border-black dark:hover:border-white transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-black text-white dark:bg-white dark:text-black rounded text-[10px] font-bold font-mono uppercase tracking-widest">
                          {job.code}
                        </span>
                        <span className="text-[10px] font-bold text-[#059669] bg-[#D1FAE5] dark:bg-emerald-950/60 dark:text-emerald-400 px-2 py-0.5 rounded uppercase tracking-wider">
                          {job.status}
                        </span>
                      </div>

                      <h4 className="text-base font-extrabold text-ink dark:text-white leading-tight">
                        {job.title}
                      </h4>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300 font-medium bg-gray-50 dark:bg-ink-muted p-3 rounded-xl border border-gray-100 dark:border-white/[0.08]">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-bold text-ink dark:text-white">
                          <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                          <span>{job.category}</span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2 text-[11px] text-ink/50 dark:text-white/45">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Prazo de candidatura: {job.deadline}</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-3 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/[0.08]">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-1">
                          Requisitos Principais:
                        </span>
                        <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                          {job.requirements.slice(0, 2).map((req, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                              <span className="truncate">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartApply(job)}
                      className="w-full py-2.5 bg-ink dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-bold text-xs rounded-xl transition-colors uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <span>Candidatar-me a esta Vaga</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-white dark:bg-ink-soft border border-ink/10 dark:border-white/10 rounded-xl p-8 text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="text-sm font-bold text-ink dark:text-white">
                    Nenhuma vaga encontrada para os filtros selecionados.
                  </p>
                  <p className="text-xs text-ink/50 dark:text-white/45">
                    Pode submeter uma candidatura espontânea e a nossa equipa entrará em contacto quando surgir uma oportunidade na sua área.
                  </p>
                  <button
                    onClick={() => handleStartApply()}
                    className="px-4 py-2 bg-ink dark:bg-white text-white dark:text-black font-bold text-xs rounded-xl uppercase tracking-wider"
                  >
                    Fazer Candidatura Espontânea
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: APPLICATION FORM */}
        {activeTab === 'apply' && (
          <div className="bg-white dark:bg-ink-soft border border-ink/10 dark:border-white/10 rounded-xl p-6 shadow-sm space-y-6">
            {submittedCode ? (
              <div className="text-center py-8 space-y-4 max-w-xl mx-auto">
                <div className="w-16 h-16 bg-[#D1FAE5] text-[#059669] rounded-full flex items-center justify-center mx-auto border-2 border-[#059669]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-ink/40 dark:text-white/40 uppercase tracking-widest block">
                    CANDIDATURA SUBMETIDA COM SUCESSO!
                  </span>
                  <h3 className="text-xl font-black text-ink dark:text-white uppercase tracking-tight mt-1">
                    Obrigado, {fullName}!
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
                    A sua candidatura para a vaga TCB foi registada no nosso sistema de recrutamento.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-ink-muted rounded-xl border border-ink/10 dark:border-white/10 dark:border-white/10 font-mono text-center space-y-1">
                  <span className="text-[10px] text-gray-500 uppercase block font-sans font-bold">
                    Código de Referência da Candidatura
                  </span>
                  <span className="text-lg font-black text-ink dark:text-white">
                    {submittedCode}
                  </span>
                  <p className="text-[10px] text-gray-400 uppercase font-sans">
                    Guarde este código para acompanhar o estado do seu processo.
                  </p>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl text-left text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-[#D97706]" />
                    Próximos Passos:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[11px] pl-1">
                    <li>O departamento de RH da TCB em {province} irá validar a sua carta de condução.</li>
                    <li>Entraremos em contacto via telefone ({phone}) para agendar o teste prático de condução.</li>
                  </ul>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('track')}
                    className="px-5 py-2.5 bg-ink dark:bg-white text-white dark:text-black font-bold text-xs rounded-xl uppercase tracking-wider"
                  >
                    Consultar Minha Candidatura
                  </button>
                  <button
                    onClick={() => {
                      setSubmittedCode(null);
                      setActiveTab('jobs');
                    }}
                    className="px-5 py-2.5 bg-gray-100 dark:bg-ink-muted text-ink dark:text-white font-bold text-xs rounded-xl uppercase tracking-wider"
                  >
                    Voltar às Vagas
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-6">
                <div className="border-b border-ink/10 dark:border-white/10 pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-ink/40 dark:text-white/40 uppercase tracking-widest block">
                      FORMULÁRIO OFICIAL DE ADMISSÃO DE MOTORISTAS
                    </span>
                    <h3 className="text-lg font-black text-ink dark:text-white uppercase tracking-tight">
                      {selectedJob
                        ? `Candidatar-se a: ${selectedJob.title}`
                        : 'Candidatura Espontânea para Motorista TCB'}
                    </h3>
                  </div>

                  {selectedJob && (
                    <span className="px-3 py-1 bg-gray-100 dark:bg-ink-muted text-ink dark:text-white text-xs font-mono font-bold rounded uppercase">
                      {selectedJob.code}
                    </span>
                  )}
                </div>

                {/* Seção 1: Dados Pessoais */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-ink dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-white/[0.08] pb-1">
                    1. Dados Pessoais do Candidato
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[10px] mb-1">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ex: Carlos Ernesto Mabunda"
                        className="w-full p-2.5 bg-gray-50 dark:bg-ink-muted border border-ink/10 dark:border-white/10 dark:border-white/10 rounded-xl text-ink dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[10px] mb-1">
                        Número de Telefone (Contacto Directo) *
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+258 84 123 4567"
                        className="w-full p-2.5 bg-gray-50 dark:bg-ink-muted border border-ink/10 dark:border-white/10 dark:border-white/10 rounded-xl text-ink dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[10px] mb-1">
                        Número do BI (Bilhete de Identidade) *
                      </label>
                      <input
                        type="text"
                        value={biNumber}
                        onChange={(e) => setBiNumber(e.target.value)}
                        placeholder="Ex: 110100234105B"
                        className="w-full p-2.5 bg-gray-50 dark:bg-ink-muted border border-ink/10 dark:border-white/10 dark:border-white/10 rounded-xl text-ink dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[10px] mb-1">
                        Email (Opcional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu.email@exemplo.co.mz"
                        className="w-full p-2.5 bg-gray-50 dark:bg-ink-muted border border-ink/10 dark:border-white/10 dark:border-white/10 rounded-xl text-ink dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[10px] mb-1">
                        Província de Residência *
                      </label>
                      <select
                        value={province}
                        onChange={(e) => setProvince(e.target.value as MozambiqueProvince)}
                        className="w-full p-2.5 bg-gray-50 dark:bg-ink-muted border border-ink/10 dark:border-white/10 dark:border-white/10 rounded-xl text-ink dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                        required
                      >
                        <option value="Maputo Cidade">Maputo Cidade</option>
                        <option value="Maputo Província">Maputo Província</option>
                        <option value="Gaza">Gaza</option>
                        <option value="Inhambane">Inhambane</option>
                        <option value="Sofala (Beira)">Sofala (Beira)</option>
                        <option value="Manica">Manica</option>
                        <option value="Tete">Tete</option>
                        <option value="Zambézia">Zambézia</option>
                        <option value="Nampula">Nampula</option>
                        <option value="Cabo Delgado">Cabo Delgado</option>
                        <option value="Niassa">Niassa</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[10px] mb-1">
                        Cidade / Distrito
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ex: Matola / Beira / Nampula"
                        className="w-full p-2.5 bg-gray-50 dark:bg-ink-muted border border-ink/10 dark:border-white/10 dark:border-white/10 rounded-xl text-ink dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Seção 2: Carta de Condução e Experiência */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-ink dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-white/[0.08] pb-1">
                    2. Dados da Carta de Condução & Experiência
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[10px] mb-1">
                        Categoria da Carta *
                      </label>
                      <select
                        value={licenseCategory}
                        onChange={(e) => setLicenseCategory(e.target.value as LicenseCategory)}
                        className="w-full p-2.5 bg-gray-50 dark:bg-ink-muted border border-ink/10 dark:border-white/10 dark:border-white/10 rounded-xl text-ink dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                        required
                      >
                        <option value="Carta CE (Pesados Articulados)">Carta CE (Pesados Articulados)</option>
                        <option value="Carta C (Pesados)">Carta C (Pesados Rígidos)</option>
                        <option value="Carta D (Autocarros)">Carta D (Passageiros / Autocarro)</option>
                        <option value="Carta C1">Carta C1 (Ligeiros de Carga)</option>
                        <option value="Carta B (Ligeiros)">Carta B (Ligeiros)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[10px] mb-1">
                        Número da Carta de Condução *
                      </label>
                      <input
                        type="text"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        placeholder="Ex: C-904812/MP"
                        className="w-full p-2.5 bg-gray-50 dark:bg-ink-muted border border-ink/10 dark:border-white/10 dark:border-white/10 rounded-xl text-ink dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[10px] mb-1">
                        Anos de Experiência Profissional *
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={40}
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(Number(e.target.value))}
                        className="w-full p-2.5 bg-gray-50 dark:bg-ink-muted border border-ink/10 dark:border-white/10 dark:border-white/10 rounded-xl text-ink dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[10px] mb-1">
                        Data de Validade da Carta
                      </label>
                      <input
                        type="date"
                        value={licenseExpiryDate}
                        onChange={(e) => setLicenseExpiryDate(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 dark:bg-ink-muted border border-ink/10 dark:border-white/10 dark:border-white/10 rounded-xl text-ink dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[10px] mb-1">
                        Resumo do Histórico Profissional / Rotas Conhecidas
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        placeholder="Descreva as empresas onde conduziu, tipos de viaturas (ex: Camionetas Volvo, Scania, Autocarros) e rotas (ex: EN1 Maputo-Beira, corredor de Nacala)..."
                        className="w-full p-2.5 bg-gray-50 dark:bg-ink-muted border border-ink/10 dark:border-white/10 dark:border-white/10 rounded-xl text-ink dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Seção 3: Anexo de Documentos */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-ink dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-white/[0.08] pb-1">
                    3. Fotografia dos Documentos (Do Telemóvel / Computador)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    {/* Anexo BI */}
                    <div className="p-4 bg-gray-50 dark:bg-ink-muted border border-dashed border-gray-300 dark:border-white/10 rounded-xl text-center space-y-2">
                      <FileText className="w-6 h-6 text-gray-400 mx-auto" />
                      <div>
                        <span className="block font-bold text-ink dark:text-white text-xs">
                          Cópia do BI *
                        </span>
                        <span className="text-[10px] text-gray-500">Foto nítida da frente e verso</span>
                      </div>
                      {attachedBi ? (
                        <span className="inline-block px-2 py-1 bg-[#D1FAE5] text-[#059669] text-[10px] font-bold rounded">
                          ✓ {attachedBi}
                        </span>
                      ) : (
                        <label className="inline-block px-3 py-1.5 bg-ink dark:bg-white text-white dark:text-black text-[10px] font-bold rounded cursor-pointer uppercase tracking-wider">
                          Anexar BI
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileSimulate('bi', e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* Anexo Carta */}
                    <div className="p-4 bg-gray-50 dark:bg-ink-muted border border-dashed border-gray-300 dark:border-white/10 rounded-xl text-center space-y-2">
                      <ShieldCheck className="w-6 h-6 text-gray-400 mx-auto" />
                      <div>
                        <span className="block font-bold text-ink dark:text-white text-xs">
                          Carta de Condução *
                        </span>
                        <span className="text-[10px] text-gray-500">Documento emitido pelo INATRO</span>
                      </div>
                      {attachedLicense ? (
                        <span className="inline-block px-2 py-1 bg-[#D1FAE5] text-[#059669] text-[10px] font-bold rounded">
                          ✓ {attachedLicense}
                        </span>
                      ) : (
                        <label className="inline-block px-3 py-1.5 bg-ink dark:bg-white text-white dark:text-black text-[10px] font-bold rounded cursor-pointer uppercase tracking-wider">
                          Anexar Carta
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileSimulate('license', e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* Anexo Atestado Médico */}
                    <div className="p-4 bg-gray-50 dark:bg-ink-muted border border-dashed border-gray-300 dark:border-white/10 rounded-xl text-center space-y-2">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto" />
                      <div>
                        <span className="block font-bold text-ink dark:text-white text-xs">
                          Atestado Médico / Outro
                        </span>
                        <span className="text-[10px] text-gray-500">Registo criminal ou médico</span>
                      </div>
                      {attachedMedical ? (
                        <span className="inline-block px-2 py-1 bg-[#D1FAE5] text-[#059669] text-[10px] font-bold rounded">
                          ✓ {attachedMedical}
                        </span>
                      ) : (
                        <label className="inline-block px-3 py-1.5 bg-gray-200 dark:bg-ink-muted text-ink dark:text-white text-[10px] font-bold rounded cursor-pointer uppercase tracking-wider">
                          Anexar
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileSimulate('medical', e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-ink/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[11px] text-ink/50 dark:text-white/45">
                    Ao submeter, confirma a veracidade das informações sob responsabilidade legal com a TCB Moçambique.
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 bg-ink dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-extrabold text-xs rounded-xl shadow-md transition-colors uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submeter Candidatura</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: TRACKING */}
        {activeTab === 'track' && (
          <div className="bg-white dark:bg-ink-soft border border-ink/10 dark:border-white/10 rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-bold text-ink/40 dark:text-white/40 uppercase tracking-widest block">
                CONSULTA DE PROCESSOS DE MOTORISTAS
              </span>
              <h3 className="text-lg font-black text-ink dark:text-white uppercase tracking-tight">
                Acompanhar Estado da Candidatura
              </h3>
              <p className="text-xs text-ink/50 dark:text-white/45 mt-1">
                Introduza o seu Número de BI, Telefone ou Carta de Condução para verificar o estado do seu processo.
              </p>
            </div>

            <form onSubmit={handleSearchTracking} className="flex gap-2">
              <input
                type="text"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                placeholder="Ex: 110100234105B ou 841234567"
                className="flex-1 p-3 bg-gray-50 dark:bg-ink-muted border border-ink/10 dark:border-white/10 dark:border-white/10 rounded-xl text-xs font-medium text-ink dark:text-white focus:outline-none"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-ink dark:bg-white text-white dark:text-black font-bold text-xs rounded-xl uppercase tracking-wider shrink-0"
              >
                Pesquisar
              </button>
            </form>

            {hasSearchedTrack && (
              <div className="pt-4 border-t border-gray-100 dark:border-white/[0.08]">
                {trackedDriver ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-ink-muted rounded-xl border border-ink/10 dark:border-white/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={trackedDriver.photo}
                          alt={trackedDriver.fullName}
                          className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                        />
                        <div>
                          <h4 className="text-sm font-extrabold text-ink dark:text-white">
                            {trackedDriver.fullName}
                          </h4>
                          <p className="text-[11px] text-ink/50 dark:text-white/45 font-mono">
                            BI: {trackedDriver.biNumber} • {trackedDriver.licenseCategory}
                          </p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                            Província: {trackedDriver.province}
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                          Estado do Perfil
                        </span>
                        <span
                          className={`inline-block mt-1 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                            trackedDriver.status === 'Aprovado'
                              ? 'bg-[#D1FAE5] text-[#059669]'
                              : trackedDriver.status === 'Rejeitado'
                              ? 'bg-[#FEE2E2] text-[#DC2626]'
                              : 'bg-[#FEF3C7] text-[#D97706]'
                          }`}
                        >
                          {trackedDriver.status}
                        </span>
                      </div>
                    </div>

                    {/* Applications Associated */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-ink dark:text-white uppercase tracking-wider block">
                        Processos e Vagas Submetidas:
                      </span>
                      {trackedApps.length > 0 ? (
                        trackedApps.map((app) => (
                          <div
                            key={app.id}
                            className="p-4 bg-white dark:bg-ink-soft border border-ink/10 dark:border-white/10 rounded-xl flex items-center justify-between text-xs"
                          >
                            <div>
                              <p className="font-bold text-ink dark:text-white">
                                {app.jobTitle}
                              </p>
                              <p className="text-[10px] text-gray-500 font-mono">
                                Submetido em: {app.appliedDate} • Local: {app.jobLocation}
                              </p>
                            </div>
                            <span className="px-2.5 py-1 bg-black text-white dark:bg-white dark:text-black rounded text-[10px] font-bold uppercase tracking-wider">
                              Fase: {app.stage}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500 italic p-3 bg-gray-50 dark:bg-ink-muted rounded-xl">
                          Candidatura geral pendente de alocação de vaga pelo RH.
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center bg-gray-50 dark:bg-ink-muted rounded-xl space-y-2 text-xs">
                    <AlertCircle className="w-6 h-6 text-gray-400 mx-auto" />
                    <p className="font-bold text-ink dark:text-white">
                      Nenhum processo encontrado para "{trackQuery}".
                    </p>
                    <p className="text-ink/50 dark:text-white/45">
                      Verifique se introduziu o BI ou telefone correto ou faça uma nova candidatura online.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-ink-soft border-t border-ink/10 dark:border-white/10 py-6 px-4 text-center text-xs text-ink/50 dark:text-white/45 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} TCB - Transportes de Moçambique, S.A.</p>
          <div className="flex items-center gap-4 text-[11px] font-bold">
            <span className="text-ink dark:text-white">Maputo • Beira • Nampula • Tete</span>
            <span>Linha Direta RH: +258 21 000 000</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
