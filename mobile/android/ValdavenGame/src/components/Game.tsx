import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameProvider } from '../context/GameContext';
import { useGame } from '../hooks/useGame';
import { commonStyles, colors } from '../styles';
import { prologueChapter, languageSelectionScene, hubScene } from '../data/dialogue';
import VNMainMenu from './VNMainMenu';
import VNDialogueSystem from './VNDialogueSystem';
import WorldMap from './WorldMap';
import LexiconSidebar from './LexiconSidebar';
import MemoryDive from './MemoryDive';

type GameScreen = 'main-menu' | 'prologue' | 'language_selection' | 'hub' | 'map' | 'lexicon' | 'memory_dive';

function GameContent() {
  const { } = useGame();
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
              // Load game logic here
              setCurrentScreen('hub');
              setCurrentSceneId('hub_main');
            }}
            onSettings={() => {
              // Settings logic here
            }}
          />
        );
      
      case 'prologue':
        return (
          <VNDialogueSystem
            scenes={prologueChapter}
            currentSceneId={currentSceneId}
            onSceneChange={setCurrentSceneId}
            onSceneComplete={handleSceneComplete}
          />
        );
      
      case 'language_selection':
        return (
          <VNDialogueSystem
            scenes={languageSelectionScene}
            currentSceneId={currentSceneId}
            onSceneChange={setCurrentSceneId}
            onSceneComplete={handleSceneComplete}
          />
        );
      
      case 'hub':
        return (
          <VNDialogueSystem
            scenes={hubScene}
            currentSceneId={currentSceneId}
            onSceneChange={setCurrentSceneId}
            onSceneComplete={returnToHub}
            onNavigate={(destination) => {
              switch (destination) {
                case 'open_map':
                  setCurrentScreen('map');
                  break;
                case 'open_lexicon':
                  setCurrentScreen('lexicon');
                  break;
                case 'memory_dive':
                  setCurrentScreen('memory_dive');
                  break;
                default:
                  break;
              }
            }}
          />
        );
      
      case 'map':
        return <WorldMap onReturn={returnToHub} />;
      
      case 'lexicon':
        return <LexiconSidebar onReturn={returnToHub} />;
      
      case 'memory_dive':
        return <MemoryDive onReturn={returnToHub} />;
      
      default:
        return (
          <View style={[commonStyles.container, commonStyles.center]}>
            <Text style={styles.errorText}>Unknown screen: {currentScreen}</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaProvider>
      <View style={commonStyles.container}>
        {renderScreen()}
      </View>
    </SafeAreaProvider>
  );
}

export default function Game() {
  return (
    <GameProvider>
      <NavigationContainer>
        <GameContent />
      </NavigationContainer>
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: colors.text,
    fontSize: 18,
    textAlign: 'center',
  },
});