# Docker Setup for Echoes of Ellidra

This directory contains Docker configuration files for containerized deployment of the web version.

## Files Overview

- `Dockerfile` - Production build with Nginx
- `Dockerfile.dev` - Development build with hot reload
- `nginx.conf` - Nginx configuration for SPA routing
- `.dockerignore` - Files to exclude from Docker build context

## Quick Start

### Production

```bash
# Build and run production container
docker build -t echoes-of-ellidra .
docker run -d -p 3000:80 echoes-of-ellidra
```

### Development

```bash
# Build and run development container
docker build -f Dockerfile.dev -t echoes-of-ellidra-dev .
docker run -d -p 5173:5173 -v $(pwd):/app -v /app/node_modules echoes-of-ellidra-dev
```

### Using Docker Compose (Recommended)

From the repository root:

```bash
# Production
docker-compose up --build web

# Development
docker-compose --profile dev up --build web-dev
```

## Container Details

### Production Container
- Based on `node:18-alpine` for building, `nginx:alpine` for serving
- Serves static files via Nginx on port 80 (mapped to 3000)
- Includes security headers and SPA routing configuration
- Health checks enabled
- Optimized for production use

### Development Container
- Based on `node:18-alpine`
- Runs Vite development server on port 5173
- Supports hot reload via volume mounts
- Includes development dependencies
- Suitable for active development

## Customization

### Nginx Configuration
Edit `nginx.conf` to customize:
- Security headers
- Cache policies
- Compression settings
- Routing rules

### Environment Variables
The containers support standard Vite environment variables:
- `NODE_ENV` - Set to 'development' or 'production'
- Custom environment variables can be added via Docker Compose

## Monitoring

Both containers include health checks:
- **Production**: Checks HTTP response on port 80
- **Development**: Checks HTTP response on port 5173
- Health check intervals: 30s
- Startup grace period: 40s for production, 10s for development