import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * Accesses the current ThemeContext value.
 *
 * Returns the theme context object provided by a surrounding ThemeProvider.
 *
 * @returns The current theme context value.
 * @throws Error if called outside of a ThemeProvider (i.e., ThemeContext is not available).
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}