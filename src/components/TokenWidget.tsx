import { useEffect, useState } from "react";
import styles from "./TokenWidget.module.css";

interface TokenData {
  used: number;
  limit: number;
  remaining: number;
}

export default function TokenWidget() {
  const [data, setData] = useState<TokenData | null>(null);

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const res = await fetch("/api/v1/quota");
        if (!res.ok) throw new Error("quota endpoint not available");
        const json = await res.json();
        setData(json);
      } catch (e) {
        // fallback to static JSON file
        try {
          const fallback = await fetch("/token_usage.json");
          const json = await fallback.json();
          setData(json);
        } catch (e2) {
          console.error("Failed to fetch token usage", e2);
        }
      }
    };
    fetchQuota();
  }, []);

  const percent = data ? (data.used / data.limit) * 100 : 0;

  return (
    <div className={styles.container} aria-label="Antigravity token quota">
      <div className={styles.gauge}>
        <svg viewBox="0 0 36 36">
          <path
            className={styles.bg}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={styles.progress}
            strokeDasharray={`${percent} 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text x="18" y="20.35" className={styles.text}>
            {data ? `${data.used.toLocaleString()} / ${data.limit.toLocaleString()} tokens` : "—"}
          </text>
        </svg>
      </div>
      {data && (
        <div className={styles.info}>Restam: {data.remaining.toLocaleString()} tokens</div>
      )}
    </div>
  );
}
