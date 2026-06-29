import Image from "next/image";
import type { ReactNode, CSSProperties } from "react";
import type { AuthArt } from "@/lib/auth-art";
import { ThemeToggle } from "../theme-toggle";

export function AuthShell({
  art,
  children,
}: {
  art: AuthArt;
  children: ReactNode;
}) {
  const backgroundStyle = {
    "--auth-from": art.from,
    "--auth-mid": art.mid,
    "--auth-to": art.to,
    "--auth-panel": art.panel,
    "--auth-focus": art.focus,
  } as CSSProperties;

  return (
    <main
      style={backgroundStyle}
      className="relative grid min-h-screen place-items-center overflow-hidden bg-[var(--auth-panel)] px-4 py-8 text-text-primary"
    >
      <div className="pointer-events-none fixed inset-0">
        <Image
          src={art.backgroundSrc}
          alt=""
          fill
          priority
          quality={60}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px"
          className="scale-[1.02] object-cover opacity-[0.58] saturate-110"
          style={{ objectPosition: "var(--auth-focus)" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,color-mix(in_srgb,var(--auth-to)_30%,transparent)_0%,transparent_32%),linear-gradient(120deg,color-mix(in_srgb,var(--auth-from)_70%,black)_0%,color-mix(in_srgb,var(--auth-mid)_42%,transparent)_48%,color-mix(in_srgb,var(--auth-to)_46%,white)_100%)] opacity-[0.72]" />
        <div className="absolute inset-0 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-white/12 dark:bg-black/32" />
      </div>

      <div className="fixed right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      <section className="relative z-10 grid w-full max-w-7xl overflow-hidden rounded-[30px] border border-white/80 bg-white/78 p-3 shadow-[0_32px_90px_rgba(22,16,36,0.28)] backdrop-blur-md dark:border-white/10 dark:bg-neutral-950/74 lg:min-h-[560px] lg:grid-cols-[0.76fr_1.34fr]">
        <div className="flex items-center px-6 py-10 sm:px-10 lg:px-12 xl:px-14">
          {children}
        </div>

        <aside className="relative hidden min-h-[536px] lg:block">
          <div className="relative h-full overflow-hidden rounded-[24px] bg-[var(--auth-panel)] shadow-[inset_0_0_90px_rgba(0,0,0,0.30)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_42%,transparent_0%,transparent_45%,rgba(0,0,0,0.28)_100%)]" />
            <Image
              src={art.src}
              alt="Arte visual YGGNAROK"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 0vw"
              className="object-cover object-[var(--auth-focus)]"
              style={{ objectPosition: "var(--auth-focus)" }}
            />
            <div className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/20" />
          </div>
        </aside>
      </section>
    </main>
  );
}
