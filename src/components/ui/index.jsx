import { Loader2, X } from 'lucide-react';

// ─── Loading Spinner ──────────────────────────────────────────────────────

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <Loader2 className={`animate-spin text-accent ${sizes[size]} ${className}`} />
  );
};

export const LoadingScreen = ({ message = 'Loading...' }) => (
  <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
    <Spinner size="lg" />
    <p className="text-gray-500 dark:text-gray-400 text-sm">{message}</p>
  </div>
);

// ─── Error / Empty States ─────────────────────────────────────────────────

export const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="min-h-[300px] flex flex-col items-center justify-center gap-4 text-center px-4">
    <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center">
      <span className="text-2xl">⚠️</span>
    </div>
    <p className="text-gray-600 dark:text-gray-300">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-primary text-sm px-5 py-2">
        Try Again
      </button>
    )}
  </div>
);

export const EmptyState = ({ icon: Icon, title, message, action }) => (
  <div className="min-h-[300px] flex flex-col items-center justify-center gap-4 text-center px-4">
    {Icon && (
      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
        <Icon className="w-8 h-8 text-accent" />
      </div>
    )}
    <div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
      {message && <p className="text-gray-500 dark:text-gray-400 text-sm">{message}</p>}
    </div>
    {action}
  </div>
);

// ─── Badge ────────────────────────────────────────────────────────────────

const badgeVariants = {
  default: 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300',
  accent: 'bg-accent/10 text-accent',
  primary: 'bg-primary/10 dark:bg-primary-light/30 text-primary dark:text-white',
  success: 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400',
  warning: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
  danger: 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400',
  gold: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
};

export const Badge = ({ variant = 'default', children, className = '' }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeVariants[variant]} ${className}`}
  >
    {children}
  </span>
);

// ─── Card ─────────────────────────────────────────────────────────────────

export const Card = ({ children, className = '', hover = false, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden transition-colors ${
      hover ? 'card-hover cursor-pointer' : ''
    } ${className}`}
  >
    {children}
  </div>
);

// ─── Section Header ───────────────────────────────────────────────────────

export const SectionHeader = ({
  eyebrow,
  title,
  description,
  center = true,
  light = false,
  className = '',
}) => (
  <div className={`${center ? 'text-center' : ''} ${className}`}>
    {eyebrow && (
      <p
        className={`text-xs font-semibold uppercase tracking-[0.2em] mb-3 ${
          light ? 'text-accent' : 'text-accent'
        }`}
      >
        {eyebrow}
      </p>
    )}
    <h2
      className={`font-display text-3xl md:text-4xl font-bold mb-4 ${
        light ? 'text-white' : 'text-primary dark:text-white'
      }`}
    >
      {title}
    </h2>
    {description && (
      <p
        className={`max-w-2xl text-base leading-relaxed ${
          center ? 'mx-auto' : ''
        } ${light ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}
      >
        {description}
      </p>
    )}
  </div>
);

// ─── Page Hero Banner ─────────────────────────────────────────────────────

export const PageHero = ({ title, subtitle, breadcrumb, bgImage }) => (
  <div
    className="relative pt-20 pb-24 md:pb-32 bg-primary-gradient"
    style={bgImage ? {
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    } : {}}
  >
    {bgImage && <div className="hero-overlay absolute inset-0" />}
    <div className="relative container-custom text-center">
      {breadcrumb && (
        <nav className="mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center justify-center gap-2 text-sm text-white/60">
            {breadcrumb.map((crumb, i) => (
              <li key={i} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                <span className={i === breadcrumb.length - 1 ? 'text-white' : 'hover:text-white cursor-pointer'}>
                  {crumb}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
        {title}
      </h1>
      {subtitle && (
        <p className="text-white/70 text-lg max-w-xl mx-auto">{subtitle}</p>
      )}
    </div>
  </div>
);

// ─── Pagination ───────────────────────────────────────────────────────────

export const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages } = pagination;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-accent hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Previous
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .reduce((acc, p, idx, arr) => {
            if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('...');
            acc.push(p);
            return acc;
          }, [])
          .map((item, i) =>
            item === '...' ? (
              <span key={i} className="px-2 text-gray-400">…</span>
            ) : (
              <button
                key={item}
                onClick={() => onPageChange(item)}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                  item === page
                    ? 'bg-accent text-white'
                    : 'border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-accent hover:text-accent'
                }`}
              >
                {item}
              </button>
            )
          )}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-accent hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Next
      </button>
    </div>
  );
};

// ─── Alert / Toast ────────────────────────────────────────────────────────

const alertStyles = {
  success: 'bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300',
  error: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300',
  warning: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300',
  info: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
};

export const Alert = ({ type = 'info', children, className = '' }) => (
  <div
    className={`flex items-start gap-3 p-4 rounded-xl border text-sm ${alertStyles[type]} ${className}`}
    role="alert"
  >
    {children}
  </div>
);

// ─── Input Components ─────────────────────────────────────────────────────

export const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required,
  disabled,
  className = '',
  children,
}) => (
  <div className={className}>
    {label && (
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    {children || (
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`input-base ${error ? 'border-red-300 focus:ring-red-400' : ''} ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-white/5' : ''}`}
        aria-describedby={error ? `${name}-error` : undefined}
        aria-invalid={error ? 'true' : 'false'}
      />
    )}
    {error && (
      <p id={`${name}-error`} className="mt-1.5 text-xs text-red-500">
        {error}
      </p>
    )}
  </div>
);

export const SelectField = ({
  label, name, value, onChange, error, required, disabled, children, className = '',
}) => (
  <div className={className}>
    {label && (
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`input-base ${error ? 'border-red-300' : ''} ${disabled ? 'opacity-60 bg-gray-50 dark:bg-white/5' : ''}`}
    >
      {children}
    </select>
    {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
  </div>
);

export const TextareaField = ({
  label, name, value, onChange, error, required, placeholder, rows = 4, className = '',
}) => (
  <div className={className}>
    {label && (
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows}
      className={`input-base resize-none ${error ? 'border-red-300' : ''}`}
    />
    {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
  </div>
);

// ─── Modal ────────────────────────────────────────────────────────────────

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`bg-white dark:bg-[#12101e] rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-100 dark:border-white/10`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{title}</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
