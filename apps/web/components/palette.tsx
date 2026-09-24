"use client";

import { useEffect, useSyncExternalStore } from "react";

// Development-only palette preview. The chosen palette is kept in this browser and applied to
// every page, so candidate palettes can be compared on real screens. Production always uses the
// default tokens in globals.css.

export const PALETTES = [
  { id: "graphite", name: "Graphite", note: "Near-black, off-white actions (default)" },
  { id: "gunmetal", name: "Gunmetal", note: "Cold steel blue-grey" },
  { id: "olive", name: "Olive", note: "Muted army green" },
  { id: "ember", name: "Ember", note: "Dark with a burnt-copper accent" },
  { id: "lime", name: "Lime", note: "The previous neon green, for comparison" },
] as const;

export type PaletteId = (typeof PALETTES)[number]["id"];

const STORAGE_KEY = "forgefit-palette";
const EVENT = "forgefit-palette-change";

function readPalette(): PaletteId {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return PALETTES.some((p) => p.id === stored) ? (stored as PaletteId) : "graphite";
  } catch {
    return "graphite";
  }
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function usePalette() {
  const palette = useSyncExternalStore(subscribe, readPalette, () => "graphite" as PaletteId);
  const setPalette = (next: PaletteId) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode); the preview then only lasts for this page.
    }
    document.documentElement.dataset.palette = next;
    window.dispatchEvent(new Event(EVENT));
  };
  return [palette, setPalette] as const;
}

/** Applies the previewed palette to the page. Rendered in the root layout in development only. */
export function PaletteBridge() {
  const [palette] = usePalette();
  useEffect(() => {
    if (palette === "graphite") delete document.documentElement.dataset.palette;
    else document.documentElement.dataset.palette = palette;
  }, [palette]);
  return null;
}
