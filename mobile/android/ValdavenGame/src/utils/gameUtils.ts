import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GameState } from '../types/game';

export async function saveGameState(state: GameState): Promise<void> {
  try {
    const payload = { version: 1, timestamp: Date.now(), state };
    await AsyncStorage.setItem('ellidra.save', JSON.stringify(payload));
  } catch (error) {
    console.warn('Failed to save game state:', error);
  }
}

export async function loadGameState(): Promise<Partial<GameState> | null> {
  try {
    const raw = await AsyncStorage.getItem('ellidra.save');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== 1) return null;
    return parsed.state as GameState;
  } catch {
    return null;
  }
}

export function deriveRipple(state: GameState) {
  return {
    factions: state.factionInfluence,
    memoriesUnlocked: Object.values(state.memories).filter(m => !m.locked).map(m => m.id),
    consequences: state.consequenceMap
  };
}

export function checkUnlockConditions(state: GameState, conditions?: string[]): boolean {
  if (!conditions) return true;
  
  return conditions.every(condition => {
    // Simple condition checking logic - can be expanded
    if (condition.startsWith('language:')) {
      const lang = condition.replace('language:', '');
      return state.knownLanguages.includes(lang);
    }
    if (condition.startsWith('memory:')) {
      const memoryId = condition.replace('memory:', '');
      return state.memories[memoryId] && !state.memories[memoryId].locked;
    }
    return false;
  });
}