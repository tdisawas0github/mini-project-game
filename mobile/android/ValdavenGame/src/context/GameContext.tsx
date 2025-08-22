import React, { createContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { GameState, GameAction } from '../types/game';
import { saveGameState, loadGameState } from '../utils/gameUtils';

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

export const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [loaded, setLoaded] = React.useState(false);

  // Load persisted state on mount
  useEffect(() => {
    loadGameState().then(persistedState => {
      if (persistedState) {
        // Merge persisted state with initial state
        const mergedState = { ...initialState, ...persistedState };
        dispatch({ type: 'SET_PLAYER_NAME', payload: mergedState.playerName });
        mergedState.knownLanguages.forEach(lang => {
          dispatch({ type: 'LEARN_LANGUAGE', payload: lang });
        });
        // Add other state restoration as needed
      }
      setLoaded(true);
    });
  }, []);

  function wrappedDispatch(action: GameAction) {
    dispatch(action);
  }

  // Save state when it changes
  useEffect(() => {
    if (loaded) {
      saveGameState(state);
    }
  }, [state, loaded]);

  return (
    <GameContext.Provider value={{ state, dispatch: wrappedDispatch }}>
      {children}
    </GameContext.Provider>
  );
}