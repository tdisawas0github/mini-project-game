import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const colors = {
  primary: '#d4af37',
  primaryDark: '#b8941f',
  secondary: '#2d3748',
  background: '#0f0f23',
  backgroundLight: '#1a1a2e',
  text: '#e2e8f0',
  textSecondary: '#a0aec0',
  border: '#d4af37',
  borderLight: 'rgba(212, 175, 55, 0.3)',
  shadow: 'rgba(0, 0, 0, 0.5)',
};

export const typography = {
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: colors.text,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    color: colors.text,
  },
  small: {
    fontSize: 14,
    color: colors.textSecondary,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreen: {
    width,
    height,
  },
  button: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.borderLight,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  buttonText: {
    ...typography.body,
    textAlign: 'center',
  },
  buttonPrimary: {
    borderColor: colors.primary,
  },
  buttonTextPrimary: {
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 8,
    padding: spacing.md,
    marginVertical: spacing.sm,
  },
  shadow: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});