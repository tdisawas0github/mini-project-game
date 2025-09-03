import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import type { ReactNode, CSSProperties } from 'react';

interface BaseProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Container({ children, className, style }: BaseProps) {
  const { theme } = useTheme();
  
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
    ...style
  };

  return (
    <div className={className} style={containerStyle}>
      {children}
    </div>
  );
}

export function Surface({ children, className, style }: BaseProps) {
  const { theme } = useTheme();
  
  const surfaceStyle: CSSProperties = {
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.effects.borderRadius,
    boxShadow: theme.effects.shadow,
    backdropFilter: theme.effects.blur,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: '900px',
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
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({ 
  children, 
  className, 
  style, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  onClick
}: ButtonProps) {
  const { theme } = useTheme();
  
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
    switch (size) {
      case 'sm': return `${theme.spacing.xs} ${theme.spacing.sm}`;
      case 'lg': return `${theme.spacing.md} ${theme.spacing.lg}`;
      default: return `${theme.spacing.sm} ${theme.spacing.md}`;
    }
  };
  
  const getFontSize = () => {
    switch (size) {
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
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  color?: string;
}

export function Typography({ 
  children, 
  className, 
  style, 
  variant = 'body', 
  color 
}: TypographyProps) {
  const { theme } = useTheme();
  
  const getFontSize = () => {
    switch (variant) {
      case 'h1': return theme.typography.fontSize.xxl;
      case 'h2': return theme.typography.fontSize.xl;
      case 'h3': return theme.typography.fontSize.lg;
      case 'caption': return theme.typography.fontSize.sm;
      default: return theme.typography.fontSize.md;
    }
  };

  const typographyStyle: CSSProperties = {
    fontSize: getFontSize(),
    color: color || theme.colors.text,
    margin: 0,
    lineHeight: 1.6,
    ...style
  };

  if (variant === 'h1') {
    return <h1 className={className} style={typographyStyle}>{children}</h1>;
  }
  if (variant === 'h2') {
    return <h2 className={className} style={typographyStyle}>{children}</h2>;
  }
  if (variant === 'h3') {
    return <h3 className={className} style={typographyStyle}>{children}</h3>;
  }

  return (
    <div className={className} style={typographyStyle}>
      {children}
    </div>
  );
}

interface FlexProps extends BaseProps {
  direction?: 'row' | 'column';
  gap?: string;
  align?: string;
  justify?: string;
}

export function Flex({ 
  children, 
  className, 
  style, 
  direction = 'column', 
  gap, 
  align = 'stretch', 
  justify = 'flex-start' 
}: FlexProps) {
  const { theme } = useTheme();
  
  const flexStyle: CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    gap: gap || theme.spacing.md,
    alignItems: align,
    justifyContent: justify,
    ...style
  };

  return (
    <div className={className} style={flexStyle}>
      {children}
    </div>
  );
}
