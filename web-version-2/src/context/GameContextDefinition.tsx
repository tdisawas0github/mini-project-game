import React from 'react';
import type { GameState, GameAction } from '../types/game';

export const GameContext = React.createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);