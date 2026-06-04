export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold text-foreground">
      {label}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

export const inputClass =
  "h-11 w-full rounded-lg border border-line bg-surface-strong px-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted focus:border-brand/50 focus:ring-2 focus:ring-brand/15";

export const textareaClass =
  "min-h-28 w-full rounded-lg border border-line bg-surface-strong px-3 py-2 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted focus:border-brand/50 focus:ring-2 focus:ring-brand/15";

export const buttonClass =
  "inline-flex h-11 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-white dark:text-neutral-950 shadow-sm transition hover:bg-brand-strong focus:ring-2 focus:ring-brand/20";
