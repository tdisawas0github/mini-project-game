import { useState } from 'react';
import type { DialogueNode, DialogueChoice } from '../types/game';
import { useGame } from '../hooks/useGame';

interface DialogueSystemProps {
  scenes: DialogueNode[];
  currentSceneId: string;
  onSceneChange: (sceneId: string) => void;
  onComplete: () => void;
  onChoiceSelect?: (choiceId: string) => void; // new optional callback
}

export default function DialogueSystem({ 
  scenes, 
  currentSceneId, 
  onSceneChange, 
  onComplete,
  onChoiceSelect
}: DialogueSystemProps) {
  const { state, dispatch } = useGame();
  const [showNameInput, setShowNameInput] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const currentScene = scenes.find(scene => scene.id === currentSceneId);

  if (!currentScene) {
    return <div className="dialogue-error">Scene not found: {currentSceneId}</div>;
  }

  const handleChoice = (choice: DialogueChoice) => {
    // External notification first (so consumer can intercept)
    onChoiceSelect?.(choice.id);

    // Handle name input specially
    if (choice.id === 'choose_name') {
      setShowNameInput(true);
      return;
    }

    // Apply consequences
    choice.consequences?.forEach(consequence => {
      dispatch({ type: 'ADD_CONSEQUENCE', payload: { key: 'choices', value: consequence } });
    });

    // Unlock memories
    choice.unlocks?.forEach(unlock => {
      dispatch({ type: 'UNLOCK_MEMORY', payload: unlock });
    });

    // Learn languages
    if (choice.id.startsWith('choose_')) {
      const lang = choice.id.replace('choose_', '');
      dispatch({ type: 'LEARN_LANGUAGE', payload: lang });
    }

    // Apply glyph effects
    if (choice.glyphUsed) {
      dispatch({ type: 'ADD_CONSEQUENCE', payload: { 
        key: 'glyphs_used', 
        value: choice.glyphUsed 
      } });
    }

    // Navigation & special routing
    if (choice.id === 'who_are_you') {
      onSceneChange('figure_response_identity');
    } else if (choice.id === 'return_from_where') {
      onSceneChange('figure_response_memory');
    } else if (choice.id === 'use_glyph') {
      onSceneChange('figure_response_glyph');
    } else if (choice.id.startsWith('choose_') && currentSceneId === 'language_selection') {
      onComplete();
    } else if ([ 'open_map','open_lexicon','memory_dive','check_languages','view_consequences' ].includes(choice.id)) {
      // Hub commands: onChoiceSelect already informed parent; nothing more here.
      // Keep dialogue on same scene so hub UI persists.
    } else {
      if (currentScene.autoAdvance) {
        onSceneChange(currentScene.autoAdvance);
      } else {
        onComplete();
      }
    }
  };

  const handleNameSubmit = () => {
    if (nameInput.trim()) {
      dispatch({ type: 'SET_PLAYER_NAME', payload: nameInput.trim() });
      setShowNameInput(false);
      setNameInput('');
      onComplete(); // Go to language selection
    }
  };

  const canUseChoice = (choice: DialogueChoice) => {
    if (!choice.requiresLanguages) return true;
    return choice.requiresLanguages.every(lang => 
      state.knownLanguages.includes(lang) || state.languageFlags[lang]
    );
  };

  return (
    <div className="dialogue-system">
      <div className="dialogue-box">
        <div className="speaker-name">{currentScene.speaker}</div>
        <div className="dialogue-text">
          {currentScene.text}
        </div>
      </div>

      {showNameInput && (
        <div className="name-input">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Enter your name..."
            maxLength={30}
            onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
          />
          <button onClick={handleNameSubmit} disabled={!nameInput.trim()}>
            Confirm
          </button>
        </div>
      )}

      {currentScene.choices && !showNameInput && (
        <div className="dialogue-choices">
          {currentScene.choices.map(choice => (
            <button
              key={choice.id}
              className={`choice-button ${!canUseChoice(choice) ? 'disabled' : ''}`}
              onClick={() => handleChoice(choice)}
              disabled={!canUseChoice(choice)}
            >
              {choice.text}
              {choice.glyphUsed && (
                <span className="glyph-indicator">✨</span>
              )}
              {choice.requiresLanguages && (
                <span className="requirement">
                  (Requires: {choice.requiresLanguages.join(', ')})
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {currentScene.autoAdvance && !currentScene.choices && (
        <button 
          className="continue-button"
          onClick={() => onSceneChange(currentScene.autoAdvance!)}
        >
          Continue
        </button>
      )}
    </div>
  );
}
