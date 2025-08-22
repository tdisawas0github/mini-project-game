import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  VisualNovelContainer,
  BackgroundLayer,
  CharacterLayer,
  UILayer,
  DialogueBox,
  NameBox,
  DialogueText,
  ChoicesContainer,
  TopUIBar,
  AutoPlayIndicator,
  StatusIndicator,
  NameInputContainer,
  NameInput,
  InputLabel
} from '../styles/visualnovel';
import { useGame } from '../hooks/useGame';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { playSound } from '../utils/audioManager';
import { EnhancedButton } from './EnhancedButton';
import type { DialogueNode, SceneEffect, DialogueChoice } from '../types/game';

interface VNDialogueSystemProps {
  scenes: DialogueNode[];
  currentSceneId: string;
  onSceneChange: (sceneId: string) => void;
  onComplete?: () => void;
  onChoiceSelect?: (choiceId: string) => void;
  backgroundImage?: string;
  characterSprite?: string;
}

/**
 * Visual novel dialogue system component that renders and drives a multi-scene interactive dialogue UI.
 *
 * Renders background and optional character sprite, displays typed dialogue with inline markup support, presents choices,
 * manages per-character typewriter animation (configurable speed), supports auto-play, saves/loads a simple snapshot to
 * localStorage, and exposes keyboard navigation. The component applies scene and choice effects to the global game state
 * (learn languages, unlock memories, update faction influence, add consequences, set player name) via the game's dispatch,
 * and notifies the host via onSceneChange, onChoiceSelect, and onComplete callbacks.
 *
 * @param scenes - Array of dialogue scene nodes defining text, speaker, effects, autoAdvance, and choices.
 * @param currentSceneId - Id of the currently active scene to render.
 * @param onSceneChange - Callback invoked to request a transition to another scene id.
 * @param onComplete - Optional callback invoked when the narrative reaches a completion point.
 * @param onChoiceSelect - Optional callback invoked with the selected choice id after a choice is processed.
 * @param backgroundImage - Optional background image URL shown behind the UI.
 * @param characterSprite - Optional character sprite image URL shown above the background.
 *
 * @returns JSX element containing the visual novel UI.
 */
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

  if (!currentScene) {
    return (
      <VisualNovelContainer>
        <BackgroundLayer $backgroundImage={backgroundImage} />
        <UILayer>
          <div style={{ textAlign: 'center', color: 'white', padding: '50px' }}>
            Scene not found: {currentSceneId}
          </div>
        </UILayer>
      </VisualNovelContainer>
    );
  }

  const handleNext = useCallback(() => {
    if (!currentScene) return;
    
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
      currentScene.effects.forEach((effect: SceneEffect) => {
        if (effect.type === 'learn_language') {
          dispatch({ type: 'LEARN_LANGUAGE', payload: effect.value });
        } else if (effect.type === 'unlock_memory') {
          dispatch({ type: 'UNLOCK_MEMORY', payload: effect.value });
        } else if (effect.type === 'faction_influence') {
          dispatch({ 
            type: 'UPDATE_FACTION_INFLUENCE', 
            payload: { faction: effect.faction || '', change: effect.amount || 0 } 
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
  }, [currentScene, currentTextIndex, onSceneChange, onComplete, scenes, dispatch, isTextComplete]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || !isTextComplete) return;

    const autoAdvanceDelay = setTimeout(() => {
      handleNext();
    }, 2000);

    return () => clearTimeout(autoAdvanceDelay);
  }, [autoPlay, isTextComplete, handleNext]);

  const handleChoice = useCallback((choice: DialogueChoice) => {
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
  }, [state.knownLanguages, dispatch, onChoiceSelect, setShowNameInput, scenes, onSceneChange, setCurrentTextIndex, onComplete]);

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

  // Enhanced click to advance with sound effects
  const handleAdvanceClick = useCallback(() => {
    playSound('dialogue-advance');
    handleNext();
  }, [handleNext]);

  // Keyboard navigation
  useKeyboardNavigation({
    onNext: handleAdvanceClick,
    onChoice: (index: number) => {
      if (currentScene.choices && index < currentScene.choices.length) {
        const choice = currentScene.choices[index];
        if (!choice.requiresLanguages || choice.requiresLanguages.every(lang => state.knownLanguages.includes(lang))) {
          playSound('choice-select');
          handleChoice(choice);
        }
      }
    },
    onMenu: () => console.log('Menu - TODO'),
    choices: currentScene.choices || [],
    disabled: showNameInput
  });

  // Auto-advance dialogue text with enhanced feedback
  useEffect(() => {
    if (!currentScene?.text) return;
    
    const text = Array.isArray(currentScene.text) 
      ? currentScene.text[currentTextIndex] 
      : currentScene.text;
    
    let charIndex = 0;
    setDisplayedText('');
    setIsTextComplete(false);
    
    // Play a subtle sound when starting new dialogue
    playSound('mystery', 0.2);
    
    const typeInterval = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTextComplete(true);
        clearInterval(typeInterval);
        // Play completion sound
        playSound('dialogue-advance', 0.3);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, [currentScene, currentTextIndex, typingSpeed]);

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
            <EnhancedButton 
              variant="ghost" 
              size="small"
              onClick={() => console.log('Menu - TODO')}
            >
              Menu
            </EnhancedButton>
            <EnhancedButton 
              variant="ghost" 
              size="small"
              onClick={handleSave}
              soundEffect="click"
            >
              Save
            </EnhancedButton>
            <EnhancedButton 
              variant="ghost" 
              size="small"
              onClick={handleLoad}
              soundEffect="click"
            >
              Load
            </EnhancedButton>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <EnhancedButton 
              variant="ghost" 
              size="small"
              onClick={() => setTypingSpeed(typingSpeed === 30 ? 10 : 30)}
              soundEffect="click"
            >
              Speed: {typingSpeed === 30 ? 'Normal' : 'Fast'}
            </EnhancedButton>
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
              onClick={handleAdvanceClick}
            >
              {currentScene.speaker && (
                <NameBox>{currentScene.speaker}</NameBox>
              )}
              
              <DialogueText
                dangerouslySetInnerHTML={{
                  __html: displayedText
                    .replace(/\[glyph\](.*?)\[\/glyph\]/g, '<span style="color: #fbbf24; text-shadow: 0 0 8px rgba(251, 191, 36, 0.5);">✨ $1</span>')
                    .replace(/\[emphasis\](.*?)\[\/emphasis\]/g, '<span style="font-style: italic; color: #f59e0b;">$1</span>')
                    .replace(/\[whisper\](.*?)\[\/whisper\]/g, '<span style="opacity: 0.7; font-size: 0.9em;">$1</span>')
                }}
              />
              {!isTextComplete && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    color: '#64748b',
                    marginLeft: '4px',
                    fontSize: '1.2em'
                  }}
                >
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ▊
                  </motion.span>
                </motion.span>
              )}
              {isTextComplete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  style={{
                    textAlign: 'center',
                    marginTop: '12px',
                    fontSize: '0.8em',
                    color: '#64748b'
                  }}
                >
                  Press Space or click to continue...
                </motion.div>
              )}
            </DialogueBox>
          )}
        </AnimatePresence>

        {/* Choices */}
        {currentScene.choices && isTextComplete && !showNameInput && (
          <ChoicesContainer>
            <AnimatePresence>
              {currentScene.choices.map((choice: DialogueChoice, index: number) => {
                const isDisabled = choice.requiresLanguages && !choice.requiresLanguages.every((lang: string) => {
                  return state.knownLanguages.includes(lang);
                });

                return (
                  <motion.div
                    key={choice.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <EnhancedButton
                      variant={choice.glyphUsed ? 'primary' : 'secondary'}
                      glowEffect={!!choice.glyphUsed}
                      disabled={isDisabled}
                      onClick={() => handleChoice(choice)}
                      soundEffect={choice.glyphUsed ? 'glyph-activate' : 'choice-select'}
                      style={{ width: '100%', textAlign: 'left', marginBottom: '12px' }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 'normal', color: '#94a3b8', fontSize: '0.9rem' }}>{index + 1}.</span>
                          <span>{choice.text}</span>
                        </div>
                        {isDisabled && (
                          <div style={{ opacity: 0.6, fontSize: '0.8rem', marginTop: '4px' }}>
                            (Requires: {choice.requiresLanguages?.join(', ')})
                          </div>
                        )}
                        {choice.glyphUsed && (
                          <div style={{ color: '#fbbf24', fontSize: '0.8rem', marginTop: '4px', fontStyle: 'italic' }}>
                            ✨ Uses glyph: {choice.glyphUsed}
                          </div>
                        )}
                      </div>
                    </EnhancedButton>
                  </motion.div>
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
            <EnhancedButton
              variant="primary"
              disabled={!playerName.trim()}
              onClick={handleNameSubmit}
              glowEffect
              soundEffect="choice-select"
            >
              Inscribe Your Name
            </EnhancedButton>
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
