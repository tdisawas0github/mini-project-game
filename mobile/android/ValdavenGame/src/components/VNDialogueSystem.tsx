import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../hooks/useGame';
import { commonStyles, colors, typography, spacing } from '../styles';
import type { DialogueNode, DialogueChoice } from '../types/game';

interface VNDialogueSystemProps {
  scenes: DialogueNode[];
  currentSceneId: string;
  onSceneChange: (sceneId: string) => void;
  onSceneComplete: () => void;
  onNavigate?: (destination: string) => void;
}

export default function VNDialogueSystem({
  scenes,
  currentSceneId,
  onSceneChange,
  onSceneComplete,
  onNavigate,
}: VNDialogueSystemProps) {
  const { state, dispatch } = useGame();
  const [showNameInput, setShowNameInput] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const currentScene = scenes.find(scene => scene.id === currentSceneId);

  useEffect(() => {
    if (currentScene?.autoAdvance) {
      const timer = setTimeout(() => {
        onSceneChange(currentScene.autoAdvance!);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScene, onSceneChange]);

  const handleChoice = (choice: DialogueChoice) => {
    // Handle special cases
    if (choice.id === 'choose_name') {
      setShowNameInput(true);
      return;
    }

    // Handle navigation choices
    if (onNavigate && ['open_map', 'open_lexicon', 'memory_dive'].includes(choice.id)) {
      onNavigate(choice.id);
      return;
    }

    // Handle language learning
    if (choice.id.startsWith('choose_')) {
      const language = choice.id.replace('choose_', '');
      dispatch({ type: 'LEARN_LANGUAGE', payload: language });
    }

    // Process consequences
    if (choice.consequences) {
      choice.consequences.forEach(consequence => {
        dispatch({ type: 'ADD_CONSEQUENCE', payload: { key: currentSceneId, value: consequence } });
      });
    }

    // Unlock memories
    if (choice.unlocks) {
      choice.unlocks.forEach(memoryId => {
        dispatch({ type: 'UNLOCK_MEMORY', payload: memoryId });
      });
    }

    // Find next scene based on choice
    const nextSceneId = findNextScene(choice);
    if (nextSceneId) {
      onSceneChange(nextSceneId);
    } else {
      onSceneComplete();
    }
  };

  const findNextScene = (choice: DialogueChoice): string | null => {
    // Simple mapping logic - can be expanded
    switch (choice.id) {
      case 'who_are_you':
        return 'figure_response_identity';
      case 'return_from_where':
        return 'figure_response_memory';
      case 'use_glyph':
        return 'figure_response_glyph';
      default:
        return null;
    }
  };

  const handleNameSubmit = () => {
    if (nameInput.trim()) {
      dispatch({ type: 'SET_PLAYER_NAME', payload: nameInput.trim() });
      setShowNameInput(false);
      setNameInput('');
      onSceneComplete();
    }
  };

  const renderText = (text: string | string[]) => {
    const textContent = Array.isArray(text) ? text.join('\n\n') : text;
    return (
      <Text style={styles.dialogueText}>
        {textContent}
      </Text>
    );
  };

  if (!currentScene) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, commonStyles.center]}>
          <Text style={styles.errorText}>Scene not found: {currentSceneId}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (showNameInput) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, commonStyles.center, styles.nameInputContainer]}>
          <Text style={styles.namePrompt}>Enter your name:</Text>
          <TextInput
            style={styles.nameInput}
            value={nameInput}
            onChangeText={setNameInput}
            placeholder="Your name..."
            placeholderTextColor={colors.textSecondary}
            autoFocus
          />
          <TouchableOpacity
            style={[commonStyles.button, commonStyles.buttonPrimary]}
            onPress={handleNameSubmit}
            disabled={!nameInput.trim()}
          >
            <Text style={[commonStyles.buttonText, commonStyles.buttonTextPrimary]}>
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Speaker */}
        <View style={styles.speakerContainer}>
          <Text style={styles.speakerName}>{currentScene.speaker}</Text>
        </View>

        {/* Dialogue Text */}
        <View style={[commonStyles.card, styles.dialogueContainer]}>
          {renderText(currentScene.text)}
        </View>

        {/* Choices */}
        {currentScene.choices && currentScene.choices.length > 0 && (
          <View style={styles.choicesContainer}>
            {currentScene.choices.map((choice) => (
              <TouchableOpacity
                key={choice.id}
                style={[
                  commonStyles.button,
                  styles.choiceButton,
                  choice.requiresLanguages && !choice.requiresLanguages.every(lang => 
                    state.knownLanguages.includes(lang)
                  ) && styles.disabledChoice
                ]}
                onPress={() => handleChoice(choice)}
                disabled={
                  choice.requiresLanguages && !choice.requiresLanguages.every(lang => 
                    state.knownLanguages.includes(lang)
                  )
                }
                activeOpacity={0.8}
              >
                <Text style={[commonStyles.buttonText, styles.choiceText]}>
                  {choice.text}
                </Text>
                {choice.glyphUsed && (
                  <Text style={styles.glyphText}>✦ {choice.glyphUsed}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Auto-advance indicator */}
        {currentScene.autoAdvance && (
          <View style={styles.autoAdvanceContainer}>
            <Text style={styles.autoAdvanceText}>Continuing...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  speakerContainer: {
    marginBottom: spacing.md,
  },
  speakerName: {
    ...typography.subtitle,
    color: colors.primary,
    fontWeight: 'bold',
  },
  dialogueContainer: {
    marginBottom: spacing.lg,
  },
  dialogueText: {
    ...typography.body,
    lineHeight: 24,
    textAlign: 'left',
  },
  choicesContainer: {
    marginTop: spacing.lg,
  },
  choiceButton: {
    marginBottom: spacing.md,
    backgroundColor: 'rgba(15, 15, 35, 0.5)',
  },
  choiceText: {
    textAlign: 'left',
    lineHeight: 20,
  },
  glyphText: {
    ...typography.small,
    color: colors.primary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  disabledChoice: {
    opacity: 0.5,
    borderColor: colors.textSecondary,
  },
  autoAdvanceContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  autoAdvanceText: {
    ...typography.small,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  nameInputContainer: {
    padding: spacing.xl,
  },
  namePrompt: {
    ...typography.subtitle,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  nameInput: {
    ...typography.body,
    borderWidth: 2,
    borderColor: colors.borderLight,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
    minWidth: 200,
    textAlign: 'center',
    backgroundColor: colors.backgroundLight,
  },
  errorText: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
  },
});