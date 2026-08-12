import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  LayoutGrid,
  List,
  Phone,
  Mail,
  MapPin,
  Award,
  MoreVertical,
} from 'lucide-react';
import { Driver, DriverStatus, LicenseCategory, MozambiqueProvince } from '../types';

interface DriversListViewProps {
  drivers: Driver[];
  onSelectDriver: (driverId: string) => void;
  onEditDriver: (driver: Driver) => void;
  onOpenDriverForm: () => void;
  onChangeStatus: (driverId: string, newStatus: DriverStatus) => void;
  onDeleteDriver: (driverId: string, driverName: string) => void;
  searchQueryGlobal?: string;
}

export const DriversListView: React.FC<DriversListViewProps> = ({
  drivers,
  onSelectDriver,
  onEditDriver,
  onOpenDriverForm,
  onChangeStatus,
  onDeleteDriver,
  searchQueryGlobal = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(searchQueryGlobal);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'experience' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Active status action menu
  const [activeMenuDriverId, setActiveMenuDriverId] = useState<string | null>(null);

  // Filter logic
  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const matchQuery =
        searchTerm === '' ||
        driver.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.phone.includes(searchTerm) ||
        driver.biNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        selectedStatus === 'ALL' || driver.status === selectedStatus;

      const matchCategory =
        selectedCategory === 'ALL' || driver.licenseCategory === selectedCategory;

      const matchProvince =
        selectedProvince === 'ALL' || driver.province === selectedProvince;

      return matchQuery && matchStatus && matchCategory && matchProvince;
    });
  }, [drivers, searchTerm, selectedStatus, selectedCategory, selectedProvince]);

  // Sort logic
  const sortedDrivers = useMemo(() => {
    return [...filteredDrivers].sort((a, b) => {
      if (sortBy === 'name') {
        const comp = a.fullName.localeCompare(b.fullName);
        return sortOrder === 'asc' ? comp : -comp;
      }
      if (sortBy === 'experience') {
        return sortOrder === 'asc'
          ? a.experienceYears - b.experienceYears
          : b.experienceYears - a.experienceYears;
      }
      // date
      const dateA = new Date(a.applicationDate).getTime();
      const dateB = new Date(b.applicationDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [filteredDrivers, sortBy, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(sortedDrivers.length / itemsPerPage) || 1;
  const paginatedDrivers = sortedDrivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportCSV = () => {
    const headers = 'ID,Nome,Telefone,Email,BI,Categoria,Experiencia,Estado,Provincia,DataCandidatura\n';
    const rows = sortedDrivers
      .map(
        (d) =>
          `"${d.id}","${d.fullName}","${d.phone}","${d.email}","${d.biNumber}","${d.licenseCategory}",${d.experienceYears},"${d.status}","${d.province}","${d.applicationDate}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `motoristas_tcb_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: DriverStatus) => {
    switch (status) {
      case 'Aprovado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#D1FAE5] text-[#059669] uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
            <span>Aprovado</span>
          </span>
        );
      case 'Em análise':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-black uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-black shrink-0" />
            <span>Em análise</span>
          </span>
        );
      case 'Pendente':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#D97706] uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
            <span>Pendente</span>
          </span>
        );
      case 'Rejeitado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FEE2E2] text-[#DC2626] uppercase tracking-wider">
            <XCircle className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
            <span>Rejeitado</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
              BASE DE DADOS FROTISTA
            </span>
            <h2 className="text-lg font-black text-black tracking-tight mt-0.5">
              Gestão da Base de Motoristas TCB
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Exibindo {sortedDrivers.length} condutor(es) cadastrado(s) no sistema
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-black hover:text-white text-black text-xs font-bold rounded-md border border-gray-300 transition-colors uppercase tracking-wider"
              title="Exportar dados para Excel/CSV"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar CSV</span>
            </button>

            <button
              onClick={onOpenDriverForm}
              className="flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-md transition-colors uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Motorista</span>
            </button>
          </div>
        </div>

        {/* Filters Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-gray-100">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar por nome, telefone, BI ou carta..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-xs font-medium text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-xs font-bold text-black focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="ALL">Todos os Estados</option>
              <option value="Pendente">Pendentes</option>
              <option value="Em análise">Em Análise</option>
              <option value="Aprovado">Aprovados</option>
              <option value="Rejeitado">Rejeitados</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-xs font-bold text-black focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="ALL">Todas as Cartas</option>
              <option value="Carta CE (Pesados Articulados)">Carta CE (Pesados)</option>
              <option value="Carta C (Pesados)">Carta C</option>
              <option value="Carta D (Autocarros)">Carta D (Autocarros)</option>
              <option value="Carta C1">Carta C1</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md border transition-colors ${
                viewMode === 'table'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
              title="Modo Tabela"
            >
              <List className="w-4 h-4" />
            </button>

            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-md border transition-colors ${
                viewMode === 'cards'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
              title="Modo Cartões"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table / Cards Content */}
      {paginatedDrivers.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-ink-soft border border-slate-200/80 dark:border-white/[0.08] rounded-2xl p-12 text-center shadow-sm">
          <div className="w-12 h-12 bg-slate-100 dark:bg-ink-muted text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6 text-slate-900 dark:text-white" />
          </div>
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Nenhum motorista encontrado
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 max-w-sm mx-auto">
            Não foram localizados registos com os filtros selecionados. Tente
            limpar a pesquisa.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedStatus('ALL');
              setSelectedCategory('ALL');
              setSelectedProvince('ALL');
            }}
            className="mt-4 px-5 py-2.5 bg-gradient-to-r from-slate-900 to-black dark:from-white dark:to-slate-100 text-white dark:text-black hover:from-black hover:to-slate-900 text-xs font-extrabold rounded-xl uppercase tracking-wider shadow-sm transition-all"
          >
            Limpar Filtros de Pesquisa
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* Bento Desktop Table */
        <div className="bg-white dark:bg-ink-soft border border-slate-200/80 dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-ink-muted text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-white/[0.08] font-extrabold uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Foto / Nome Completo</th>
                  <th className="py-3.5 px-4">Contactos & Localidade</th>
                  <th className="py-3.5 px-4">Carta de Condução</th>
                  <th className="py-3.5 px-4">Experiência</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4">Candidatura</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80 font-medium text-slate-900 dark:text-slate-100">
                {paginatedDrivers.map((driver) => (
                  <tr
                    key={driver.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    {/* Photo + Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={driver.photo}
                          alt={driver.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-white/10 shrink-0 shadow-2xs"
                        />
                        <div className="min-w-0">
                          <button
                            onClick={() => onSelectDriver(driver.id)}
                            className="font-extrabold text-slate-900 dark:text-white hover:underline text-left block truncate"
                          >
                            {driver.fullName}
                          </button>
                          <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400">
                            BI: {driver.biNumber}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contacts & Location */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] font-extrabold text-slate-900 dark:text-white">
                          <Phone className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                          <span>{driver.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                          <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                          <span>
                            {driver.city}, {driver.province}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* License Details */}
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-slate-900 dark:text-white block text-[11px]">
                        {driver.licenseCategory}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium">
                        Nº {driver.licenseNumber}
                      </span>
                    </td>

                    {/* Experience */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-extrabold text-slate-900 dark:text-white">
                        <Award className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span>{driver.experienceYears} Anos</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">{getStatusBadge(driver.status)}</td>

                    {/* Application Date */}
                    <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                      {driver.applicationDate}
                    </td>

                    {/* Actions Menu */}
                    <td className="py-3.5 px-4 text-right relative">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectDriver(driver.id)}
                          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Ver Perfil Detalhado"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onEditDriver(driver)}
                          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Editar Dados"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Quick Status Dropdown Menu */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActiveMenuDriverId(
                                activeMenuDriverId === driver.id ? null : driver.id
                              )
                            }
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                            title="Opções de Estado"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenuDriverId === driver.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-ink-soft border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-xl z-30 py-1 text-left text-xs font-bold">
                              <p className="px-3 py-1.5 text-[9px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest">
                                MUDAR ESTADO
                              </p>
                              <button
                                onClick={() => {
                                  onChangeStatus(driver.id, 'Aprovado');
                                  setActiveMenuDriverId(null);
                                }}
                                className="w-full px-3 py-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2 uppercase text-[10px] tracking-wider"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Aprovar Motorista</span>
                              </button>

                              <button
                                onClick={() => {
                                  onChangeStatus(driver.id, 'Em análise');
                                  setActiveMenuDriverId(null);
                                }}
                                className="w-full px-3 py-1.5 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center gap-2 uppercase text-[10px] tracking-wider"
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span>Colocar em Análise</span>
                              </button>

                              <button
                                onClick={() => {
                                  onChangeStatus(driver.id, 'Rejeitado');
                                  setActiveMenuDriverId(null);
                                }}
                                className="w-full px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 uppercase text-[10px] tracking-wider"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Rejeitar Candidato</span>
                              </button>

                              <div className="border-t border-slate-100 dark:border-white/[0.08] my-1" />

                              <button
                                onClick={() => {
                                  onDeleteDriver(driver.id, driver.fullName);
                                  setActiveMenuDriverId(null);
                                }}
                                className="w-full px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 uppercase text-[10px] tracking-wider"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Eliminar Registo</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedDrivers.map((driver) => (
            <div
              key={driver.id}
              className="bg-white dark:bg-ink-soft border border-slate-200/80 dark:border-white/[0.08] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-900 dark:hover:border-white transition-all duration-200 flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  {getStatusBadge(driver.status)}
                  <span className="text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500">
                    Inscrito em {driver.applicationDate}
                  </span>
                </div>

                <div className="flex items-center gap-3.5 mt-1">
                  <img
                    src={driver.photo}
                    alt={driver.fullName}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-white/10 shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0">
                    <button
                      onClick={() => onSelectDriver(driver.id)}
                      className="text-sm font-black text-slate-900 dark:text-white hover:underline text-left block truncate"
                    >
                      {driver.fullName}
                    </button>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-0.5">
                      {driver.licenseCategory}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50/80 dark:bg-ink-muted p-3.5 rounded-xl border border-slate-100 dark:border-white/[0.08] font-medium">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 dark:text-slate-500 uppercase text-[9px] tracking-wider font-extrabold">Telefone:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {driver.phone}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 dark:text-slate-500 uppercase text-[9px] tracking-wider font-extrabold">BI:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {driver.biNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 dark:text-slate-500 uppercase text-[9px] tracking-wider font-extrabold">Experiência:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {driver.experienceYears} Anos
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 dark:text-slate-500 uppercase text-[9px] tracking-wider font-extrabold">Localização:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {driver.city}, {driver.province}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/[0.08] flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectDriver(driver.id)}
                  className="flex-1 py-2.5 bg-gradient-to-r from-slate-900 to-black dark:from-white dark:to-slate-100 text-white dark:text-black hover:from-black hover:to-slate-900 font-extrabold text-xs rounded-xl text-center uppercase tracking-wider shadow-2xs transition-all"
                >
                  Ver Perfil
                </button>
                <button
                  onClick={() => onEditDriver(driver)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-ink-muted hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white font-extrabold text-xs rounded-xl uppercase tracking-wider transition-all"
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="bg-white border border-gray-200 rounded-md px-4 py-3 flex items-center justify-between text-xs shadow-sm">
          <span className="text-gray-500 font-medium">
            Página <strong className="text-black">{currentPage}</strong> de{' '}
            <strong className="text-black">{totalPages}</strong> ({sortedDrivers.length}{' '}
            motoristas)
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-md text-xs font-bold transition-colors ${
                  currentPage === page
                    ? 'bg-black text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
