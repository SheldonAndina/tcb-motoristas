export type Role = 'Admin' | 'Recrutador' | 'Gestor de Frota';

export type UserStatus = 'Ativo' | 'Inativo';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  avatar: string;
  lastAccess: string;
}

export type DriverStatus = 'Pendente' | 'Em análise' | 'Aprovado' | 'Rejeitado';

export type LicenseCategory =
  | 'Carta B (Ligeiros)'
  | 'Carta C (Pesados)'
  | 'Carta C1'
  | 'Carta CE (Pesados Articulados)'
  | 'Carta D (Autocarros)'
  | 'Carta D1';

export type MozambiqueProvince =
  | 'Maputo Cidade'
  | 'Maputo Província'
  | 'Gaza'
  | 'Inhambane'
  | 'Sofala (Beira)'
  | 'Manica'
  | 'Tete'
  | 'Zambézia'
  | 'Nampula'
  | 'Cabo Delgado'
  | 'Niassa';

export type DocumentType =
  | 'BI'
  | 'Carta de Condução'
  | 'Atestado Médico'
  | 'Registo Criminal'
  | 'Certificado de Formação'
  | 'Outro';

export type DocumentStatus = 'Válido' | 'Pendente' | 'Rejeitado' | 'Expirado';

export interface DriverDocument {
  id: string;
  type: DocumentType;
  name: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  expiryDate?: string;
  status: DocumentStatus;
  notes?: string;
  previewUrl?: string;
}

export interface WorkExperience {
  id: string;
  companyName: string;
  roleTitle: string;
  startDate: string;
  endDate: string;
  vehicleTypes: string;
  responsibilities: string;
}

export interface Driver {
  id: string;
  fullName: string;
  photo: string;
  phone: string;
  email: string;
  biNumber: string;
  nuitNumber: string;
  licenseNumber: string;
  licenseCategory: LicenseCategory;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  experienceYears: number;
  status: DriverStatus;
  applicationDate: string;
  province: MozambiqueProvince;
  city: string;
  address: string;
  birthDate: string;
  gender: 'Masculino' | 'Feminino';
  bio?: string;
  workHistory: WorkExperience[];
  documents: DriverDocument[];
  assignedJobId?: string;
  rating?: number; // 1 to 5
  notes?: string;
}

export type JobStatus = 'Aberta' | 'Em Seleção' | 'Fechada';

export interface JobOpening {
  id: string;
  code: string;
  title: string;
  location: string;
  province: MozambiqueProvince;
  category: LicenseCategory;
  experienceYears: number;
  publishDate: string;
  deadline: string;
  candidatesCount: number;
  status: JobStatus;
  description: string;
  requirements: string[];
  benefits: string[];
  salaryRange?: string;
}

export type ApplicationStage =
  | 'Candidatura'
  | 'Em Análise'
  | 'Entrevista'
  | 'Teste Prático'
  | 'Aprovado'
  | 'Rejeitado';

export interface CandidateApplication {
  id: string;
  driverId: string;
  driverName: string;
  driverPhoto: string;
  driverPhone: string;
  driverCategory: LicenseCategory;
  jobId: string;
  jobTitle: string;
  jobLocation: string;
  appliedDate: string;
  stage: ApplicationStage;
  rating?: number;
  notes?: string;
  evaluator?: string;
}

export type ActivePage =
  | 'dashboard'
  | 'drivers'
  | 'driver-profile'
  | 'driver-form'
  | 'jobs'
  | 'job-detail'
  | 'applications'
  | 'documents'
  | 'users'
  | 'settings';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

export interface ConfirmationModalState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmVariant?: 'danger' | 'primary' | 'warning';
  requiresReason?: boolean;
  onConfirm: (reason?: string) => void;
}
