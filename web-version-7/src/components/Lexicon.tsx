import React from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import {
  HubContainer,
  HubTitle,
  ChoiceButton
} from '../styles/visualNovel';
import styled from 'styled-components';

const LexiconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  max-width: 1000px;
  width: 100%;
`;

const GlyphGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  width: 100%;
`;

const GlyphCard = styled.div`
  background: linear-gradient(135deg, 
    rgba(15, 15, 35, 0.9) 0%, 
    rgba(26, 26, 46, 0.95) 50%, 
    rgba(22, 33, 62, 0.9) 100%
  );
  border: 2px solid rgba(212, 175, 55, 0.4);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
    border-color: rgba(212, 175, 55, 0.7);
  }
`;

const GlyphSymbol = styled.div`
  font-size: 3em;
  text-align: center;
  margin-bottom: 16px;
  filter: drop-shadow(0 2px 8px rgba(212, 175, 55, 0.3));
`;

const GlyphName = styled.h3`
  color: #d4af37;
  text-align: center;
  margin-bottom: 16px;
  font-size: 1.4em;
`;

const GlyphLayer = styled.div`
  margin-bottom: 12px;
  font-size: 0.9em;
  
  .layer-title {
    color: #60a5fa;
    font-weight: 600;
    display: block;
    margin-bottom: 4px;
  }
  
  .layer-content {
    color: #d1d5db;
    font-style: italic;
    line-height: 1.4;
  }
`;

const LanguageRequirement = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(148, 163, 184, 0.3);
  font-size: 0.85em;
  color: #9ca3af;
  
  .language-tag {
    background: rgba(59, 130, 246, 0.2);
    color: #93c5fd;
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid rgba(59, 130, 246, 0.3);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
  
  .empty-icon {
    font-size: 4em;
    margin-bottom: 20px;
    opacity: 0.5;
  }
  
  .empty-title {
    font-size: 1.3em;
    margin-bottom: 12px;
    color: #9ca3af;
  }
  
  .empty-description {
    font-size: 1em;
    line-height: 1.6;
    max-width: 400px;
    margin: 0 auto;
  }
`;

interface LexiconProps {
  onReturn: () => void;
}

const Lexicon: React.FC<LexiconProps> = ({ onReturn }) => {
  const { gameState } = useGameState();

  return (
    <HubContainer>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <HubTitle>Ellidric Lexicon</HubTitle>
      </motion.div>

      <LexiconContainer>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ textAlign: 'center', color: '#9ca3af', maxWidth: '600px' }}
        >
          <p>
            The ancient language of memory and reality. Each glyph carries four layers of meaning:
            its sound, the emotion it evokes, the memory it tethers to, and the weight of its ethics.
          </p>
        </motion.div>

        {gameState.unlockedGlyphs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <EmptyState>
              <div className="empty-icon">📚</div>
              <div className="empty-title">Your Lexicon Awaits</div>
              <div className="empty-description">
                As you learn new languages and make choices, you will unlock the meanings 
                of ancient Ellidric glyphs. Each symbol holds layers of power waiting to 
                be discovered through your linguistic journey.
              </div>
            </EmptyState>
          </motion.div>
        ) : (
          <GlyphGrid>
            {gameState.unlockedGlyphs.map((glyph, index) => (
              <motion.div
                key={glyph.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              >
                <GlyphCard>
                  <GlyphSymbol>{glyph.symbol}</GlyphSymbol>
                  <GlyphName>{glyph.name}</GlyphName>
                  
                  <GlyphLayer>
                    <span className="layer-title">Sound Layer:</span>
                    <div className="layer-content">"{glyph.sound}"</div>
                  </GlyphLayer>
                  
                  <GlyphLayer>
                    <span className="layer-title">Emotional Layer:</span>
                    <div className="layer-content">{glyph.emotion}</div>
                  </GlyphLayer>
                  
                  <GlyphLayer>
                    <span className="layer-title">Mnemonic Tether:</span>
                    <div className="layer-content">{glyph.mnemonicTether}</div>
                  </GlyphLayer>
                  
                  <GlyphLayer>
                    <span className="layer-title">Ethical Resonance:</span>
                    <div className="layer-content">{glyph.ethicalResonance}</div>
                  </GlyphLayer>
                  
                  {glyph.unlockedBy && (
                    <LanguageRequirement>
                      <span>Revealed by:</span>
                      {glyph.unlockedBy.map(lang => (
                        <span key={lang} className="language-tag">
                          {lang}
                        </span>
                      ))}
                    </LanguageRequirement>
                  )}
                </GlyphCard>
              </motion.div>
            ))}
          </GlyphGrid>
        )}

        {gameState.unlockedGlyphs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
            style={{ 
              textAlign: 'center',
              padding: '20px',
              background: 'rgba(15, 15, 35, 0.6)',
              borderRadius: '12px',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              width: '100%'
            }}
          >
            <div style={{ color: '#d4af37', marginBottom: '8px', fontWeight: '600' }}>
              Linguistic Progress
            </div>
            <div style={{ fontSize: '0.9em', color: '#9ca3af' }}>
              You have unlocked <strong>{gameState.unlockedGlyphs.length}</strong> glyphs
              through <strong>{gameState.knownLanguages.length}</strong> languages.
              Each new tongue reveals different aspects of Ellidric's power.
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
        >
          <ChoiceButton 
            onClick={onReturn}
            style={{ marginTop: '20px' }}
          >
            ← Return to Hub
          </ChoiceButton>
        </motion.div>
      </LexiconContainer>
    </HubContainer>
  );
};

export default Lexicon;