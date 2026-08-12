import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'light' | 'dark' | 'auto';
  markOnly?: boolean;
}

const markHeights = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-14',
  xl: 'h-[4.5rem]',
};

const titleSizes = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
};

export const TcbMark: React.FC<{ className?: string; variant?: LogoProps['variant'] }> = ({
  className = '',
  variant = 'auto',
}) => {
  // Logo é PNG com transparência. Usamos versões preta/branca para ficar 100% igual ao decalque
  // sem “invert”/filters que alteram pixels.
  if (variant === 'light') {
    return (
      <img
        src="/logo.png"
        alt="TCB"
        draggable={false}
        className={`w-auto object-contain object-left ${className}`}
      />
    );
  }

  if (variant === 'dark') {
    return (
      <img
        src="/logo-white.png"
        alt="TCB"
        draggable={false}
        className={`w-auto object-contain object-left ${className}`}
      />
    );
  }

  // auto: preto no modo claro; branco no modo escuro (Tailwind `dark` class).
  return (
    <>
      <img
        src="/logo.png"
        alt="TCB"
        draggable={false}
        className={`w-auto object-contain object-left dark:hidden ${className}`}
      />
      <img
        src="/logo-white.png"
        alt="TCB"
        draggable={false}
        className={`w-auto object-contain object-left hidden dark:block ${className}`}
      />
    </>
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
    return <TcbMark variant={variant} className={`${markHeights[size]} ${className}`} />;
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <TcbMark variant={variant} className={`${markHeights[size]} shrink-0`} />
      {showSubtitle && (
        <div className="flex flex-col min-w-0 max-sm:hidden">
          <span
            className={`font-semibold tracking-tight leading-none ${titleSizes[size]} ${markColor}`}
          >
            TCB
          </span>
          <span className={`text-[10px] font-medium tracking-wide mt-0.5 ${subtitleColor}`}>
            Transportes Carlos Bié
          </span>
        </div>
      )}
    </div>
  );
};
