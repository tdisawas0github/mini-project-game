// React hook for managing game cache across all components
import { useState, useEffect, useCallback } from 'react';
import { 
  gameCache, 
  loadUserPreferences, 
  cacheUserPreferences,
  loadFactionReputation,
  cacheFactionReputation,
  loadCharacterRelationships,
  cacheCharacterRelationships,
  loadLanguageProgress,
  cacheLanguageProgress,
  loadAchievements,
  cacheAchievements
} from '../utils/cacheManager';
import type { GameState } from '../types/game';

interface CacheHookReturn {
  // User preferences
  preferences: any;
  updatePreferences: (newPreferences: any) => void;
  
  // Faction reputation
  factionReputation: Record<string, number>;
  updateFactionReputation: (factionId: string, change: number) => void;
  setFactionReputation: (reputation: Record<string, number>) => void;
  
  // Character relationships
  characterRelationships: Record<string, number>;
  updateCharacterRelationship: (characterId: string, change: number) => void;
  setCharacterRelationships: (relationships: Record<string, number>) => void;
  
  // Language progress
  languageProgress: any;
  updateLanguageProgress: (progress: any) => void;
  
  // Achievements
  achievements: any[];
  unlockAchievement: (achievementId: string) => void;
  updateAchievementProgress: (achievementId: string, progress: number) => void;
  
  // Auto-save management
  enableAutoSave: boolean;
  setEnableAutoSave: (enabled: boolean) => void;
  autoSaveGame: (gameState: GameState) => void;
  
  // Cache statistics
  cacheStats: any;
  refreshCacheStats: () => void;
  
  // Utility functions
  clearAllData: () => void;
  exportData: () => Promise<string>;
  importData: (data: string) => Promise<boolean>;
}

export const useGameCache = (): CacheHookReturn => {
  // State for cached data
  const [preferences, setPreferences] = useState<any>(null);
  const [factionReputation, setFactionReputationState] = useState<Record<string, number>>({});
  const [characterRelationships, setCharacterRelationshipsState] = useState<Record<string, number>>({});
  const [languageProgress, setLanguageProgressState] = useState<any>(null);
  const [achievements, setAchievementsState] = useState<any[]>([]);
  const [enableAutoSave, setEnableAutoSave] = useState<boolean>(true);
  const [cacheStats, setCacheStats] = useState<any>(null);

  // Load initial data from cache
  useEffect(() => {
    const loadedPreferences = loadUserPreferences();
    const loadedFactionRep = loadFactionReputation();
    const loadedCharacterRel = loadCharacterRelationships();
    const loadedLanguageProg = loadLanguageProgress();
    const loadedAchievements = loadAchievements();
    
    setPreferences(loadedPreferences);
    setFactionReputationState(loadedFactionRep);
    setCharacterRelationshipsState(loadedCharacterRel);
    setLanguageProgressState(loadedLanguageProg);
    setAchievementsState(loadedAchievements);
    
    // Load auto-save preference
    setEnableAutoSave(loadedPreferences.autoSave !== false);
    
    refreshCacheStats();
  }, []);

  // Update preferences
  const updatePreferences = useCallback((newPreferences: any) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    cacheUserPreferences(updated);
  }, [preferences]);

  // Update faction reputation
  const updateFactionReputation = useCallback((factionId: string, change: number) => {
    const updated = {
      ...factionReputation,
      [factionId]: Math.max(0, Math.min(100, (factionReputation[factionId] || 0) + change))
    };
    setFactionReputationState(updated);
    cacheFactionReputation(updated);
  }, [factionReputation]);

  const setFactionReputation = useCallback((reputation: Record<string, number>) => {
    setFactionReputationState(reputation);
    cacheFactionReputation(reputation);
  }, []);

  // Update character relationships
  const updateCharacterRelationship = useCallback((characterId: string, change: number) => {
    const updated = {
      ...characterRelationships,
      [characterId]: Math.max(0, Math.min(100, (characterRelationships[characterId] || 50) + change))
    };
    setCharacterRelationshipsState(updated);
    cacheCharacterRelationships(updated);
  }, [characterRelationships]);

  const setCharacterRelationships = useCallback((relationships: Record<string, number>) => {
    setCharacterRelationshipsState(relationships);
    cacheCharacterRelationships(relationships);
  }, []);

  // Update language progress
  const updateLanguageProgress = useCallback((progress: any) => {
    const updated = { ...languageProgress, ...progress };
    setLanguageProgressState(updated);
    cacheLanguageProgress(updated);
  }, [languageProgress]);

  // Achievement management
  const unlockAchievement = useCallback((achievementId: string) => {
    const updated = achievements.map(achievement => 
      achievement.id === achievementId 
        ? { ...achievement, unlocked: true, unlockedDate: new Date().toISOString() }
        : achievement
    );
    setAchievementsState(updated);
    cacheAchievements(updated);
  }, [achievements]);

  const updateAchievementProgress = useCallback((achievementId: string, progress: number) => {
    const updated = achievements.map(achievement => 
      achievement.id === achievementId 
        ? { ...achievement, progress: Math.min(achievement.maxProgress, progress) }
        : achievement
    );
    setAchievementsState(updated);
    cacheAchievements(updated);
  }, [achievements]);

  // Auto-save functionality
  const autoSaveGame = useCallback((gameState: GameState) => {
    if (enableAutoSave) {
      gameCache.saveGameState(gameState);
    }
  }, [enableAutoSave]);

  // Cache statistics
  const refreshCacheStats = useCallback(() => {
    setCacheStats(gameCache.getStats());
  }, []);

  // Utility functions
  const clearAllData = useCallback(() => {
    gameCache.clearAll();
    setPreferences(loadUserPreferences());
    setFactionReputationState(loadFactionReputation());
    setCharacterRelationshipsState(loadCharacterRelationships());
    setLanguageProgressState(loadLanguageProgress());
    setAchievementsState(loadAchievements());
    refreshCacheStats();
  }, []);

  const exportData = useCallback(async (): Promise<string> => {
    const exportData = {
      preferences,
      factionReputation,
      characterRelationships,
      languageProgress,
      achievements,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    return JSON.stringify(exportData, null, 2);
  }, [preferences, factionReputation, characterRelationships, languageProgress, achievements]);

  const importData = useCallback(async (data: string): Promise<boolean> => {
    try {
      const importData = JSON.parse(data);
      
      if (importData.preferences) {
        setPreferences(importData.preferences);
        cacheUserPreferences(importData.preferences);
      }
      if (importData.factionReputation) {
        setFactionReputationState(importData.factionReputation);
        cacheFactionReputation(importData.factionReputation);
      }
      if (importData.characterRelationships) {
        setCharacterRelationshipsState(importData.characterRelationships);
        cacheCharacterRelationships(importData.characterRelationships);
      }
      if (importData.languageProgress) {
        setLanguageProgressState(importData.languageProgress);
        cacheLanguageProgress(importData.languageProgress);
      }
      if (importData.achievements) {
        setAchievementsState(importData.achievements);
        cacheAchievements(importData.achievements);
      }
      
      refreshCacheStats();
      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  }, []);

  return {
    preferences,
    updatePreferences,
    factionReputation,
    updateFactionReputation,
    setFactionReputation,
    characterRelationships,
    updateCharacterRelationship,
    setCharacterRelationships,
    languageProgress,
    updateLanguageProgress,
    achievements,
    unlockAchievement,
    updateAchievementProgress,
    enableAutoSave,
    setEnableAutoSave,
    autoSaveGame,
    cacheStats,
    refreshCacheStats,
    clearAllData,
    exportData,
    importData
  };
};

// Achievement checking utility
export const checkAndUnlockAchievements = (
  gameState: GameState,
  factionReputation: Record<string, number>,
  characterRelationships: Record<string, number>,
  languageProgress: any,
  unlockAchievement: (id: string) => void
) => {
  // Story achievements
  if (gameState.currentScene === 'hub_main' && gameState.playerName) {
    unlockAchievement('first_awakening');
  }
  
  // Language achievements
  if (gameState.knownLanguages.length >= 4) {
    unlockAchievement('polyglot');
  }
  
  if (languageProgress?.phrasesLearned >= 50) {
    unlockAchievement('ellidric_master');
  }
  
  // Character achievements
  const maxTrust = Math.max(...Object.values(characterRelationships));
  if (maxTrust >= 100) {
    unlockAchievement('trusted_ally');
  }
  
  // Faction achievements
  const highRepFactions = Object.values(factionReputation).filter(rep => rep >= 75);
  if (highRepFactions.length >= 2) {
    unlockAchievement('faction_diplomat');
  }
  
  // Exploration achievements
  if (gameState.memoryFragments.length >= 10) {
    unlockAchievement('memory_architect');
  }
  
  if (gameState.unlockedGlyphs.length >= 25) {
    unlockAchievement('glyph_collector');
  }
};

// Auto-save trigger utility
export const triggerAutoSave = (gameState: GameState, autoSaveGame: (state: GameState) => void) => {
  // Auto-save on significant events
  const autoSaveTriggers = [
    'hub_main',
    'chapter1_start',
    'chapter2_start',
    'memory_chamber_entry'
  ];
  
  if (autoSaveTriggers.includes(gameState.currentScene)) {
    autoSaveGame(gameState);
  }
};
