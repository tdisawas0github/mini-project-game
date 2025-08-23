/**
 * New Unified Dialog System
 * Replaces both DialogueSystem.tsx and VNDialogueSystem.tsx
 * with a clean, maintainable implementation
 */

import { DialogSystem } from './dialog';
import { convertLegacyScenes } from './dialog/utils';
import type { DialogueNode } from '../types/game';

interface NewDialogSystemProps {
  scenes: DialogueNode[];
  currentSceneId: string;
  onSceneChange?: (sceneId: string) => void;
  onComplete?: () => void;
  onChoiceSelect?: (choiceId: string) => void;
  backgroundImage?: string;
  characterSprite?: string;
  enableKeyboard?: boolean;
  enableSounds?: boolean;
}

/**
 * New unified dialog system that replaces the old components
 */
export function NewDialogSystem({
  scenes,
  currentSceneId,
  onSceneChange,
  onComplete,
  onChoiceSelect,
  backgroundImage,
  characterSprite,
  enableKeyboard = true,
  enableSounds = true,
}: NewDialogSystemProps) {
  // Convert legacy scenes to new format
  const convertedScenes = convertLegacyScenes(scenes);

  // Find the current scene to make sure it exists
  const currentScene = convertedScenes.find(scene => scene.id === currentSceneId);
  
  if (!currentScene) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'white',
        background: 'rgba(0, 0, 0, 0.8)',
      }}>
        <div>
          <h2>Scene not found: {currentSceneId}</h2>
          <p>Available scenes: {convertedScenes.map(s => s.id).join(', ')}</p>
        </div>
      </div>
    );
  }

  return (
    <DialogSystem
      scenes={convertedScenes}
      initialSceneId={currentSceneId}
      config={{
        enableSounds,
        enableKeyboardNavigation: enableKeyboard,
        typingSpeed: 30,
        autoAdvanceDelay: 2000,
        enableAutoPlay: false,
        textEffects: true,
      }}
      onSceneChange={onSceneChange}
      onComplete={onComplete}
      onChoiceSelect={onChoiceSelect}
      onError={(error) => {
        console.error('Dialog System Error:', error);
      }}
      backgroundImage={backgroundImage}
      characterSprite={characterSprite}
      enableKeyboard={enableKeyboard}
    />
  );
}

// Export for backward compatibility
export default NewDialogSystem;