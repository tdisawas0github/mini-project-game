import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, colors, typography, spacing } from '../styles';

interface VNMainMenuProps {
  onStartGame: () => void;
  onLoadGame: () => void;
  onSettings: () => void;
}

export default function VNMainMenu({ onStartGame, onLoadGame, onSettings }: VNMainMenuProps) {
  const backgroundImage = { uri: 'https://via.placeholder.com/800x600/0f0f23/d4af37?text=Valdaren' }; // Placeholder background

  return (
    <View style={commonStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.overlay}>
            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>VALDAREN</Text>
              <Text style={styles.subtitle}>Chronicles of the First Speaker</Text>
            </View>

            {/* Menu Buttons */}
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={[commonStyles.button, commonStyles.buttonPrimary, styles.menuButton]}
                onPress={onStartGame}
                activeOpacity={0.8}
              >
                <Text style={[commonStyles.buttonText, commonStyles.buttonTextPrimary]}>
                  Begin Journey
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[commonStyles.button, styles.menuButton]}
                onPress={onLoadGame}
                activeOpacity={0.8}
              >
                <Text style={commonStyles.buttonText}>Continue Journey</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[commonStyles.button, styles.menuButton]}
                onPress={onSettings}
                activeOpacity={0.8}
              >
                <Text style={commonStyles.buttonText}>Settings</Text>
              </TouchableOpacity>

              {/* Version info */}
              <Text style={styles.versionText}>v0.1.0 - Mobile Edition</Text>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 15, 35, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl * 2,
  },
  title: {
    ...typography.title,
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    letterSpacing: 3,
    textShadowColor: colors.shadow,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  menuContainer: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  menuButton: {
    width: '100%',
    marginVertical: spacing.sm,
  },
  versionText: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
});