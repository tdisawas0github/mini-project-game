import { useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext, type ThemeContextType } from './ThemeContextDefinition';

const themes: Record<string, ThemeContextType['theme']> = {
  dark: {
    colors: {
      primary: '#fbbf24',
      secondary: '#0ea5e9',
      accent: '#10b981',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      surface: 'rgba(30, 41, 59, 0.95)',
      text: '#f8fafc',
      textSecondary: '#94a3b8',
      border: '#475569',
      shadow: 'rgba(0, 0, 0, 0.5)'
    },
    spacing: {
      xs: '8px',
      sm: '16px',
      md: '24px',
      lg: '32px',
      xl: '48px',
      xxl: '64px'
    },
    typography: {
      fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.25rem',
        xl: '1.5rem',
        xxl: '2rem'
      }
    },
    effects: {
      blur: 'blur(12px)',
      borderRadius: '12px',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px'
    },
    transitions: {
      fast: '0.15s ease-out',
      normal: '0.3s ease-out',
      slow: '0.5s ease-out'
    },
    zIndex: {
      background: 0,
      content: 10,
      overlay: 100,
      modal: 1000,
      tooltip: 1100
    },
    breakpoints: {
      xs: 480,
      sm: 768,
      md: 1024,
      lg: 1280,
      xl: 1536
    }
  },
  light: {
    colors: {
      primary: '#d97706',
      secondary: '#2563eb',
      accent: '#059669',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      surface: 'rgba(248, 250, 252, 0.95)',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#cbd5e1',
      shadow: 'rgba(0, 0, 0, 0.1)'
    },
    spacing: {
      xs: '8px',
      sm: '16px',
      md: '24px',
      lg: '32px',
      xl: '48px',
      xxl: '64px'
    },
    typography: {
      fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.25rem',
        xl: '1.5rem',
        xxl: '2rem'
      }
    },
    effects: {
      blur: 'blur(12px)',
      borderRadius: '12px',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px'
    },
    transitions: {
      fast: '0.15s ease-out',
      normal: '0.3s ease-out',
      slow: '0.5s ease-out'
    },
    zIndex: {
      background: 0,
      content: 10,
      overlay: 100,
      modal: 1000,
      tooltip: 1100
    },
    breakpoints: {
      xs: 480,
      sm: 768,
      md: 1024,
      lg: 1280,
      xl: 1536
    }
  }
};

export { ThemeContext };

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ellidra-theme');
      if (saved && saved in themes) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  const toggleTheme = () => {
    const newTheme = themeName === 'dark' ? 'light' : 'dark';
    setThemeName(newTheme);
    localStorage.setItem('ellidra-theme', newTheme);
  };

  const theme = themes[themeName];
  const isDark = themeName === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, themeName, setThemeName, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
