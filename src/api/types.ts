/**
 * API contract for TCB frontend.
 * Swap mockAdapter for HTTP implementation when backend is ready.
 */
import type {
  Driver,
  DriverStatus,
  DocumentStatus,
  JobOpening,
  CandidateApplication,
  ApplicationStage,
  User,
} from '../types';

export interface TcbApi {
  listDrivers(): Promise<Driver[]>;
  getDriver(id: string): Promise<Driver | undefined>;
  saveDriver(data: Partial<Driver>, editingId?: string): Promise<Driver>;
  deleteDriver(id: string): Promise<void>;
  updateDriverStatus(id: string, status: DriverStatus, notes?: string): Promise<Driver>;
  validateDocument(
    driverId: string,
    docId: string,
    status: DocumentStatus
  ): Promise<Driver>;

  listJobs(): Promise<JobOpening[]>;
  saveJob(data: Partial<JobOpening>, editingId?: string): Promise<JobOpening>;
  closeJob(id: string): Promise<JobOpening>;

  listApplications(): Promise<CandidateApplication[]>;
  changeApplicationStage(id: string, stage: ApplicationStage): Promise<CandidateApplication>;
  applyFromHome(
    driver: Omit<Driver, 'id'>,
    jobId?: string
  ): Promise<{ driver: Driver; application?: CandidateApplication }>;

  listUsers(): Promise<User[]>;
  addUser(data: Partial<User>): Promise<User>;
  updateUser(user: User): Promise<User>;
  toggleUserStatus(id: string): Promise<User>;

  login(email: string, _password: string): Promise<User | null>;
}

export type { Driver, JobOpening, CandidateApplication, User };
