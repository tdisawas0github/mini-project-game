# Web Version 4 - Valdaren Integration

This version represents a major enhancement that integrates the comprehensive world data from the `world_data` directory and map data from the `Valdaren` game files.

## New Features

### 🌍 Enhanced World Building
- **World Data Integration**: Now uses structured data from `world_data/` markdown files including:
  - Comprehensive lore from `lore.md`
  - Character details from `characters.md`
  - Faction information from `factions.md`
  - Game mechanics from `mechanics.md`

### 🗺️ Advanced Map System
- **Valdaren Map Data**: Integrates faction map data from `Valdaren/game/data/faction_map.json`
- **Extended Regions**: Now includes 6 regions instead of 3:
  - Ravengard (Institute stronghold)
  - Whispering Woods (Clans heartland)
  - Ancient Ruins (Echoborn territory) 
  - Snowveil Forest (Clans borderland)
  - Lumisth Glacier (Echoborn fringe)
  - Lake Eirysa (Neutral diplomatic zone)

### ⚖️ Expanded Faction System
- **Four Factions**: Added support for neutral territories
  - Institute of Lingua Arcanum (Blue)
  - Clans of the Whispering Woods (Green)
  - The Echoborn (Purple)
  - Neutral Territories (Gray)

### 🔧 Technical Improvements
- **Data Parser**: New `worldDataParser.ts` utility for structured world data
- **Enhanced Types**: Updated TypeScript types to support neutral faction
- **Asset Integration**: Proper map assets from `about/map-of-valdaren.png`

## Architecture

```
src/
├── utils/
│   └── worldDataParser.ts    # Structured world data from markdown files
├── data/
│   └── gameData.ts          # Game data now imports from world parser
├── components/
│   └── WorldMap.tsx         # Enhanced map with all regions and factions
└── types/
    └── game.ts              # Updated types with neutral faction support
```

## Data Sources

This version consolidates data from multiple sources:
1. `world_data/` - Markdown files with comprehensive lore
2. `Valdaren/game/data/` - JSON files with faction and map data
3. `about/` - Map image assets

## Running the Application

```bash
npm install
npm run dev
```

## Building for Production

```bash
npm run build
```

The application will be built to the `dist/` directory.

## Screenshots

![Map of Valdaren](https://github.com/user-attachments/assets/b013f1bd-28f0-49fd-a814-75519752fe8c)

The enhanced map shows all regions of Valdaren with their faction affiliations, influence levels, and philosophical approaches to the Ellidric language.
