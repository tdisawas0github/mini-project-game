import { useState } from 'react';
import styled from 'styled-components';

const RelationshipContainer = styled.div`
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

const CharacterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const CharacterCard = styled.div<{ $relationshipColor: string }>`
  background: linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%);
  border: 2px solid ${props => props.$relationshipColor};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    border-color: ${props => props.$relationshipColor}ee;
  }
  
  .character-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${props => props.$relationshipColor}30;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      border: 2px solid ${props => props.$relationshipColor};
    }
    
    .character-info {
      flex: 1;
      
      h3 {
        color: ${props => props.$relationshipColor};
        margin-bottom: 0.3rem;
        font-size: 1.3rem;
      }
      
      .title {
        color: #b0b0b0;
        font-size: 0.9rem;
        font-style: italic;
      }
    }
  }
  
  .relationship-status {
    margin-bottom: 1.5rem;
    
    .relationship-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      
      .status-text {
        color: ${props => props.$relationshipColor};
        font-weight: bold;
      }
      
      .trust-score {
        color: #ffa726;
        font-size: 0.9rem;
      }
    }
    
    .relationship-bar {
      width: 100%;
      height: 10px;
      background: #333;
      border-radius: 5px;
      overflow: hidden;
      
      .relationship-fill {
        height: 100%;
        background: linear-gradient(90deg, ${props => props.$relationshipColor} 0%, ${props => props.$relationshipColor}80 100%);
        transition: width 0.3s ease;
      }
    }
  }
  
  .character-details {
    .faction-badge {
      display: inline-block;
      background: ${props => props.$relationshipColor}20;
      color: ${props => props.$relationshipColor};
      padding: 0.3rem 0.8rem;
      border-radius: 12px;
      font-size: 0.8rem;
      margin-bottom: 1rem;
      border: 1px solid ${props => props.$relationshipColor}50;
    }
    
    .bio {
      color: #c0c0c0;
      line-height: 1.5;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }
    
    .recent-interaction {
      background: #1a1a2e;
      border-left: 3px solid ${props => props.$relationshipColor};
      padding: 0.8rem;
      border-radius: 0 8px 8px 0;
      margin-bottom: 1rem;
      
      .interaction-title {
        color: ${props => props.$relationshipColor};
        font-size: 0.8rem;
        font-weight: bold;
        margin-bottom: 0.3rem;
      }
      
      .interaction-text {
        color: #b0b0b0;
        font-size: 0.85rem;
        font-style: italic;
      }
    }
    
    .interaction-options {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      
      button {
        background: linear-gradient(135deg, ${props => props.$relationshipColor}30 0%, ${props => props.$relationshipColor}10 100%);
        border: 1px solid ${props => props.$relationshipColor};
        color: ${props => props.$relationshipColor};
        padding: 0.5rem 0.8rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.8rem;
        transition: all 0.2s ease;
        
        &:hover {
          background: ${props => props.$relationshipColor}20;
          transform: translateY(-1px);
        }
        
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
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

const RelationshipSummary = styled.div`
  background: linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%);
  border: 1px solid #444;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  
  h2 {
    color: #64b5f6;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .summary-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
    
    .stat {
      text-align: center;
      
      .value {
        font-size: 1.8rem;
        font-weight: bold;
        color: #64b5f6;
        display: block;
      }
      
      .label {
        color: #b0b0b0;
        font-size: 0.9rem;
      }
    }
  }
  
  .relationship-tips {
    background: #1a1a2e;
    border-radius: 8px;
    padding: 1rem;
    
    h3 {
      color: #ffa726;
      margin-bottom: 0.8rem;
      font-size: 1rem;
    }
    
    ul {
      list-style: none;
      padding: 0;
      
      li {
        color: #c0c0c0;
        margin-bottom: 0.5rem;
        padding-left: 1.2rem;
        position: relative;
        font-size: 0.9rem;
        
        &:before {
          content: '💡';
          position: absolute;
          left: 0;
        }
      }
    }
  }
`;

interface Character {
  id: string;
  name: string;
  title: string;
  faction: string;
  avatar: string;
  trustLevel: number;
  relationshipStatus: string;
  bio: string;
  recentInteraction: {
    title: string;
    text: string;
  };
  availableActions: string[];
}

interface CharacterRelationshipsProps {
  onReturn: () => void;
  onCharacterInteraction?: (characterId: string, action: string) => void;
}

const CharacterRelationships = ({ 
  onReturn, 
  onCharacterInteraction 
}: CharacterRelationshipsProps) => {
  // Mock character data (in real game, this would come from game state)
  const [characters] = useState<Character[]>([
    {
      id: 'lyra',
      name: 'Lyra Veyndral',
      title: 'Mnemonic Cartographer',
      faction: 'Ex-Institute',
      avatar: '🧙‍♀️',
      trustLevel: 75,
      relationshipStatus: 'Trusted Ally',
      bio: 'A former Institute scholar who now maps the altered memories throughout Valdaren. She hides a sealed memory tied to the First Speaker.',
      recentInteraction: {
        title: 'Memory Guidance',
        text: '"The glyphs respond to you differently than others. There\'s something special about your connection to Ellidric."'
      },
      availableActions: ['Seek Guidance', 'Share Discovery', 'Ask About Past']
    },
    {
      id: 'magistrate_korven',
      name: 'Magistrate Korven',
      title: 'Institute Overseer',
      faction: 'Institute',
      avatar: '⚖️',
      trustLevel: 35,
      relationshipStatus: 'Cautious Respect',
      bio: 'A high-ranking Institute official who views Ellidric as a tool to be controlled and catalogued. Suspicious of your abilities.',
      recentInteraction: {
        title: 'Formal Warning',
        text: '"Your uncontrolled use of Ellidric poses a threat to the stability we\'ve worked to maintain."'
      },
      availableActions: ['Negotiate', 'Submit Research', 'Challenge Authority']
    },
    {
      id: 'elder_thane',
      name: 'Elder Thane',
      title: 'Keeper of Whispers',
      faction: 'Clans',
      avatar: '🌿',
      trustLevel: 60,
      relationshipStatus: 'Cautious Friendship',
      bio: 'An ancient clan elder who believes Ellidric should remain fluid and alive. Sees potential in your natural connection to the language.',
      recentInteraction: {
        title: 'Ancient Wisdom',
        text: '"The old ways speak through you, child. But beware - power without wisdom leads to ruin."'
      },
      availableActions: ['Learn Traditions', 'Seek Blessing', 'Prove Worth']
    },
    {
      id: 'echo_child',
      name: 'The Echo Child',
      title: 'Glyph-Born',
      faction: 'Echoborn',
      avatar: '👻',
      trustLevel: 25,
      relationshipStatus: 'Mysterious Contact',
      bio: 'A being seemingly born from Ellidric glyphs themselves. Communicates only in Pure Ellidric, making conversations cryptic but profound.',
      recentInteraction: {
        title: 'Glyph Whisper',
        text: '[Untranslatable Ellidric phrases that seem to resonate with meaning about forgotten truths]'
      },
      availableActions: ['Attempt Communication', 'Study Together', 'Follow Silently']
    },
    {
      id: 'merchant_kael',
      name: 'Merchant Kael',
      title: 'Neutral Trader',
      faction: 'Neutral',
      avatar: '💰',
      trustLevel: 55,
      relationshipStatus: 'Business Partner',
      bio: 'A pragmatic trader who deals with all factions. Provides information and resources in exchange for services or coin.',
      recentInteraction: {
        title: 'Trade Proposal',
        text: '"I hear you\'ve been stirring up quite the reputation. I have some rare texts that might interest you..."'
      },
      availableActions: ['Trade Information', 'Request Supplies', 'Hire Services']
    },
    {
      id: 'aria_stormwind',
      name: 'Aria Stormwind',
      title: 'Rebel Scholar',
      faction: 'Independent',
      avatar: '📚',
      trustLevel: 80,
      relationshipStatus: 'Close Friend',
      bio: 'A brilliant scholar who left the Institute to pursue forbidden research. Your closest confidant in understanding Ellidric mysteries.',
      recentInteraction: {
        title: 'Research Partnership',
        text: '"I\'ve found references to the First Speaker in some ancient texts. We need to investigate further."'
      },
      availableActions: ['Collaborate Research', 'Share Secrets', 'Plan Expedition']
    }
  ]);

  const getRelationshipColor = (trustLevel: number): string => {
    if (trustLevel >= 80) return '#4caf50'; // Green - High trust
    if (trustLevel >= 60) return '#2196f3'; // Blue - Good relationship
    if (trustLevel >= 40) return '#ffa726'; // Orange - Neutral
    if (trustLevel >= 20) return '#ff7043'; // Red-orange - Cautious
    return '#f44336'; // Red - Hostile
  };

  const handleCharacterAction = (characterId: string, action: string) => {
    if (onCharacterInteraction) {
      onCharacterInteraction(characterId, action);
    }
    console.log(`Action: ${action} with character: ${characterId}`);
  };

  const averageTrust = Math.round(characters.reduce((sum, char) => sum + char.trustLevel, 0) / characters.length);
  const alliesCount = characters.filter(char => char.trustLevel >= 60).length;
  const hostileCount = characters.filter(char => char.trustLevel < 30).length;

  return (
    <RelationshipContainer>
      <ReturnButton onClick={onReturn}>
        ← Return to Hub
      </ReturnButton>
      
      <Header>
        <h1>👥 Character Relationships</h1>
        <p>Navigate the complex web of alliances and rivalries in Valdaren</p>
      </Header>

      <RelationshipSummary>
        <h2>📊 Relationship Overview</h2>
        <div className="summary-stats">
          <div className="stat">
            <span className="value">{alliesCount}</span>
            <span className="label">Allies</span>
          </div>
          <div className="stat">
            <span className="value">{averageTrust}</span>
            <span className="label">Avg Trust</span>
          </div>
          <div className="stat">
            <span className="value">{hostileCount}</span>
            <span className="label">Hostile</span>
          </div>
          <div className="stat">
            <span className="value">{characters.length}</span>
            <span className="label">Known NPCs</span>
          </div>
        </div>
        
        <div className="relationship-tips">
          <h3>💡 Relationship Tips</h3>
          <ul>
            <li>Trust levels affect dialogue options and story outcomes</li>
            <li>Each faction values different approaches to Ellidric</li>
            <li>Some characters have hidden agendas that reveal over time</li>
            <li>Your choices with one character may affect others</li>
          </ul>
        </div>
      </RelationshipSummary>

      <CharacterGrid>
        {characters.map(character => (
          <CharacterCard
            key={character.id}
            $relationshipColor={getRelationshipColor(character.trustLevel)}
          >
            <div className="character-header">
              <div className="avatar">{character.avatar}</div>
              <div className="character-info">
                <h3>{character.name}</h3>
                <div className="title">{character.title}</div>
              </div>
            </div>
            
            <div className="relationship-status">
              <div className="relationship-label">
                <span className="status-text">{character.relationshipStatus}</span>
                <span className="trust-score">{character.trustLevel}/100</span>
              </div>
              <div className="relationship-bar">
                <div 
                  className="relationship-fill" 
                  style={{ width: `${character.trustLevel}%` }}
                />
              </div>
            </div>
            
            <div className="character-details">
              <div className="faction-badge">{character.faction}</div>
              <div className="bio">{character.bio}</div>
              
              <div className="recent-interaction">
                <div className="interaction-title">{character.recentInteraction.title}</div>
                <div className="interaction-text">"{character.recentInteraction.text}"</div>
              </div>
              
              <div className="interaction-options">
                {character.availableActions.map(action => (
                  <button
                    key={action}
                    onClick={() => handleCharacterAction(character.id, action)}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </CharacterCard>
        ))}
      </CharacterGrid>
    </RelationshipContainer>
  );
};

export default CharacterRelationships;
