import { useState, useCallback, useEffect } from 'react';
import { GlobalStyle, GameContainer, NovelInterface } from './styles/visualNovel';
import { useGameState } from './hooks/useGameState';
import DialogueComponent from './components/DialogueComponent';
import HubNavigation from './components/HubNavigation';
import WorldMap from './components/WorldMap';
import Lexicon from './components/Lexicon';
import MemoryDiveComponent from './components/MemoryDiveComponent';
import FactionOverview from './components/FactionOverview';
import LanguageStudy from './components/LanguageStudy';
import CharacterRelationships from './components/CharacterRelationships';
import AchievementSystem from './components/AchievementSystem';
import SaveLoadSystem from './components/SaveLoadSystem';
import GameSystemsTest from './components/GameSystemsTest';
import GlyphResonance from './components/GlyphResonance';
// New Web Version 5 components
import { QuestSystem } from './components/QuestSystem';
import { MemoryDriftSystem } from './components/MemoryDriftSystem';
import { AdvancedLanguageSystem } from './components/AdvancedLanguageSystem';
import { prologueDialogue, hubDialogue, chapter1Dialogue, chapter2Dialogue, memoryDiveDialogue } from './data/dialogue';
import type { DialogueNode, Choice } from './types/game';
import type { ExtendedGameState } from './types/quest';

const App: React.FC = () => {
  const { gameState, processChoice } = useGameState();
  const [currentDialogue, setCurrentDialogue] = useState<DialogueNode | null>(null);
  const [gameMode, setGameMode] = useState<'dialogue' | 'hub' | 'world_map' | 'lexicon' | 'memory_dive' | 'faction_overview' | 'language_study' | 'character_relationships' | 'achievements' | 'save_load' | 'systems_test' | 'glyph_resonance' | 'quest_system' | 'memory_drift' | 'advanced_language' | 'special'>('dialogue');
  
  // Extended game state for Web Version 5 features
  const [extendedGameState, setExtendedGameState] = useState<ExtendedGameState>({
    // Core game state (from v4)
    playerName: gameState.playerName,
    currentLanguage: gameState.currentLanguage?.toString() || null,
    knownLanguages: gameState.knownLanguages.map(l => l.toString()),
    currentScene: gameState.currentScene,
    factionInfluence: {
      institute: gameState.factionInfluence.institute,
      clans: gameState.factionInfluence.clans,
      echoborn: gameState.factionInfluence.echoborn,
      neutral: 0
    },
    unlockedGlyphs: gameState.unlockedGlyphs.map(g => g.id),
    consequenceMap: gameState.consequenceMap,
    memoryFragments: gameState.memoryFragments.map(m => m.id),
    
    // New quest system
    activeQuests: [],
    completedQuests: [],
    failedQuests: [],
    questProgress: {},
    
    // Character relationships
    characterRelationships: {},
    characterTrustLevels: {},
    characterBetrayal: [],
    
    // Location and exploration
    unlockedLocations: ['whispering_woods', 'ravengard', 'lake_eirysa'],
    visitedLocations: ['whispering_woods'],
    currentLocation: 'whispering_woods',
    discoveredSecrets: [],
    
    // Advanced language system
    dialectMastery: {},
    languageCombinations: [],
    
    // Memory system
    alteredMemories: [],
    memoryDriftProgress: {},
    glyphCorruption: 0,
    
    // Achievements and progression
    unlockedAchievements: [],
    statistics: {
      questsCompleted: 0,
      questsAvailable: 0,
      questsActive: 0,
      glyphsLearned: gameState.unlockedGlyphs.length,
      languagesLearned: gameState.knownLanguages.length,
      dialectsMastered: 0,
      charactersKnown: 0,
      maxRelationshipLevel: 0,
      averageRelationshipLevel: 0,
      locationsDiscovered: 3,
      memoryDriftZonesCleared: 0,
      secretsFound: 0,
      puzzlesSolved: 0,
      timesChallenged: 0,
      perfectSolutions: 0,
      majorChoicesMade: 0,
      currentWorldState: 'beginning',
      karmaAlignment: 'Balance' as const
    },
    playthrough: 1,
    
    // World state
    worldEvents: [],
    factionWar: false,
    realityStability: 75,
    
    // Player choices tracking
    majorChoices: {},
    moralAlignment: 0,
    karmaActions: []
  });

  // Sync extended state with basic game state
  useEffect(() => {
    setExtendedGameState(prev => ({
      ...prev,
      playerName: gameState.playerName,
      currentLanguage: gameState.currentLanguage?.toString() || null,
      knownLanguages: gameState.knownLanguages.map(l => l.toString()),
      currentScene: gameState.currentScene,
      factionInfluence: {
        institute: gameState.factionInfluence.institute,
        clans: gameState.factionInfluence.clans,
        echoborn: gameState.factionInfluence.echoborn,
        neutral: 0
      },
      unlockedGlyphs: gameState.unlockedGlyphs.map(g => g.id),
      consequenceMap: gameState.consequenceMap,
      memoryFragments: gameState.memoryFragments.map(m => m.id),
      statistics: {
        ...prev.statistics,
        glyphsLearned: gameState.unlockedGlyphs.length,
        languagesLearned: gameState.knownLanguages.length
      }
    }));
  }, [gameState]);

  // Get current dialogue node
  const getCurrentDialogue = useCallback((sceneId: string): DialogueNode | null => {
    // Check prologue dialogue first
    let dialogue = prologueDialogue.find(node => node.id === sceneId);
    if (dialogue) return dialogue;

    // Check hub dialogue
    dialogue = hubDialogue.find(node => node.id === sceneId);
    if (dialogue) return dialogue;

    // Check chapter 1 dialogue
    dialogue = chapter1Dialogue.find(node => node.id === sceneId);
    if (dialogue) return dialogue;

    // Check chapter 2 dialogue  
    dialogue = chapter2Dialogue.find(node => node.id === sceneId);
    if (dialogue) return dialogue;

    // Check memory dive dialogue
    dialogue = memoryDiveDialogue.find(node => node.id === sceneId);
    if (dialogue) return dialogue;

    return null;
  }, []);

  // Initialize with first dialogue if not already set
  useEffect(() => {
    if (!currentDialogue) {
      const initialDialogue = getCurrentDialogue(gameState.currentScene);
      setCurrentDialogue(initialDialogue);
      
      // Set initial mode based on scene
      if (gameState.currentScene === 'hub_main') {
        setGameMode('hub');
      } else {
        setGameMode('dialogue');
      }
    }
  }, [gameState.currentScene, getCurrentDialogue, currentDialogue]);

  // Handle choice made in dialogue
  const handleChoiceMade = useCallback((choice: Choice) => {
    // Process consequences and unlocks
    processChoice(choice.consequences, choice.unlocks);
    
    // Navigate to next scene if specified in unlocks
    if (choice.unlocks && choice.unlocks.length > 0) {
      const nextSceneId = choice.unlocks[choice.unlocks.length - 1];
      
      if (nextSceneId === 'hub_main') {
        setGameMode('hub');
        setCurrentDialogue(null);
      } else {
        const nextDialogue = getCurrentDialogue(nextSceneId);
        if (nextDialogue) {
          setCurrentDialogue(nextDialogue);
          setGameMode('dialogue');
        }
      }
    }
  }, [processChoice, getCurrentDialogue]);

  // Handle auto-advance in dialogue
  const handleAutoAdvance = useCallback((nextSceneId: string) => {
    if (nextSceneId === 'hub_main') {
      setGameMode('hub');
      setCurrentDialogue(null);
    } else {
      const nextDialogue = getCurrentDialogue(nextSceneId);
      if (nextDialogue) {
        setCurrentDialogue(nextDialogue);
      }
    }
  }, [getCurrentDialogue]);

  // Handle hub navigation
  const handleHubNavigation = useCallback((destination: string) => {
    switch (destination) {
      case 'world_map':
        setGameMode('world_map');
        break;
      case 'lexicon':
        setGameMode('lexicon');
        break;
      case 'memory_chamber': {
        // Navigate to memory dive
        const memoryDialogue = getCurrentDialogue('memory_chamber_entry');
        if (memoryDialogue) {
          setCurrentDialogue(memoryDialogue);
          setGameMode('dialogue');
        }
        break;
      }
      case 'faction_overview':
        setGameMode('faction_overview');
        break;
      case 'language_study':
        setGameMode('language_study');
        break;
      case 'glyph_resonance':
        setGameMode('glyph_resonance');
        break;
      case 'character_relationships':
        setGameMode('character_relationships');
        break;
      case 'achievements':
        setGameMode('achievements');
        break;
      case 'save_load':
        setGameMode('save_load');
        break;
      case 'systems_test':
        setGameMode('systems_test');
        break;
      // New Web Version 5 features
      case 'quest_system':
        setGameMode('quest_system');
        break;
      case 'memory_drift':
        setGameMode('memory_drift');
        break;
      case 'advanced_language':
        setGameMode('advanced_language');
        break;
      case 'continue_story': {
        // Continue with main story - start Chapter 1
        const storyDialogue = getCurrentDialogue('chapter1_start');
        if (storyDialogue) {
          setCurrentDialogue(storyDialogue);
          setGameMode('dialogue');
        }
        break;
      }
      default:
        console.log(`Navigation to ${destination} not implemented`);
    }
  }, [getCurrentDialogue]);

  // Handle return to hub
  const handleReturnToHub = useCallback(() => {
    setGameMode('hub');
  }, []);

  return (
    <>
      <GlobalStyle />
      <GameContainer>
        <NovelInterface>
          {gameMode === 'dialogue' && currentDialogue && (
            currentDialogue.id.startsWith('memory_') ? (
              <MemoryDiveComponent
                dialogue={currentDialogue}
                onChoiceMade={handleChoiceMade}
                onAutoAdvance={handleAutoAdvance}
                onReturnToHub={handleReturnToHub}
              />
            ) : (
              <DialogueComponent
                dialogue={currentDialogue}
                onChoiceMade={handleChoiceMade}
                onAutoAdvance={handleAutoAdvance}
              />
            )
          )}
          
          {gameMode === 'hub' && (
            <HubNavigation onNavigate={handleHubNavigation} />
          )}

          {gameMode === 'world_map' && (
            <WorldMap onReturn={handleReturnToHub} />
          )}

          {gameMode === 'lexicon' && (
            <Lexicon onReturn={handleReturnToHub} />
          )}

          {gameMode === 'faction_overview' && (
            <FactionOverview 
              onReturn={handleReturnToHub}
              onFactionInteraction={(factionId: string, action: string) => {
                console.log(`Faction interaction: ${action} with ${factionId}`);
                // Here you would handle faction interactions
              }}
            />
          )}

          {gameMode === 'language_study' && (
            <LanguageStudy onReturn={handleReturnToHub} />
          )}

          {gameMode === 'glyph_resonance' && (
            <GlyphResonance onReturn={handleReturnToHub} />
          )}

          {gameMode === 'character_relationships' && (
            <CharacterRelationships 
              onReturn={handleReturnToHub}
              onCharacterInteraction={(characterId: string, action: string) => {
                console.log(`Character interaction: ${action} with ${characterId}`);
                // Here you would handle character interactions
              }}
            />
          )}

          {gameMode === 'achievements' && (
            <AchievementSystem onReturn={handleReturnToHub} />
          )}

          {gameMode === 'save_load' && (
            <SaveLoadSystem 
              onReturn={handleReturnToHub}
              currentGameState={gameState}
              onLoadGame={(loadedState) => {
                // Here you would handle loading the game state
                console.log('Loading game state:', loadedState);
                // processChoice would need to be updated to handle full state loading
                handleReturnToHub();
              }}
            />
          )}

          {gameMode === 'systems_test' && (
            <GameSystemsTest onReturn={handleReturnToHub} />
          )}

          {/* New Web Version 5 Components */}
          {gameMode === 'quest_system' && (
            <QuestSystem 
              gameState={extendedGameState}
              onGameStateChange={setExtendedGameState}
              onReturnToHub={handleReturnToHub}
            />
          )}

          {gameMode === 'memory_drift' && (
            <MemoryDriftSystem 
              gameState={extendedGameState}
              onGameStateChange={setExtendedGameState}
              onReturnToHub={handleReturnToHub}
            />
          )}

          {gameMode === 'advanced_language' && (
            <AdvancedLanguageSystem 
              gameState={extendedGameState}
              onGameStateChange={setExtendedGameState}
              onReturnToHub={handleReturnToHub}
            />
          )}
        </NovelInterface>
      </GameContainer>
    </>
  );
};

export default App;
