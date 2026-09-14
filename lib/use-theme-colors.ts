"use client";

import { useEffect, useState } from "react";

export type ThemeColors = {
  text: string;
  background: string;
  primary: string;
  secondary: string;
  accent: string;
  dark: boolean;
};

const read = (): ThemeColors => {
  const s = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => s.getPropertyValue(name).trim() || fallback;
  return {
    text: v("--text", "#16110d"),
    background: v("--background", "#faf6f1"),
    primary: v("--primary", "#c8683a"),
    secondary: v("--secondary", "#ecc9a6"),
    accent: v("--accent", "#2b7a6b"),
    dark: document.documentElement.classList.contains("dark"),
  };
};

/** Reads the Realtime Colors CSS variables and re-reads them when the theme toggles. */
export function useThemeColors() {
  const [colors, setColors] = useState<ThemeColors>(read);
  useEffect(() => {
    const obs = new MutationObserver(() => setColors(read()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
    return () => obs.disconnect();
  }, []);
  return colors;
}
