import { useEffect, useState } from 'react';

export type AppRoute = 'gestao' | 'candidatura';

export function getRouteFromHash(): AppRoute {
  const raw = window.location.hash.replace(/^#\/?/, '').split('?')[0].toLowerCase();
  if (raw === 'candidatura' || raw === 'candidato' || raw === 'apply') {
    return 'candidatura';
  }
  return 'gestao';
}

export function navigateTo(route: AppRoute) {
  const hash = route === 'candidatura' ? '#/candidatura' : '#/gestao';
  if (window.location.hash !== hash) {
    window.location.hash = hash;
  }
}

export function useHashRoute(): AppRoute {
  const [route, setRoute] = useState<AppRoute>(() =>
    typeof window !== 'undefined' ? getRouteFromHash() : 'gestao'
  );

  useEffect(() => {
    if (!window.location.hash || window.location.hash === '#') {
      window.history.replaceState(null, '', '#/gestao');
      setRoute('gestao');
    }
    const onHash = () => setRoute(getRouteFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return route;
}
