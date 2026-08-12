import React, { useState } from 'react';
import {
  ActivePage,
  Driver,
  DriverStatus,
  JobOpening,
  DocumentStatus,
  ApplicationStage,
  DriverDocument,
  ConfirmationModalState,
  User,
} from './types';
import { INITIAL_USERS } from './data/mockData';
import { useAuth, useTheme, useToast } from './context/AppProviders';
import { useDrivers, useJobs, useApplications, useUsers } from './hooks';
import { navigateTo, useHashRoute } from './lib/routing';

import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { DriversListView } from './components/DriversListView';
import { DriverProfileView } from './components/DriverProfileView';
import { DriverFormView } from './components/DriverFormView';
import { JobsView } from './components/JobsView';
import { JobDetailModal } from './components/JobDetailModal';
import { JobFormModal } from './components/JobFormModal';
import { ApplicationsPipelineView } from './components/ApplicationsPipelineView';
import { DocumentsManagementView } from './components/DocumentsManagementView';
import { UsersManagementView } from './components/UsersManagementView';
import { SettingsView } from './components/SettingsView';
import { ConfirmationModal } from './components/ConfirmationModal';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { ToastContainer } from './components/ToastContainer';
import { PublicCandidatePortal } from './components/PublicCandidatePortal';
import { LoadingState, ErrorState } from './components/ui';

/** Portal público de candidatura — experiência separada da gestão */
function CandidateApp() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { toasts, addToast, dismissToast } = useToast();
  const driversApi = useDrivers();
  const jobsApi = useJobs();
  const appsApi = useApplications();

  const handleApplyFromHome = async (
    newDriverData: Omit<Driver, 'id'>,
    selectedJobId?: string
  ) => {
    const result = await appsApi.applyFromHome(newDriverData, selectedJobId);
    await driversApi.refresh();
    await jobsApi.refresh();
    addToast(
      'Candidatura recebida',
      `A candidatura de ${result.driver.fullName} foi registada. Guarde o código de acompanhamento.`,
      'success'
    );
  };

  return (
    <>
      <PublicCandidatePortal
        jobs={jobsApi.jobs}
        drivers={driversApi.drivers}
        applications={appsApi.applications}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onApplyFromHome={handleApplyFromHome}
        onClose={() => navigateTo('gestao')}
      />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}

/** Portal de gestão / recrutadores — área autenticada */
function RecruiterApp() {
  const { isLoggedIn, currentUser, login, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { toasts, addToast, dismissToast } = useToast();

  const driversApi = useDrivers();
  const jobsApi = useJobs();
  const appsApi = useApplications();
  const usersApi = useUsers();

  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>('MOT-1001');
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DriverDocument | null>(null);
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);
  const [searchQueryGlobal, setSearchQueryGlobal] = useState('');

  const [confirmModalState, setConfirmModalState] = useState<ConfirmationModalState>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirmar',
    confirmVariant: 'danger',
    requiresReason: false,
    onConfirm: () => {},
  });

  const pendingDriversCount = driversApi.drivers.filter(
    (d) => d.status === 'Pendente' || d.status === 'Em análise'
  ).length;
  const pendingDocsCount = driversApi.drivers.reduce(
    (acc, d) => acc + d.documents.filter((doc) => doc.status === 'Pendente').length,
    0
  );
  const openJobsCount = jobsApi.jobs.filter((j) => j.status === 'Aberta').length;

  const handleSelectDriver = (driverId: string) => {
    setSelectedDriverId(driverId);
    setActivePage('driver-profile');
  };

  const handleOpenNewDriverForm = () => {
    setEditingDriver(null);
    setActivePage('driver-form');
  };

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver);
    setActivePage('driver-form');
  };

  const handleSaveDriver = async (driverData: Partial<Driver>) => {
    const saved = await driversApi.saveDriver(driverData, editingDriver?.id);
    await appsApi.refresh();
    addToast(
      editingDriver ? 'Motorista atualizado' : 'Cadastro efetuado',
      editingDriver
        ? `${saved.fullName} atualizado com sucesso.`
        : `Motorista ${saved.fullName} cadastrado com sucesso.`
    );
    setActivePage('drivers');
  };

  const handleChangeDriverStatus = async (
    driverId: string,
    newStatus: DriverStatus,
    notes?: string
  ) => {
    await driversApi.updateDriverStatus(driverId, newStatus, notes);
    await appsApi.refresh();
    addToast('Estado alterado', `Estado atualizado para: ${newStatus}.`);
  };

  const handleDeleteDriver = (driverId: string, driverName: string) => {
    setConfirmModalState({
      isOpen: true,
      title: 'Eliminar registo de motorista',
      message: `Tem a certeza que deseja eliminar definitivamente o registo de ${driverName}? Esta ação é irreversível.`,
      confirmLabel: 'Eliminar registo',
      confirmVariant: 'danger',
      requiresReason: true,
      onConfirm: async () => {
        await driversApi.deleteDriver(driverId);
        await appsApi.refresh();
        addToast('Registo eliminado', `Motorista ${driverName} removido.`, 'warning');
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleValidateDocument = async (
    driverId: string,
    docId: string,
    newStatus: DocumentStatus
  ) => {
    await driversApi.validateDocument(driverId, docId, newStatus);
    addToast(
      'Documento atualizado',
      `Documento marcado como: ${newStatus}`,
      newStatus === 'Válido' ? 'success' : 'warning'
    );
  };

  const handleSaveJob = async (jobData: Partial<JobOpening>) => {
    const saved = await jobsApi.saveJob(jobData, editingJob?.id);
    addToast(
      editingJob ? 'Vaga atualizada' : 'Vaga criada',
      editingJob ? `Vaga ${saved.title} guardada.` : `Nova vaga: ${saved.title}.`
    );
    setEditingJob(null);
    setIsCreatingJob(false);
  };

  const handleCloseJob = (jobId: string) => {
    setConfirmModalState({
      isOpen: true,
      title: 'Fechar vaga',
      message: 'Novos candidatos não poderão concorrer a esta vaga.',
      confirmLabel: 'Fechar vaga',
      confirmVariant: 'warning',
      requiresReason: false,
      onConfirm: async () => {
        await jobsApi.closeJob(jobId);
        addToast('Vaga fechada', 'A vaga foi encerrada.', 'info');
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleChangeApplicationStage = async (
    applicationId: string,
    newStage: ApplicationStage
  ) => {
    await appsApi.changeStage(applicationId, newStage);
    addToast('Fase atualizada', `Candidato avançou para: ${newStage}`);
  };

  const handleAddUser = async (userData: Partial<User>) => {
    const u = await usersApi.addUser(userData);
    addToast('Utilizador adicionado', `${u.name} tem acesso ao sistema.`);
  };

  const handleEditUser = async (updatedUser: User) => {
    await usersApi.updateUser(updatedUser);
    addToast('Utilizador atualizado', `Dados de ${updatedUser.name} guardados.`);
  };

  const handleToggleUserStatus = async (userId: string) => {
    await usersApi.toggleUserStatus(userId);
    addToast('Estado de acesso', 'Estado do utilizador atualizado.', 'info');
  };

  const handleToggleTheme = () => {
    toggleDarkMode();
  };

  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen
          users={usersApi.users.length ? usersApi.users : INITIAL_USERS}
          onLoginSuccess={(user) => {
            login(user);
            addToast('Sessão iniciada', `Bem-vindo, ${user.name}.`);
          }}
          onOpenPublicPortal={() => navigateTo('candidatura')}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  if (!currentUser) return null;

  const bootLoading = driversApi.loading && driversApi.drivers.length === 0;
  const bootError =
    !bootLoading &&
    (driversApi.error || jobsApi.error || appsApi.error || usersApi.error);

  const currentSelectedDriver =
    driversApi.drivers.find((d) => d.id === selectedDriverId) || driversApi.drivers[0];

  return (
    <div className="min-h-screen flex font-sans antialiased transition-colors duration-200 selection:bg-ink/15 dark:selection:bg-white/20">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        currentUser={currentUser}
        onLogout={() => {
          logout();
          addToast('Sessão terminada', 'Até breve.', 'info');
        }}
        isOpenMobile={isOpenMobileSidebar}
        setIsOpenMobile={setIsOpenMobileSidebar}
        pendingDriversCount={pendingDriversCount}
        pendingDocsCount={pendingDocsCount}
        openJobsCount={openJobsCount}
        onOpenDriverForm={handleOpenNewDriverForm}
      />

      <div className="flex-1 lg:pl-[260px] flex flex-col min-w-0 min-h-screen tcb-surface text-ink dark:text-dark-text transition-colors">
        <Header
          activePage={activePage}
          currentUser={currentUser}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleTheme}
          onOpenMobileMenu={() => setIsOpenMobileSidebar(true)}
          onSearchGlobal={(query) => {
            setSearchQueryGlobal(query);
            if (activePage !== 'drivers' && query.length > 0) {
              setActivePage('drivers');
            }
          }}
          onOpenSettings={() => setActivePage('settings')}
          onLogout={() => {
            logout();
            addToast('Sessão terminada', 'Até breve.', 'info');
          }}
          onOpenPublicPortal={() => navigateTo('candidatura')}
        />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6 tcb-page-enter">
          {bootLoading && <LoadingState label="A carregar dados TCB…" />}
          {!bootLoading && bootError && (
            <ErrorState
              description={bootError}
              onRetry={() => {
                void driversApi.refresh();
                void jobsApi.refresh();
                void appsApi.refresh();
                void usersApi.refresh();
              }}
            />
          )}

          {!bootLoading && !bootError && (
            <>
              {activePage === 'dashboard' && (
                <DashboardView
                  drivers={driversApi.drivers}
                  jobs={jobsApi.jobs}
                  applications={appsApi.applications}
                  onNavigate={setActivePage}
                  onSelectDriver={handleSelectDriver}
                  onOpenDriverForm={handleOpenNewDriverForm}
                  onOpenJobForm={() => setIsCreatingJob(true)}
                />
              )}

              {activePage === 'drivers' && (
                <DriversListView
                  drivers={driversApi.drivers}
                  onSelectDriver={handleSelectDriver}
                  onEditDriver={handleEditDriver}
                  onOpenDriverForm={handleOpenNewDriverForm}
                  onChangeStatus={(id, st) => void handleChangeDriverStatus(id, st)}
                  onDeleteDriver={handleDeleteDriver}
                  searchQueryGlobal={searchQueryGlobal}
                />
              )}

              {activePage === 'driver-profile' && currentSelectedDriver && (
                <DriverProfileView
                  driver={currentSelectedDriver}
                  onBack={() => setActivePage('drivers')}
                  onEdit={handleEditDriver}
                  onChangeDriverStatus={handleChangeDriverStatus}
                  onValidateDocument={handleValidateDocument}
                  onPreviewDocument={(doc) => setPreviewDoc(doc)}
                />
              )}

              {activePage === 'driver-form' && (
                <DriverFormView
                  initialDriver={editingDriver}
                  onSave={(data) => void handleSaveDriver(data)}
                  onCancel={() => setActivePage('drivers')}
                />
              )}

              {activePage === 'jobs' && (
                <JobsView
                  jobs={jobsApi.jobs}
                  onOpenCreateJob={() => {
                    setEditingJob(null);
                    setIsCreatingJob(true);
                  }}
                  onEditJob={(job) => {
                    setEditingJob(job);
                    setIsCreatingJob(true);
                  }}
                  onCloseJob={handleCloseJob}
                  onSelectJob={(job) => setSelectedJob(job)}
                  onNavigateApplications={() => setActivePage('applications')}
                />
              )}

              {activePage === 'applications' && (
                <ApplicationsPipelineView
                  applications={appsApi.applications}
                  onSelectDriver={handleSelectDriver}
                  onChangeStage={handleChangeApplicationStage}
                />
              )}

              {activePage === 'documents' && (
                <DocumentsManagementView
                  drivers={driversApi.drivers}
                  onSelectDriver={handleSelectDriver}
                  onValidateDocument={handleValidateDocument}
                  onPreviewDocument={(doc) => setPreviewDoc(doc)}
                />
              )}

              {activePage === 'users' && (
                <UsersManagementView
                  users={usersApi.users}
                  onAddUser={(u) => void handleAddUser(u)}
                  onEditUser={(u) => void handleEditUser(u)}
                  onToggleUserStatus={(id) => void handleToggleUserStatus(id)}
                />
              )}

              {activePage === 'settings' && <SettingsView onShowToast={addToast} />}
            </>
          )}
        </main>
      </div>

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          applications={appsApi.applications}
          onClose={() => setSelectedJob(null)}
          onSelectDriver={handleSelectDriver}
        />
      )}

      {isCreatingJob && (
        <JobFormModal
          initialJob={editingJob}
          onSave={(data) => void handleSaveJob(data)}
          onClose={() => {
            setIsCreatingJob(false);
            setEditingJob(null);
          }}
        />
      )}

      {previewDoc && (
        <DocumentViewerModal
          document={previewDoc}
          onClose={() => setPreviewDoc(null)}
          onValidate={(docId, status) => {
            if (selectedDriverId) {
              void handleValidateDocument(selectedDriverId, docId, status);
            }
          }}
        />
      )}

      <ConfirmationModal
        isOpen={confirmModalState.isOpen}
        title={confirmModalState.title}
        message={confirmModalState.message}
        confirmLabel={confirmModalState.confirmLabel}
        confirmVariant={confirmModalState.confirmVariant}
        requiresReason={confirmModalState.requiresReason}
        onConfirm={confirmModalState.onConfirm}
        onClose={() => setConfirmModalState((prev) => ({ ...prev, isOpen: false }))}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default function App() {
  const route = useHashRoute();

  if (route === 'candidatura') {
    return <CandidateApp />;
  }

  return <RecruiterApp />;
}
