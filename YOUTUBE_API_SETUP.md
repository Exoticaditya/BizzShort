# YouTube API Setup & Auto-Refresh Guide (BizzShort)

This doc shows how to fetch the 10 newest @bizz_short videos with real titles, IDs, thumbnails, durations, views, and dates using YouTube Data API v3.

## 1) Create an API Key (YouTube Data API v3)
1. Go to https://console.cloud.google.com/
2. Create/select a project (e.g., `bizzshort`)
3. APIs & Services → Library → search **YouTube Data API v3** → **Enable**
4. APIs & Services → Credentials → **Create Credentials → API key**
5. Copy the key (looks like `AIza...`)
6. Restrict the key (Application restriction: None or HTTP referrers; API restriction: YouTube Data API v3)

## 2) Find Your Channel ID
- Visit https://www.youtube.com/account_advanced (logged in)
- Copy **Channel ID** (format: `UCxxxxxxxxxxxxxxxx`)

## 3) Set Environment Vars (preferred)
Create `.env` in repo root:
```
YT_API_KEY=YOUR_API_KEY
YT_CHANNEL_ID=YOUR_CHANNEL_ID
YT_MAX_RESULTS=10
```
> Keep `.env` out of git. If needed, add to `.gitignore`.

## 4) Run Fetch Script
From repo root:
```powershell
npm run fetch:youtube
```
This will:
- Call YouTube API for latest videos
- Write `video-database-output.js` with `videoDatabase` array

## 5) Apply to Site
1. Open `video-database-output.js`
2. Copy the `const videoDatabase = [...]` block
3. Paste over the existing array in `assets/js/video-manager.js`
4. (Optional) Sync `videosDatabase` in `assets/js/video-detail.js` if you want articles tied to the same IDs

## 6) Schedule Refresh (optional)
- Add a GitHub Action/CI step to run `npm run fetch:youtube` weekly and commit the updated `video-manager.js`.
- Or run locally when you publish new videos.

## 7) Testing
```powershell
python -m http.server 8000
# open http://localhost:8000
# Ctrl+Shift+R to hard refresh
```
Check:
- Cards show real thumbnails/titles
- Clicking opens YouTube
- Category filters work

## 8) Troubleshooting
- **403 / quota**: Ensure API enabled, key unrestricted (or proper restriction), channel ID correct.
- **Empty list**: Channel has no public videos or wrong channel ID.
- **Thumbnails low-res**: Swap `maxresdefault` → `hqdefault` if needed.
- **Dates off**: Uses publishedAt from YouTube.
- **Views zero**: New uploads sometimes lag stats; rerun later.

## 9) Instagram Reels (if ever needed)
Instagram Graph API requires a Business/Creator IG + FB app + access token. Higher friction. Recommended to stay with YouTube Shorts for reliability.

## 10) Minimal Manual Path (no API)
If you prefer manual:
```powershell
node utils/easy-video-updater.js
```
Paste URLs → script builds the array → paste into `video-manager.js`.

You’re set. Next step: create `.env` and run `npm run fetch:youtube`.
