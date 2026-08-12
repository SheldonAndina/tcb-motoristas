import React, { useId } from 'react';

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

/** Official TCB mark recreated from the fleet livery decal. */
export const TcbMark: React.FC<{ className?: string }> = ({ className = '' }) => {
  const uid = useId().replace(/:/g, '');
  const maskId = `tcb-${uid}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 680 200"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect width="680" height="200" fill="white" />

          {/* Rear cab window */}
          <path
            fill="black"
            d="M175 36h92c9 0 14 7 16 18l4 36c1 9-3 14-12 14H170l5-68z"
          />
          {/* Front cab window */}
          <path fill="black" d="M100 102L112 58c5-16 16-24 34-26h16v70H100z" />
          {/* Windshield wedge */}
          <path fill="black" d="M292 40c30 6 52 20 72 44l24 28H296l-4-72z" />

          {/* Body stripe cutout */}
          <path
            fill="black"
            d="M78 120h430c8 0 18-1 28-4 14-4 32-4 48 0l-6 12c-14-3-28-3-40 0H78v-8z"
          />

          {/* TCB restored in stripe */}
          <text
            x="155"
            y="152"
            fill="white"
            fontFamily="'Roboto Slab', Rockwell, Georgia, serif"
            fontSize="54"
            fontWeight="700"
            letterSpacing="10"
          >
            TCB
          </text>

          {/* Door handle pip */}
          <rect x="400" y="132" width="17" height="8" rx="1.5" fill="white" />

          {/* Front speed streaks */}
          <path
            fill="white"
            d="M440 128c22-4 48-4 72 2l-5 11c-20-4-44-4-67 1v-14z"
          />
          <path
            fill="white"
            d="M530 122c26-4 56-2 82 4l-7 11c-22-5-48-6-75 1v-16z"
          />
        </mask>
      </defs>

      {/* Chassis / ground bar */}
      <path
        fill="currentColor"
        d="M4 160l92-26h410c48 8 104 28 170 52H4v-26z"
      />

      {/* Pickup silhouette */}
      <path
        mask={`url(#${maskId})`}
        fill="currentColor"
        d="
          M16 96
          l54 2
          c8-40 32-68 64-74
          c52-12 148-14 200-4
          c22 4 40 18 54 38
          l42 52
          h130
          c38 2 66 14 74 34
          c6 14-6 24-24 26
          l52 18
          H470
          l-14-16
          H82
          L12 186
          H4
          v-30
          l90-22
          H22
          c-10 0-14-10-8-16
          l28-14
          V96
          H20
          c-4 0-6 0-4 0
          z
        "
      />
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
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <TcbMark className={`${markHeights[size]} w-auto ${markColor} shrink-0`} />
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
