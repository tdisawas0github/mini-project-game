import { motion } from 'framer-motion';
import { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { valdarenRegions, valdarenFactionsLegacy, valdarenMapData } from '../utils/worldDataParser';
import {
  HubContainer,
  HubTitle,
  ChoiceButton
} from '../styles/visualNovel';
import styled from 'styled-components';

const OuterMapContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  max-width: 1000px;
  width: 100%;
`;

const MapImage = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  height: min(90vh, 1200px);
  padding: 56px 36px;
  background: linear-gradient(rgba(0,0,0,0.04), rgba(0,0,0,0.04));
  border-radius: 12px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.38);
  cursor: pointer;
  transition: all 0.22s ease;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RegionHotspot = styled.div.withConfig({
  shouldForwardProp: (prop) => !['x', 'y', 'w', 'h', 'faction', 'isSelected'].includes(prop)
})<{ 
  x: number; 
  y: number; 
  w: number; 
  h: number; 
  faction: string;
  isSelected: boolean;
}>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: ${props => props.w}px;
  height: ${props => props.h}px;
  background: ${props => 
    props.faction === 'Institute' ? 'rgba(59, 130, 246, 0.2)' :
    props.faction === 'Clans' ? 'rgba(34, 197, 94, 0.2)' :
    props.faction === 'Echoborn' ? 'rgba(168, 85, 247, 0.2)' :
    'rgba(107, 114, 128, 0.2)'
  };
  border: 2px solid ${props => 
    props.isSelected ? 
      (props.faction === 'Institute' ? '#3b82f6' :
       props.faction === 'Clans' ? '#22c55e' :
       props.faction === 'Echoborn' ? '#a855f7' :
       '#6b7280') :
    'rgba(255, 255, 255, 0.3)'
  };
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: ${props => 
      props.faction === 'Institute' ? 'rgba(59, 130, 246, 0.4)' :
      props.faction === 'Clans' ? 'rgba(34, 197, 94, 0.4)' :
      props.faction === 'Echoborn' ? 'rgba(168, 85, 247, 0.4)' :
      'rgba(107, 114, 128, 0.4)'
    };
    border-color: ${props => 
      props.faction === 'Institute' ? '#3b82f6' :
      props.faction === 'Clans' ? '#22c55e' :
      props.faction === 'Echoborn' ? '#a855f7' :
      '#6b7280'
    };
    transform: scale(1.05);
  }
`;

const RegionTooltip = styled.div.withConfig({
  shouldForwardProp: (prop) => !['x', 'y', 'faction', 'visible'].includes(prop)
})<{ 
  x: number; 
  y: number; 
  faction: string;
  visible: boolean;
}>`
  position: absolute;
  left: ${props => props.x + 20}px;
  top: ${props => props.y - 10}px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  pointer-events: none;
  z-index: 20;
  opacity: ${props => props.visible ? 1 : 0};
  transform: translateY(${props => props.visible ? 0 : -10}px);
  transition: all 0.2s ease;
  border: 1px solid ${props => 
    props.faction === 'Institute' ? '#3b82f6' :
    props.faction === 'Clans' ? '#22c55e' :
    props.faction === 'Echoborn' ? '#a855f7' :
    '#6b7280'
  };

  &::after {
    content: '';
    position: absolute;
    left: -6px;
    top: 50%;
    transform: translateY(-50%);
    border: 6px solid transparent;
    border-right-color: rgba(0, 0, 0, 0.9);
  }
`;

const RegionDetailPanel = styled.div.withConfig({
  shouldForwardProp: (prop) => !['faction'].includes(prop)
})<{ faction: string }>`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 300px;
  background: linear-gradient(135deg, 
    rgba(15, 15, 35, 0.95) 0%, 
    rgba(26, 26, 46, 0.95) 50%, 
    rgba(22, 33, 62, 0.95) 100%
  );
  border: 2px solid ${props => 
    props.faction === 'Institute' ? 'rgba(59, 130, 246, 0.6)' :
    props.faction === 'Clans' ? 'rgba(34, 197, 94, 0.6)' :
    props.faction === 'Echoborn' ? 'rgba(168, 85, 247, 0.6)' :
    'rgba(107, 114, 128, 0.6)'
  };
  border-radius: 12px;
  padding: 20px;
  z-index: 30;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;

const ImgMain = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  border-radius: 8px;
`;

const ImgOverlay = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  opacity: 0.98;
`;

const MapLegend = styled.div`
  width: 220px;
  background: rgba(0, 0, 0, 0.85);
  border-radius: 10px;
  padding: 14px;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MapRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  width: 100%;
`;

const LegendItem = styled.div.withConfig({
  shouldForwardProp: (prop) => !['faction'].includes(prop)
})<{ faction: string }>`
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

const LegendColor = styled.div.withConfig({
  shouldForwardProp: (prop) => !['faction'].includes(prop)
})<{ faction: string }>`
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

const RegionCard = styled.div.withConfig({
  shouldForwardProp: (prop) => !['faction'].includes(prop)
})<{ faction: string }>`
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

const FactionName = styled.div.withConfig({
  shouldForwardProp: (prop) => !['faction'].includes(prop)
})<{ faction: string }>`
  color: ${props => 
    props.faction === 'institute' ? '#3b82f6' :
    props.faction === 'clans' ? '#22c55e' :
    props.faction === 'echoborn' ? '#a855f7' :
    '#6b7280'
  };
  font-weight: 600;
  margin-bottom: 8px;
`;

const InfluenceBar = styled.div.withConfig({
  shouldForwardProp: (prop) => !['influence', 'faction'].includes(prop)
})<{ influence: number; faction: string }>`
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
  const { gameState, updateFactionInfluence } = useGameState();
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleRegionClick = (regionId: string) => {
    const region = valdarenMapData.regions.find(r => r.id === regionId);
    if (region) {
      setSelectedRegion(regionId);
      // Add faction influence for visiting regions
      const factionKey = region.faction.toLowerCase();
      if (factionKey === 'institute' || factionKey === 'clans' || factionKey === 'echoborn') {
        updateFactionInfluence(factionKey as 'institute' | 'clans' | 'echoborn', 1);
      }
    }
  };

  const handleRegionHover = (regionId: string | null, event?: React.MouseEvent) => {
    setHoveredRegion(regionId);
    if (event && regionId) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
    }
  };

  const getRegionActions = (regionId: string) => {
    const region = valdarenMapData.regions.find(r => r.id === regionId);
    const valdarenRegion = valdarenRegions.find(r => r.id === regionId);
    if (!region || !valdarenRegion) return null;

    const actions = [];
    
    // Basic exploration action
    actions.push({
      id: 'explore',
      text: `🔍 Explore ${region.name}`,
      description: 'Discover secrets and lore of this region'
    });

    // Faction-specific actions
    if (region.faction === 'Institute') {
      actions.push({
        id: 'study',
        text: '📚 Visit Institute Archives',
        description: 'Study Ellidric in structured academic settings'
      });
    } else if (region.faction === 'Clans') {
      actions.push({
        id: 'listen',
        text: '🎵 Listen to Clan Stories',
        description: 'Learn Ellidric through oral traditions'
      });
    } else if (region.faction === 'Echoborn') {
      actions.push({
        id: 'commune',
        text: '🔮 Commune with Ancient Glyphs',
        description: 'Experience Ellidric as living language'
      });
    } else {
      actions.push({
        id: 'negotiate',
        text: '🤝 Engage in Diplomacy',
        description: 'Navigate neutral territory politics'
      });
    }

    return actions;
  };

  const selectedRegionData = selectedRegion ? 
    valdarenMapData.regions.find(r => r.id === selectedRegion) : null;
  const selectedValdarenRegion = selectedRegion ?
    valdarenRegions.find(r => r.id === selectedRegion) : null;

  return (
    <HubContainer>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <HubTitle>Map of Valdaren</HubTitle>
      </motion.div>

      <OuterMapContainer>
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
          <MapRow>
            <MapImage>
              <MapContainer>
                {/* Static image map */}
                <ImgMain src="/src/maps/map-of-valdaren.png" alt="Map of Valdaren" />
                <ImgOverlay src="/src/maps/factions-of-valdaren.png" alt="Faction overlay" />
                
                {/* Interactive hotspots */}
                {valdarenMapData.regions.map((region) => (
                  <RegionHotspot
                    key={region.id}
                    x={region.x}
                    y={region.y}
                    w={region.w}
                    h={region.h}
                    faction={region.faction}
                    isSelected={selectedRegion === region.id}
                    onClick={() => handleRegionClick(region.id)}
                    onMouseEnter={(e) => handleRegionHover(region.id, e)}
                    onMouseLeave={() => handleRegionHover(null)}
                  />
                ))}

                {/* Tooltip */}
                {hoveredRegion && (
                  <RegionTooltip
                    x={tooltipPosition.x}
                    y={tooltipPosition.y}
                    faction={valdarenMapData.regions.find(r => r.id === hoveredRegion)?.faction || 'Neutral'}
                    visible={!!hoveredRegion}
                  >
                    {valdarenMapData.regions.find(r => r.id === hoveredRegion)?.name}
                    <br />
                    <small>Click to explore</small>
                  </RegionTooltip>
                )}

                {/* Region Detail Panel */}
                {selectedRegionData && selectedValdarenRegion && (
                  <RegionDetailPanel faction={selectedRegionData.faction}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 style={{ color: '#d4af37', margin: 0 }}>{selectedRegionData.name}</h4>
                      <button 
                        onClick={() => setSelectedRegion(null)}
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.1)', 
                          border: 'none', 
                          color: 'white', 
                          width: '24px', 
                          height: '24px',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <div style={{ fontSize: '0.9em', color: '#9ca3af', marginBottom: '12px' }}>
                      {selectedValdarenRegion.description}
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '0.85em', marginBottom: '8px' }}>
                        <strong>Influence:</strong> {selectedRegionData.influence}%
                      </div>
                      <div style={{ fontSize: '0.85em', marginBottom: '8px' }}>
                        <strong>Faction:</strong> {selectedRegionData.faction}
                      </div>
                      <div style={{ fontSize: '0.85em' }}>
                        <strong>Your Standing:</strong> {gameState.factionInfluence?.[selectedRegionData.faction.toLowerCase() as keyof typeof gameState.factionInfluence] || 0}
                      </div>
                    </div>
                    
                    {/* Region Actions */}
                    <div>
                      <div style={{ fontSize: '0.9em', fontWeight: 'bold', marginBottom: '8px', color: '#d4af37' }}>
                        Available Actions:
                      </div>
                      {getRegionActions(selectedRegion!)?.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => {
                            // Handle action - for now just show an alert
                            alert(`${action.text}: ${action.description}`);
                          }}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '8px 12px',
                            margin: '4px 0',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.85em',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                          }}
                        >
                          {action.text}
                        </button>
                      ))}
                    </div>
                  </RegionDetailPanel>
                )}
              </MapContainer>
            </MapImage>
            {/* Sidebar Legend */}
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
              <div style={{ marginTop: '12px', fontSize: '0.8em', color: '#9ca3af' }}>
                💡 <strong>Tip:</strong> Click regions on the map to explore and interact!
              </div>
            </MapLegend>
          </MapRow>
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
      </OuterMapContainer>
    </HubContainer>
  );
};

export default WorldMap;