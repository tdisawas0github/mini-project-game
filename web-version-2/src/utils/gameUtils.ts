import type { GameState } from '../types/game';

export function saveGameState(state: GameState): void {
  try {
    const payload = { version: 1, timestamp: Date.now(), state };
    localStorage.setItem('ellidra.save', JSON.stringify(payload));
  } catch (error) {
    console.warn('Failed to save game state:', error);
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