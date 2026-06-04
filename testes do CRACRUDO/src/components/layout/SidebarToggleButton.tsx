import styles from "./SidebarToggleButton.module.css";

export type SidebarToggleButtonProps = {
  isOpen: boolean;
  onToggle: () => void;
  themeMode?: "void" | "amber";
};

export function SidebarToggleButton({
  isOpen,
  onToggle,
  themeMode = "void",
}: SidebarToggleButtonProps) {
  return (
    <button
      type="button"
      className={styles.root}
      data-state={isOpen ? "open" : "closed"}
      data-theme-mode={themeMode}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      aria-expanded={isOpen}
      aria-label={isOpen ? "Fechar sidebar" : "Abrir sidebar"}
      title={isOpen ? "Fechar sidebar" : "Abrir sidebar"}
    >
      <span className={styles.sweep} aria-hidden="true" />
      <span className={styles.icon} aria-hidden="true">
        <span className={`${styles.line} ${styles.lineOne}`} />
        <span className={`${styles.line} ${styles.lineTwo}`} />
        <span className={`${styles.line} ${styles.lineThree}`} />
      </span>
    </button>
  );
}
