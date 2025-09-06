// Quest system types for Web Version 5

export type QuestType = 'main' | 'faction' | 'side' | 'exploration' | 'language' | 'memory';
export type QuestStatus = 'available' | 'active' | 'completed' | 'failed' | 'locked';
export type ObjectiveType = 'story' | 'learn' | 'meet' | 'explore' | 'puzzle' | 'collect' | 'choice' | 'investigate' | 'combat' | 'social' | 'create' | 'ritual' | 'communicate' | 'meditation' | 'prove' | 'timed_puzzle' | 'synthesis' | 'mastery';

export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
  type: ObjectiveType;
  target?: number; // For collection objectives
  current?: number; // Current progress for collection objectives
}

export interface QuestRewards {
  experience: number;
  glyphs?: string[];
  factionRep?: Record<string, number>;
  items?: string[];
  unlocks?: string[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  status: QuestStatus;
  objectives: QuestObjective[];
  prerequisites: string[]; // Quest IDs that must be completed first
  rewards: QuestRewards;
  location: string;
  questGiver: string;
  isRepeatable: boolean;
  
  // Optional fields for specific quest types
  act?: number; // For main story quests (1-4)
  faction?: string; // For faction-specific quests
  timeLimit?: number; // For timed quests (in minutes)
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
}

export interface Character {
  id: string;
  name: string;
  title: string;
  faction: string;
  location: string;
  description: string;
  relationshipLevel: number; // -100 to +100
  availableQuests: string[];
  
  personality: {
    traits: string[];
    loyaltyPath: string; // What happens if player gains their trust
    betrayalPath: string; // What happens if player betrays them
  };
  
  // Dialogue and interaction data
  greetings?: string[];
  farewells?: string[];
  questIntros?: Record<string, string>; // Quest ID -> intro dialogue
  
  // Character progression
  trustMilestones?: number[]; // Relationship levels that unlock new content
  giftPreferences?: string[]; // Items this character likes
  memoryConnections?: string[]; // Memory fragments connected to this character
}

export interface Location {
  id: string;
  name: string;
  region: string;
  description: string;
  faction: string;
  subLocations: string[];
  availableQuests: string[];
  memoryDriftZones: string[];
  unlockRequirements: string[];
  
  // Environmental data
  atmosphere?: 'peaceful' | 'tense' | 'mysterious' | 'dangerous' | 'neutral';
  musicTheme?: string;
  visualStyle?: string;
  
  // Gameplay features
  shopkeeper?: string; // Character ID of local merchant
  services?: ('rest' | 'shop' | 'library' | 'training' | 'crafting')[];
  fastTravelUnlocked?: boolean;
}

export interface MemoryDriftZone {
  id: string;
  name: string;
  location: string;
  description: string;
  stability: number; // 0-100, affects puzzle difficulty
  corruptionLevel: number; // 0-5, affects rewards and risks
  
  // Gameplay mechanics
  requiredGlyphs: string[];
  puzzleType: 'stabilization' | 'exploration' | 'restoration' | 'corruption';
  rewards: {
    memoryFragments: string[];
    glyphs?: string[];
    experience: number;
    lore?: string[];
  };
  
  // Story connections
  relatedCharacters: string[];
  plotRelevance: 'main' | 'side' | 'lore' | 'character' | 'faction';
  affectedByChoices: string[]; // Quest/choice IDs that affect this zone
}

export interface EllidricDialect {
  id: string;
  name: string;
  description: string;
  faction: string;
  unlockRequirements: string[];
  
  // Gameplay features
  uniqueGlyphs: string[];
  puzzleTypes: string[];
  communicationBonuses: string[]; // Character IDs this dialect helps with
  
  // Learning progression
  masteryLevels: {
    novice: { requirements: string[], unlocks: string[] };
    adept: { requirements: string[], unlocks: string[] };
    master: { requirements: string[], unlocks: string[] };
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'story' | 'language' | 'exploration' | 'social' | 'mastery' | 'secret';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  progress?: {
    current: number;
    target: number;
    description: string;
  };
  
  // Unlock conditions
  requirements: {
    questsCompleted?: string[];
    glyphsLearned?: string[];
    relationshipLevels?: Record<string, number>;
    choicesMade?: string[];
    locationsVisited?: string[];
    faceProp?: Record<string, number>;
  };
  
  // Rewards
  rewards: {
    experience?: number;
    title?: string;
    unlocks?: string[];
    cosmeticRewards?: string[];
  };
}

export interface GameplayStatistics {
  // Quest progress
  questsCompleted: number;
  questsAvailable: number;
  questsActive: number;
  
  // Learning progress
  glyphsLearned: number;
  languagesLearned: number;
  dialectsMastered: number;
  
  // Social progress
  charactersKnown: number;
  maxRelationshipLevel: number;
  averageRelationshipLevel: number;
  
  // Exploration progress
  locationsDiscovered: number;
  memoryDriftZonesCleared: number;
  secretsFound: number;
  
  // Combat/challenge progress
  puzzlesSolved: number;
  timesChallenged: number;
  perfectSolutions: number;
  
  // Choices and consequences
  majorChoicesMade: number;
  currentWorldState: string;
  karmaAlignment: 'Order' | 'Chaos' | 'Balance';
}

// Extended game state for Version 5
export interface ExtendedGameState {
  // Core game state (inherited from v4)
  playerName: string;
  currentLanguage: string | null;
  knownLanguages: string[];
  currentScene: string;
  factionInfluence: Record<string, number>;
  unlockedGlyphs: string[];
  consequenceMap: Record<string, string[]>;
  memoryFragments: string[];
  
  // New quest system
  activeQuests: string[];
  completedQuests: string[];
  failedQuests: string[];
  questProgress: Record<string, QuestObjective[]>;
  
  // Character relationships
  characterRelationships: Record<string, number>;
  characterTrustLevels: Record<string, number>;
  characterBetrayal: string[]; // Characters the player has betrayed
  
  // Location and exploration
  unlockedLocations: string[];
  visitedLocations: string[];
  currentLocation: string;
  discoveredSecrets: string[];
  
  // Advanced language system
  dialectMastery: Record<string, 'novice' | 'adept' | 'master'>;
  languageCombinations: string[]; // Unlocked multi-language techniques
  
  // Memory system
  alteredMemories: string[];
  memoryDriftProgress: Record<string, number>;
  glyphCorruption: number; // 0-100, affects game difficulty
  
  // Achievements and progression
  unlockedAchievements: string[];
  statistics: GameplayStatistics;
  playthrough: number; // For New Game Plus features
  
  // World state
  worldEvents: string[]; // Major events that have occurred
  factionWar: boolean; // Whether the factions are at war
  realityStability: number; // 0-100, affects ending paths
  
  // Player choices tracking
  majorChoices: Record<string, string>;
  moralAlignment: number; // -100 to +100
  karmaActions: string[];
}