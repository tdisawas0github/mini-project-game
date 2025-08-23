# 🚀 Deployment Guide

This comprehensive guide explains how to deploy **Echoes of Ellidra** to various hosting platforms with detailed step-by-step tutorials.

## 📋 Prerequisites

- **Node.js 18+** installed locally (for local development and testing)
- **Git repository access** to this project
- **Account** on your chosen hosting platform (Vercel, Netlify, or Appwrite)
- **For Docker deployment**: Docker and Docker Compose installed

## 🎯 Quick Start

Choose your preferred deployment platform:

| Platform | Best For | Deploy Time | Cost |
|----------|----------|-------------|------|
| [**🔥 Vercel**](#vercel-deployment-tutorial) | Fastest deployment, excellent DX | ~2 minutes | Free tier available |
| [**🌊 Netlify**](#netlify-deployment-tutorial) | Great CI/CD, forms & functions | ~3 minutes | Free tier available |
| [**☁️ Appwrite**](#appwrite-deployment-tutorial) | Full-stack with backend services | ~5 minutes | Free tier available |
| [**🐳 Docker**](#docker-deployment) | Self-hosting, full control | ~10 minutes | Your hosting costs |

### 📚 Detailed Tutorials Available

For comprehensive step-by-step guides with advanced configurations, troubleshooting, and best practices:

- **[📋 Complete Documentation Hub](docs/README.md)** - Compare all platforms and choose the best fit
- **[🔥 Vercel Complete Tutorial](docs/VERCEL_TUTORIAL.md)** - Advanced Vercel deployment with serverless functions
- **[🌊 Netlify Complete Tutorial](docs/NETLIFY_TUTORIAL.md)** - Full Netlify features including forms and functions  
- **[☁️ Appwrite Complete Tutorial](docs/APPWRITE_TUTORIAL.md)** - Full-stack deployment with database and auth

---

## 🔥 Vercel Deployment Tutorial

**Vercel** offers the fastest and most developer-friendly deployment experience for React applications.

### Step 1: Prepare Your Repository

1. **Fork or clone** this repository to your GitHub account
2. **Ensure the build works locally**:
   ```bash
   cd web-version
   npm install
   npm run build
   # Should complete without errors
   ```

### Step 2: Connect to Vercel

1. **Visit** [vercel.com](https://vercel.com) and sign up/login with your GitHub account
2. **Click "New Project"** on the Vercel dashboard
3. **Import your repository**:
   - Find your forked `mini-project-game` repository
   - Click "Import"

### Step 3: Configure Build Settings

Vercel will automatically detect the configuration from our `vercel.json` file, but verify these settings:

```json
Build Command: cd web-version && npm ci && npm run build
Output Directory: web-version/dist
Install Command: cd web-version && npm ci
```

**Advanced Configuration (Optional)**:
- **Environment Variables**: None required for basic deployment
- **Node.js Version**: 18.x (auto-detected)
- **Build & Output Settings**: Pre-configured in `vercel.json`

### Step 4: Deploy

1. **Click "Deploy"** - Vercel will start building
2. **Wait 2-3 minutes** for the build to complete
3. **Access your live site** at `https://your-project-name.vercel.app`

### Step 5: Custom Domain (Optional)

1. **Go to your project** on Vercel dashboard
2. **Click "Domains"** tab
3. **Add your custom domain** and follow DNS instructions

### Vercel Troubleshooting

**Build fails with "Command failed"**:
- Check build logs in Vercel dashboard
- Ensure Node.js version is 18+
- Verify all dependencies are in `package.json`

**404 errors on page refresh**:
- Our `vercel.json` handles SPA routing automatically
- Check if custom redirects are conflicting

**Slow build times**:
- Vercel caches dependencies automatically
- Consider upgrading to Pro for faster builds

---

## 🌊 Netlify Deployment Tutorial

**Netlify** provides excellent CI/CD capabilities and is perfect for static sites with additional features.

### Step 1: Prepare Your Repository

1. **Fork or clone** this repository to your GitHub account
2. **Test the build locally**:
   ```bash
   cd web-version
   npm install
   npm run build
   npm run preview  # Test the production build
   ```

### Step 2: Connect to Netlify

1. **Visit** [netlify.com](https://netlify.com) and sign up/login
2. **Click "New site from Git"** on the Netlify dashboard
3. **Choose GitHub** and authorize Netlify to access your repositories
4. **Select your repository**: `mini-project-game`

### Step 3: Configure Build Settings

Our `netlify.toml` file pre-configures everything, but verify these settings:

```toml
Base directory: web-version
Build command: npm ci && npm run build
Publish directory: web-version/dist
Node version: 18
```

**Advanced Configuration**:
- **Environment Variables**: Set in Site Settings > Environment Variables
- **Build Plugins**: Pre-configured for optimization
- **Headers & Redirects**: Configured in `netlify.toml`

### Step 4: Deploy

1. **Click "Deploy site"**
2. **Monitor the deploy** in the Deploys tab
3. **Wait 3-4 minutes** for completion
4. **Visit your site** at the generated `https://random-name.netlify.app` URL

### Step 5: Customize Your Site

1. **Change site name**: Site Settings > Site Information > Change site name
2. **Custom domain**: Domain Settings > Add custom domain
3. **HTTPS**: Automatically enabled for all sites

### Netlify Advanced Features

**Form Handling** (if you add contact forms):
```html
<form netlify>
  <!-- Your form fields -->
</form>
```

**Split Testing**:
- Go to Site Settings > Split Testing
- Deploy different branches for A/B testing

**Build Hooks**:
- Create webhook URLs for triggering rebuilds
- Useful for CMS integration

### Netlify Troubleshooting

**Build command not found**:
- Check that `netlify.toml` is in the root directory
- Verify build command in Site Settings > Build & Deploy

**Assets not loading**:
- Check publish directory is set to `web-version/dist`
- Verify asset paths are relative

**Large deploy times**:
- Enable build cache in Site Settings
- Consider dependency caching optimizations

---

## ☁️ Appwrite Deployment Tutorial

**Appwrite** offers full-stack deployment capabilities with built-in backend services, perfect if you want to add user authentication, databases, or serverless functions to your game.

### Step 1: Set Up Appwrite Account

1. **Visit** [appwrite.io](https://appwrite.io) and create an account
2. **Choose deployment method**:
   - **Appwrite Cloud** (Recommended): Hosted solution
   - **Self-hosted**: Deploy on your own infrastructure

### Step 2: Create a New Project

1. **Click "Create Project"** on the Appwrite console
2. **Enter project details**:
   - **Name**: `Echoes of Ellidra`
   - **Project ID**: `echoes-of-ellidra` (or your preference)
   - **Region**: Choose closest to your users

### Step 3: Configure Web Platform

1. **Go to "Platforms"** in your project dashboard
2. **Click "Add Platform"** → Select "Web App"
3. **Configure the platform**:
   - **Name**: `Web Version`
   - **Hostname**: `localhost` (for development)
   - **Hostname**: Your domain (for production)

### Step 4: Deploy Static Frontend

#### Option A: Deploy to Appwrite Static Hosting

1. **Build your project**:
   ```bash
   cd web-version
   npm install
   npm run build
   ```

2. **Install Appwrite CLI**:
   ```bash
   npm install -g appwrite-cli
   ```

3. **Login and initialize**:
   ```bash
   appwrite login
   appwrite init project
   ```

4. **Deploy the static files**:
   ```bash
   # Create a function for static hosting
   appwrite init function
   # Follow prompts to create a static hosting function
   ```

#### Option B: Use Appwrite with External Hosting

Deploy the frontend to Vercel/Netlify and use Appwrite for backend services:

1. **Deploy frontend** using the Vercel or Netlify tutorials above
2. **Configure Appwrite endpoint** in your app:
   ```javascript
   // Add to your React app's environment variables
   VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your-project-id
   ```

### Step 5: Configure Backend Services (Optional)

**Add Database for Game Saves**:
1. **Go to "Databases"** in Appwrite console
2. **Create database**: `game-data`
3. **Create collection**: `player-saves`
4. **Configure attributes**:
   - `userId` (string)
   - `saveData` (string, large)
   - `timestamp` (datetime)

**Add Authentication**:
1. **Go to "Auth"** in Appwrite console
2. **Configure providers**: Email/password, Google, etc.
3. **Set up user sessions** in your React app

### Step 6: Update Your Application

If using Appwrite for backend services, update your game to integrate:

```javascript
// web-version/src/utils/appwrite.js
import { Client, Account, Databases } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('your-project-id');

export const account = new Account(client);
export const databases = new Databases(client);
```

### Step 7: Deploy and Test

1. **Deploy your updated application**
2. **Test all functionalities**:
   - Static site loading
   - Backend service connections (if configured)
   - User authentication (if enabled)
   - Data persistence (if using database)

### Appwrite Advanced Features

**Serverless Functions**:
```bash
appwrite init function
# Create functions for game logic, leaderboards, etc.
```

**Real-time Updates**:
```javascript
// Subscribe to database changes
client.subscribe('databases.game-data.collections.player-saves.documents', response => {
    console.log(response);
});
```

**File Storage**:
```javascript
// Store game assets, user uploads
import { Storage } from 'appwrite';
const storage = new Storage(client);
```

### Appwrite Troubleshooting

**CORS Errors**:
- Add your domain to the Web platform in Appwrite console
- Include both `localhost:5173` (development) and production domain

**Authentication Issues**:
- Check API keys and project ID
- Verify platform configuration includes your domain

**Database Connection Failures**:
- Ensure database and collection IDs are correct
- Check user permissions on collections

**Deployment Timeouts**:
- Large builds may timeout; consider splitting into smaller deployments
- Use CLI deployment for better control and debugging

---

## 🌍 Alternative Hosting Options

### Manual Static Hosting

For other static hosting services (GitHub Pages, Firebase Hosting, Surge, etc.):

#### Step 1: Build the Project
```bash
cd web-version
npm install
npm run build
```

#### Step 2: Deploy Static Files

**GitHub Pages**:
```bash
# Build and deploy to gh-pages branch
npm run build
cd dist
git init
git add -A
git commit -m 'Deploy to GitHub Pages'
git push -f https://github.com/yourusername/your-repo.git main:gh-pages
```

**Firebase Hosting**:
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize and deploy
firebase init hosting
# Choose dist directory: web-version/dist
firebase deploy
```

**Surge.sh**:
```bash
# Install Surge CLI
npm install -g surge

# Deploy
cd web-version/dist
surge
# Follow prompts to deploy
```

#### Step 3: Configure SPA Routing

Ensure your hosting service serves `index.html` for all routes:

- **Apache**: Add `.htaccess` file in dist folder
- **Nginx**: Configure try_files directive
- **GitHub Pages**: Add 404.html that redirects to index.html

---

## 🐳 Docker Deployment

Docker provides containerized deployment with complete control over the hosting environment.

### Production Docker Deployment

#### Quick Start with Docker Compose (Recommended)

1. **Clone and navigate to the project**:
   ```bash
   git clone https://github.com/tdisawas0github/mini-project-game.git
   cd mini-project-game
   ```

2. **Start production container**:
   ```bash
   docker-compose up --build web
   ```
   
   **Access your app** at `http://localhost:3000`

3. **Run in background**:
   ```bash
   docker-compose up -d --build web
   ```

#### Manual Docker Commands

**Build production image**:
```bash
cd web-version
docker build -t echoes-of-ellidra .
```

**Run production container**:
```bash
docker run -d \
  --name echoes-game \
  -p 3000:80 \
  --restart unless-stopped \
  echoes-of-ellidra
```

**View logs**:
```bash
docker logs echoes-game -f
```

### Development Docker Environment

#### With Docker Compose
```bash
# Start development server with hot reload
docker-compose --profile dev up --build web-dev
```

#### Manual Development Setup
```bash
cd web-version

# Build development image
docker build -f Dockerfile.dev -t echoes-dev .

# Run with volume mounting for hot reload
docker run -d \
  --name echoes-dev \
  -p 5173:5173 \
  -v $(pwd):/app \
  -v /app/node_modules \
  echoes-dev
```

### Docker Configuration Details

**Production Container Features**:
- 🚀 **High-performance Nginx** server
- 🔒 **Security headers** and optimized configuration
- 📊 **Health checks** for monitoring
- 🗜️ **Gzip compression** for faster loading
- 📱 **SPA routing** support

**Development Container Features**:
- 🔄 **Hot module reload** for instant updates
- 🐛 **Source maps** for easier debugging
- 📦 **Volume mounting** for live code changes
- 🔧 **Development tools** and utilities

### Docker Optimization Tips

**Multi-stage builds** (already implemented):
- Smaller production images
- Faster deployments
- Better security (no build dependencies)

**Resource limits**:
```bash
# Run with resource constraints
docker run -d \
  --name echoes-game \
  --memory="512m" \
  --cpus="1.0" \
  -p 3000:80 \
  echoes-of-ellidra
```

**Docker Compose with limits**:
```yaml
services:
  web:
    # ... other config
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '1.0'
```

---

## 🔧 Build Optimization & Performance

The project is pre-configured with numerous optimizations for production deployment:

### Build Features
- **🎯 Code Splitting**: Separate chunks for vendor, animations, and styling libraries
- **🗜️ Asset Optimization**: Efficient bundling, minification, and compression
- **📦 Tree Shaking**: Eliminates unused code from final bundle
- **💾 Caching Headers**: Long-term caching for static assets
- **🏷️ SEO Meta Tags**: Proper meta tags for search engines and social sharing

### Performance Metrics
Our optimized build typically achieves:
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Total Bundle Size**: ~380KB (gzipped)

### Bundle Analysis
View your bundle composition:
```bash
cd web-version
npm run build
npx vite-bundle-analyzer dist
```

---

## 📱 Production Features & Benefits

### Progressive Web App (PWA)
- **📲 Installable**: Users can install as native app on mobile/desktop
- **🔄 Offline Support**: Works without internet after first visit
- **📱 Mobile Optimized**: Native-like experience on mobile devices
- **🔔 Push Notifications**: Ready for engagement features (if enabled)

### Responsive Design
- **📱 Mobile First**: Optimized for touch interfaces
- **💻 Desktop Enhanced**: Rich experience on larger screens
- **🖥️ Multi-Resolution**: Supports various screen densities
- **♿ Accessibility**: Screen reader compatible, keyboard navigation

### SEO & Social Media
- **🔍 Search Engine Optimized**: Proper meta tags and structured data
- **📊 Social Media Cards**: Rich previews on Twitter, Facebook, LinkedIn
- **🌐 Multi-language Ready**: Prepared for internationalization
- **📈 Analytics Ready**: Easy Google Analytics integration

---

## 🛠️ Local Testing & Development

### Development Environment
```bash
cd web-version
npm install
npm run dev
```
**Development server**: `http://localhost:5173`

### Production Build Testing
Always test your production build before deploying:

```bash
cd web-version

# Build for production
npm run build

# Preview production build locally
npm run preview
```
**Preview server**: `http://localhost:4173`

### Quality Assurance
```bash
# Run all tests
npm run test

# Run linting
npm run lint

# Type checking
npm run type-check

# Run all checks
npm run ci
```

### Performance Testing
```bash
# Analyze bundle size
npm run build && npm run analyze

# Lighthouse audit
npx lighthouse http://localhost:4173 --output=html

# Performance profiling
npm run build && npx serve dist --profile
```

---

## 🔍 Comprehensive Troubleshooting

### Common Build Issues

#### "Command not found" or Build Failures
```bash
# Verify Node.js version (must be 18+)
node --version

# Clean install dependencies
cd web-version
rm -rf node_modules package-lock.json
npm install

# Clear npm cache if needed
npm cache clean --force
```

#### TypeScript Errors
```bash
# Check TypeScript configuration
npm run type-check

# Update TypeScript if needed
npm update typescript

# Clear TypeScript cache
npx tsc --build --clean
```

#### Memory Issues During Build
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Or modify package.json build script:
# "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
```

### Platform-Specific Issues

#### Vercel Issues
**Build timeouts**:
- Upgrade to Pro plan for longer build times
- Optimize dependencies and reduce bundle size
- Use `--silent` flag in build commands

**Environment variables not working**:
- Check variable names match exactly (case-sensitive)
- Prefix with `VITE_` for client-side variables
- Redeploy after adding variables

#### Netlify Issues
**Redirects not working**:
- Verify `netlify.toml` is in repository root
- Check redirect rules syntax
- Test locally with `netlify dev`

**Build plugins failing**:
- Check plugin compatibility with Node.js 18+
- Update plugins to latest versions
- Test with minimal plugin configuration

#### Appwrite Issues
**CORS errors in browser**:
```javascript
// Add all your domains to Appwrite platform settings
// Include: localhost:5173, localhost:4173, yourdomain.com
```

**SDK connection failures**:
```javascript
// Verify endpoint and project ID
import { Client } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
    .setProject('your-project-id'); // Your project ID
```

#### Docker Issues
**Container fails to start**:
```bash
# Check port availability
netstat -tulpn | grep :3000

# View container logs
docker logs container-name

# Debug container interactively
docker run -it --entrypoint /bin/sh echoes-of-ellidra
```

**Build fails in Docker**:
```bash
# Check .dockerignore file
cat .dockerignore

# Build with progress output
docker build --progress=plain -t echoes-of-ellidra .

# Check disk space
docker system df
docker system prune -f
```

**Development container not reflecting changes**:
```bash
# Verify volume mounts
docker inspect container-name

# Restart with fresh volumes
docker-compose down -v
docker-compose --profile dev up --build web-dev
```

### Runtime Issues

#### 404 Errors on Page Refresh
This occurs when hosting doesn't handle SPA routing:

**Vercel**: Pre-configured in `vercel.json`
**Netlify**: Pre-configured in `netlify.toml`
**Apache**: Add `.htaccess`:
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

**Nginx**: Configure location block:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

#### Assets Not Loading
**Relative path issues**:
- Check `vite.config.ts` base configuration
- Verify asset imports use correct paths
- Test locally with production build

**CORS issues with assets**:
- Ensure proper CORS headers on hosting platform
- Check if CDN is properly configured

#### Performance Issues
**Slow loading times**:
- Analyze bundle with `npm run analyze`
- Consider lazy loading for heavy components
- Optimize images and assets

**Memory leaks**:
- Check for proper component cleanup
- Review event listener removal
- Test with browser developer tools

---

## 🌟 Deployment Best Practices

### Pre-Deployment Checklist
- [ ] **Build succeeds locally**: `npm run build` completes without errors
- [ ] **Tests pass**: `npm run test` shows all tests passing
- [ ] **Linting passes**: `npm run lint` shows no errors
- [ ] **Type checking**: `npm run type-check` completes successfully
- [ ] **Production preview**: `npm run preview` works correctly
- [ ] **Performance audit**: Lighthouse score > 90
- [ ] **Accessibility check**: No major accessibility issues
- [ ] **Mobile testing**: Responsive design works on various devices

### Environment Configuration
```bash
# Create environment files for different stages
.env.local          # Local development
.env.development    # Development deployment
.env.staging        # Staging environment
.env.production     # Production deployment
```

### Security Considerations
- **🔐 HTTPS everywhere**: All deployments should use HTTPS
- **🛡️ Security headers**: CSP, HSTS, X-Frame-Options (pre-configured)
- **🔑 Environment variables**: Never commit secrets to repository
- **📝 Dependency scanning**: Regularly audit with `npm audit`

### Monitoring & Analytics
```javascript
// Add to your deployed application
// Google Analytics 4
gtag('config', 'GA_MEASUREMENT_ID');

// Error tracking (e.g., Sentry)
import * as Sentry from "@sentry/react";
Sentry.init({ dsn: "YOUR_SENTRY_DSN" });

// Performance monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
```

### CI/CD Integration
**GitHub Actions** (create `.github/workflows/deploy.yml`):
```yaml
name: Deploy
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd web-version && npm ci
      - run: cd web-version && npm run build
      - run: cd web-version && npm test
```

---

## 💡 Platform Optimization Tips

### Vercel Optimization
- **Edge functions**: Use for API routes if needed
- **Image optimization**: Built-in image optimization service
- **Analytics**: Enable Vercel Analytics for performance insights
- **Branch deployments**: Automatic preview deployments for PRs

### Netlify Optimization
- **Build plugins**: Use community plugins for optimization
- **Edge handlers**: Custom logic at the CDN edge
- **Split testing**: A/B test different versions
- **Form handling**: Built-in form processing capabilities

### Appwrite Optimization
- **Database indexing**: Create indexes for frequently queried fields
- **Function optimization**: Use appropriate runtimes and memory limits
- **Storage optimization**: Implement proper file compression and caching
- **Real-time optimization**: Use subscriptions efficiently

### Docker Optimization
- **Multi-stage builds**: Reduce final image size (already implemented)
- **Layer caching**: Optimize Dockerfile for better caching
- **Resource limits**: Set appropriate CPU and memory constraints
- **Health checks**: Implement comprehensive health monitoring

---

*🎮 Ready to deploy your adventure to the world? Choose your platform and follow the guide above. The mystical world of Valdaren awaits your players!*