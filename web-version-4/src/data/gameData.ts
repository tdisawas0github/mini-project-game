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
  },
  {
    id: 'authority_challenge',
    symbol: '⚔️',
    name: 'Power-question',
    sound: 'rex-dubium',
    emotion: 'Defiant courage',
    mnemonicTether: 'Standing against oppression',
    ethicalResonance: 'Revolutionary - challenges established order',
    unlockedBy: ['english']
  },
  {
    id: 'harmonic_balance',
    symbol: '⚖️',
    name: 'Harmony-weave',
    sound: 'aequi-sonitus',
    emotion: 'Peaceful resolution',
    mnemonicTether: 'Finding middle ground',
    ethicalResonance: 'Virtuous - seeks unity over division',
    unlockedBy: ['english', 'dutch']
  },
  {
    id: 'memory_restoration',
    symbol: '🔮',
    name: 'Past-return',
    sound: 'mnem-redux',
    emotion: 'Hopeful determination',
    mnemonicTether: 'Healing what was broken',
    ethicalResonance: 'Compassionate - restores what was lost'
  },
  {
    id: 'appreciation_resonance',
    symbol: '🌟',
    name: 'Beauty-echo',
    sound: 'pul-amor',
    emotion: 'Wonder and gratitude',
    mnemonicTether: 'Recognizing natural perfection',
    ethicalResonance: 'Pure - celebrates life\'s gifts'
  },
  {
    id: 'forest_communion',
    symbol: '🌲',
    name: 'Tree-speak',
    sound: 'sylv-communis',
    emotion: 'Deep connection',
    mnemonicTether: 'Unity with living things',
    ethicalResonance: 'Sacred - bridges mortal and nature',
    unlockedBy: ['dutch']
  },
  {
    id: 'memory_dive',
    symbol: '🌀',
    name: 'Deep-plunge',
    sound: 'abysm-mergere',
    emotion: 'Brave exploration',
    mnemonicTether: 'Diving into the unconscious',
    ethicalResonance: 'Perilous - risks losing oneself'
  },
  {
    id: 'memory_alteration_preserve',
    symbol: '🛡️',
    name: 'Memory-guard',
    sound: 'custos-mnem',
    emotion: 'Protective instinct',
    mnemonicTether: 'Safeguarding the past',
    ethicalResonance: 'Conservative - maintains status quo'
  },
  {
    id: 'memory_alteration_freedom',
    symbol: '🕊️',
    name: 'Memory-free',
    sound: 'liber-mnem',
    emotion: 'Liberating joy',
    mnemonicTether: 'Breaking chains of the past',
    ethicalResonance: 'Progressive - embraces change'
  }
];

// Regions from Valdaren world data - now using parsed world_data
export const regions: Region[] = valdarenRegions;

// Faction descriptions from the world_data lore
export const factionInfo = valdarenFactions;