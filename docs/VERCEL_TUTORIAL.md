# 🔥 Complete Vercel Deployment Tutorial

This tutorial provides a comprehensive, step-by-step guide to deploy **Echoes of Ellidra** on Vercel with advanced configuration options.

## 📋 Prerequisites

- GitHub account with access to this repository
- Vercel account (free tier available)
- Node.js 18+ installed locally
- Basic familiarity with Git

---

## 🚀 Quick Deployment (2 minutes)

### Step 1: Fork Repository
1. Go to the [GitHub repository](https://github.com/tdisawas0github/mini-project-game)
2. Click **"Fork"** in the top-right corner
3. Choose your GitHub account as the destination

### Step 2: Connect to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Click **"Start Deploying"** or **"New Project"**
3. **Sign in with GitHub** and authorize Vercel
4. **Import your forked repository**:
   - Find `mini-project-game` in the list
   - Click **"Import"**

### Step 3: Deploy
1. Vercel auto-detects the configuration from `vercel.json`
2. Click **"Deploy"** (no configuration needed!)
3. Wait 2-3 minutes for deployment
4. **Access your live site** at the provided URL

**🎉 Congratulations!** Your game is now live on Vercel.

---

## ⚙️ Advanced Configuration

### Build Settings Explanation

Our `vercel.json` file pre-configures everything:

```json
{
  "version": 2,
  "name": "echoes-of-ellidra",
  "builds": [
    {
      "src": "web-version/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "buildCommand": "cd web-version-4 && npm ci && npm run build",
  "outputDirectory": "web-version/dist",
  "installCommand": "cd web-version-4 && npm ci"
}
```

**Key Settings**:
- **Build Command**: `cd web-version-4 && npm ci && npm run build`
- **Output Directory**: `web-version/dist`
- **Install Command**: `cd web-version-4 && npm ci`
- **SPA Routing**: Automatically configured

### Environment Variables

If you need environment variables:

1. Go to your project on Vercel dashboard
2. Click **"Settings"** tab
3. Click **"Environment Variables"**
4. Add variables:
   ```
   Key: VITE_API_URL
   Value: https://your-api.com
   Environment: Production, Preview, Development
   ```

**Important**: Client-side variables must be prefixed with `VITE_`.

### Custom Domain Setup

1. **Purchase a domain** (from any registrar)
2. **Go to your Vercel project** → **"Domains"** tab
3. **Add your domain**:
   - Click **"Add"**
   - Enter your domain (e.g., `yourgame.com`)
4. **Configure DNS**:
   - **For root domain** (`yourgame.com`): Add A record to `76.76.19.61`
   - **For subdomain** (`www.yourgame.com`): Add CNAME to `cname.vercel-dns.com`
5. **Wait for propagation** (up to 48 hours, usually much faster)

### Branch Deployments

Vercel automatically creates preview deployments for every branch:

- **Production**: `main` branch → `https://yourgame.com`
- **Previews**: Other branches → `https://branch-name-git-project.vercel.app`

**To configure**:
1. **Settings** → **Git**
2. Set **Production Branch** to your preferred branch
3. Configure **Deploy Hooks** if needed

---

## 🔧 Performance Optimization

### Analytics Integration
1. **Go to project dashboard**
2. **Click "Analytics"** tab
3. **Enable Vercel Analytics** for performance insights
4. **View metrics**:
   - Page views and unique visitors
   - Core Web Vitals
   - Top pages and referrers

### Speed Insights
1. **Enable Speed Insights** in project settings
2. **Monitor Core Web Vitals**:
   - Largest Contentful Paint (LCP)
   - First Input Delay (FID)
   - Cumulative Layout Shift (CLS)

### Edge Functions (Advanced)
If you need API routes or server-side logic:

1. **Create** `api/` directory in your project
2. **Add functions**:
   ```javascript
   // api/game-stats.js
   export default function handler(req, res) {
     res.json({ players: 1000, sessions: 5000 });
   }
   ```
3. **Deploy** - functions are automatically available at `/api/game-stats`

---

## 🔍 Troubleshooting & Common Issues

### Build Failures

**"Command failed with exit code 1"**:
1. **Check the build logs** in Vercel dashboard
2. **Common causes**:
   - Missing dependencies
   - TypeScript errors
   - Environment variable issues

**Solution**:
```bash
# Test locally first
cd web-version
npm install
npm run build
```

**"Node.js version mismatch"**:
- Vercel uses Node.js 18 by default
- Add `package.json` engines field if needed:
  ```json
  "engines": {
    "node": ">=18.0.0"
  }
  ```

### Runtime Issues

**404 errors on page refresh**:
- Our `vercel.json` should handle this automatically
- If issues persist, check routes configuration

**Assets not loading**:
1. **Check asset paths** are relative
2. **Verify build output** in local preview:
   ```bash
   npm run build && npm run preview
   ```

**Environment variables not working**:
1. **Verify variable names** (case-sensitive)
2. **Check VITE_ prefix** for client-side variables
3. **Redeploy** after adding variables

### Performance Issues

**Slow build times**:
1. **Check dependencies** for unnecessary packages
2. **Consider Vercel Pro** for faster build servers
3. **Optimize build process**:
   ```json
   "scripts": {
     "build": "vite build --mode production"
   }
   ```

**Large bundle size**:
1. **Analyze bundle**:
   ```bash
   npm run build
   npx vite-bundle-analyzer dist
   ```
2. **Implement code splitting**
3. **Remove unused dependencies**

---

## 🚀 Advanced Features

### Serverless Functions

Create API endpoints for your game:

```javascript
// api/leaderboard.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const scores = await kv.zrange('leaderboard', 0, 9, { rev: true, withScores: true });
    res.json(scores);
  }
  
  if (req.method === 'POST') {
    const { player, score } = req.body;
    await kv.zadd('leaderboard', { score, member: player });
    res.json({ success: true });
  }
}
```

### Edge Config

Store configuration data at the edge:

1. **Create Edge Config** in Vercel dashboard
2. **Add configuration**:
   ```json
   {
     "gameSettings": {
       "maxPlayers": 1000,
       "maintenanceMode": false
     }
   }
   ```
3. **Use in your app**:
   ```javascript
   // api/config.js
   import { get } from '@vercel/edge-config';
   
   export default async function handler(req, res) {
     const gameSettings = await get('gameSettings');
     res.json(gameSettings);
   }
   ```

### Middleware

Add custom logic to all requests:

```javascript
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  return response;
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
```

---

## 📊 Monitoring & Maintenance

### Deployment Monitoring
1. **Set up notifications** in project settings
2. **Monitor deployment status** via dashboard
3. **Check build logs** regularly

### Performance Monitoring
```javascript
// Add to your app
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Security Best Practices
1. **Enable security headers** (pre-configured)
2. **Use HTTPS everywhere** (automatic with Vercel)
3. **Regularly update dependencies**:
   ```bash
   npm audit
   npm update
   ```

---

## 🎯 Production Checklist

Before going live:

- [ ] **Build succeeds** locally and on Vercel
- [ ] **All pages load** correctly
- [ ] **Game functions** work as expected
- [ ] **Mobile responsive** design verified
- [ ] **Performance score** > 90 on Lighthouse
- [ ] **Custom domain** configured (if applicable)
- [ ] **Analytics** enabled and tracking
- [ ] **Error monitoring** set up
- [ ] **Backup strategy** in place

---

## 🆘 Getting Help

**Official Resources**:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Vercel Support](https://vercel.com/support)

**Project-Specific Help**:
- Check the main [DEPLOYMENT.md](../DEPLOYMENT.md) guide
- Open an issue on the project repository
- Review the troubleshooting section above

---

*🚀 Ready to share your game with the world? Vercel makes it incredibly easy to deploy and scale your visual novel adventure!*