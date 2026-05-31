"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setIsVisible(false);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [pathname]);

  return (
    <div
      className={`transition-all duration-200 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}
    >
      {children}
    </div>
  );
}
