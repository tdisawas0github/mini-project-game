import { useState, useEffect } from 'react';
import { useTheme } from './useTheme';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export function useBreakpoint(): Breakpoint {
  const { theme } = useTheme();
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    if (typeof window === 'undefined') return 'md';
    return getCurrentBreakpoint(window.innerWidth, theme.breakpoints);
  });

  useEffect(() => {
    const handleResize = () => {
      const newBreakpoint = getCurrentBreakpoint(window.innerWidth, theme.breakpoints);
      setBreakpoint(newBreakpoint);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial value

    return () => window.removeEventListener('resize', handleResize);
  }, [theme.breakpoints]);

  return breakpoint;
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);

    handleChange(); // Set initial value
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

export function useResponsiveValue<T>(values: Partial<Record<Breakpoint, T>>, defaultValue: T): T {
  const breakpoint = useBreakpoint();

  // Find the most appropriate value based on current breakpoint
  const breakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  const currentIndex = breakpoints.indexOf(breakpoint);

  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpoints[i];
    if (values[bp] !== undefined) {
      return values[bp]!;
    }
  }

  return defaultValue;
}

function getCurrentBreakpoint(width: number, breakpoints: Record<Breakpoint, number>): Breakpoint {
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
}