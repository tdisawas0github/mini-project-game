import type { CSSProperties } from 'react';
import type { Breakpoint } from '../hooks/useBreakpoint';

export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;
export type SpacingValue = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;

export function getResponsiveStyle<T>(
  value: ResponsiveValue<T>,
  breakpoint: Breakpoint,
  fallback: T
): T {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const breakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    const currentIndex = breakpoints.indexOf(breakpoint);
    
    for (let i = currentIndex; i >= 0; i--) {
      const bp = breakpoints[i];
      if ((value as Record<Breakpoint, T>)[bp] !== undefined) {
        return (value as Record<Breakpoint, T>)[bp];
      }
    }
    
    return fallback;
  }
  
  return value as T;
}

export function getSpacingValue(
  value: SpacingValue,
  themeSpacing: Record<string, string>
): string {
  if (typeof value === 'string' && themeSpacing[value]) {
    return themeSpacing[value];
  }
  return value;
}

export interface FlexibleLayoutProps {
  padding?: ResponsiveValue<SpacingValue>;
  paddingX?: ResponsiveValue<SpacingValue>;
  paddingY?: ResponsiveValue<SpacingValue>;
  margin?: ResponsiveValue<SpacingValue>;
  marginX?: ResponsiveValue<SpacingValue>;
  marginY?: ResponsiveValue<SpacingValue>;
  width?: ResponsiveValue<string>;
  maxWidth?: ResponsiveValue<string>;
  minWidth?: ResponsiveValue<string>;
  height?: ResponsiveValue<string>;
  maxHeight?: ResponsiveValue<string>;
  minHeight?: ResponsiveValue<string>;
  display?: ResponsiveValue<'block' | 'flex' | 'grid' | 'none' | 'inline-block'>;
}

export function buildResponsiveStyle(
  props: FlexibleLayoutProps,
  breakpoint: Breakpoint,
  themeSpacing: Record<string, string>
): CSSProperties {
  const style: CSSProperties = {};

  // Padding
  if (props.padding !== undefined) {
    const paddingValue = getResponsiveStyle(props.padding, breakpoint, '0');
    style.padding = getSpacingValue(paddingValue, themeSpacing);
  }
  if (props.paddingX !== undefined) {
    const paddingXValue = getResponsiveStyle(props.paddingX, breakpoint, '0');
    const spacing = getSpacingValue(paddingXValue, themeSpacing);
    style.paddingLeft = spacing;
    style.paddingRight = spacing;
  }
  if (props.paddingY !== undefined) {
    const paddingYValue = getResponsiveStyle(props.paddingY, breakpoint, '0');
    const spacing = getSpacingValue(paddingYValue, themeSpacing);
    style.paddingTop = spacing;
    style.paddingBottom = spacing;
  }

  // Margin
  if (props.margin !== undefined) {
    const marginValue = getResponsiveStyle(props.margin, breakpoint, '0');
    style.margin = getSpacingValue(marginValue, themeSpacing);
  }
  if (props.marginX !== undefined) {
    const marginXValue = getResponsiveStyle(props.marginX, breakpoint, '0');
    const spacing = getSpacingValue(marginXValue, themeSpacing);
    style.marginLeft = spacing;
    style.marginRight = spacing;
  }
  if (props.marginY !== undefined) {
    const marginYValue = getResponsiveStyle(props.marginY, breakpoint, '0');
    const spacing = getSpacingValue(marginYValue, themeSpacing);
    style.marginTop = spacing;
    style.marginBottom = spacing;
  }

  // Dimensions
  if (props.width !== undefined) {
    style.width = getResponsiveStyle(props.width, breakpoint, 'auto');
  }
  if (props.maxWidth !== undefined) {
    style.maxWidth = getResponsiveStyle(props.maxWidth, breakpoint, 'none');
  }
  if (props.minWidth !== undefined) {
    style.minWidth = getResponsiveStyle(props.minWidth, breakpoint, '0');
  }
  if (props.height !== undefined) {
    style.height = getResponsiveStyle(props.height, breakpoint, 'auto');
  }
  if (props.maxHeight !== undefined) {
    style.maxHeight = getResponsiveStyle(props.maxHeight, breakpoint, 'none');
  }
  if (props.minHeight !== undefined) {
    style.minHeight = getResponsiveStyle(props.minHeight, breakpoint, '0');
  }

  // Display
  if (props.display !== undefined) {
    style.display = getResponsiveStyle(props.display, breakpoint, 'block');
  }

  return style;
}