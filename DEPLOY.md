# TCB Motoristas — Deploy na Vercel

## ✅ Deploy concluído com sucesso!

### URLs da aplicação

- **Produção**: https://tcb-motoristas.vercel.app
- **Deploy específico**: https://tcb-motoristas-1jc0k0qaz-sheldonandinas-projects.vercel.app
- **Repositório GitHub**: https://github.com/SheldonAndina/tcb-motoristas

### Logo TCB aplicado

O logo oficial da TCB (silhueta da pickup com letras "TCB" cortadas) foi extraído das fotos da frota e aplicado em:

- ✅ `public/logo.svg` — favicon e ícone da app
- ✅ `src/components/Logo.tsx` — componente React atualizado
- ✅ Sidebar (menu lateral)
- ✅ Header (cabeçalho)
- ✅ LoginScreen (ecrã de login)
- ✅ PublicCandidatePortal (portal público)

### Portais disponíveis

| Portal | URL | Acesso |
|--------|-----|--------|
| **Portal de gestão** | `https://tcb-motoristas.vercel.app` | RH e gestores (requer login) |
| **Portal candidatura** | `https://tcb-motoristas.vercel.app` → botão "Portal candidatura" | Público (motoristas) |

### Contas demo

Qualquer email de utilizador mock + palavra-passe `tcb2026pass`:

- `ana.macamo@tcb.co.mz` (Recrutadora Sénior)
- `jorge.sitoe@tcb.co.mz` (Gestor de Operações)
- `clara.muthisse@tcb.co.mz` (Especialista Administrativo)

### Desenvolvimento local

```bash
npm install
npm run dev
# Abre em http://localhost:3000
```

### Próximos passos para mostrar ao cliente

1. Partilhe o link: **https://tcb-motoristas.vercel.app**
2. Demonstre ambos os portais:
   - Portal de gestão (login com conta demo)
   - Portal de candidatura pública (botão no canto superior direito)
3. Mostre o logo TCB aplicado em todas as páginas
4. Deploy automático: cada `git push` faz novo deploy na Vercel

---

**Desenvolvido com** React 19 · TypeScript · Tailwind CSS 4 · Vite · Vercel
