import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../hooks/useGame';
import { commonStyles, colors, typography, spacing } from '../styles';

interface LexiconSidebarProps {
  onReturn: () => void;
}

export default function LexiconSidebar({ onReturn }: LexiconSidebarProps) {
  const { state } = useGame();

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Lexicon of Glyphs</Text>
          <TouchableOpacity
            style={[commonStyles.button, styles.backButton]}
            onPress={onReturn}
          >
            <Text style={commonStyles.buttonText}>← Back to Hub</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContainer}>
          {/* Known Languages */}
          <View style={[commonStyles.card, styles.section]}>
            <Text style={styles.sectionTitle}>Known Languages</Text>
            {state.knownLanguages.map(language => (
              <View key={language} style={styles.languageRow}>
                <Text style={styles.languageName}>
                  ✦ {language.charAt(0).toUpperCase() + language.slice(1)}
                </Text>
              </View>
            ))}
          </View>

          {/* Sample Glyphs */}
          <View style={[commonStyles.card, styles.section]}>
            <Text style={styles.sectionTitle}>Ancient Glyphs</Text>
            <Text style={styles.description}>
              As you progress, you'll discover the meaning of these mysterious symbols.
            </Text>
            
            <View style={styles.glyphGrid}>
              {['⚡', '🌊', '🔥', '🌿', '❄️', '⭐'].map((glyph, index) => (
                <View key={index} style={styles.glyphItem}>
                  <Text style={styles.glyphSymbol}>{glyph}</Text>
                  <Text style={styles.glyphLabel}>Unknown</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Discovered Patterns */}
          <View style={[commonStyles.card, styles.section]}>
            <Text style={styles.sectionTitle}>Discovered Patterns</Text>
            <Text style={styles.description}>
              Your understanding of the Ellidric language grows with each choice.
            </Text>
            
            {Object.keys(state.consequenceMap).length > 0 ? (
              Object.entries(state.consequenceMap).map(([key, consequences]) => (
                <View key={key} style={styles.patternRow}>
                  <Text style={styles.patternKey}>{key}:</Text>
                  <Text style={styles.patternValue}>{consequences.join(', ')}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noPatterns}>
                Make choices to discover patterns in the ancient language.
              </Text>
            )}
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
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  languageRow: {
    paddingVertical: spacing.sm,
  },
  languageName: {
    ...typography.body,
    fontWeight: '600',
  },
  glyphGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  glyphItem: {
    alignItems: 'center',
    margin: spacing.sm,
    minWidth: 60,
  },
  glyphSymbol: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  glyphLabel: {
    ...typography.small,
    color: colors.textSecondary,
  },
  patternRow: {
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  patternKey: {
    ...typography.body,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  patternValue: {
    ...typography.small,
    color: colors.textSecondary,
  },
  noPatterns: {
    ...typography.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});