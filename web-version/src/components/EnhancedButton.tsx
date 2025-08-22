import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import type { ReactNode, ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';
import { playSound } from '../utils/audioManager';

interface EnhancedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  soundEffect?: string;
  glowEffect?: boolean;
  children: ReactNode;
}

const StyledButton = styled(motion.button)<{
  $variant: string;
  $size: string;
  $glowEffect: boolean;
}>`
  position: relative;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Georgia', serif;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  outline: none;
  
  /* Size variants */
  ${props => {
    switch (props.$size) {
      case 'small':
        return `
          padding: 8px 16px;
          font-size: 0.875rem;
        `;
      case 'large':
        return `
          padding: 16px 32px;
          font-size: 1.125rem;
        `;
      default:
        return `
          padding: 12px 24px;
          font-size: 1rem;
        `;
    }
  }}

  /* Color variants */
  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #d97706 0%, #ea580c 100%);
          color: #fff;
          box-shadow: 0 4px 16px rgba(217, 119, 6, 0.3);
          
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%);
            box-shadow: 0 6px 24px rgba(217, 119, 6, 0.4);
            transform: translateY(-2px);
          }
        `;
      case 'secondary':
        return `
          background: rgba(51, 65, 85, 0.8);
          color: #e2e8f0;
          border: 2px solid #64748b;
          
          &:hover:not(:disabled) {
            background: rgba(71, 85, 105, 0.9);
            border-color: #94a3b8;
            transform: translateY(-2px);
          }
        `;
      case 'danger':
        return `
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: #fff;
          box-shadow: 0 4px 16px rgba(220, 38, 38, 0.3);
          
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
            box-shadow: 0 6px 24px rgba(220, 38, 38, 0.4);
            transform: translateY(-2px);
          }
        `;
      default: // ghost
        return `
          background: transparent;
          color: #e2e8f0;
          border: 2px solid transparent;
          
          &:hover:not(:disabled) {
            border-color: #64748b;
            background: rgba(51, 65, 85, 0.3);
          }
        `;
    }
  }}

  /* Glow effect */
  ${props => props.$glowEffect && `
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, #fbbf24, #f59e0b, #d97706, #ea580c);
      border-radius: inherit;
      z-index: -1;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    &:hover:not(:disabled)::before {
      opacity: 0.6;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
  `}

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  &:focus-visible {
    outline: 2px solid #fbbf24;
    outline-offset: 2px;
  }
`;

const ButtonContent = styled.span`
  position: relative;
  z-index: 1;
`;

export const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    variant = 'secondary', 
    size = 'medium', 
    soundEffect = 'click',
    glowEffect = false,
    children,
    onClick,
    onMouseEnter,
    ...props 
  }, ref) => {
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!props.disabled) {
        playSound(soundEffect);
        onClick?.(event);
      }
    };

    const handleMouseEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!props.disabled) {
        playSound('hover', 0.3);
        onMouseEnter?.(event);
      }
    };

    return (
      <StyledButton
        ref={ref}
        $variant={variant}
        $size={size}
        $glowEffect={glowEffect}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        whileHover={{ scale: props.disabled ? 1 : 1.05 }}
        whileTap={{ scale: props.disabled ? 1 : 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          opacity: { duration: 0.3 },
          y: { duration: 0.3 },
          scale: { duration: 0.1 }
        }}
        // Filter out non-HTML button props
        {...Object.fromEntries(
          Object.entries(props).filter(([key]) => 
            !['variant', 'size', 'soundEffect', 'glowEffect'].includes(key)
          )
        )}
      >
        <ButtonContent>{children}</ButtonContent>
      </StyledButton>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';

export default EnhancedButton;