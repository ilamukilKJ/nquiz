# 🌿 GeoQuiz • NPTEL Conservation Geography (React + Vite)

A modern, responsive React quizzing platform built with **React 18**, **Vite**, **Glassmorphism UI**, and **Web Audio API** sound effects. It comes pre-loaded with all 120 verified assignment questions across **Weeks 1 to 12** of Conservation Geography.

Ready for zero-config hosting on **Vercel**! 🚀

---

## ✨ Features

- **React 18 & Vite**: Lightning-fast hot module reloading and optimized production build (`dist/`).
- **Dashboard & Module Selection**:
  - **Dark / Light Mode**: Smooth transition between Cosmic Aurora and Iridescent Cloud glass themes.
  - **Module-Wise Selection**: Interactive tiles for all 12 weekly modules.
  - **Quick Presets**:
    - 🌟 **All Modules (Whole Thing)**: Weeks 1–12
    - 🌓 **First Half**: Weeks 1–6
    - 🌔 **Second Half**: Weeks 7–12
    - 🔄 **Clear All**
  - **Cross-Week Shuffling (Randomize All)**: Shuffles all questions across all selected modules simultaneously (not just within their own week).
- **Quiz Interface**:
  - `← Dashboard` back button with safety prompt.
  - `Question X of Y` live progress counter + glowing animated progress bar.
  - `⏱️ Live Timer` tracking elapsed duration.
  - `🔊 / 🔇 Sound Toggle` button.
  - Cute animated mascot with real-time cheering and encouragement reactions.
  - Immediate audio-visual feedback:
    - **Correct**: Emerald glow, ascending chord chime, confetti sparkles, cheering mascot.
    - **Incorrect**: Coral soft glow, gentle wobble shake, cute boop sound, reveals correct solution in green.
  - Full keyboard shortcuts (`1-4` for choices, `Enter`/`→` for next, `←` for previous).
- **Results & Review**:
  - Celebratory victory fanfare and confetti explosion.
  - Metric cards: Correct count, Wrong count, Total time taken, Accuracy %.
  - **Proceed to Dashboard** & **Retry Same Quiz** buttons.
  - Comprehensive question review with filters (`All`, `Mistakes Only`, `Correct Only`).

---

## 🚀 Local Development

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Start Vite local development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 🌐 Deploy to Vercel

### Option 1: Vercel Git Integration (Recommended)
1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - NPTEL React Quiz"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Vercel automatically detects **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `vite build`
   - **Output Directory**: `dist`
5. Click **Deploy**! ✨

### Option 2: Deploy with Vercel CLI
```bash
npx vercel
```
Follow the interactive prompts and your site will be live on Vercel in seconds!

---

## 📁 Project Structure

```
├── index.html              # Vite HTML entry point
├── package.json            # React + Vite dependencies & scripts
├── vite.config.js          # Vite configuration
├── vercel.json             # Vercel SPA routing configuration
├── src/
│   ├── main.jsx            # React root mount
│   ├── App.jsx             # Main interactive application & views
│   ├── data/
│   │   └── questions.json  # 120 verified questions & answers (Weeks 1–12)
│   ├── utils/
│   │   ├── sound.js        # Web Audio API sound synthesizers
│   │   └── confetti.js     # Canvas confetti celebration engine
│   └── styles/
│       └── App.css         # Glassmorphic themes, animations & responsive styling
```
