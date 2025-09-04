import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DialogueNode, Choice } from '../types/game';
import { useGameState } from '../hooks/useGameState';
import {
  DialogueBox,
  SpeakerName,
  DialogueText,
  ChoicesContainer,
  ChoiceButton,
  PlayerNameInput
} from '../styles/visualNovel';

interface DialogueComponentProps {
  dialogue: DialogueNode;
  onChoiceMade: (choice: Choice) => void;
  onAutoAdvance: (nextSceneId: string) => void;
}

const DialogueComponent: React.FC<DialogueComponentProps> = ({
  dialogue,
  onChoiceMade,
  onAutoAdvance
}) => {
  const { gameState, setPlayerName } = useGameState();
  const [showChoices, setShowChoices] = useState(false);
  const [nameInput, setNameInput] = useState('');

  // Process text to replace placeholders
  const processText = useCallback((text: string) => {
    return text
      .replace(/{playerName}/g, gameState.playerName || 'Wanderer')
      .replace(/\*([^*]+)\*/g, '<span class="emphasis">$1</span>')
      .replace(/~([^~]+)~/g, '<span class="whisper">$1</span>')
      .replace(/\[([^\]]+)\]/g, '<span class="glyph">$1</span>');
  }, [gameState.playerName]);

  // Handle auto-advance after a delay
  useEffect(() => {
    if (dialogue.autoAdvance) {
      const timer = setTimeout(() => {
        onAutoAdvance(dialogue.autoAdvance!);
      }, 3000);
      return () => clearTimeout(timer);
    } else if (dialogue.choices) {
      const timer = setTimeout(() => {
        setShowChoices(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [dialogue, onAutoAdvance]);

  // Handle name input for the name entry scene
  const handleNameSubmit = useCallback(() => {
    if (nameInput.trim()) {
      setPlayerName(nameInput.trim());
      if (dialogue.choices?.[0]) {
        onChoiceMade(dialogue.choices[0]);
      }
    }
  }, [nameInput, setPlayerName, dialogue.choices, onChoiceMade]);

  // Check if choice is available based on requirements
  const isChoiceAvailable = useCallback((choice: Choice) => {
    if (choice.requiresLanguages) {
      return choice.requiresLanguages.every(lang => 
        gameState.knownLanguages.includes(lang)
      );
    }
    return true;
  }, [gameState.knownLanguages]);

  // Handle choice selection
  const handleChoiceClick = useCallback((choice: Choice) => {
    if (!isChoiceAvailable(choice)) return;
    onChoiceMade(choice);
  }, [isChoiceAvailable, onChoiceMade]);

  const isNameInputScene = dialogue.id === 'name_input_prompt';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
      >
        <DialogueBox>
          {/* Speaker Name */}
          {dialogue.speaker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <SpeakerName>{dialogue.speaker}</SpeakerName>
            </motion.div>
          )}

          {/* Dialogue Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <DialogueText 
              dangerouslySetInnerHTML={{ __html: processText(dialogue.text) }}
            />
          </motion.div>

          {/* Name Input for name entry scene */}
          {isNameInputScene && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
              style={{ textAlign: 'center' }}
            >
              <PlayerNameInput
                type="text"
                placeholder="Enter your name..."
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                maxLength={30}
              />
              <ChoiceButton 
                onClick={handleNameSubmit}
                disabled={!nameInput.trim()}
                style={{ marginTop: '10px', maxWidth: '200px' }}
              >
                Confirm Name
              </ChoiceButton>
            </motion.div>
          )}

          {/* Choices */}
          {dialogue.choices && showChoices && !isNameInputScene && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <ChoicesContainer>
                {dialogue.choices.map((choice) => {
                  const available = isChoiceAvailable(choice);
                  return (
                    <motion.div
                      key={choice.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: 0.9 + (dialogue.choices?.indexOf(choice) || 0) * 0.1,
                        duration: 0.3 
                      }}
                    >
                      <ChoiceButton
                        onClick={() => handleChoiceClick(choice)}
                        disabled={!available}
                        className={choice.glyphUsed ? 'glyph-choice' : ''}
                        title={choice.glyphUsed ? `Uses glyph: ${choice.glyphUsed}` : ''}
                      >
                        {choice.text}
                        {choice.requiresLanguages && (
                          <div style={{ fontSize: '0.85em', opacity: 0.7, marginTop: '4px' }}>
                            Requires: {choice.requiresLanguages.join(', ')}
                          </div>
                        )}
                      </ChoiceButton>
                    </motion.div>
                  );
                })}
              </ChoicesContainer>
            </motion.div>
          )}

          {/* Auto-advance indicator */}
          {dialogue.autoAdvance && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 2, duration: 0.3 }}
              style={{ 
                textAlign: 'center', 
                marginTop: '20px', 
                fontSize: '0.9em', 
                color: '#6b7280' 
              }}
            >
              ◦ ◦ ◦
            </motion.div>
          )}
        </DialogueBox>
      </motion.div>
    </AnimatePresence>
  );
};

export default DialogueComponent;