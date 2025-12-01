# BizzShort - Live Server Fix

## ✅ Issue Fixed

The Live Server was pointing to a different project (EduFuture). I've created workspace-specific settings for BizzShort.

## 🔧 What Was Done

Created `.vscode/settings.json` with:
- ✅ Root set to current workspace (`/`)
- ✅ Port: 5500
- ✅ API proxy to backend (port 3000)
- ✅ Proper file ignoring

## 🚀 How to Use Live Server Now

1. **Close and Reopen VS Code** (to load new settings)
2. **Right-click on `index.html`** → Select "Open with Live Server"
3. **Or** Click "Go Live" button in bottom-right status bar

Your BizzShort project will now open correctly at:
- **Frontend:** http://localhost:5500
- **Backend API:** http://localhost:3000/api

## 📝 Additional Steps (If Issue Persists)

If Live Server still opens the wrong project:

1. **Clear Live Server Global Settings:**
   - Press `Ctrl + Shift + P`
   - Type: "Preferences: Open User Settings (JSON)"
   - Remove any `liveServer.settings.root` entries pointing to other projects

2. **Reset Live Server:**
   - Stop Live Server (click "Port: 5500" in status bar)
   - Close VS Code completely
   - Reopen BizzShort folder
   - Try "Go Live" again

## ✨ Workspace Settings Added

The `.vscode/settings.json` file now ensures:
- Live Server always serves from BizzShort root
- API calls to `/api/*` automatically proxy to backend
- Proper file exclusions (node_modules, .vscode, etc.)
