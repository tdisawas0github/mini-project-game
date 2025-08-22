import type { GameState } from '../types/game';

/**
 * Persist the given GameState to localStorage under the key 'ellidra.save'.
 *
 * The function stores a JSON payload of the form `{ version: 1, timestamp, state }`.
 * On failure it catches errors and logs a warning instead of throwing.
 *
 * @param state - The game state to persist.
 */
export function saveGameState(state: GameState): void {
  try {
    const payload = { version: 1, timestamp: Date.now(), state };
    localStorage.setItem('ellidra.save', JSON.stringify(payload));
  } catch (error) {
    console.warn('Failed to save game state:', error);
  }
}

/**
 * Derives a compact "ripple" snapshot from the full GameState.
 *
 * The returned object contains:
 * - `factions`: the current faction influence mapping
 * - `memoriesUnlocked`: array of memory IDs that are unlocked
 * - `consequences`: the current consequence map
 *
 * @param state - The GameState to derive the snapshot from
 * @returns A compact snapshot with `factions`, `memoriesUnlocked`, and `consequences`
 */
export function deriveRipple(state: GameState) {
  return {
    factions: state.factionInfluence,
    memoriesUnlocked: Object.values(state.memories).filter(m => !m.locked).map(m => m.id),
    consequences: state.consequenceMap
  };
}

/**
 * Determines whether all provided unlock conditions are satisfied by the given game state.
 *
 * Supported condition formats:
 * - `language:<lang>` — true if `state.knownLanguages` includes `<lang>`.
 * - `memory:<memoryId>` — true if `state.memories[memoryId]` exists and is not locked.
 * If `conditions` is omitted or empty, the function returns `true`.
 *
 * @param state - The current game state to evaluate conditions against.
 * @param conditions - An array of condition strings (see supported formats). All conditions must pass for the function to return `true`.
 * @returns `true` if every condition is satisfied (or if `conditions` is falsy); otherwise `false`.
 */
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