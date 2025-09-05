// Utility to parse world_data markdown files and Valdaren game data
import type { Region, Faction } from '../types/game';

// Since we can't dynamically import markdown files in the browser,
// we'll create structured data based on the world_data and Valdaren sources

export const valdarenRegions: Region[] = [
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
  },
  {
    id: 'snowveil_forest',
    name: 'Snowveil Forest',
    faction: 'clans',
    description: 'Borderland forest where clan storytellers practice ancient oral traditions under snow-laden branches.',
    influence: 35
  },
  {
    id: 'lumisth_glacier',
    name: 'Lumisth Glacier',
    faction: 'echoborn',
    description: 'Frozen Fringe where the first Ellidric glyphs were discovered embedded in ancient ice.',
    influence: 25
  },
  {
    id: 'lake_eirysa',
    name: 'Lake Eirysa',
    faction: 'neutral',
    description: 'Central landmark where all factions meet for rare diplomatic exchanges, its waters reflecting ancient memories.',
    influence: 40
  }
];

export const valdarenFactions: Faction[] = [
  {
    id: 'institute',
    name: 'Institute of Lingua Arcanum',
    description: 'Seekers of precision, control, and "healing" through language. They believe Ellidric can be codified and used to fix broken minds.',
    stronghold: 'Ravengard',
    philosophy: 'Language as science - Ellidric should be catalogued, controlled, and used for the betterment of society through structured learning',
    color: '#3b82f6', // Blue
    territories: ['Ravengard', 'Institute Archives', 'Research Outposts'],
    traits: ['Methodical approach to Ellidric', 'Extensive written records', 'Structured hierarchy', 'Suspicious of uncontrolled usage'],
    leaders: ['Magistrate Korven', 'Chief Archivist Vex', 'Senior Researcher Thalia']
  },
  {
    id: 'clans',
    name: 'Clans of the Whispering Woods',
    description: 'Guardians of oral tradition who protect the pure, fluid nature of Ellidric. They fear what happens when the sacred becomes structured.',
    stronghold: 'Whispering Woods',
    philosophy: 'Language as living spirit - Ellidric is alive and must remain free-flowing, passed through voice and breath rather than cold inscription',
    color: '#22c55e', // Green
    territories: ['Whispering Woods', 'Snowveil Forest', 'Sacred Groves'],
    traits: ['Oral traditions only', 'Deep connection to nature', 'Tribal council leadership', 'Distrustful of written Ellidric'],
    leaders: ['Elder Thane', 'Moonwhisper Kira', 'Sage Branwen']
  },
  {
    id: 'echoborn',
    name: 'The Echoborn',
    description: 'Mysterious entities claiming to be reborn from glyphs themselves. They understand Ellidric in ways that transcend human comprehension.',
    stronghold: 'Ancient Ruins',
    philosophy: 'Language as existence itself - Ellidric is not merely communication but the fundamental force that shapes reality and consciousness',
    color: '#a855f7', // Purple
    territories: ['Ancient Ruins', 'Lumisth Glacier', 'Forgotten Sanctuaries'],
    traits: ['Speak only Pure Ellidric', 'Cryptic and enigmatic', 'Born from glyphs', 'Transcendent understanding'],
    leaders: ['The Echo Child', 'Silence Speaker', 'Glyph-Heart Zara']
  },
  {
    id: 'neutral',
    name: 'Neutral Territories',
    description: 'Regions that maintain independence or serve as meeting grounds between the major factions.',
    stronghold: 'Lake Eirysa',
    philosophy: 'Balance and diplomacy - Seek to understand all perspectives on Ellidric while maintaining neutrality in factional conflicts',
    color: '#6b7280', // Gray
    territories: ['Lake Eirysa', 'Crossroads Market', 'Diplomatic Halls'],
    traits: ['Political neutrality', 'Trade-focused', 'Diplomatic immunity', 'Multi-factional acceptance'],
    leaders: ['Merchant Prince Kael', 'Ambassador Elyn', 'Neutral Council']
  }
];

// Legacy object format for backward compatibility
export const valdarenFactionsLegacy = {
  institute: valdarenFactions[0],
  clans: valdarenFactions[1], 
  echoborn: valdarenFactions[2],
  neutral: valdarenFactions[3]
};

// Map data structure with percentage-based coordinates
export const valdarenMapData = {
  map_image: '/assets/map-of-valdaren.png',
  regions: [
    {
      id: 'ravengard',
      name: 'Ravengard',
      faction: 'Institute',
      x: 50,   // Left side of map
      y: 100,  // Upper portion
      w: 120,  // Reasonable size
      h: 80,   // Reasonable size
      influence: 60,
      description: 'Urban seat of the Institute of Lingua Arcanum.'
    },
    {
      id: 'whispering_woods',
      name: 'Whispering Woods',
      faction: 'Clans',
      x: 50,   // Left-center
      y: 300,  // Lower portion
      w: 150,  // Larger region
      h: 100,  // Larger region
      influence: 50,
      description: 'Old oral traditions and living glyph-song.'
    },
    {
      id: 'ancient_ruins',
      name: 'Ancient Ruins',
      faction: 'Echoborn',
      x: 350,  // Right side
      y: 150,  // Middle-right
      w: 120,  // Medium size
      h: 90,   // Medium size
      influence: 30,
      description: 'Forgotten places where glyphs first touched minds.'
    },
    {
      id: 'lake_eirysa',
      name: 'Lake Eirysa',
      faction: 'Neutral',
      x: 200,  // Center of map
      y: 200,  // Center vertically
      w: 100,  // Central lake
      h: 60,   // Central lake
      influence: 40,
      description: 'Central diplomatic meeting ground.'
    }
  ]
};

// Characters from world_data
export const valdarenCharacters = [
  {
    id: 'lyra_veyndral',
    name: 'Lyra Veyndral',
    role: 'Mnemonic Cartographer',
    faction: 'Ex-Institute, covert Clan ally',
    personality: 'Calculated, guarded, dry wit',
    conflict: 'Hides a sealed memory tied to the First Speaker',
    gameplayHooks: [
      'Introduces Memory Drift Zones',
      'Teaches Cartographer\'s Syntax',
      'Branch Outcomes: Loyalty → Defensive glyphs unlocked',
      'Betrayal → Aggressive, reality-altering phrases'
    ]
  },
  {
    id: 'kaelen_dravik',
    name: 'Kaelen Dravik',
    role: 'Institute Enforcer',
    faction: 'Institute of Lingua Arcanum',
    personality: 'Stern, disciplined, loyal to hierarchy',
    conflict: 'Torn between duty and personal debt to Lyra',
    gameplayHooks: [
      'Acts as rival in early chapters',
      'Can become ally if convinced of Institute corruption'
    ]
  },
  {
    id: 'serai_whispering_woods',
    name: 'Serai of the Whispering Woods',
    role: 'Clan Storykeeper',
    faction: 'Clans of the Whispering Woods',
    personality: 'Warm, enigmatic, speaks in layered metaphors',
    conflict: 'Protects oral purity of Ellidric against written codification',
    gameplayHooks: [
      'Offers oral-only glyph interpretations',
      'Unlocks "Living Glyph" mechanic'
    ]
  },
  {
    id: 'veyth_echoborn',
    name: 'Veyth the Echoborn',
    role: 'Glyph-born wanderer',
    faction: 'The Echoborn',
    personality: 'Alien, fragmented speech patterns',
    conflict: 'Unsure if they are human or pure Ellidric construct',
    gameplayHooks: [
      'Speaks only in Ellidric',
      'Dialogue changes based on player\'s language unlocks'
    ]
  }
];

// Notable locations from world_data
export const valdarenLocations = [
  'Ravengard – Institute capital',
  'Whispering Woods – Clan heartland', 
  'Snowveil Forest – Borderland forest',
  'Lumisth Glacier – Frozen Fringe',
  'Ancient Ruins – Cradle of Ellidric glyphs',
  'Lake Eirysa – Central landmark'
];

// Themes from world_data
export const valdarenThemes = [
  'Ethics of rewriting reality',
  'Identity built and broken by language', 
  'Power in perception and memory'
];