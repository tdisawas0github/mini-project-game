/**
 * Dialog Engine - Core logic for dialog processing
 * Handles scene transitions, effects, and requirements
 */

import type { DialogScene, DialogChoice, Requirement, SceneEffect, ChoiceEffect } from './types';
import type { GameState } from '../../types/game';

export class DialogEngine {
  private scenes: Map<string, DialogScene>;
  private gameState?: GameState;
  private effectHandlers: Map<string, (effect: SceneEffect | ChoiceEffect, gameState: GameState) => void>;
  private requirementCheckers: Map<string, (requirement: Requirement, gameState: GameState) => boolean>;

  constructor(scenes: DialogScene[]) {
    this.scenes = new Map(scenes.map(scene => [scene.id, scene]));
    this.effectHandlers = new Map();
    this.requirementCheckers = new Map();
    this.initializeDefaultHandlers();
  }

  private initializeDefaultHandlers() {
    // Default effect handlers
    this.effectHandlers.set('learn_language', (effect, gameState) => {
      if (typeof effect.value === 'string' && !gameState.knownLanguages.includes(effect.value)) {
        gameState.knownLanguages.push(effect.value);
        gameState.languageFlags[effect.value.toLowerCase()] = true;
      }
    });

    this.effectHandlers.set('unlock_memory', (effect, gameState) => {
      if (typeof effect.value === 'string' && gameState.memories[effect.value]) {
        gameState.memories[effect.value].locked = false;
      }
    });

    this.effectHandlers.set('faction_influence', (effect, gameState) => {
      if (typeof effect.value === 'number' && effect.key) {
        gameState.factionInfluence[effect.key] = (gameState.factionInfluence[effect.key] || 0) + effect.value;
      }
    });

    this.effectHandlers.set('custom', (effect) => {
      // Custom effects can be handled by the game state or external systems
      console.log('Processing custom effect:', effect);
    });

    // Default requirement checkers
    this.requirementCheckers.set('language', (requirement, gameState) => {
      return gameState.knownLanguages.includes(requirement.key) || 
             gameState.languageFlags[requirement.key.toLowerCase()] === true;
    });

    this.requirementCheckers.set('memory', (requirement, gameState) => {
      const memory = gameState.memories[requirement.key];
      return memory ? !memory.locked : false;
    });

    this.requirementCheckers.set('consequence', (requirement, gameState) => {
      const consequences = gameState.consequenceMap[requirement.key] || [];
      if (requirement.operator === 'includes' && typeof requirement.value === 'string') {
        return consequences.includes(requirement.value);
      }
      return consequences.length > 0;
    });
  }

  setGameState(gameState: GameState) {
    this.gameState = gameState;
  }

  getScene(sceneId: string): DialogScene | undefined {
    return this.scenes.get(sceneId);
  }

  canUseChoice(choice: DialogChoice): boolean {
    if (!this.gameState || !choice.requirements) return true;

    return choice.requirements.every(requirement => {
      const checker = this.requirementCheckers.get(requirement.type);
      if (checker) {
        return checker(requirement, this.gameState!);
      }
      
      // Default to true for unknown requirement types
      console.warn(`Unknown requirement type: ${requirement.type}`);
      return true;
    });
  }

  processSceneEffects(scene: DialogScene) {
    if (!this.gameState || !scene.effects) return;

    scene.effects.forEach(effect => {
      const handler = this.effectHandlers.get(effect.type);
      if (handler) {
        handler(effect, this.gameState!);
      } else {
        console.warn(`Unknown effect type: ${effect.type}`);
      }
    });
  }

  processChoiceEffects(choice: DialogChoice) {
    if (!this.gameState || !choice.effects) return;

    choice.effects.forEach(effect => {
      const handler = this.effectHandlers.get(effect.type);
      if (handler) {
        handler(effect, this.gameState!);
      } else {
        console.warn(`Unknown effect type: ${effect.type}`);
      }
    });
  }

  getNextSceneId(choice: DialogChoice, currentSceneId: string): string | null {
    // Direct scene reference
    if (choice.nextScene) {
      return choice.nextScene;
    }

    // Legacy special case handling for backward compatibility
    const currentScene = this.getScene(currentSceneId);
    if (!currentScene) return null;

    // Check if current scene has auto-advance
    if (currentScene.autoAdvance) {
      return currentScene.autoAdvance;
    }

    return null;
  }

  // Extensibility methods
  registerEffectHandler(type: string, handler: (effect: SceneEffect | ChoiceEffect, gameState: GameState) => void) {
    this.effectHandlers.set(type, handler);
  }

  registerRequirementChecker(type: string, checker: (requirement: Requirement, gameState: GameState) => boolean) {
    this.requirementCheckers.set(type, checker);
  }

  // Utility methods
  getAvailableChoices(scene: DialogScene): DialogChoice[] {
    if (!scene.choices) return [];
    return scene.choices.filter(choice => this.canUseChoice(choice));
  }

  validateScene(scene: DialogScene): string[] {
    const errors: string[] = [];
    
    if (!scene.id) errors.push('Scene must have an id');
    if (!scene.speaker) errors.push('Scene must have a speaker');
    if (!scene.text) errors.push('Scene must have text');

    if (scene.choices) {
      scene.choices.forEach((choice, index) => {
        if (!choice.id) errors.push(`Choice ${index} must have an id`);
        if (!choice.text) errors.push(`Choice ${index} must have text`);
      });
    }

    return errors;
  }

  validateAllScenes(): Record<string, string[]> {
    const validation: Record<string, string[]> = {};
    
    for (const [sceneId, scene] of this.scenes) {
      const errors = this.validateScene(scene);
      if (errors.length > 0) {
        validation[sceneId] = errors;
      }
    }

    return validation;
  }
}