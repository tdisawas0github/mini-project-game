import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import type { MemoryDriftZone, ExtendedGameState } from '../types/quest';

const MemoryDriftContainer = styled(motion.div)`
  min-height: 100vh;
  background: linear-gradient(135deg, #2d1b69 0%, #11998e 50%, #38ef7d 100%);
  padding: 2rem;
  color: white;
  font-family: 'Cinzel', serif;
  position: relative;
  overflow: hidden;
`;

const DriftParticles = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
`;

const Particle = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
`;

const DriftHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    color: #ffd700;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 1.2rem;
    color: #b8860b;
    font-style: italic;
  }
`;

const StabilityMeter = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto 2rem;
  padding: 1rem;
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
`;

const StabilityBar = styled.div<{ $stability: number }>`
  width: 100%;
  height: 20px;
  background: rgba(255,255,255,0.2);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.$stability}%;
    background: linear-gradient(90deg, 
      ${props => props.$stability > 70 ? '#4CAF50' : 
                 props.$stability > 40 ? '#FFA726' : '#F44336'} 0%, 
      ${props => props.$stability > 70 ? '#8BC34A' : 
                 props.$stability > 40 ? '#FFB74D' : '#EF5350'} 100%);
    transition: width 0.5s ease, background 0.5s ease;
  }
`;

const DriftZoneGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const DriftZoneCard = styled(motion.div)<{ $stability: number, $unlocked: boolean }>`
  background: rgba(255,255,255,0.1);
  border: 2px solid ${props => {
    if (!props.$unlocked) return 'rgba(255,255,255,0.3)';
    if (props.$stability > 70) return '#4CAF50';
    if (props.$stability > 40) return '#FFA726';
    return '#F44336';
  }};
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  opacity: ${props => props.$unlocked ? 1 : 0.6};
  cursor: ${props => props.$unlocked ? 'pointer' : 'not-allowed'};
  
  &:hover {
    transform: ${props => props.$unlocked ? 'translateY(-5px)' : 'none'};
    box-shadow: ${props => props.$unlocked ? '0 10px 25px rgba(0,0,0,0.3)' : 'none'};
  }
`;

const ZoneTitle = styled.h3<{ $stability: number }>`
  color: ${props => {
    if (props.$stability > 70) return '#4CAF50';
    if (props.$stability > 40) return '#FFA726';
    return '#F44336';
  }};
  margin-bottom: 0.5rem;
  font-size: 1.4rem;
`;

const ZoneDescription = styled.p`
  color: #e6e6e6;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const ZoneInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RequiredGlyphs = styled.div`
  margin-bottom: 1rem;
`;

const GlyphChip = styled.span<{ $owned: boolean }>`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  margin: 0.2rem;
  background: ${props => props.$owned ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'};
  border: 1px solid ${props => props.$owned ? '#4CAF50' : '#F44336'};
  border-radius: 15px;
  font-size: 0.8rem;
  color: ${props => props.$owned ? '#4CAF50' : '#F44336'};
`;

const ExploreButton = styled(motion.button)<{ $canExplore: boolean }>`
  width: 100%;
  padding: 0.8rem;
  background: ${props => props.$canExplore 
    ? 'linear-gradient(45deg, #4a90e2, #357abd)' 
    : 'rgba(255,255,255,0.1)'};
  border: 2px solid ${props => props.$canExplore ? '#4a90e2' : 'rgba(255,255,255,0.3)'};
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: ${props => props.$canExplore ? 'pointer' : 'not-allowed'};
  font-size: 1rem;
  
  &:hover {
    transform: ${props => props.$canExplore ? 'translateY(-2px)' : 'none'};
  }
`;

const ExplorationInterface = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ExplorationPanel = styled(motion.div)`
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border: 3px solid #ffd700;
  border-radius: 15px;
  padding: 2rem;
  overflow-y: auto;
`;

const PuzzleArea = styled.div`
  background: rgba(255,255,255,0.1);
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  text-align: center;
`;

const GlyphSlots = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;
`;

const GlyphSlot = styled(motion.div)<{ $filled: boolean }>`
  width: 80px;
  height: 80px;
  border: 3px dashed ${props => props.$filled ? '#4CAF50' : 'rgba(255,255,255,0.5)'};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  cursor: pointer;
  background: ${props => props.$filled ? 'rgba(76, 175, 80, 0.2)' : 'transparent'};
  
  &:hover {
    border-color: #ffd700;
    background: rgba(255, 215, 0, 0.1);
  }
`;

const AvailableGlyphs = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const GlyphButton = styled(motion.button)<{ $used: boolean }>`
  width: 60px;
  height: 60px;
  border: 2px solid #ffd700;
  border-radius: 10px;
  background: ${props => props.$used ? 'rgba(255,255,255,0.1)' : 'rgba(255,215,0,0.2)'};
  color: ${props => props.$used ? '#666' : '#ffd700'};
  font-size: 1.5rem;
  cursor: ${props => props.$used ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$used ? 0.5 : 1};
  
  &:hover {
    transform: ${props => props.$used ? 'none' : 'scale(1.1)'};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const ActionButton = styled(motion.button)<{ $variant: 'primary' | 'secondary' }>`
  padding: 0.8rem 1.5rem;
  background: ${props => props.$variant === 'primary' 
    ? 'linear-gradient(45deg, #4a90e2, #357abd)' 
    : 'rgba(255,255,255,0.1)'};
  border: 2px solid ${props => props.$variant === 'primary' ? '#4a90e2' : 'rgba(255,255,255,0.3)'};
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

// Memory Drift Zones data
const memoryDriftZones: MemoryDriftZone[] = [
  {
    id: 'tutorial_drift',
    name: 'Tutorial Memory Drift',
    location: 'Whispering Woods - Northern Edge',
    description: 'A gentle drift zone perfect for learning the basics of memory manipulation.',
    stability: 85,
    corruptionLevel: 1,
    requiredGlyphs: ['memory_probe'],
    puzzleType: 'stabilization',
    rewards: {
      memoryFragments: ['childhood_memory'],
      glyphs: ['warmth_memory'],
      experience: 50,
      lore: ['First glimpse into memory manipulation']
    },
    relatedCharacters: ['lyra_veyndral'],
    plotRelevance: 'main',
    affectedByChoices: ['prologue_awakening']
  },
  {
    id: 'academic_pressure_drift',
    name: 'Academic Pressure Drift',
    location: 'Ravengard - Institute Archives',
    description: 'Memories of academic stress and the pressure to excel create unstable patterns.',
    stability: 45,
    corruptionLevel: 3,
    requiredGlyphs: ['memory_probe', 'ritual_binding'],
    puzzleType: 'restoration',
    rewards: {
      memoryFragments: ['institute_pressure', 'failed_exam'],
      glyphs: ['academic_rigor'],
      experience: 100,
      lore: ['Institute teaching methods', 'Student experiences']
    },
    relatedCharacters: ['arch_archivist_velran'],
    plotRelevance: 'faction',
    affectedByChoices: ['faction_allegiance']
  },
  {
    id: 'forest_wisdom_drift',
    name: 'Forest Wisdom Drift',
    location: 'Whispering Woods - Sacred Grove',
    description: 'Ancient memories of the forest spirits and their wisdom leak into reality.',
    stability: 70,
    corruptionLevel: 2,
    requiredGlyphs: ['childhood_song', 'memory_probe'],
    puzzleType: 'exploration',
    rewards: {
      memoryFragments: ['forest_spirits', 'ancient_wisdom'],
      glyphs: ['nature_communion'],
      experience: 75,
      lore: ['Forest spirit lore', 'Clan traditions']
    },
    relatedCharacters: ['serai'],
    plotRelevance: 'faction',
    affectedByChoices: ['clan_initiation']
  },
  {
    id: 'first_speaker_drift',
    name: 'First Speaker Memory Drift',
    location: 'Ancient Ruins - Core Chamber',
    description: 'The most dangerous drift zone, containing fragments of the First Speaker\'s memories.',
    stability: 20,
    corruptionLevel: 5,
    requiredGlyphs: ['truth_reveal', 'ancient_sorrow', 'ritual_binding'],
    puzzleType: 'corruption',
    rewards: {
      memoryFragments: ['first_speaker_origin', 'language_birth'],
      glyphs: ['pure_ellidric_fragment'],
      experience: 200,
      lore: ['Origin of Ellidric', 'First Speaker\'s fate']
    },
    relatedCharacters: ['veyth', 'lyra_veyndral'],
    plotRelevance: 'main',
    affectedByChoices: ['memory_corruption']
  }
];

interface MemoryDriftSystemProps {
  gameState: ExtendedGameState;
  onGameStateChange: (newState: ExtendedGameState) => void;
  onReturnToHub: () => void;
}

export const MemoryDriftSystem: React.FC<MemoryDriftSystemProps> = ({
  gameState,
  onGameStateChange,
  onReturnToHub
}) => {
  const [selectedZone, setSelectedZone] = useState<MemoryDriftZone | null>(null);
  const [explorationPhase, setExplorationPhase] = useState<'selection' | 'puzzle' | 'results'>('selection');
  const [puzzleSlots, setPuzzleSlots] = useState<string[]>([]);
  const [usedGlyphs, setUsedGlyphs] = useState<string[]>([]);

  // Generate floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 3 + Math.random() * 4
  }));

  // Check if zone is unlocked
  const isZoneUnlocked = (zone: MemoryDriftZone): boolean => {
    return zone.affectedByChoices.every(choice => 
      gameState.completedQuests.includes(choice) || 
      gameState.activeQuests.includes(choice)
    );
  };

  // Check if player has required glyphs
  const hasRequiredGlyphs = (zone: MemoryDriftZone): boolean => {
    return zone.requiredGlyphs.every(glyph => 
      gameState.unlockedGlyphs.includes(glyph)
    );
  };

  // Start exploration
  const startExploration = (zone: MemoryDriftZone) => {
    if (isZoneUnlocked(zone) && hasRequiredGlyphs(zone)) {
      setSelectedZone(zone);
      setExplorationPhase('puzzle');
      setPuzzleSlots(new Array(zone.requiredGlyphs.length).fill(''));
      setUsedGlyphs([]);
    }
  };

  // Place glyph in slot
  const placeGlyph = (glyph: string, slotIndex: number) => {
    if (!usedGlyphs.includes(glyph)) {
      const newSlots = [...puzzleSlots];
      const oldGlyph = newSlots[slotIndex];
      
      // Remove old glyph from used list if exists
      if (oldGlyph) {
        setUsedGlyphs(prev => prev.filter(g => g !== oldGlyph));
      }
      
      newSlots[slotIndex] = glyph;
      setPuzzleSlots(newSlots);
      setUsedGlyphs(prev => [...prev, glyph]);
    }
  };

  // Remove glyph from slot
  const removeGlyph = (slotIndex: number) => {
    const glyph = puzzleSlots[slotIndex];
    if (glyph) {
      const newSlots = [...puzzleSlots];
      newSlots[slotIndex] = '';
      setPuzzleSlots(newSlots);
      setUsedGlyphs(prev => prev.filter(g => g !== glyph));
    }
  };

  // Solve puzzle
  const solvePuzzle = () => {
    if (selectedZone && puzzleSlots.every(slot => slot !== '')) {
      // Award rewards
      const newState = {
        ...gameState,
        memoryFragments: [...gameState.memoryFragments, ...selectedZone.rewards.memoryFragments],
        unlockedGlyphs: [...gameState.unlockedGlyphs, ...(selectedZone.rewards.glyphs || [])],
        statistics: {
          ...gameState.statistics,
          memoryDriftZonesCleared: gameState.statistics.memoryDriftZonesCleared + 1,
          puzzlesSolved: gameState.statistics.puzzlesSolved + 1
        }
      };
      
      onGameStateChange(newState);
      setExplorationPhase('results');
    }
  };

  // Close exploration
  const closeExploration = () => {
    setSelectedZone(null);
    setExplorationPhase('selection');
    setPuzzleSlots([]);
    setUsedGlyphs([]);
  };

  return (
    <MemoryDriftContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <DriftParticles>
        {particles.map(particle => (
          <Particle
            key={particle.id}
            initial={{ 
              x: `${particle.x}vw`, 
              y: `${particle.y}vh`,
              opacity: 0
            }}
            animate={{ 
              y: `${particle.y - 20}vh`,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </DriftParticles>

      <ContentWrapper>
        <DriftHeader>
          <h1>🌀 Memory Drift Zones</h1>
          <p>Explore unstable memories scattered across Valdaren</p>
        </DriftHeader>

        <StabilityMeter>
          <h3>🧠 Overall Memory Stability</h3>
          <StabilityBar $stability={gameState.realityStability} />
          <p style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            Reality Stability: {gameState.realityStability}%
          </p>
        </StabilityMeter>

        <DriftZoneGrid>
          {memoryDriftZones.map(zone => {
            const unlocked = isZoneUnlocked(zone);
            const hasGlyphs = hasRequiredGlyphs(zone);
            const canExplore = unlocked && hasGlyphs;

            return (
              <DriftZoneCard
                key={zone.id}
                $stability={zone.stability}
                $unlocked={unlocked}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: unlocked ? 1.02 : 1 }}
              >
                <ZoneTitle $stability={zone.stability}>
                  {zone.name}
                </ZoneTitle>
                
                <ZoneDescription>{zone.description}</ZoneDescription>
                
                <ZoneInfo>
                  <InfoRow>
                    <span>📍 Location:</span>
                    <span>{zone.location}</span>
                  </InfoRow>
                  <InfoRow>
                    <span>⚡ Stability:</span>
                    <span>{zone.stability}%</span>
                  </InfoRow>
                  <InfoRow>
                    <span>💀 Corruption:</span>
                    <span>Level {zone.corruptionLevel}</span>
                  </InfoRow>
                  <InfoRow>
                    <span>🎯 Type:</span>
                    <span>{zone.puzzleType}</span>
                  </InfoRow>
                </ZoneInfo>
                
                <RequiredGlyphs>
                  <strong>Required Glyphs:</strong>
                  <div style={{ marginTop: '0.5rem' }}>
                    {zone.requiredGlyphs.map(glyph => (
                      <GlyphChip 
                        key={glyph}
                        $owned={gameState.unlockedGlyphs.includes(glyph)}
                      >
                        {glyph}
                      </GlyphChip>
                    ))}
                  </div>
                </RequiredGlyphs>
                
                <ExploreButton
                  $canExplore={canExplore}
                  onClick={() => canExplore && startExploration(zone)}
                  whileHover={{ scale: canExplore ? 1.05 : 1 }}
                  whileTap={{ scale: canExplore ? 0.95 : 1 }}
                  disabled={!canExplore}
                >
                  {!unlocked ? '🔒 Locked' : 
                   !hasGlyphs ? '⚠️ Missing Glyphs' : 
                   '🌀 Explore Drift'}
                </ExploreButton>
              </DriftZoneCard>
            );
          })}
        </DriftZoneGrid>

        <ActionButtons>
          <ActionButton
            $variant="secondary"
            onClick={onReturnToHub}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🏠 Return to Hub
          </ActionButton>
        </ActionButtons>
      </ContentWrapper>

      {/* Exploration Interface */}
      <AnimatePresence>
        {selectedZone && (
          <ExplorationInterface
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ExplorationPanel
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <h2>🌀 {selectedZone.name}</h2>
              <p>{selectedZone.description}</p>

              {explorationPhase === 'puzzle' && (
                <PuzzleArea>
                  <h3>Stabilize the Memory Drift</h3>
                  <p>Place the required glyphs in the correct sequence to stabilize this memory zone.</p>
                  
                  <GlyphSlots>
                    {puzzleSlots.map((glyph, index) => (
                      <GlyphSlot
                        key={index}
                        $filled={!!glyph}
                        onClick={() => removeGlyph(index)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {glyph ? '⚡' : '?'}
                      </GlyphSlot>
                    ))}
                  </GlyphSlots>
                  
                  <AvailableGlyphs>
                    {selectedZone.requiredGlyphs.map(glyph => (
                      <GlyphButton
                        key={glyph}
                        $used={usedGlyphs.includes(glyph)}
                        onClick={() => {
                          const nextSlot = puzzleSlots.findIndex(slot => slot === '');
                          if (nextSlot !== -1) placeGlyph(glyph, nextSlot);
                        }}
                        whileHover={{ scale: usedGlyphs.includes(glyph) ? 1 : 1.1 }}
                        whileTap={{ scale: usedGlyphs.includes(glyph) ? 1 : 0.9 }}
                      >
                        ⚡
                      </GlyphButton>
                    ))}
                  </AvailableGlyphs>
                  
                  <ActionButtons>
                    <ActionButton
                      $variant="primary"
                      onClick={solvePuzzle}
                      disabled={!puzzleSlots.every(slot => slot !== '')}
                    >
                      🔮 Stabilize Memory
                    </ActionButton>
                    <ActionButton
                      $variant="secondary"
                      onClick={closeExploration}
                    >
                      ❌ Cancel
                    </ActionButton>
                  </ActionButtons>
                </PuzzleArea>
              )}

              {explorationPhase === 'results' && (
                <PuzzleArea>
                  <h3>✅ Memory Drift Stabilized!</h3>
                  <p>You have successfully stabilized the memory drift and gained new insights.</p>
                  
                  <div style={{ textAlign: 'left', margin: '2rem 0' }}>
                    <h4>Rewards Gained:</h4>
                    <ul>
                      <li>💎 Experience: {selectedZone.rewards.experience}</li>
                      {selectedZone.rewards.glyphs?.map(glyph => (
                        <li key={glyph}>⚡ New Glyph: {glyph}</li>
                      ))}
                      {selectedZone.rewards.memoryFragments.map(fragment => (
                        <li key={fragment}>🧠 Memory Fragment: {fragment}</li>
                      ))}
                      {selectedZone.rewards.lore?.map(lore => (
                        <li key={lore}>📚 Lore Discovered: {lore}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <ActionButton
                    $variant="primary"
                    onClick={closeExploration}
                  >
                    ✅ Continue
                  </ActionButton>
                </PuzzleArea>
              )}
            </ExplorationPanel>
          </ExplorationInterface>
        )}
      </AnimatePresence>
    </MemoryDriftContainer>
  );
};