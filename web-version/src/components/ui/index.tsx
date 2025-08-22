import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import type { ReactNode, CSSProperties } from 'react';

interface BaseProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Full-viewport themed container that centers content vertically and horizontally.
 *
 * Renders a div that fills the viewport height and applies theme-driven background, text color,
 * font family, layout (column flex, centered), and padding. Any passed `style` overrides are merged
 * on top of the theme-derived styles; `className` and `children` are forwarded to the root element.
 *
 * @returns The themed container element.
 */
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

/**
 * A themed, animated surface container (card) with responsive width constraints.
 *
 * Renders a motion-enabled div styled from the current theme (surface background, border, border radius,
 * shadow, blur, and padding). Constrains width to 100% with a max of 900px and merges any provided
 * inline style overrides.
 *
 * The element mounts with a short entrance animation (fade in and slight upward motion; 0.3s).
 *
 * @param style - Optional inline style merged into the computed theme styles (overrides take precedence).
 * @returns A React element containing the provided children wrapped in a themed, animated surface.
 */
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

/**
 * Themed, animated button primitive with variants, sizes, and disabled state.
 *
 * Renders a Framer Motion-powered <button> styled from the current theme. Supports
 * three visual variants (`primary`, `secondary`, `ghost`), three sizes (`sm`, `md`, `lg`),
 * and disables interaction/animations when `disabled` is true. Merges any provided
 * `style` overrides and forwards `onClick`.
 *
 * @param variant - Visual style of the button (`primary` | `secondary` | `ghost`). Defaults to `primary`.
 * @param size - Button size affecting padding and font size (`sm` | `md` | `lg`). Defaults to `md`.
 * @param disabled - When true, disables pointer interaction and disables motion variants. Defaults to `false`.
 * @param onClick - Click handler invoked when the button is activated (ignored when `disabled`).
 * @returns A themed, animated React button element.
 */
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

/**
 * Renders themed text with semantic heading elements for h1–h3 variants and a div for other variants.
 *
 * Uses theme typography sizes and theme text color by default; `color` overrides the text color.
 *
 * @param variant - One of `'h1' | 'h2' | 'h3' | 'body' | 'caption'`. Chooses font size and, for h1–h3, the corresponding semantic heading element.
 * @param color - Optional CSS color to override the theme's text color.
 */
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

/**
 * A themed flex container that lays out children using CSS flexbox.
 *
 * Renders a div with display:flex and applies direction, alignment, justification, and gap.
 * Merges any provided `style` overrides into the final style.
 *
 * @param direction - Flex direction; defaults to `'column'`.
 * @param gap - Spacing between children. If omitted, falls back to `theme.spacing.md`.
 * @param align - Maps to `align-items`; defaults to `'stretch'`.
 * @param justify - Maps to `justify-content`; defaults to `'flex-start'`.
 */
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
