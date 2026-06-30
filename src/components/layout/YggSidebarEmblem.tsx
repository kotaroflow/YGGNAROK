import Image from "next/image";
import styles from "./YggSidebarEmblem.module.css";

export type YggSidebarEmblemProps = {
  collapsed: boolean;
};

export const YGG_SIDEBAR_EMBLEM_LOCK = true;

// YGG_SIDEBAR_EMBLEM_LOCK=true
// Permanent YGGNAROK OS identity rule:
// Do not replace sidebar emblem with user avatars.
export function YggSidebarEmblem({ collapsed }: YggSidebarEmblemProps) {
  return (
    <div
      className={`${styles.root} ${collapsed ? styles.collapsed : ""} shrink-0`}
      data-ygg-sidebar-emblem-lock={YGG_SIDEBAR_EMBLEM_LOCK}
      aria-label="YGGNAROK operating system seal"
      role="img"
      tabIndex={0}
    >
      <div className={styles.stage}>
        <span className={styles.glow} aria-hidden="true" />
        <span className={styles.ambient} aria-hidden="true" />
        <div className={styles.coin} aria-hidden="true">
          <div className={`${styles.face} ${styles.front}`}>
            <Image
              src="/assets/ygg/ygg_coin_front_circle.png?v=3"
              alt=""
              width={72}
              height={72}
              className={styles.image}
            />
          </div>
          <div className={`${styles.face} ${styles.back}`}>
            <Image
              src="/assets/ygg/ygg_coin_back_circle.png?v=3"
              alt=""
              width={72}
              height={72}
              className={styles.image}
            />
          </div>
        </div>
        <span className={styles.lighting} aria-hidden="true" />
      </div>
    </div>
  );
}
