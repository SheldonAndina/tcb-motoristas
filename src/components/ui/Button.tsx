import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-ink text-white hover:bg-ink-muted dark:bg-white dark:text-ink dark:hover:bg-paper-muted',
  accent:
    'bg-accent text-white hover:bg-accent-hover',
  secondary:
    'bg-paper-muted text-ink hover:bg-paper dark:bg-ink-muted dark:text-white/90 dark:hover:bg-ink-soft border border-ink/8 dark:border-white/10',
  ghost:
    'bg-transparent text-ink/65 hover:bg-ink/5 hover:text-ink dark:text-white/65 dark:hover:bg-white/8 dark:hover:text-white',
  danger: 'bg-danger text-white hover:opacity-90',
  outline:
    'bg-transparent border border-ink/15 text-ink hover:bg-ink/5 dark:border-white/15 dark:text-white dark:hover:bg-white/5',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-[11px] gap-1.5',
  md: 'px-4.5 py-2.5 text-[12px] gap-2',
  lg: 'px-6 py-3 text-[12px] gap-2',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-semibold tracking-wide rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};
