/**
 * Dialog Hooks
 * Custom hooks for dialog functionality with proper hook usage
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDialog } from './DialogContext';
import type { UseDialogText, UseDialogChoices, UseDialogNavigation } from './types';

/**
 * Hook for managing dialog text display and typing animation
 */
export function useDialogText(): UseDialogText {
  const { state, config, currentScene, dispatch, skipTyping } = useDialog();

  useEffect(() => {
    if (!currentScene?.text) return;

    const textContent = Array.isArray(currentScene.text) 
      ? currentScene.text[state.currentTextIndex] 
      : currentScene.text;

    if (!textContent) return;

    let charIndex = 0;
    dispatch({ type: 'SET_DISPLAYED_TEXT', payload: '' });
    dispatch({ type: 'SET_TYPING', payload: true });
    dispatch({ type: 'SET_TEXT_COMPLETE', payload: false });

    const typeInterval = setInterval(() => {
      if (charIndex < textContent.length) {
        dispatch({ type: 'SET_DISPLAYED_TEXT', payload: textContent.slice(0, charIndex + 1) });
        charIndex++;
      } else {
        dispatch({ type: 'SET_TYPING', payload: false });
        dispatch({ type: 'SET_TEXT_COMPLETE', payload: true });
        clearInterval(typeInterval);
      }
    }, config.typingSpeed);

    return () => clearInterval(typeInterval);
  }, [currentScene, state.currentTextIndex, config.typingSpeed, dispatch]);

  return {
    displayedText: state.displayedText,
    isTyping: state.isTyping,
    isComplete: state.isTextComplete,
    skipTyping,
  };
}

/**
 * Hook for managing dialog choices
 */
export function useDialogChoices(): UseDialogChoices {
  const { currentScene, selectChoice, canUseChoice, state } = useDialog();

  const choices = useMemo(() => {
    return currentScene?.choices || [];
  }, [currentScene]);

  return {
    choices,
    showChoices: state.showChoices && choices.length > 0,
    selectChoice,
    canUseChoice,
  };
}

/**
 * Hook for dialog navigation and scene management
 */
export function useDialogNavigation(): UseDialogNavigation {
  const { currentScene, advanceText, dispatch } = useDialog();

  const goToScene = useCallback((sceneId: string) => {
    dispatch({ type: 'SET_SCENE', payload: sceneId });
  }, [dispatch]);

  const resetDialog = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  return {
    currentScene,
    advanceText,
    goToScene,
    resetDialog,
  };
}

/**
 * Hook for keyboard navigation
 */
export function useDialogKeyboard(enabled: boolean = true) {
  const { advanceText, selectChoice, canUseChoice } = useDialog();
  const { choices, showChoices } = useDialogChoices();
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case ' ':
        case 'Enter':
          event.preventDefault();
          if (showChoices && choices.length > 0) {
            const selectedChoice = choices[selectedChoiceIndex];
            if (selectedChoice && canUseChoice(selectedChoice)) {
              selectChoice(selectedChoice);
            }
          } else {
            advanceText();
          }
          break;

        case 'ArrowUp':
          event.preventDefault();
          if (showChoices && choices.length > 0) {
            setSelectedChoiceIndex(prev => 
              prev > 0 ? prev - 1 : choices.length - 1
            );
          }
          break;

        case 'ArrowDown':
          event.preventDefault();
          if (showChoices && choices.length > 0) {
            setSelectedChoiceIndex(prev => 
              prev < choices.length - 1 ? prev + 1 : 0
            );
          }
          break;

        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9': {
          const choiceIndex = parseInt(event.key) - 1;
          if (showChoices && choices[choiceIndex] && canUseChoice(choices[choiceIndex])) {
            selectChoice(choices[choiceIndex]);
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, showChoices, choices, selectedChoiceIndex, advanceText, selectChoice, canUseChoice]);

  // Reset selected choice index when choices change
  useEffect(() => {
    setSelectedChoiceIndex(0);
  }, [choices]);

  return { selectedChoiceIndex };
}

/**
 * Hook for auto-play functionality
 */
export function useDialogAutoPlay(enabled: boolean = false) {
  const { state, config, advanceText } = useDialog();
  const [isAutoPlaying, setIsAutoPlaying] = useState(enabled);

  useEffect(() => {
    if (!isAutoPlaying || !state.isTextComplete) return;

    const autoAdvanceTimer = setTimeout(() => {
      advanceText();
    }, config.autoAdvanceDelay);

    return () => clearTimeout(autoAdvanceTimer);
  }, [isAutoPlaying, state.isTextComplete, config.autoAdvanceDelay, advanceText]);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying(prev => !prev);
  }, []);

  return {
    isAutoPlaying,
    toggleAutoPlay,
  };
}

/**
 * Hook for name input functionality
 */
export function useDialogNameInput() {
  const { state, dispatch } = useDialog();
  const [playerName, setPlayerName] = useState('');

  const showNameInput = state.showNameInput;

  const submitName = useCallback((name: string) => {
    if (!name.trim()) return false;
    
    // This would typically dispatch to the game state
    // For now, we'll just hide the input
    dispatch({ type: 'SET_SHOW_NAME_INPUT', payload: false });
    setPlayerName('');
    return true;
  }, [dispatch]);

  const hideNameInput = useCallback(() => {
    dispatch({ type: 'SET_SHOW_NAME_INPUT', payload: false });
    setPlayerName('');
  }, [dispatch]);

  return {
    showNameInput,
    playerName,
    setPlayerName,
    submitName,
    hideNameInput,
  };
}

/**
 * Hook for sound effects integration
 */
export function useDialogSounds(enabled: boolean = true) {
  const playSound = useCallback((soundId: string, volume: number = 1.0) => {
    if (!enabled) return;
    
    // This would integrate with your sound system
    // For now, we'll just log the sound that would be played
    console.log(`Playing sound: ${soundId} at volume ${volume}`);
  }, [enabled]);

  return { playSound };
}