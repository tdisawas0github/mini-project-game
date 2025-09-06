import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import type { Quest, ExtendedGameState } from '../types/quest';
import { mainQuests, factionQuests, sideQuests, questGivers } from '../data/questData';

const QuestSystemContainer = styled(motion.div)`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 2rem;
  color: white;
  font-family: 'Cinzel', serif;
`;

const QuestHeader = styled.div`
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

const QuestTabs = styled.div`
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

const QuestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const QuestCard = styled(motion.div)<{ $questType: string, $status: string }>`
  background: rgba(255,255,255,0.1);
  border: 2px solid ${props => {
    switch(props.$questType) {
      case 'main': return '#ffd700';
      case 'faction': return '#4a90e2';
      case 'side': return '#90ee90';
      default: return 'rgba(255,255,255,0.3)';
    }
  }};
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  opacity: ${props => props.$status === 'locked' ? 0.6 : 1};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  }
`;

const QuestTitle = styled.h3<{ $questType: string }>`
  color: ${props => {
    switch(props.$questType) {
      case 'main': return '#ffd700';
      case 'faction': return '#4a90e2';
      case 'side': return '#90ee90';
      default: return 'white';
    }
  }};
  margin-bottom: 0.5rem;
  font-size: 1.4rem;
`;

const QuestMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #b8860b;
`;

const QuestDescription = styled.p`
  color: #e6e6e6;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const ObjectivesList = styled.div`
  margin-bottom: 1rem;
`;

const Objective = styled(motion.div)<{ $completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: rgba(255,255,255,0.05);
  border-radius: 6px;
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
  opacity: ${props => props.$completed ? 0.7 : 1};
`;

const ObjectiveIcon = styled.span<{ $completed: boolean }>`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid ${props => props.$completed ? '#90ee90' : 'rgba(255,255,255,0.5)'};
  border-radius: 50%;
  background: ${props => props.$completed ? '#90ee90' : 'transparent'};
  
  &::after {
    content: ${props => props.$completed ? '"✓"' : '""'};
    display: block;
    text-align: center;
    line-height: 16px;
    font-size: 12px;
    color: black;
  }
`;

const ProgressBar = styled.div<{ $progress: number }>`
  width: 100%;
  height: 8px;
  background: rgba(255,255,255,0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
  
  &::after {
    content: '';
    display: block;
    width: ${props => props.$progress}%;
    height: 100%;
    background: linear-gradient(90deg, #4a90e2, #90ee90);
    transition: width 0.3s ease;
  }
`;

const QuestActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled(motion.button)<{ $variant: 'primary' | 'secondary' }>`
  padding: 0.6rem 1.2rem;
  background: ${props => props.$variant === 'primary' 
    ? 'linear-gradient(45deg, #4a90e2, #357abd)' 
    : 'rgba(255,255,255,0.1)'};
  border: 2px solid ${props => props.$variant === 'primary' ? '#4a90e2' : 'rgba(255,255,255,0.3)'};
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const CharacterPanel = styled(motion.div)`
  background: rgba(255,255,255,0.1);
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  margin-top: 2rem;
`;

const CharacterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const CharacterCard = styled(motion.div)`
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  padding: 1rem;
  
  &:hover {
    background: rgba(255,255,255,0.1);
  }
`;

interface QuestSystemProps {
  gameState: ExtendedGameState;
  onGameStateChange: (newState: ExtendedGameState) => void;
  onReturnToHub: () => void;
}

export const QuestSystem: React.FC<QuestSystemProps> = ({
  gameState,
  onGameStateChange,
  onReturnToHub
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'main' | 'faction' | 'side' | 'characters'>('all');

  // Combine all quests
  const allQuests = [...mainQuests, ...factionQuests, ...sideQuests];

  // Filter quests based on active tab
  const filteredQuests = allQuests.filter(quest => {
    if (activeTab === 'all') return true;
    return quest.type === activeTab;
  });

  // Check if quest is available
  const isQuestAvailable = (quest: Quest): boolean => {
    // Check prerequisites
    const prerequisitesMet = quest.prerequisites.every(prereq => 
      gameState.completedQuests.includes(prereq)
    );
    
    // Check faction requirements for faction quests
    if (quest.type === 'faction' && quest.faction) {
      const factionRep = gameState.factionInfluence[quest.faction] || 0;
      if (factionRep < 10) return false; // Need at least some faction standing
    }
    
    return prerequisitesMet;
  };

  // Get quest status
  const getQuestStatus = (quest: Quest): string => {
    if (gameState.completedQuests.includes(quest.id)) return 'completed';
    if (gameState.failedQuests.includes(quest.id)) return 'failed';
    if (gameState.activeQuests.includes(quest.id)) return 'active';
    if (isQuestAvailable(quest)) return 'available';
    return 'locked';
  };

  // Calculate quest progress
  const calculateProgress = (quest: Quest): number => {
    const objectives = gameState.questProgress[quest.id] || quest.objectives;
    const completedObjectives = objectives.filter(obj => obj.completed).length;
    return (completedObjectives / objectives.length) * 100;
  };

  // Start a quest
  const startQuest = (questId: string) => {
    if (!gameState.activeQuests.includes(questId)) {
      const newState = {
        ...gameState,
        activeQuests: [...gameState.activeQuests, questId]
      };
      onGameStateChange(newState);
    }
  };

  // Get character relationship level
  const getCharacterRelationship = (characterId: string): number => {
    return gameState.characterRelationships[characterId] || 0;
  };

  // Render quest card
  const renderQuestCard = (quest: Quest) => {
    const status = getQuestStatus(quest);
    const progress = calculateProgress(quest);
    const objectives = gameState.questProgress[quest.id] || quest.objectives;

    return (
      <QuestCard
        key={quest.id}
        $questType={quest.type}
        $status={status}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
      >
        <QuestTitle $questType={quest.type}>{quest.title}</QuestTitle>
        
        <QuestMeta>
          <span>📍 {quest.location}</span>
          <span>🎯 {quest.type.charAt(0).toUpperCase() + quest.type.slice(1)}</span>
          {quest.act && <span>📖 Act {quest.act}</span>}
          <span className={`status-${status}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </QuestMeta>
        
        <QuestDescription>{quest.description}</QuestDescription>
        
        <ObjectivesList>
          <h4>📋 Objectives:</h4>
          {objectives.map((objective, index) => (
            <Objective
              key={objective.id}
              $completed={objective.completed}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ObjectiveIcon $completed={objective.completed} />
              <span>{objective.description}</span>
              {objective.target && (
                <span> ({objective.current || 0}/{objective.target})</span>
              )}
            </Objective>
          ))}
          {progress > 0 && <ProgressBar $progress={progress} />}
        </ObjectivesList>
        
        <QuestActions>
          {status === 'available' && (
            <ActionButton
              $variant="primary"
              onClick={() => startQuest(quest.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Quest
            </ActionButton>
          )}
          
          {status === 'active' && (
            <ActionButton
              $variant="secondary"
              onClick={() => console.log('View quest details:', quest.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Details
            </ActionButton>
          )}
          
          {status === 'completed' && (
            <ActionButton
              $variant="secondary"
              disabled
            >
              ✓ Completed
            </ActionButton>
          )}
          
          {status === 'locked' && (
            <ActionButton
              $variant="secondary"
              disabled
            >
              🔒 Locked
            </ActionButton>
          )}
        </QuestActions>
      </QuestCard>
    );
  };

  // Render character panel
  const renderCharacterPanel = () => (
    <CharacterPanel
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2>🎭 Quest Givers & Characters</h2>
      <CharacterGrid>
        {questGivers.map(character => {
          const relationship = getCharacterRelationship(character.id);
          const availableQuests = character.availableQuests.filter(questId => 
            isQuestAvailable(allQuests.find(q => q.id === questId)!)
          );
          
          return (
            <CharacterCard
              key={character.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <h3>{character.name}</h3>
              <p style={{ color: '#b8860b', fontStyle: 'italic' }}>{character.title}</p>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                📍 {character.location}
              </p>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                {character.description}
              </p>
              
              <div style={{ marginBottom: '1rem' }}>
                <span>🤝 Relationship: </span>
                <span style={{ 
                  color: relationship > 0 ? '#90ee90' : relationship < 0 ? '#ff6b6b' : '#ffd700' 
                }}>
                  {relationship > 50 ? 'Trusted Ally' :
                   relationship > 10 ? 'Friend' :
                   relationship > -10 ? 'Neutral' :
                   relationship > -50 ? 'Disliked' : 'Enemy'}
                </span>
                <ProgressBar $progress={Math.abs(relationship)} />
              </div>
              
              {availableQuests.length > 0 && (
                <div>
                  <strong>Available Quests:</strong>
                  <ul style={{ margin: '0.5rem 0', paddingLeft: '1rem' }}>
                    {availableQuests.map(questId => {
                      const quest = allQuests.find(q => q.id === questId);
                      return quest ? (
                        <li key={questId} style={{ fontSize: '0.9rem' }}>
                          {quest.title}
                        </li>
                      ) : null;
                    })}
                  </ul>
                </div>
              )}
            </CharacterCard>
          );
        })}
      </CharacterGrid>
    </CharacterPanel>
  );

  return (
    <QuestSystemContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <QuestHeader>
        <h1>📜 Quest Journal</h1>
        <p>Track your adventures across the realm of Valdaren</p>
      </QuestHeader>

      <QuestTabs>
        {[
          { id: 'all', label: '📚 All Quests' },
          { id: 'main', label: '🌟 Main Story' },
          { id: 'faction', label: '⚔️ Faction Quests' },
          { id: 'side', label: '🗺️ Side Quests' },
          { id: 'characters', label: '🎭 Characters' }
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
      </QuestTabs>

      <AnimatePresence mode="wait">
        {activeTab === 'characters' ? (
          renderCharacterPanel()
        ) : (
          <QuestGrid>
            {filteredQuests.map(renderQuestCard)}
          </QuestGrid>
        )}
      </AnimatePresence>

      <QuestActions style={{ justifyContent: 'center', marginTop: '2rem' }}>
        <ActionButton
          $variant="secondary"
          onClick={onReturnToHub}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🏠 Return to Hub
        </ActionButton>
      </QuestActions>
    </QuestSystemContainer>
  );
};