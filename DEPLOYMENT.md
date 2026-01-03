# Deployment Guide - Free Hosting Options

This guide covers deploying the Hospital Management System to free hosting platforms.

## Prerequisites

1. **GitHub Account** (free) - for code hosting
2. **MongoDB Atlas Account** (free) - for database
3. **Hosting Platform Account** - choose one from options below

---

## Option 1: Vercel (Recommended for Next.js)

Vercel is made by the creators of Next.js and offers the best integration.

### Step 1: Prepare Your Code

1. **Create a GitHub repository** (if you haven't already):
   ```bash
   cd hospital-management
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/hospital-management.git
   git push -u origin main
   ```

### Step 2: Set Up MongoDB Atlas (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Create a new cluster (choose FREE tier)
4. Wait for cluster to be created (~5 minutes)
5. Click **"Connect"** → **"Connect your application"**
6. Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`)
7. Replace `<password>` with your database password
8. Add your database name at the end: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hospital-management`

### Step 3: Deploy to Vercel

1. Go to [Vercel](https://vercel.com/signup)
2. Sign up with GitHub
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./hospital-management` (if repo is in subfolder) or `./` (if repo root)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

6. **Add Environment Variables**:
   Click "Environment Variables" and add:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hospital-management
   JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string
   COOKIE_NAME=auth-token
   NODE_ENV=production
   ```

7. Click **"Deploy"**
8. Wait for deployment (~2-3 minutes)
9. Your app will be live at: `https://your-project-name.vercel.app`

### Step 4: Configure MongoDB Atlas Network Access

1. In MongoDB Atlas, go to **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (or add Vercel's IP ranges)
4. Click **"Confirm"**

### Step 5: Create Admin User

After deployment, you can create an admin user by:
1. Using the registration page (first user will be patient)
2. Or use the create-admin script locally and update the database

---

## Option 2: Netlify

### Step 1: Prepare for Netlify

Netlify requires a build output. Update `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // or 'export' for static export
};

export default nextConfig;
```

### Step 2: Deploy to Netlify

1. Go to [Netlify](https://www.netlify.com/)
2. Sign up with GitHub
3. Click **"Add new site"** → **"Import an existing project"**
4. Select your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Base directory**: `hospital-management` (if needed)

6. **Add Environment Variables**:
   - Go to Site settings → Environment variables
   - Add the same variables as Vercel

7. Click **"Deploy site"**

**Note**: Netlify works best with static exports. For full Next.js features, Vercel is recommended.

---

## Option 3: Railway

Railway offers a free tier with $5 credit monthly.

### Step 1: Deploy to Railway

1. Go to [Railway](https://railway.app/)
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Railway will auto-detect Next.js

6. **Add Environment Variables**:
   - Go to Variables tab
   - Add:
     ```
     MONGODB_URI=your-mongodb-connection-string
     JWT_SECRET=your-secret-key
     COOKIE_NAME=auth-token
     NODE_ENV=production
     ```

7. Railway will automatically deploy

---

## Option 4: Render

### Step 1: Deploy to Render

1. Go to [Render](https://render.com/)
2. Sign up with GitHub
3. Click **"New"** → **"Web Service"**
4. Connect your GitHub repository
5. Configure:
   - **Name**: hospital-management
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. **Add Environment Variables**:
   - Add the same variables as above

7. Click **"Create Web Service"**

---

## Environment Variables Summary

You need to set these in your hosting platform:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/hospital-management` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-random-secret-key-here` |
| `COOKIE_NAME` | Name of auth cookie | `auth-token` |
| `NODE_ENV` | Environment | `production` |

### Generate a Secure JWT Secret

Run this command to generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Post-Deployment Steps

### 1. Test Your Deployment

1. Visit your deployed URL
2. Test registration
3. Test login
4. Test admin dashboard (if you have admin access)

### 2. Create Admin User

**Option A: Using Registration + Database Update**
1. Register a new user (will be patient by default)
2. Go to MongoDB Atlas → Collections
3. Find your user in the `users` collection
4. Change `role` from `"patient"` to `"admin"`

**Option B: Using Script (Local)**
1. Run locally: `npm run create-admin`
2. The admin will be in your database

### 3. Configure Custom Domain (Optional)

Most platforms allow custom domains:
- **Vercel**: Settings → Domains
- **Netlify**: Domain settings → Add custom domain
- **Railway**: Settings → Domains
- **Render**: Settings → Custom Domains

---

## Important Security Notes

1. **Change JWT_SECRET**: Use a strong, random string in production
2. **MongoDB Security**: 
   - Use strong database passwords
   - Restrict network access to your hosting platform's IPs
   - Enable MongoDB Atlas authentication
3. **HTTPS**: All platforms provide HTTPS by default
4. **Environment Variables**: Never commit `.env` files to Git

---

## Troubleshooting

### Build Fails

- Check build logs in your hosting platform
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Database Connection Issues

- Check MongoDB Atlas network access settings
- Verify connection string is correct
- Check if database user has proper permissions

### Authentication Not Working

- Verify `JWT_SECRET` is set correctly
- Check `COOKIE_NAME` matches in all places
- Ensure cookies are being set (check browser dev tools)

### 404 Errors on Routes

- Verify Next.js routing is configured correctly
- Check if using static export (some features won't work)

---

## Recommended: Vercel + MongoDB Atlas

**Why Vercel?**
- Made by Next.js creators
- Zero configuration needed
- Automatic HTTPS
- Global CDN
- Free tier includes:
  - Unlimited personal projects
  - 100GB bandwidth/month
  - Automatic deployments from Git

**Why MongoDB Atlas?**
- Free tier: 512MB storage
- No credit card required
- Automatic backups
- Global clusters

---

## Cost Breakdown (Free Tier)

| Service | Free Tier Limits |
|---------|------------------|
| **Vercel** | Unlimited projects, 100GB bandwidth/month |
| **MongoDB Atlas** | 512MB storage, shared cluster |
| **Total Cost** | **$0/month** |

---

## Next Steps After Deployment

1. ✅ Test all features
2. ✅ Create admin user
3. ✅ Set up monitoring (optional)
4. ✅ Configure custom domain (optional)
5. ✅ Set up automatic backups (MongoDB Atlas has this by default)

---

## Need Help?

If you encounter issues:
1. Check the hosting platform's logs
2. Check MongoDB Atlas connection status
3. Verify all environment variables are set
4. Check browser console for errors
