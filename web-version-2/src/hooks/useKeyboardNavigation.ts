import { useEffect, useCallback } from 'react';

interface KeyboardNavigationConfig {
  onNext?: () => void;
  onPrevious?: () => void;
  onChoice?: (index: number) => void;
  onMenu?: () => void;
  onSkip?: () => void;
  choices?: any[];
  disabled?: boolean;
}

/**
 * Custom hook for keyboard navigation in the visual novel
 */
export function useKeyboardNavigation({
  onNext,
  onPrevious,
  onChoice,
  onMenu,
  onSkip,
  choices = [],
  disabled = false
}: KeyboardNavigationConfig) {
  
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (disabled) return;

    // Ignore key presses when user is typing in an input field
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (event.key) {
      case ' ':
      case 'Enter':
        event.preventDefault();
        onNext?.();
        break;
        
      case 'ArrowLeft':
      case 'Backspace':
        event.preventDefault();
        onPrevious?.();
        break;
        
      case 'Escape':
        event.preventDefault();
        onMenu?.();
        break;
        
      case 'Tab':
        event.preventDefault();
        onSkip?.();
        break;
        
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        event.preventDefault();
        const choiceIndex = parseInt(event.key) - 1;
        if (choiceIndex < choices.length && onChoice) {
          onChoice(choiceIndex);
        }
        break;
        
      default:
        // Let other keys through
        break;
    }
  }, [onNext, onPrevious, onChoice, onMenu, onSkip, choices, disabled]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return {
    // Return some helper info
    shortcuts: {
      next: 'Space/Enter',
      previous: '←/Backspace', 
      menu: 'Escape',
      skip: 'Tab',
      choices: '1-9'
    }
  };
}

export default useKeyboardNavigation;