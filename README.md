# 🕸️ SPIN & WHEEL — Renaissance 2026

> **Department of Computer Science & Engineering**  
> **CSEA — WE CAN ∞ WE WILL**  
> **CSE Coding Club (CCC)**  

A high-energy, Spider-Man themed, team-based interactive challenge wheel web application engineered for the **Renaissance 2026** technical symposium.

---

## 🌟 Key Features

- 🕷️ **Spider-Man Superhero Comic Aesthetic:**
  - Rich comic styling, custom typography, radial web graphics, and animated floating Spidey mascot.
  - Full **Dark Mode** (Default) & **Light Mode** support with dynamic theme toggle.
- 🎓 **Dual Academic Track Engine:**
  - **1st Year (Freshers Track):** 20 curated challenges covering C basics, loops, arrays, pointers, and problem-solving logic.
  - **2nd Year (Sophomore Track):** 20 curated challenges covering Data Structures (Trees, Graphs, Sorting), Systems, OS, DBMS, and Web Architecture.
- 🎡 **20-Segment Dynamic Scaled Wheel:**
  - 18° exact geometric segment slicing matching Spider-Man color palettes.
  - Physics-based smooth deceleration with mechanical ticking sound effects.
  - Segments never repeat during an active session.
- ⏱️ **2-Minute Challenge Lock & Live Solving Timer:**
  - Locks the wheel for 2 minutes (120s) upon landing, displaying a live countdown progress bar and solving stopwatch.
  - **`NEXT SPIN`** unlocks the wheel after the 2-minute timer completes and logs the exact solve time.
- 🖥️ **Zero-Scroll $100\text{vh}$ Viewport Layout:**
  - **Left Panel (Fixed):** Team Duo Card $\rightarrow$ Progress Counter $\rightarrow$ Scaled Wheel $\rightarrow$ Spin / Lock CTA.
  - **Right Panel (Independently Scrollable):** Question Details $\rightarrow$ Code/Options $\rightarrow$ Live Stopwatch $\rightarrow$ Next Spin $\rightarrow$ Team Solve Times History.
- 📊 **Dual Google Sheets Backend Architecture:**
  - Exactly **TWO** Google Spreadsheet files (`Renaissance 2026 — 1st Year` and `Renaissance 2026 — 2nd Year`).
  - **`Main` Sheet:** Overview list of all registered teams with duo details, entry times, and total question counts.
  - **One Inner Tab Per Team:** Each duo gets their own dedicated tab recording question history, pattern, difficulty, timestamp, and solve duration.
  - Only **ONE endpoint URL** needed in `.env` (`VITE_GOOGLE_SCRIPT_URL`).

---

## 🏗️ Google Sheets Architecture

```text
Google Drive
│
├── 📊 Renaissance 2026 — 1st Year
│   ├── 📑 Main (Overview of all 1st Year teams)
│   ├── 📑 Team Alpha (Duo details + Spin & Solve history)
│   ├── 📑 Code Warriors (Duo details + Spin & Solve history)
│   └── 📑 Byte Squad (Duo details + Spin & Solve history)
│
└── 📊 Renaissance 2026 — 2nd Year
    ├── 📑 Main (Overview of all 2nd Year teams)
    ├── 📑 Elements (Duo details + Spin & Solve history)
    ├── 📑 Avengers (Duo details + Spin & Solve history)
    └── 📑 Tech Titans (Duo details + Spin & Solve history)
```

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, JavaScript (ES6+)
- **Styling:** Tailwind CSS, Custom Comic Typography (`Bangers`, `Outfit`), Glassmorphism
- **Animations:** Framer Motion, Canvas Confetti
- **Icons & Audio:** Lucide React, Web Audio API Sound Synthesizer & FX
- **Backend & Cloud Database:** Google Apps Script (Serverless Router), Google Sheets API

---

## 📁 Project Structure

```text
src/
├── assets/
│   └── mascot.jpg               # Spider-Man reference mascot
├── components/
│   ├── HeaderBranding.jsx       # Renaissance, CSEA, CCC logos & theme toggle
│   ├── QuestionCard.jsx         # Question details, 2-min lock bar, live stopwatch
│   ├── QuestionRenderer.jsx     # Dynamic renderer for Coding, MCQ, Output, etc.
│   ├── RegistrationForm.jsx     # Duo registration form with roll validation
│   ├── RemainingCounter.jsx     # Sleek question pool counter & progress bar
│   ├── SolvedHistoryList.jsx    # Solved questions & solve durations list
│   ├── SoundControl.jsx         # Audio mute/unmute toggle
│   ├── SpiderBackground.jsx     # Canvas animated spider webs & particles
│   ├── SpideyMascot.jsx         # Floating hero mascot component
│   ├── SpinButton.jsx           # Spin CTA & 2-min lock button state
│   ├── SpinWheel.jsx            # 20-segment SVG animated wheel
│   ├── TeamInfo.jsx             # Compact duo info card
│   └── ThemeToggle.jsx          # Dark / Light theme switch
├── data/
│   └── questions.js             # 20 questions for 1st Year & 20 for 2nd Year
├── hooks/
│   └── useSpinWheel.js          # Wheel rotation, 2-min timer & lock state hook
├── pages/
│   ├── Game.jsx                 # 2-column desktop game arena
│   └── Registration.jsx         # Viewport-locked registration screen
├── services/
│   └── googleSheets.js          # Local registry cache & Apps Script client
├── utils/
│   └── audio.js                 # Sound effects & ticking synthesizer
├── App.jsx                      # App root with theme & team routing
├── index.css                    # Tailwind tokens, glowing filters, and theme CSS
└── main.jsx                     # Vite entry point
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd "Spin and Sprint"
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_APPS_SCRIPT_WEB_APP_ID/exec
```

### 4. Running Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) (or the port displayed in your terminal).

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## ☁️ Google Apps Script Deployment Guide

1. **Create 2 Google Sheets** in Google Drive:
   - `Renaissance 2026 — 1st Year`
   - `Renaissance 2026 — 2nd Year`
2. **Open `google-apps-script.js`** in the project and paste the URLs/IDs into `SPREADSHEET_IDS`:
   ```javascript
   var SPREADSHEET_IDS = {
     "1st Year": "https://docs.google.com/spreadsheets/d/FIRST_YEAR_ID/edit",
     "2nd Year": "https://docs.google.com/spreadsheets/d/SECOND_YEAR_ID/edit"
   };
   ```
3. Open [script.google.com](https://script.google.com/) $\rightarrow$ Create **New project**.
4. Paste the entire content of [`google-apps-script.js`](./google-apps-script.js) into `Code.gs`.
5. Click **Deploy** $\rightarrow$ **New deployment** $\rightarrow$ Select type **Web app**:
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
6. Copy the deployed Web App URL (`https://script.google.com/macros/s/.../exec`) and paste it into `.env` as `VITE_GOOGLE_SCRIPT_URL`.

---

## 📜 Supported Question Patterns

- 💻 **CODING:** Problem description, sample input/output, constraints, and test cases.
- 🐛 **DEBUGGING:** Problem context, buggy snippet, and targeted debugging instructions.
- 🔮 **OUTPUT PREDICTION:** Code snippets with complex language quirks (type coercion, recursion, closures).
- 🔘 **MCQ:** Multiple-choice technical questions with 4 selectable options.
- ⚡ **RAPID FIRE:** High-impact, focused problem statements for instant answering.
- 📚 **THEORY:** Conceptual CS fundamentals, system design, and algorithms.

---

## 👥 Credits & Organization

- **Event:** Renaissance 2026
- **Department:** Department of Computer Science & Engineering
- **Organizers:** CSEA & CSE Coding Club (CCC)
