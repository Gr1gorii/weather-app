import React, { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { getTheme, setTheme } from '../utils/storage';
import type { ThemeType } from '../utils/storage';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [theme, setCurrentTheme] = useState<ThemeType>(getTheme());

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'auto') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: Record<ThemeType, ThemeType> = {
      light: 'dark',
      dark: 'auto',
      auto: 'light',
    };
    const newTheme = nextTheme[theme];
    setCurrentTheme(newTheme);
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full glass hover:bg-white/20 transition-all text-white ${className}`}
      title={`Theme: ${theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'}`}
      aria-label={`Toggle theme. Current: ${theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'}`}
    >
      {theme === 'light' && <Sun size={20} />}
      {theme === 'dark' && <Moon size={20} />}
      {theme === 'auto' && <Monitor size={20} />}
    </button>
  );
};
