/**
 * New Dialog System Types
 * Clean, focused type definitions for the rebuilt dialog system
 */

export interface DialogScene {
  id: string;
  speaker: string;
  text: string | string[];
  choices?: DialogChoice[];
  autoAdvance?: string;
  effects?: SceneEffect[];
  background?: string;
  character?: string;
  metadata?: Record<string, unknown>;
}

export interface DialogChoice {
  id: string;
  text: string;
  nextScene?: string;
  requirements?: Requirement[];
  effects?: ChoiceEffect[];
  metadata?: Record<string, unknown>;
}

export interface Requirement {
  type: 'language' | 'memory' | 'consequence' | 'custom';
  key: string;
  value?: string | number | boolean;
  operator?: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'includes';
}

export interface SceneEffect {
  type: 'learn_language' | 'unlock_memory' | 'faction_influence' | 'add_consequence' | 'custom';
  key: string;
  value: string | number;
  metadata?: Record<string, unknown>;
}

export type ChoiceEffect = SceneEffect;

export interface DialogState {
  currentSceneId: string;
  currentTextIndex: number;
  isTextComplete: boolean;
  displayedText: string;
  isTyping: boolean;
  showChoices: boolean;
  showNameInput: boolean;
  error?: string;
}

export interface DialogConfig {
  typingSpeed: number;
  autoAdvanceDelay: number;
  enableAutoPlay: boolean;
  enableSounds: boolean;
  enableKeyboardNavigation: boolean;
  textEffects: boolean;
}

export interface DialogProviderProps {
  scenes: DialogScene[];
  initialSceneId: string;
  config?: Partial<DialogConfig>;
  onSceneChange?: (sceneId: string) => void;
  onComplete?: () => void;
  onChoiceSelect?: (choiceId: string) => void;
  onError?: (error: Error) => void;
}

export type DialogAction = 
  | { type: 'SET_SCENE'; payload: string }
  | { type: 'SET_TEXT_INDEX'; payload: number }
  | { type: 'SET_TEXT_COMPLETE'; payload: boolean }
  | { type: 'SET_DISPLAYED_TEXT'; payload: string }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'SET_SHOW_CHOICES'; payload: boolean }
  | { type: 'SET_SHOW_NAME_INPUT'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'RESET' };

export interface DialogContextValue {
  state: DialogState;
  config: DialogConfig;
  currentScene?: DialogScene;
  dispatch: (action: DialogAction) => void;
  advanceText: () => void;
  selectChoice: (choice: DialogChoice) => void;
  canUseChoice: (choice: DialogChoice) => boolean;
  skipTyping: () => void;
  resetDialog: () => void;
}

// Hook return types
export interface UseDialogText {
  displayedText: string;
  isTyping: boolean;
  isComplete: boolean;
  skipTyping: () => void;
}

export interface UseDialogChoices {
  choices: DialogChoice[];
  showChoices: boolean;
  selectChoice: (choice: DialogChoice) => void;
  canUseChoice: (choice: DialogChoice) => boolean;
}

export interface UseDialogNavigation {
  currentScene?: DialogScene;
  advanceText: () => void;
  goToScene: (sceneId: string) => void;
  resetDialog: () => void;
}