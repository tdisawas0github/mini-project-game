# 🌊 Complete Netlify Deployment Tutorial

This tutorial provides a comprehensive, step-by-step guide to deploy **Echoes of Ellidra** on Netlify with advanced features and configuration options.

## 📋 Prerequisites

- GitHub account with access to this repository
- Netlify account (free tier available)
- Node.js 18+ installed locally
- Basic familiarity with Git

---

## 🚀 Quick Deployment (3 minutes)

### Step 1: Fork Repository
1. Go to the [GitHub repository](https://github.com/tdisawas0github/mini-project-game)
2. Click **"Fork"** in the top-right corner
3. Choose your GitHub account as the destination

### Step 2: Connect to Netlify
1. Visit [netlify.com](https://netlify.com)
2. Click **"Sign up"** and choose **"GitHub"** for authentication
3. Click **"New site from Git"** on your dashboard
4. **Choose GitHub** and authorize Netlify

### Step 3: Configure Build Settings
1. **Select your repository**: `mini-project-game`
2. **Configure settings** (our `netlify.toml` handles this automatically):
   - **Base directory**: `web-version`
   - **Build command**: `npm ci && npm run build`
   - **Publish directory**: `web-version/dist`
3. Click **"Deploy site"**

### Step 4: Access Your Site
1. Wait 3-4 minutes for deployment
2. **Visit your live site** at `https://random-name.netlify.app`
3. **Customize site name**: Site Settings → Site Information → Change site name

**🎉 Your game is now live on Netlify!**

---

## ⚙️ Advanced Configuration

### Netlify Configuration File

Our `netlify.toml` file provides optimal configuration:

```toml
[build]
  base = "web-version"
  publish = "web-version/dist"
  command = "npm ci && npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = false

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "max-age=31536000, immutable"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "max-age=31536000, immutable"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "max-age=31536000, immutable"
```

### Environment Variables

1. **Go to Site Settings** → **Environment Variables**
2. **Add variables**:
   ```
   Key: VITE_API_URL
   Value: https://your-api.com
   Scope: All, Deploy previews, or Branch deploys
   ```
3. **Redeploy** for changes to take effect

**Note**: Client-side variables must be prefixed with `VITE_`.

### Custom Domain Setup

1. **Purchase a domain** from any registrar
2. **Go to Site Settings** → **Domain Settings**
3. **Add custom domain**:
   - Click **"Add custom domain"**
   - Enter your domain: `yourgame.com`
4. **Configure DNS**:
   - **Option A - Netlify DNS** (recommended):
     - Use Netlify's nameservers
     - Automatic SSL certificate
   - **Option B - External DNS**:
     - Add CNAME record: `www` → `your-site.netlify.app`
     - Add A record: `@` → Netlify's IP addresses

### Branch Deployments & Deploy Previews

Netlify automatically creates deploy previews for every pull request:

- **Production**: `main` branch → `https://yourgame.com`
- **Branch deploys**: Other branches → `https://branch--site-name.netlify.app`
- **Deploy previews**: Pull requests → `https://deploy-preview-123--site-name.netlify.app`

**Configuration**:
1. **Site Settings** → **Build & Deploy** → **Deploy contexts**
2. Set **Production branch** and **Branch deploy branches**
3. Enable **Deploy previews** for pull requests

---

## 🔧 Advanced Netlify Features

### Forms Handling

Add contact forms or feedback forms to your game:

```html
<!-- Add to your React component -->
<form name="contact" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact" />
  <label>
    Name: <input type="text" name="name" required />
  </label>
  <label>
    Email: <input type="email" name="email" required />
  </label>
  <label>
    Message: <textarea name="message" required></textarea>
  </label>
  <button type="submit">Send</button>
</form>
```

**With React Hook Form**:
```javascript
import { useForm } from 'react-hook-form';

function ContactForm() {
  const { register, handleSubmit } = useForm();
  
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('form-name', 'contact');
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-netlify="true">
      {/* form fields */}
    </form>
  );
}
```

### Netlify Functions (Serverless)

Create serverless API endpoints:

```javascript
// netlify/functions/game-stats.js
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  // Game statistics logic
  const stats = {
    totalPlayers: 5000,
    activeNow: 250,
    completedStories: 1200
  };
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(stats)
  };
};
```

**Use in your React app**:
```javascript
const fetchGameStats = async () => {
  const response = await fetch('/.netlify/functions/game-stats');
  const stats = await response.json();
  return stats;
};
```

### Split Testing

A/B test different versions of your game:

1. **Site Settings** → **Split Testing**
2. **Create branch** with variations: `version-b`
3. **Configure split**:
   - Branch: `version-b`
   - Traffic split: 50%/50%
4. **Deploy both branches**

### Identity & Authentication

Add user authentication to your game:

1. **Site Settings** → **Identity**
2. **Enable Identity** service
3. **Configure providers**: Email, GitHub, Google, etc.
4. **Add to your app**:

```javascript
import netlifyIdentity from 'netlify-identity-widget';

// Initialize
netlifyIdentity.init();

// Login
netlifyIdentity.open();

// Get current user
const user = netlifyIdentity.currentUser();
```

---

## 🔍 Troubleshooting & Common Issues

### Build Failures

**"Build command failed with exit code 1"**:
1. **Check deploy logs** in Netlify dashboard
2. **Common issues**:
   - Wrong Node.js version
   - Missing dependencies
   - Build script errors

**Solution**:
```bash
# Test locally first
cd web-version
npm install
npm run build
```

**Node.js version issues**:
- Set version in `netlify.toml`:
  ```toml
  [build.environment]
    NODE_VERSION = "18"
  ```

### Runtime Issues

**404 errors on page refresh**:
- Our `netlify.toml` configures SPA redirects automatically
- If issues persist, check redirect rules

**Functions not working**:
1. **Check function location**: Must be in `netlify/functions/` or configured directory
2. **Verify function syntax**: CommonJS exports
3. **Check logs**: Functions tab in Netlify dashboard

**Forms not receiving submissions**:
1. **Verify form attributes**: `data-netlify="true"`
2. **Check form name**: Must match hidden field
3. **Test form**: Use simple HTML first, then add React handling

### Performance Issues

**Slow builds**:
1. **Enable build cache**: Site Settings → Build & Deploy → Post processing
2. **Optimize dependencies**: Remove unused packages
3. **Parallel processing**: Use `npm ci` instead of `npm install`

**Large deploy size**:
1. **Check build output**: Ensure only `dist/` folder is published
2. **Optimize assets**: Compress images, minify files
3. **Bundle analysis**:
   ```bash
   npm run build
   npx vite-bundle-analyzer dist
   ```

---

## 🚀 Performance Optimization

### Build Optimization

**Enable build plugins** in `netlify.toml`:
```toml
[[plugins]]
  package = "@netlify/plugin-essential-next-js"

[[plugins]]
  package = "netlify-plugin-submit-sitemap"
  [plugins.inputs]
    baseUrl = "https://yourgame.com"
    sitemapPath = "/sitemap.xml"
```

**Cache optimization**:
```toml
[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, no-cache"

[[headers]]
  for = "/manifest.json"
  [headers.values]
    Cache-Control = "public, max-age=86400"
```

### Analytics Integration

**Netlify Analytics**:
1. **Enable** in Site Settings → Analytics
2. **View metrics**: Page views, unique visitors, top pages

**Google Analytics**:
```javascript
// Add to your app
import { gtag } from 'ga-gtag';

gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: 'Echoes of Ellidra',
  page_location: window.location.href
});
```

### Performance Monitoring

**Web Vitals tracking**:
```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToNetlify(metric) {
  navigator.sendBeacon('/api/analytics', JSON.stringify(metric));
}

getCLS(sendToNetlify);
getFID(sendToNetlify);
getFCP(sendToNetlify);
getLCP(sendToNetlify);
getTTFB(sendToNetlify);
```

---

## 🛡️ Security & Best Practices

### Security Headers

Add security headers in `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'"
```

### Environment Security

1. **Never commit secrets** to your repository
2. **Use environment variables** for API keys
3. **Limit function permissions** to necessary scopes
4. **Regular dependency updates**:
   ```bash
   npm audit
   npm update
   ```

### Access Control

**Password protect staging sites**:
1. **Site Settings** → **Access Control**
2. **Enable password protection** for deploy previews
3. **Set visitor access**: Password or role-based

---

## 📊 Monitoring & Maintenance

### Deploy Notifications

**Set up notifications**:
1. **Site Settings** → **Build & Deploy** → **Deploy notifications**
2. **Add notifications**: Email, Slack, webhook
3. **Configure triggers**: Deploy started, succeeded, failed

### Monitoring Dashboard

**Key metrics to track**:
- Deploy frequency and success rate
- Build times and performance
- Form submissions and errors
- Function invocations and errors
- Bandwidth usage and traffic

### Maintenance Tasks

**Regular maintenance**:
- [ ] **Update dependencies** monthly
- [ ] **Review analytics** weekly
- [ ] **Check error logs** weekly
- [ ] **Test all forms** monthly
- [ ] **Verify SSL certificates** quarterly
- [ ] **Review security headers** quarterly

---

## 🎯 Production Checklist

Before launching:

- [ ] **Build completes** successfully
- [ ] **All routes work** (no 404 errors)
- [ ] **Forms function** correctly
- [ ] **Functions respond** properly
- [ ] **SSL certificate** is active
- [ ] **Custom domain** configured
- [ ] **Analytics** tracking enabled
- [ ] **Performance score** > 90
- [ ] **Security headers** configured
- [ ] **Error monitoring** in place

---

## 🆘 Getting Help

**Official Resources**:
- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Community Forum](https://community.netlify.com/)
- [Netlify Support](https://www.netlify.com/support/)

**Netlify Status**:
- [Status Page](https://netlifystatus.com/)
- [System Status](https://status.netlify.com/)

**Project-Specific Help**:
- Main [DEPLOYMENT.md](../DEPLOYMENT.md) guide
- GitHub Issues for project bugs
- Community Discord for discussions

---

*🌊 Ready to ride the wave of modern web deployment? Netlify offers incredible features to power your visual novel and engage with your players!*