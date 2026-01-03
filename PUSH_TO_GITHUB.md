# Push to GitHub - Your Personal Guide

## Your GitHub Username: `abdulazizdev24-cell`

---

## Step 1: Create Repository on GitHub

1. Go to: https://github.com/new
2. **Repository name:** `hospital-management`
3. **Description:** "Hospital Management System built with Next.js"
4. **Visibility:** ☑ Public
5. **DO NOT** check "Initialize with README"
6. Click **"Create repository"**

---

## Step 2: Push Your Code (After Git is Installed)

Open PowerShell and run these commands **one by one**:

```powershell
# Navigate to your project
cd "C:\Users\Abdul Aziz\Desktop\hms\hospital-management"

# Initialize git
git init

# Add all files
git add .

# Create commit
git commit -m "Initial commit - Hospital Management System"

# Set main branch
git branch -M main

# Add GitHub remote (YOUR REPOSITORY)
git remote add origin https://github.com/abdulazizdev24-cell/hospital-management.git

# Push to GitHub
git push -u origin main
```

---

## Step 3: Authentication

When you run `git push`, GitHub will ask for credentials:

**Username:** `abdulazizdev24-cell`

**Password:** Use a **Personal Access Token** (not your GitHub password)

### How to Create Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. **Note:** "Vercel Deployment"
4. **Expiration:** 90 days (or No expiration)
5. **Select scopes:** ☑ `repo` (check the repo checkbox)
6. Click **"Generate token"**
7. **Copy the token immediately** (you won't see it again!)
8. Use this token as your password when pushing

---

## Your Repository URL

After creating the repository, your URL will be:
```
https://github.com/abdulazizdev24-cell/hospital-management
```

---

## Quick Command Reference

Copy and paste these commands in order:

```powershell
cd "C:\Users\Abdul Aziz\Desktop\hms\hospital-management"
git init
git add .
git commit -m "Initial commit - Hospital Management System"
git branch -M main
git remote add origin https://github.com/abdulazizdev24-cell/hospital-management.git
git push -u origin main
```

---

## Troubleshooting

### If "remote origin already exists":
```powershell
git remote remove origin
git remote add origin https://github.com/abdulazizdev24-cell/hospital-management.git
```

### If authentication fails:
- Make sure you're using Personal Access Token, not password
- Verify token has `repo` scope

---

## After Success ✅

Once your code is pushed, you'll see it at:
**https://github.com/abdulazizdev24-cell/hospital-management**

Then proceed to Vercel deployment!
