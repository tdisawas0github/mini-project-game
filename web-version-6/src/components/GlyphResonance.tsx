import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useGameState } from '../hooks/useGameState';

const ResonanceContainer = styled.div`
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
  color: #e0e0e0;
  padding: 2rem;
  min-height: 100vh;
  overflow-y: auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    color: #d4af37;
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
  }
  
  p {
    color: #b0b0b0;
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const GlyphLaboratory = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const ExperimentArea = styled.div`
  background: linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%);
  border: 2px solid #444;
  border-radius: 16px;
  padding: 2rem;
`;

const ResonanceCircle = styled.div`
  width: 400px;
  height: 400px;
  margin: 2rem auto;
  border: 3px solid #d4af37;
  border-radius: 50%;
  position: relative;
  background: radial-gradient(
    circle at center,
    rgba(212, 175, 55, 0.1) 0%,
    rgba(168, 85, 247, 0.05) 50%,
    transparent 70%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.active {
    animation: pulse 2s ease-in-out infinite;
    box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const GlyphSlot = styled.div<{ position: number; isOccupied: boolean }>`
  position: absolute;
  width: 80px;
  height: 80px;
  border: 2px dashed ${props => props.isOccupied ? '#d4af37' : '#666'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.isOccupied ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 0, 0, 0.3)'};
  cursor: ${props => props.isOccupied ? 'pointer' : 'default'};
  transition: all 0.3s ease;
  
  ${props => {
    const angle = (props.position * 60) - 90; // 6 positions around circle
    const radius = 140;
    const x = Math.cos(angle * Math.PI / 180) * radius;
    const y = Math.sin(angle * Math.PI / 180) * radius;
    return `
      left: calc(50% + ${x}px - 40px);
      top: calc(50% + ${y}px - 40px);
    `;
  }}

  .glyph {
    font-size: 2rem;
    filter: ${props => props.isOccupied ? 'brightness(1)' : 'brightness(0.5)'};
  }

  &:hover {
    transform: scale(1.1);
    border-color: #d4af37;
  }
`;

const CentralResult = styled.div`
  width: 120px;
  height: 120px;
  border: 3px solid #a855f7;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #d4af37;
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
`;

const AvailableGlyphs = styled.div`
  background: linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%);
  border: 2px solid #444;
  border-radius: 16px;
  padding: 1.5rem;
  
  h3 {
    color: #64b5f6;
    margin-bottom: 1rem;
    text-align: center;
  }
`;

const GlyphInventory = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const GlyphCard = styled.div<{ isSelected: boolean; isUsed: boolean }>`
  background: ${props => 
    props.isSelected ? 'linear-gradient(135deg, #d4af37, #b8941f)' :
    props.isUsed ? 'linear-gradient(135deg, #666, #444)' :
    'linear-gradient(135deg, #333, #222)'
  };
  border: 2px solid ${props => 
    props.isSelected ? '#d4af37' :
    props.isUsed ? '#666' :
    '#555'
  };
  border-radius: 12px;
  padding: 1rem;
  cursor: ${props => props.isUsed ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  text-align: center;
  opacity: ${props => props.isUsed ? 0.5 : 1};

  &:hover {
    transform: ${props => props.isUsed ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.isUsed ? 'none' : '0 4px 12px rgba(0,0,0,0.3)'};
  }

  .glyph {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .name {
    font-size: 0.9rem;
    color: ${props => props.isSelected ? '#000' : '#e0e0e0'};
    font-weight: 600;
  }

  .sound {
    font-size: 0.7rem;
    color: ${props => props.isSelected ? '#333' : '#999'};
    font-style: italic;
  }
`;

const ResonanceResult = styled(motion.div)`
  background: linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%);
  border: 2px solid #a855f7;
  border-radius: 16px;
  padding: 2rem;
  margin-top: 2rem;
  text-align: center;

  .result-glyph {
    font-size: 4rem;
    margin-bottom: 1rem;
    color: #d4af37;
    text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
  }

  .result-name {
    font-size: 1.5rem;
    color: #64b5f6;
    margin-bottom: 1rem;
  }

  .result-description {
    color: #c0c0c0;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .resonance-power {
    color: #a855f7;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .ethical-warning {
    color: #f59e0b;
    font-size: 0.9rem;
    font-style: italic;
    padding: 1rem;
    background: rgba(245, 158, 11, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(245, 158, 11, 0.3);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;

  button {
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;

    &.primary {
      background: linear-gradient(135deg, #64b5f6, #42a5f5);
      color: white;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(100, 181, 246, 0.3);
      }
    }

    &.secondary {
      background: linear-gradient(135deg, #666, #444);
      color: #e0e0e0;

      &:hover {
        background: linear-gradient(135deg, #777, #555);
      }
    }

    &.danger {
      background: linear-gradient(135deg, #f44336, #d32f2f);
      color: white;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
      }
    }
  }
`;

const ReturnButton = styled.button`
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%);
  border: none;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.2s ease;
  z-index: 100;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(100, 181, 246, 0.3);
  }
`;

interface GlyphResonanceProps {
  onReturn: () => void;
}

interface Glyph {
  id: string;
  symbol: string;
  name: string;
  sound: string;
  emotion: string;
  aspect: 'memory' | 'nature' | 'ritual' | 'time' | 'power' | 'balance';
  power: number;
}

interface ResonanceRecipe {
  glyphs: string[];
  result: {
    symbol: string;
    name: string;
    description: string;
    power: string;
    ethicalWarning?: string;
  };
}

const GlyphResonance = ({ onReturn }: GlyphResonanceProps) => {
  const { updateFactionInfluence } = useGameState();
  const [selectedGlyphs, setSelectedGlyphs] = useState<string[]>([]);
  const [resonanceResult, setResonanceResult] = useState<any>(null);
  const [isExperimenting, setIsExperimenting] = useState(false);

  const availableGlyphs: Glyph[] = [
    {
      id: 'memory_probe',
      symbol: '⚡',
      name: 'Flicker',
      sound: 'vel-ith',
      emotion: 'Curiosity',
      aspect: 'memory',
      power: 2
    },
    {
      id: 'childhood_song',
      symbol: '🌊',
      name: 'Warmth-tide',
      sound: 'mor-aethys',
      emotion: 'Comfort',
      aspect: 'nature',
      power: 3
    },
    {
      id: 'ritual_binding',
      symbol: '🔥',
      name: 'Sacred Bind',
      sound: 'sanctus-nex',
      emotion: 'Solemnity',
      aspect: 'ritual',
      power: 4
    },
    {
      id: 'ancient_grief',
      symbol: '❄️',
      name: 'Chronos-grief',
      sound: 'páthos-chronos',
      emotion: 'Melancholy',
      aspect: 'time',
      power: 5
    },
    {
      id: 'thread_bind',
      symbol: '🧵',
      name: 'Thread-bind',
      sound: 'mem-tessere',
      emotion: 'Purpose',
      aspect: 'power',
      power: 4
    },
    {
      id: 'harmonic_balance',
      symbol: '⚖️',
      name: 'Harmony-weave',
      sound: 'aequi-sonitus',
      emotion: 'Peace',
      aspect: 'balance',
      power: 3
    }
  ];

  const resonanceRecipes: ResonanceRecipe[] = [
    {
      glyphs: ['memory_probe', 'childhood_song'],
      result: {
        symbol: '🌟',
        name: 'Nostalgic Revelation',
        description: 'Combines curiosity with comfort to unlock buried childhood memories safely.',
        power: 'Creates gentle pathways through traumatic memory blocks'
      }
    },
    {
      glyphs: ['ritual_binding', 'harmonic_balance'],
      result: {
        symbol: '🔮',
        name: 'Sacred Equilibrium',
        description: 'Balances the power of ritual magic with ethical considerations.',
        power: 'Enables controlled reality manipulation within moral bounds'
      }
    },
    {
      glyphs: ['ancient_grief', 'thread_bind'],
      result: {
        symbol: '⌛',
        name: 'Temporal Reconstruction',
        description: 'Weaves past sorrows into present understanding.',
        power: 'Allows limited temporal perception and memory healing',
        ethicalWarning: 'Dangerous: Can unravel the user\'s sense of linear time'
      }
    },
    {
      glyphs: ['memory_probe', 'ritual_binding', 'ancient_grief'],
      result: {
        symbol: '💀',
        name: 'Memory Dissolution',
        description: 'A powerful but dangerous combination that can completely erase memories.',
        power: 'Total memory manipulation and erasure capabilities',
        ethicalWarning: 'EXTREME DANGER: Can permanently destroy memories and identity'
      }
    }
  ];

  const handleGlyphSelect = (glyphId: string) => {
    if (selectedGlyphs.includes(glyphId)) {
      setSelectedGlyphs(selectedGlyphs.filter(id => id !== glyphId));
    } else if (selectedGlyphs.length < 3) {
      setSelectedGlyphs([...selectedGlyphs, glyphId]);
    }
  };

  const handleExperiment = () => {
    if (selectedGlyphs.length < 2) return;

    setIsExperimenting(true);
    
    // Simulate experiment time
    setTimeout(() => {
      const recipe = resonanceRecipes.find(r => 
        r.glyphs.length === selectedGlyphs.length &&
        r.glyphs.every(glyph => selectedGlyphs.includes(glyph))
      );

      if (recipe) {
        setResonanceResult(recipe.result);
        // Award faction influence based on the type of experiment
        if (recipe.result.name.includes('Sacred')) {
          updateFactionInfluence('institute', 2);
        } else if (recipe.result.name.includes('Harmony')) {
          updateFactionInfluence('clans', 2);
        } else if (recipe.result.ethicalWarning) {
          updateFactionInfluence('echoborn', 3);
        }
      } else {
        setResonanceResult({
          symbol: '💨',
          name: 'Unstable Resonance',
          description: 'The glyphs resonate chaotically. This combination doesn\'t create a stable effect.',
          power: 'No usable power generated - energies dissipated harmlessly'
        });
      }
      
      setIsExperimenting(false);
    }, 3000);
  };

  const handleReset = () => {
    setSelectedGlyphs([]);
    setResonanceResult(null);
  };

  const getSelectedGlyph = (index: number) => {
    const glyphId = selectedGlyphs[index];
    return glyphId ? availableGlyphs.find(g => g.id === glyphId) : null;
  };

  return (
    <ResonanceContainer>
      <ReturnButton onClick={onReturn}>
        ← Return to Hub
      </ReturnButton>

      <Header>
        <h1>🔮 Glyph Resonance Laboratory</h1>
        <p>
          Experiment with combining Ellidric glyphs to discover new powers and meanings. 
          Each combination creates unique resonances that can unlock deeper understanding 
          of the ancient language - but beware of dangerous interactions.
        </p>
      </Header>

      <GlyphLaboratory>
        <ExperimentArea>
          <h3 style={{ color: '#64b5f6', textAlign: 'center', marginBottom: '2rem' }}>
            Resonance Circle
          </h3>
          
          <ResonanceCircle className={isExperimenting ? 'active' : ''}>
            {[0, 1, 2, 3, 4, 5].map(position => {
              const glyph = getSelectedGlyph(position);
              return (
                <GlyphSlot 
                  key={position} 
                  position={position} 
                  isOccupied={!!glyph}
                  onClick={() => glyph && handleGlyphSelect(glyph.id)}
                >
                  {glyph && <div className="glyph">{glyph.symbol}</div>}
                </GlyphSlot>
              );
            })}
            
            <CentralResult>
              {isExperimenting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  🌀
                </motion.div>
              ) : resonanceResult ? (
                resonanceResult.symbol
              ) : (
                '?'
              )}
            </CentralResult>
          </ResonanceCircle>

          <ActionButtons>
            <button 
              className="primary" 
              onClick={handleExperiment}
              disabled={selectedGlyphs.length < 2 || isExperimenting}
            >
              {isExperimenting ? 'Experimenting...' : '🧪 Begin Resonance'}
            </button>
            <button className="secondary" onClick={handleReset}>
              🔄 Reset Circle
            </button>
          </ActionButtons>

          {resonanceResult && (
            <AnimatePresence>
              <ResonanceResult
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
              >
                <div className="result-glyph">{resonanceResult.symbol}</div>
                <div className="result-name">{resonanceResult.name}</div>
                <div className="result-description">{resonanceResult.description}</div>
                <div className="resonance-power">Power: {resonanceResult.power}</div>
                {resonanceResult.ethicalWarning && (
                  <div className="ethical-warning">
                    ⚠️ {resonanceResult.ethicalWarning}
                  </div>
                )}
              </ResonanceResult>
            </AnimatePresence>
          )}
        </ExperimentArea>

        <AvailableGlyphs>
          <h3>📚 Available Glyphs</h3>
          <GlyphInventory>
            {availableGlyphs.map(glyph => (
              <GlyphCard
                key={glyph.id}
                isSelected={selectedGlyphs.includes(glyph.id)}
                isUsed={false}
                onClick={() => handleGlyphSelect(glyph.id)}
              >
                <div className="glyph">{glyph.symbol}</div>
                <div className="name">{glyph.name}</div>
                <div className="sound">{glyph.sound}</div>
              </GlyphCard>
            ))}
          </GlyphInventory>

          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            background: 'rgba(100, 181, 246, 0.1)', 
            borderRadius: '8px',
            border: '1px solid rgba(100, 181, 246, 0.3)'
          }}>
            <h4 style={{ color: '#64b5f6', marginBottom: '0.5rem' }}>💡 Experimentation Tips:</h4>
            <ul style={{ color: '#c0c0c0', fontSize: '0.9rem', lineHeight: '1.5' }}>
              <li>Combine 2-3 glyphs for different effects</li>
              <li>Similar aspects create stable resonances</li>
              <li>Opposing forces may create dangerous results</li>
              <li>Each discovery advances your understanding</li>
            </ul>
          </div>
        </AvailableGlyphs>
      </GlyphLaboratory>
    </ResonanceContainer>
  );
};

export default GlyphResonance;