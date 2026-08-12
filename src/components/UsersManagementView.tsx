import React, { useState } from 'react';
import { Plus, ShieldCheck, Edit, CheckCircle2, XCircle, Save } from 'lucide-react';
import { User, Role } from '../types';
import {
  PageHeader,
  Card,
  Button,
  Input,
  Select,
  StatusBadge,
  ModalShell,
  EmptyState,
} from './ui';

interface UsersManagementViewProps {
  users: User[];
  onAddUser: (user: Partial<User>) => void;
  onEditUser: (user: User) => void;
  onToggleUserStatus: (userId: string) => void;
}

export const UsersManagementView: React.FC<UsersManagementViewProps> = ({
  users,
  onAddUser,
  onEditUser,
  onToggleUserStatus,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('Recrutador');

  const handleOpenAdd = () => {
    setSelectedUser(null);
    setName('');
    setEmail('');
    setRole('Recrutador');
    setShowModal(true);
  };

  const handleOpenEdit = (u: User) => {
    setSelectedUser(u);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    if (selectedUser) {
      onEditUser({ ...selectedUser, name, email, role });
    } else {
      onAddUser({ name, email, role, status: 'Ativo' });
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administração de acessos"
        title="Utilizadores do sistema"
        description="Operadores de RH, recrutadores e supervisores de frota"
        actions={
          <Button variant="accent" onClick={handleOpenAdd}>
            <Plus className="w-4 h-4" />
            Adicionar
          </Button>
        }
      />

      {users.length === 0 ? (
        <EmptyState
          title="Sem utilizadores"
          description="Adicione o primeiro operador ao sistema TCB."
          actionLabel="Adicionar utilizador"
          onAction={handleOpenAdd}
        />
      ) : (
        <Card padding={false} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-paper-muted/80 dark:bg-ink/40 text-ink/45 dark:text-white/40 border-b border-ink/8 dark:border-white/10 font-bold uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="py-3 px-4">Utilizador</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Perfil</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Último acesso</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5 dark:divide-white/5">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-paper-muted/50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover border border-ink/10 dark:border-white/10 shrink-0"
                        />
                        <span className="font-bold text-ink dark:text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-ink/60 dark:text-white/55">
                      {u.email}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-paper-muted dark:bg-white/10 text-ink dark:text-white border border-ink/10 dark:border-white/10 uppercase text-[10px] tracking-wider font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="py-3 px-4 text-ink/45 dark:text-white/40 font-mono text-[11px]">
                      {u.lastAccess}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 text-ink/55 dark:text-white/55 hover:text-ink dark:hover:text-white hover:bg-ink/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onToggleUserStatus(u.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            u.status === 'Ativo'
                              ? 'text-danger hover:bg-danger-muted/60'
                              : 'text-success hover:bg-success-muted/60'
                          }`}
                          title={u.status === 'Ativo' ? 'Desativar' : 'Ativar'}
                        >
                          {u.status === 'Ativo' ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <ModalShell
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        subtitle="Controlo de acesso"
        title={selectedUser ? 'Editar utilizador' : 'Novo utilizador'}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Ana Sofia Macamo"
            required
          />
          <Input
            label="Email corporativo"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemplo@tcb.co.mz"
            required
          />
          <Select
            label="Perfil de acesso"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            <option value="Admin">Administrador do Sistema</option>
            <option value="Recrutador">Recrutador / Operador RH</option>
            <option value="Gestor de Frota">Gestor de Frota & Logística</option>
          </Select>
          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="secondary" size="sm" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="accent" size="sm">
              <Save className="w-4 h-4" />
              Guardar
            </Button>
          </div>
        </form>
      </ModalShell>
    </div>
  );
};
