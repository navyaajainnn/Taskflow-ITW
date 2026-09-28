export default function Input({ label, error, id, ...inputProps }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-stone-300 mb-1">
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-xl border bg-stone-800 px-3 py-2 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
          error ? 'border-red-500' : 'border-stone-700'
        }`}
        {...inputProps}
      />
      {error && <p className="mt-1 text-sm text-red-300">{error}</p>}
    </div>
  );
}