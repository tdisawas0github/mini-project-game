# 🧭 Echoes of Ellidra

A multilingual visual novel where language is memory, and memory shapes reality.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Desktop-brightgreen)
![Status](https://img.shields.io/badge/status-In%20Development-yellow)

## 🎮 About the Game

**Echoes of Ellidra** is an innovative visual novel set in the frost-wrapped land of **Valdaren**, where the ancient constructed language *Ellidric* possesses the power to manipulate memory and reality itself. Players awaken without memory but with an mysterious connection to glyphs that respond as if recognizing their creator.

### 🌟 Core Concept

- **Language as Power**: Master *Ellidric*, a constructed tongue where each glyph has four layers: Sound, Emotion, Mnemonic Tether, and Ethical Resonance
- **Memory Manipulation**: Use glyphs to unlock buried memories, alter perceptions, and change loyalties
- **Multilingual Experience**: English, Dutch, Classical Latin, and Modern Greek each reveal different aspects of *Ellidric*
- **Branching Narrative**: Every conversation is a puzzle where word choice and glyph usage steer the story

### 📖 Story

You awaken in the snow-choked forests of Valdaren without memory, but the ancient *Ellidric* glyphs hum with power when you approach them. Navigate between three factions:

- **🏛️ Institute of Lingua Arcanum** - Seeks to codify and control *Ellidric* like a science
- **🌲 Clans of the Whispering Woods** - Protect the oral tradition and view *Ellidric* as alive
- **👁️ The Echoborn** - Entities claiming to be reborn from glyphs themselves

Your choices will determine not only your lost identity but the fate of language itself in Valdaren.

## 🚀 Available Versions

This project offers two distinct gaming experiences:

### 🖥️ Desktop Version (Ren'Py)
- **Location**: `Valdaren/`
- **Platform**: Windows, Mac, Linux
- **Engine**: Ren'Py Visual Novel Engine
- **Features**: Traditional visual novel experience with save/load system

### 🌐 Web Version (React)
- **Location**: `web-version/`
- **Platform**: Modern web browsers
- **Technology**: React + TypeScript + Vite
- **Features**: Interactive web experience with responsive design

## 📋 Installation & Setup

### Desktop Version (Ren'Py)

1. **Install Ren'Py SDK** from [renpy.org](https://www.renpy.org/latest.html)
2. **Clone the repository**:
   ```bash
   git clone https://github.com/tdisawas0github/mini-project-game.git
   cd mini-project-game
   ```
3. **Open in Ren'Py Launcher**:
   - Launch Ren'Py SDK
   - Click "Preferences" and add the project directory
   - Select "Valdaren" project and click "Launch Project"

### Web Version

#### Prerequisites
- Node.js 18+ and npm

#### Installation
```bash
cd web-version
npm install
```

#### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Run linter
```

The development server will start at `http://localhost:5173`

## 🏗️ Project Structure

```
mini-project-game/
├── 📁 Valdaren/              # Ren'Py desktop version
│   └── 📁 game/              # Game scripts and assets
│       ├── script.rpy        # Main game script
│       ├── options.rpy       # Game configuration
│       └── screens.rpy       # UI definitions
├── 📁 web-version/           # React web version
│   ├── 📁 src/
│   │   ├── 📁 components/    # React components
│   │   ├── 📁 hooks/         # Custom React hooks
│   │   ├── 📁 context/       # React contexts
│   │   ├── 📁 utils/         # Utility functions
│   │   └── 📁 styles/        # Styled-components
│   ├── package.json          # Dependencies and scripts
│   └── vite.config.ts        # Vite configuration
├── 📁 about/                 # Game documentation
│   ├── game-lore.md          # World-building and lore
│   ├── gameplay.md           # Gameplay mechanics
│   └── *.png                 # Concept art and maps
└── README.md                 # This file
```

## 🎯 Key Features

### Game Mechanics
- **Dialogue Glyph Casting**: Insert *Ellidric* glyphs into conversations to unlock hidden truths
- **Memory Weaving**: Manipulate dreamscapes by rearranging glyphs and memories
- **Linguistic Layer Unlocks**: Learning real-world languages reveals new story content
- **Consequence Tracking**: Decisions ripple through an interconnected web of altered memories

### Technical Features
- **Responsive Design**: Web version adapts to different screen sizes
- **Audio System**: Background music and sound effects with configuration options
- **Theme System**: Multiple visual themes including dark mode
- **Save System**: Persistent game state across sessions
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Development

### Web Version Tech Stack
- **Frontend**: React 19 + TypeScript
- **Styling**: Styled-components + Framer Motion
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library
- **Linting**: ESLint with TypeScript support

### Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style
- Follow existing code patterns
- Use TypeScript for type safety
- Write tests for new features
- Ensure linting passes: `npm run lint`

## 📚 Game Documentation

Detailed game information is available in the `about/` directory:

- **[Game Lore](about/game-lore.md)**: Complete world-building, factions, and history
- **[Gameplay](about/gameplay.md)**: Mechanics, player actions, and visual novel structure

## 🎭 Themes

The game explores deep philosophical themes:
- **Ethics of Reality Manipulation**: The moral implications of rewriting memories
- **Identity and Language**: How language shapes who we are
- **Power and Responsibility**: The consequences of linguistic power
- **Tradition vs Progress**: Oral culture versus systematic cataloging

## 🤝 Community

- **Issues**: Report bugs or suggest features via GitHub Issues
- **Discussions**: Join conversations about game lore and development
- **Wiki**: Community-maintained lore and strategy guides (coming soon)

## 📄 License

This project is open source. Please check with the repository maintainer for license details.

## 🙏 Acknowledgments

- Ren'Py community for the excellent visual novel engine
- React and Vite teams for modern web development tools
- Contributors who help shape the world of Valdaren

---

*"In Valdaren, words are not mere sounds—they are the threads from which reality is woven."*

---

### 🚀 Quick Start

**🌐 Web Version (Ready for Deployment)**  
The game is now deployment-ready for:
- **Vercel**: One-click deployment with `vercel.json` 
- **Netlify**: SPA-ready with `netlify.toml` configuration
- **Other Static Hosts**: Optimized build output in `web-version/dist/`

**📖 Deployment Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions

**💻 Download desktop version**: [Releases] *(coming soon)*

**First time playing?** Start with the web version for the best introduction to the world of *Ellidric*.