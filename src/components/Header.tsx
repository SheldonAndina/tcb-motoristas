import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
  UserCheck,
  Building,
  Sun,
  Moon,
  Truck,
  X,
} from 'lucide-react';
import { ActivePage, User } from '../types';

interface HeaderProps {
  activePage: ActivePage;
  currentUser: User;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenMobileMenu: () => void;
  onSearchGlobal: (query: string) => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  onOpenPublicPortal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  currentUser,
  darkMode,
  onToggleDarkMode,
  onOpenMobileMenu,
  onSearchGlobal,
  onOpenSettings,
  onLogout,
  onOpenPublicPortal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showMobileSearch) mobileSearchRef.current?.focus();
  }, [showMobileSearch]);

  const getPageTitle = (page: ActivePage) => {
    switch (page) {
      case 'dashboard':
        return {
          title: 'Dashboard',
          subtitle: 'Visão geral do recrutamento e gestão da frota',
        };
      case 'drivers':
        return {
          title: 'Motoristas',
          subtitle: 'Condutores cadastrados, licenças e estados',
        };
      case 'driver-profile':
        return {
          title: 'Perfil do Motorista',
          subtitle: 'Documentos, histórico e validações',
        };
      case 'driver-form':
        return {
          title: 'Cadastro de Motorista',
          subtitle: 'Dados pessoais, carta e ficheiros',
        };
      case 'jobs':
        return {
          title: 'Vagas',
          subtitle: 'Oportunidades abertas e requisitos',
        };
      case 'job-detail':
        return {
          title: 'Detalhe da Vaga',
          subtitle: 'Requisitos e candidaturas associadas',
        };
      case 'applications':
        return {
          title: 'Candidaturas',
          subtitle: 'Funil de recrutamento por fase',
        };
      case 'documents':
        return {
          title: 'Documentos',
          subtitle: 'Validação de BI, cartas e registos',
        };
      case 'users':
        return {
          title: 'Utilizadores',
          subtitle: 'Acessos e perfis do sistema',
        };
      case 'settings':
        return {
          title: 'Definições',
          subtitle: 'Preferências corporativas TCB',
        };
      default:
        return {
          title: 'TCB',
          subtitle: 'Recrutamento e Gestão de Motoristas',
        };
    }
  };

  const { title, subtitle } = getPageTitle(activePage);

  const notifications = [
    {
      id: 1,
      title: 'Nova Candidatura Recebida',
      time: 'Há 12 minutos',
      description: 'Lúcio Ernesto Cossa candidatou-se para a vaga Carta CE - Maputo.',
      type: 'info',
    },
    {
      id: 2,
      title: 'Carta Próxima de Expirar',
      time: 'Há 1 hora',
      description: 'Carta D de Celso Américo Nhantumbo expira em menos de 30 dias.',
      type: 'warning',
    },
    {
      id: 3,
      title: 'Documento Validado',
      time: 'Há 3 horas',
      description: 'BI de Jacinto Francisco Tembe foi aprovado pela equipa de RH.',
      type: 'success',
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    onSearchGlobal(val);
  };

  return (
    <>
    <header className="sticky top-0 z-30 tcb-panel border-b border-ink/8 dark:border-white/[0.08] px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3 shrink-0 backdrop-blur-md bg-white/92 dark:bg-dark-panel/92">
      {/* Mobile search overlay */}
      {showMobileSearch && (
        <div className="absolute inset-0 z-10 flex items-center gap-2 px-4 bg-white dark:bg-dark-panel md:hidden">
          <Search className="w-4 h-4 shrink-0 text-ink/35 dark:text-white/35" />
          <input
            ref={mobileSearchRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Pesquisar motorista, BI…"
            className="flex-1 py-1.5 text-sm bg-transparent text-ink dark:text-white placeholder:text-ink/35 dark:placeholder:text-white/30 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => { setShowMobileSearch(false); setSearchQuery(''); onSearchGlobal(''); }}
            className="p-1.5 rounded-lg text-ink/50 dark:text-white/50 hover:bg-ink/5 dark:hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 text-ink/60 dark:text-white/60 hover:text-ink dark:hover:text-white hover:bg-ink/5 dark:hover:bg-white/10 rounded-xl lg:hidden transition-colors shrink-0"
          title="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm sm:text-base lg:text-lg font-extrabold text-ink dark:text-white truncate tracking-tight">
              {title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide text-ink/45 dark:text-white/40 border border-ink/10 dark:border-white/10 shrink-0">
              <Building className="w-3 h-3" />
              TCB
            </span>
          </div>
          <p className="text-xs text-ink/45 dark:text-white/40 font-medium hidden sm:block truncate">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Desktop search */}
        <div className="relative hidden md:block w-44 lg:w-56">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink/35 dark:text-white/35" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Pesquisar motorista…"
            className="w-full pl-9 pr-3 py-2 text-xs bg-paper-muted/80 dark:bg-ink/50 border border-ink/10 dark:border-white/10 rounded-xl text-ink dark:text-white placeholder:text-ink/35 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all"
          />
        </div>

        {/* Mobile search toggle */}
        <button
          type="button"
          onClick={() => setShowMobileSearch(true)}
          className="p-2 text-ink/60 dark:text-white/60 hover:text-ink dark:hover:text-white hover:bg-ink/5 dark:hover:bg-white/10 rounded-xl transition-colors md:hidden"
          title="Pesquisar"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onToggleDarkMode}
          className="p-2.5 text-ink/60 dark:text-white/60 hover:text-ink dark:hover:text-white hover:bg-ink/5 dark:hover:bg-white/10 rounded-xl transition-all border border-ink/10 dark:border-white/10"
          title={darkMode ? 'Modo claro' : 'Modo escuro'}
          aria-label="Alternar tema"
        >
          {darkMode ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {onOpenPublicPortal && (
          <button
            onClick={onOpenPublicPortal}
            className="flex items-center gap-2 px-3.5 py-2 border border-ink/12 dark:border-white/12 text-ink dark:text-white text-[12px] font-semibold rounded-lg hover:bg-ink/5 dark:hover:bg-white/5 transition-colors"
            title="Abrir portal público de candidatura"
          >
            <Truck className="w-4 h-4" />
            <span className="hidden lg:inline">Portal candidatura</span>
          </button>
        )}

        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2.5 text-ink/60 dark:text-white/60 hover:text-ink dark:hover:text-white hover:bg-ink/5 dark:hover:bg-white/10 rounded-xl transition-colors border border-ink/10 dark:border-white/10"
            title="Notificações"
          >
            <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-ink-soft border border-ink/10 dark:border-white/10 rounded-2xl shadow-xl z-50 py-2">
              <div className="px-4 py-2 border-b border-ink/8 dark:border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-ink dark:text-white uppercase tracking-wider">
                  Notificações
                </span>
                <span className="text-[10px] font-bold text-accent-fg bg-accent-muted dark:bg-accent/20 dark:text-amber-200 px-2 py-0.5 rounded-lg uppercase">
                  3 novas
                </span>
              </div>

              <div className="divide-y divide-ink/5 dark:divide-white/5 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 hover:bg-paper-muted/60 dark:hover:bg-white/5 transition-colors flex gap-3 text-left"
                  >
                    <div className="mt-0.5 shrink-0">
                      {n.type === 'info' && <Clock className="w-4 h-4 text-ink dark:text-white" />}
                      {n.type === 'warning' && <AlertCircle className="w-4 h-4 text-accent" />}
                      {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-success" />}
                    </div>
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-ink dark:text-white">{n.title}</p>
                        <span className="text-[10px] text-ink/35 dark:text-white/35 font-mono">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-ink/55 dark:text-white/50 mt-0.5 leading-snug">
                        {n.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 hover:bg-ink/5 dark:hover:bg-white/10 rounded-xl transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-ink/15 dark:border-white/15"
            />
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-ink dark:text-white leading-none">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-ink/45 dark:text-white/40 font-medium mt-0.5 uppercase tracking-wider">
                {currentUser.role}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-ink/35 dark:text-white/35 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-ink-soft border border-ink/10 dark:border-white/10 rounded-2xl shadow-xl z-50 py-1 text-xs">
              <div className="px-4 py-2 border-b border-ink/8 dark:border-white/10">
                <p className="font-bold text-ink dark:text-white">{currentUser.name}</p>
                <p className="text-ink/45 dark:text-white/40 text-[11px] font-mono">
                  {currentUser.email}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onOpenSettings();
                }}
                className="w-full text-left px-4 py-2.5 text-ink/70 dark:text-white/70 hover:bg-paper-muted dark:hover:bg-white/5 flex items-center gap-2 font-medium"
              >
                <UserCheck className="w-4 h-4" />
                <span>Perfil & Definições</span>
              </button>

              <div className="border-t border-ink/8 dark:border-white/10 my-1" />

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onLogout();
                }}
                className="w-full text-left px-4 py-2.5 text-danger hover:bg-danger-muted/50 dark:hover:bg-red-950/40 font-bold uppercase tracking-wider text-[11px]"
              >
                Terminar Sessão
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
    </>
  );
};
