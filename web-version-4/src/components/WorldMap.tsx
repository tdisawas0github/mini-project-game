import { motion } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import { valdarenRegions, valdarenFactionsLegacy } from '../utils/worldDataParser';
import {
  HubContainer,
  HubTitle,
  ChoiceButton
} from '../styles/visualNovel';
import styled from 'styled-components';

const MapContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  max-width: 1000px;
  width: 100%;
`;

const MapImage = styled.div`
  width: 100%;
  max-width: 600px;
  height: 400px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f4c75 100%);
  border: 3px solid rgba(212, 175, 55, 0.3);
  border-radius: 16px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '🗺️ Map of Valdaren';
    color: #d4af37;
    font-size: 1.5rem;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
  }
`;

const RegionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
`;

const RegionCard = styled.div<{ faction: string }>`
  background: linear-gradient(135deg, 
    rgba(15, 15, 35, 0.9) 0%, 
    rgba(26, 26, 46, 0.95) 50%, 
    rgba(22, 33, 62, 0.9) 100%
  );
  border: 2px solid ${props => 
    props.faction === 'institute' ? 'rgba(59, 130, 246, 0.5)' :
    props.faction === 'clans' ? 'rgba(34, 197, 94, 0.5)' :
    props.faction === 'echoborn' ? 'rgba(168, 85, 247, 0.5)' :
    'rgba(107, 114, 128, 0.5)'
  };
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
    border-color: ${props => 
      props.faction === 'institute' ? 'rgba(59, 130, 246, 0.8)' :
      props.faction === 'clans' ? 'rgba(34, 197, 94, 0.8)' :
      props.faction === 'echoborn' ? 'rgba(168, 85, 247, 0.8)' :
      'rgba(107, 114, 128, 0.8)'
    };
  }
`;

const RegionName = styled.h3`
  color: #d4af37;
  margin-bottom: 12px;
  font-size: 1.3em;
`;

const FactionName = styled.div<{ faction: string }>`
  color: ${props => 
    props.faction === 'institute' ? '#3b82f6' :
    props.faction === 'clans' ? '#22c55e' :
    props.faction === 'echoborn' ? '#a855f7' :
    '#6b7280'
  };
  font-weight: 600;
  margin-bottom: 8px;
`;

const InfluenceBar = styled.div<{ influence: number; faction: string }>`
  width: 100%;
  height: 8px;
  background: rgba(55, 65, 81, 0.8);
  border-radius: 4px;
  overflow: hidden;
  margin: 8px 0;

  &::after {
    content: '';
    display: block;
    width: ${props => props.influence}%;
    height: 100%;
    background: ${props => 
      props.faction === 'institute' ? '#3b82f6' :
      props.faction === 'clans' ? '#22c55e' :
      props.faction === 'echoborn' ? '#a855f7' :
      '#6b7280'
    };
    border-radius: 4px;
    transition: width 0.5s ease;
  }
`;

interface WorldMapProps {
  onReturn: () => void;
}

const WorldMap = ({ onReturn }: WorldMapProps) => {
  const { gameState } = useGameState();

  return (
    <HubContainer>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <HubTitle>Map of Valdaren</HubTitle>
      </motion.div>

      <MapContainer>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#d1d5db', 
            maxWidth: '800px', 
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Explore the frozen realm of Valdaren, where three major factions vie for control 
            over the ancient language of Ellidric. Each region holds secrets of the past 
            and influence over the future of linguistic power.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <MapImage />
        </motion.div>

        <RegionGrid>
          {valdarenRegions.map((region, index) => (
            <motion.div
              key={region.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.15, duration: 0.5 }}
            >
              <RegionCard faction={region.faction}>
                <RegionName>{region.name}</RegionName>
                <FactionName faction={region.faction}>
                  {valdarenFactionsLegacy[region.faction as keyof typeof valdarenFactionsLegacy]?.name || 'Unknown Faction'}
                </FactionName>
                <p style={{ 
                  fontSize: '0.9em', 
                  lineHeight: '1.5', 
                  color: '#d1d5db',
                  marginBottom: '16px' 
                }}>
                  {region.description}
                </p>
                
                <div style={{ fontSize: '0.85em', color: '#9ca3af' }}>
                  <strong>Philosophy:</strong> {valdarenFactionsLegacy[region.faction as keyof typeof valdarenFactionsLegacy]?.philosophy || 'Unknown'}
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: '12px'
                }}>
                  <span style={{ fontSize: '0.9em' }}>Regional Influence:</span>
                  <span style={{ fontWeight: '600' }}>{region.influence}%</span>
                </div>
                <InfluenceBar 
                  influence={region.influence} 
                  faction={region.faction}
                />

                {gameState.knownLanguages.length > 0 && (
                  <div style={{ marginTop: '12px', fontSize: '0.85em' }}>
                    <strong>Your Standing:</strong>{' '}
                    {gameState.factionInfluence?.[region.faction as keyof typeof gameState.factionInfluence] || 'Unknown'}
                  </div>
                )}
              </RegionCard>
            </motion.div>
          ))}
        </RegionGrid>

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
      </MapContainer>
    </HubContainer>
  );
};

export default WorldMap;