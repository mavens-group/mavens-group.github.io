import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../theme/ThemeContext";

export default function ThemeSwitcher() {
  const { mode, toggleMode } = useTheme();

  return (
    <button
      onClick={toggleMode}
      title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--bg-surface-2)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
    >
      {mode === "dark" ? <Moon size={15} /> : <Sun size={15} />}
    </button>
  );
}
