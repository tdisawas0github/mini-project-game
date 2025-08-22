export interface GameState {
  playerName: string;
  knownLanguages: string[];
  languageFlags: Record<string, boolean>;
  memories: Record<string, Memory>;
  consequenceMap: Record<string, string[]>;
  factionInfluence: Record<string, number>;
  currentScene: string;
  completedScenes: string[];
}

export interface Memory {
  id: string;
  title: string;
  locked: boolean;
  content: string;
  unlockConditions?: string[];
}

export interface Region {
  id: string;
  name: string;
  faction: string;
  x: number;
  y: number;
  w: number;
  h: number;
  influence: number;
  description: string;
}

export interface FactionMapData {
  map_image: string;
  regions: Region[];
}

export interface DialogueChoice {
  id: string;
  text: string;
  glyphUsed?: string;
  consequences?: string[];
  requiresLanguages?: string[];
  unlocks?: string[];
}

export interface DialogueNode {
  id: string;
  speaker: string;
  text: string | string[];
  choices?: DialogueChoice[];
  autoAdvance?: string;
  effects?: SceneEffect[];
}

export interface SceneEffect {
  type: 'learn_language' | 'unlock_memory' | 'faction_influence' | 'add_consequence';
  value: string;
  faction?: string;
  amount?: number;
}

export interface Chapter {
  id: string;
  title: string;
  scenes: DialogueNode[];
  unlockConditions?: string[];
}

export type GameAction = 
  | { type: 'SET_PLAYER_NAME'; payload: string }
  | { type: 'LEARN_LANGUAGE'; payload: string }
  | { type: 'UNLOCK_MEMORY'; payload: string }
  | { type: 'ADD_CONSEQUENCE'; payload: { key: string; value: string } }
  | { type: 'UPDATE_FACTION_INFLUENCE'; payload: { faction: string; change: number } }
  | { type: 'SET_CURRENT_SCENE'; payload: string }
  | { type: 'COMPLETE_SCENE'; payload: string };

export interface UnlockCondition {
  type: 'language' | 'memory' | 'consequence' | 'faction_influence';
  key: string;
  op?: 'gte' | 'lte' | 'eq' | 'includes';
  value?: string | number | boolean | string[];
}

export interface RippleEffectSummary {
  factions: Record<string, number>;
  memoriesUnlocked: string[];
  consequences: Record<string, string[]>;
}

export interface SaveGamePayload {
  version: number;
  timestamp: number;
  state: GameState;
}