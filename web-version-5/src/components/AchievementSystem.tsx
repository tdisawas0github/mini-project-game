import { useState, useEffect } from 'react';
import styled from 'styled-components';

const AchievementContainer = styled.div`
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
    color: #64b5f6;
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    text-shadow: 0 0 10px rgba(100, 181, 246, 0.3);
  }
  
  p {
    color: #b0b0b0;
    font-size: 1.1rem;
  }
`;

const ProgressOverview = styled.div`
  background: linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%);
  border: 1px solid #444;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  
  .progress-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
    
    .stat {
      text-align: center;
      
      .value {
        font-size: 2.5rem;
        font-weight: bold;
        color: #64b5f6;
        display: block;
        margin-bottom: 0.3rem;
      }
      
      .label {
        color: #b0b0b0;
        font-size: 1rem;
      }
    }
  }
  
  .completion-bar {
    width: 100%;
    height: 15px;
    background: #333;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 1rem;
    
    .completion-fill {
      height: 100%;
      background: linear-gradient(90deg, #4caf50 0%, #81c784 100%);
      transition: width 0.5s ease;
    }
  }
  
  .completion-text {
    text-align: center;
    color: #4caf50;
    font-weight: bold;
    font-size: 1.1rem;
  }
`;

const AchievementCategories = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const CategoryTab = styled.button<{ $active: boolean }>`
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%)'
    : 'linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%)'
  };
  border: 2px solid ${props => props.$active ? '#64b5f6' : '#444'};
  color: ${props => props.$active ? 'white' : '#e0e0e0'};
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #64b5f6;
    transform: translateY(-1px);
  }
`;

const AchievementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const AchievementCard = styled.div<{ $rarity: string; $unlocked: boolean }>`
  background: ${props => props.$unlocked 
    ? 'linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%)'
    : 'linear-gradient(135deg, #1a1a1a 0%, #0f0f1a 100%)'
  };
  border: 2px solid ${props => {
    if (!props.$unlocked) return '#333';
    switch (props.$rarity) {
      case 'legendary': return '#ff6b35';
      case 'epic': return '#9c27b0';
      case 'rare': return '#2196f3';
      default: return '#4caf50';
    }
  }};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  opacity: ${props => props.$unlocked ? 1 : 0.6};
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => {
      if (!props.$unlocked) return '#333';
      switch (props.$rarity) {
        case 'legendary': return 'linear-gradient(90deg, #ff6b35, #f7931e)';
        case 'epic': return 'linear-gradient(90deg, #9c27b0, #e91e63)';
        case 'rare': return 'linear-gradient(90deg, #2196f3, #21cbf3)';
        default: return 'linear-gradient(90deg, #4caf50, #8bc34a)';
      }
    }};
  }
  
  .achievement-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    
    .icon {
      font-size: 2.5rem;
      opacity: ${props => props.$unlocked ? 1 : 0.4};
    }
    
    .achievement-info {
      flex: 1;
      
      h3 {
        color: ${props => props.$unlocked ? '#e0e0e0' : '#666'};
        margin-bottom: 0.3rem;
        font-size: 1.2rem;
      }
      
      .rarity {
        color: ${props => {
          if (!props.$unlocked) return '#444';
          switch (props.$rarity) {
            case 'legendary': return '#ff6b35';
            case 'epic': return '#9c27b0';
            case 'rare': return '#2196f3';
            default: return '#4caf50';
          }
        }};
        font-size: 0.9rem;
        font-weight: bold;
        text-transform: uppercase;
      }
    }
    
    .unlock-date {
      color: #888;
      font-size: 0.8rem;
      text-align: right;
    }
  }
  
  .description {
    color: ${props => props.$unlocked ? '#c0c0c0' : '#555'};
    margin-bottom: 1rem;
    line-height: 1.5;
    font-size: 0.9rem;
  }
  
  .progress-section {
    margin-bottom: 1rem;
    
    .progress-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      
      .progress-text {
        color: ${props => props.$unlocked ? '#b0b0b0' : '#555'};
      }
      
      .progress-numbers {
        color: ${props => props.$unlocked ? '#64b5f6' : '#444'};
        font-weight: bold;
      }
    }
    
    .progress-bar {
      width: 100%;
      height: 8px;
      background: #333;
      border-radius: 4px;
      overflow: hidden;
      
      .progress-fill {
        height: 100%;
        background: ${props => {
          if (!props.$unlocked) return '#444';
          switch (props.$rarity) {
            case 'legendary': return 'linear-gradient(90deg, #ff6b35, #f7931e)';
            case 'epic': return 'linear-gradient(90deg, #9c27b0, #e91e63)';
            case 'rare': return 'linear-gradient(90deg, #2196f3, #21cbf3)';
            default: return 'linear-gradient(90deg, #4caf50, #8bc34a)';
          }
        }};
        transition: width 0.3s ease;
      }
    }
  }
  
  .reward {
    background: ${props => props.$unlocked ? '#1a1a2e' : '#0f0f0f'};
    border-radius: 6px;
    padding: 0.8rem;
    
    .reward-label {
      color: #888;
      font-size: 0.8rem;
      margin-bottom: 0.3rem;
    }
    
    .reward-text {
      color: ${props => props.$unlocked ? '#ffa726' : '#444'};
      font-size: 0.9rem;
      font-weight: bold;
    }
  }
`;

const UnlockNotification = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);
  transform: ${props => props.$show ? 'translateX(0)' : 'translateX(400px)'};
  transition: transform 0.3s ease;
  z-index: 1000;
  max-width: 300px;
  
  .notification-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    
    .icon {
      font-size: 1.5rem;
    }
    
    .title {
      font-weight: bold;
    }
  }
  
  .achievement-name {
    font-size: 0.9rem;
    opacity: 0.9;
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

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedDate?: string;
  progress: number;
  maxProgress: number;
  reward: string;
}

interface AchievementSystemProps {
  onReturn: () => void;
}

const AchievementSystem = ({ onReturn }: AchievementSystemProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [lastUnlocked, setLastUnlocked] = useState<Achievement | null>(null);

  const [achievements] = useState<Achievement[]>([
    // Story Achievements
    {
      id: 'first_awakening',
      name: 'First Awakening',
      description: 'Experience your first memory dive and discover your connection to Ellidric',
      icon: '🌅',
      category: 'story',
      rarity: 'common',
      unlocked: true,
      unlockedDate: '2025-09-05',
      progress: 1,
      maxProgress: 1,
      reward: 'Unlock: Memory Chamber access'
    },
    {
      id: 'faction_diplomat',
      name: 'Diplomatic Relations',
      description: 'Successfully negotiate with representatives from all major factions',
      icon: '🤝',
      category: 'story',
      rarity: 'rare',
      unlocked: false,
      progress: 2,
      maxProgress: 4,
      reward: 'Unlock: Neutral zone access'
    },
    {
      id: 'ellidric_master',
      name: 'Master Linguist',
      description: 'Learn 50 Ellidric phrases across all four language layers',
      icon: '📚',
      category: 'language',
      rarity: 'epic',
      unlocked: false,
      progress: 12,
      maxProgress: 50,
      reward: 'Unlock: Advanced memory manipulation'
    },
    {
      id: 'memory_architect',
      name: 'Architect of Memory',
      description: 'Successfully reconstruct 10 fragmented memory sequences',
      icon: '🧠',
      category: 'exploration',
      rarity: 'rare',
      unlocked: true,
      unlockedDate: '2025-09-04',
      progress: 10,
      maxProgress: 10,
      reward: 'Ability: Memory Synthesis'
    },
    {
      id: 'first_speaker',
      name: 'Echo of the First Speaker',
      description: 'Uncover the truth about the origins of Ellidric and your connection to the First Speaker',
      icon: '👑',
      category: 'story',
      rarity: 'legendary',
      unlocked: false,
      progress: 1,
      maxProgress: 5,
      reward: 'Unlock: Pure Ellidric mastery'
    },
    // Language Achievements
    {
      id: 'polyglot',
      name: 'Polyglot',
      description: 'Unlock all four interpretation languages: English, Dutch, Latin, and Greek',
      icon: '🗣️',
      category: 'language',
      rarity: 'rare',
      unlocked: true,
      unlockedDate: '2025-09-03',
      progress: 4,
      maxProgress: 4,
      reward: 'Access: Multi-layered glyph meanings'
    },
    {
      id: 'glyph_collector',
      name: 'Glyph Collector',
      description: 'Discover and catalog 25 unique Ellidric glyphs',
      icon: '⚡',
      category: 'language',
      rarity: 'common',
      unlocked: false,
      progress: 8,
      maxProgress: 25,
      reward: 'Expand: Personal lexicon'
    },
    {
      id: 'dialect_specialist',
      name: 'Dialect Specialist',
      description: 'Master the unique traits of all four Ellidric dialects',
      icon: '🔤',
      category: 'language',
      rarity: 'epic',
      unlocked: false,
      progress: 1,
      maxProgress: 4,
      reward: 'Ability: Cross-dialect communication'
    },
    // Exploration Achievements
    {
      id: 'cartographer',
      name: 'Valdaren Cartographer',
      description: 'Visit all major regions in Valdaren and map their Ellidric influences',
      icon: '🗺️',
      category: 'exploration',
      rarity: 'rare',
      unlocked: false,
      progress: 3,
      maxProgress: 6,
      reward: 'Unlock: Fast travel between regions'
    },
    {
      id: 'ancient_explorer',
      name: 'Ancient Explorer',
      description: 'Discover 15 hidden Ellidric inscriptions in the Ancient Ruins',
      icon: '🏛️',
      category: 'exploration',
      rarity: 'epic',
      unlocked: false,
      progress: 5,
      maxProgress: 15,
      reward: 'Access: Forbidden Archive'
    },
    {
      id: 'memory_diver',
      name: 'Deep Memory Diver',
      description: 'Complete 20 successful memory dives without corruption',
      icon: '🌊',
      category: 'exploration',
      rarity: 'rare',
      unlocked: false,
      progress: 7,
      maxProgress: 20,
      reward: 'Resistance: Memory corruption immunity'
    },
    // Character Achievements
    {
      id: 'trusted_ally',
      name: 'Trusted Ally',
      description: 'Achieve maximum trust with any character',
      icon: '💎',
      category: 'character',
      rarity: 'rare',
      unlocked: true,
      unlockedDate: '2025-09-04',
      progress: 1,
      maxProgress: 1,
      reward: 'Unlock: Character-specific storylines'
    },
    {
      id: 'social_butterfly',
      name: 'Social Butterfly',
      description: 'Establish positive relationships with characters from all factions',
      icon: '🦋',
      category: 'character',
      rarity: 'epic',
      unlocked: false,
      progress: 2,
      maxProgress: 4,
      reward: 'Ability: Faction mediation'
    }
  ]);

  const categories = [
    { id: 'all', name: 'All', icon: '🏆' },
    { id: 'story', name: 'Story', icon: '📖' },
    { id: 'language', name: 'Language', icon: '🔤' },
    { id: 'exploration', name: 'Exploration', icon: '🗺️' },
    { id: 'character', name: 'Character', icon: '👥' }
  ];

  const filteredAchievements = activeCategory === 'all' 
    ? achievements 
    : achievements.filter(achievement => achievement.category === activeCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  // Simulate achievement unlock
  useEffect(() => {
    const timer = setTimeout(() => {
      const unlockedAchievement = achievements.find(a => a.id === 'trusted_ally');
      if (unlockedAchievement) {
        setLastUnlocked(unlockedAchievement);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 4000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AchievementContainer>
      <ReturnButton onClick={onReturn}>
        ← Return to Hub
      </ReturnButton>
      
      <Header>
        <h1>🏆 Achievements</h1>
        <p>Track your progress through the mysteries of Valdaren</p>
      </Header>

      <ProgressOverview>
        <div className="progress-stats">
          <div className="stat">
            <span className="value">{unlockedCount}</span>
            <span className="label">Unlocked</span>
          </div>
          <div className="stat">
            <span className="value">{totalCount}</span>
            <span className="label">Total</span>
          </div>
          <div className="stat">
            <span className="value">{completionPercentage}%</span>
            <span className="label">Complete</span>
          </div>
        </div>
        
        <div className="completion-bar">
          <div className="completion-fill" style={{ width: `${completionPercentage}%` }} />
        </div>
        <div className="completion-text">
          {completionPercentage === 100 ? 'Master of Valdaren!' : `${unlockedCount} of ${totalCount} achievements unlocked`}
        </div>
      </ProgressOverview>

      <AchievementCategories>
        {categories.map(category => (
          <CategoryTab
            key={category.id}
            $active={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.icon} {category.name}
          </CategoryTab>
        ))}
      </AchievementCategories>

      <AchievementGrid>
        {filteredAchievements.map(achievement => (
          <AchievementCard
            key={achievement.id}
            $rarity={achievement.rarity}
            $unlocked={achievement.unlocked}
          >
            <div className="achievement-header">
              <div className="icon">{achievement.icon}</div>
              <div className="achievement-info">
                <h3>{achievement.name}</h3>
                <div className="rarity">{achievement.rarity}</div>
              </div>
              {achievement.unlockedDate && (
                <div className="unlock-date">
                  Unlocked<br/>{achievement.unlockedDate}
                </div>
              )}
            </div>
            
            <div className="description">{achievement.description}</div>
            
            <div className="progress-section">
              <div className="progress-label">
                <span className="progress-text">Progress</span>
                <span className="progress-numbers">
                  {achievement.progress}/{achievement.maxProgress}
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="reward">
              <div className="reward-label">Reward:</div>
              <div className="reward-text">{achievement.reward}</div>
            </div>
          </AchievementCard>
        ))}
      </AchievementGrid>

      <UnlockNotification $show={showNotification}>
        {lastUnlocked && (
          <>
            <div className="notification-header">
              <span className="icon">🏆</span>
              <span className="title">Achievement Unlocked!</span>
            </div>
            <div className="achievement-name">{lastUnlocked.name}</div>
          </>
        )}
      </UnlockNotification>
    </AchievementContainer>
  );
};

export default AchievementSystem;
