import React, { useState, useCallback } from 'react';
import { GlobalStyle, GameContainer, NovelInterface } from './styles/visualNovel';
import { useGameState } from './hooks/useGameState';
import DialogueComponent from './components/DialogueComponent';
import HubNavigation from './components/HubNavigation';
import WorldMap from './components/WorldMap';
import Lexicon from './components/Lexicon';
import { prologueDialogue, hubDialogue } from './data/dialogue';
import type { DialogueNode, Choice } from './types/game';

const App: React.FC = () => {
  const { gameState, processChoice } = useGameState();
  const [currentDialogue, setCurrentDialogue] = useState<DialogueNode | null>(null);
  const [gameMode, setGameMode] = useState<'dialogue' | 'hub' | 'world_map' | 'lexicon' | 'special'>('dialogue');

  // Get current dialogue node
  const getCurrentDialogue = useCallback((sceneId: string): DialogueNode | null => {
    // Check prologue dialogue first
    let dialogue = prologueDialogue.find(node => node.id === sceneId);
    if (dialogue) return dialogue;

    // Check hub dialogue
    dialogue = hubDialogue.find(node => node.id === sceneId);
    if (dialogue) return dialogue;

    return null;
  }, []);

  // Initialize with first dialogue if not already set
  React.useEffect(() => {
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
      case 'memory_chamber':
        // TODO: Implement memory chamber
        console.log('Memory chamber not yet implemented');
        break;
      case 'faction_overview':
        // TODO: Implement faction overview
        console.log('Faction overview not yet implemented');
        break;
      case 'language_study':
        // TODO: Implement language study
        console.log('Language study not yet implemented');
        break;
      case 'continue_story': {
        // Continue with main story - for now return to dialogue
        const continueDialogue = getCurrentDialogue('hub_main');
        if (continueDialogue) {
          setCurrentDialogue(continueDialogue);
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
            <DialogueComponent
              dialogue={currentDialogue}
              onChoiceMade={handleChoiceMade}
              onAutoAdvance={handleAutoAdvance}
            />
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
        </NovelInterface>
      </GameContainer>
    </>
  );
};

export default App;
