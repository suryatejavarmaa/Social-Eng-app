import React, { createContext, useContext, useState, useCallback } from 'react';

export type ThemeMode = 'night' | 'day';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (t: ThemeMode) => void;
  colors: typeof nightColors;
}

const nightColors = {
  bg: '#022B22',
  bgDeep: '#011510',
  primary: '#D4AF37',
  primaryLight: '#F9E4B7',
  primaryDark: '#B8860B',
  text: '#F9E4B7',
  textSecondary: 'rgba(249,228,183,0.7)',
  border: 'rgba(212,175,55,0.3)',
  danger: '#FF4D4D',
  success: '#4CAF50',
  cardBg: 'rgba(1,21,16,0.6)',
  cardBorder: 'rgba(212,175,55,0.2)',
  overlay: 'rgba(0,0,0,0.3)',
  inputBg: 'rgba(1,21,16,0.7)',
  navBg: 'rgba(2,43,34,0.85)',
  buttonGradient: 'linear-gradient(135deg, #D4AF37, #B8860B)',
  buttonText: '#022B22',
  glowColor: 'rgba(212,175,55,0.3)',
  inactive: 'rgba(249,228,183,0.4)',
};

const dayColors = {
  bg: '#850222',
  bgDeep: '#140005',
  primary: '#FEFFAE',
  primaryLight: '#FFFFD6',
  primaryDark: '#E0E090',
  text: '#FEFFAE',
  textSecondary: 'rgba(254,255,174,0.6)',
  border: 'rgba(254,255,174,0.25)',
  danger: '#FF4D4D',
  success: '#6B9060',
  cardBg: 'rgba(58,0,14,0.6)',
  cardBorder: 'rgba(254,255,174,0.15)',
  overlay: 'rgba(20,0,5,0.3)',
  inputBg: 'rgba(58,0,14,0.7)',
  navBg: 'rgba(133,2,34,0.85)',
  buttonGradient: 'linear-gradient(135deg, #FEFFAE, #E0E090)',
  buttonText: '#850222',
  glowColor: 'rgba(254,255,174,0.2)',
  inactive: 'rgba(254,255,174,0.4)',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Fallback colors for HMR safety
const THEME_FALLBACK: ThemeContextType = {
  theme: 'day',
  toggleTheme: () => {},
  setTheme: () => {},
  colors: dayColors,
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  // THEME_FALLBACK is returned silently when provider is absent (e.g. HMR).
  return context ?? THEME_FALLBACK;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('day');

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'night' ? 'day' : 'night'));
  }, []);

  const colors = theme === 'night' ? nightColors : dayColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}