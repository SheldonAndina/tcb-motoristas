import React from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  GitPullRequest,
  FileCheck,
  UserCog,
  Settings,
  LogOut,
  X,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';
import { ActivePage, User } from '../types';
import { Logo } from './Logo';

interface SidebarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  currentUser: User;
  onLogout: () => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  pendingDriversCount: number;
  pendingDocsCount: number;
  openJobsCount: number;
  onOpenDriverForm: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  currentUser,
  onLogout,
  isOpenMobile,
  setIsOpenMobile,
  pendingDriversCount,
  pendingDocsCount,
  openJobsCount,
  onOpenDriverForm,
}) => {
  const items = [
    { id: 'dashboard' as ActivePage, label: 'Dashboard', icon: LayoutDashboard, badge: null as string | null },
    {
      id: 'drivers' as ActivePage,
      label: 'Motoristas',
      icon: Users,
      badge: pendingDriversCount > 0 ? `${pendingDriversCount} pend.` : null,
    },
    {
      id: 'jobs' as ActivePage,
      label: 'Vagas',
      icon: Briefcase,
      badge: openJobsCount > 0 ? `${openJobsCount} abertas` : null,
    },
    { id: 'applications' as ActivePage, label: 'Candidaturas', icon: GitPullRequest, badge: null },
    {
      id: 'documents' as ActivePage,
      label: 'Documentos',
      icon: FileCheck,
      badge: pendingDocsCount > 0 ? `${pendingDocsCount} p/ validar` : null,
    },
    { id: 'users' as ActivePage, label: 'Utilizadores', icon: UserCog, badge: null },
    { id: 'settings' as ActivePage, label: 'Definições', icon: Settings, badge: null },
  ];

  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    setIsOpenMobile(false);
  };

  return (
    <>
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-ink/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-[260px] bg-gradient-to-b from-ink via-ink-soft to-ink border-r border-white/10 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-2">
          <div className="h-20 px-5 border-b border-white/10 flex items-center justify-between gap-2">
            <Logo size="sm" variant="light" showSubtitle={false} />
            <button
              onClick={() => setIsOpenMobile(false)}
              className="p-1.5 text-white/60 hover:text-white lg:hidden rounded-lg hover:bg-white/10 transition-colors shrink-0"
              title="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 py-3">
            <button
              onClick={() => {
                onOpenDriverForm();
                setIsOpenMobile(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 text-white border border-white/15 text-[12px] font-semibold rounded-lg hover:bg-white/15 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Novo motorista</span>
            </button>
          </div>

          <nav className="px-3 py-2 space-y-1">
            <p className="px-3 py-1.5 text-[10px] font-bold tracking-widest text-white/35 uppercase">
              Menu Principal
            </p>

            {items.map((item) => {
              const Icon = item.icon;
              const isActive =
                activePage === item.id ||
                (activePage === 'driver-profile' && item.id === 'drivers') ||
                (activePage === 'driver-form' && item.id === 'drivers') ||
                (activePage === 'job-detail' && item.id === 'jobs');

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 opacity-80" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-white/10 text-white/70">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover border border-white/20"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <div className="flex items-center gap-1 text-[10px] text-white/45 font-medium mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-accent" />
                  <span className="truncate">{currentUser.role}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 text-white/40 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
              title="Terminar Sessão"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <p className="mt-3 text-center text-[10px] text-white/25 font-medium tracking-wide">
            Portal de gestão · TCB
          </p>
        </div>
      </aside>
    </>
  );
};
