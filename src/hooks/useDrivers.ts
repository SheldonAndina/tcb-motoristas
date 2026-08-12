import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import type {
  Driver,
  DriverStatus,
  DocumentStatus,
  JobOpening,
  CandidateApplication,
  ApplicationStage,
  User,
} from '../types';

export function useDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listDrivers();
      setDrivers(data);
    } catch {
      setError('Falha ao carregar motoristas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveDriver = useCallback(async (data: Partial<Driver>, editingId?: string) => {
    const saved = await api.saveDriver(data, editingId);
    setDrivers(await api.listDrivers());
    return saved;
  }, []);

  const deleteDriver = useCallback(async (id: string) => {
    await api.deleteDriver(id);
    setDrivers(await api.listDrivers());
  }, []);

  const updateDriverStatus = useCallback(
    async (id: string, status: DriverStatus, notes?: string) => {
      await api.updateDriverStatus(id, status, notes);
      setDrivers(await api.listDrivers());
    },
    []
  );

  const validateDocument = useCallback(
    async (driverId: string, docId: string, status: DocumentStatus) => {
      await api.validateDocument(driverId, docId, status);
      setDrivers(await api.listDrivers());
    },
    []
  );

  return {
    drivers,
    setDrivers,
    loading,
    error,
    refresh,
    saveDriver,
    deleteDriver,
    updateDriverStatus,
    validateDocument,
  };
}

export function useJobs() {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setJobs(await api.listJobs());
    } catch {
      setError('Falha ao carregar vagas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveJob = useCallback(async (data: Partial<JobOpening>, editingId?: string) => {
    const saved = await api.saveJob(data, editingId);
    setJobs(await api.listJobs());
    return saved;
  }, []);

  const closeJob = useCallback(async (id: string) => {
    await api.closeJob(id);
    setJobs(await api.listJobs());
  }, []);

  return { jobs, setJobs, loading, error, refresh, saveJob, closeJob };
}

export function useApplications() {
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setApplications(await api.listApplications());
    } catch {
      setError('Falha ao carregar candidaturas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const changeStage = useCallback(async (id: string, stage: ApplicationStage) => {
    await api.changeApplicationStage(id, stage);
    setApplications(await api.listApplications());
  }, []);

  const applyFromHome = useCallback(
    async (driver: Omit<Driver, 'id'>, jobId?: string) => {
      const result = await api.applyFromHome(driver, jobId);
      setApplications(await api.listApplications());
      return result;
    },
    []
  );

  return {
    applications,
    setApplications,
    loading,
    error,
    refresh,
    changeStage,
    applyFromHome,
  };
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setUsers(await api.listUsers());
    } catch {
      setError('Falha ao carregar utilizadores.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addUser = useCallback(async (data: Partial<User>) => {
    const saved = await api.addUser(data);
    setUsers(await api.listUsers());
    return saved;
  }, []);

  const updateUser = useCallback(async (user: User) => {
    await api.updateUser(user);
    setUsers(await api.listUsers());
  }, []);

  const toggleUserStatus = useCallback(async (id: string) => {
    await api.toggleUserStatus(id);
    setUsers(await api.listUsers());
  }, []);

  return {
    users,
    setUsers,
    loading,
    error,
    refresh,
    addUser,
    updateUser,
    toggleUserStatus,
  };
}
