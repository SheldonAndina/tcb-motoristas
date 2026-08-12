import type {
  Driver,
  DriverStatus,
  DocumentStatus,
  JobOpening,
  CandidateApplication,
  ApplicationStage,
  User,
} from '../../types';
import {
  INITIAL_DRIVERS,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
  INITIAL_USERS,
} from '../../data/mockData';
import type { TcbApi } from '../types';

const delay = (ms = 180) => new Promise((r) => setTimeout(r, ms));

let drivers: Driver[] = structuredClone(INITIAL_DRIVERS);
let jobs: JobOpening[] = structuredClone(INITIAL_JOBS);
let applications: CandidateApplication[] = structuredClone(INITIAL_APPLICATIONS);
let users: User[] = structuredClone(INITIAL_USERS);

function rid(prefix: string) {
  return `${prefix}-${Math.floor(Math.random() * 8999 + 1000)}`;
}

export const mockApi: TcbApi = {
  async listDrivers() {
    await delay();
    return structuredClone(drivers);
  },

  async getDriver(id) {
    await delay(80);
    return structuredClone(drivers.find((d) => d.id === id));
  },

  async saveDriver(data, editingId) {
    await delay();
    if (editingId) {
      drivers = drivers.map((d) =>
        d.id === editingId ? ({ ...d, ...data } as Driver) : d
      );
      return structuredClone(drivers.find((d) => d.id === editingId)!);
    }

    const fullNewDriver: Driver = {
      id: `MOT-${Math.floor(Math.random() * 8999 + 1000)}`,
      fullName: data.fullName || 'Novo Motorista',
      photo:
        data.photo ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      phone: data.phone || '+258 84 000 0000',
      email: data.email || 'motorista@tcb.co.mz',
      biNumber: data.biNumber || '110000000000A',
      nuitNumber: data.nuitNumber || '100000000',
      licenseNumber: data.licenseNumber || 'MZ-00000-C',
      licenseCategory: data.licenseCategory || 'Carta CE (Pesados Articulados)',
      licenseIssueDate: data.licenseIssueDate || '2020-01-01',
      licenseExpiryDate: data.licenseExpiryDate || '2028-01-01',
      experienceYears: data.experienceYears || 5,
      status: 'Pendente',
      applicationDate: new Date().toISOString().slice(0, 10),
      province: data.province || 'Maputo Cidade',
      city: data.city || 'Maputo',
      address: data.address || 'Maputo',
      birthDate: data.birthDate || '1990-01-01',
      gender: data.gender || 'Masculino',
      bio: data.bio || 'Candidato submetido no sistema.',
      workHistory: data.workHistory || [],
      documents: data.documents || [],
    };

    drivers = [fullNewDriver, ...drivers];

    const newApp: CandidateApplication = {
      id: rid('APP'),
      driverId: fullNewDriver.id,
      driverName: fullNewDriver.fullName,
      driverPhoto: fullNewDriver.photo,
      driverPhone: fullNewDriver.phone,
      driverCategory: fullNewDriver.licenseCategory,
      jobId: 'VAG-101',
      jobTitle: 'Motorista de Cargas Pesadas Articuladas (CE)',
      jobLocation: 'Maputo / Rota Interprovincial',
      appliedDate: fullNewDriver.applicationDate,
      stage: 'Candidatura',
    };
    applications = [newApp, ...applications];

    return structuredClone(fullNewDriver);
  },

  async deleteDriver(id) {
    await delay();
    drivers = drivers.filter((d) => d.id !== id);
    applications = applications.filter((a) => a.driverId !== id);
  },

  async updateDriverStatus(id, status: DriverStatus, notes?: string) {
    await delay();
    drivers = drivers.map((d) =>
      d.id === id ? { ...d, status, notes: notes || d.notes } : d
    );
    applications = applications.map((app) => {
      if (app.driverId !== id) return app;
      if (status === 'Aprovado') return { ...app, stage: 'Aprovado' as const };
      if (status === 'Rejeitado') return { ...app, stage: 'Rejeitado' as const };
      return app;
    });
    return structuredClone(drivers.find((d) => d.id === id)!);
  },

  async validateDocument(driverId, docId, status: DocumentStatus) {
    await delay();
    drivers = drivers.map((driver) => {
      if (driver.id !== driverId) return driver;
      return {
        ...driver,
        documents: driver.documents.map((doc) =>
          doc.id === docId ? { ...doc, status } : doc
        ),
      };
    });
    return structuredClone(drivers.find((d) => d.id === driverId)!);
  },

  async listJobs() {
    await delay();
    return structuredClone(jobs);
  },

  async saveJob(data, editingId) {
    await delay();
    if (editingId) {
      jobs = jobs.map((j) =>
        j.id === editingId ? ({ ...j, ...data } as JobOpening) : j
      );
      return structuredClone(jobs.find((j) => j.id === editingId)!);
    }

    const newJob: JobOpening = {
      id: `VAG-${Math.floor(Math.random() * 800 + 200)}`,
      code: data.code || 'TCB-VAG-2026-09',
      title: data.title || 'Nova Vaga TCB',
      location: data.location || 'Maputo',
      province: data.province || 'Maputo Cidade',
      category: data.category || 'Carta CE (Pesados Articulados)',
      experienceYears: data.experienceYears || 5,
      publishDate: new Date().toISOString().slice(0, 10),
      deadline: data.deadline || '2026-10-01',
      candidatesCount: 0,
      status: data.status || 'Aberta',
      description: data.description || 'Descrição da oportunidade TCB.',
      requirements: data.requirements || ['Carta Válida'],
      benefits: data.benefits || ['Salário competitivo'],
      salaryRange: data.salaryRange,
    };
    jobs = [newJob, ...jobs];
    return structuredClone(newJob);
  },

  async closeJob(id) {
    await delay();
    jobs = jobs.map((j) =>
      j.id === id ? { ...j, status: 'Fechada' as const } : j
    );
    return structuredClone(jobs.find((j) => j.id === id)!);
  },

  async listApplications() {
    await delay();
    return structuredClone(applications);
  },

  async changeApplicationStage(id, stage: ApplicationStage) {
    await delay();
    applications = applications.map((app) =>
      app.id === id ? { ...app, stage } : app
    );
    return structuredClone(applications.find((a) => a.id === id)!);
  },

  async applyFromHome(newDriverData, selectedJobId) {
    await delay(320);
    const createdDriver: Driver = {
      ...newDriverData,
      id: `MOT-${1000 + drivers.length + 1}`,
    };
    drivers = [createdDriver, ...drivers];

    let application: CandidateApplication | undefined;
    if (selectedJobId) {
      const targetJob = jobs.find((j) => j.id === selectedJobId);
      if (targetJob) {
        jobs = jobs.map((j) =>
          j.id === selectedJobId
            ? { ...j, candidatesCount: j.candidatesCount + 1 }
            : j
        );
        application = {
          id: `APP-${Date.now()}`,
          driverId: createdDriver.id,
          driverName: createdDriver.fullName,
          driverPhoto: createdDriver.photo,
          driverPhone: createdDriver.phone,
          driverCategory: createdDriver.licenseCategory,
          jobId: targetJob.id,
          jobTitle: targetJob.title,
          jobLocation: targetJob.location,
          appliedDate: new Date().toISOString().split('T')[0],
          stage: 'Candidatura',
          rating: 0,
          notes: 'Candidatura online enviada de casa pelo motorista.',
        };
        applications = [application, ...applications];
      }
    }

    return {
      driver: structuredClone(createdDriver),
      application: application ? structuredClone(application) : undefined,
    };
  },

  async listUsers() {
    await delay();
    return structuredClone(users);
  },

  async addUser(userData) {
    await delay();
    const newUser: User = {
      id: rid('usr'),
      name: userData.name || 'Novo Utilizador',
      email: userData.email || 'operador@tcb.co.mz',
      role: userData.role || 'Recrutador',
      status: 'Ativo',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      lastAccess: 'Agora',
    };
    users = [...users, newUser];
    return structuredClone(newUser);
  },

  async updateUser(updatedUser) {
    await delay();
    users = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    return structuredClone(updatedUser);
  },

  async toggleUserStatus(id) {
    await delay();
    users = users.map((u) => {
      if (u.id !== id) return u;
      return { ...u, status: u.status === 'Ativo' ? 'Inativo' : 'Ativo' };
    });
    return structuredClone(users.find((u) => u.id === id)!);
  },

  async login(email, _password) {
    await delay(400);
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found?.status === 'Inativo') return null;
    return found ? structuredClone(found) : structuredClone(users[0]);
  },
};
