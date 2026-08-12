import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Truck,
  Send,
} from 'lucide-react';
import { Logo } from './Logo';
import { User } from '../types';
import { Button, Input } from './ui';
import { api } from '../api/client';

interface LoginScreenProps {
  users: User[];
  onLoginSuccess: (user: User) => void;
  onOpenPublicPortal?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  users,
  onLoginSuccess,
  onOpenPublicPortal,
}) => {
  const [email, setEmail] = useState('ana.macamo@tcb.co.mz');
  const [password, setPassword] = useState('tcb2026pass');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Por favor preencha todos os campos obrigatórios.');
      return;
    }

    setIsLoading(true);
    try {
      const foundUser = await api.login(email, password);
      if (!foundUser) {
        const inactive = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (inactive?.status === 'Inativo') {
          setErrorMsg('Esta conta encontra-se inativa. Contacte o administrador da TCB.');
        } else {
          setErrorMsg('Credenciais inválidas.');
        }
        return;
      }
      if (foundUser.status === 'Inativo') {
        setErrorMsg('Esta conta encontra-se inativa. Contacte o administrador da TCB.');
        return;
      }
      onLoginSuccess(foundUser);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSelect = (u: User) => {
    setEmail(u.email);
    setPassword('tcb2026pass');
    setErrorMsg('');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setShowForgotModal(false);
      setForgotEmail('');
    }, 2000);
  };

  return (
    <div className="min-h-screen tcb-surface flex flex-col lg:flex-row font-sans antialiased text-ink dark:text-white">
      {/* Brand hero */}
      <section className="relative lg:w-[52%] min-h-[32vh] sm:min-h-[38vh] lg:min-h-screen overflow-hidden bg-ink text-white flex flex-col justify-between p-6 sm:p-10 lg:p-12">
        <div className="absolute inset-0 tcb-hero-image scale-[1.02]" />
        <div className="absolute inset-0 tcb-hero-scrim" />
        <div className="absolute inset-x-0 top-0 h-1 bg-accent" />

        <div className="relative z-10">
          <Logo size="md" variant="light" />
        </div>

        <div className="relative z-10 max-w-xl space-y-3 py-6 lg:py-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/55 hidden sm:block">
            Maputo · Beira · Nampula
          </p>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            Recrutamento de motoristas e controlo operacional
          </h1>
          <p className="text-sm sm:text-base text-white/70 font-medium leading-relaxed hidden sm:block">
            Uma área de trabalho clara para gerir candidaturas, documentos e equipas de condução.
          </p>
          {onOpenPublicPortal && (
            <button
              onClick={onOpenPublicPortal}
              className="inline-flex items-center gap-2 mt-1 text-sm font-semibold text-white/75 hover:text-white transition-colors"
            >
              <Truck className="w-4 h-4" />
              Ir para o portal de candidatura
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="relative z-10 text-[10px] font-bold uppercase tracking-widest text-white/40 hidden lg:block">
          TCB · Transportes Carlos Bié
        </p>
      </section>

      {/* Auth panel */}
      <section className="flex-1 flex flex-col justify-center items-center p-5 sm:p-8 lg:p-10">
        <div className="w-full max-w-md tcb-panel rounded-2xl p-6 sm:p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-[10px] font-bold text-accent uppercase tracking-[0.18em]">
              Portal de gestão
            </p>
            <h2 className="text-2xl font-semibold text-ink dark:text-white tracking-tight mt-1">
              Entrar
            </h2>
            <p className="text-xs text-ink/50 dark:text-white/45 mt-1">
              Área reservada a recrutadores e gestores TCB.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-[2.15rem] text-ink/35 dark:text-white/35" />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                placeholder="nome@tcb.co.mz"
                autoComplete="username"
              />
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-[2.15rem] text-ink/35 dark:text-white/35" />
              <Input
                label="Palavra-passe"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-10"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[2.05rem] text-ink/40 dark:text-white/40 hover:text-ink dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <label className="flex items-center gap-2 font-medium text-ink/60 dark:text-white/55 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-accent" />
                Lembrar sessão
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="font-bold text-accent hover:text-accent-hover"
              >
                Esqueceu a palavra-passe?
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-danger-muted/70 dark:bg-red-500/10 border border-red-200 dark:border-red-500/25 text-xs text-red-800 dark:text-red-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {errorMsg}
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full" loading={isLoading}>
              {isLoading ? 'A autenticar…' : 'Entrar'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-ink/8 dark:border-white/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40 dark:text-white/35 mb-3">
              Contas demo
            </p>
            <div className="grid gap-2">
              {users.slice(0, 3).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleDemoSelect(u)}
                  className="flex items-center gap-3 p-2.5 rounded-lg border border-ink/8 dark:border-white/10 hover:border-accent/40 hover:bg-accent-muted/50 dark:hover:bg-accent/10 transition-all text-left"
                >
                  <img
                    src={u.avatar}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border border-ink/10"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-ink dark:text-white truncate">{u.name}</p>
                    <p className="text-[10px] text-ink/45 dark:text-white/40 truncate">
                      {u.role} · {u.email}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {showForgotModal && (
        <div className="fixed inset-0 bg-ink/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-ink-soft rounded-2xl max-w-md w-full p-6 border border-ink/10 dark:border-white/10 shadow-xl space-y-4">
            {forgotSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-success mx-auto" />
                <p className="text-sm font-bold text-ink dark:text-white">
                  Instruções enviadas
                </p>
                <p className="text-xs text-ink/50 dark:text-white/45">
                  Verifique a sua caixa de email corporativo.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-accent uppercase tracking-widest">
                    Recuperação
                  </p>
                  <h3 className="text-base font-extrabold text-ink dark:text-white">
                    Repor palavra-passe
                  </h3>
                </div>
                <Input
                  label="Email corporativo"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setShowForgotModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="accent" size="sm">
                    <Send className="w-3.5 h-3.5" />
                    Enviar
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
