import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = true,
  interactive = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`tcb-panel rounded-lg ${padding ? 'p-5' : ''} ${
        interactive
          ? 'cursor-pointer hover:border-ink/20 dark:hover:border-white/20 transition-colors'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
