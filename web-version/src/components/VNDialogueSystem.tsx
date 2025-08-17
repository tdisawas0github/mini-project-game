import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  VisualNovelContainer,
  BackgroundLayer,
  CharacterLayer,
  UILayer,
  DialogueBox,
  NameBox,
  DialogueText,
  ChoicesContainer,
  ChoiceButton,
  TopUIBar,
  UIButton,
  AutoPlayIndicator,
  StatusIndicator,
  NameInputContainer,
  NameInput,
  InputLabel,
  InputButton
} from '../styles/visualnovel';
import { useGame } from '../context/GameContext';

interface VNDialogueSystemProps {
  scenes: any[]; // Array of dialogue nodes
  currentSceneId: string;
  onSceneChange: (sceneId: string) => void;
  onComplete?: () => void;
  onChoiceSelect?: (choiceId: string) => void;
  backgroundImage?: string;
  characterSprite?: string;
}

export function VNDialogueSystem({
  scenes,
  currentSceneId,
  onSceneChange,
  onComplete,
  onChoiceSelect,
  backgroundImage,
  characterSprite
}: VNDialogueSystemProps) {
  const { state, dispatch } = useGame();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTextComplete, setIsTextComplete] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(30);
  const [showNameInput, setShowNameInput] = useState(false);
  const [playerName, setPlayerName] = useState('');

  const currentScene = scenes.find(scene => scene.id === currentSceneId);

  // Text typewriter effect
  useEffect(() => {
    if (!currentScene?.text) return;
    
    const text = Array.isArray(currentScene.text) 
      ? currentScene.text[currentTextIndex] 
      : currentScene.text;
    
    let charIndex = 0;
    setDisplayedText('');
    setIsTextComplete(false);
    
    const typeInterval = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTextComplete(true);
        clearInterval(typeInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, [currentScene, currentTextIndex, typingSpeed]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || !isTextComplete) return;

    const autoAdvanceDelay = setTimeout(() => {
      handleNext();
    }, 2000);

    return () => clearTimeout(autoAdvanceDelay);
  }, [autoPlay, isTextComplete]);

  const handleNext = () => {
    if (!isTextComplete) {
      // Skip typing animation
      const text = Array.isArray(currentScene.text) 
        ? currentScene.text[currentTextIndex] 
        : currentScene.text;
      setDisplayedText(text);
      setIsTextComplete(true);
      return;
    }

    if (currentScene.text && Array.isArray(currentScene.text) && currentTextIndex < currentScene.text.length - 1) {
      setCurrentTextIndex(currentTextIndex + 1);
      return;
    }

    // Process scene completion
    if (currentScene.effects) {
      currentScene.effects.forEach((effect: any) => {
        if (effect.type === 'learn_language') {
          dispatch({ type: 'LEARN_LANGUAGE', payload: effect.value });
        } else if (effect.type === 'unlock_memory') {
          dispatch({ type: 'UNLOCK_MEMORY', payload: effect.value });
        } else if (effect.type === 'faction_influence') {
          dispatch({ 
            type: 'UPDATE_FACTION_INFLUENCE', 
            payload: { faction: effect.faction, change: effect.value } 
          });
        }
      });
    }

    // Handle scene transitions
    if (currentScene.autoAdvance) {
      const nextScene = scenes.find(scene => scene.id === currentScene.autoAdvance);
      if (nextScene) {
        onSceneChange(currentScene.autoAdvance);
        setCurrentTextIndex(0);
      } else {
        onComplete?.();
      }
    } else if (currentScene.choices) {
      // Choices will be displayed
    } else {
      onComplete?.();
    }
  };

  const handleChoice = (choice: any) => {
    // Check requirements
    if (choice.requiresLanguages) {
      const hasRequirement = choice.requiresLanguages.every((lang: string) => {
        return state.knownLanguages.includes(lang);
      });
      
      if (!hasRequirement) return;
    }

    // Apply effects based on choice properties
    if (choice.unlocks) {
      choice.unlocks.forEach((memory: string) => {
        dispatch({ type: 'UNLOCK_MEMORY', payload: memory });
      });
    }

    if (choice.glyphUsed) {
      // Learn the glyph as a word
      dispatch({ type: 'LEARN_LANGUAGE', payload: choice.glyphUsed });
    }

    // Record consequences
    if (choice.consequences) {
      choice.consequences.forEach((consequence: string) => {
        dispatch({
          type: 'ADD_CONSEQUENCE',
          payload: { key: 'choice', value: consequence }
        });
      });
    }

    onChoiceSelect?.(choice.id);

    // Find the next scene based on choice
    let nextSceneId = null;
    
    // Look for specific response scenes
    if (choice.id === 'who_are_you') {
      nextSceneId = 'figure_response_identity';
    } else if (choice.id === 'return_from_where') {
      nextSceneId = 'figure_response_memory';
    } else if (choice.id === 'use_glyph') {
      nextSceneId = 'figure_response_glyph';
    } else if (choice.id === 'choose_name') {
      // Show name input interface
      setShowNameInput(true);
      return;
    } else if (choice.id.startsWith('choose_english') || choice.id.startsWith('choose_dutch') || 
               choice.id.startsWith('choose_latin') || choice.id.startsWith('choose_greek')) {
      // Handle language selection
      if (choice.id === 'choose_english') {
        dispatch({ type: 'LEARN_LANGUAGE', payload: 'English' });
      } else if (choice.id === 'choose_dutch') {
        dispatch({ type: 'LEARN_LANGUAGE', payload: 'Dutch' });
      } else if (choice.id === 'choose_latin') {
        dispatch({ type: 'LEARN_LANGUAGE', payload: 'Latin' });
      } else if (choice.id === 'choose_greek') {
        dispatch({ type: 'LEARN_LANGUAGE', payload: 'Greek' });
      }
      
      // For language selection, complete the scene to move to next screen
      onComplete?.();
      return;
    }

    if (nextSceneId) {
      const nextScene = scenes.find(scene => scene.id === nextSceneId);
      if (nextScene) {
        onSceneChange(nextSceneId);
        setCurrentTextIndex(0);
      }
    }
  };

  const handleSave = () => {
    const saveData = {
      currentSceneId,
      currentTextIndex,
      gameState: state,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('ellidra_save', JSON.stringify(saveData));
  };

  const handleLoad = () => {
    const saved = localStorage.getItem('ellidra_save');
    if (saved) {
      const saveData = JSON.parse(saved);
      // Load logic would need to be implemented based on your game structure
      console.log('Loading:', saveData);
    }
  };

  const handleNameSubmit = () => {
    if (!playerName.trim()) return;
    
    // Save the player name to game state
    dispatch({ type: 'SET_PLAYER_NAME', payload: playerName.trim() });
    
    // Hide the name input
    setShowNameInput(false);
    
    // Continue to next scene or complete
    onComplete?.();
  };

  if (!currentScene) {
    return <div>Scene not found: {currentSceneId}</div>;
  }

  return (
    <VisualNovelContainer>
      {/* Background */}
      <BackgroundLayer $backgroundImage={backgroundImage} />
      
      {/* Character Sprites */}
      {characterSprite && (
        <CharacterLayer>
          <img 
            src={characterSprite} 
            alt="Character"
            style={{
              maxHeight: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 20px rgba(0, 0, 0, 0.5))'
            }}
          />
        </CharacterLayer>
      )}

      {/* UI Layer */}
      <UILayer>
        {/* Top UI Bar */}
        <TopUIBar>
          <div style={{ display: 'flex', gap: '10px' }}>
            <UIButton onClick={() => console.log('Menu - TODO')}>
              Menu
            </UIButton>
            <UIButton onClick={handleSave}>
              Save
            </UIButton>
            <UIButton onClick={handleLoad}>
              Load
            </UIButton>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <UIButton onClick={() => setTypingSpeed(typingSpeed === 30 ? 10 : 30)}>
              Speed: {typingSpeed === 30 ? 'Normal' : 'Fast'}
            </UIButton>
          </div>
        </TopUIBar>

        {/* Status Indicators */}
        {state.knownLanguages.length > 0 && (
          <StatusIndicator>
            Languages: {state.knownLanguages.length}
          </StatusIndicator>
        )}

        {/* Dialogue Box */}
        <AnimatePresence>
          {currentScene.text && (
            <DialogueBox
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              onClick={handleNext}
            >
              {currentScene.speaker && (
                <NameBox>{currentScene.speaker}</NameBox>
              )}
              
              <DialogueText
                dangerouslySetInnerHTML={{
                  __html: displayedText
                    .replace(/\[glyph\](.*?)\[\/glyph\]/g, '<span class="glyph">$1</span>')
                    .replace(/\[emphasis\](.*?)\[\/emphasis\]/g, '<span class="emphasis">$1</span>')
                    .replace(/\[whisper\](.*?)\[\/whisper\]/g, '<span class="whisper">$1</span>')
                }}
              />
            </DialogueBox>
          )}
        </AnimatePresence>

        {/* Choices */}
        {currentScene.choices && isTextComplete && !showNameInput && (
          <ChoicesContainer>
            <AnimatePresence>
              {currentScene.choices.map((choice: any, index: number) => {
                const isDisabled = choice.requiresLanguages && !choice.requiresLanguages.every((lang: string) => {
                  return state.knownLanguages.includes(lang);
                });

                return (
                  <ChoiceButton
                    key={choice.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    disabled={isDisabled}
                    onClick={() => handleChoice(choice)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {choice.text}
                    {isDisabled && (
                      <span style={{ opacity: 0.6, fontSize: '0.8rem', display: 'block' }}>
                        (Requires: {choice.requiresLanguages?.join(', ')})
                      </span>
                    )}
                    {choice.glyphUsed && (
                      <span style={{ color: '#d4af37', fontSize: '0.8rem', display: 'block', fontStyle: 'italic' }}>
                        Uses glyph: {choice.glyphUsed}
                      </span>
                    )}
                  </ChoiceButton>
                );
              })}
            </AnimatePresence>
          </ChoicesContainer>
        )}

        {/* Name Input */}
        {showNameInput && (
          <NameInputContainer
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <InputLabel>What name shall echo through the ages?</InputLabel>
            <NameInput
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name..."
              maxLength={20}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && playerName.trim()) {
                  handleNameSubmit();
                }
              }}
            />
            <InputButton
              disabled={!playerName.trim()}
              onClick={handleNameSubmit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Inscribe Name
            </InputButton>
          </NameInputContainer>
        )}

        {/* Auto-play indicator */}
        <AutoPlayIndicator 
          $isActive={autoPlay}
          onClick={() => setAutoPlay(!autoPlay)}
        >
          AUTO: {autoPlay ? 'ON' : 'OFF'}
        </AutoPlayIndicator>
      </UILayer>
    </VisualNovelContainer>
  );
}
