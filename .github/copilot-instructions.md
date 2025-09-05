# Valdaren: Echoes of Ellidra - Copilot Instructions

Always follow these instructions first and fallback to additional search and context gathering only if the information in these instructions is incomplete or found to be in error.

## Project Overview

Valdaren: Echoes of Ellidra is a multi-platform visual novel game featuring mystical language mechanics. The project includes multiple web versions, mobile versions, and comprehensive deployment options.

## Working Effectively

### Bootstrap, Build and Test the Repository

**Primary Development Version (web-version-4)**:
```bash
cd web-version-4
npm install                     # ~10 seconds
npm run build                   # ~14 seconds, NEVER CANCEL - Set timeout to 30+ minutes
npm run lint                    # ~2 seconds - Will show 32 linting errors, build still works
npm run preview                 # Start production preview server
```

**Alternative Working Versions**:
```bash
# web-version-3 - Clean build, no linting errors
cd web-version-3
npm install                     # ~2 seconds  
npm run lint                    # ~1.5 seconds - Clean, no errors
npm run build                   # ~9 seconds, NEVER CANCEL - Set timeout to 30+ minutes

# web-version-2 - Has tests and builds successfully
cd web-version-2
npm install                     # ~3 seconds
npm run test                    # ~1.5 seconds - 9 tests pass
npm run lint                    # ~2 seconds - 4 linting errors, build still works
npm run build                   # ~11 seconds, NEVER CANCEL - Set timeout to 30+ minutes
```

**BROKEN VERSION - DO NOT USE**:
- `web-version` - Build fails due to missing components, DO NOT attempt to build this version

### Development Server Operations

**Development Mode**:
```bash
cd web-version-4               # or web-version-3, web-version-2
npm run dev                    # Development server at http://localhost:5174/
```

**Production Preview**:
```bash
cd web-version-4
npm run build                  # Build first
npm run preview                # Preview server at http://localhost:4174/
```

### Build Time Expectations
- **NEVER CANCEL ANY BUILD** - Builds may take up to 30 minutes in resource-constrained environments
- **npm install**: 2-10 seconds typical
- **npm run build**: 9-14 seconds typical, up to 30 minutes possible
- **npm run test**: 1.5 seconds (where available)
- **npm run lint**: 1-2 seconds

## Docker Deployment

**Validated Working Commands**:
```bash
# Build production container (builds in ~3 seconds)
docker compose build web       # NEVER CANCEL - Set timeout to 60+ minutes

# Run production container
docker compose up web          # Serves at http://localhost:3000/

# Development container with hot reload
docker compose --profile dev up web-dev  # Serves at http://localhost:5173/

# Stop containers
docker compose down
```

**Container Health Check**: 
- Production container responds successfully at `http://localhost:3000/`
- Uses nginx with optimized configuration
- Includes security headers and gzip compression

## Testing and Validation

### Manual Validation Requirements
After making changes, ALWAYS run through these validation steps:

**RECOMMENDED - Development Server Test** (most reliable):
1. Start development server: `npm run dev`
2. Verify the application loads at `http://localhost:5174/`
3. Confirm game interface displays with world map background
4. Click "Begin Your Journey" to test story progression
5. Verify dialogue system loads and displays narrator text

**Alternative - Production Build Test**:
1. Build the application: `npm run build`
2. Start preview server: `npm run preview`
3. Verify the application loads at `http://localhost:4174/`
4. NOTE: Some web versions may show white screen in production build - use development server instead

**Docker Validation**:
1. Build container: `docker compose build web`
2. Run container: `docker compose up web`
3. Test endpoint: `curl -I http://localhost:3000/`
4. Verify 200 OK response with proper headers
5. Stop container: `docker compose down`

### Automated Testing
```bash
# Only web-version and web-version-2 have tests
cd web-version-2
npm run test                   # 9 tests, ~1.5 seconds
```

## Linting and Code Quality

**Expected Linting Results**:
- `web-version-4`: 32 problems (27 errors, 5 warnings) - BUILD STILL WORKS
- `web-version-3`: Clean, no errors
- `web-version-2`: 4 problems (4 errors) - BUILD STILL WORKS
- `web-version`: 3 problems (3 errors) - BUILD FAILS

**Before committing changes**:
```bash
npm run lint                   # Check for new linting issues
npm run build                  # Ensure build succeeds
```

## Key Project Directories

```
/
├── web-version-4/            # Latest enhanced web version (RECOMMENDED)
├── web-version-3/            # Clean build version (NO LINTING ERRORS)
├── web-version-2/            # Version with tests (HAS TESTS)
├── web-version/              # BROKEN - Do not use
├── mobile/android/ValdavenGame/  # React Native mobile version
├── world_data/               # Game world markdown files (lore, factions, etc.)
├── docs/                     # Deployment tutorials (Netlify, Vercel, Appwrite)
├── .github/workflows/        # CI/CD configurations
├── docker-compose.yml        # Docker deployment configuration
├── netlify.toml             # Netlify deployment settings (uses web-version-4)
└── vercel.json              # Vercel deployment settings (uses web-version-4)
```

## Deployment Options

### Cloud Deployment (Validated)
- **Netlify**: Uses `web-version-4`, Node.js 18, build command: `npm ci && npm run build`
- **Vercel**: Uses `web-version-4`, automated via `vercel.json`
- **Docker**: Supports production, development, and build profiles

### Mobile Development
```bash
cd mobile/android/ValdavenGame
npm install
npm run android               # Android deployment
npm run ios                   # iOS deployment (macOS required)
```

## Common Issues and Solutions

**Build Failures**:
- Verify Node.js 18+ is installed: `node --version`
- Clear cache: `npm cache clean --force`
- Fresh install: `rm -rf node_modules package-lock.json && npm install`

**Common Issues and Solutions**:
- Some web versions may show white screen in production builds - use development server (`npm run dev`) for testing
- Linting errors don't prevent builds from working in most cases
- Focus on TypeScript compilation errors that actually break builds
- External font loading may fail in sandboxed environments - this doesn't affect core functionality

**Docker Issues**:
- Use `docker compose` not `docker-compose`
- Ensure port 3000 is available for production container
- Check container logs: `docker compose logs web`

## CI/CD Integration

**GitHub Actions Workflow**:
- Tests and builds `web-version` (NOTE: This version is broken, CI may fail)
- Uses Node.js 18
- Runs tests, builds, and deploys to Vercel
- Multi-platform builds include web, desktop (Ren'Py), and mobile versions

## Critical Timeouts
- **Build commands**: Set timeout to 60+ minutes minimum
- **Install commands**: Set timeout to 30+ minutes minimum  
- **Test commands**: Set timeout to 15+ minutes minimum
- **NEVER CANCEL** long-running operations - builds may legitimately take 30+ minutes

## World Data and Content

The game uses structured markdown files in `world_data/`:
- `lore.md` - World history and Ellidric language lore
- `characters.md` - Character profiles and relationships  
- `factions.md` - Detailed faction information
- `mechanics.md` - Game systems and mechanics

These files are parsed by `src/utils/worldDataParser.ts` in the web versions.

## Quick Reference Commands

```bash
# Most reliable development workflow - RECOMMENDED
cd web-version-2
npm install && npm run test && npm run dev
# Test at http://localhost:5174/ - Click "Begin Your Journey" to validate story system

# Clean build workflow (no linting errors)
cd web-version-3
npm install && npm run lint && npm run build && npm run dev

# Latest features (with known linting issues)
cd web-version-4  
npm install && npm run build && npm run dev

# Docker production deployment
docker compose build web && docker compose up web

# Clean up after testing
docker compose down
```

Remember: Always validate changes by building and running the application before considering the work complete.