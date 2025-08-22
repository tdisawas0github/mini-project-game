# 🚀 Deployment Guide

This guide explains how to deploy **Echoes of Ellidra** to various hosting platforms.

## 📋 Prerequisites

- Node.js 18+ installed locally
- Git repository access
- Account on your chosen hosting platform

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

## 🌟 Performance Tips

- The build is already optimized with chunk splitting
- Images are served from the `/assets` folder with proper caching headers
- Consider adding a CDN for even faster global delivery

---

*Ready to explore the mystical world of Valdaren? Deploy now and share your adventure!*