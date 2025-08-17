import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  VisualNovelContainer,
  BackgroundLayer,
  UILayer,
  GameTitle,
  MenuOverlay,
  MenuContent,
  MenuButton,
  LoadingScreen,
  LoadingSpinner
} from '../styles/visualnovel';

interface VNMainMenuProps {
  onStartGame: () => void;
  onLoadGame: () => void;
  onSettings: () => void;
  backgroundImage?: string;
}

export function VNMainMenu({ 
  onStartGame, 
  onLoadGame, 
  onSettings,
  backgroundImage = '/assets/map-of-valdaren.png'
}: VNMainMenuProps) {
  const [loading, setLoading] = useState(true);
  const [showCredits, setShowCredits] = useState(false);
  const [hasSaveFile, setHasSaveFile] = useState(false);

  useEffect(() => {
    // Check for existing save file
    const saveData = localStorage.getItem('ellidra_save');
    setHasSaveFile(!!saveData);
    
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <LoadingScreen>
        <GameTitle style={{ marginBottom: '40px' }}>Echoes of Ellidra</GameTitle>
        <LoadingSpinner />
        <motion.p
          style={{ 
            color: '#d4af37', 
            fontFamily: 'Crimson Text, serif',
            fontSize: '1.1rem',
            textAlign: 'center',
            maxWidth: '400px',
            lineHeight: 1.6
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading the mystical realm of Valdaren...
        </motion.p>
      </LoadingScreen>
    );
  }

  return (
    <VisualNovelContainer>
      {/* Background */}
      <BackgroundLayer $backgroundImage={backgroundImage} />
      
      {/* Main Menu UI */}
      <UILayer>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: '20px'
        }}>
          {/* Game Title */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ marginBottom: '60px', textAlign: 'center' }}
          >
            <GameTitle>Echoes of Ellidra</GameTitle>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              style={{
                color: '#94a3b8',
                fontSize: '1.2rem',
                fontStyle: 'italic',
                marginTop: '10px',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
              }}
            >
              A journey through forgotten languages and ancient mysteries
            </motion.p>
          </motion.div>

          {/* Menu Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '15px',
              minWidth: '300px'
            }}
          >
            <MenuButton
              whileHover={{ scale: 1.05, x: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartGame}
            >
              Begin Your Journey
            </MenuButton>

            {hasSaveFile && (
              <MenuButton
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLoadGame}
              >
                Continue Journey
              </MenuButton>
            )}

            <MenuButton
              whileHover={{ scale: 1.05, x: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSettings}
            >
              Settings
            </MenuButton>

            <MenuButton
              whileHover={{ scale: 1.05, x: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCredits(true)}
            >
              Credits
            </MenuButton>
          </motion.div>

          {/* Version info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              color: '#64748b',
              fontSize: '0.8rem',
              fontFamily: 'Cinzel, serif'
            }}
          >
            v1.0.0 - Web Edition
          </motion.p>
        </div>
      </UILayer>

      {/* Credits Modal */}
      <AnimatePresence>
        {showCredits && (
          <MenuOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCredits(false)}
          >
            <MenuContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ 
                fontFamily: 'Cinzel, serif', 
                color: '#d4af37', 
                marginBottom: '30px' 
              }}>
                Credits
              </h2>
              
              <div style={{ 
                textAlign: 'left', 
                color: '#e2e8f0', 
                lineHeight: 1.8,
                marginBottom: '30px'
              }}>
                <p><strong>Story & Design:</strong> AI Assistant</p>
                <p><strong>Development:</strong> Collaborative Creation</p>
                <p><strong>World Building:</strong> Valdaren Universe</p>
                <p><strong>Visual Novel Engine:</strong> React + Framer Motion</p>
                <p><strong>Typography:</strong> Crimson Text & Cinzel</p>
                <p><strong>Special Thanks:</strong> To all the language learners and visual novel enthusiasts</p>
              </div>

              <MenuButton
                onClick={() => setShowCredits(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </MenuButton>
            </MenuContent>
          </MenuOverlay>
        )}
      </AnimatePresence>
    </VisualNovelContainer>
  );
}
