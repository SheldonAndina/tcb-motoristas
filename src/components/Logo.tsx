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

/** Official TCB mark: pickup silhouette with TCB cutout (fleet livery). */
export const TcbMark: React.FC<{ className?: string }> = ({ className = '' }) => {
  const uid = useId().replace(/:/g, '');
  const maskId = `tcbCut-${uid}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 360 130"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <mask id={maskId}>
          <rect width="360" height="130" fill="white" />
          <text
            x="102"
            y="96"
            fill="black"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize="48"
            fontWeight="700"
            letterSpacing="6"
          >
            TCB
          </text>
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <path
          d="M 30 100 L 30 75 L 50 75 L 55 70 L 80 70 L 85 75 L 100 75 L 105 70 L 130 70 L 135 75 L 155 75 L 160 70 L 180 70 L 185 75 L 220 75 L 230 60 L 265 60 L 280 75 L 310 75 L 320 85 L 320 100 Z"
          fill="currentColor"
        />
        <rect x="30" y="75" width="290" height="35" fill="currentColor" />
        <rect x="235" y="65" width="26" height="18" rx="2" fill="white" opacity="0.2" />
        <rect x="162" y="72" width="28" height="16" rx="1.5" fill="white" opacity="0.2" />
        <rect x="195" y="72" width="28" height="16" rx="1.5" fill="white" opacity="0.2" />
      </g>
      <rect x="25" y="110" width="300" height="8" rx="1" fill="currentColor" />
      <circle cx="75" cy="110" r="8" fill="currentColor" opacity="0.4" />
      <circle cx="280" cy="110" r="8" fill="currentColor" opacity="0.4" />
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
