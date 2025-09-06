// Advanced caching system with localStorage, sessionStorage, and cookie fallbacks
import type { GameState } from '../types/game';

interface CacheOptions {
  useSession?: boolean; // Use sessionStorage instead of localStorage
  compress?: boolean; // Compress data for storage
  encrypt?: boolean; // Basic encryption for sensitive data
  maxAge?: number; // TTL in milliseconds
}

interface CachedData<T> {
  data: T;
  timestamp: number;
  maxAge?: number;
  version: string;
}

class GameCacheManager {
  private readonly GAME_VERSION = '1.0.0';
  private readonly CACHE_PREFIX = 'echoes_ellidra_';
  
  // Cache keys
  static readonly KEYS = {
    GAME_STATE: 'game_state',
    USER_PREFERENCES: 'user_preferences',
    ACHIEVEMENT_PROGRESS: 'achievement_progress',
    FACTION_REPUTATION: 'faction_reputation',
    CHARACTER_RELATIONSHIPS: 'character_relationships',
    LANGUAGE_PROGRESS: 'language_progress',
    SAVE_SLOTS: 'save_slots',
    QUICK_SAVE: 'quick_save',
    SETTINGS: 'settings',
    PLAY_STATISTICS: 'play_statistics'
  } as const;

  /**
   * Store data with caching options
   */
  store<T>(key: string, data: T, options: CacheOptions = {}): boolean {
    try {
      const cachedData: CachedData<T> = {
        data,
        timestamp: Date.now(),
        maxAge: options.maxAge,
        version: this.GAME_VERSION
      };

      let serializedData = JSON.stringify(cachedData);
      
      // Compress if requested (simple compression)
      if (options.compress) {
        serializedData = this.compress(serializedData);
      }
      
      // Encrypt if requested (basic encryption)
      if (options.encrypt) {
        serializedData = this.encrypt(serializedData);
      }

      const fullKey = this.CACHE_PREFIX + key;
      
      // Try localStorage first (persistent)
      if (!options.useSession && this.isStorageAvailable('localStorage')) {
        localStorage.setItem(fullKey, serializedData);
        return true;
      }
      
      // Try sessionStorage (session-only)
      if (this.isStorageAvailable('sessionStorage')) {
        sessionStorage.setItem(fullKey, serializedData);
        return true;
      }
      
      // Fallback to cookies
      return this.setCookie(fullKey, serializedData, options.maxAge);
      
    } catch (error) {
      console.error('Cache store error:', error);
      return false;
    }
  }

  /**
   * Retrieve data from cache
   */
  retrieve<T>(key: string, options: CacheOptions = {}): T | null {
    try {
      const fullKey = this.CACHE_PREFIX + key;
      let serializedData: string | null = null;
      
      // Try localStorage first
      if (!options.useSession && this.isStorageAvailable('localStorage')) {
        serializedData = localStorage.getItem(fullKey);
      }
      
      // Try sessionStorage
      if (!serializedData && this.isStorageAvailable('sessionStorage')) {
        serializedData = sessionStorage.getItem(fullKey);
      }
      
      // Try cookies
      if (!serializedData) {
        serializedData = this.getCookie(fullKey);
      }
      
      if (!serializedData) {
        return null;
      }
      
      // Decrypt if needed
      if (options.encrypt) {
        serializedData = this.decrypt(serializedData);
      }
      
      // Decompress if needed
      if (options.compress) {
        serializedData = this.decompress(serializedData);
      }
      
      const cachedData: CachedData<T> = JSON.parse(serializedData);
      
      // Check version compatibility
      if (cachedData.version !== this.GAME_VERSION) {
        console.warn(`Cache version mismatch for ${key}. Clearing cache.`);
        this.remove(key);
        return null;
      }
      
      // Check expiration
      if (cachedData.maxAge && Date.now() - cachedData.timestamp > cachedData.maxAge) {
        console.log(`Cache expired for ${key}. Removing.`);
        this.remove(key);
        return null;
      }
      
      return cachedData.data;
      
    } catch (error) {
      console.error('Cache retrieve error:', error);
      return null;
    }
  }

  /**
   * Remove item from cache
   */
  remove(key: string): boolean {
    try {
      const fullKey = this.CACHE_PREFIX + key;
      
      // Remove from localStorage
      if (this.isStorageAvailable('localStorage')) {
        localStorage.removeItem(fullKey);
      }
      
      // Remove from sessionStorage
      if (this.isStorageAvailable('sessionStorage')) {
        sessionStorage.removeItem(fullKey);
      }
      
      // Remove from cookies
      this.deleteCookie(fullKey);
      
      return true;
    } catch (error) {
      console.error('Cache remove error:', error);
      return false;
    }
  }

  /**
   * Clear all game cache
   */
  clearAll(): boolean {
    try {
      const keys = Object.values(GameCacheManager.KEYS);
      keys.forEach(key => this.remove(key));
      
      // Also clear any legacy keys
      this.clearLegacyCache();
      
      return true;
    } catch (error) {
      console.error('Cache clear all error:', error);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    localStorageUsed: number;
    sessionStorageUsed: number;
    cookiesUsed: number;
    totalItems: number;
  } {
    let localStorageUsed = 0;
    let sessionStorageUsed = 0;
    let cookiesUsed = 0;
    let totalItems = 0;

    // Check localStorage
    if (this.isStorageAvailable('localStorage')) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.CACHE_PREFIX)) {
          localStorageUsed += (localStorage.getItem(key) || '').length;
          totalItems++;
        }
      }
    }

    // Check sessionStorage
    if (this.isStorageAvailable('sessionStorage')) {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith(this.CACHE_PREFIX)) {
          sessionStorageUsed += (sessionStorage.getItem(key) || '').length;
          totalItems++;
        }
      }
    }

    return {
      localStorageUsed,
      sessionStorageUsed,
      cookiesUsed,
      totalItems
    };
  }

  /**
   * Game-specific save methods
   */
  saveGameState(gameState: GameState, slot?: number): boolean {
    const key = slot !== undefined ? `${GameCacheManager.KEYS.SAVE_SLOTS}_${slot}` : GameCacheManager.KEYS.QUICK_SAVE;
    
    const saveData = {
      gameState,
      saveDate: new Date().toISOString(),
      sceneName: this.getSceneName(gameState.currentScene),
      playTime: this.calculatePlayTime(gameState)
    };

    return this.store(key, saveData, { 
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
  }

  loadGameState(slot?: number): GameState | null {
    const key = slot !== undefined ? `${GameCacheManager.KEYS.SAVE_SLOTS}_${slot}` : GameCacheManager.KEYS.QUICK_SAVE;
    const saveData = this.retrieve<any>(key);
    return saveData?.gameState || null;
  }

  saveUserPreferences(preferences: any): boolean {
    return this.store(GameCacheManager.KEYS.USER_PREFERENCES, preferences);
  }

  loadUserPreferences(): any {
    return this.retrieve(GameCacheManager.KEYS.USER_PREFERENCES) || {
      volume: 0.8,
      textSpeed: 'normal',
      autoAdvance: false,
      skipRead: false,
      language: 'english'
    };
  }

  saveAchievementProgress(achievements: any[]): boolean {
    return this.store(GameCacheManager.KEYS.ACHIEVEMENT_PROGRESS, achievements);
  }

  loadAchievementProgress(): any[] {
    return this.retrieve(GameCacheManager.KEYS.ACHIEVEMENT_PROGRESS) || [];
  }

  saveFactionReputation(reputation: Record<string, number>): boolean {
    return this.store(GameCacheManager.KEYS.FACTION_REPUTATION, reputation);
  }

  loadFactionReputation(): Record<string, number> {
    return this.retrieve(GameCacheManager.KEYS.FACTION_REPUTATION) || {
      institute: 0,
      clans: 0,
      echoborn: 0,
      neutral: 0
    };
  }

  saveCharacterRelationships(relationships: Record<string, number>): boolean {
    return this.store(GameCacheManager.KEYS.CHARACTER_RELATIONSHIPS, relationships);
  }

  loadCharacterRelationships(): Record<string, number> {
    return this.retrieve(GameCacheManager.KEYS.CHARACTER_RELATIONSHIPS) || {};
  }

  saveLanguageProgress(progress: any): boolean {
    return this.store(GameCacheManager.KEYS.LANGUAGE_PROGRESS, progress);
  }

  loadLanguageProgress(): any {
    return this.retrieve(GameCacheManager.KEYS.LANGUAGE_PROGRESS) || {
      phrasesLearned: 0,
      exercisesCompleted: 0,
      accuracy: 0,
      studyTime: 0
    };
  }

  savePlayStatistics(stats: any): boolean {
    return this.store(GameCacheManager.KEYS.PLAY_STATISTICS, stats);
  }

  loadPlayStatistics(): any {
    return this.retrieve(GameCacheManager.KEYS.PLAY_STATISTICS) || {
      totalPlayTime: 0,
      sessionsPlayed: 0,
      choicesMade: 0,
      memoriesDived: 0,
      glyphsDiscovered: 0
    };
  }

  // Private utility methods
  private isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
    try {
      const storage = window[type];
      const test = '__storage_test__';
      storage.setItem(test, test);
      storage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private setCookie(name: string, value: string, maxAge?: number): boolean {
    try {
      let cookieString = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Strict`;
      
      if (maxAge) {
        const expires = new Date(Date.now() + maxAge).toUTCString();
        cookieString += `; expires=${expires}`;
      }
      
      document.cookie = cookieString;
      return true;
    } catch {
      return false;
    }
  }

  private getCookie(name: string): string | null {
    try {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) {
          return decodeURIComponent(value);
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  private deleteCookie(name: string): void {
    try {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    } catch {
      // Ignore errors
    }
  }

  private compress(data: string): string {
    // Simple compression (in a real app, use a proper compression library)
    return btoa(data);
  }

  private decompress(data: string): string {
    return atob(data);
  }

  private encrypt(data: string): string {
    // Basic XOR encryption (in a real app, use proper encryption)
    const key = 'echoes_ellidra_key';
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result);
  }

  private decrypt(data: string): string {
    const decoded = atob(data);
    const key = 'echoes_ellidra_key';
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  }

  private clearLegacyCache(): void {
    // Clear any old cache keys that might exist
    const legacyKeys = [
      'echoes_save_slot_',
      'echoes_quick_save',
      'game_state',
      'user_preferences'
    ];
    
    legacyKeys.forEach(legacyKey => {
      if (this.isStorageAvailable('localStorage')) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.includes(legacyKey)) {
            localStorage.removeItem(key);
          }
        }
      }
    });
  }

  private getSceneName(sceneId: string): string {
    const sceneNames: Record<string, string> = {
      'prologue_start': 'Awakening in Valdaren',
      'hub_main': 'The Crossroads of Memory',
      'chapter1_start': 'First Steps into Mystery',
      'chapter2_start': 'Deeper into the Ruins',
      'memory_chamber_entry': 'Memory-Dive Chamber'
    };
    return sceneNames[sceneId] || 'Unknown Location';
  }

  private calculatePlayTime(gameState: GameState): number {
    // Calculate approximate play time based on progress
    const baseTime = 300; // 5 minutes base
    const languageTime = gameState.knownLanguages.length * 600; // 10 min per language
    const glyphTime = gameState.unlockedGlyphs.length * 120; // 2 min per glyph
    const memoryTime = gameState.memoryFragments.length * 300; // 5 min per memory
    
    return baseTime + languageTime + glyphTime + memoryTime;
  }
}

// Create singleton instance
export const gameCache = new GameCacheManager();

// Export utility functions for easy use
export const cacheGameState = (gameState: GameState, slot?: number) => 
  gameCache.saveGameState(gameState, slot);

export const loadGameState = (slot?: number) => 
  gameCache.loadGameState(slot);

export const cacheUserPreferences = (preferences: any) => 
  gameCache.saveUserPreferences(preferences);

export const loadUserPreferences = () => 
  gameCache.loadUserPreferences();

export const cacheAchievements = (achievements: any[]) => 
  gameCache.saveAchievementProgress(achievements);

export const loadAchievements = () => 
  gameCache.loadAchievementProgress();

export const cacheFactionReputation = (reputation: Record<string, number>) => 
  gameCache.saveFactionReputation(reputation);

export const loadFactionReputation = () => 
  gameCache.loadFactionReputation();

export const cacheCharacterRelationships = (relationships: Record<string, number>) => 
  gameCache.saveCharacterRelationships(relationships);

export const loadCharacterRelationships = () => 
  gameCache.loadCharacterRelationships();

export const cacheLanguageProgress = (progress: any) => 
  gameCache.saveLanguageProgress(progress);

export const loadLanguageProgress = () => 
  gameCache.loadLanguageProgress();

export const clearAllCache = () => 
  gameCache.clearAll();

export const getCacheStats = () => 
  gameCache.getStats();
