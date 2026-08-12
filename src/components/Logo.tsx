import React, { useId } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'light' | 'dark' | 'auto';
  markOnly?: boolean;
}

const markHeights = {
  sm: 'h-7',
  md: 'h-9',
  lg: 'h-12',
  xl: 'h-16',
};

const titleSizes = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
};

/** Official TCB mark: pickup silhouette facing left with speed streaks,
 *  window cutouts, and "TCB" knocked out of the solid lower body.
 *  Matches the fleet livery decal exactly. */
export const TcbMark: React.FC<{ className?: string }> = ({ className = '' }) => {
  const uid = useId().replace(/:/g, '');
  const maskId = `tcbCut-${uid}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 460 120"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <mask id={maskId}>
          <rect width="460" height="120" fill="white" />
          {/* Janelas recortadas */}
          <rect x="152" y="24" width="38" height="22" rx="3" fill="black" />
          <rect x="196" y="24" width="38" height="22" rx="3" fill="black" />
          <rect x="240" y="24" width="38" height="22" rx="3" fill="black" />
          <path d="M 126 46 L 140 24 L 148 24 L 148 46 Z" fill="black" />
          {/* Letras TCB */}
          <text
            x="155"
            y="86"
            fill="black"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize="34"
            fontWeight="700"
            letterSpacing="10"
          >
            TCB
          </text>
          {/* Ponto decorativo */}
          <circle cx="147" cy="78" r="4" fill="black" />
        </mask>
      </defs>

      {/* Linhas de velocidade */}
      <line x1="8" y1="56" x2="68" y2="56" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="22" y1="63" x2="68" y2="63" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="36" y1="70" x2="68" y2="70" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />

      {/* Silhueta da pickup */}
      <path
        mask={`url(#${maskId})`}
        fill="currentColor"
        d="
          M 72 92
          L 72 62
          C 76 52, 88 42, 100 36
          L 120 28 L 130 22 L 140 19 L 148 18 L 286 18
          C 290 18, 294 20, 296 22
          L 308 34 L 316 48 L 320 56 L 324 56 L 332 56 L 336 60 L 336 72 L 340 76
          C 360 82, 400 90, 440 96 L 440 98 L 336 98 L 330 98 L 72 98
          Z
        "
      />

      {/* Linha de base */}
      <line x1="70" y1="102" x2="442" y2="102" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  variant = 'auto',
  markOnly = false,
}) => {
  const textLight = variant === 'light';
  const textDark = variant === 'dark';

  const markColor = textLight
    ? 'text-white'
    : textDark
      ? 'text-ink'
      : 'text-ink dark:text-white';

  const subtitleColor = textLight
    ? 'text-white/55'
    : textDark
      ? 'text-ink/50'
      : 'text-ink/50 dark:text-white/50';

  if (markOnly) {
    return <TcbMark className={`${markHeights[size]} w-auto ${markColor} ${className}`} />;
  }

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <TcbMark className={`${markHeights[size]} w-auto ${markColor} shrink-0`} />
      {showSubtitle && (
        <div className="flex flex-col min-w-0 max-sm:hidden">
          <span
            className={`font-semibold tracking-tight leading-none ${titleSizes[size]} ${markColor}`}
          >
            TCB
          </span>
          <span className={`text-[10px] font-medium tracking-wide mt-0.5 ${subtitleColor}`}>
            Transportes de Moçambique
          </span>
        </div>
      )}
    </div>
  );
};
