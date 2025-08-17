import { useState, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    shadow: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
  };
  effects: {
    blur: string;
    borderRadius: string;
    shadow: string;
  };
}

const themes: Record<string, Theme> = {
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
      xl: '48px'
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
      xl: '48px'
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
    }
  }
};

interface ThemeContextType {
  theme: Theme;
  themeName: string;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

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
    <ThemeContext.Provider value={{ theme, themeName, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
