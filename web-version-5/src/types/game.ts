// Core game types based on Valdaren lore

export interface GameState {
  playerName: string;
  currentLanguage: Language | null;
  knownLanguages: Language[];
  currentScene: string;
  factionInfluence: FactionInfluence;
  unlockedGlyphs: Glyph[];
  consequenceMap: Record<string, string[]>;
  memoryFragments: MemoryFragment[];
}

export type Language = 'english' | 'dutch' | 'latin' | 'greek';

export interface FactionInfluence {
  institute: number; // Institute of Lingua Arcanum (Ravengard)
  clans: number; // Clans of the Whispering Woods
  echoborn: number; // The Echoborn (Ancient Ruins)
}

export interface Glyph {
  id: string;
  symbol: string;
  name: string;
  sound: string; // Layer 1: Phonetic form
  emotion: string; // Layer 2: Feeling it carries
  mnemonicTether: string; // Layer 3: Memory it links to
  ethicalResonance: string; // Layer 4: Moral/spiritual weight
  unlockedBy?: Language[];
}

export interface MemoryFragment {
  id: string;
  title: string;
  description: string;
  relatedGlyph?: string;
  canAlter: boolean;
  isAltered: boolean;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  text: string;
  choices?: Choice[];
  autoAdvance?: string;
  glyphUsed?: string;
  requiresLanguages?: Language[];
  consequences?: string[];
  unlocks?: string[];
}

export interface Choice {
  id: string;
  text: string;
  glyphUsed?: string;
  requiresLanguages?: Language[];
  consequences?: string[];
  unlocks?: string[];
}

export interface Region {
  id: string;
  name: string;
  faction: 'institute' | 'clans' | 'echoborn' | 'neutral';
  description: string;
  influence: number;
}

export interface Faction {
  id: string;
  name: string;
  description: string;
  philosophy: string;
  stronghold: string;
  color: string;
  territories?: string[];
  traits?: string[];
  leaders?: string[];
}