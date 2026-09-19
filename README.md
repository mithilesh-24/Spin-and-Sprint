# 🕸️ SPIN & WHEEL — Renaissance 2026
> **Department of Computer Science & Engineering**  
> **CSE Coding Club (CCC)**  
> **CSEA — WE CAN ∞ WE WILL**  

A high-energy, Spider-Man themed, team-based interactive challenge wheel web application engineered for the **Renaissance 2026** technical symposium.

---

## 📖 Complete Project Architecture & Documentation (From 0 to Now)

### 1. Project Inception & Goal
- **Context:** Built for Renaissance 2026 organized by the Department of Computer Science & Engineering, CSE Coding Club (CCC), and CSEA.
- **Goal:** Create a high-energy interactive web application where registered 2-member teams (duos) select their academic track (1st Year or 2nd Year), spin an authentic 20-segment physics-animated wheel, receive challenges, and solve questions under a strict challenge timer, with all live records seamlessly routed to Google Sheets and Microsoft Excel.

---

### 2. Dual Academic Tracks & Roll Number Validation

The application enforces track-specific academic rules for participants:

| Academic Track | Roll Number Prefix Rule | Example Roll Number | Question Pool Focus | Target Spreadsheet |
| :--- | :--- | :--- | :--- | :--- |
| **1st Year** *(Freshers Track)* | **Must start with `26`** | `26CSR101`, `26ITR012`, `26ECR005` | C Fundamentals, Loops, Conditionals, Arrays, Strings, Pointers, Logic Puzzles | `Renaissance 2026 — 1st Year` |
| **2nd Year** *(Sophomore Track)* | **Must start with `25`** | `25CSR175`, `25ITR023`, `25ECR099` | Data Structures, Algorithms, OS, DBMS, Networks, Cryptography | `Renaissance 2026 — 2nd Year` |

#### Validation Features:
- **Dynamic Placeholders:** Automatically switches between `Roll (e.g. 26CSR101)` and `Roll (e.g. 25CSR175)` based on the active track.
- **Live Prefix Badges:** Displays visual indicator badges (`Prefix: 26...` or `Prefix: 25...`) in member registration cards.
- **Track-Specific Error Messages:** Instant validation feedback (e.g., *"1st Year roll numbers must start with 26 (e.g. 26CSR101)"*).

---

### 3. Dual Google Apps Script & Cloud Architecture

```text
[Frontend React + Vite App]
           │
           ├── Selects "1st Year" & Roll 26... ──▶ VITE_GOOGLE_SCRIPT_URL_1ST ──▶ 📊 Renaissance 2026 — 1st Year
           │                                                                          ├── 📑 Main (Overview)
           │                                                                          └── 📑 Team Tabs (Logs)
           │
           └── Selects "2nd Year" & Roll 25... ──▶ VITE_GOOGLE_SCRIPT_URL_2ND ──▶ 📊 Renaissance 2026 — 2nd Year
                                                                                      ├── 📑 Main (Overview)
                                                                                      └── 📑 Team Tabs (Logs)
```

- **Dedicated Web App Endpoints:**
  - `VITE_GOOGLE_SCRIPT_URL_1ST`: Deployed Web App for 1st Year Google Sheet.
  - `VITE_GOOGLE_SCRIPT_URL_2ND`: Deployed Web App for 2nd Year Google Sheet.
  - `VITE_GOOGLE_SCRIPT_URL`: Universal fallback endpoint.
- **Dedicated Apps Script Files:**
  - [`google-apps-script-1st-year.js`](file:///d:/Project/Spin%20and%20Sprint/google-apps-script-1st-year.js)
  - [`google-apps-script-2nd-year.js`](file:///d:/Project/Spin%20and%20Sprint/google-apps-script-2nd-year.js)
  - [`google-apps-script.js`](file:///d:/Project/Spin%20and%20Sprint/google-apps-script.js) (Unified dual-sheet router)

---

### 4. Zero-Delay Optimistic Registration Flow
- **Instant UI Transition:** When the user clicks **"ENTER SPIN & WHEEL"**, the application transitions immediately to the game arena with zero freeze or delay.
- **Non-Blocking Background Sync:** Registration payload is stored locally and dispatched to Google Sheets asynchronously in the background.
- **AbortController Timeouts:** Network calls include timeout safety guards (800ms for duplicate check, 3500ms for GET, 5000ms for POST) to guarantee the UI never hangs on slow networks.

---

### 5. Microsoft Excel (.xlsx) Export & Sync Guide

You can access and export event data in Excel using two methods:

#### Method A: Direct Download to Excel (.xlsx)
1. Open the target Google Sheet (`Renaissance 2026 — 1st Year` or `2nd Year`).
2. Click **File** → **Download** → **Microsoft Excel (.xlsx)**.
3. The downloaded `.xlsx` file contains all formatted tabs (`Main` overview and individual team logs).

#### Method B: Live Real-Time Auto-Sync via Excel Power Query
1. In Google Sheets: **File** → **Share** → **Publish to web** → select **CSV** or **Web page** → Copy link.
2. In Microsoft Excel: **Data** → **Get Data / From Web** → Paste link → Click **Load**.
3. Click **Data → Refresh All** anytime during the event for instant live updates.

---

### 6. Full Technology Stack
- **Frontend Core:** React 18, Vite, Modern ES6+ JavaScript.
- **Styling & Design System:** Tailwind CSS, Custom Typography (`Bangers`, `Outfit`, `Montserrat`), Custom Glowing Filters (`spidey-glow-red`, `spidey-glow-violet`, `spidey-glow-gold`), Glassmorphism, Dual Theme (Dark / Light Mode).
- **Physics & Motion:** Framer Motion, HTML5 Canvas Particle Web Animation, Canvas Confetti particle emitter.
- **Audio Synthesizer:** Web Audio API sound generator (mechanical wheel ticking, celebratory fanfare, lock, and click FX) with master mute/unmute control.
- **Backend & Database:** Dual Google Apps Script Web Apps connected to Google Spreadsheets.

---

### 7. Step-by-Step Evolution (0 to Now)

#### Phase 1: Foundation & Core Mechanics
- Set up React + Vite project structure with Tailwind CSS.
- Designed authentic 20-segment SVG Spider-Man wheel with 18° slice geometry and deceleration physics.
- Curated 40 technical challenges:
  - **1st Year Pool:** C Fundamentals, Loops, Conditionals, Arrays, String manipulations, Pointers, Logic puzzles.
  - **2nd Year Pool:** Data Structures (Binary Trees, Graphs, Hash Maps), Algorithms, OS, DBMS, Networks, Cryptography.
- Implemented `QuestionRenderer` supporting 6 question formats: **CODING**, **DEBUGGING**, **OUTPUT PREDICTION**, **MCQ**, **RAPID FIRE**, and **THEORY**.

#### Phase 2: Game Flow & Challenge Lock
- Built the **2-Minute Challenge Lock** mechanism: upon the wheel landing on a challenge slice, the wheel locks for 120 seconds to allow the duo to solve without interruptions.
- Integrated a live **Solving Stopwatch** to record the exact duration duos take to crack each challenge.
- Added the **`NEXT SPIN`** action: unlocks the wheel, marks the question as completed in session history, updates Google Sheets with solve duration, and fires celebratory Spider-Man confetti.

#### Phase 3: Desktop Zero-Scroll Layout
- Engineered a strict 2-column desktop arena:
  - **Left Column (Fixed Viewport):** Team Details Card $\rightarrow$ Remaining Counter $\rightarrow$ 20-Segment Wheel $\rightarrow$ Spin Button / Lock status.
  - **Right Column (Independently Scrollable):** Active Question Card $\rightarrow$ Live Code/Options $\rightarrow$ Stopwatch $\rightarrow$ Solved History list.

#### Phase 4: Branding, Aesthetics & Mascot
- Added authentic Renaissance 2026 symposium header branding, CCC badge, and CSEA badge.
- Reordered brand hierarchy across all headers, footers, and cards to place **CCC (CSE Coding Club)** before **CSEA**.
- Enlarged and enhanced the floating animated Spider-Man hero mascot.
- Cleaned the Academic Track buttons to be bold and minimalist (`1ST YEAR` and `2ND YEAR`).
- Added interactive mascot click feature with smooth atmospheric glow and the motto **`RESPONSIBILITY EDUCATES`**.

#### Phase 5: Dual Script Endpoints & Roll Validation
- Implemented `isValidRollNumber(roll, year)` and `getRollNumberErrorMessage(roll, year)` enforcing:
  - 1st Year: Roll starts with **`26`**
  - 2nd Year: Roll starts with **`25`**
- Configured dedicated endpoints `VITE_GOOGLE_SCRIPT_URL_1ST` and `VITE_GOOGLE_SCRIPT_URL_2ND`.
- Created standalone Apps Script files for each sheet: [`google-apps-script-1st-year.js`](file:///d:/Project/Spin%20and%20Sprint/google-apps-script-1st-year.js) and [`google-apps-script-2nd-year.js`](file:///d:/Project/Spin%20and%20Sprint/google-apps-script-2nd-year.js).

#### Phase 6: Zero-Delay Instant Submission Optimization
- Decoupled network calls from UI navigation for instantaneous entry transitions.
- Added `AbortController` timeout guards to ensure the application remains responsive under any network conditions.

---

## 📁 Source Code Structure

```text
src/
├── assets/
│   └── mascot.jpg               # Spider-Man reference mascot
├── components/
│   ├── HeaderBranding.jsx       # Renaissance, CCC, CSEA logos & theme toggle
│   ├── QuestionCard.jsx         # Question details, 2-min lock bar, live stopwatch
│   ├── QuestionRenderer.jsx     # Dynamic renderer for Coding, Debugging, MCQ, etc.
│   ├── RegistrationForm.jsx     # Duo registration form with roll validation (26 / 25 prefix)
│   ├── RemainingCounter.jsx     # Sleek question pool counter & progress bar
│   ├── SolvedHistoryList.jsx    # Solved questions & solve durations list
│   ├── SoundControl.jsx         # Audio mute/unmute toggle
│   ├── SpiderBackground.jsx     # Canvas animated spider webs & particles
│   ├── SpideyMascot.jsx         # Floating hero mascot component ("RESPONSIBILITY EDUCATES")
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
│   └── googleSheets.js          # Central API client, dual routing & local cache registry
├── utils/
│   └── audio.js                 # Web Audio API sound synthesizer & FX
├── App.jsx                      # App root with theme & team routing
├── index.css                    # Tailwind tokens, glowing filters, and theme CSS
└── main.jsx                     # Vite entry point
```

---

## 🚀 Environment Configuration ([`.env`](file:///d:/Project/Spin%20and%20Sprint/.env))

```env
# Dedicated Web App URL for 1st Year Sheet (Rolls starting with 26)
VITE_GOOGLE_SCRIPT_URL_1ST=https://script.google.com/macros/s/AKfycbz_PuPb0io84zY4-8VZGbxg3OOL6dZiSZnPbPRUs61qXzmXNRrzvwSUz3Iejx_KohGh/exec

# Dedicated Web App URL for 2nd Year Sheet (Rolls starting with 25)
VITE_GOOGLE_SCRIPT_URL_2ND=https://script.google.com/macros/s/AKfycbzUkA3HWbs2y8P_88XVEbXOTjEB1widXozsjTFKOnONvNXjE1i1XIvzNbnkSat1PQY/exec
```

---

## 👥 Credits
- **Symposium:** Renaissance 2026
- **Department:** Department of Computer Science & Engineering
- **Organizers:** CSE Coding Club (CCC) & CSEA
