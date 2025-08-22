# Valdaren: Chronicles of the First Speaker - Mobile Edition

This is the React Native Android port of the Valdaren visual novel game.

## Features

- ✅ Complete visual novel gameplay with dialogue system
- ✅ Character naming and language selection
- ✅ Game state persistence with AsyncStorage
- ✅ Memory dive chamber functionality
- ✅ World map with faction influence display
- ✅ Lexicon of glyphs and language learning
- ✅ Mobile-optimized UI with React Native components
- ✅ Navigation between different game screens

## Installation

### Prerequisites

- Node.js 18+
- React Native development environment
- Android Studio (for Android development)
- Android device or emulator

### Setup

1. Navigate to the mobile Android project:
```bash
cd mobile/android/ValdavenGame
```

2. Install dependencies:
```bash
npm install
```

3. For Android development, make sure you have:
   - Android SDK installed
   - Android emulator running or device connected

### Running the App

#### Android
```bash
npm run android
```

This will build and install the app on your connected Android device or emulator.

#### Development
```bash
npm start
```

This starts the Metro bundler for hot reloading during development.

## Project Structure

```
src/
├── components/          # React Native components
│   ├── Game.tsx        # Main game component
│   ├── VNMainMenu.tsx  # Main menu screen
│   ├── VNDialogueSystem.tsx  # Dialogue system
│   ├── WorldMap.tsx    # Map screen
│   ├── LexiconSidebar.tsx    # Lexicon screen
│   └── MemoryDive.tsx  # Memory dive screen
├── context/            # React context for state management
│   └── GameContext.tsx # Game state management
├── hooks/              # Custom React hooks
│   └── useGame.ts      # Hook for game state
├── styles/             # Styling and theming
│   └── index.ts        # Common styles and theme
├── types/              # TypeScript type definitions
│   └── game.ts         # Game state types
├── utils/              # Utility functions
│   └── gameUtils.ts    # Game utilities with AsyncStorage
└── data/               # Game data
    └── dialogue.ts     # Dialogue and story content
```

## Key Differences from Web Version

- **Storage**: Uses AsyncStorage instead of localStorage
- **Navigation**: State-based navigation instead of React Router
- **Styling**: React Native StyleSheet instead of styled-components
- **Components**: Native mobile components (View, Text, TouchableOpacity) instead of HTML elements
- **Animations**: Simplified animations suitable for mobile performance

## Development Scripts

- `npm run android` - Run on Android
- `npm run ios` - Run on iOS (macOS only)
- `npm start` - Start Metro bundler
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Gameplay

The mobile version maintains all the core gameplay features from the web version:

1. **Main Menu**: Start new game or continue existing save
2. **Prologue**: Introduction to the story and character naming
3. **Language Selection**: Choose your interpretation language
4. **Hub**: Central location with access to all game features
5. **World Map**: View faction influences across Valdaren
6. **Lexicon**: Study discovered glyphs and languages
7. **Memory Dive**: Unlock and explore memory fragments

## Save System

Game progress is automatically saved using AsyncStorage and persists across app sessions.

## Future Enhancements

- Push notifications for story updates
- Offline mode support
- Additional mobile-specific features
- Performance optimizations for lower-end devices
- Accessibility improvements