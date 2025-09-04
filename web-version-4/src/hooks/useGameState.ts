import React, { useState, useCallback } from 'react';
import type { GameState, Language, FactionInfluence } from '../types/game';
import { initialGlyphs } from '../data/gameData';

const initialGameState: GameState = {
  playerName: '',
  currentLanguage: null,
  knownLanguages: [],
  currentScene: 'awakening',
  factionInfluence: {
    institute: 0,
    clans: 0,
    echoborn: 0
  },
  unlockedGlyphs: [],
  consequenceMap: {},
  memoryFragments: []
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const setPlayerName = useCallback((name: string) => {
    setGameState(prev => ({
      ...prev,
      playerName: name
    }));
  }, []);

  const learnLanguage = useCallback((language: Language) => {
    setGameState(prev => {
      if (prev.knownLanguages.includes(language)) {
        return prev;
      }

      const newKnownLanguages = [...prev.knownLanguages, language];
      const newUnlockedGlyphs = initialGlyphs.filter(glyph => 
        glyph.unlockedBy?.includes(language) && 
        !prev.unlockedGlyphs.find(existing => existing.id === glyph.id)
      );

      return {
        ...prev,
        currentLanguage: prev.currentLanguage || language,
        knownLanguages: newKnownLanguages,
        unlockedGlyphs: [...prev.unlockedGlyphs, ...newUnlockedGlyphs]
      };
    });
  }, []);

  const navigateToScene = useCallback((sceneId: string) => {
    setGameState(prev => ({
      ...prev,
      currentScene: sceneId
    }));
  }, []);

  const addConsequence = useCallback((key: string, consequence: string) => {
    setGameState(prev => ({
      ...prev,
      consequenceMap: {
        ...prev.consequenceMap,
        [key]: [...(prev.consequenceMap[key] || []), consequence]
      }
    }));
  }, []);

  const updateFactionInfluence = useCallback((faction: keyof FactionInfluence, change: number) => {
    setGameState(prev => ({
      ...prev,
      factionInfluence: {
        ...prev.factionInfluence,
        [faction]: Math.max(0, Math.min(100, prev.factionInfluence[faction] + change))
      }
    }));
  }, []);

  const processChoice = useCallback((consequences: string[] = [], unlocks: string[] = []) => {
    consequences.forEach(consequence => {
      // Parse different types of consequences
      if (consequence.startsWith('learned_')) {
        const language = consequence.replace('learned_', '') as Language;
        learnLanguage(language);
      } else if (consequence.includes('faction_')) {
        // Handle faction influence changes
        const parts = consequence.split('_');
        if (parts.length >= 3) {
          const faction = parts[1] as keyof FactionInfluence;
          const change = parseInt(parts[2], 10);
          if (!isNaN(change)) {
            updateFactionInfluence(faction, change);
          }
        }
      } else {
        // Generic consequence tracking
        addConsequence('general', consequence);
      }
    });

    // Handle unlocks (typically scene navigation)
    if (unlocks.length > 0) {
      navigateToScene(unlocks[unlocks.length - 1]); // Navigate to the last unlocked scene
    }
  }, [learnLanguage, updateFactionInfluence, addConsequence, navigateToScene]);

  const resetGame = useCallback(() => {
    setGameState(initialGameState);
    localStorage.removeItem('valdaren-save');
  }, []);

  // Save game state to localStorage
  const saveGame = useCallback(() => {
    const saveData = {
      ...gameState,
      timestamp: Date.now(),
      version: '1.0.0'
    };
    localStorage.setItem('valdaren-save', JSON.stringify(saveData));
    return true;
  }, [gameState]);

  // Load game state from localStorage
  const loadGame = useCallback(() => {
    try {
      const saveData = localStorage.getItem('valdaren-save');
      if (saveData) {
        const parsedData = JSON.parse(saveData);
        // Remove version and timestamp before setting state
        const { version, timestamp, ...gameData } = parsedData;
        setGameState(gameData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load game:', error);
      return false;
    }
  }, []);

  // Check if save exists
  const hasSaveGame = useCallback(() => {
    return localStorage.getItem('valdaren-save') !== null;
  }, []);

  // Auto-save functionality
  const autoSave = useCallback(() => {
    if (gameState.playerName) { // Only auto-save if game has started
      saveGame();
    }
  }, [gameState.playerName, saveGame]);

  // Load saved game on initialization
  React.useEffect(() => {
    if (hasSaveGame() && !gameState.playerName) {
      loadGame();
    }
  }, []);

  // Auto-save when significant changes occur
  React.useEffect(() => {
    if (gameState.playerName) {
      const timeoutId = setTimeout(() => {
        autoSave();
      }, 1000); // Auto-save 1 second after changes
      return () => clearTimeout(timeoutId);
    }
  }, [gameState.currentScene, gameState.knownLanguages.length, gameState.unlockedGlyphs.length, autoSave]);

  return {
    gameState,
    setPlayerName,
    learnLanguage,
    navigateToScene,
    addConsequence,
    updateFactionInfluence,
    processChoice,
    resetGame,
    saveGame,
    loadGame,
    hasSaveGame,
    autoSave
  };
};