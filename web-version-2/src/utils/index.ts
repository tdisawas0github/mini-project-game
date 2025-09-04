// Re-export all responsive utilities for easy access
export { useBreakpoint, useMediaQuery, useResponsiveValue } from '../hooks/useBreakpoint';
export type { Breakpoint } from '../hooks/useBreakpoint';
export { 
  getResponsiveStyle, 
  getSpacingValue, 
  buildResponsiveStyle,
  type ResponsiveValue,
  type SpacingValue,
  type FlexibleLayoutProps
} from './responsive';

// Common responsive breakpoint hooks
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)');
}

export function useIsTablet() {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)');
}

export function useIsSm() {
  return useMediaQuery('(max-width: 767px)');
}

export function useIsMd() {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

export function useIsLg() {
  return useMediaQuery('(min-width: 1024px) and (max-width: 1279px)');
}

export function useIsXl() {
  return useMediaQuery('(min-width: 1280px)');
}

// Import the hook functions
import { useMediaQuery } from '../hooks/useBreakpoint';