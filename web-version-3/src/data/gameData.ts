import type { Glyph, Region } from '../types/game';

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
    mnemonicTether: 'Moments of painful truth',
    ethicalResonance: 'Dangerous - destroys illusions'
  },
  {
    id: 'memory_weave',
    symbol: '🌿',
    name: 'Thread-bind',
    sound: 'mem-tessere',
    emotion: 'Creative purpose',
    mnemonicTether: 'Crafting new from old',
    ethicalResonance: 'Powerful - reshapes identity'
  }
];

// Regions from Valdaren faction data
export const regions: Region[] = [
  {
    id: 'ravengard',
    name: 'Ravengard',
    faction: 'institute',
    description: 'Urban seat of the Institute of Lingua Arcanum. Here, Ellidric is studied like a science, catalogued and controlled in sterile halls of learning.',
    influence: 60
  },
  {
    id: 'whispering_woods',
    name: 'Whispering Woods', 
    faction: 'clans',
    description: 'Ancient forests where oral traditions keep Ellidric alive and wild. The Clans view the language as a living entity that must not be tamed.',
    influence: 50
  },
  {
    id: 'ancient_ruins',
    name: 'Ancient Ruins',
    faction: 'echoborn',
    description: 'Forgotten places near Lumisth Glacier where glyphs first touched human minds. The Echoborn claim to be reborn from these very stones.',
    influence: 30
  }
];

// Faction descriptions from the lore
export const factionInfo = {
  institute: {
    name: 'Institute of Lingua Arcanum',
    description: 'Seekers of precision, control, and "healing" through language. They believe Ellidric can be codified and used to fix broken minds.',
    stronghold: 'Ravengard',
    philosophy: 'Language as science'
  },
  clans: {
    name: 'Clans of the Whispering Woods',
    description: 'Guardians of oral tradition who protect the pure, fluid nature of Ellidric. They fear what happens when the sacred becomes structured.',
    stronghold: 'Whispering Woods',
    philosophy: 'Language as living spirit'
  },
  echoborn: {
    name: 'The Echoborn',
    description: 'Mysterious entities claiming to be reborn from glyphs themselves. They understand Ellidric in ways that transcend human comprehension.',
    stronghold: 'Ancient Ruins',
    philosophy: 'Language as existence itself'
  }
};