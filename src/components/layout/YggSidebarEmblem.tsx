import Image from "next/image";

export type YggSidebarEmblemProps = {
  collapsed: boolean;
};

export const YGG_SIDEBAR_EMBLEM_LOCK = true;

// YGG_SIDEBAR_EMBLEM_LOCK=true
// Permanent YGGNAROK OS identity rule:
// Do not replace sidebar emblem with user avatars.
export function YggSidebarEmblem({ collapsed }: YggSidebarEmblemProps) {
  const emblemSize = collapsed ? 50 : 64;

  return (
    <div
      className="group/ygg-emblem flex shrink-0 items-center justify-center transition-all duration-[280ms] ease-out motion-reduce:transition-none"
      data-ygg-sidebar-emblem-lock={YGG_SIDEBAR_EMBLEM_LOCK}
      style={{ width: emblemSize, height: emblemSize }}
    >
      <div className="relative grid size-full place-items-center transition-all duration-[280ms] ease-out md:hover:-translate-y-0.5 md:hover:scale-[1.035] motion-reduce:transition-none">
        <span
          className={`absolute rounded-full bg-brand/20 blur-lg transition-all duration-[280ms] ease-out motion-reduce:transition-none ${
            collapsed ? "inset-1 opacity-65" : "inset-0 opacity-80"
          }`}
          aria-hidden="true"
        />
        <span
          className={`absolute rounded-full bg-amber-200/10 blur-2xl transition-opacity duration-[280ms] ease-out ${
            collapsed ? "inset-0 opacity-45" : "-inset-2 opacity-70"
          }`}
          aria-hidden="true"
        />
        <Image
          src="/assets/ygg/ygg_coin_front.png"
          alt="YGGNAROK Emblem"
          width={64}
          height={64}
          preload
          sizes={collapsed ? "50px" : "64px"}
          style={{ width: emblemSize, height: emblemSize }}
          className={`relative z-10 object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.34)] transition-all duration-[280ms] ease-out md:group-hover/ygg-emblem:drop-shadow-[0_16px_24px_rgba(245,158,11,0.22)] motion-reduce:transition-none ${
            collapsed ? "opacity-95" : "opacity-100"
          }`}
        />
      </div>
    </div>
  );
}
