import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../hooks/useGame';
import { commonStyles, colors, typography, spacing } from '../styles';

interface WorldMapProps {
  onReturn: () => void;
}

export default function WorldMap({ onReturn }: WorldMapProps) {
  const { state } = useGame();

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Map of Valdaren</Text>
          <TouchableOpacity
            style={[commonStyles.button, styles.backButton]}
            onPress={onReturn}
          >
            <Text style={commonStyles.buttonText}>← Back to Hub</Text>
          </TouchableOpacity>
        </View>

        {/* Map Content */}
        <View style={[commonStyles.card, styles.mapContainer]}>
          <Text style={styles.mapPlaceholder}>
            🗺️ Interactive Map Coming Soon
          </Text>
          <Text style={styles.description}>
            The ancient map of Valdaren will allow you to explore different regions, 
            view faction influences, and discover hidden locations based on your choices.
          </Text>
        </View>

        {/* Faction Influence */}
        <View style={[commonStyles.card, styles.factionContainer]}>
          <Text style={styles.sectionTitle}>Faction Influence</Text>
          {Object.entries(state.factionInfluence).map(([faction, influence]) => (
            <View key={faction} style={styles.factionRow}>
              <Text style={styles.factionName}>
                {faction.replace('_', ' ').toUpperCase()}
              </Text>
              <Text style={styles.factionInfluence}>{influence}</Text>
            </View>
          ))}
        </View>
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
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  mapPlaceholder: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  description: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  factionContainer: {
    maxHeight: 200,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  factionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  factionName: {
    ...typography.body,
    fontWeight: '600',
  },
  factionInfluence: {
    ...typography.body,
    color: colors.primary,
  },
});