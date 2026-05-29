import { createContext, useContext, useState, ReactNode } from "react";
import { useColorScheme } from "react-native";

export const colors = {
  brand: {
    navy:   "#1E3A5F",
    blue:   "#2563EB",
    light:  "#EFF6FF",
    gold:   "#F59E0B",
    danger: "#EF4444",
  }
} as const;

export type ThemeTokens = {
  bg:            string;
  surface:       string;
  border:        string;
  text:          string;
  textSecondary: string;
  muted:         string;
  subtle:        string;
};

const darkTokens: ThemeTokens = {
  bg:            "#0F1E33",
  surface:       "#162235",
  border:        "#2A3A52",
  text:          "#FFFFFF",
  textSecondary: "#7A9CC4",
  muted:         "#7A9CC4",
  subtle:        "#4A6A8A",
};

const lightTokens: ThemeTokens = {
  bg:            "#F8FAFF",
  surface:       "#FFFFFF",
  border:        "#E2EBF6",
  text:          "#1E3A5F",
  textSecondary: "#64748B",
  muted:         "#64748B",
  subtle:        "#94A3B8",
};

type ThemeMode = "dark" | "light";

type ThemeContextType = {
  mode:   ThemeMode;
  tokens: ThemeTokens;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(systemScheme ?? "dark");
  
  const tokens = mode === "dark" ? darkTokens : lightTokens;
  const toggle = () => setMode((m) => (m === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ mode, tokens, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}