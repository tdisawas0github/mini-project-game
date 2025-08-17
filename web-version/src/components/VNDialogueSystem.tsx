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
  StatusIndicator
} from '../styles/visualnovel';
import { useGame } from '../context/GameContext';

interface VNDialogueSystemProps {
  scenes: Record<string, any>;
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

  const currentScene = scenes[currentSceneId];

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
    if (currentScene.next) {
      onSceneChange(currentScene.next);
      setCurrentTextIndex(0);
    } else if (currentScene.choices) {
      // Choices will be displayed
    } else {
      onComplete?.();
    }
  };

  const handleChoice = (choice: any) => {
    if (choice.requirements) {
      const hasRequirement = choice.requirements.every((req: any) => {
        if (req.type === 'language') {
          return state.knownLanguages.includes(req.value);
        }
        return true;
      });
      
      if (!hasRequirement) return;
    }

    // Apply choice effects - use existing action types
    if (choice.effects) {
      choice.effects.forEach((effect: any) => {
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

    // Record choice consequence
    if (choice.consequence) {
      dispatch({
        type: 'ADD_CONSEQUENCE',
        payload: { key: choice.consequence.key, value: choice.consequence.value }
      });
    }

    onChoiceSelect?.(choice.id);

    if (choice.next) {
      onSceneChange(choice.next);
      setCurrentTextIndex(0);
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
        {currentScene.choices && isTextComplete && (
          <ChoicesContainer>
            <AnimatePresence>
              {currentScene.choices.map((choice: any, index: number) => {
                const isDisabled = choice.requirements && !choice.requirements.every((req: any) => {
                  if (req.type === 'language') {
                    return state.knownLanguages.includes(req.value);
                  }
                  return true;
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
                        (Requires: {choice.requirements?.[0]?.value})
                      </span>
                    )}
                  </ChoiceButton>
                );
              })}
            </AnimatePresence>
          </ChoicesContainer>
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
