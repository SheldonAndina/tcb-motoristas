import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

const fieldClass =
  'w-full p-2.5 bg-paper-muted dark:bg-dark-elevated border border-ink/10 dark:border-white/[0.09] rounded-lg text-sm font-medium text-ink dark:text-dark-text placeholder:text-ink/35 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/35 focus:border-accent/40 transition-colors';

export const Input: React.FC<InputProps> = ({
  label,
  hint,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || props.name;
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block font-bold text-ink/60 dark:text-white/50 uppercase tracking-wider text-[10px]"
        >
          {label}
        </label>
      )}
      <input id={inputId} className={`${fieldClass} ${className}`} {...props} />
      {error ? (
        <p className="text-[11px] text-danger font-medium">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-ink/45 dark:text-white/40">{hint}</p>
      ) : null}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || props.name;
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block font-bold text-ink/60 dark:text-white/50 uppercase tracking-wider text-[10px]"
        >
          {label}
        </label>
      )}
      <textarea id={inputId} className={`${fieldClass} ${className}`} {...props} />
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  className = '',
  id,
  children,
  ...props
}) => {
  const inputId = id || props.name;
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block font-bold text-ink/60 dark:text-white/50 uppercase tracking-wider text-[10px]"
        >
          {label}
        </label>
      )}
      <select id={inputId} className={`${fieldClass} ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
};

export { fieldClass };
