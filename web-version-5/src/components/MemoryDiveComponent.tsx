import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import styled from 'styled-components';
import type { DialogueNode, Choice } from '../types/game';

interface MemoryDiveComponentProps {
  dialogue: DialogueNode;
  onChoiceMade: (choice: Choice) => void;
  onAutoAdvance: (nextSceneId: string) => void;
  onReturnToHub: () => void;
}

const MemoryDiveContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 40px 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, 
    rgba(15, 15, 35, 0.95) 0%,
    rgba(30, 20, 60, 0.9) 50%,
    rgba(20, 30, 70, 0.95) 100%
  );
  position: relative;
  overflow: hidden;
`;

const MemoryFragment = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
`;

const MemoryPool = styled(motion.div)`
  width: 300px;
  height: 200px;
  background: radial-gradient(ellipse at center, 
    rgba(168, 85, 247, 0.3) 0%,
    rgba(59, 130, 246, 0.2) 50%,
    transparent 70%
  );
  border-radius: 50%;
  border: 2px solid rgba(212, 175, 55, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 0 40px rgba(168, 85, 247, 0.3);
`;

const MemoryDialogueBox = styled(motion.div)`
  background: linear-gradient(135deg, 
    rgba(15, 15, 35, 0.95) 0%, 
    rgba(26, 26, 46, 0.9) 100%
  );
  border: 2px solid rgba(212, 175, 55, 0.5);
  border-radius: 16px;
  padding: 30px;
  max-width: 700px;
  width: 90%;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;

const SpeakerName = styled.div`
  color: #d4af37;
  font-weight: 600;
  font-size: 1.1em;
  margin-bottom: 16px;
  text-align: center;
  text-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
`;

const MemoryText = styled.div`
  color: #e5e5e5;
  line-height: 1.6;
  font-size: 1.05em;
  text-align: center;
  margin-bottom: 24px;

  .memory-echo {
    color: #a855f7;
    font-style: italic;
    text-shadow: 0 2px 6px rgba(168, 85, 247, 0.4);
  }

  .memory-alteration {
    color: #f59e0b;
    font-weight: 600;
    text-shadow: 0 2px 6px rgba(245, 158, 11, 0.4);
  }
`;

const MemoryChoicesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const MemoryChoiceButton = styled(motion.button)`
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.2) 0%, 
    rgba(168, 85, 247, 0.15) 100%
  );
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #e5e5e5;
  padding: 16px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.95em;
  transition: all 0.3s ease;
  text-align: left;
  backdrop-filter: blur(5px);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, 
      rgba(59, 130, 246, 0.3) 0%, 
      rgba(168, 85, 247, 0.25) 100%
    );
    border-color: rgba(212, 175, 55, 0.6);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ReturnButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(15, 15, 35, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #9ca3af;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(26, 26, 46, 0.9);
    color: #d4af37;
    border-color: rgba(212, 175, 55, 0.5);
  }
`;

const MemoryDiveComponent: React.FC<MemoryDiveComponentProps> = ({
  dialogue,
  onChoiceMade,
  onAutoAdvance,
  onReturnToHub
}) => {
  const { gameState } = useGameState();
  const [showChoices, setShowChoices] = useState(false);

  // Create floating memory fragments
  const memoryFragments = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2
  }));

  // Process text with memory-specific styling
  const processedText = React.useMemo(() => {
    return dialogue.text
      .replace(/\*([^*]+)\*/g, '<span class="memory-echo">$1</span>')
      .replace(/\{playerName\}/g, gameState.playerName || 'First Speaker')
      .replace(/\[([^\]]+)\]/g, '<span class="memory-alteration">$1</span>');
  }, [dialogue.text, gameState.playerName]);

  // Auto-advance logic
  React.useEffect(() => {
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

  return (
    <MemoryDiveContainer>
      {/* Floating memory fragments */}
      {memoryFragments.map(fragment => (
        <MemoryFragment
          key={fragment.id}
          initial={{ 
            x: `${fragment.x}vw`, 
            y: `${fragment.y}vh`,
            opacity: 0 
          }}
          animate={{ 
            y: [`${fragment.y}vh`, `${fragment.y - 20}vh`, `${fragment.y}vh`],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            delay: fragment.delay,
            duration: fragment.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      <ReturnButton
        onClick={onReturnToHub}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Return to Hub
      </ReturnButton>

      {/* Central memory pool */}
      <MemoryPool
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.div
          animate={{
            boxShadow: [
              '0 0 20px rgba(168, 85, 247, 0.3)',
              '0 0 40px rgba(212, 175, 55, 0.4)',
              '0 0 20px rgba(168, 85, 247, 0.3)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: '80%',
            height: '80%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)'
          }}
        />
      </MemoryPool>

      {/* Dialogue content */}
      <AnimatePresence>
        <MemoryDialogueBox
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SpeakerName>{dialogue.speaker}</SpeakerName>
          
          <MemoryText
            dangerouslySetInnerHTML={{ __html: processedText }}
          />

          {/* Memory dive choices */}
          {showChoices && dialogue.choices && (
            <MemoryChoicesContainer>
              {dialogue.choices.map((choice, index) => (
                <motion.div
                  key={choice.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.4 }}
                >
                  <MemoryChoiceButton
                    onClick={() => handleChoiceClick(choice)}
                    disabled={!isChoiceAvailable(choice)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {choice.text}
                    {choice.glyphUsed && (
                      <div style={{ 
                        fontSize: '0.8em', 
                        color: '#d4af37', 
                        marginTop: '4px',
                        fontStyle: 'italic'
                      }}>
                        [Uses glyph: {choice.glyphUsed}]
                      </div>
                    )}
                    {choice.requiresLanguages && (
                      <div style={{ 
                        fontSize: '0.8em', 
                        color: isChoiceAvailable(choice) ? '#34d399' : '#f87171',
                        marginTop: '4px'
                      }}>
                        Requires: {choice.requiresLanguages.join(', ')}
                      </div>
                    )}
                  </MemoryChoiceButton>
                </motion.div>
              ))}
            </MemoryChoicesContainer>
          )}

          {!dialogue.choices && !dialogue.autoAdvance && (
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
        </MemoryDialogueBox>
      </AnimatePresence>
    </MemoryDiveContainer>
  );
};

export default MemoryDiveComponent;