import React from 'react';
import { Badge } from './Badge';
import type { DriverStatus, DocumentStatus, JobStatus, ApplicationStage, UserStatus } from '../../types';

type AnyStatus =
  | DriverStatus
  | DocumentStatus
  | JobStatus
  | ApplicationStage
  | UserStatus
  | string;

function toneFor(status: AnyStatus) {
  switch (status) {
    case 'Aprovado':
    case 'Válido':
    case 'Ativo':
    case 'Aberta':
      return 'success' as const;
    case 'Pendente':
    case 'Em análise':
    case 'Em Análise':
    case 'Em Seleção':
    case 'Entrevista':
    case 'Teste Prático':
    case 'Candidatura':
      return 'warning' as const;
    case 'Rejeitado':
    case 'Expirado':
    case 'Inativo':
    case 'Fechada':
      return 'danger' as const;
    default:
      return 'neutral' as const;
  }
}

export const StatusBadge: React.FC<{ status: AnyStatus; className?: string }> = ({
  status,
  className,
}) => (
  <Badge tone={toneFor(status)} className={className}>
    {status}
  </Badge>
);
