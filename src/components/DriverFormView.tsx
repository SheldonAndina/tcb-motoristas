import React, { useState } from 'react';
import {
  ArrowLeft,
  Save,
  User,
  Phone,
  MapPin,
  CreditCard,
  Briefcase,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
} from 'lucide-react';
import {
  Driver,
  LicenseCategory,
  MozambiqueProvince,
  DriverDocument,
} from '../types';

interface DriverFormViewProps {
  initialDriver?: Driver | null;
  onSave: (driver: Partial<Driver>) => void;
  onCancel: () => void;
}

export const DriverFormView: React.FC<DriverFormViewProps> = ({
  initialDriver,
  onSave,
  onCancel,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  // Form Fields State
  const [fullName, setFullName] = useState(initialDriver?.fullName || '');
  const [biNumber, setBiNumber] = useState(initialDriver?.biNumber || '');
  const [nuitNumber, setNuitNumber] = useState(initialDriver?.nuitNumber || '');
  const [birthDate, setBirthDate] = useState(initialDriver?.birthDate || '1990-01-01');
  const [gender, setGender] = useState<'Masculino' | 'Feminino'>(
    initialDriver?.gender || 'Masculino'
  );

  const [phone, setPhone] = useState(initialDriver?.phone || '+258 ');
  const [email, setEmail] = useState(initialDriver?.email || '');
  const [province, setProvince] = useState<MozambiqueProvince>(
    initialDriver?.province || 'Maputo Cidade'
  );
  const [city, setCity] = useState(initialDriver?.city || 'Maputo');
  const [address, setAddress] = useState(initialDriver?.address || '');

  const [licenseNumber, setLicenseNumber] = useState(
    initialDriver?.licenseNumber || ''
  );
  const [licenseCategory, setLicenseCategory] = useState<LicenseCategory>(
    initialDriver?.licenseCategory || 'Carta CE (Pesados Articulados)'
  );
  const [licenseIssueDate, setLicenseIssueDate] = useState(
    initialDriver?.licenseIssueDate || '2018-01-01'
  );
  const [licenseExpiryDate, setLicenseExpiryDate] = useState(
    initialDriver?.licenseExpiryDate || '2028-01-01'
  );
  const [experienceYears, setExperienceYears] = useState<number>(
    initialDriver?.experienceYears || 5
  );

  const [bio, setBio] = useState(initialDriver?.bio || '');

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErr: Record<string, string> = {};
    if (!fullName.trim()) newErr.fullName = 'O nome completo é obrigatório.';
    if (!biNumber.trim()) newErr.biNumber = 'O número de BI é obrigatório.';
    if (!nuitNumber.trim()) newErr.nuitNumber = 'O NUIT é obrigatório.';
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const validateStep2 = () => {
    const newErr: Record<string, string> = {};
    if (!phone.trim() || phone.length < 9)
      newErr.phone = 'Introduza um contacto de telefone válido de Moçambique.';
    if (!city.trim()) newErr.city = 'A cidade/distrito é obrigatória.';
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const validateStep3 = () => {
    const newErr: Record<string, string> = {};
    if (!licenseNumber.trim())
      newErr.licenseNumber = 'O número da carta de condução é obrigatório.';
    if (experienceYears < 0)
      newErr.experienceYears = 'Anos de experiência inválidos.';
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2() || !validateStep3()) {
      return;
    }

    const newDriverData: Partial<Driver> = {
      id: initialDriver?.id,
      fullName,
      biNumber,
      nuitNumber,
      birthDate,
      gender,
      phone,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      province,
      city,
      address,
      licenseNumber,
      licenseCategory,
      licenseIssueDate,
      licenseExpiryDate,
      experienceYears: Number(experienceYears),
      bio,
      photo:
        initialDriver?.photo ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      status: initialDriver?.status || 'Pendente',
      applicationDate:
        initialDriver?.applicationDate || new Date().toISOString().slice(0, 10),
      workHistory: initialDriver?.workHistory || [
        {
          id: 'wh-new',
          companyName: 'Frota Regional Moçambique',
          roleTitle: 'Motorista de Pesados',
          startDate: '2021-01-01',
          endDate: '2026-01-01',
          vehicleTypes: 'Camião 20 Toneladas',
          responsibilities: 'Condução defensiva e entrega de mercadorias.',
        },
      ],
      documents: initialDriver?.documents || [
        {
          id: 'doc-bi-new',
          type: 'BI',
          name: 'Bilhete de Identidade',
          fileName: `BI_${fullName.replace(/\s+/g, '_')}.pdf`,
          fileSize: '1.2 MB',
          uploadDate: new Date().toISOString().slice(0, 10),
          status: 'Pendente',
        },
        {
          id: 'doc-carta-new',
          type: 'Carta de Condução',
          name: 'Carta de Condução Nacional',
          fileName: `Carta_${licenseCategory.slice(0, 8)}_${fullName.replace(
            /\s+/g,
            '_'
          )}.pdf`,
          fileSize: '1.8 MB',
          uploadDate: new Date().toISOString().slice(0, 10),
          status: 'Pendente',
        },
      ],
    };

    onSave(newDriverData);
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
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-ink-soft hover:bg-paper-muted dark:bg-white/10 border border-ink/10 dark:border-white/10 text-ink dark:text-white text-xs font-bold rounded-xl transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancelar</span>
        </button>

        <div className="text-right">
          <span className="text-[10px] font-bold text-ink/40 dark:text-white/40 uppercase tracking-widest block">FORMULÁRIO RH</span>
          <h2 className="text-base font-black text-ink dark:text-white tracking-tight">
            {initialDriver ? 'Editar Dados do Motorista' : 'Novo Cadastro de Motorista TCB'}
          </h2>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="bg-white dark:bg-ink-soft border border-ink/10 dark:border-white/10 rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-[10px]">
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`p-2.5 rounded-xl font-bold uppercase tracking-wider border transition-all ${
              activeStep === 1
                ? 'bg-black text-white border-black'
                : 'bg-paper-muted dark:bg-ink/50 text-ink dark:text-white border-ink/10 dark:border-white/10 hover:bg-paper-muted dark:bg-white/10'
            }`}
          >
            1. Dados Pessoais
          </button>
          <button
            type="button"
            onClick={() => {
              if (validateStep1()) setActiveStep(2);
            }}
            className={`p-2.5 rounded-xl font-bold uppercase tracking-wider border transition-all ${
              activeStep === 2
                ? 'bg-black text-white border-black'
                : 'bg-paper-muted dark:bg-ink/50 text-ink dark:text-white border-ink/10 dark:border-white/10 hover:bg-paper-muted dark:bg-white/10'
            }`}
          >
            2. Contactos & Morada
          </button>
          <button
            type="button"
            onClick={() => {
              if (validateStep1() && validateStep2()) setActiveStep(3);
            }}
            className={`p-2.5 rounded-xl font-bold uppercase tracking-wider border transition-all ${
              activeStep === 3
                ? 'bg-black text-white border-black'
                : 'bg-paper-muted dark:bg-ink/50 text-ink dark:text-white border-ink/10 dark:border-white/10 hover:bg-paper-muted dark:bg-white/10'
            }`}
          >
            3. Carta de Condução
          </button>
          <button
            type="button"
            onClick={() => {
              if (validateStep1() && validateStep2() && validateStep3())
                setActiveStep(4);
            }}
            className={`p-2.5 rounded-xl font-bold uppercase tracking-wider border transition-all ${
              activeStep === 4
                ? 'bg-black text-white border-black'
                : 'bg-paper-muted dark:bg-ink/50 text-ink dark:text-white border-ink/10 dark:border-white/10 hover:bg-paper-muted dark:bg-white/10'
            }`}
          >
            4. Documentos & Submissão
          </button>
        </div>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-ink-soft border border-ink/10 dark:border-white/10 rounded-xl p-6 shadow-sm space-y-6">
        {/* Step 1: Dados Pessoais */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-ink dark:text-white border-b border-ink/8 dark:border-white/10 pb-2 flex items-center gap-2 uppercase tracking-wider">
              <User className="w-4 h-4 text-ink dark:text-white" />
              <span>Etapa 1: Dados Pessoais e Identificação</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider text-[10px] mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Mateus Salomão Mabunda"
                  className={`w-full p-2.5 bg-paper-muted dark:bg-ink/50 border rounded-xl font-bold text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40 ${
                    errors.fullName ? 'border-red-500 bg-red-50/50' : 'border-ink/10 dark:border-white/10'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-[10px] text-[#DC2626] font-bold mt-1 uppercase tracking-wider">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider text-[10px] mb-1">
                  Número de BI (Bilhete de Identidade) *
                </label>
                <input
                  type="text"
                  value={biNumber}
                  onChange={(e) => setBiNumber(e.target.value)}
                  placeholder="Ex: 110100493821M"
                  className={`w-full p-2.5 bg-paper-muted dark:bg-ink/50 border rounded-xl font-mono font-bold text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40 ${
                    errors.biNumber ? 'border-red-500 bg-red-50/50' : 'border-ink/10 dark:border-white/10'
                  }`}
                />
                {errors.biNumber && (
                  <p className="text-[10px] text-[#DC2626] font-bold mt-1 uppercase tracking-wider">{errors.biNumber}</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider text-[10px] mb-1">
                  NUIT (Número de Identificação Tributária) *
                </label>
                <input
                  type="text"
                  value={nuitNumber}
                  onChange={(e) => setNuitNumber(e.target.value)}
                  placeholder="Ex: 109845210"
                  className={`w-full p-2.5 bg-paper-muted dark:bg-ink/50 border rounded-xl font-mono font-bold text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40 ${
                    errors.nuitNumber ? 'border-red-500 bg-red-50/50' : 'border-ink/10 dark:border-white/10'
                  }`}
                />
                {errors.nuitNumber && (
                  <p className="text-[10px] text-[#DC2626] font-bold mt-1 uppercase tracking-wider">{errors.nuitNumber}</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider text-[10px] mb-1">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full p-2.5 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl font-medium text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>

              <div>
                <label className="block font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider text-[10px] mb-1">Género</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'Masculino' | 'Feminino')}
                  className="w-full p-2.5 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl font-bold text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setActiveStep(2);
                }}
                className="px-5 py-2.5 bg-ink hover:bg-ink-soft dark:bg-white dark:text-ink dark:hover:bg-paper-muted text-white text-xs font-bold rounded-xl uppercase tracking-wider"
              >
                Próximo: Contactos & Morada →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Contactos & Morada */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-ink dark:text-white border-b border-ink/8 dark:border-white/10 pb-2 flex items-center gap-2 uppercase tracking-wider">
              <Phone className="w-4 h-4 text-ink dark:text-white" />
              <span>Etapa 2: Contactos e Localização em Moçambique</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider text-[10px] mb-1">
                  Contacto Telefónico (+258) *
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+258 84 000 0000"
                  className={`w-full p-2.5 bg-paper-muted dark:bg-ink/50 border rounded-xl font-mono font-bold text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40 ${
                    errors.phone ? 'border-red-500 bg-red-50/50' : 'border-ink/10 dark:border-white/10'
                  }`}
                />
                {errors.phone && (
                  <p className="text-[10px] text-[#DC2626] font-bold mt-1 uppercase tracking-wider">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider text-[10px] mb-1">
                  Endereço de Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@gmail.com"
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
                  Cidade / Distrito *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: Maputo, Matola, Beira, Nampula..."
                  className={`w-full p-2.5 bg-paper-muted dark:bg-ink/50 border rounded-xl font-bold text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40 ${
                    errors.city ? 'border-red-500 bg-red-50/50' : 'border-ink/10 dark:border-white/10'
                  }`}
                />
                {errors.city && (
                  <p className="text-[10px] text-[#DC2626] font-bold mt-1 uppercase tracking-wider">{errors.city}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider text-[10px] mb-1">
                  Morada Residencial Detalhada
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Bairro, Quarteirão, Av/Rua, Casa nº..."
                  className="w-full p-2.5 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl font-medium text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="px-4 py-2 bg-paper-muted dark:bg-white/10 hover:bg-paper-muted dark:hover:bg-white/15 text-ink dark:text-white text-xs font-bold rounded-xl uppercase tracking-wider"
              >
                ← Anterior
              </button>
              <button
                type="button"
                onClick={() => {
                  if (validateStep2()) setActiveStep(3);
                }}
                className="px-5 py-2.5 bg-ink hover:bg-ink-soft dark:bg-white dark:text-ink dark:hover:bg-paper-muted text-white text-xs font-bold rounded-xl uppercase tracking-wider"
              >
                Próximo: Carta de Condução →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Carta de Condução */}
        {activeStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-ink dark:text-white border-b border-ink/8 dark:border-white/10 pb-2 flex items-center gap-2 uppercase tracking-wider">
              <CreditCard className="w-4 h-4 text-ink dark:text-white" />
              <span>Etapa 3: Dados da Carta de Condução (INATRO)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider text-[10px] mb-1">
                  Categoria da Carta de Condução *
                </label>
                <select
                  value={licenseCategory}
                  onChange={(e) =>
                    setLicenseCategory(e.target.value as LicenseCategory)
                  }
                  className="w-full p-2.5 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl font-bold text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  <option value="Carta CE (Pesados Articulados)">
                    Carta CE (Pesados Articulados)
                  </option>
                  <option value="Carta C (Pesados)">Carta C (Pesados Rígidos)</option>
                  <option value="Carta D (Autocarros)">
                    Carta D (Autocarros de Passageiros)
                  </option>
                  <option value="Carta C1">Carta C1 (Ligeiros Carga)</option>
                  <option value="Carta B (Ligeiros)">Carta B (Ligeiros)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider text-[10px] mb-1">
                  Número da Carta de Condução *
                </label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="Ex: MZ-89412-C"
                  className={`w-full p-2.5 bg-paper-muted dark:bg-ink/50 border rounded-xl font-mono font-bold text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40 ${
                    errors.licenseNumber
                      ? 'border-red-500 bg-red-50/50'
                      : 'border-ink/10 dark:border-white/10'
                  }`}
                />
                {errors.licenseNumber && (
                  <p className="text-[10px] text-[#DC2626] font-bold mt-1 uppercase tracking-wider">
                    {errors.licenseNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider text-[10px] mb-1">
                  Data de Emissão
                </label>
                <input
                  type="date"
                  value={licenseIssueDate}
                  onChange={(e) => setLicenseIssueDate(e.target.value)}
                  className="w-full p-2.5 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl font-medium text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>

              <div>
                <label className="block font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider text-[10px] mb-1">
                  Data de Validade (Expiração)
                </label>
                <input
                  type="date"
                  value={licenseExpiryDate}
                  onChange={(e) => setLicenseExpiryDate(e.target.value)}
                  className="w-full p-2.5 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl font-medium text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>

              <div>
                <label className="block font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider text-[10px] mb-1">
                  Anos de Experiência em Condução
                </label>
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full p-2.5 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl font-bold text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-ink/70 dark:text-white/65 uppercase tracking-wider text-[10px] mb-1">
                  Resumo de Experiência e Observações
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Rotas habituais, experiência em fronteiras (Ressano Garcia, Machipanda, Cuchamano...)"
                  className="w-full p-2.5 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl text-xs font-medium text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-4 py-2 bg-paper-muted dark:bg-white/10 hover:bg-paper-muted dark:hover:bg-white/15 text-ink dark:text-white text-xs font-bold rounded-xl uppercase tracking-wider"
              >
                ← Anterior
              </button>
              <button
                type="button"
                onClick={() => {
                  if (validateStep3()) setActiveStep(4);
                }}
                className="px-5 py-2.5 bg-ink hover:bg-ink-soft dark:bg-white dark:text-ink dark:hover:bg-paper-muted text-white text-xs font-bold rounded-xl uppercase tracking-wider"
              >
                Próximo: Documentos & Finalizar →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Upload de Documentos & Finalização */}
        {activeStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-ink dark:text-white border-b border-ink/8 dark:border-white/10 pb-2 flex items-center gap-2 uppercase tracking-wider">
              <UploadCloud className="w-4 h-4 text-ink dark:text-white" />
              <span>Etapa 4: Anexo de Documentos Comprovativos</span>
            </h3>

            {/* Simulated File Upload Box */}
            <div className="border border-dashed border-ink/15 dark:border-white/15 rounded-xl p-6 text-center bg-paper-muted dark:bg-ink/50 hover:bg-paper-muted dark:bg-white/10 transition-colors cursor-pointer">
              <UploadCloud className="w-8 h-8 text-ink/40 dark:text-white/40 mx-auto mb-2" />
              <p className="text-xs font-bold text-ink dark:text-white uppercase tracking-wider">
                Arraste e solte os ficheiros em PDF ou JPG aqui
              </p>
              <p className="text-[10px] text-ink/50 dark:text-white/45 mt-1 font-medium">
                (BI, Carta de Condução, Atestado Médico, Registo Criminal e Certificados)
              </p>
              <button
                type="button"
                className="mt-3 px-3.5 py-1.5 bg-white dark:bg-ink-soft border border-ink/15 dark:border-white/15 rounded-xl text-[10px] font-bold text-ink dark:text-white uppercase tracking-wider hover:bg-paper-muted dark:bg-ink/50 transition-colors"
              >
                Selecionar Ficheiros do Computador
              </button>
            </div>

            {/* Simulated Attached List */}
            <div className="space-y-2 pt-2">
              <p className="text-[10px] font-bold text-ink/40 dark:text-white/40 uppercase tracking-widest">
                Ficheiros Anexados para este Registo:
              </p>
              <div className="p-3 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-ink dark:text-white" />
                  <span className="font-bold text-ink dark:text-white">
                    BI_{fullName ? fullName.replace(/\s+/g, '_') : 'Motorista'}.pdf
                  </span>
                  <span className="text-[10px] text-ink/40 dark:text-white/40 font-mono">1.2 MB</span>
                </div>
                <span className="text-[10px] bg-[#D1FAE5] text-[#059669] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Pronto
                </span>
              </div>

              <div className="p-3 bg-paper-muted dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-ink dark:text-white" />
                  <span className="font-bold text-ink dark:text-white">
                    Carta_{licenseCategory.slice(0, 8)}.pdf
                  </span>
                  <span className="text-[10px] text-ink/40 dark:text-white/40 font-mono">1.8 MB</span>
                </div>
                <span className="text-[10px] bg-[#D1FAE5] text-[#059669] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Pronto
                </span>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-ink/10 dark:border-white/10">
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="px-4 py-2 bg-paper-muted dark:bg-white/10 hover:bg-paper-muted dark:hover:bg-white/15 text-ink dark:text-white text-xs font-bold rounded-xl uppercase tracking-wider"
              >
                ← Anterior
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 bg-white dark:bg-ink-soft border border-ink/15 dark:border-white/15 text-ink dark:text-white text-xs font-bold rounded-xl uppercase tracking-wider hover:bg-paper-muted dark:bg-ink/50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-ink hover:bg-ink-soft dark:bg-white dark:text-ink dark:hover:bg-paper-muted text-white text-xs font-bold rounded-xl uppercase tracking-wider flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Registo do Motorista</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
