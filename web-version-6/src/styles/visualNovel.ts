import styled, { keyframes, createGlobalStyle } from 'styled-components';

// Global styles for the Valdaren theme
export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Cormorant Garamond', 'Georgia', 'Times New Roman', serif;
    background: linear-gradient(135deg, 
      #0f0f23 0%, 
      #1a1a2e 25%, 
      #16213e 50%, 
      #1a1a2e 75%, 
      #0f0f23 100%
    );
    min-height: 100vh;
    color: #e2e8f0;
    overflow-x: hidden;
    font-size: 16px;
    line-height: 1.6;
    font-weight: 400;
    letter-spacing: 0.02em;
  }
`;

// Animation keyframes
const textReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glyphPulse = keyframes`
  0%, 100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
    filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.6));
  }
`;

// Main game container
export const GameContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background: linear-gradient(135deg, 
    rgba(15, 15, 35, 0.95) 0%, 
    rgba(26, 26, 46, 0.98) 50%, 
    rgba(22, 33, 62, 0.95) 100%
  );

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/assets/map-of-valdaren.png') center/cover;
    opacity: 0.05;
    z-index: -1;
  }
`;

// Visual novel interface container
export const NovelInterface = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

// Dialogue box styling
export const DialogueBox = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  max-width: 1160px;
  margin: 0 auto;
  background: linear-gradient(135deg, 
    rgba(15, 15, 35, 0.95) 0%, 
    rgba(26, 26, 46, 0.98) 50%, 
    rgba(22, 33, 62, 0.95) 100%
  );
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(212, 175, 55, 0.1),
    inset 0 1px 2px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  z-index: 100;
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
`;

// Speaker name styling
export const SpeakerName = styled.div`
  font-weight: 600;
  font-size: 1.2em;
  color: #d4af37;
  margin-bottom: 12px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  font-family: 'Cinzel', 'Cormorant Garamond', serif;
  letter-spacing: 0.05em;

  &::before {
    content: '◉ ';
    opacity: 0.7;
  }
`;

// Dialogue text styling
export const DialogueText = styled.div`
  font-size: 1.15em;
  line-height: 1.7;
  animation: ${textReveal} 0.8s ease-out;
  margin-bottom: 20px;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  font-weight: 400;
  letter-spacing: 0.01em;
  
  /* Special text styling for glyphs */
  .glyph {
    color: #d4af37;
    font-style: italic;
    text-decoration: underline;
    cursor: help;
    transition: all 0.3s ease;
    animation: ${glyphPulse} 2s ease-in-out infinite;
    font-weight: 500;
    
    &:hover {
      color: #f59e0b;
      filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.5));
      transform: scale(1.02);
    }
  }
  
  /* Emphasis text */
  .emphasis {
    font-weight: 600;
    color: #d4af37;
  }
  
  /* Whisper/narrator text */
  .whisper {
    font-style: italic;
    color: #9ca3af;
    font-size: 0.95em;
  }

  /* Name placeholder */
  .player-name {
    color: #60a5fa;
    font-weight: 600;
  }
`;

// Choices container
export const ChoicesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
`;

// Individual choice button
export const ChoiceButton = styled.button`
  background: linear-gradient(135deg, 
    rgba(15, 15, 35, 0.8) 0%, 
    rgba(26, 26, 46, 0.85) 50%, 
    rgba(22, 33, 62, 0.8) 100%
  );
  border: 2px solid rgba(148, 163, 184, 0.4);
  border-radius: 12px;
  color: #e2e8f0;
  padding: 16px 24px;
  font-size: 1.05em;
  font-family: 'Inter', 'Cormorant Garamond', serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  &::before {
    content: '▸ ';
    opacity: 0.7;
    transition: all 0.3s ease;
    font-weight: 600;
  }

  &:hover {
    border-color: rgba(212, 175, 55, 0.8);
    background: linear-gradient(135deg, 
      rgba(22, 33, 62, 0.95) 0%, 
      rgba(26, 26, 46, 0.98) 50%, 
      rgba(15, 15, 35, 0.95) 100%
    );
    transform: translateX(8px) scale(1.02);
    box-shadow: 
      0 8px 25px rgba(0, 0, 0, 0.5),
      0 0 20px rgba(212, 175, 55, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    
    &::before {
      opacity: 1;
      color: #d4af37;
      transform: scale(1.1);
    }
  }
  
  &:active {
    transform: translateX(10px) scale(0.98);
    box-shadow: 
      0 4px 15px rgba(0, 0, 0, 0.6),
      inset 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  &:focus {
    outline: none;
    border-color: rgba(212, 175, 55, 0.9);
    box-shadow: 
      0 0 0 3px rgba(212, 175, 55, 0.3),
      0 4px 15px rgba(0, 0, 0, 0.3);
  }
  
  /* Special styling for glyph choices */
  &.glyph-choice {
    border-color: rgba(212, 175, 55, 0.5);
    
    &::before {
      content: '◆ ';
      color: #d4af37;
      animation: ${glyphPulse} 2s ease-in-out infinite;
    }
  }

  /* Special styling for disabled choices */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: rgba(148, 163, 184, 0.3);
    
    &:hover {
      transform: none;
      background: linear-gradient(135deg, 
        rgba(15, 15, 35, 0.7) 0%, 
        rgba(26, 26, 46, 0.75) 50%, 
        rgba(22, 33, 62, 0.7) 100%
      );
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }
  }
`;

// Hub navigation styling
export const HubContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px;
`;

export const HubTitle = styled.h1`
  font-size: 3em;
  font-weight: 600;
  color: #d4af37;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.8),
    0 0 20px rgba(212, 175, 55, 0.3);
  font-family: 'Cinzel', 'Cormorant Garamond', serif;
  letter-spacing: 0.02em;
`;

export const HubSubtitle = styled.p`
  font-size: 1.3em;
  color: #9ca3af;
  text-align: center;
  margin-bottom: 40px;
  max-width: 600px;
  line-height: 1.6;
  font-family: 'Inter', 'Cormorant Garamond', sans-serif;
  font-weight: 400;
  letter-spacing: 0.01em;
`;

// Input styling for name entry
export const PlayerNameInput = styled.input`
  background: rgba(15, 15, 35, 0.8);
  border: 2px solid rgba(148, 163, 184, 0.4);
  border-radius: 12px;
  color: #e2e8f0;
  padding: 16px 20px;
  font-size: 1.1em;
  font-family: 'Inter', 'Cormorant Garamond', sans-serif;
  font-weight: 400;
  margin: 20px 0;
  width: 100%;
  max-width: 400px;
  text-align: center;

  &:focus {
    outline: none;
    border-color: rgba(212, 175, 55, 0.6);
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
  }

  &::placeholder {
    color: #6b7280;
  }
`;

// Loading/transition effects
export const SceneTransition = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #0f0f23, #1a1a2e);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  color: #d4af37;
`;