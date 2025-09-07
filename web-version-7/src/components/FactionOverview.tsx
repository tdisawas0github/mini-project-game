import { useState } from 'react';
import styled from 'styled-components';
import { valdarenFactions } from '../utils/worldDataParser';
import type { Faction } from '../types/game';

const FactionContainer = styled.div`
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

const FactionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FactionCard = styled.div<{ $factionColor: string; $isSelected: boolean }>`
  background: ${props => props.$isSelected 
    ? `linear-gradient(135deg, ${props.$factionColor}20 0%, ${props.$factionColor}10 100%)`
    : 'linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%)'
  };
  border: 2px solid ${props => props.$isSelected ? props.$factionColor : '#444'};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.$factionColor};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
  }
  
  h3 {
    color: ${props => props.$factionColor};
    margin-bottom: 1rem;
    font-size: 1.4rem;
  }
  
  .description {
    color: #c0c0c0;
    margin-bottom: 1rem;
    line-height: 1.5;
  }
  
  .reputation {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .rep-bar {
    flex: 1;
    height: 8px;
    background: #333;
    border-radius: 4px;
    overflow: hidden;
    
    .rep-fill {
      height: 100%;
      background: ${props => props.$factionColor};
      transition: width 0.3s ease;
    }
  }
  
  .territories {
    margin-top: 1rem;
    
    h4 {
      color: #aaa;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }
    
    .territory-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      
      .territory {
        background: ${props => props.$factionColor}30;
        color: ${props => props.$factionColor};
        padding: 0.2rem 0.6rem;
        border-radius: 12px;
        font-size: 0.8rem;
        border: 1px solid ${props => props.$factionColor}50;
      }
    }
  }
`;

const DetailPanel = styled.div<{ $factionColor: string }>`
  background: linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%);
  border: 2px solid ${props => props.$factionColor};
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;
  
  h2 {
    color: ${props => props.$factionColor};
    margin-bottom: 1.5rem;
    font-size: 2rem;
  }
  
  .detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    
    .detail-section {
      h3 {
        color: #64b5f6;
        margin-bottom: 1rem;
        font-size: 1.2rem;
      }
      
      p, li {
        color: #c0c0c0;
        line-height: 1.6;
        margin-bottom: 0.5rem;
      }
      
      ul {
        padding-left: 1.5rem;
      }
    }
  }
  
  .interaction-options {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #444;
    
    h3 {
      color: #64b5f6;
      margin-bottom: 1rem;
    }
    
    .option-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      
      button {
        background: linear-gradient(135deg, ${props => props.$factionColor}30 0%, ${props => props.$factionColor}10 100%);
        border: 1px solid ${props => props.$factionColor};
        color: ${props => props.$factionColor};
        padding: 0.8rem 1.2rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.9rem;
        
        &:hover {
          background: ${props => props.$factionColor}20;
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

interface FactionOverviewProps {
  onReturn: () => void;
  onFactionInteraction?: (factionId: string, action: string) => void;
}

const FactionOverview = ({ onReturn, onFactionInteraction }: FactionOverviewProps) => {
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);
  
  // Mock reputation data (in real game, this would come from game state)
  const factionReputations = {
    'institute': 35,
    'clans': 65,
    'echoborn': 20,
    'neutral': 50
  };

  const factionColors = {
    'institute': '#2196f3',
    'clans': '#4caf50', 
    'echoborn': '#9c27b0',
    'neutral': '#757575'
  };

  const handleFactionClick = (faction: Faction) => {
    setSelectedFaction(selectedFaction?.id === faction.id ? null : faction);
  };

  const handleFactionAction = (action: string) => {
    if (selectedFaction && onFactionInteraction) {
      onFactionInteraction(selectedFaction.id, action);
    }
  };

  return (
    <FactionContainer>
      <ReturnButton onClick={onReturn}>
        ← Return to Hub
      </ReturnButton>
      
      <Header>
        <h1>⚔️ Factions of Valdaren</h1>
        <p>Navigate the complex political landscape and forge your alliances</p>
      </Header>

      <FactionGrid>
        {valdarenFactions.map(faction => (
          <FactionCard
            key={faction.id}
            $factionColor={factionColors[faction.id as keyof typeof factionColors]}
            $isSelected={selectedFaction?.id === faction.id}
            onClick={() => handleFactionClick(faction)}
          >
            <h3>{faction.name}</h3>
            <div className="description">{faction.description}</div>
            
            <div className="reputation">
              <span>Reputation:</span>
              <div className="rep-bar">
                <div 
                  className="rep-fill" 
                  style={{ width: `${factionReputations[faction.id as keyof typeof factionReputations]}%` }}
                />
              </div>
              <span>{factionReputations[faction.id as keyof typeof factionReputations]}/100</span>
            </div>
            
            <div className="territories">
              <h4>Controlled Territories:</h4>
              <div className="territory-list">
                {faction.territories?.map(territory => (
                  <span key={territory} className="territory">{territory}</span>
                ))}
              </div>
            </div>
          </FactionCard>
        ))}
      </FactionGrid>

      {selectedFaction && (
        <DetailPanel $factionColor={factionColors[selectedFaction.id as keyof typeof factionColors]}>
          <h2>{selectedFaction.name}</h2>
          
          <div className="detail-grid">
            <div className="detail-section">
              <h3>Philosophy & Goals</h3>
              <p>{selectedFaction.philosophy}</p>
            </div>
            
            <div className="detail-section">
              <h3>Cultural Traits</h3>
              <ul>
                {selectedFaction.traits?.map(trait => (
                  <li key={trait}>{trait}</li>
                ))}
              </ul>
            </div>
            
            <div className="detail-section">
              <h3>Key Leaders</h3>
              <ul>
                {selectedFaction.leaders?.map(leader => (
                  <li key={leader}>{leader}</li>
                ))}
              </ul>
            </div>
            
            <div className="detail-section">
              <h3>Notable Locations</h3>
              <ul>
                {selectedFaction.territories?.map(territory => (
                  <li key={territory}>{territory}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="interaction-options">
            <h3>Available Actions</h3>
            <div className="option-grid">
              <button onClick={() => handleFactionAction('negotiate')}>
                🤝 Open Negotiations
              </button>
              <button onClick={() => handleFactionAction('trade')}>
                💰 Establish Trade
              </button>
              <button onClick={() => handleFactionAction('intelligence')}>
                🕵️ Gather Intelligence
              </button>
              <button onClick={() => handleFactionAction('alliance')}>
                ⚔️ Propose Alliance
              </button>
              <button onClick={() => handleFactionAction('sabotage')}>
                💥 Sabotage Operations
              </button>
              <button onClick={() => handleFactionAction('infiltrate')}>
                🥷 Infiltrate Ranks
              </button>
            </div>
          </div>
        </DetailPanel>
      )}
    </FactionContainer>
  );
};

export default FactionOverview;
