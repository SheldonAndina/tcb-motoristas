import React from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  description,
  actions,
  className = '',
}) => (
  <div
    className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 ${className}`}
  >
    <div>
      {eyebrow && (
        <span className="text-[10px] font-bold text-accent uppercase tracking-widest block">
          {eyebrow}
        </span>
      )}
      <h2 className="text-xl sm:text-2xl font-extrabold text-ink dark:text-white tracking-tight mt-0.5">
        {title}
      </h2>
      {description && (
        <p className="text-xs sm:text-sm text-ink/55 dark:text-white/50 font-medium mt-1 max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);
