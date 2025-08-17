import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';

// Global visual novel styles
export const VisualNovelGlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Cinzel:wght@400;600&display=swap');
  
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: 'Crimson Text', serif;
    background: #000;
    overflow: hidden;
  }
  
  /* Custom scrollbar for visual novel feel */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(212, 175, 55, 0.6);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(212, 175, 55, 0.8);
  }
`;

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideInFromBottom = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const textReveal = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const glowPulse = keyframes`
  0%, 100% { filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.3)); }
  50% { filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.6)); }
`;

// Main container for the entire visual novel
export const VisualNovelContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

// Background layer for scenes
export const BackgroundLayer = styled.div<{ $backgroundImage?: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.$backgroundImage ? `url(${props.$backgroundImage})` : 'transparent'};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: brightness(0.7) blur(1px);
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(transparent 0%, transparent 60%, rgba(0, 0, 0, 0.8) 100%);
  }
`;

// Character sprites layer
export const CharacterLayer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80%;
  z-index: 2;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

// UI overlay layer
export const UILayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
  
  * {
    pointer-events: auto;
  }
`;

// Main dialogue box
export const DialogueBox = styled(motion.div)`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 85%;
  max-width: 900px;
  min-height: 160px;
  background: linear-gradient(135deg, 
    rgba(15, 15, 35, 0.95) 0%, 
    rgba(26, 26, 46, 0.98) 50%, 
    rgba(22, 33, 62, 0.95) 100%
  );
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 25px rgba(212, 175, 55, 0.15);
  padding: 30px 35px;
  max-height: 280px;
  overflow-y: auto;
  animation: ${slideInFromBottom} 0.5s ease-out;
  
  @media (max-width: 768px) {
    width: 90%;
    padding: 25px;
    bottom: 30px;
    min-height: 140px;
  }
  
  @media (max-width: 480px) {
    width: 95%;
    padding: 20px;
    bottom: 20px;
    min-height: 120px;
  }
`;

// Character name box
export const NameBox = styled.div`
  position: absolute;
  top: -15px;
  left: 30px;
  background: linear-gradient(135deg, 
    rgba(212, 175, 55, 0.9) 0%, 
    rgba(184, 134, 11, 0.95) 100%
  );
  color: #0f0f23;
  padding: 8px 20px;
  border-radius: 20px;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

// Dialogue text
export const DialogueText = styled.div`
  font-family: 'Crimson Text', serif;
  font-size: 1.15rem;
  line-height: 1.7;
  color: #e2e8f0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  animation: ${textReveal} 0.8s ease-out;
  margin-top: 8px;
  white-space: pre-wrap;
  word-wrap: break-word;
  
  /* Special text styling for glyphs/foreign text */
  .glyph {
    color: #d4af37;
    font-style: italic;
    text-decoration: underline;
    cursor: help;
    transition: all 0.3s ease;
    
    &:hover {
      color: #fbbf24;
      filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.5));
    }
  }
  
  /* Emphasis text */
  .emphasis {
    font-weight: 600;
    color: #fbbf24;
  }
  
  /* Whisper text */
  .whisper {
    font-style: italic;
    color: #94a3b8;
    font-size: 0.95em;
  }
`;

// Choice buttons container
export const ChoicesContainer = styled.div`
  position: absolute;
  bottom: 320px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 320px;
  max-width: 650px;
  width: 80%;
  
  @media (max-width: 768px) {
    width: 85%;
    bottom: 290px;
  }
  
  @media (max-width: 480px) {
    width: 90%;
    bottom: 270px;
    min-width: 280px;
  }
`;

// Individual choice button
export const ChoiceButton = styled(motion.button)`
  background: linear-gradient(135deg, 
    rgba(15, 15, 35, 0.9) 0%, 
    rgba(26, 26, 46, 0.95) 50%, 
    rgba(22, 33, 62, 0.9) 100%
  );
  border: 2px solid rgba(212, 175, 55, 0.4);
  color: #e2e8f0;
  padding: 15px 25px;
  border-radius: 10px;
  font-family: 'Crimson Text', serif;
  font-size: 1rem;
  cursor: pointer;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  text-align: left;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  
  &:hover {
    border-color: rgba(212, 175, 55, 0.8);
    background: linear-gradient(135deg, 
      rgba(212, 175, 55, 0.1) 0%, 
      rgba(26, 26, 46, 0.95) 50%, 
      rgba(22, 33, 62, 0.9) 100%
    );
    transform: translateX(10px);
    box-shadow: 
      0 6px 20px rgba(0, 0, 0, 0.4),
      0 0 15px rgba(212, 175, 55, 0.2);
  }
  
  &:active {
    transform: translateX(10px) scale(0.98);
  }
  
  /* Special styling for disabled choices */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: rgba(148, 163, 184, 0.3);
    
    &:hover {
      transform: none;
      background: linear-gradient(135deg, 
        rgba(15, 15, 35, 0.9) 0%, 
        rgba(26, 26, 46, 0.95) 50%, 
        rgba(22, 33, 62, 0.9) 100%
      );
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }
  }
`;

// Top UI bar for game controls
export const TopUIBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(180deg, 
    rgba(0, 0, 0, 0.8) 0%, 
    rgba(0, 0, 0, 0.4) 50%,
    transparent 100%
  );
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  z-index: 15;
`;

// UI buttons (save, load, menu, etc.)
export const UIButton = styled(motion.button)`
  background: rgba(15, 15, 35, 0.8);
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: #e2e8f0;
  padding: 8px 16px;
  border-radius: 20px;
  font-family: 'Cinzel', serif;
  font-size: 0.8rem;
  cursor: pointer;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(212, 175, 55, 0.8);
    background: rgba(212, 175, 55, 0.1);
    animation: ${glowPulse} 2s infinite;
  }
`;

// Game title
export const GameTitle = styled.h1`
  font-family: 'Cinzel', serif;
  font-size: 2.5rem;
  font-weight: 600;
  color: #d4af37;
  text-align: center;
  margin: 0;
  text-shadow: 
    2px 2px 4px rgba(0, 0, 0, 0.8),
    0 0 20px rgba(212, 175, 55, 0.3);
  animation: ${glowPulse} 3s infinite;
`;

// Menu overlay
export const MenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Menu content
export const MenuContent = styled(motion.div)`
  background: linear-gradient(135deg, 
    rgba(15, 15, 35, 0.95) 0%, 
    rgba(26, 26, 46, 0.98) 50%, 
    rgba(22, 33, 62, 0.95) 100%
  );
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 30px rgba(212, 175, 55, 0.1);
  text-align: center;
`;

// Menu button
export const MenuButton = styled(motion.button)`
  display: block;
  width: 100%;
  background: transparent;
  border: 2px solid rgba(212, 175, 55, 0.4);
  color: #e2e8f0;
  padding: 15px 30px;
  margin: 10px 0;
  border-radius: 10px;
  font-family: 'Crimson Text', serif;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(212, 175, 55, 0.8);
    background: rgba(212, 175, 55, 0.1);
    transform: scale(1.02);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

// Status indicators (for language learning, faction influence, etc.)
export const StatusIndicator = styled.div<{ $color?: string }>`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(15, 15, 35, 0.9);
  border: 1px solid ${props => props.$color || 'rgba(212, 175, 55, 0.3)'};
  border-radius: 10px;
  padding: 10px 15px;
  font-family: 'Cinzel', serif;
  font-size: 0.8rem;
  color: ${props => props.$color || '#d4af37'};
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
`;

// Loading screen
export const LoadingScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// Loading spinner
export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(212, 175, 55, 0.3);
  border-top: 3px solid #d4af37;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Auto-play indicator
export const AutoPlayIndicator = styled.div<{ $isActive: boolean }>`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: ${props => props.$isActive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(15, 15, 35, 0.8)'};
  border: 1px solid ${props => props.$isActive ? 'rgba(34, 197, 94, 0.6)' : 'rgba(212, 175, 55, 0.3)'};
  color: ${props => props.$isActive ? '#22c55e' : '#e2e8f0'};
  padding: 8px 12px;
  border-radius: 20px;
  font-family: 'Cinzel', serif;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  
  &:hover {
    opacity: 0.8;
  }
`;

// Name input container
export const NameInputContainer = styled(motion.div)`
  position: absolute;
  bottom: 280px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, 
    rgba(15, 15, 35, 0.95) 0%, 
    rgba(26, 26, 46, 0.98) 50%, 
    rgba(22, 33, 62, 0.95) 100%
  );
  border: 2px solid rgba(212, 175, 55, 0.4);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  padding: 30px 40px;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 20px rgba(212, 175, 55, 0.1);
  min-width: 400px;
  text-align: center;
`;

// Name input field
export const NameInput = styled.input`
  width: 100%;
  background: rgba(15, 15, 35, 0.8);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 10px;
  color: #e2e8f0;
  padding: 15px 20px;
  font-family: 'Crimson Text', serif;
  font-size: 1.1rem;
  text-align: center;
  margin: 20px 0;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(212, 175, 55, 0.8);
    background: rgba(212, 175, 55, 0.05);
    box-shadow: 
      0 0 0 3px rgba(212, 175, 55, 0.2),
      0 4px 15px rgba(0, 0, 0, 0.3);
  }
  
  &::placeholder {
    color: rgba(226, 232, 240, 0.5);
    font-style: italic;
  }
`;

// Input label
export const InputLabel = styled.div`
  font-family: 'Cinzel', serif;
  font-size: 1.1rem;
  color: #d4af37;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// Input confirm button
export const InputButton = styled(motion.button)`
  background: linear-gradient(135deg, 
    rgba(212, 175, 55, 0.8) 0%, 
    rgba(184, 134, 11, 0.9) 100%
  );
  border: none;
  color: #0f0f23;
  padding: 12px 30px;
  border-radius: 10px;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 15px;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, 
      rgba(212, 175, 55, 1) 0%, 
      rgba(184, 134, 11, 1) 100%
    );
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
  }
  
  &:active {
    transform: translateY(-2px) scale(0.98);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;
