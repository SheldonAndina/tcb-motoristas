import React, { useState } from 'react';
import { Building, Bell, Database, Save, Download } from 'lucide-react';
import { PageHeader, Card, Button, Input } from './ui';

interface SettingsViewProps {
  onShowToast: (title: string, message: string, type?: 'success' | 'info') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onShowToast }) => {
  const [companyName, setCompanyName] = useState('TCB - Transportes de Moçambique, S.A.');
  const [nuit, setNuit] = useState('100293810');
  const [address, setAddress] = useState(
    'Av. 25 de Setembro, Nº 1820, 4º Andar, Maputo, Moçambique'
  );
  const [phone, setPhone] = useState('+258 21 300 450');
  const [email, setEmail] = useState('contacto@tcb.co.mz');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [expiryAlerts, setExpiryAlerts] = useState(true);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast(
      'Definições Guardadas',
      'As configurações da empresa TCB foram atualizadas.',
      'success'
    );
  };

  const handleExportBackup = () => {
    onShowToast(
      'Backup Exportado',
      'Ficheiro de cópia de segurança do sistema gerado com sucesso.',
      'info'
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        eyebrow="Sistema"
        title="Definições"
        description="Organização, notificações e cópias de segurança"
      />

      <Card>
        <form onSubmit={handleSaveCompany} className="space-y-4">
          <h3 className="text-xs font-extrabold text-ink dark:text-white border-b border-ink/8 dark:border-white/10 pb-2 flex items-center gap-2 uppercase tracking-wider">
            <Building className="w-4 h-4 text-accent" />
            Dados oficiais da empresa
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Razão social"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <Input
              label="NUIT"
              value={nuit}
              onChange={(e) => setNuit(e.target.value)}
              className="font-mono"
            />
            <div className="md:col-span-2">
              <Input
                label="Endereço da sede"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <Input label="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input
              label="Email institucional"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="accent">
              <Save className="w-4 h-4" />
              Guardar alterações
            </Button>
          </div>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <h3 className="text-xs font-extrabold text-ink dark:text-white border-b border-ink/8 dark:border-white/10 pb-2 flex items-center gap-2 uppercase tracking-wider">
            <Bell className="w-4 h-4 text-accent" />
            Alertas e notificações
          </h3>
          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl hover:bg-paper-muted dark:hover:bg-white/5">
              <span className="font-bold text-ink/80 dark:text-white/80">
                Notificar novas candidaturas por email
              </span>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded accent-accent"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl hover:bg-paper-muted dark:hover:bg-white/5">
              <span className="font-bold text-ink/80 dark:text-white/80">
                Aviso de expiração de cartas (30 dias)
              </span>
              <input
                type="checkbox"
                checked={expiryAlerts}
                onChange={(e) => setExpiryAlerts(e.target.checked)}
                className="w-4 h-4 rounded accent-accent"
              />
            </label>
          </div>
        </Card>

        <Card className="space-y-4">
          <h3 className="text-xs font-extrabold text-ink dark:text-white border-b border-ink/8 dark:border-white/10 pb-2 flex items-center gap-2 uppercase tracking-wider">
            <Database className="w-4 h-4 text-accent" />
            Cópia de segurança
          </h3>
          <p className="text-xs text-ink/55 dark:text-white/50 font-medium leading-relaxed">
            Exporte o backup dos dados de motoristas e candidaturas TCB.
          </p>
          <Button variant="outline" className="w-full" onClick={handleExportBackup}>
            <Download className="w-4 h-4" />
            Gerar cópia de segurança
          </Button>
        </Card>
      </div>
    </div>
  );
};
