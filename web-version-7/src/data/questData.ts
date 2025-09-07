import type { Quest, Character, Location } from '../types/quest';

// Main story quests following the 4-act structure from mechanics.md
export const mainQuests: Quest[] = [
  // Act 1: Introduction, first Drift Zone, language tutorial
  {
    id: 'prologue_awakening',
    title: 'The Awakening',
    description: 'Discover your identity as a mnemonic cartographer in the world of Valdaren.',
    type: 'main',
    act: 1,
    status: 'available',
    objectives: [
      {
        id: 'set_name',
        description: 'Choose your identity',
        completed: false,
        type: 'story'
      },
      {
        id: 'first_glyph',
        description: 'Learn your first Ellidric glyph',
        completed: false,
        type: 'learn'
      },
      {
        id: 'meet_lyra',
        description: 'Encounter Lyra Veyndral, the mnemonic cartographer',
        completed: false,
        type: 'meet'
      }
    ],
    prerequisites: [],
    rewards: {
      experience: 100,
      glyphs: ['memory_probe'],
      unlocks: ['hub_access']
    },
    location: 'Memory Drift - Tutorial Zone',
    questGiver: 'System',
    isRepeatable: false
  },
  {
    id: 'first_drift_zone',
    title: 'Into the Drift',
    description: 'Navigate your first Memory Drift Zone and learn the fundamentals of Ellidric manipulation.',
    type: 'main',
    act: 1,
    status: 'locked',
    objectives: [
      {
        id: 'enter_drift',
        description: 'Enter the unstable Memory Drift Zone',
        completed: false,
        type: 'explore'
      },
      {
        id: 'stabilize_drift',
        description: 'Use Ellidric glyphs to stabilize the drift',
        completed: false,
        type: 'puzzle'
      },
      {
        id: 'extract_memory',
        description: 'Extract a memory fragment from the stabilized zone',
        completed: false,
        type: 'collect'
      }
    ],
    prerequisites: ['prologue_awakening'],
    rewards: {
      experience: 150,
      glyphs: ['childhood_song'],
      unlocks: ['language_study', 'faction_overview']
    },
    location: 'Whispering Woods - Northern Edge',
    questGiver: 'Lyra Veyndral',
    isRepeatable: false
  },

  // Act 2: Faction alignment choices, mid-tier puzzles
  {
    id: 'faction_allegiance',
    title: 'Choosing Sides',
    description: 'Align yourself with one of the major factions controlling Valdaren.',
    type: 'main',
    act: 2,
    status: 'locked',
    objectives: [
      {
        id: 'visit_institute',
        description: 'Visit the Institute of Lingua Arcanum in Ravengard',
        completed: false,
        type: 'explore'
      },
      {
        id: 'meet_clans',
        description: 'Seek audience with the Clans in Whispering Woods',
        completed: false,
        type: 'explore'
      },
      {
        id: 'encounter_echoborn',
        description: 'Find and communicate with the mysterious Echoborn',
        completed: false,
        type: 'meet'
      },
      {
        id: 'make_choice',
        description: 'Declare your allegiance or remain neutral',
        completed: false,
        type: 'choice'
      }
    ],
    prerequisites: ['first_drift_zone'],
    rewards: {
      experience: 200,
      glyphs: ['ritual_binding'],
      unlocks: ['faction_missions', 'advanced_glyphs']
    },
    location: 'Multiple Locations',
    questGiver: 'Political Circumstances',
    isRepeatable: false
  },

  // Act 3: High-impact memory alterations, world divergence
  {
    id: 'memory_corruption',
    title: 'The Corrupted Archive',
    description: 'Investigate widespread memory corruption threatening the stability of Valdaren.',
    type: 'main',
    act: 3,
    status: 'locked',
    objectives: [
      {
        id: 'investigate_anomalies',
        description: 'Research the source of memory anomalies',
        completed: false,
        type: 'investigate'
      },
      {
        id: 'access_first_speaker',
        description: 'Uncover the sealed memory of the First Speaker',
        completed: false,
        type: 'puzzle'
      },
      {
        id: 'confront_corruption',
        description: 'Face the entity causing the memory corruption',
        completed: false,
        type: 'combat'
      }
    ],
    prerequisites: ['faction_allegiance'],
    rewards: {
      experience: 300,
      glyphs: ['truth_reveal', 'ancient_sorrow'],
      unlocks: ['endgame_paths']
    },
    location: 'Ancient Ruins - Core Chamber',
    questGiver: 'Lyra Veyndral',
    isRepeatable: false
  },

  // Act 4: Resolution based on Consequence Tracker + Faction Influence
  {
    id: 'final_convergence',
    title: 'The Final Convergence',
    description: 'Unite or divide the factions as reality itself hangs in the balance.',
    type: 'main',
    act: 4,
    status: 'locked',
    objectives: [
      {
        id: 'gather_allies',
        description: 'Rally your faction allies for the final confrontation',
        completed: false,
        type: 'social'
      },
      {
        id: 'master_pure_ellidric',
        description: 'Achieve mastery of Pure Ellidric language',
        completed: false,
        type: 'learn'
      },
      {
        id: 'reshape_reality',
        description: 'Use your power to determine the fate of Valdaren',
        completed: false,
        type: 'choice'
      }
    ],
    prerequisites: ['memory_corruption'],
    rewards: {
      experience: 500,
      glyphs: ['memory_weave'],
      unlocks: ['new_game_plus']
    },
    location: 'Lake Eirysa - Convergence Point',
    questGiver: 'Destiny',
    isRepeatable: false
  }
];

// Faction-specific quests
export const factionQuests: Quest[] = [
  // Institute of Lingua Arcanum Quests
  {
    id: 'institute_initiation',
    title: 'The Scholar\'s Path',
    description: 'Prove your worth to the Institute through academic excellence.',
    type: 'faction',
    faction: 'institute',
    status: 'locked',
    objectives: [
      {
        id: 'pass_examination',
        description: 'Complete the Institute\'s knowledge examination',
        completed: false,
        type: 'puzzle'
      },
      {
        id: 'catalog_glyphs',
        description: 'Catalog 10 Ellidric glyphs for the archives',
        completed: false,
        type: 'collect',
        target: 10,
        current: 0
      },
      {
        id: 'submit_thesis',
        description: 'Write a thesis on Ellidric stability',
        completed: false,
        type: 'create'
      }
    ],
    prerequisites: ['faction_allegiance'],
    rewards: {
      experience: 150,
      glyphs: ['codex_primer'],
      factionRep: { institute: 25 },
      unlocks: ['institute_advanced_training']
    },
    location: 'Ravengard - Institute Halls',
    questGiver: 'Arch-Archivist Velran',
    isRepeatable: false
  },

  // Clans of the Whispering Woods Quests
  {
    id: 'clan_initiation',
    title: 'The Living Word',
    description: 'Learn the oral traditions of the Clans and prove you understand Ellidric\'s living nature.',
    type: 'faction',
    faction: 'clans',
    status: 'locked',
    objectives: [
      {
        id: 'learn_oral_tradition',
        description: 'Listen to and memorize clan stories',
        completed: false,
        type: 'learn'
      },
      {
        id: 'commune_with_forest',
        description: 'Perform the ritual of forest communion',
        completed: false,
        type: 'ritual'
      },
      {
        id: 'speak_with_trees',
        description: 'Successfully communicate using Living Glyphs',
        completed: false,
        type: 'communicate'
      }
    ],
    prerequisites: ['faction_allegiance'],
    rewards: {
      experience: 150,
      glyphs: ['verdant_whisper'],
      factionRep: { clans: 25 },
      unlocks: ['living_glyph_system']
    },
    location: 'Whispering Woods - Sacred Grove',
    questGiver: 'Serai of the Whispering Woods',
    isRepeatable: false
  },

  // Echoborn Quests
  {
    id: 'echoborn_trial',
    title: 'The Echo\'s Calling',
    description: 'Undergo the mysterious trial of the Echoborn to understand their nature.',
    type: 'faction',
    faction: 'echoborn',
    status: 'locked',
    objectives: [
      {
        id: 'understand_veyth',
        description: 'Learn to communicate with Veyth in pure Ellidric',
        completed: false,
        type: 'communicate'
      },
      {
        id: 'echo_meditation',
        description: 'Complete the Echo Meditation ritual',
        completed: false,
        type: 'meditation'
      },
      {
        id: 'prove_understanding',
        description: 'Demonstrate comprehension of glyph-consciousness',
        completed: false,
        type: 'prove'
      }
    ],
    prerequisites: ['faction_allegiance'],
    rewards: {
      experience: 150,
      glyphs: ['echo_resonance'],
      factionRep: { echoborn: 25 },
      unlocks: ['echoborn_mysteries']
    },
    location: 'Ancient Ruins - Echo Chamber',
    questGiver: 'Veyth the Echoborn',
    isRepeatable: false
  }
];

// Side quests from various NPCs
export const sideQuests: Quest[] = [
  {
    id: 'drift_survivor_tale',
    title: 'Fragments of the Past',
    description: 'Help Old Man Thrynn recover his scattered memories.',
    type: 'side',
    status: 'available',
    objectives: [
      {
        id: 'collect_fragments',
        description: 'Gather Thrynn\'s scattered memory fragments',
        completed: false,
        type: 'collect',
        target: 5,
        current: 0
      },
      {
        id: 'piece_together',
        description: 'Arrange the fragments to restore the memory',
        completed: false,
        type: 'puzzle'
      },
      {
        id: 'witness_truth',
        description: 'Experience Thrynn\'s recovered memory',
        completed: false,
        type: 'story'
      }
    ],
    prerequisites: [],
    rewards: {
      experience: 75,
      glyphs: ['memory_fragment'],
      unlocks: ['thrynn_advanced_quests']
    },
    location: 'Snowveil Forest - Hermit\'s Cabin',
    questGiver: 'Old Man Thrynn',
    isRepeatable: false
  },
  {
    id: 'polyglot_challenge',
    title: 'The Translator\'s Test',
    description: 'Prove your linguistic prowess to Sava the Polyglot.',
    type: 'side',
    status: 'locked',
    objectives: [
      {
        id: 'timed_translation',
        description: 'Complete translation puzzles under time pressure',
        completed: false,
        type: 'timed_puzzle'
      },
      {
        id: 'multi_language_synthesis',
        description: 'Combine multiple languages to solve complex riddles',
        completed: false,
        type: 'synthesis'
      },
      {
        id: 'rare_dialect_mastery',
        description: 'Demonstrate mastery of rare Ellidric dialects',
        completed: false,
        type: 'mastery'
      }
    ],
    prerequisites: ['language_study_advanced'],
    rewards: {
      experience: 100,
      glyphs: ['polyglot_mastery'],
      items: ['translation_keys'],
      unlocks: ['merchant_advanced_wares']
    },
    location: 'Lake Eirysa - Trading Post',
    questGiver: 'Sava the Polyglot',
    isRepeatable: true
  }
];

// All NPCs that can give quests
export const questGivers: Character[] = [
  {
    id: 'lyra_veyndral',
    name: 'Lyra Veyndral',
    title: 'Mnemonic Cartographer',
    faction: 'neutral',
    location: 'Whispering Woods',
    description: 'Ex-Institute cartographer with hidden knowledge of the First Speaker.',
    relationshipLevel: 0,
    availableQuests: ['first_drift_zone', 'memory_corruption'],
    personality: {
      traits: ['Calculated', 'Guarded', 'Witty'],
      loyaltyPath: 'Provides defensive glyphs and protection',
      betrayalPath: 'Teaches aggressive reality-altering techniques'
    }
  },
  {
    id: 'arch_archivist_velran',
    name: 'Arch-Archivist Velran',
    title: 'Leader of the Institute',
    faction: 'institute',
    location: 'Ravengard',
    description: 'Supreme authority of the Institute of Lingua Arcanum.',
    relationshipLevel: 0,
    availableQuests: ['institute_initiation', 'catalog_ancient_texts'],
    personality: {
      traits: ['Authoritative', 'Academic', 'Traditional'],
      loyaltyPath: 'Grants access to forbidden archives',
      betrayalPath: 'Becomes primary antagonist in Institute route'
    }
  },
  {
    id: 'serai',
    name: 'Serai of the Whispering Woods',
    title: 'Clan Storykeeper',
    faction: 'clans',
    location: 'Whispering Woods',
    description: 'Keeper of oral traditions and living Ellidric wisdom.',
    relationshipLevel: 0,
    availableQuests: ['clan_initiation', 'forest_communion'],
    personality: {
      traits: ['Warm', 'Enigmatic', 'Wise'],
      loyaltyPath: 'Unlocks Living Glyph mastery',
      betrayalPath: 'Forest becomes hostile, blocks clan advancement'
    }
  },
  {
    id: 'veyth',
    name: 'Veyth the Echoborn',
    title: 'Glyph-born Wanderer',
    faction: 'echoborn',
    location: 'Ancient Ruins',
    description: 'Mysterious entity claiming to be reborn from glyphs themselves.',
    relationshipLevel: 0,
    availableQuests: ['echoborn_trial', 'echo_mysteries'],
    personality: {
      traits: ['Alien', 'Fragmented', 'Profound'],
      loyaltyPath: 'Reveals secrets of glyph consciousness',
      betrayalPath: 'Becomes incomprehensible, refuses further communication'
    }
  }
];

// All explorable locations in Valdaren
export const locations: Location[] = [
  {
    id: 'ravengard',
    name: 'Ravengard',
    region: 'Institute Territory',
    description: 'Urban seat of the Institute of Lingua Arcanum. Sterile halls of learning tower over organized districts.',
    faction: 'institute',
    subLocations: [
      'Institute Archives',
      'Grand Library',
      'Research Laboratories',
      'Administrative Quarters',
      'Student Dormitories'
    ],
    availableQuests: ['institute_initiation', 'catalog_ancient_texts'],
    memoryDriftZones: ['Academic Pressure Drift', 'Forbidden Knowledge Drift'],
    unlockRequirements: []
  },
  {
    id: 'whispering_woods',
    name: 'Whispering Woods',
    region: 'Clan Territory',
    description: 'Ancient forests where oral traditions keep Ellidric alive and wild. Trees seem to whisper forgotten words.',
    faction: 'clans',
    subLocations: [
      'Sacred Grove',
      'Storyteller\'s Circle',
      'Ancient Oak Parliament',
      'Memory Springs',
      'Hidden Pathways'
    ],
    availableQuests: ['clan_initiation', 'forest_communion', 'first_drift_zone'],
    memoryDriftZones: ['Childhood Memory Drift', 'Forest Wisdom Drift'],
    unlockRequirements: []
  },
  {
    id: 'ancient_ruins',
    name: 'Ancient Ruins',
    region: 'Echoborn Territory',
    description: 'Mysterious stone structures predating recorded history. The birthplace of Ellidric glyphs.',
    faction: 'echoborn',
    subLocations: [
      'Echo Chamber',
      'Glyph Observatory',
      'Forgotten Sanctum',
      'Crystal Gardens',
      'The Silent Library'
    ],
    availableQuests: ['echoborn_trial', 'echo_mysteries', 'memory_corruption'],
    memoryDriftZones: ['First Speaker Drift', 'Origin Language Drift'],
    unlockRequirements: []
  },
  {
    id: 'snowveil_forest',
    name: 'Snowveil Forest',
    region: 'Borderland',
    description: 'Frost-covered woodland at the edge of clan territory. Home to hermits and outcasts.',
    faction: 'neutral',
    subLocations: [
      'Hermit\'s Cabin',
      'Frozen Creek',
      'Old Watchtower',
      'Abandoned Settlement',
      'Ice Crystal Cave'
    ],
    availableQuests: ['drift_survivor_tale', 'hermit_wisdom'],
    memoryDriftZones: ['Isolation Drift', 'Winter Memories Drift'],
    unlockRequirements: []
  },
  {
    id: 'lumisth_glacier',
    name: 'Lumisth Glacier',
    region: 'Frozen Fringe',
    description: 'Perpetually frozen wasteland at the world\'s edge. Said to preserve the oldest memories.',
    faction: 'neutral',
    subLocations: [
      'Ice Caverns',
      'Frozen Spire',
      'Memory Ice Fields',
      'The Last Observatory',
      'Twilight Refuge'
    ],
    availableQuests: ['glacier_mysteries', 'frozen_memories'],
    memoryDriftZones: ['Ancient Memory Drift', 'Preservation Drift'],
    unlockRequirements: ['advanced_exploration']
  },
  {
    id: 'lake_eirysa',
    name: 'Lake Eirysa',
    region: 'Neutral Zone',
    description: 'Central lake serving as neutral ground for diplomatic meetings between factions.',
    faction: 'neutral',
    subLocations: [
      'Diplomatic Harbor',
      'Trading Post',
      'Neutral Council Hall',
      'Meditation Pier',
      'Unity Bridge'
    ],
    availableQuests: ['polyglot_challenge', 'diplomatic_mission', 'final_convergence'],
    memoryDriftZones: ['Diplomatic Memory Drift', 'Unity Drift'],
    unlockRequirements: []
  }
];