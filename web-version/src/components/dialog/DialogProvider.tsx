/**
 * Dialog Provider
 * Clean state management for the dialog system
 */

import React, { useReducer, useMemo, useCallback } from 'react';
import type { DialogState, DialogAction, DialogConfig, DialogProviderProps, DialogContextValue, DialogChoice } from './types';
import { DialogEngine } from './DialogEngine';
import { useGame } from '../../hooks/useGame';
import { DialogContext } from './DialogContext';

const defaultConfig: DialogConfig = {
  typingSpeed: 30,
  autoAdvanceDelay: 2000,
  enableAutoPlay: false,
  enableSounds: true,
  enableKeyboardNavigation: true,
  textEffects: true,
};

const initialState: DialogState = {
  currentSceneId: '',
  currentTextIndex: 0,
  isTextComplete: false,
  displayedText: '',
  isTyping: false,
  showChoices: false,
  showNameInput: false,
  error: undefined,
};

function dialogReducer(state: DialogState, action: DialogAction): DialogState {
  switch (action.type) {
    case 'SET_SCENE':
      return {
        ...state,
        currentSceneId: action.payload,
        currentTextIndex: 0,
        isTextComplete: false,
        displayedText: '',
        isTyping: false,
        showChoices: false,
        error: undefined,
      };
      
    case 'SET_TEXT_INDEX':
      return {
        ...state,
        currentTextIndex: action.payload,
        isTextComplete: false,
        displayedText: '',
        isTyping: false,
      };
      
    case 'SET_TEXT_COMPLETE':
      return {
        ...state,
        isTextComplete: action.payload,
        showChoices: action.payload,
      };
      
    case 'SET_DISPLAYED_TEXT':
      return {
        ...state,
        displayedText: action.payload,
      };
      
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload,
      };
      
    case 'SET_SHOW_CHOICES':
      return {
        ...state,
        showChoices: action.payload,
      };
      
    case 'SET_SHOW_NAME_INPUT':
      return {
        ...state,
        showNameInput: action.payload,
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
      
    case 'RESET':
      return {
        ...initialState,
        currentSceneId: state.currentSceneId,
      };
      
    default:
      return state;
  }
}

export function DialogProvider({ 
  children, 
  scenes, 
  initialSceneId, 
  config = {},
  onSceneChange,
  onComplete,
  onChoiceSelect,
  onError 
}: React.PropsWithChildren<DialogProviderProps>) {
  const { state: gameState } = useGame();
  const [dialogState, dispatch] = useReducer(dialogReducer, {
    ...initialState,
    currentSceneId: initialSceneId,
  });

  const mergedConfig = useMemo(() => ({
    ...defaultConfig,
    ...config,
  }), [config]);

  const engine = useMemo(() => {
    const dialogEngine = new DialogEngine(scenes);
    dialogEngine.setGameState(gameState);
    return dialogEngine;
  }, [scenes, gameState]);

  const currentScene = useMemo(() => {
    return engine.getScene(dialogState.currentSceneId);
  }, [engine, dialogState.currentSceneId]);

  const advanceText = useCallback(() => {
    if (!currentScene) {
      dispatch({ type: 'SET_ERROR', payload: 'No current scene found' });
      return;
    }

    // If still typing, complete the text immediately
    if (dialogState.isTyping) {
      dispatch({ type: 'SET_TYPING', payload: false });
      dispatch({ type: 'SET_TEXT_COMPLETE', payload: true });
      return;
    }

    // If text is complete but not showing choices yet
    if (dialogState.isTextComplete && !dialogState.showChoices) {
      // Process scene effects
      engine.processSceneEffects(currentScene);

      // Handle auto-advance
      if (currentScene.autoAdvance && !currentScene.choices) {
        const nextScene = engine.getScene(currentScene.autoAdvance);
        if (nextScene) {
          dispatch({ type: 'SET_SCENE', payload: currentScene.autoAdvance });
          onSceneChange?.(currentScene.autoAdvance);
        } else {
          onComplete?.();
        }
        return;
      }

      // Show choices if available
      if (currentScene.choices && currentScene.choices.length > 0) {
        dispatch({ type: 'SET_SHOW_CHOICES', payload: true });
      } else {
        onComplete?.();
      }
      return;
    }

    // If we have multiple text parts, advance to next part
    if (Array.isArray(currentScene.text) && dialogState.currentTextIndex < currentScene.text.length - 1) {
      dispatch({ type: 'SET_TEXT_INDEX', payload: dialogState.currentTextIndex + 1 });
      return;
    }

    // Default case - complete the scene
    onComplete?.();
  }, [currentScene, dialogState, engine, onSceneChange, onComplete]);

  const selectChoice = useCallback((choice: DialogChoice) => {
    if (!engine.canUseChoice(choice)) return;

    try {
      // Process choice effects
      engine.processChoiceEffects(choice);

      // Notify about choice selection
      onChoiceSelect?.(choice.id);

      // Handle special choice types
      if (choice.id === 'choose_name') {
        dispatch({ type: 'SET_SHOW_NAME_INPUT', payload: true });
        return;
      }

      // Get next scene
      const nextSceneId = engine.getNextSceneId(choice, dialogState.currentSceneId);
      
      if (nextSceneId) {
        const nextScene = engine.getScene(nextSceneId);
        if (nextScene) {
          dispatch({ type: 'SET_SCENE', payload: nextSceneId });
          onSceneChange?.(nextSceneId);
        } else {
          dispatch({ type: 'SET_ERROR', payload: `Next scene not found: ${nextSceneId}` });
          onError?.(new Error(`Next scene not found: ${nextSceneId}`));
        }
      } else {
        // No next scene specified, complete the dialog
        onComplete?.();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [engine, dialogState.currentSceneId, onChoiceSelect, onSceneChange, onComplete, onError]);

  const canUseChoice = useCallback((choice: DialogChoice) => {
    return engine.canUseChoice(choice);
  }, [engine]);

  const skipTyping = useCallback(() => {
    if (dialogState.isTyping) {
      dispatch({ type: 'SET_TYPING', payload: false });
      dispatch({ type: 'SET_TEXT_COMPLETE', payload: true });
    }
  }, [dialogState.isTyping]);

  const resetDialog = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const contextValue: DialogContextValue = useMemo(() => ({
    state: dialogState,
    config: mergedConfig,
    currentScene,
    dispatch,
    advanceText,
    selectChoice,
    canUseChoice,
    skipTyping,
    resetDialog,
  }), [
    dialogState,
    mergedConfig,
    currentScene,
    advanceText,
    selectChoice,
    canUseChoice,
    skipTyping,
    resetDialog,
  ]);

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
    </DialogContext.Provider>
  );
}