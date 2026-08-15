export default function AuthField({
  label,
  value,
  onChange,
  type = "text",
  required,
  minLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-xs tracking-widest text-ink-dim uppercase">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        className="rounded-lg border border-surface-2 bg-surface px-4 py-2.5 text-ink outline-none focus:border-accent-dim"
      />
    </label>
  );
}
