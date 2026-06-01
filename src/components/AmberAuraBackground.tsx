"use client";

import { useEffect } from "react";

/**
 * Adds CSS variables that drive the interactive amber aura background.
 * The component renders nothing itself – it only updates `--mouse-x` and `--mouse-y`
 * on the root element. The actual visual effect is defined in `globals.css`.
 *
 * On devices with coarse pointers (mobile / touch), the component sets a static
 * centered position and lets CSS animate a subtle breathing effect.
 */
export default function AmberAuraBackground() {
  useEffect(() => {
  // Respect reduced‑motion preference – disable animation if the user prefers it.
  const prefersReduced = typeof window !== "undefined" && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Detect coarse pointer devices early.
    const isCoarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

    // On mobile or when reduced motion is preferred, centre the glow – the CSS @media rule provides a breathing animation.
    if (isCoarse || prefersReduced) {
      document.documentElement.style.setProperty("--mouse-x", "50%");
      document.documentElement.style.setProperty("--mouse-y", "50%");
      return;
    }

    // Track mouse position for fine‑pointer devices.
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let animationFrame: number;

    const onMouseMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    const lerp = (a: number, b: number, amount: number) => a + (b - a) * amount;

    const render = () => {
      // Smooth interpolation – tweak the factor for feel.
      current.x = lerp(current.x, target.x, 0.15);
      current.y = lerp(current.y, target.y, 0.15);
      document.documentElement.style.setProperty("--mouse-x", `${current.x}px`);
      document.documentElement.style.setProperty("--mouse-y", `${current.y}px`);
      animationFrame = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  // No visual DOM element – the effect lives in the global pseudo‑element.
  return null;
}
