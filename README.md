# TCB Motoristas — Recrutamento e Gestão de Frota

Frontend corporativo da TCB (Transportes de Moçambique) para recrutamento e gestão de motoristas.

## Stack

- React 19 + Vite + TypeScript
- Tailwind CSS 4
- Lucide icons

## Arranque local

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000`.

## Estrutura pronta para backend

- Contratos e tipos: `src/types.ts`, `src/api/types.ts`
- Cliente ativo: `src/api/client.ts` (hoje aponta para `src/api/mock/store.ts`)
- Hooks de domínio: `src/hooks/`
- Providers (tema, toast, auth): `src/context/AppProviders.tsx`

Para ligar a API real, substitua a implementação em `src/api/client.ts` mantendo a interface `TcbApi`.

## Portais

Dois portais separados por URL:

| Portal | URL | Quem usa |
|--------|-----|----------|
| Gestão / recrutadores | `#/gestao` | RH, gestores (login) |
| Candidatura pública | `#/candidatura` | Motoristas a candidatar-se |

## Contas demo (portal de gestão)

Qualquer email de utilizador mock + palavra-passe `tcb2026pass` (ex.: `ana.macamo@tcb.co.mz`).
