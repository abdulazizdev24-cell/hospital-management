# Setting Up GitHub Repository

Follow these steps to push your code to GitHub.

## Prerequisites
- ✅ Git installed (see INSTALL_GIT.md if not installed)
- ✅ GitHub account created

---

## Step 1: Create Repository on GitHub

### 1.1 Go to GitHub
1. Go to [github.com](https://github.com)
2. Sign in to your account
3. Click the **"+"** icon (top right) → **"New repository"**

### 1.2 Create New Repository
- **Repository name:** `hospital-management` (or any name you prefer)
- **Description:** "Hospital Management System built with Next.js"
- **Visibility:** 
  - ☑ Public (recommended for free hosting)
  - ☐ Private
- **DO NOT** check "Initialize with README" (we already have code)
- **DO NOT** add .gitignore or license (we already have them)
- Click **"Create repository"**

### 1.3 Copy Repository URL
After creating, GitHub will show you a page with commands. 
**Copy the repository URL** - it looks like:
```
https://github.com/YOUR_USERNAME/hospital-management.git
```

---

## Step 2: Push Your Code to GitHub

### 2.1 Open PowerShell in Your Project Folder

```powershell
cd C:\Users\Abdul Aziz\Desktop\hms\hospital-management
```

### 2.2 Initialize Git (if not already done)

```powershell
git init
```

### 2.3 Add All Files

```powershell
git add .
```

### 2.4 Create First Commit

```powershell
git commit -m "Initial commit - Hospital Management System"
```

### 2.5 Rename Branch to Main

```powershell
git branch -M main
```

### 2.6 Add GitHub Remote

**Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values:**

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

**Example:**
```powershell
git remote add origin https://github.com/johndoe/hospital-management.git
```

### 2.7 Push to GitHub

```powershell
git push -u origin main
```

**Note:** You'll be prompted for your GitHub username and password (or Personal Access Token).

---

## Step 3: GitHub Authentication

### If Asked for Credentials:

**Option A: Personal Access Token (Recommended)**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "Vercel Deployment"
4. Select scopes: ☑ `repo` (all)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. Use this token as your password when pushing

**Option B: GitHub CLI (Alternative)**
```powershell
# Install GitHub CLI
winget install --id GitHub.cli

# Authenticate
gh auth login
```

---

## Step 4: Verify Upload

1. Go to your GitHub repository page
2. You should see all your files
3. Files should include:
   - `app/` folder
   - `lib/` folder
   - `models/` folder
   - `package.json`
   - `README.md`
   - etc.

---

## Troubleshooting

### Error: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Error: "Authentication failed"
- Use Personal Access Token instead of password
- Make sure token has `repo` scope

### Error: "Permission denied"
- Check repository URL is correct
- Verify you have access to the repository

### Error: "nothing to commit"
```powershell
# Check status
git status

# If files are already committed, just push
git push -u origin main
```

---

## Success! ✅

Once your code is on GitHub, you can proceed to Vercel deployment!

Your repository URL: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`
