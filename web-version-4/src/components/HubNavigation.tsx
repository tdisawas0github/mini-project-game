import { motion } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import {
  HubContainer,
  HubTitle,
  HubSubtitle,
  ChoicesContainer,
  ChoiceButton
} from '../styles/visualNovel';

interface HubNavigationProps {
  onNavigate: (destination: string) => void;
}

const HubNavigation = ({ onNavigate }: HubNavigationProps) => {
  const { gameState } = useGameState();

  const hubOptions = [
    {
      id: 'world_map',
      title: '🗺️ Map of Valdaren',
      description: 'Explore the three realms and their faction influences',
      available: true
    },
    {
      id: 'lexicon',
      title: '📚 Ellidric Lexicon',
      description: 'Study the glyphs you have unlocked and their meanings',
      available: gameState.unlockedGlyphs.length > 0
    },
    {
      id: 'memory_chamber',
      title: '🧠 Memory-Dive Chamber',
      description: 'Enter dreamscapes to recover lost memories',
      available: gameState.playerName !== '' // Available after prologue
    },
    {
      id: 'faction_overview',
      title: '⚖️ Faction Relations',
      description: 'Review your standing with the three powers of Valdaren',
      available: true
    },
    {
      id: 'language_study',
      title: '🔤 Linguistic Studies',
      description: 'Deepen your understanding of mortal tongues',
      available: gameState.knownLanguages.length > 0
    },
    {
      id: 'character_relationships',
      title: '👥 Character Relations',
      description: 'Review your connections and alliances with key figures',
      available: gameState.playerName !== ''
    },
    {
      id: 'achievements',
      title: '🏆 Achievements',
      description: 'Track your progress and accomplishments in Valdaren',
      available: true
    },
    {
      id: 'save_load',
      title: '💾 Save & Load',
      description: 'Preserve your journey or continue from a previous save',
      available: true
    },
    {
      id: 'systems_test',
      title: '🧪 Systems Test',
      description: 'Test and debug the enhanced game systems',
      available: true
    },
    {
      id: 'continue_story',
      title: '📖 Continue Journey',
      description: 'Advance the main story of the First Speaker',
      available: gameState.playerName !== '' // If they have a name, they completed prologue
    }
  ];

  return (
    <HubContainer>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <HubTitle>The Crossroads of Memory</HubTitle>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <HubSubtitle>
          Ancient glyphs pulse with recognition around you, {gameState.playerName || 'First Speaker'}. 
          The frost-wrapped land of Valdaren awaits your choices, each path leading to different truths 
          about your forgotten identity and the power of Ellidric.
        </HubSubtitle>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        style={{ width: '100%', maxWidth: '600px' }}
      >
        <ChoicesContainer>
          {hubOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: 0.8 + index * 0.1, 
                duration: 0.4 
              }}
            >
              <ChoiceButton
                onClick={() => onNavigate(option.id)}
                disabled={!option.available}
                style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}
              >
                <div style={{ fontSize: '1.1em', fontWeight: '600' }}>
                  {option.title}
                </div>
                <div style={{ 
                  fontSize: '0.9em', 
                  opacity: 0.8,
                  lineHeight: '1.3'
                }}>
                  {option.description}
                </div>
                {!option.available && (
                  <div style={{ 
                    fontSize: '0.8em', 
                    opacity: 0.6,
                    color: '#ef4444',
                    fontStyle: 'italic'
                  }}>
                    Requires more progress
                  </div>
                )}
              </ChoiceButton>
            </motion.div>
          ))}
        </ChoicesContainer>
      </motion.div>

      {/* Game state display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{ 
          marginTop: '40px',
          padding: '20px',
          background: 'rgba(15, 15, 35, 0.6)',
          borderRadius: '12px',
          border: '1px solid rgba(148, 163, 184, 0.3)'
        }}
      >
        <h3 style={{ color: '#d4af37', marginBottom: '16px', textAlign: 'center' }}>
          Your Journey So Far
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px',
          fontSize: '0.9em' 
        }}>
          <div>
            <strong>Known Languages:</strong><br />
            {gameState.knownLanguages.length > 0 
              ? gameState.knownLanguages.join(', ')
              : 'None yet'
            }
          </div>
          
          <div>
            <strong>Unlocked Glyphs:</strong><br />
            {gameState.unlockedGlyphs.length} discovered
          </div>
          
          <div>
            <strong>Current Language:</strong><br />
            {gameState.currentLanguage || 'None selected'}
          </div>
        </div>

        {gameState.knownLanguages.length > 0 && (
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <strong>Faction Standing:</strong>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-around', 
              marginTop: '8px',
              fontSize: '0.85em'
            }}>
              <span>Institute: {gameState.factionInfluence.institute}</span>
              <span>Clans: {gameState.factionInfluence.clans}</span>
              <span>Echoborn: {gameState.factionInfluence.echoborn}</span>
            </div>
          </div>
        )}
      </motion.div>
    </HubContainer>
  );
};

export default HubNavigation;