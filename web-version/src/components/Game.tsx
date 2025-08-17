import { useState } from 'react';
import { GameProvider, useGame } from '../context/GameContext';
import { Container, Surface, Button, Typography, Flex } from './ui';
import { useTheme } from '../context/ThemeContext';
import DialogueSystem from '../components/DialogueSystem';
import WorldMap from '../components/WorldMap';
import LexiconSidebar from '../components/LexiconSidebar';
import MemoryDive from '../components/MemoryDive';
import DevInspector from '../components/DevInspector';
import { prologueChapter, languageSelectionScene, hubScene } from '../data/dialogue';

type GameScreen = 'prologue' | 'language_selection' | 'hub' | 'map' | 'lexicon' | 'memory_dive';

function GameContent() {
  const { state } = useGame();
  const { toggleTheme, isDark } = useTheme();
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('prologue');
  const [currentSceneId, setCurrentSceneId] = useState('prologue_start');

  const handleSceneComplete = () => {
    if (currentScreen === 'prologue') {
      setCurrentScreen('language_selection');
      setCurrentSceneId('language_selection');
    } else if (currentScreen === 'language_selection') {
      setCurrentScreen('hub');
      setCurrentSceneId('hub_main');
    }
  };

  const returnToHub = () => {
    setCurrentScreen('hub');
    setCurrentSceneId('hub_main');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'prologue':
        return (
          <Surface>
            <DialogueSystem
              scenes={prologueChapter}
              currentSceneId={currentSceneId}
              onSceneChange={setCurrentSceneId}
              onComplete={handleSceneComplete}
            />
          </Surface>
        );
        
      case 'language_selection':
        return (
          <Surface>
            <DialogueSystem
              scenes={languageSelectionScene}
              currentSceneId={currentSceneId}
              onSceneChange={setCurrentSceneId}
              onComplete={handleSceneComplete}
            />
          </Surface>
        );
        
      case 'hub':
        return (
          <Surface>
            <Flex align="center">
              <Typography variant="h1" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                Echoes of Ellidra
              </Typography>
              <Typography style={{ textAlign: 'center', marginBottom: '2rem' }}>
                Welcome, <strong>{state.playerName}</strong>
              </Typography>
              
              <DialogueSystem
                scenes={hubScene}
                currentSceneId={currentSceneId}
                onSceneChange={setCurrentSceneId}
                onComplete={() => {}}
                onChoiceSelect={(choiceId) => {
                  if (choiceId === 'open_map') setCurrentScreen('map');
                  else if (choiceId === 'open_lexicon') setCurrentScreen('lexicon');
                  else if (choiceId === 'memory_dive') setCurrentScreen('memory_dive');
                  else if (choiceId === 'check_languages') {
                    alert(`Known languages: ${state.knownLanguages.join(', ')}`);
                  } else if (choiceId === 'view_consequences') {
                    const consequences = Object.entries(state.consequenceMap)
                      .map(([key, values]) => `${key}: ${values.join(', ')}`)
                      .join('\n') || 'No consequences recorded yet.';
                    alert(consequences);
                  }
                }}
              />
            </Flex>
          </Surface>
        );
        
      case 'map':
        return (
          <Surface>
            <Flex>
              <Button variant="ghost" onClick={returnToHub} style={{ alignSelf: 'flex-start' }}>
                ← Back to Hub
              </Button>
              <WorldMap onClose={returnToHub} />
            </Flex>
          </Surface>
        );
        
      case 'lexicon':
        return (
          <Surface>
            <Flex>
              <Button variant="ghost" onClick={returnToHub} style={{ alignSelf: 'flex-start' }}>
                ← Back to Hub
              </Button>
              <LexiconSidebar onClose={returnToHub} />
            </Flex>
          </Surface>
        );
        
      case 'memory_dive':
        return (
          <Surface>
            <Flex>
              <Button variant="ghost" onClick={returnToHub} style={{ alignSelf: 'flex-start' }}>
                ← Back to Hub
              </Button>
              <MemoryDive onClose={returnToHub} />
            </Flex>
          </Surface>
        );
        
      default:
        return (
          <Surface>
            <Typography>Screen not found</Typography>
          </Surface>
        );
    }
  };

  return (
    <Container>
      {/* Theme Toggle */}
      <Button
        variant="ghost"
        onClick={toggleTheme}
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 50,
          fontSize: '1.2rem',
        }}
      >
        {isDark ? '☀️' : '🌙'}
      </Button>

      {renderScreen()}
      <DevInspector />
    </Container>
  );
}

export default function Game() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
