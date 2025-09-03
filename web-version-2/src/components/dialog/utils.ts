/**
 * Dialog Utilities
 * Helper functions for converting legacy data and other utilities
 */

import type { DialogueNode, DialogueChoice } from '../../types/game';
import type { DialogScene, DialogChoice, Requirement, ChoiceEffect, SceneEffect } from './types';

/**
 * Convert legacy DialogueNode to new DialogScene format
 */
export function convertLegacyScene(legacyScene: DialogueNode): DialogScene {
  return {
    id: legacyScene.id,
    speaker: legacyScene.speaker,
    text: legacyScene.text,
    choices: legacyScene.choices?.map(convertLegacyChoice),
    autoAdvance: legacyScene.autoAdvance,
    effects: legacyScene.effects?.map(effect => ({
      type: effect.type === 'add_consequence' ? 'custom' : effect.type,
      key: effect.faction || effect.value,
      value: effect.amount || effect.value,
      metadata: { originalEffect: effect },
    })) as SceneEffect[] | undefined,
  };
}

/**
 * Convert legacy DialogueChoice to new DialogChoice format
 */
export function convertLegacyChoice(legacyChoice: DialogueChoice): DialogChoice {
  const requirements: Requirement[] = [];
  const effects: ChoiceEffect[] = [];

  // Convert requirements
  if (legacyChoice.requiresLanguages) {
    legacyChoice.requiresLanguages.forEach(lang => {
      requirements.push({
        type: 'language',
        key: lang,
        operator: 'eq',
        value: true,
      });
    });
  }

  // Convert effects
  if (legacyChoice.consequences) {
    legacyChoice.consequences.forEach(consequence => {
      effects.push({
        type: 'custom',
        key: 'choices',
        value: consequence,
      });
    });
  }

  if (legacyChoice.unlocks) {
    legacyChoice.unlocks.forEach(unlock => {
      effects.push({
        type: 'unlock_memory',
        key: unlock,
        value: unlock,
      });
    });
  }

  // Handle language learning from choice ID
  if (legacyChoice.id.startsWith('choose_')) {
    const lang = legacyChoice.id.replace('choose_', '');
    if (['english', 'dutch', 'latin', 'greek'].includes(lang)) {
      effects.push({
        type: 'learn_language',
        key: lang,
        value: lang.charAt(0).toUpperCase() + lang.slice(1),
      });
    }
  }

  // Determine next scene from choice ID
  let nextScene: string | undefined;
  if (legacyChoice.id === 'who_are_you') {
    nextScene = 'figure_response_identity';
  } else if (legacyChoice.id === 'return_from_where') {
    nextScene = 'figure_response_memory';
  } else if (legacyChoice.id === 'use_glyph') {
    nextScene = 'figure_response_glyph';
  }

  return {
    id: legacyChoice.id,
    text: legacyChoice.text,
    nextScene,
    requirements: requirements.length > 0 ? requirements : undefined,
    effects: effects.length > 0 ? effects : undefined,
    metadata: {
      glyphUsed: legacyChoice.glyphUsed,
      originalChoice: legacyChoice,
    },
  };
}

/**
 * Convert array of legacy scenes to new format
 */
export function convertLegacyScenes(legacyScenes: DialogueNode[]): DialogScene[] {
  return legacyScenes.map(convertLegacyScene);
}

/**
 * Validate dialog scene structure
 */
export function validateDialogScene(scene: DialogScene): string[] {
  const errors: string[] = [];

  if (!scene.id?.trim()) {
    errors.push('Scene must have a valid id');
  }

  if (!scene.speaker?.trim()) {
    errors.push('Scene must have a speaker');
  }

  if (!scene.text) {
    errors.push('Scene must have text');
  } else if (Array.isArray(scene.text) && scene.text.length === 0) {
    errors.push('Scene text array cannot be empty');
  }

  if (scene.choices) {
    scene.choices.forEach((choice, index) => {
      if (!choice.id?.trim()) {
        errors.push(`Choice ${index} must have a valid id`);
      }
      if (!choice.text?.trim()) {
        errors.push(`Choice ${index} must have text`);
      }
    });
  }

  if (scene.autoAdvance && scene.choices && scene.choices.length > 0) {
    errors.push('Scene cannot have both autoAdvance and choices');
  }

  return errors;
}

/**
 * Find all scene references in choices to validate scene graph
 */
export function findSceneReferences(scenes: DialogScene[]): {
  referenced: Set<string>;
  missing: Set<string>;
  unreachable: Set<string>;
} {
  const sceneIds = new Set(scenes.map(scene => scene.id));
  const referenced = new Set<string>();
  const missing = new Set<string>();

  scenes.forEach(scene => {
    // Check autoAdvance references
    if (scene.autoAdvance) {
      referenced.add(scene.autoAdvance);
      if (!sceneIds.has(scene.autoAdvance)) {
        missing.add(scene.autoAdvance);
      }
    }

    // Check choice references
    scene.choices?.forEach(choice => {
      if (choice.nextScene) {
        referenced.add(choice.nextScene);
        if (!sceneIds.has(choice.nextScene)) {
          missing.add(choice.nextScene);
        }
      }
    });
  });

  // Find unreachable scenes (not referenced by any other scene)
  const unreachable = new Set<string>();
  sceneIds.forEach(sceneId => {
    if (!referenced.has(sceneId)) {
      unreachable.add(sceneId);
    }
  });

  return { referenced, missing, unreachable };
}

/**
 * Create a simple dialog scene for testing
 */
export function createTestScene(
  id: string, 
  speaker: string, 
  text: string, 
  choices?: Array<{ id: string; text: string; nextScene?: string }>
): DialogScene {
  return {
    id,
    speaker,
    text,
    choices: choices?.map(choice => ({
      id: choice.id,
      text: choice.text,
      nextScene: choice.nextScene,
    })),
  };
}

/**
 * Deep clone a dialog scene
 */
export function cloneDialogScene(scene: DialogScene): DialogScene {
  return JSON.parse(JSON.stringify(scene));
}

/**
 * Merge dialog scenes, useful for extending or overriding scenes
 */
export function mergeDialogScenes(base: DialogScene, override: Partial<DialogScene>): DialogScene {
  return {
    ...base,
    ...override,
    choices: override.choices || base.choices,
    effects: override.effects || base.effects,
    metadata: {
      ...base.metadata,
      ...override.metadata,
    },
  };
}