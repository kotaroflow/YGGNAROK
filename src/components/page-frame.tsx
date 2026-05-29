import type { ReactNode } from "react";

export function PageFrame({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 text-foreground lg:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description ? <p className="mt-2 text-sm text-muted">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </header>
      {children}
    </div>
  );
}

export function PagePanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-xl border border-line bg-surface p-6 shadow-sm backdrop-blur ${className}`}
    >
      {children}
    </section>
  );
}
