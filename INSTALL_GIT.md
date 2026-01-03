# Installing Git on Windows

You need Git installed to push your code to GitHub. Follow these steps:

## Option 1: Install Git for Windows (Recommended)

### Step 1: Download Git
1. Go to: https://git-scm.com/download/win
2. The download will start automatically
3. Wait for the installer to download

### Step 2: Install Git
1. Run the downloaded installer (Git-2.x.x-64-bit.exe)
2. Click "Next" through the installation
3. **Important settings:**
   - Choose "Git from the command line and also from 3rd-party software" (recommended)
   - Use default editor (or choose your preferred editor)
   - Use "OpenSSL" library
   - Use "Checkout Windows-style, commit Unix-style line endings"
   - Use "MinTTY" terminal
   - Enable "Enable file system caching"
   - Click "Install"

### Step 3: Verify Installation
1. Close and reopen your terminal/PowerShell
2. Run: `git --version`
3. You should see something like: `git version 2.x.x`

## Option 2: Install via Winget (Windows Package Manager)

If you have Windows 10/11 with winget:

```powershell
winget install --id Git.Git -e --source winget
```

## Option 4: Install via Chocolatey

If you have Chocolatey installed:

```powershell
choco install git
```

---

## After Installing Git

1. **Close and reopen your PowerShell/terminal**
2. **Verify installation:**
   ```powershell
   git --version
   ```

3. **Configure Git (first time setup):**
   ```powershell
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

4. **Now you can proceed with GitHub setup!**

---

## Quick Test

After installation, test it:

```powershell
cd hospital-management
git init
```

If this works without errors, Git is installed correctly!
