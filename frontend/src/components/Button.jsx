export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  onClick,
  className = '',
}) {
  const base = 'px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50';
  const variants = {
    primary: 'bg-brand-500 text-stone-950 shadow-sm shadow-amber-950/40 hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-md',
    secondary: 'bg-stone-800 text-stone-200 ring-1 ring-stone-700 hover:bg-stone-700 hover:text-brand-100',
    danger: 'bg-red-950/50 text-red-200 ring-1 ring-red-900/70 hover:bg-red-900/60',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}