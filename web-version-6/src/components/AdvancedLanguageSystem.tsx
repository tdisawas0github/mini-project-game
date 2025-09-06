import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import type { EllidricDialect, ExtendedGameState } from '../types/quest';

const LanguageSystemContainer = styled(motion.div)`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 2rem;
  color: white;
  font-family: 'Merriweather', serif;
`;

const LanguageHeader = styled.div`
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

const TabSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const TabButton = styled(motion.button)<{ $active: boolean }>`
  padding: 0.8rem 1.5rem;
  background: ${props => props.$active ? 'linear-gradient(45deg, #4a90e2, #357abd)' : 'rgba(255,255,255,0.1)'};
  border: 2px solid ${props => props.$active ? '#4a90e2' : 'rgba(255,255,255,0.3)'};
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$active ? 'linear-gradient(45deg, #4a90e2, #357abd)' : 'rgba(255,255,255,0.2)'};
    transform: translateY(-2px);
  }
`;

const DialectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const DialectCard = styled(motion.div)<{ $unlocked: boolean, $faction: string }>`
  background: rgba(255,255,255,0.1);
  border: 2px solid ${props => {
    if (!props.$unlocked) return 'rgba(255,255,255,0.3)';
    switch(props.$faction) {
      case 'institute': return '#4a90e2';
      case 'clans': return '#90ee90';
      case 'echoborn': return '#9370db';
      default: return '#ffd700';
    }
  }};
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  opacity: ${props => props.$unlocked ? 1 : 0.6};
  
  &:hover {
    transform: ${props => props.$unlocked ? 'translateY(-5px)' : 'none'};
    box-shadow: ${props => props.$unlocked ? '0 10px 25px rgba(0,0,0,0.3)' : 'none'};
  }
`;

const DialectTitle = styled.h3<{ $faction: string }>`
  color: ${props => {
    switch(props.$faction) {
      case 'institute': return '#4a90e2';
      case 'clans': return '#90ee90';
      case 'echoborn': return '#9370db';
      default: return '#ffd700';
    }
  }};
  margin-bottom: 0.5rem;
  font-size: 1.4rem;
`;

const DialectDescription = styled.p`
  color: #e6e6e6;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const MasteryLevel = styled.div<{ $level: string }>`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
  
  background: ${props => {
    switch(props.$level) {
      case 'master': return 'linear-gradient(45deg, #ffd700, #ffed4e)';
      case 'adept': return 'linear-gradient(45deg, #c0392b, #e74c3c)';
      case 'novice': return 'linear-gradient(45deg, #27ae60, #2ecc71)';
      default: return 'rgba(255,255,255,0.2)';
    }
  }};
  
  color: ${props => props.$level === 'locked' ? '#ccc' : '#000'};
`;

const ProgressBar = styled.div<{ $progress: number }>`
  width: 100%;
  height: 8px;
  background: rgba(255,255,255,0.2);
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0;
  
  &::after {
    content: '';
    display: block;
    width: ${props => props.$progress}%;
    height: 100%;
    background: linear-gradient(90deg, #4a90e2, #90ee90, #ffd700);
    transition: width 0.3s ease;
  }
`;

const LessonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const LessonCard = styled(motion.div)<{ $completed: boolean, $locked: boolean }>`
  background: rgba(255,255,255,0.1);
  border: 2px solid ${props => {
    if (props.$locked) return 'rgba(255,255,255,0.3)';
    if (props.$completed) return '#90ee90';
    return '#ffd700';
  }};
  border-radius: 8px;
  padding: 1rem;
  opacity: ${props => props.$locked ? 0.5 : 1};
  cursor: ${props => props.$locked ? 'not-allowed' : 'pointer'};
  
  &:hover {
    transform: ${props => props.$locked ? 'none' : 'translateY(-3px)'};
    box-shadow: ${props => props.$locked ? 'none' : '0 5px 15px rgba(0,0,0,0.2)'};
  }
`;

const ChallengeInterface = styled(motion.div)`
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

const ChallengePanel = styled(motion.div)`
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border: 3px solid #ffd700;
  border-radius: 15px;
  padding: 2rem;
  overflow-y: auto;
`;

const PhraseDisplay = styled.div`
  background: rgba(255,255,255,0.1);
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  text-align: center;
  font-size: 1.5rem;
  color: #ffd700;
`;

const TranslationInput = styled.input`
  width: 100%;
  padding: 1rem;
  background: rgba(255,255,255,0.1);
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 8px;
  color: white;
  font-size: 1.1rem;
  margin: 1rem 0;
  
  &:focus {
    outline: none;
    border-color: #ffd700;
  }
  
  &::placeholder {
    color: rgba(255,255,255,0.5);
  }
`;

const MultipleChoice = styled.div`
  display: grid;
  gap: 1rem;
  margin: 2rem 0;
`;

const ChoiceButton = styled(motion.button)<{ $selected: boolean, $correct?: boolean, $incorrect?: boolean }>`
  padding: 1rem;
  background: ${props => {
    if (props.$incorrect) return 'rgba(244, 67, 54, 0.3)';
    if (props.$correct) return 'rgba(76, 175, 80, 0.3)';
    if (props.$selected) return 'rgba(255, 215, 0, 0.3)';
    return 'rgba(255,255,255,0.1)';
  }};
  border: 2px solid ${props => {
    if (props.$incorrect) return '#F44336';
    if (props.$correct) return '#4CAF50';
    if (props.$selected) return '#ffd700';
    return 'rgba(255,255,255,0.3)';
  }};
  border-radius: 8px;
  color: white;
  text-align: left;
  cursor: pointer;
  
  &:hover {
    background: rgba(255,255,255,0.2);
  }
`;

const Timer = styled.div<{ $timeLeft: number, $totalTime: number }>`
  width: 100%;
  height: 6px;
  background: rgba(255,255,255,0.2);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 1rem;
  
  &::after {
    content: '';
    display: block;
    width: ${props => (props.$timeLeft / props.$totalTime) * 100}%;
    height: 100%;
    background: ${props => props.$timeLeft / props.$totalTime > 0.3 ? '#4CAF50' : '#F44336'};
    transition: width 0.1s linear;
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
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

// Ellidric dialects data
const ellidricDialects: EllidricDialect[] = [
  {
    id: 'codex_ellidric',
    name: 'Codex Ellidric',
    description: 'The standardized form of Ellidric used by the Institute. Precise and methodical.',
    faction: 'institute',
    unlockRequirements: [],
    uniqueGlyphs: ['academic_rigor', 'systematic_thought', 'controlled_memory'],
    puzzleTypes: ['translation', 'syntax_correction', 'formal_analysis'],
    communicationBonuses: ['arch_archivist_velran', 'institute_scholars'],
    masteryLevels: {
      novice: { 
        requirements: ['complete_tutorial'], 
        unlocks: ['institute_access', 'basic_archive_research'] 
      },
      adept: { 
        requirements: ['complete_institute_initiation', 'learn_10_glyphs'], 
        unlocks: ['advanced_archives', 'research_collaboration'] 
      },
      master: { 
        requirements: ['complete_faction_questline', 'perfect_5_exams'], 
        unlocks: ['forbidden_knowledge', 'institute_leadership'] 
      }
    }
  },
  {
    id: 'verdant_ellidric',
    name: 'Verdant Ellidric',
    description: 'The living form of Ellidric spoken by the Clans. Words shift and grow like forest life.',
    faction: 'clans',
    unlockRequirements: ['meet_serai', 'visit_sacred_grove'],
    uniqueGlyphs: ['nature_communion', 'living_word', 'forest_memory'],
    puzzleTypes: ['organic_growth', 'seasonal_cycles', 'natural_harmony'],
    communicationBonuses: ['serai', 'clan_storykeepers', 'forest_spirits'],
    masteryLevels: {
      novice: { 
        requirements: ['clan_initiation'], 
        unlocks: ['forest_navigation', 'plant_communication'] 
      },
      adept: { 
        requirements: ['forest_communion', 'speak_with_spirits'], 
        unlocks: ['weather_influence', 'animal_allies'] 
      },
      master: { 
        requirements: ['become_storykeeper', 'merge_with_forest'], 
        unlocks: ['nature_mastery', 'druidic_powers'] 
      }
    }
  },
  {
    id: 'glacial_ellidric',
    name: 'Glacial Ellidric',
    description: 'The preserved ancient form found in frozen memories. Crystalline and timeless.',
    faction: 'neutral',
    unlockRequirements: ['explore_lumisth_glacier', 'find_frozen_memories'],
    uniqueGlyphs: ['time_crystal', 'preservation_ward', 'ancient_echo'],
    puzzleTypes: ['temporal_alignment', 'memory_preservation', 'crystal_resonance'],
    communicationBonuses: ['ancient_spirits', 'time_guardians'],
    masteryLevels: {
      novice: { 
        requirements: ['decipher_ice_glyphs'], 
        unlocks: ['cold_resistance', 'temporal_sight'] 
      },
      adept: { 
        requirements: ['restore_frozen_memory', 'commune_with_glacier'], 
        unlocks: ['time_manipulation', 'preservation_magic'] 
      },
      master: { 
        requirements: ['become_time_keeper', 'master_temporal_flow'], 
        unlocks: ['chronos_mastery', 'eternal_memory'] 
      }
    }
  },
  {
    id: 'echo_ellidric',
    name: 'Echo Ellidric',
    description: 'The mysterious dialect of the Echoborn. Words that exist between meaning and memory.',
    faction: 'echoborn',
    unlockRequirements: ['meet_veyth', 'prove_understanding'],
    uniqueGlyphs: ['echo_resonance', 'void_speech', 'memory_fragment'],
    puzzleTypes: ['consciousness_merging', 'reality_questioning', 'identity_dissolution'],
    communicationBonuses: ['veyth', 'other_echoborn', 'memory_entities'],
    masteryLevels: {
      novice: { 
        requirements: ['echo_meditation'], 
        unlocks: ['see_memory_echoes', 'hear_forgotten_voices'] 
      },
      adept: { 
        requirements: ['identity_trial', 'memory_sacrifice'], 
        unlocks: ['consciousness_travel', 'echo_manifestation'] 
      },
      master: { 
        requirements: ['become_echo', 'transcend_mortality'], 
        unlocks: ['reality_alteration', 'memory_godhood'] 
      }
    }
  },
  {
    id: 'pure_ellidric',
    name: 'Pure Ellidric',
    description: 'The original language of creation itself. Words that shaped reality before recorded time.',
    faction: 'ancient',
    unlockRequirements: ['master_all_dialects', 'find_first_speaker_memory'],
    uniqueGlyphs: ['creation_word', 'reality_shaper', 'universal_truth'],
    puzzleTypes: ['reality_restructuring', 'universal_harmony', 'creation_paradox'],
    communicationBonuses: ['first_speaker_echo', 'creation_entities', 'reality_itself'],
    masteryLevels: {
      novice: { 
        requirements: ['decode_creation_fragment'], 
        unlocks: ['minor_reality_edits', 'truth_sight'] 
      },
      adept: { 
        requirements: ['speak_creation_word', 'reshape_small_reality'], 
        unlocks: ['major_alterations', 'time_space_manipulation'] 
      },
      master: { 
        requirements: ['become_new_speaker', 'master_creation_itself'], 
        unlocks: ['world_creation', 'universal_mastery'] 
      }
    }
  }
];

interface AdvancedLanguageSystemProps {
  gameState: ExtendedGameState;
  onGameStateChange: (newState: ExtendedGameState) => void;
  onReturnToHub: () => void;
}

export const AdvancedLanguageSystem: React.FC<AdvancedLanguageSystemProps> = ({
  gameState,
  onGameStateChange,
  onReturnToHub
}) => {
  const [activeTab, setActiveTab] = useState<'dialects' | 'lessons' | 'challenges'>('dialects');
  const [currentChallenge, setCurrentChallenge] = useState<any>(null);
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Sample challenges for each dialect
  const generateChallenge = (dialect: EllidricDialect) => {
    const challenges = {
      codex_ellidric: [
        {
          type: 'translation',
          phrase: 'vel-ith sanctum memoria',
          question: 'Translate this formal Codex Ellidric phrase:',
          answer: 'Sacred memory flicker',
          choices: ['Sacred memory flicker', 'Ancient light memory', 'Holy forgotten past', 'Divine memory echo']
        }
      ],
      verdant_ellidric: [
        {
          type: 'organic_growth',
          phrase: 'mor-aethys silva crescere',
          question: 'Complete this living phrase as it would naturally grow:',
          answer: 'warmth-tide forest growing into eternal spring',
          choices: ['warmth-tide forest growing into eternal spring', 'warm forest always growing', 'tide-forest spring eternal', 'growing warmth in forest']
        }
      ],
      glacial_ellidric: [
        {
          type: 'temporal_alignment',
          phrase: 'chronos-páthos crystallum',
          question: 'Align this temporal phrase with the correct era:',
          answer: 'time-sorrow crystal from the First Age',
          choices: ['time-sorrow crystal from the First Age', 'ancient sad crystal', 'crystal of time and pain', 'frozen moment of grief']
        }
      ]
    };

    const dialectChallenges = challenges[dialect.id as keyof typeof challenges] || [];
    return dialectChallenges[Math.floor(Math.random() * dialectChallenges.length)];
  };

  // Check if dialect is unlocked
  const isDialectUnlocked = (dialect: EllidricDialect): boolean => {
    return dialect.unlockRequirements.every(req => 
      gameState.completedQuests.includes(req) || 
      gameState.unlockedLocations.includes(req) ||
      gameState.characterRelationships[req] > 0
    );
  };

  // Get mastery level for dialect
  const getMasteryLevel = (dialectId: string): 'locked' | 'novice' | 'adept' | 'master' => {
    return gameState.dialectMastery[dialectId] || 'locked';
  };

  // Calculate progress for dialect
  const calculateDialectProgress = (dialect: EllidricDialect): number => {
    const mastery = getMasteryLevel(dialect.id);
    switch (mastery) {
      case 'novice': return 25;
      case 'adept': return 65;
      case 'master': return 100;
      default: return 0;
    }
  };

  // Start a timed challenge
  const startTimedChallenge = (dialect: EllidricDialect) => {
    const challenge = generateChallenge(dialect);
    setCurrentChallenge({ ...challenge, dialect });
    setTimeLeft(60); // 60 seconds
    setSelectedChoice(null);
    setChallengeAnswer('');
    setShowResults(false);
  };

  // Timer effect
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (timeLeft > 0 && currentChallenge && !showResults) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && currentChallenge && !showResults) {
      submitAnswer();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, currentChallenge, showResults]);

  // Submit answer
  const submitAnswer = () => {
    if (!currentChallenge) return;

    const isCorrect = selectedChoice !== null 
      ? currentChallenge.choices[selectedChoice] === currentChallenge.answer
      : challengeAnswer.toLowerCase().trim() === currentChallenge.answer.toLowerCase().trim();

    if (isCorrect) {
      // Award experience and possibly advance mastery
      const newState = {
        ...gameState,
        statistics: {
          ...gameState.statistics,
          puzzlesSolved: gameState.statistics.puzzlesSolved + 1,
          perfectSolutions: isCorrect ? gameState.statistics.perfectSolutions + 1 : gameState.statistics.perfectSolutions
        }
      };
      onGameStateChange(newState);
    }

    setShowResults(true);
  };

  // Close challenge
  const closeChallenge = () => {
    setCurrentChallenge(null);
    setSelectedChoice(null);
    setChallengeAnswer('');
    setShowResults(false);
    setTimeLeft(0);
  };

  return (
    <LanguageSystemContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <LanguageHeader>
        <h1>📚 Advanced Ellidric Studies</h1>
        <p>Master the dialects of the ancient language that shapes reality</p>
      </LanguageHeader>

      <TabSection>
        {[
          { id: 'dialects', label: '🗣️ Dialects' },
          { id: 'lessons', label: '📖 Lessons' },
          { id: 'challenges', label: '⚡ Challenges' }
        ].map(tab => (
          <TabButton
            key={tab.id}
            $active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabSection>

      <AnimatePresence mode="wait">
        {activeTab === 'dialects' && (
          <DialectGrid>
            {ellidricDialects.map(dialect => {
              const unlocked = isDialectUnlocked(dialect);
              const mastery = getMasteryLevel(dialect.id);
              const progress = calculateDialectProgress(dialect);

              return (
                <DialectCard
                  key={dialect.id}
                  $unlocked={unlocked}
                  $faction={dialect.faction}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: unlocked ? 1.02 : 1 }}
                >
                  <DialectTitle $faction={dialect.faction}>
                    {dialect.name}
                  </DialectTitle>
                  
                  <MasteryLevel $level={mastery}>
                    {mastery === 'locked' ? '🔒 Locked' : `${mastery.charAt(0).toUpperCase() + mastery.slice(1)} Level`}
                  </MasteryLevel>
                  
                  <DialectDescription>{dialect.description}</DialectDescription>
                  
                  {unlocked && (
                    <ProgressBar $progress={progress} />
                  )}
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Unique Features:</strong>
                    <ul style={{ margin: '0.5rem 0', paddingLeft: '1rem' }}>
                      {dialect.puzzleTypes.slice(0, 2).map(type => (
                        <li key={type} style={{ fontSize: '0.9rem' }}>
                          {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {unlocked ? (
                    <ActionButton
                      $variant="primary"
                      onClick={() => startTimedChallenge(dialect)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ⚡ Practice Challenge
                    </ActionButton>
                  ) : (
                    <ActionButton
                      $variant="secondary"
                      disabled
                    >
                      🔒 Complete Requirements
                    </ActionButton>
                  )}
                </DialectCard>
              );
            })}
          </DialectGrid>
        )}

        {activeTab === 'lessons' && (
          <LessonGrid>
            {ellidricDialects.filter(d => isDialectUnlocked(d)).map(dialect => (
              <LessonCard
                key={dialect.id}
                $completed={getMasteryLevel(dialect.id) === 'master'}
                $locked={false}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <h4>{dialect.name} Mastery Path</h4>
                <p>Progress through the structured learning path for this dialect.</p>
                
                {Object.entries(dialect.masteryLevels).map(([level, data]) => (
                  <div key={level} style={{ margin: '0.5rem 0', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <strong>{level.charAt(0).toUpperCase() + level.slice(1)}:</strong>
                    <div style={{ fontSize: '0.8rem', color: '#ccc' }}>
                      Unlocks: {data.unlocks.join(', ')}
                    </div>
                  </div>
                ))}
              </LessonCard>
            ))}
          </LessonGrid>
        )}

        {activeTab === 'challenges' && (
          <div style={{ textAlign: 'center' }}>
            <h2>⚡ Polyglot Challenges</h2>
            <p>Test your mastery across multiple dialects in timed challenges.</p>
            
            <div style={{ margin: '2rem 0' }}>
              <ActionButton
                $variant="primary"
                onClick={() => {
                  const availableDialects = ellidricDialects.filter(d => isDialectUnlocked(d));
                  if (availableDialects.length > 0) {
                    const randomDialect = availableDialects[Math.floor(Math.random() * availableDialects.length)];
                    startTimedChallenge(randomDialect);
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎲 Random Challenge
              </ActionButton>
            </div>
            
            <div style={{ color: '#b8860b', fontSize: '0.9rem' }}>
              Complete challenges to improve your mastery and unlock new abilities.
            </div>
          </div>
        )}
      </AnimatePresence>

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

      {/* Challenge Interface */}
      <AnimatePresence>
        {currentChallenge && (
          <ChallengeInterface
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ChallengePanel
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <h2>⚡ {currentChallenge.dialect.name} Challenge</h2>
              
              {timeLeft > 0 && !showResults && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Time Remaining:</span>
                    <span>{timeLeft}s</span>
                  </div>
                  <Timer $timeLeft={timeLeft} $totalTime={60} />
                </div>
              )}
              
              <PhraseDisplay>
                {currentChallenge.phrase}
              </PhraseDisplay>
              
              <p style={{ textAlign: 'center', margin: '1rem 0' }}>
                {currentChallenge.question}
              </p>
              
              {!showResults ? (
                currentChallenge.choices ? (
                  <MultipleChoice>
                    {currentChallenge.choices.map((choice: string, index: number) => (
                      <ChoiceButton
                        key={index}
                        $selected={selectedChoice === index}
                        onClick={() => setSelectedChoice(index)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {choice}
                      </ChoiceButton>
                    ))}
                  </MultipleChoice>
                ) : (
                  <TranslationInput
                    value={challengeAnswer}
                    onChange={(e) => setChallengeAnswer(e.target.value)}
                    placeholder="Enter your translation..."
                  />
                )
              ) : (
                <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                  <h3 style={{ color: selectedChoice !== null 
                    ? (currentChallenge.choices[selectedChoice] === currentChallenge.answer ? '#4CAF50' : '#F44336')
                    : (challengeAnswer.toLowerCase().trim() === currentChallenge.answer.toLowerCase().trim() ? '#4CAF50' : '#F44336')
                  }}>
                    {selectedChoice !== null 
                      ? (currentChallenge.choices[selectedChoice] === currentChallenge.answer ? '✅ Correct!' : '❌ Incorrect')
                      : (challengeAnswer.toLowerCase().trim() === currentChallenge.answer.toLowerCase().trim() ? '✅ Correct!' : '❌ Incorrect')
                    }
                  </h3>
                  <p>Correct answer: <strong>{currentChallenge.answer}</strong></p>
                </div>
              )}
              
              <ActionButtons>
                {!showResults ? (
                  <>
                    <ActionButton
                      $variant="primary"
                      onClick={submitAnswer}
                      disabled={selectedChoice === null && challengeAnswer.trim() === ''}
                    >
                      ✅ Submit Answer
                    </ActionButton>
                    <ActionButton
                      $variant="secondary"
                      onClick={closeChallenge}
                    >
                      ❌ Cancel
                    </ActionButton>
                  </>
                ) : (
                  <ActionButton
                    $variant="primary"
                    onClick={closeChallenge}
                  >
                    ✅ Continue
                  </ActionButton>
                )}
              </ActionButtons>
            </ChallengePanel>
          </ChallengeInterface>
        )}
      </AnimatePresence>
    </LanguageSystemContainer>
  );
};