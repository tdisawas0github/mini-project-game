import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../hooks/useGame';
import { commonStyles, colors, typography, spacing } from '../styles';

interface MemoryDiveProps {
  onReturn: () => void;
}

export default function MemoryDive({ onReturn }: MemoryDiveProps) {
  const { state } = useGame();

  const unlockMemory = (_memoryId: string) => {
    // This would normally have more complex logic
    // For demo purposes, we'll just show an alert
    console.warn('Memory dive functionality coming soon!');
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Memory Dive Chamber</Text>
          <TouchableOpacity
            style={[commonStyles.button, styles.backButton]}
            onPress={onReturn}
          >
            <Text style={commonStyles.buttonText}>← Back to Hub</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContainer}>
          <View style={[commonStyles.card, styles.introSection]}>
            <Text style={styles.introText}>
              🧠 Enter the depths of fragmented memory. Each dive may unlock pieces 
              of your forgotten past, but be warned - some memories are locked away for a reason.
            </Text>
          </View>

          {/* Available Memories */}
          <View style={[commonStyles.card, styles.memoriesSection]}>
            <Text style={styles.sectionTitle}>Memory Fragments</Text>
            
            {Object.values(state.memories).map(memory => (
              <TouchableOpacity
                key={memory.id}
                style={[
                  styles.memoryItem,
                  memory.locked ? styles.lockedMemory : styles.unlockedMemory
                ]}
                onPress={() => memory.locked ? unlockMemory(memory.id) : null}
                disabled={!memory.locked}
              >
                <View style={styles.memoryHeader}>
                  <Text style={[
                    styles.memoryTitle,
                    memory.locked ? styles.lockedTitle : styles.unlockedTitle
                  ]}>
                    {memory.locked ? '???' : memory.title}
                  </Text>
                  <Text style={styles.memoryStatus}>
                    {memory.locked ? '🔒 Locked' : '✦ Unlocked'}
                  </Text>
                </View>
                
                <Text style={[
                  styles.memoryContent,
                  memory.locked ? styles.lockedContent : styles.unlockedContent
                ]}>
                  {memory.locked ? 'A memory shrouded in mystery...' : memory.content}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Memory Stats */}
          <View style={[commonStyles.card, styles.statsSection]}>
            <Text style={styles.sectionTitle}>Progress</Text>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Memories Unlocked:</Text>
              <Text style={styles.statValue}>
                {Object.values(state.memories).filter(m => !m.locked).length} / {Object.values(state.memories).length}
              </Text>
            </View>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Scenes Completed:</Text>
              <Text style={styles.statValue}>
                {state.completedScenes.length}
              </Text>
            </View>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Languages Known:</Text>
              <Text style={styles.statValue}>
                {state.knownLanguages.length}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.primary,
  },
  backButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  scrollContainer: {
    flex: 1,
  },
  introSection: {
    marginBottom: spacing.lg,
  },
  introText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  memoriesSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  memoryItem: {
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  lockedMemory: {
    borderColor: colors.textSecondary,
    backgroundColor: 'rgba(160, 174, 192, 0.1)',
  },
  unlockedMemory: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  memoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  memoryTitle: {
    ...typography.subtitle,
    flex: 1,
  },
  lockedTitle: {
    color: colors.textSecondary,
  },
  unlockedTitle: {
    color: colors.primary,
  },
  memoryStatus: {
    ...typography.small,
    color: colors.textSecondary,
  },
  memoryContent: {
    ...typography.body,
    lineHeight: 20,
  },
  lockedContent: {
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  unlockedContent: {
    color: colors.text,
  },
  statsSection: {
    marginBottom: spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  statLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  statValue: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});