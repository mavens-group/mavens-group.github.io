import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

const MODE_KEY = "vlab-theme-mode";

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(
    () => localStorage.getItem(MODE_KEY) || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem(MODE_KEY, mode);
  }, [mode]);

  const toggleMode = () => setMode((m) => (m === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside a <ThemeProvider>");
  return ctx;
}
