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
  position: relative;
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
    url('/src/maps/factions-of-valdaren.png') center/cover no-repeat,
    url('/src/maps/map-of-valdaren.png') center/cover no-repeat;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.4);
  }
`;

const MapRegion = styled.div<{ 
  faction: string; 
  top: string; 
  left: string; 
  width: string; 
  height: string;
  shape?: string;
}>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  width: ${props => props.width};
  height: ${props => props.height};
  background: ${props => 
    props.faction === 'institute' ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.1))' :
    props.faction === 'clans' ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.1))' :
    props.faction === 'echoborn' ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0.1))' :
    'linear-gradient(135deg, rgba(107, 114, 128, 0.3), rgba(107, 114, 128, 0.1))'
  };
  border: 2px solid ${props => 
    props.faction === 'institute' ? 'rgba(59, 130, 246, 0.6)' :
    props.faction === 'clans' ? 'rgba(34, 197, 94, 0.6)' :
    props.faction === 'echoborn' ? 'rgba(168, 85, 247, 0.6)' :
    'rgba(107, 114, 128, 0.6)'
  };
  border-radius: ${props => props.shape === 'circle' ? '50%' : '8px'};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px ${props => 
      props.faction === 'institute' ? 'rgba(59, 130, 246, 0.4)' :
      props.faction === 'clans' ? 'rgba(34, 197, 94, 0.4)' :
      props.faction === 'echoborn' ? 'rgba(168, 85, 247, 0.4)' :
      'rgba(107, 114, 128, 0.4)'
    };
    
    &::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 0.7rem;
      white-space: nowrap;
      z-index: 10;
      margin-bottom: 5px;
    }
  }
  
  /* Region labels */
  &::before {
    content: attr(data-label);
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.6rem;
    color: #d4af37;
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
    font-weight: bold;
  }
`;

const MapLegend = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 12px;
  font-size: 0.7rem;
`;

const LegendItem = styled.div<{ faction: string }>`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  
  &::before {
    content: '';
    width: 12px;
    height: 12px;
    background: ${props => 
      props.faction === 'institute' ? '#3b82f6' :
      props.faction === 'clans' ? '#22c55e' :
      props.faction === 'echoborn' ? '#a855f7' :
      '#6b7280'
    };
    border-radius: 2px;
    margin-right: 6px;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
`;

const LegendTitle = styled.div`
  font-weight: bold;
  color: #d4af37;
  margin-bottom: 8px;
  font-size: 0.8rem;
`;

const LegendColor = styled.div<{ faction: string }>`
  width: 12px;
  height: 12px;
  background: ${props => 
    props.faction === 'institute' ? '#3b82f6' :
    props.faction === 'clans' ? '#22c55e' :
    props.faction === 'echoborn' ? '#a855f7' :
    '#6b7280'
  };
  border-radius: 2px;
  margin-right: 6px;
  border: 1px solid rgba(255, 255, 255, 0.3);
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
          <MapImage>
            {/* Map Legend */}
            <MapLegend>
              <LegendTitle>Factions of Valdaren</LegendTitle>
              <LegendItem faction="institute">
                <LegendColor faction="institute" />
                Institute of Lingua Arcanum
              </LegendItem>
              <LegendItem faction="clans">
                <LegendColor faction="clans" />
                Whispering Woods Clans
              </LegendItem>
              <LegendItem faction="echoborn">
                <LegendColor faction="echoborn" />
                Echoborn Order
              </LegendItem>
              <LegendItem faction="neutral">
                <LegendColor faction="neutral" />
                Neutral Territories
              </LegendItem>
            </MapLegend>
            
            {/* Map Regions */}
            <MapRegion 
              faction="institute" 
              top="25%" 
              left="20%" 
              width="18%" 
              height="15%"
              data-label="Ravengard"
              data-tooltip="Urban seat of the Institute of Lingua Arcanum"
            >
              🏛️
            </MapRegion>
            
            <MapRegion 
              faction="clans" 
              top="55%" 
              left="25%" 
              width="22%" 
              height="18%"
              data-label="Whispering Woods"
              data-tooltip="Ancient forests where oral traditions keep Ellidric alive"
            >
              🌲
            </MapRegion>
            
            <MapRegion 
              faction="echoborn" 
              top="15%" 
              left="65%" 
              width="16%" 
              height="12%"
              data-label="Ancient Ruins"
              data-tooltip="Forgotten places where glyphs first touched human minds"
            >
              🏛️
            </MapRegion>
            
            <MapRegion 
              faction="clans" 
              top="45%" 
              left="55%" 
              width="20%" 
              height="15%"
              data-label="Snowveil Forest"
              data-tooltip="Borderland forest where clan storytellers practice traditions"
            >
              🌲
            </MapRegion>
            
            <MapRegion 
              faction="echoborn" 
              top="8%" 
              left="45%" 
              width="12%" 
              height="12%"
              shape="circle"
              data-label="Lumisth Glacier"
              data-tooltip="Frozen Fringe where the first Ellidric glyphs were discovered"
            >
              🏔️
            </MapRegion>
            
            <MapRegion 
              faction="neutral" 
              top="40%" 
              left="40%" 
              width="15%" 
              height="12%"
              shape="circle"
              data-label="Lake Eirysa"
              data-tooltip="Central landmark where all factions meet for diplomacy"
            >
              🏞️
            </MapRegion>
          </MapImage>
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