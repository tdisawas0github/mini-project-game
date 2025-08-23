# ☁️ Complete Appwrite Deployment Tutorial

This comprehensive tutorial guides you through deploying **Echoes of Ellidra** using Appwrite for both frontend hosting and backend services, enabling full-stack capabilities for your visual novel.

## 📋 Prerequisites

- GitHub account with access to this repository
- Appwrite account (free tier available)
- Node.js 18+ installed locally
- Basic understanding of APIs and databases (optional)

---

## 🚀 Quick Start Guide

### Step 1: Create Appwrite Account
1. Visit [appwrite.io](https://appwrite.io)
2. Click **"Get Started"** and choose your signup method
3. **Verify your email** and complete account setup

### Step 2: Choose Deployment Method
**Option A: Appwrite Cloud** (Recommended for beginners)
- Fully managed hosting
- No server setup required
- Automatic scaling and backups

**Option B: Self-Hosted**
- Full control over infrastructure
- Custom domain and configurations
- Requires Docker and server management

---

## 🌤️ Appwrite Cloud Deployment

### Step 1: Create a New Project

1. **Login to Appwrite Console**
2. **Click "Create Project"**
3. **Configure project**:
   - **Name**: `Echoes of Ellidra`
   - **Project ID**: `echoes-of-ellidra` (or your preference)
   - **Region**: Choose closest to your target audience

### Step 2: Configure Web Platform

1. **Navigate to "Platforms"** in the sidebar
2. **Click "Add Platform"** → Select **"Web App"**
3. **Platform Configuration**:
   - **Name**: `Web Version`
   - **Hostname**: `localhost` (for development)
   - **Hostname**: Your production domain (add later)

### Step 3: Deploy Frontend

#### Option A: External Hosting + Appwrite Backend
Deploy your frontend on Vercel/Netlify and use Appwrite for backend services:

1. **Deploy frontend** using [Vercel Tutorial](VERCEL_TUTORIAL.md) or [Netlify Tutorial](NETLIFY_TUTORIAL.md)
2. **Configure Appwrite in your app**:

```javascript
// web-version/src/lib/appwrite.js
import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
    .setProject('echoes-of-ellidra'); // Your project ID

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { client };
```

3. **Add environment variables** to your hosting platform:
```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=echoes-of-ellidra
```

#### Option B: Appwrite Static Hosting
Use Appwrite's built-in static hosting:

1. **Install Appwrite CLI**:
```bash
npm install -g appwrite-cli
```

2. **Login to your account**:
```bash
appwrite login
```

3. **Initialize project**:
```bash
cd /path/to/mini-project-game
appwrite init project
# Follow prompts and select your project
```

4. **Build your application**:
```bash
cd web-version
npm install
npm run build
```

5. **Deploy static files**:
```bash
appwrite deploy
```

---

## 🏗️ Backend Services Setup

### Database Configuration

#### Step 1: Create Database
1. **Go to "Databases"** in Appwrite console
2. **Click "Create Database"**
3. **Database details**:
   - **Name**: `game-data`
   - **Database ID**: `game-data`

#### Step 2: Create Collections

**Player Saves Collection**:
1. **Click "Create Collection"**
2. **Collection details**:
   - **Name**: `player-saves`
   - **Collection ID**: `player-saves`
3. **Add Attributes**:
   ```
   - userId (String, 255, required)
   - saveData (String, 100000, required)  
   - sceneName (String, 255, required)
   - timestamp (DateTime, required)
   - gameVersion (String, 50, optional)
   ```
4. **Set Permissions**:
   - **Read**: `user:USER_ID`
   - **Write**: `user:USER_ID`
   - **Create**: `users`
   - **Update**: `user:USER_ID`
   - **Delete**: `user:USER_ID`

**Game Statistics Collection**:
1. **Create collection**: `game-stats`
2. **Add Attributes**:
   ```
   - userId (String, 255, required)
   - completedScenes (Integer, required, default: 0)
   - totalPlayTime (Integer, required, default: 0)
   - achievementsUnlocked (String, 10000, optional)
   - lastPlayedDate (DateTime, required)
   ```

#### Step 3: Integrate Database in Your Game

```javascript
// web-version/src/hooks/useAppwriteGame.js
import { useState, useEffect } from 'react';
import { databases, account } from '../lib/appwrite';
import { ID, Query } from 'appwrite';

export const useAppwriteGame = () => {
  const [user, setUser] = useState(null);
  const [gameData, setGameData] = useState(null);

  // Save game state
  const saveGame = async (saveData, sceneName) => {
    try {
      const currentUser = await account.get();
      
      const save = await databases.createDocument(
        'game-data',
        'player-saves',
        ID.unique(),
        {
          userId: currentUser.$id,
          saveData: JSON.stringify(saveData),
          sceneName,
          timestamp: new Date().toISOString(),
          gameVersion: '1.0.0'
        }
      );
      
      return save;
    } catch (error) {
      console.error('Save failed:', error);
      throw error;
    }
  };

  // Load game saves
  const loadSaves = async () => {
    try {
      const currentUser = await account.get();
      
      const saves = await databases.listDocuments(
        'game-data',
        'player-saves',
        [
          Query.equal('userId', currentUser.$id),
          Query.orderDesc('timestamp'),
          Query.limit(10)
        ]
      );
      
      return saves.documents.map(doc => ({
        id: doc.$id,
        saveData: JSON.parse(doc.saveData),
        sceneName: doc.sceneName,
        timestamp: new Date(doc.timestamp),
        gameVersion: doc.gameVersion
      }));
    } catch (error) {
      console.error('Load failed:', error);
      return [];
    }
  };

  return {
    user,
    saveGame,
    loadSaves
  };
};
```

### Authentication Setup

#### Step 1: Configure Auth Providers
1. **Go to "Auth"** in Appwrite console
2. **Click "Settings"** tab
3. **Enable providers**:
   - **Email/Password**: For traditional signup
   - **Anonymous**: For guest play
   - **Google/GitHub**: For social login

#### Step 2: Implement Authentication

```javascript
// web-version/src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { account } from '../lib/appwrite';
import { ID } from 'appwrite';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check current session
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        console.log('No active session');
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, []);

  // Login with email/password
  const login = async (email, password) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      setUser(user);
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Register new user
  const register = async (email, password, name) => {
    try {
      await account.create(ID.unique(), email, password, name);
      await login(email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  // Anonymous login for guests
  const guestLogin = async () => {
    try {
      await account.createAnonymousSession();
      const user = await account.get();
      setUser(user);
      return user;
    } catch (error) {
      console.error('Guest login failed:', error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    user,
    loading,
    login,
    register,
    guestLogin,
    logout
  };
};
```

### Storage for Game Assets

#### Step 1: Create Storage Bucket
1. **Go to "Storage"** in Appwrite console
2. **Click "Create Bucket"**
3. **Bucket configuration**:
   - **Name**: `game-assets`
   - **Bucket ID**: `game-assets`
   - **File size limit**: 50MB
   - **Allowed file types**: `jpg,png,gif,mp3,ogg,webm`

#### Step 2: Implement File Upload

```javascript
// web-version/src/hooks/useStorage.js
import { storage } from '../lib/appwrite';
import { ID } from 'appwrite';

export const useStorage = () => {
  // Upload user-generated content (screenshots, etc.)
  const uploadFile = async (file, fileName = null) => {
    try {
      const fileId = fileName || ID.unique();
      const uploadedFile = await storage.createFile(
        'game-assets',
        fileId,
        file
      );
      
      // Get file URL
      const fileUrl = storage.getFileView('game-assets', uploadedFile.$id);
      
      return {
        id: uploadedFile.$id,
        url: fileUrl.href,
        file: uploadedFile
      };
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  };

  // Delete file
  const deleteFile = async (fileId) => {
    try {
      await storage.deleteFile('game-assets', fileId);
    } catch (error) {
      console.error('Delete failed:', error);
      throw error;
    }
  };

  return {
    uploadFile,
    deleteFile
  };
};
```

---

## ⚡ Serverless Functions

### Create Cloud Functions

#### Step 1: Set Up Functions
1. **Go to "Functions"** in Appwrite console
2. **Click "Create Function"**
3. **Function configuration**:
   - **Name**: `game-leaderboard`
   - **Runtime**: `node-18.0`
   - **Entry Point**: `src/main.js`

#### Step 2: Deploy Function Code

```javascript
// functions/game-leaderboard/src/main.js
const sdk = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  const client = new sdk.Client();
  const databases = new sdk.Databases(client);

  client
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

  try {
    if (req.method === 'GET') {
      // Get leaderboard
      const scores = await databases.listDocuments(
        'game-data',
        'game-stats',
        [
          sdk.Query.orderDesc('completedScenes'),
          sdk.Query.limit(10)
        ]
      );

      return res.json({
        success: true,
        leaderboard: scores.documents
      });
    }

    if (req.method === 'POST') {
      // Update user score
      const { userId, completedScenes, totalPlayTime } = JSON.parse(req.body);
      
      const stats = await databases.createDocument(
        'game-data',
        'game-stats',
        sdk.ID.unique(),
        {
          userId,
          completedScenes,
          totalPlayTime,
          lastPlayedDate: new Date().toISOString()
        }
      );

      return res.json({
        success: true,
        stats
      });
    }

    return res.json({ error: 'Method not allowed' }, 405);
  } catch (err) {
    error('Function error: ' + err.message);
    return res.json({ error: err.message }, 500);
  }
};
```

#### Step 3: Use Functions in Your App

```javascript
// web-version/src/api/leaderboard.js
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

export const getLeaderboard = async () => {
  try {
    const response = await fetch(
      `${APPWRITE_ENDPOINT}/functions/game-leaderboard/executions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': PROJECT_ID
        },
        body: JSON.stringify({
          method: 'GET'
        })
      }
    );
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Leaderboard fetch failed:', error);
    return null;
  }
};

export const updateScore = async (userId, completedScenes, totalPlayTime) => {
  try {
    const response = await fetch(
      `${APPWRITE_ENDPOINT}/functions/game-leaderboard/executions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': PROJECT_ID
        },
        body: JSON.stringify({
          method: 'POST',
          userId,
          completedScenes,
          totalPlayTime
        })
      }
    );
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Score update failed:', error);
    return null;
  }
};
```

---

## 🔒 Security & Permissions

### Database Security

**Collection-Level Permissions**:
- **Read**: Allow users to read their own data
- **Write**: Restrict write access to document owners
- **Create**: Allow authenticated users to create documents
- **Delete**: Allow users to delete their own documents

**Document-Level Security**:
```javascript
// Set permissions when creating documents
await databases.createDocument(
  'game-data',
  'player-saves',
  ID.unique(),
  {
    // document data
  },
  [
    `read("user:${userId}")`,
    `write("user:${userId}")`,
    `delete("user:${userId}")`
  ]
);
```

### API Key Management

**Function API Keys**:
1. **Go to "Settings"** → **API Keys**
2. **Create function-specific keys** with minimal permissions
3. **Use environment variables** in functions
4. **Rotate keys regularly**

### CORS Configuration

**Configure allowed origins**:
1. **Platform Settings** → **Web App**
2. **Add production domains**:
   - `https://yourgame.com`
   - `https://www.yourgame.com`
3. **Include development domains**:
   - `http://localhost:5173`
   - `http://localhost:4173`

---

## 🔍 Monitoring & Debugging

### Real-time Monitoring

**Set up real-time subscriptions**:
```javascript
// web-version/src/hooks/useRealtime.js
import { client } from '../lib/appwrite';

export const useRealtime = () => {
  useEffect(() => {
    // Subscribe to database changes
    const unsubscribe = client.subscribe(
      'databases.game-data.collections.player-saves.documents',
      (response) => {
        console.log('Real-time update:', response);
        // Update local state
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);
};
```

### Error Tracking

```javascript
// web-version/src/utils/errorTracking.js
export const trackError = (error, context) => {
  console.error('Game Error:', error, context);
  
  // Send to external service like Sentry
  // or store in Appwrite database for analysis
  databases.createDocument(
    'game-data',
    'error-logs',
    ID.unique(),
    {
      error: error.message,
      stack: error.stack,
      context: JSON.stringify(context),
      timestamp: new Date().toISOString(),
      userId: user?.$id || 'anonymous'
    }
  );
};
```

### Performance Monitoring

**Database Performance**:
- Monitor query execution times
- Use proper indexes for frequently queried fields
- Implement pagination for large result sets

**Function Performance**:
- Monitor execution times and memory usage
- Implement caching for expensive operations
- Use appropriate runtimes and configurations

---

## 🚀 Optimization & Best Practices

### Database Optimization

**Indexing Strategy**:
```javascript
// Create indexes for frequently queried fields
// In Appwrite console: Database → Collection → Indexes
// Add indexes for:
// - userId (for user-specific queries)
// - timestamp (for sorting by date)
// - sceneName (for scene-specific queries)
```

**Query Optimization**:
```javascript
// Use specific queries instead of fetching all data
const recentSaves = await databases.listDocuments(
  'game-data',
  'player-saves',
  [
    Query.equal('userId', userId),
    Query.orderDesc('timestamp'),
    Query.limit(5) // Only get what you need
  ]
);
```

### Caching Strategy

**Client-side Caching**:
```javascript
// web-version/src/hooks/useCache.js
import { useState, useEffect } from 'react';

export const useCache = (key, fetchFunction, ttl = 300000) => { // 5 min TTL
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem(key);
    const cacheTime = localStorage.getItem(`${key}_time`);
    
    if (cached && cacheTime && Date.now() - parseInt(cacheTime) < ttl) {
      setData(JSON.parse(cached));
      setLoading(false);
      return;
    }

    fetchFunction()
      .then((result) => {
        setData(result);
        localStorage.setItem(key, JSON.stringify(result));
        localStorage.setItem(`${key}_time`, Date.now().toString());
      })
      .finally(() => setLoading(false));
  }, [key, fetchFunction, ttl]);

  return { data, loading };
};
```

### Offline Support

**Service Worker Integration**:
```javascript
// web-version/public/sw.js
const CACHE_NAME = 'echoes-game-v1';
const STATIC_CACHE = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

// Cache game data for offline play
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/databases/')) {
    event.respondWith(
      caches.open(CACHE_NAME)
        .then(cache => cache.match(event.request))
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request).then(response => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
    );
  }
});
```

---

## 🎯 Production Checklist

### Pre-Launch Verification

- [ ] **Authentication** working correctly
- [ ] **Database** CRUD operations functional
- [ ] **File uploads** working properly
- [ ] **Functions** executing successfully
- [ ] **Real-time** subscriptions active
- [ ] **Permissions** properly configured
- [ ] **CORS** settings correct
- [ ] **SSL certificates** active
- [ ] **Performance** optimized
- [ ] **Error handling** implemented

### Security Audit

- [ ] **API keys** properly secured
- [ ] **Database permissions** restrictive
- [ ] **Input validation** implemented
- [ ] **Rate limiting** configured
- [ ] **HTTPS** enforced everywhere
- [ ] **Sensitive data** encrypted
- [ ] **Session management** secure
- [ ] **CORS policy** restrictive

### Performance Check

- [ ] **Database queries** optimized
- [ ] **Indexes** created appropriately  
- [ ] **Caching** implemented
- [ ] **Bundle size** minimized
- [ ] **Images** optimized
- [ ] **Function** execution times acceptable
- [ ] **Network requests** minimized

---

## 🆘 Troubleshooting

### Common Issues

**CORS Errors**:
```
Solution: Add your domain to Platform settings
- Include both localhost:5173 and production domain
- Verify protocol (http vs https) matches
```

**Authentication Failures**:
```
Solution: Check session management
- Verify account.get() calls
- Ensure proper error handling
- Check browser storage permissions
```

**Database Permission Errors**:
```
Solution: Review collection permissions
- Verify user roles and permissions
- Check document-level permissions
- Test with console database queries
```

**Function Execution Timeouts**:
```
Solution: Optimize function code
- Reduce external API calls
- Implement proper error handling
- Monitor function logs and metrics
```

### Getting Help

**Official Resources**:
- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Discord Community](https://appwrite.io/discord)
- [Appwrite GitHub](https://github.com/appwrite/appwrite)

**Debugging Tools**:
- Appwrite Console logs
- Browser developer tools
- Function execution logs
- Database query analysis

---

*☁️ Ready to power your visual novel with a complete backend solution? Appwrite provides everything you need to create an engaging, persistent gaming experience for your players!*