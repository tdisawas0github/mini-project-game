import type { Glyph, Region } from '../types/game';
import { valdarenRegions, valdarenFactions } from '../utils/worldDataParser';

// Glyphs based on Valdaren lore - Ellidric language with 4 layers
export const initialGlyphs: Glyph[] = [
  {
    id: 'memory_probe',
    symbol: '⚡',
    name: 'Flicker',
    sound: 'vel-ith',
    emotion: 'Curiosity tinged with fear',
    mnemonicTether: 'First moments of consciousness',
    ethicalResonance: 'Neutral - seeking knowledge',
    unlockedBy: ['english']
  },
  {
    id: 'childhood_song',
    symbol: '🌊',
    name: 'Warmth-tide',
    sound: 'mor-aethys',
    emotion: 'Nostalgic comfort',
    mnemonicTether: 'Childhood memories of safety',
    ethicalResonance: 'Positive - preservation of innocence',
    unlockedBy: ['dutch']
  },
  {
    id: 'ritual_binding',
    symbol: '🔥',
    name: 'Sacred-bind',
    sound: 'sanctus-nex',
    emotion: 'Solemnity and power',
    mnemonicTether: 'Ancient ceremonial traditions',
    ethicalResonance: 'Complex - binding others\' will',
    unlockedBy: ['latin']
  },
  {
    id: 'ancient_sorrow',
    symbol: '❄️',
    name: 'Deep-grief',
    sound: 'páthos-chronos',
    emotion: 'Profound melancholy',
    mnemonicTether: 'Loss that shaped history',
    ethicalResonance: 'Heavy - carries weight of ages',
    unlockedBy: ['greek']
  },
  {
    id: 'truth_reveal',
    symbol: '⭐',
    name: 'Truth-pierce',
    sound: 'veil-shatter',
    emotion: 'Sharp clarity',
    mnemonicTether: 'Hidden truths seeking light',
    ethicalResonance: 'Dangerous - destroys comfortable lies'
  },
  {
    id: 'thread_bind',
    symbol: '🧵',
    name: 'Thread-bind',
    sound: 'mem-tessere',
    emotion: 'Creative purpose',
    mnemonicTether: 'Crafting new from old',
    ethicalResonance: 'Powerful - reshapes identity'
  }
];

// Regions from Valdaren world data - now using parsed world_data
export const regions: Region[] = valdarenRegions;

// Faction descriptions from the world_data lore
export const factionInfo = valdarenFactions;