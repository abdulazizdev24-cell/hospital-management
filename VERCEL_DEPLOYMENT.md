# Step-by-Step Vercel Deployment Guide

Follow these exact steps to deploy your Hospital Management System to Vercel.

## Prerequisites ✅
- [x] GitHub account
- [x] MongoDB Atlas account
- [x] Vercel account (we'll create this)

---

## Step 1: Prepare Your Code for GitHub

### 1.1 Check if code is already on GitHub

If your code is NOT on GitHub yet, run these commands in your terminal:

```bash
cd hospital-management

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**Replace:**
- `YOUR_USERNAME` with your GitHub username
- `YOUR_REPO_NAME` with your repository name

---

## Step 2: Get Your MongoDB Atlas Connection String

### 2.1 In MongoDB Atlas Dashboard:

1. **Go to your cluster** → Click **"Connect"**
2. Click **"Connect your application"**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 2.2 Replace the placeholders:

- Replace `<username>` with your MongoDB username
- Replace `<password>` with your MongoDB password
- Add your database name at the end: `...mongodb.net/hospital-management`

**Final format should be:**
```
mongodb+srv://myusername:mypassword@cluster0.abc123.mongodb.net/hospital-management?retryWrites=true&w=majority
```

### 2.3 Configure Network Access:

1. In MongoDB Atlas, go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (or add `0.0.0.0/0`)
4. Click **"Confirm"**

**⚠️ Important:** This allows Vercel to connect to your database.

---

## Step 3: Generate JWT Secret

Run this command in your terminal:

```bash
cd hospital-management
npm run generate-secret
```

**Copy the generated secret** - you'll need it in the next step.

Or manually run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 4: Deploy to Vercel

### 4.1 Sign up / Login to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

### 4.2 Import Your Project

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see your GitHub repositories
3. Find and click **"Import"** next to your `hospital-management` repository

### 4.3 Configure Project Settings

Vercel will auto-detect Next.js, but verify:

- **Framework Preset:** Next.js (should be auto-detected)
- **Root Directory:** `./` (if repo is the hospital-management folder) OR leave blank
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

**If your repository contains the hospital-management folder as a subfolder:**
- Set **Root Directory** to: `hospital-management`

### 4.4 Add Environment Variables

**Before clicking "Deploy", click "Environment Variables"** and add these:

#### Variable 1: MONGODB_URI
- **Key:** `MONGODB_URI`
- **Value:** Your MongoDB connection string from Step 2
- **Environment:** Production, Preview, Development (select all)

#### Variable 2: JWT_SECRET
- **Key:** `JWT_SECRET`
- **Value:** The secret you generated in Step 3
- **Environment:** Production, Preview, Development (select all)

#### Variable 3: COOKIE_NAME
- **Key:** `COOKIE_NAME`
- **Value:** `auth-token`
- **Environment:** Production, Preview, Development (select all)

#### Variable 4: NODE_ENV
- **Key:** `NODE_ENV`
- **Value:** `production`
- **Environment:** Production only

**Click "Save" after adding each variable.**

### 4.5 Deploy!

1. Click **"Deploy"** button
2. Wait 2-3 minutes for deployment
3. You'll see build logs in real-time
4. When done, you'll get a URL like: `https://your-project-name.vercel.app`

---

## Step 5: Verify Deployment

### 5.1 Test Your App

1. Visit your Vercel URL
2. Try registering a new user
3. Try logging in
4. Check if data is saving to MongoDB Atlas

### 5.2 Check MongoDB Atlas

1. Go to MongoDB Atlas → **Collections**
2. You should see your database `hospital-management`
3. Check if data is being created (users, patients, etc.)

---

## Step 6: Create Admin User

### Option A: Via MongoDB Atlas (Easiest)

1. Register a user through your app (will be "patient" by default)
2. Go to MongoDB Atlas → Collections → `users`
3. Find your user document
4. Click **Edit** on the document
5. Change `"role": "patient"` to `"role": "admin"`
6. Click **Update**

### Option B: Via Script (Local)

1. Update your local `.env.local` with production MongoDB URI
2. Run: `npm run create-admin`
3. The admin will be created in your production database

---

## Step 7: Configure Custom Domain (Optional)

1. In Vercel dashboard → Your project → **Settings** → **Domains**
2. Add your custom domain
3. Follow Vercel's instructions to configure DNS

---

## Troubleshooting

### Build Fails

**Check:**
- All dependencies are in `package.json`
- No syntax errors in code
- Check build logs in Vercel dashboard

**Common fixes:**
```bash
# Make sure all dependencies are listed
npm install
npm run build  # Test locally first
```

### Database Connection Fails

**Check:**
1. MongoDB Atlas Network Access allows `0.0.0.0/0` (all IPs)
2. Connection string is correct (no extra spaces)
3. Username and password are correct
4. Database name is included in connection string

### Authentication Not Working

**Check:**
1. `JWT_SECRET` is set correctly
2. `COOKIE_NAME` matches (`auth-token`)
3. Clear browser cookies and try again
4. Check browser console for errors

### 404 Errors on Routes

**This shouldn't happen with Next.js on Vercel**, but if it does:
- Check Next.js routing is correct
- Verify API routes are in `app/api/` folder

---

## Environment Variables Summary

Here's what you need to add in Vercel:

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/hospital-management` | MongoDB Atlas → Connect |
| `JWT_SECRET` | `[64-character hex string]` | Run `npm run generate-secret` |
| `COOKIE_NAME` | `auth-token` | Fixed value |
| `NODE_ENV` | `production` | Fixed value |

---

## Post-Deployment Checklist

- [ ] Deployment successful
- [ ] App URL working: `https://your-app.vercel.app`
- [ ] Can register new users
- [ ] Can login
- [ ] Data saving to MongoDB Atlas
- [ ] Admin user created
- [ ] Admin dashboard accessible
- [ ] All features working

---

## Your Deployment URLs

After deployment, you'll have:

- **Production URL:** `https://your-project-name.vercel.app`
- **Preview URLs:** Created for each Git push (for testing)

---

## Need Help?

If something goes wrong:

1. **Check Vercel Logs:**
   - Go to your project → **Deployments** → Click on a deployment → **Logs**

2. **Check MongoDB Atlas:**
   - Verify connection string
   - Check Network Access settings
   - Check if database user has proper permissions

3. **Test Locally First:**
   ```bash
   # Set environment variables in .env.local
   npm run build
   npm start
   ```

---

## Success! 🎉

Once deployed, your app will be:
- ✅ Live on the internet
- ✅ Automatically deployed on every Git push
- ✅ Using HTTPS (secure)
- ✅ Fast (global CDN)
- ✅ Free (Vercel free tier)

**Your app is now live!** Share the URL with others to use your Hospital Management System.
