import { createContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { GameState, GameAction } from '../types/game';
import { saveGameState } from '../utils/gameUtils';

const initialMemories = {
  m_intro: {
    id: 'm_intro',
    title: 'Flicker',
    locked: true,
    content: 'A half-remembered taste of salt and smoke.'
  },
  m_childhood: {
    id: 'm_childhood', 
    title: 'Childhood Song',
    locked: true,
    content: 'A lullaby about falling stars.'
  }
};

const initialState: GameState = {
  playerName: 'Traveler',
  knownLanguages: ['common'],
  languageFlags: { english: false, dutch: false, latin: false, greek: false },
  memories: initialMemories,
  consequenceMap: {},
  factionInfluence: { ravengard: 60, whispering_woods: 50, fringe_ruins: 30 },
  currentScene: 'start',
  completedScenes: []
};

/**
 * Pure reducer that returns a new GameState for a given GameAction.
 *
 * Handles the following action types:
 * - `SET_PLAYER_NAME`: sets `playerName`.
 * - `LEARN_LANGUAGE`: adds a lowercased language to `knownLanguages` if missing and sets the corresponding `languageFlags` entry to `true`.
 * - `UNLOCK_MEMORY`: marks the specified memory's `locked` field as `false`.
 * - `ADD_CONSEQUENCE`: appends a value to the array at `consequenceMap[key]`, creating the array if necessary.
 * - `UPDATE_FACTION_INFLUENCE`: increments the named faction's influence by `change` (treats missing values as 0).
 * - `SET_CURRENT_SCENE`: sets `currentScene`.
 * - `COMPLETE_SCENE`: adds a scene to `completedScenes` if not already present.
 *
 * Unknown action types return the original state unchanged. This function is pure and has no side effects.
 *
 * @param state - Current game state.
 * @param action - Action describing the state update.
 * @returns The next game state.
 */
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYER_NAME':
      return { ...state, playerName: action.payload };
      
    case 'LEARN_LANGUAGE': {
      const lang = action.payload.toLowerCase();
      return {
        ...state,
        knownLanguages: state.knownLanguages.includes(lang) 
          ? state.knownLanguages 
          : [...state.knownLanguages, lang],
        languageFlags: { ...state.languageFlags, [lang]: true }
      };
    }
    
    case 'UNLOCK_MEMORY':
      return {
        ...state,
        memories: {
          ...state.memories,
          [action.payload]: {
            ...state.memories[action.payload],
            locked: false
          }
        }
      };
      
    case 'ADD_CONSEQUENCE':
      return {
        ...state,
        consequenceMap: {
          ...state.consequenceMap,
          [action.payload.key]: [
            ...(state.consequenceMap[action.payload.key] || []),
            action.payload.value
          ]
        }
      };
      
    case 'UPDATE_FACTION_INFLUENCE':
      return {
        ...state,
        factionInfluence: {
          ...state.factionInfluence,
          [action.payload.faction]: 
            (state.factionInfluence[action.payload.faction] || 0) + action.payload.change
        }
      };
      
    case 'SET_CURRENT_SCENE':
      return { ...state, currentScene: action.payload };
      
    case 'COMPLETE_SCENE':
      return {
        ...state,
        completedScenes: state.completedScenes.includes(action.payload)
          ? state.completedScenes
          : [...state.completedScenes, action.payload]
      };
      
    default:
      return state;
  }
}

/**
 * Load a previously persisted game state from localStorage.
 *
 * Attempts to read the 'ellidra.save' key, parse its JSON payload, and return the contained state only if the saved payload has `version === 1`.
 * Any missing key, parse error, unexpected version, or other failure results in `null`.
 *
 * @returns The persisted partial GameState when a valid v1 save is present; otherwise `null`.
 */
function loadPersisted(): Partial<GameState> | null {
  try {
    const raw = localStorage.getItem('ellidra.save');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== 1) return null;
    return parsed.state as GameState;
  } catch { return null; }
}

export const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

/**
 * Provides GameContext to descendants, initializing state from persisted storage and persisting updates.
 *
 * Merges any persisted game state into the default initial state, sets up the reducer, and saves the state
 * to persistent storage whenever it changes. The context value exposes `{ state, dispatch }` for consumers.
 *
 * @param children - React nodes rendered inside the provider.
 * @returns A context provider element supplying the game state and dispatch function.
 */
export function GameProvider({ children }: { children: ReactNode }) {
  const persisted = loadPersisted();
  const [state, dispatch] = useReducer(gameReducer, { ...initialState, ...persisted });

  function wrappedDispatch(action: GameAction) {
    dispatch(action);
  }

  useEffect(() => { saveGameState(state); }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch: wrappedDispatch }}>
      {children}
    </GameContext.Provider>
  );
}
