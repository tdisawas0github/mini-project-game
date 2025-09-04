// Utility to parse world_data markdown files and Valdaren game data
import type { Region } from '../types/game';

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

export const valdarenFactions = {
  institute: {
    name: 'Institute of Lingua Arcanum',
    description: 'Seekers of precision, control, and "healing" through language. They believe Ellidric can be codified and used to fix broken minds.',
    stronghold: 'Ravengard',
    philosophy: 'Language as science',
    color: '#3b82f6' // Blue
  },
  clans: {
    name: 'Clans of the Whispering Woods',
    description: 'Guardians of oral tradition who protect the pure, fluid nature of Ellidric. They fear what happens when the sacred becomes structured.',
    stronghold: 'Whispering Woods',
    philosophy: 'Language as living spirit',
    color: '#22c55e' // Green
  },
  echoborn: {
    name: 'The Echoborn',
    description: 'Mysterious entities claiming to be reborn from glyphs themselves. They understand Ellidric in ways that transcend human comprehension.',
    stronghold: 'Ancient Ruins',
    philosophy: 'Language as existence itself',
    color: '#a855f7' // Purple
  },
  neutral: {
    name: 'Neutral Territories',
    description: 'Regions that maintain independence or serve as meeting grounds between the major factions.',
    stronghold: 'Lake Eirysa',
    philosophy: 'Balance and diplomacy',
    color: '#6b7280' // Gray
  }
};

// Map data structure that matches the Valdaren faction_map.json format
export const valdarenMapData = {
  map_image: '/assets/map-of-valdaren.png',
  regions: [
    {
      id: 'ravengard',
      name: 'Ravengard',
      faction: 'Institute',
      x: 120,
      y: 80,
      w: 160,
      h: 120,
      influence: 60,
      description: 'Urban seat of the Institute of Lingua Arcanum.'
    },
    {
      id: 'whispering_woods',
      name: 'Whispering Woods',
      faction: 'Clans',
      x: 320,
      y: 220,
      w: 180,
      h: 140,
      influence: 50,
      description: 'Old oral traditions and living glyph-song.'
    },
    {
      id: 'ancient_ruins',
      name: 'Ancient Ruins',
      faction: 'Echoborn',
      x: 540,
      y: 120,
      w: 150,
      h: 130,
      influence: 30,
      description: 'Forgotten places where glyphs first touched minds.'
    },
    {
      id: 'snowveil_forest',
      name: 'Snowveil Forest',
      faction: 'Clans',
      x: 200,
      y: 350,
      w: 140,
      h: 100,
      influence: 35,
      description: 'Borderland forest of storytellers.'
    },
    {
      id: 'lumisth_glacier',
      name: 'Lumisth Glacier',
      faction: 'Echoborn',
      x: 450,
      y: 50,
      w: 120,
      h: 80,
      influence: 25,
      description: 'Frozen Fringe of first discoveries.'
    },
    {
      id: 'lake_eirysa',
      name: 'Lake Eirysa',
      faction: 'Neutral',
      x: 300,
      y: 150,
      w: 100,
      h: 80,
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