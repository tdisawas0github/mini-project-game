import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { buildResponsiveStyle, type FlexibleLayoutProps, ResponsiveValue, getResponsiveStyle } from '../../utils/responsive';
import type { ReactNode, CSSProperties } from 'react';

interface BaseProps extends FlexibleLayoutProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Container({ children, className, style, ...responsiveProps }: BaseProps) {
  const { theme } = useTheme();
  const breakpoint = useBreakpoint();
  
  const responsiveStyle = buildResponsiveStyle(responsiveProps, breakpoint, theme.spacing);
  
  const containerStyle: CSSProperties = {
    minHeight: '100vh',
    background: theme.colors.background,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing.md,
    boxSizing: 'border-box',
    ...responsiveStyle,
    ...style
  };

  return (
    <div className={className} style={containerStyle}>
      {children}
    </div>
  );
}

export function Surface({ children, className, style, ...responsiveProps }: BaseProps) {
  const { theme } = useTheme();
  const breakpoint = useBreakpoint();
  
  const responsiveStyle = buildResponsiveStyle(responsiveProps, breakpoint, theme.spacing);
  
  const surfaceStyle: CSSProperties = {
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.effects.borderRadius,
    boxShadow: theme.effects.shadow,
    backdropFilter: theme.effects.blur,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: '900px',
    ...responsiveStyle,
    ...style
  };

  return (
    <motion.div
      className={className}
      style={surfaceStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

interface ButtonProps extends BaseProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: ResponsiveValue<'sm' | 'md' | 'lg'>;
  disabled?: boolean;
  onClick?: () => void;
  fullWidth?: ResponsiveValue<boolean>;
}

export function Button({ 
  children, 
  className, 
  style, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  onClick,
  fullWidth = false,
  ...responsiveProps
}: ButtonProps) {
  const { theme } = useTheme();
  const breakpoint = useBreakpoint();
  
  const responsiveStyle = buildResponsiveStyle(responsiveProps, breakpoint, theme.spacing);
  const currentSize = getResponsiveStyle(size, breakpoint, 'md');
  const isFullWidth = getResponsiveStyle(fullWidth, breakpoint, false);
  
  const getBackground = () => {
    switch (variant) {
      case 'primary': return theme.colors.primary;
      case 'secondary': return theme.colors.secondary;
      case 'ghost': return 'transparent';
      default: return theme.colors.surface;
    }
  };
  
  const getColor = () => {
    switch (variant) {
      case 'primary':
      case 'secondary': return theme.colors.background;
      default: return theme.colors.text;
    }
  };
  
  const getPadding = () => {
    switch (currentSize) {
      case 'sm': return `${theme.spacing.xs} ${theme.spacing.sm}`;
      case 'lg': return `${theme.spacing.md} ${theme.spacing.lg}`;
      default: return `${theme.spacing.sm} ${theme.spacing.md}`;
    }
  };
  
  const getFontSize = () => {
    switch (currentSize) {
      case 'sm': return theme.typography.fontSize.sm;
      case 'lg': return theme.typography.fontSize.lg;
      default: return theme.typography.fontSize.md;
    }
  };

  const buttonStyle: CSSProperties = {
    background: getBackground(),
    color: getColor(),
    border: variant === 'ghost' ? 'none' : `1px solid ${theme.colors.border}`,
    borderRadius: theme.effects.borderRadius,
    padding: getPadding(),
    fontSize: getFontSize(),
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    opacity: disabled ? 0.5 : 1,
    width: isFullWidth ? '100%' : 'auto',
    ...responsiveStyle,
    ...style
  };

  return (
    <motion.button
      className={className}
      style={buttonStyle}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? {} : { y: -2, boxShadow: `0 4px 16px ${theme.colors.shadow}` }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}

interface TypographyProps extends BaseProps {
  variant?: ResponsiveValue<'h1' | 'h2' | 'h3' | 'body' | 'caption'>;
  color?: string;
  fontSize?: ResponsiveValue<string>;
  fontWeight?: ResponsiveValue<string>;
  textAlign?: ResponsiveValue<'left' | 'center' | 'right' | 'justify'>;
  lineHeight?: ResponsiveValue<string>;
}

export function Typography({ 
  children, 
  className, 
  style, 
  variant = 'body', 
  color,
  fontSize,
  fontWeight,
  textAlign,
  lineHeight,
  ...responsiveProps
}: TypographyProps) {
  const { theme } = useTheme();
  const breakpoint = useBreakpoint();
  
  const responsiveStyle = buildResponsiveStyle(responsiveProps, breakpoint, theme.spacing);
  const currentVariant = getResponsiveStyle(variant, breakpoint, 'body');
  
  const getFontSize = () => {
    if (fontSize) {
      return getResponsiveStyle(fontSize, breakpoint, theme.typography.fontSize.md);
    }
    
    switch (currentVariant) {
      case 'h1': return theme.typography.fontSize.xxl;
      case 'h2': return theme.typography.fontSize.xl;
      case 'h3': return theme.typography.fontSize.lg;
      case 'caption': return theme.typography.fontSize.sm;
      default: return theme.typography.fontSize.md;
    }
  };

  const typographyStyle: CSSProperties = {
    fontSize: getFontSize(),
    fontWeight: getResponsiveStyle(fontWeight, breakpoint, ''),
    textAlign: getResponsiveStyle(textAlign, breakpoint, 'left'),
    lineHeight: getResponsiveStyle(lineHeight, breakpoint, '1.6'),
    color: color || theme.colors.text,
    margin: 0,
    ...responsiveStyle,
    ...style
  };

  if (currentVariant === 'h1') {
    return <h1 className={className} style={typographyStyle}>{children}</h1>;
  }
  if (currentVariant === 'h2') {
    return <h2 className={className} style={typographyStyle}>{children}</h2>;
  }
  if (currentVariant === 'h3') {
    return <h3 className={className} style={typographyStyle}>{children}</h3>;
  }

  return (
    <div className={className} style={typographyStyle}>
      {children}
    </div>
  );
}

interface FlexProps extends BaseProps {
  direction?: ResponsiveValue<'row' | 'column'>;
  gap?: ResponsiveValue<string>;
  align?: ResponsiveValue<string>;
  justify?: ResponsiveValue<string>;
  wrap?: ResponsiveValue<'nowrap' | 'wrap' | 'wrap-reverse'>;
  flex?: ResponsiveValue<string>;
}

export function Flex({ 
  children, 
  className, 
  style, 
  direction = 'column', 
  gap, 
  align = 'stretch', 
  justify = 'flex-start',
  wrap = 'nowrap',
  flex,
  ...responsiveProps
}: FlexProps) {
  const { theme } = useTheme();
  const breakpoint = useBreakpoint();
  
  const responsiveStyle = buildResponsiveStyle(responsiveProps, breakpoint, theme.spacing);
  
  const flexStyle: CSSProperties = {
    display: 'flex',
    flexDirection: getResponsiveStyle(direction, breakpoint, 'column'),
    gap: getResponsiveStyle(gap, breakpoint, theme.spacing.md),
    alignItems: getResponsiveStyle(align, breakpoint, 'stretch'),
    justifyContent: getResponsiveStyle(justify, breakpoint, 'flex-start'),
    flexWrap: getResponsiveStyle(wrap, breakpoint, 'nowrap'),
    flex: getResponsiveStyle(flex, breakpoint, ''),
    ...responsiveStyle,
    ...style
  };

  return (
    <div className={className} style={flexStyle}>
      {children}
    </div>
  );
}

interface GridProps extends BaseProps {
  columns?: ResponsiveValue<number | string>;
  rows?: ResponsiveValue<number | string>;
  gap?: ResponsiveValue<string>;
  columnGap?: ResponsiveValue<string>;
  rowGap?: ResponsiveValue<string>;
  autoFlow?: ResponsiveValue<'row' | 'column' | 'row dense' | 'column dense'>;
  alignItems?: ResponsiveValue<string>;
  justifyItems?: ResponsiveValue<string>;
  alignContent?: ResponsiveValue<string>;
  justifyContent?: ResponsiveValue<string>;
}

export function Grid({ 
  children, 
  className, 
  style, 
  columns = 1, 
  rows, 
  gap, 
  columnGap, 
  rowGap,
  autoFlow = 'row',
  alignItems = 'stretch',
  justifyItems = 'stretch',
  alignContent,
  justifyContent,
  ...responsiveProps
}: GridProps) {
  const { theme } = useTheme();
  const breakpoint = useBreakpoint();
  
  const responsiveStyle = buildResponsiveStyle(responsiveProps, breakpoint, theme.spacing);
  
  const getGridTemplate = (value: ResponsiveValue<number | string>, fallback: string = 'none') => {
    const resolved = getResponsiveStyle(value, breakpoint, fallback);
    if (typeof resolved === 'number') {
      return `repeat(${resolved}, 1fr)`;
    }
    return resolved;
  };
  
  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: getGridTemplate(columns, '1fr'),
    gridTemplateRows: rows ? getGridTemplate(rows) : undefined,
    gap: getResponsiveStyle(gap, breakpoint, theme.spacing.md),
    columnGap: getResponsiveStyle(columnGap, breakpoint, ''),
    rowGap: getResponsiveStyle(rowGap, breakpoint, ''),
    gridAutoFlow: getResponsiveStyle(autoFlow, breakpoint, 'row'),
    alignItems: getResponsiveStyle(alignItems, breakpoint, 'stretch'),
    justifyItems: getResponsiveStyle(justifyItems, breakpoint, 'stretch'),
    alignContent: getResponsiveStyle(alignContent, breakpoint, ''),
    justifyContent: getResponsiveStyle(justifyContent, breakpoint, ''),
    ...responsiveStyle,
    ...style
  };

  return (
    <div className={className} style={gridStyle}>
      {children}
    </div>
  );
}
