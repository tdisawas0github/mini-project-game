import { useState, useCallback } from 'react';
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
  }, []);

  return {
    gameState,
    setPlayerName,
    learnLanguage,
    navigateToScene,
    addConsequence,
    updateFactionInfluence,
    processChoice,
    resetGame
  };
};