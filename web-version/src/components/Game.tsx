import { useState } from 'react';
import { GameProvider } from '../context/GameContext';
import { useGame } from '../hooks/useGame';
import { VisualNovelGlobalStyle } from '../styles/visualnovel';
import { VNMainMenu } from './VNMainMenu';
import { NewDialogSystem } from './NewDialogSystem';
import WorldMap from '../components/WorldMap';
import LexiconSidebar from '../components/LexiconSidebar';
import MemoryDive from '../components/MemoryDive';
import { prologueChapter, languageSelectionScene, hubScene } from '../data/dialogue';

type GameScreen = 'main-menu' | 'prologue' | 'language_selection' | 'hub' | 'map' | 'lexicon' | 'memory_dive';

function GameContent() {
  const { state } = useGame();
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('main-menu');
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

  const getBackgroundImage = () => {
    switch (currentScreen) {
      case 'main-menu':
        return '/assets/map-of-valdaren.png';
      case 'prologue':
        return '/assets/map-of-valdaren.png';
      case 'language_selection':
        return '/assets/map-of-valdaren.png';
      case 'hub':
        return '/assets/map-of-valdaren.png';
      default:
        return undefined;
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'main-menu':
        return (
          <VNMainMenu
            onStartGame={() => {
              setCurrentScreen('prologue');
              setCurrentSceneId('prologue_start');
            }}
            onLoadGame={() => {
              // Load saved game logic
              const saved = localStorage.getItem('ellidra_save');
              if (saved) {
                const saveData = JSON.parse(saved);
                setCurrentScreen('hub');
                setCurrentSceneId(saveData.currentSceneId || 'hub_main');
              }
            }}
            onSettings={() => {
              // Settings screen logic
              console.log('Settings opened');
            }}
            backgroundImage={getBackgroundImage()}
          />
        );
        
      case 'prologue':
        return (
          <NewDialogSystem
            scenes={prologueChapter}
            currentSceneId={currentSceneId}
            onSceneChange={setCurrentSceneId}
            onComplete={handleSceneComplete}
            backgroundImage={getBackgroundImage()}
          />
        );
        
      case 'language_selection':
        return (
          <NewDialogSystem
            scenes={languageSelectionScene}
            currentSceneId={currentSceneId}
            onSceneChange={setCurrentSceneId}
            onComplete={handleSceneComplete}
            backgroundImage={getBackgroundImage()}
          />
        );
        
      case 'hub':
        return (
          <NewDialogSystem
            scenes={hubScene}
            currentSceneId={currentSceneId}
            onSceneChange={setCurrentSceneId}
            onComplete={() => {}}
            onChoiceSelect={(choiceId) => {
              if (choiceId === 'open_map') setCurrentScreen('map');
              else if (choiceId === 'open_lexicon') setCurrentScreen('lexicon');
              else if (choiceId === 'memory_dive') setCurrentScreen('memory_dive');
              else if (choiceId === 'check_languages') {
                // Show languages in a visual novel friendly way
                console.log(`Known languages: ${state.knownLanguages.join(', ')}`);
              } else if (choiceId === 'view_consequences') {
                const consequences = Object.entries(state.consequenceMap)
                  .map(([key, values]) => `${key}: ${values.join(', ')}`)
                  .join('\n') || 'No consequences recorded yet.';
                console.log(consequences);
              }
            }}
            backgroundImage={getBackgroundImage()}
          />
        );
        
      case 'map':
        return (
          <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            padding: '20px'
          }}>
            <button 
              onClick={returnToHub}
              style={{
                background: 'rgba(212, 175, 55, 0.1)',
                border: '2px solid rgba(212, 175, 55, 0.4)',
                color: '#e2e8f0',
                padding: '10px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                marginBottom: '20px',
                fontFamily: 'Crimson Text, serif'
              }}
            >
              ← Return to Hub
            </button>
            <WorldMap onClose={returnToHub} />
          </div>
        );
        
      case 'lexicon':
        return (
          <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            padding: '20px'
          }}>
            <button 
              onClick={returnToHub}
              style={{
                background: 'rgba(212, 175, 55, 0.1)',
                border: '2px solid rgba(212, 175, 55, 0.4)',
                color: '#e2e8f0',
                padding: '10px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                marginBottom: '20px',
                fontFamily: 'Crimson Text, serif'
              }}
            >
              ← Return to Hub
            </button>
            <LexiconSidebar onClose={returnToHub} />
          </div>
        );
        
      case 'memory_dive':
        return (
          <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            padding: '20px'
          }}>
            <button 
              onClick={returnToHub}
              style={{
                background: 'rgba(212, 175, 55, 0.1)',
                border: '2px solid rgba(212, 175, 55, 0.4)',
                color: '#e2e8f0',
                padding: '10px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                marginBottom: '20px',
                fontFamily: 'Crimson Text, serif'
              }}
            >
              ← Return to Hub
            </button>
            <MemoryDive onClose={returnToHub} />
          </div>
        );
        
      default:
        return (
          <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#e2e8f0',
            fontFamily: 'Crimson Text, serif'
          }}>
            Screen not found: {currentScreen}
          </div>
        );
    }
  };

  return (
    <>
      <VisualNovelGlobalStyle />
      {renderScreen()}
    </>
  );
}

export default function Game() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
