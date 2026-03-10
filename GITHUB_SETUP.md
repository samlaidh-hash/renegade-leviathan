# Pushing to GitHub

The repository is initialized with all files committed. To push to GitHub:

## Option 1: Create repo on GitHub.com first

1. Go to [github.com](https://github.com) and sign in
2. Click **New repository**
3. Name it `renegade-legion-leviathan` (or your preferred name)
4. **Do not** initialize with README (we already have one)
5. Create the repository

Then run:

```powershell
cd "D:\Dropbox\Free Games\2025 RPG\CLAUDE GAMES\RL_LEV\renegade-legion-leviathan"

# Add your GitHub repo as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/renegade-legion-leviathan.git

# Push
git push -u origin master
```

If your default branch is `main` instead of `master`:

```powershell
git branch -M main
git push -u origin main
```

## Option 2: Using GitHub Desktop

1. Open GitHub Desktop
2. File → Add Local Repository
3. Select `D:\Dropbox\Free Games\2025 RPG\CLAUDE GAMES\RL_LEV\renegade-legion-leviathan`
4. Publish repository to GitHub from the menu
