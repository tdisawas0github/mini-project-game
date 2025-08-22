# 🚀 Deployment Guide

This guide explains how to deploy **Echoes of Ellidra** to various hosting platforms.

## 📋 Prerequisites

- Node.js 18+ installed locally (for local development)
- Git repository access
- Account on your chosen hosting platform
- **For Docker deployment**: Docker and Docker Compose installed

## 🌐 Platform-Specific Deployment

### Vercel Deployment

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project" and import your GitHub repository

2. **Configuration**:
   - The project includes a `vercel.json` file with optimal settings
   - Build settings are automatically detected
   - Build Command: `cd web-version && npm ci && npm run build`
   - Output Directory: `web-version/dist`

3. **Environment Variables** (if needed):
   - None required for basic deployment

4. **Deploy**:
   - Click "Deploy" - Vercel will automatically build and deploy
   - Your app will be available at `https://your-project-name.vercel.app`

### Netlify Deployment

1. **Connect Repository**:
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "New site from Git" and connect your repository

2. **Build Settings**:
   - Base directory: `web-version`
   - Build command: `npm ci && npm run build`
   - Publish directory: `web-version/dist`

3. **Configuration**:
   - The project includes `netlify.toml` for optimal configuration
   - SPA redirects are handled automatically via `_redirects` file

4. **Deploy**:
   - Click "Deploy site" - Netlify will build and deploy
   - Your app will be available at `https://random-name.netlify.app`

### Manual Static Hosting

For other static hosting services (GitHub Pages, Firebase Hosting, etc.):

1. **Build the project**:
   ```bash
   cd web-version
   npm ci
   npm run build
   ```

2. **Deploy the `dist` folder**:
   - Upload the contents of `web-version/dist/` to your hosting service
   - Ensure your server is configured to serve `index.html` for all routes

### Docker Deployment

Docker provides a containerized deployment option that works on any platform supporting Docker.

#### Prerequisites

- Docker installed on your system
- Docker Compose (optional, for easier management)

#### Quick Start with Docker Compose

1. **Production Deployment**:
   ```bash
   # Clone the repository (if not already done)
   git clone https://github.com/tdisawas0github/mini-project-game.git
   cd mini-project-game
   
   # Build and start the production container
   docker-compose up --build web
   ```
   
   The application will be available at `http://localhost:3000`

2. **Development Environment**:
   ```bash
   # Start development container with hot reload
   docker-compose --profile dev up --build web-dev
   ```
   
   The development server will be available at `http://localhost:5173`

#### Manual Docker Commands

1. **Build the Docker image**:
   ```bash
   cd web-version
   docker build -t echoes-of-ellidra .
   ```

2. **Run the container**:
   ```bash
   docker run -d -p 3000:80 --name echoes-game echoes-of-ellidra
   ```

3. **For development**:
   ```bash
   # Build development image
   docker build -f Dockerfile.dev -t echoes-of-ellidra-dev .
   
   # Run development container
   docker run -d -p 5173:5173 -v $(pwd):/app -v /app/node_modules --name echoes-dev echoes-of-ellidra-dev
   ```

#### Docker Configuration Details

- **Production**: Uses Nginx to serve the built static files
- **Development**: Runs the Vite development server with hot reload
- **Health Checks**: Built-in health monitoring for container orchestration
- **Security**: Includes security headers and optimized Nginx configuration

## 🔧 Build Optimization

The project is configured with:
- **Code Splitting**: Separate chunks for vendor, animations, and styling
- **Asset Optimization**: Efficient bundling and compression
- **Caching Headers**: Long-term caching for static assets
- **SEO Meta Tags**: Proper meta tags for search engines and social media

## 📱 Production Features

- **Responsive Design**: Works on all screen sizes
- **Fast Loading**: Optimized bundle sizes and lazy loading
- **Progressive Enhancement**: Works without JavaScript for basic content
- **SEO Friendly**: Proper meta tags and semantic HTML

## 🛠️ Local Testing

Test your production build locally:

```bash
cd web-version
npm run build
npm run preview
```

Visit `http://localhost:4173` to test the production build.

## 🔍 Troubleshooting

**Build Fails**:
- Ensure Node.js 18+ is installed
- Run `npm ci` to install exact dependency versions
- Check that all required files are committed to the repository

**404 Errors on Refresh**:
- Ensure your hosting platform is configured for SPA routing
- Check that redirects are properly configured

**Assets Not Loading**:
- Verify that asset paths are correct and relative
- Check that the base URL is properly configured

**Docker Issues**:

*Container fails to start*:
- Check if ports 3000 (production) or 5173 (development) are available
- Verify Docker is running: `docker --version`
- Check container logs: `docker logs <container-name>`

*Build fails in Docker*:
- Ensure all source files are properly copied (check .dockerignore)
- Verify Node.js dependencies can be installed in the container
- Check available disk space: `docker system df`

*Health checks failing*:
- Wait for the application to fully start (health checks have a grace period)
- Check if the application is responding: `docker exec <container-name> curl -f http://localhost/`
- Review container logs for startup errors

*Development container not reflecting changes*:
- Ensure volume mounts are correct in docker-compose.yml
- Check that file changes are being detected by Vite
- Restart the development container if hot reload stops working

## 🌟 Performance Tips

- The build is already optimized with chunk splitting
- Images are served from the `/assets` folder with proper caching headers
- Consider adding a CDN for even faster global delivery

---

*Ready to explore the mystical world of Valdaren? Deploy now and share your adventure!*