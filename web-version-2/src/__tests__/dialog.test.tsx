/**
 * Tests for the new Dialog System
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DialogEngine } from '../components/dialog/DialogEngine';
import { convertLegacyScene, validateDialogScene, createTestScene } from '../components/dialog/utils';
import type { DialogScene, DialogChoice } from '../components/dialog/types';
import type { GameState } from '../types/game';

// Mock game state for testing
const mockGameState: GameState = {
  playerName: 'Test Player',
  knownLanguages: ['common', 'english'],
  languageFlags: { english: true, dutch: false },
  memories: {
    test_memory: {
      id: 'test_memory',
      title: 'Test Memory',
      locked: false,
      content: 'A test memory',
    },
  },
  consequenceMap: {
    choices: ['test_consequence'],
  },
  factionInfluence: {
    'Test Faction': 50,
  },
  currentScene: 'test_scene',
  completedScenes: [],
};

describe('DialogEngine', () => {
  let engine: DialogEngine;
  let testScenes: DialogScene[];

  beforeEach(() => {
    testScenes = [
      createTestScene('scene1', 'Speaker', 'Hello world'),
      createTestScene('scene2', 'Speaker', 'Second scene', [
        { id: 'choice1', text: 'Choice 1', nextScene: 'scene3' },
        { id: 'choice2', text: 'Choice 2' },
      ]),
      createTestScene('scene3', 'Speaker', 'Third scene'),
    ];

    engine = new DialogEngine(testScenes);
    engine.setGameState(mockGameState);
  });

  it('should initialize with scenes', () => {
    expect(engine.getScene('scene1')).toBeDefined();
    expect(engine.getScene('scene2')).toBeDefined();
    expect(engine.getScene('nonexistent')).toBeUndefined();
  });

  it('should validate scenes correctly', () => {
    const errors = engine.validateAllScenes();
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('should check choice requirements', () => {
    const choiceWithRequirement: DialogChoice = {
      id: 'test_choice',
      text: 'Test Choice',
      requirements: [
        { type: 'language', key: 'english' },
      ],
    };

    const choiceWithoutRequirement: DialogChoice = {
      id: 'test_choice2',
      text: 'Test Choice 2',
    };

    expect(engine.canUseChoice(choiceWithRequirement)).toBe(true);
    expect(engine.canUseChoice(choiceWithoutRequirement)).toBe(true);
  });

  it('should get next scene ID from choice', () => {
    const choice: DialogChoice = {
      id: 'test_choice',
      text: 'Test Choice',
      nextScene: 'scene3',
    };

    expect(engine.getNextSceneId(choice, 'scene1')).toBe('scene3');
  });

  it('should get available choices', () => {
    const scene = engine.getScene('scene2');
    if (scene) {
      const availableChoices = engine.getAvailableChoices(scene);
      expect(availableChoices).toHaveLength(2);
    }
  });
});

describe('Dialog Utils', () => {
  it('should validate dialog scenes', () => {
    const validScene = createTestScene('test', 'Speaker', 'Text');
    expect(validateDialogScene(validScene)).toHaveLength(0);

    const invalidScene = createTestScene('', '', '');
    const errors = validateDialogScene(invalidScene);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should convert legacy scenes', () => {
    const legacyScene = {
      id: 'legacy_scene',
      speaker: 'Legacy Speaker',
      text: 'Legacy text',
      choices: [
        {
          id: 'legacy_choice',
          text: 'Legacy choice',
          requiresLanguages: ['english'],
          consequences: ['test_consequence'],
        },
      ],
    };

    const converted = convertLegacyScene(legacyScene);
    expect(converted.id).toBe('legacy_scene');
    expect(converted.speaker).toBe('Legacy Speaker');
    expect(converted.text).toBe('Legacy text');
    expect(converted.choices).toBeDefined();
    expect(converted.choices![0].requirements).toBeDefined();
  });

  it('should create test scenes', () => {
    const scene = createTestScene('test', 'Speaker', 'Text', [
      { id: 'choice1', text: 'Choice 1' },
    ]);

    expect(scene.id).toBe('test');
    expect(scene.speaker).toBe('Speaker');
    expect(scene.text).toBe('Text');
    expect(scene.choices).toHaveLength(1);
  });
});