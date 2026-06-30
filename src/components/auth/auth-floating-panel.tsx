import React from "react";

export interface AuthFloatingPanelProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AuthFloatingPanel({ title, subtitle, children }: AuthFloatingPanelProps) {
  return (
    <div className="relative z-20 flex min-h-screen w-full items-center justify-center lg:justify-end lg:pr-[7vw] p-4 sm:p-6">
      <div className="w-full max-w-[440px] rounded-3xl bg-[#0a0616]/95 p-8 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.85)] border border-purple-500/15 text-white flex flex-col justify-between backdrop-blur-md">
        <div>
          <div className="mb-6 flex items-center gap-2 text-sm font-semibold tracking-wider text-purple-200 uppercase">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-purple-400"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span>YGGNAROK</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1.5">{title}</h1>
          {subtitle && <p className="text-sm text-zinc-400 mb-6">{subtitle}</p>}
        </div>
        <div className="flex-1 my-2">
          {children}
        </div>
        <div className="border-t border-purple-500/10 pt-6 mt-6">
          <p className="text-[11px] font-mono tracking-[0.2em] text-purple-400/40 uppercase text-center select-none">
            YGGNAROK AUTH NEW V1
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthFloatingPanel;
