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
    motto: 'Order through Words',
    description: 'Seekers of precision, control, and "healing" through language. They believe Ellidric can be codified and used to fix broken minds.',
    stronghold: 'Ravengard',
    philosophy: 'Language as science - Ellidric should be catalogued, controlled, and used for the betterment of society through structured learning',
    color: '#3b82f6', // Blue
    territories: ['Ravengard', 'Institute Archives', 'Research Outposts'],
    traits: ['Methodical approach to Ellidric', 'Extensive written records', 'Structured hierarchy', 'Suspicious of uncontrolled usage'],
    leaders: ['Arch-Archivist Velran', 'Magistrate Korven', 'Chief Archivist Vex', 'Senior Researcher Thalia', 'Kaelen Dravik'],
    structure: 'Hierarchical, with Archivists, Enforcers, and Cartographers',
    gameplayImpact: {
      unlocks: ['Memory Engines', 'Written Glyph Libraries', 'Institutional Authority'],
      restrictions: ['Oral glyph interpretations limited', 'Nature-based magic reduced'],
      bonuses: ['Research speed +25%', 'Glyph analysis precision +30%']
    }
  },
  {
    id: 'clans',
    name: 'Clans of the Whispering Woods',
    motto: 'The Word Breathes',
    description: 'Guardians of oral tradition who protect the pure, fluid nature of Ellidric. They fear what happens when the sacred becomes structured.',
    stronghold: 'Whispering Woods',
    philosophy: 'Language as living spirit - Ellidric is alive and must remain free-flowing, passed through voice and breath rather than cold inscription',
    color: '#22c55e', // Green
    territories: ['Whispering Woods', 'Snowveil Forest', 'Sacred Groves'],
    traits: ['Oral traditions only', 'Deep connection to nature', 'Tribal council leadership', 'Distrustful of written Ellidric'],
    leaders: ['Elder Thane', 'Serai of the Whispering Woods', 'Moonwhisper Kira', 'Sage Branwen'],
    structure: 'Decentralized, led by Storykeepers',
    gameplayImpact: {
      unlocks: ['Living Glyph mechanic', 'Nature communion', 'Oral memory preservation'],
      restrictions: ['Written archives unavailable', 'Institutional resources blocked'],
      bonuses: ['Memory drift resistance +40%', 'Natural magic amplified +50%']
    }
  },
  {
    id: 'echoborn',
    name: 'The Echoborn',
    motto: 'We Are the Echo',
    description: 'Mysterious entities claiming to be reborn from glyphs themselves. They understand Ellidric in ways that transcend human comprehension.',
    stronghold: 'Ancient Ruins',
    philosophy: 'Language as existence itself - Ellidric is not merely communication but the fundamental force that shapes reality and consciousness',
    color: '#a855f7', // Purple
    territories: ['Ancient Ruins', 'Lumisth Glacier', 'Forgotten Sanctuaries'],
    traits: ['Speak only Pure Ellidric', 'Cryptic and enigmatic', 'Born from glyphs', 'Transcendent understanding'],
    leaders: ['The Echo Child', 'Veyth the Echoborn', 'Silence Speaker', 'Glyph-Heart Zara'],
    structure: 'Non-hierarchical; individuals wander alone',
    gameplayImpact: {
      unlocks: ['Pure Ellidric dialogue', 'Reality perception', 'Rare cosmic glyphs'],
      restrictions: ['Human social systems incompatible', 'Linear thinking limited'],
      bonuses: ['Dimensional insight +60%', 'Glyph creation mastery +100%']
    }
  },
  {
    id: 'neutral',
    name: 'Neutral Territories',
    motto: 'Balance in All Things',
    description: 'Regions that maintain independence or serve as meeting grounds between the major factions.',
    stronghold: 'Lake Eirysa',
    philosophy: 'Balance and diplomacy - Seek to understand all perspectives on Ellidric while maintaining neutrality in factional conflicts',
    color: '#6b7280', // Gray
    territories: ['Lake Eirysa', 'Crossroads Market', 'Diplomatic Halls'],
    traits: ['Political neutrality', 'Trade-focused', 'Diplomatic immunity', 'Multi-factional acceptance'],
    leaders: ['Merchant Prince Kael', 'Ambassador Elyn', 'Neutral Council'],
    structure: 'Council-based governance with rotating leadership',
    gameplayImpact: {
      unlocks: ['Diplomatic immunity', 'Cross-faction trade', 'Neutral meeting grounds'],
      restrictions: ['Cannot fully commit to any faction', 'Limited access to specialized resources'],
      bonuses: ['Faction reputation decay -50%', 'Trade prices reduced by 20%']
    }
  },
  // Minor factions from factions.md
  {
    id: 'polyglot_guild',
    name: 'The Polyglot Guild',
    motto: 'All Languages Hold Truth',
    description: 'Merchants and scholars who believe all languages hold fragments of truth. They serve as neutral translators and knowledge brokers.',
    stronghold: 'Crossroads Market',
    philosophy: 'All languages hold fragments of truth - diversity of expression leads to deeper understanding',
    color: '#f59e0b', // Amber
    territories: ['Trade routes', 'Academic exchanges', 'Language schools'],
    traits: ['Multi-lingual expertise', 'Commercial focus', 'Knowledge brokerage', 'Cultural preservation'],
    leaders: ['Sava the Polyglot', 'Guildmaster Theron', 'Archive Keeper Nyx'],
    structure: 'Guild-based with specialized roles',
    gameplayImpact: {
      unlocks: ['Translation keys', 'Language learning acceleration', 'Cultural insights'],
      restrictions: ['No military power', 'Profit-driven decisions'],
      bonuses: ['Language acquisition +75%', 'Cultural understanding +50%']
    }
  },
  {
    id: 'drift_wardens',
    name: 'Drift Wardens',
    motto: 'Guard the Boundaries',
    description: 'Specialized guardians who contain unstable Drift Zones and protect civilians from memory corruption.',
    stronghold: 'Warden Outposts throughout Valdaren',
    philosophy: 'Containment and protection - prevent memory corruption from spreading while studying safe ways to stabilize reality',
    color: '#dc2626', // Red
    territories: ['Drift Zone perimeters', 'Emergency response stations', 'Containment facilities'],
    traits: ['Drift zone expertise', 'Emergency response', 'Protective focus', 'Scientific approach'],
    leaders: ['Chief Warden Kestra', 'Captain Dain', 'Researcher Volta'],
    structure: 'Military-style hierarchy with specialized units',
    gameplayImpact: {
      unlocks: ['Drift zone navigation', 'Containment protocols', 'Emergency resources'],
      restrictions: ['Conservative approach', 'Risk-averse policies'],
      bonuses: ['Drift corruption resistance +80%', 'Emergency healing +100%']
    }
  },
  {
    id: 'silent_chorus',
    name: 'The Silent Chorus',
    motto: 'Music is the First Language',
    description: 'Mystic musicians who communicate only through glyph-song, believing music to be the purest form of Ellidric expression.',
    stronghold: 'Hidden resonance chambers',
    philosophy: 'Music as pure language - sound carries meaning beyond words, resonating directly with the soul',
    color: '#8b5cf6', // Violet
    territories: ['Acoustic sanctuaries', 'Hidden chambers', 'Natural amphitheaters'],
    traits: ['Musical communication', 'Harmonic magic', 'Silent wisdom', 'Emotional resonance'],
    leaders: ['The Silent Conductor', 'Echo-Singer Lira', 'Harmonic Master Caelum'],
    structure: 'Artistic collective with musical hierarchy',
    gameplayImpact: {
      unlocks: ['Musical glyph puzzles', 'Harmonic magic', 'Emotional manipulation'],
      restrictions: ['Verbal communication limited', 'Requires musical understanding'],
      bonuses: ['Emotional glyph power +90%', 'Memory clarity through music +70%']
    }
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

// Characters from world_data - Enhanced for Web Version 7 with deep lore integration
export const valdarenCharacters = [
  {
    id: 'lyra_veyndral',
    name: 'Lyra Veyndral',
    role: 'Mnemonic Cartographer',
    faction: 'Ex-Institute, covert Clan ally',
    personality: 'Calculated, guarded, dry wit',
    conflict: 'Hides a sealed memory tied to the First Speaker',
    speechPattern: 'Precise, technical language with hidden emotional depth',
    loyaltyRange: { min: -50, max: 100 },
    gameplayHooks: [
      'Introduces Memory Drift Zones',
      'Teaches Cartographer\'s Syntax',
      'Branch Outcomes: Loyalty → Defensive glyphs unlocked',
      'Betrayal → Aggressive, reality-altering phrases'
    ],
    sealedMemory: {
      title: 'The First Speaker\'s Last Words',
      description: 'A memory so dangerous it could unravel reality itself',
      unlockCondition: 'Max loyalty + specific glyph combination'
    },
    specialAbilities: ['Memory Navigation', 'Drift Zone Stabilization', 'Cartographer\'s Sight']
  },
  {
    id: 'kaelen_dravik',
    name: 'Kaelen Dravik',
    role: 'Institute Enforcer',
    faction: 'Institute of Lingua Arcanum',
    personality: 'Stern, disciplined, loyal to hierarchy',
    conflict: 'Torn between duty and personal debt to Lyra',
    speechPattern: 'Formal, authoritative, but shows cracks when discussing Lyra',
    loyaltyRange: { min: -75, max: 75 },
    gameplayHooks: [
      'Acts as rival in early chapters',
      'Can become ally if convinced of Institute corruption',
      'Provides Institute perspective on Memory Engines',
      'Romance option with deep character development'
    ],
    institutionalRank: 'Senior Enforcer',
    specialAbilities: ['Memory Engine Operation', 'Glyph Suppression', 'Institutional Authority']
  },
  {
    id: 'serai_whispering_woods',
    name: 'Serai of the Whispering Woods',
    role: 'Clan Storykeeper',
    faction: 'Clans of the Whispering Woods',
    personality: 'Warm, enigmatic, speaks in layered metaphors',
    conflict: 'Protects oral purity of Ellidric against written codification',
    speechPattern: 'Metaphorical, nature-based imagery, oral tradition style',
    loyaltyRange: { min: -25, max: 100 },
    gameplayHooks: [
      'Offers oral-only glyph interpretations',
      'Unlocks "Living Glyph" mechanic',
      'Teaches nature-based Ellidric dialects',
      'Provides alternative path to faction quests'
    ],
    oralTraditions: ['The Song of First Glyphs', 'Whispers of the Forest Heart', 'Tales of Memory Trees'],
    specialAbilities: ['Living Glyph Communion', 'Nature Speech', 'Oral Memory Preservation']
  },
  {
    id: 'veyth_echoborn',
    name: 'Veyth the Echoborn',
    role: 'Glyph-born wanderer',
    faction: 'The Echoborn',
    personality: 'Alien, fragmented speech patterns',
    conflict: 'Unsure if they are human or pure Ellidric construct',
    speechPattern: 'Pure Ellidric with reality-bending undertones',
    loyaltyRange: { min: 0, max: 100 }, // Cannot hate the player, only understand more
    gameplayHooks: [
      'Speaks only in Ellidric',
      'Dialogue changes based on player\'s language unlocks',
      'Provides glimpses into the true nature of reality',
      'Key to understanding the deepest mysteries'
    ],
    ellidricForm: 'Echo-vel-neth-mor', // Their name in pure Ellidric
    existentialQuestions: ['Am I the echo of a glyph, or is the glyph the echo of me?'],
    specialAbilities: ['Reality Perception', 'Glyph Embodiment', 'Echo Communication']
  },
  // Additional NPCs from characters.md archetypes
  {
    id: 'archivist_meren',
    name: 'Archivist Meren',
    role: 'Glyph Scholar',
    faction: 'Institute of Lingua Arcanum',
    personality: 'Scholarly, obsessive about details, nervous around authority',
    conflict: 'Knows more than they should about forbidden glyphs',
    speechPattern: 'Academic, peppered with citations and historical references',
    loyaltyRange: { min: -30, max: 80 },
    gameplayHooks: [
      'Provides lore dumps and puzzle hints',
      'Reveals hidden Institute archives',
      'Can be convinced to share forbidden knowledge'
    ],
    specialAbilities: ['Glyph Analysis', 'Historical Knowledge', 'Archive Access']
  },
  {
    id: 'old_man_thrynn',
    name: 'Old Man Thrynn',
    role: 'Drift Survivor',
    faction: 'Neutral - damaged by Memory Drift',
    personality: 'Paranoid, fragmented memories, occasionally lucid',
    conflict: 'Memories altered by unstable Drift exposure',
    speechPattern: 'Disjointed, switches between past and present tense',
    loyaltyRange: { min: -20, max: 60 },
    gameplayHooks: [
      'Gives side quests tied to altered memories',
      'Living example of Drift Zone dangers',
      'Holds keys to understanding memory corruption'
    ],
    driftExposure: 'High - reality perception permanently altered',
    specialAbilities: ['Memory Fragmentation Insight', 'Drift Sensitivity', 'Temporal Displacement']
  },
  {
    id: 'sava_polyglot',
    name: 'Sava the Polyglot',
    role: 'Language Merchant',
    faction: 'The Polyglot Guild',
    personality: 'Shrewd trader, speaks dozen of languages, values knowledge as currency',
    conflict: 'Caught between profit and preservation of linguistic diversity',
    speechPattern: 'Code-switches between languages mid-sentence',
    loyaltyRange: { min: -10, max: 90 },
    gameplayHooks: [
      'Sells rare translation keys',
      'Provides multi-language glyph interpretations',
      'Gateway to understanding faction linguistics'
    ],
    knownLanguages: ['Ellidric', 'English', 'Dutch', 'Latin', 'Greek', 'Ancient Valdaren', 'Trade Tongue'],
    specialAbilities: ['Language Synthesis', 'Cultural Translation', 'Linguistic Commerce']
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

// Enhanced Memory Drift System - Based on mechanics.md
export const memoryDriftSystem = {
  definition: 'A Memory Drift is a distortion in reality caused by unstable Ellidric glyphs',
  stabilityRange: { min: 0, max: 100 },
  corruptionLevels: {
    0: 'Stable - Reality coherent, Institute control',
    1: 'Minor fluctuations - Occasional memory slips',
    2: 'Moderate drift - Noticeable reality shifts',
    3: 'High instability - Surreal changes, Clan influence',
    4: 'Severe corruption - Reality becomes malleable',
    5: 'Critical failure - Complete reality breakdown'
  },
  mechanics: {
    stability: 'Higher stability → Institute gains control',
    instability: 'Lower stability → Clans gain influence',
    branchingImpact: 'Choices ripple into altered memories for NPCs and world'
  },
  driftZones: [
    {
      name: 'The Whispering Archive',
      location: 'Near Institute boundaries',
      stability: 75,
      description: 'Books that rewrite themselves based on reader expectations'
    },
    {
      name: 'Echo Valley',
      location: 'Ancient Ruins vicinity',
      stability: 30,
      description: 'Voices from the past bleed through temporal barriers'
    },
    {
      name: 'Memory Lake',
      location: 'Lake Eirysa depths',
      stability: 50,
      description: 'Reflections show alternate timeline versions of observers'
    },
    {
      name: 'The Forgotten Grove',
      location: 'Deep Whispering Woods',
      stability: 20,
      description: 'Trees that hold memories of those who died beneath them'
    }
  ]
};

// Language Unlock System - Enhanced from mechanics.md
export const languageUnlockSystem = {
  definition: 'Multiple real-world languages unlock different Ellidric interpretations',
  languages: {
    english: {
      effect: 'Baseline translation',
      description: 'Foundation understanding of Ellidric concepts',
      glyphUnlocks: ['Basic memory glyphs', 'Simple emotional resonance'],
      culturalAccess: 'Modern perspective on ancient language'
    },
    dutch: {
      effect: 'Reveals emotional subtext',
      description: 'Uncovers hidden feelings and interpersonal dynamics',
      glyphUnlocks: ['Emotion-binding glyphs', 'Relationship dynamics'],
      culturalAccess: 'Northern European folk traditions and emotional expression'
    },
    latin: {
      effect: 'Unlocks ritual glyphs',
      description: 'Access to ceremonial and binding language structures',
      glyphUnlocks: ['Sacred binding glyphs', 'Institutional authority'],
      culturalAccess: 'Classical scholarly tradition and institutional power'
    },
    greek: {
      effect: 'Reveals philosophical/ethical layers',
      description: 'Deep understanding of moral implications and abstract concepts',
      glyphUnlocks: ['Ethical resonance glyphs', 'Philosophical constructs'],
      culturalAccess: 'Ancient wisdom and ethical reasoning systems'
    }
  },
  mechanics: {
    unlockMethod: 'Language study through NPCs, books, or immersion',
    synthesis: 'Certain puzzles require multi-language understanding',
    progression: 'Each language opens new dialogue trees and quest paths'
  }
};

// Consequence Tracker System - From mechanics.md
export const consequenceTracker = {
  definition: 'Persistent system recording all memory alterations and ripple effects',
  trackedData: {
    npcLoyalty: 'Range from -100 to +100 for each character',
    worldStateFlags: 'Boolean flags for major world changes',
    glyphCorruption: 'Scale from 0-5 measuring reality instability',
    factionReputation: 'Standing with each major faction',
    memoryAlterations: 'Record of all timeline changes made'
  },
  usage: {
    dialogueTrees: 'Past choices affect available responses',
    questAvailability: 'Some quests locked/unlocked by reputation',
    endingConditions: 'Multiple endings based on accumulated choices',
    npcBehavior: 'Characters remember and react to player history'
  }
};

// Glyph Puzzle System - Based on mechanics.md
export const glyphPuzzleSystem = {
  definition: 'Interactive mini-games where players arrange glyphs to form valid Ellidric phrases',
  puzzleTypes: {
    syntaxChains: {
      description: 'Arrange glyphs in correct grammatical order',
      difficulty: 'Novice to Expert',
      mechanics: 'Drag-and-drop with feedback on correctness'
    },
    emotionBinding: {
      description: 'Match glyphs to their emotional resonance',
      difficulty: 'Intermediate',
      mechanics: 'Color-coding and intuitive feeling-based matching'
    },
    memoryKeys: {
      description: 'Combine glyphs to unlock sealed memories',
      difficulty: 'Expert to Master',
      mechanics: 'Complex combinations requiring multi-language knowledge'
    }
  },
  variables: {
    glyphInventory: 'Collection of discovered glyphs',
    puzzleDifficulty: 'Scales from 1-5 based on story progress',
    timeLimit: 'Optional pressure for advanced challenges'
  }
};

// Faction Influence Meter - Enhanced system
export const factionInfluenceSystem = {
  definition: 'Tracks player standing with all factions',
  reputationRange: { min: -100, max: 100 },
  thresholds: {
    ally: 75, // Strong positive relationship
    friend: 50, // Positive relationship
    neutral: 0, // No strong opinion
    suspicious: -25, // Negative opinion
    enemy: -50, // Hostile relationship
    nemesis: -75 // Active opposition
  },
  effects: {
    dialogue: 'Tone and available options change based on reputation',
    quests: 'Faction-specific content locked/unlocked',
    endings: 'Different conclusions based on strongest alliance',
    resources: 'Access to faction-specific items and knowledge'
  },
  conflictRules: {
    instituteVsClans: 'High rep with one reduces rep with other',
    neutralVsAll: 'Neutral faction relationships easier to maintain',
    echoborn: 'Reputation based on understanding rather than loyalty'
  }
};

// Branching Narrative Framework - Complete structure
export const narrativeFramework = {
  structure: {
    act1: {
      title: 'Awakening',
      description: 'Introduction, first Drift Zone, language tutorial',
      keyEvents: ['Player awakens without memory', 'First glyph encounter', 'Meet Lyra'],
      unlocks: ['Basic Ellidric', 'Memory probe ability', 'Faction awareness']
    },
    act2: {
      title: 'Allegiances',
      description: 'Faction alignment choices, mid-tier puzzles',
      keyEvents: ['Choose faction path', 'First major memory alteration', 'Meet faction leaders'],
      unlocks: ['Faction-specific abilities', 'Advanced glyphs', 'Drift zone access']
    },
    act3: {
      title: 'Convergence',
      description: 'High-impact memory alterations, world divergence',
      keyEvents: ['Major reality shifts', 'Faction conflicts escalate', 'Truth about First Speaker'],
      unlocks: ['Master-level abilities', 'Reality manipulation', 'Ancient secrets']
    },
    act4: {
      title: 'Resolution',
      description: 'Conclusion based on Consequence Tracker + Faction Influence',
      keyEvents: ['Final confrontation', 'World fate decided', 'Personal identity resolved'],
      unlocks: ['Ending variants', 'New Game Plus', 'Complete lore understanding']
    }
  },
  branchTypes: {
    factionLocked: 'Routes exclusive to specific faction allegiances',
    languageLocked: 'Paths requiring specific linguistic knowledge',
    memoryOutcome: 'Branches based on reality alteration choices',
    relationshipLocked: 'Routes dependent on character relationships'
  }
};

// Optional Advanced Systems
export const advancedSystems = {
  glyphCrafting: {
    description: 'Combine fragments to create new glyphs',
    mechanics: 'Collect fragments from Drift Zones, experiment with combinations',
    unlocks: 'Unique player-created magical effects'
  },
  dreamArchives: {
    description: 'Replay altered memories to spot inconsistencies',
    mechanics: 'Detective-style analysis of timeline discrepancies',
    unlocks: 'Hidden lore and secret faction information'
  },
  polyglotChallenges: {
    description: 'Timed translation puzzles for rare rewards',
    mechanics: 'Speed-based language synthesis under pressure',
    unlocks: 'Unique linguistic achievements and rare glyphs'
  }
};