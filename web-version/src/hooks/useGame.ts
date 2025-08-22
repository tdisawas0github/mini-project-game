import { useContext } from 'react';
import { GameContext } from '../context/GameContext';

/**
 * React hook that returns the current GameContext value.
 *
 * Throws an Error if called outside of a matching GameProvider.
 *
 * @returns The value from GameContext for the nearest provider.
 * @throws Error if the hook is used when there is no GameProvider in the component tree.
 */
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}