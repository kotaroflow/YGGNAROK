export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700 dark:text-stone-200">
      {label}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

export const inputClass =
  "h-11 w-full rounded-lg border border-slate-200/90 bg-white/85 px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-amber-300 focus:ring-4 focus:ring-amber-200/35 dark:border-white/10 dark:bg-neutral-950/70 dark:text-stone-100 dark:focus:ring-amber-900/20";

export const textareaClass =
  "min-h-28 w-full rounded-lg border border-slate-200/90 bg-white/85 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-amber-300 focus:ring-4 focus:ring-amber-200/35 dark:border-white/10 dark:bg-neutral-950/70 dark:text-stone-100 dark:focus:ring-amber-900/20";

export const buttonClass =
  "inline-flex h-11 items-center justify-center rounded-full bg-amber-300 px-5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-200 focus:ring-4 focus:ring-amber-200/45 dark:bg-amber-300 dark:text-neutral-950 dark:focus:ring-amber-900/30";
