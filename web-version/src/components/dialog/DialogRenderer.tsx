/**
 * Dialog Renderer Component
 * Pure UI component for rendering dialog scenes
 */

import { AnimatePresence, motion } from 'framer-motion';
import {
  VisualNovelContainer,
  BackgroundLayer,
  UILayer,
  DialogueBox,
  NameBox,
  DialogueText,
  ChoicesContainer,
} from '../../styles/visualnovel';
import { EnhancedButton } from '../EnhancedButton';
import { useDialogText, useDialogChoices, useDialogNavigation, useDialogKeyboard, useDialogNameInput } from './hooks';
import type { DialogChoice } from './types';

interface DialogRendererProps {
  backgroundImage?: string;
  characterSprite?: string;
  enableKeyboard?: boolean;
}

export function DialogRenderer({ 
  backgroundImage, 
  characterSprite, 
  enableKeyboard = true 
}: DialogRendererProps) {
  const { currentScene } = useDialogNavigation();
  const { displayedText, isTyping, isComplete, skipTyping } = useDialogText();
  const { choices, showChoices, selectChoice, canUseChoice } = useDialogChoices();
  const { selectedChoiceIndex } = useDialogKeyboard(enableKeyboard);
  const { showNameInput, playerName, setPlayerName, submitName, hideNameInput } = useDialogNameInput();

  if (!currentScene) {
    return (
      <VisualNovelContainer>
        <BackgroundLayer $backgroundImage={backgroundImage} />
        <UILayer>
          <div style={{ textAlign: 'center', color: 'white', padding: '50px' }}>
            No scene found
          </div>
        </UILayer>
      </VisualNovelContainer>
    );
  }

  const handleTextClick = () => {
    if (isTyping) {
      skipTyping();
    }
  };

  const renderTextWithEffects = (text: string) => {
    return text
      .replace(/\[glyph\](.*?)\[\/glyph\]/g, '<span style="color: #fbbf24; text-shadow: 0 0 8px rgba(251, 191, 36, 0.5);">✨ $1</span>')
      .replace(/\[emphasis\](.*?)\[\/emphasis\]/g, '<span style="font-style: italic; color: #f59e0b;">$1</span>')
      .replace(/\[whisper\](.*?)\[\/whisper\]/g, '<span style="opacity: 0.7; font-size: 0.9em;">$1</span>');
  };

  return (
    <VisualNovelContainer>
      {/* Background */}
      <BackgroundLayer $backgroundImage={backgroundImage || currentScene.background} />
      
      {/* Character Sprites */}
      {(characterSprite || currentScene.character) && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          alignItems: 'flex-end',
        }}>
          <img 
            src={characterSprite || currentScene.character} 
            alt="Character"
            style={{
              maxHeight: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 20px rgba(0, 0, 0, 0.5))'
            }}
          />
        </div>
      )}

      {/* UI Layer */}
      <UILayer>
        {/* Main Dialog Box */}
        <AnimatePresence>
          {currentScene.text && !showNameInput && (
            <DialogueBox
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              onClick={handleTextClick}
              style={{ cursor: isTyping ? 'pointer' : 'default' }}
            >
              {currentScene.speaker && (
                <NameBox>{currentScene.speaker}</NameBox>
              )}
              
              <DialogueText
                dangerouslySetInnerHTML={{
                  __html: renderTextWithEffects(displayedText)
                }}
              />
              
              {/* Typing cursor */}
              {isTyping && (
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
              
              {/* Continue prompt */}
              {isComplete && !showChoices && (
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
        {showChoices && !showNameInput && (
          <ChoicesContainer>
            <AnimatePresence>
              {choices.map((choice: DialogChoice, index: number) => {
                const isDisabled = !canUseChoice(choice);
                const isSelected = index === selectedChoiceIndex;

                return (
                  <motion.div
                    key={choice.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <EnhancedButton
                      variant={choice.metadata?.glyphUsed ? 'primary' : 'secondary'}
                      glowEffect={!!choice.metadata?.glyphUsed || isSelected}
                      disabled={isDisabled}
                      onClick={() => selectChoice(choice)}
                      soundEffect={choice.metadata?.glyphUsed ? 'glyph-activate' : 'choice-select'}
                      style={{ 
                        width: '100%', 
                        textAlign: 'left', 
                        marginBottom: '12px',
                        border: isSelected ? '2px solid #fbbf24' : undefined,
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 'normal', color: '#94a3b8', fontSize: '0.9rem' }}>
                            {index + 1}.
                          </span>
                          <span>{choice.text}</span>
                        </div>
                        
                        {isDisabled && choice.requirements && (
                          <div style={{ opacity: 0.6, fontSize: '0.8rem', marginTop: '4px' }}>
                            (Requirements not met)
                          </div>
                        )}
                        
                        {choice.metadata?.glyphUsed && typeof choice.metadata.glyphUsed === 'string' ? (
                          <div style={{ color: '#fbbf24', fontSize: '0.8rem', marginTop: '4px', fontStyle: 'italic' }}>
                            ✨ Uses glyph: {String(choice.metadata.glyphUsed)}
                          </div>
                        ) : null}
                      </div>
                    </EnhancedButton>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </ChoicesContainer>
        )}

        {/* Name Input Modal */}
        {showNameInput && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(15, 15, 35, 0.95)',
              border: '2px solid #fbbf24',
              borderRadius: '15px',
              padding: '30px',
              textAlign: 'center',
              minWidth: '300px',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
            }}
          >
            <h3 style={{ 
              color: '#fbbf24', 
              marginBottom: '20px',
              fontFamily: 'Cinzel, serif',
            }}>
              What name shall echo through the ages?
            </h3>
            
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name..."
              maxLength={20}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && playerName.trim()) {
                  submitName(playerName);
                } else if (e.key === 'Escape') {
                  hideNameInput();
                }
              }}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '20px',
                border: '1px solid #fbbf24',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                fontSize: '16px',
                textAlign: 'center',
                outline: 'none',
              }}
            />
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <EnhancedButton
                variant="primary"
                disabled={!playerName.trim()}
                onClick={() => submitName(playerName)}
                glowEffect
                soundEffect="choice-select"
              >
                Inscribe Your Name
              </EnhancedButton>
              
              <EnhancedButton
                variant="secondary"
                onClick={hideNameInput}
                soundEffect="click"
              >
                Cancel
              </EnhancedButton>
            </div>
          </motion.div>
        )}
      </UILayer>
    </VisualNovelContainer>
  );
}