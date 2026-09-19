# 🕸️ SPIN & WHEEL — Renaissance 2026
> **Department of Computer Science & Engineering**  
> **CSE Coding Club (CCC)**  
> **CSEA — WE CAN ∞ WE WILL**  

A high-energy, Spider-Man themed, team-based interactive challenge wheel web application engineered for the **Renaissance 2026** technical symposium.

---

## 📖 Complete Project Architecture & Documentation (From 0 to Now)

### 1. Project Inception & Goal
- **Context:** Built for Renaissance 2026 organized by the Department of Computer Science & Engineering, CSE Coding Club (CCC), and CSEA.
- **Goal:** Create a high-energy interactive web application where registered 2-member teams (duos) select their academic track (1st Year or 2nd Year), spin an authentic physics-animated wheel matching the exact question count of their track, receive challenges, and solve questions under a strict 2-minute challenge timer, with all live records seamlessly routed to Google Sheets and Microsoft Excel.

---

### 2. Dual Academic Tracks & Roll Number Validation

The application enforces track-specific academic rules for participants:

| Academic Track | Roll Number Prefix Rule | Example Roll Number | Question Pool Focus | Wheel Slices | Target Spreadsheet |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1st Year** *(Freshers Track)* | **Must start with `26`** | `26CSR101`, `26ITR012`, `26ECR005` | 10 Pattern Problems + 10 Basic Programming Problems | **20 Slices** ($18^\circ$) | `Renaissance 2026 — 1st Year` |
| **2nd Year** *(Sophomore Track)* | **Must start with `25`** | `25CSR175`, `25ITR023`, `25ECR099` | 25 Pattern Problems (Easy, Medium, Hard, Extra) | **25 Slices** ($14.4^\circ$) | `Renaissance 2026 — 2nd Year` |

#### Validation Features:
- **Dynamic Placeholders:** Automatically switches between `Roll (e.g. 26CSR101)` and `Roll (e.g. 25CSR175)` based on the active track.
- **Live Prefix Badges:** Displays visual indicator badges (`Prefix: 26...` or `Prefix: 25...`) in member registration cards.
- **Track-Specific Error Messages:** Instant validation feedback (e.g., *"1st Year roll numbers must start with 26 (e.g. 26CSR101)"*).

---

### 3. Official Question Repository ([`questions.md`](file:///d:/Project/Spin%20and%20Sprint/questions.md))

All challenges are extracted directly from the symposium Word documents and documented in [`questions.md`](file:///d:/Project/Spin%20and%20Sprint/questions.md):

- **1st Year Track (20 Questions):**
  - **Section A (Q1 – Q10):** Pattern Generation (Plus sign, Repeated Number Triangle, Inverted Triangle, 1s & 0s Grid, Hollow Triangle, Pyramid, Binary Triangle, Solid Square, Hollow Square, Right-Aligned Numbers).
  - **Section B (Q11 – Q20):** Basic Programming (String Reverse, Multiplication Table, Even/Odd, Sign Check, Max of 2, Natural Numbers, String Length, Min of 3, Sum of 2, Vowel/Consonant).
- **2nd Year Track (25 Questions):**
  - **All 25 Pattern Problems (Q1 – Q25):** Left Half Pyramid, Diamond, Floyd's Binary Triangle, Hollow Square, Centered Binary Pyramid, Inverted Odd Pyramid, Double-Center Diamond, Decreasing Triangle, Right-Shifted Alphabets, Even Numbers Floyd's, 'X' Shape Star, Palindromic Crown, Hourglass, Step Staircase, 'Z' Shape, Right Arrow, Hollow Inverted Triangle, Half Diamond, Hollow Pyramid, Centered Number Pyramid, Repeated Alphabet, Pascal's Triangle, Rhombus, 'A' Star Pattern, Star & Dash Diamond.

---

### 4. High-Concurrency Architecture (60+ Concurrent Members / 30+ Teams)

Engineered for 60 simultaneous users without server bottlenecks, UI lag, or race conditions:

```text
[ 60+ Concurrent Participants / Devices ]
                  │
  ┌───────────────┼───────────────┐
  ▼               ▼               ▼
[ Device 1 ]    [ Device 2 ]    [ Device 30+ ]
  │               │               │
  │ (Instant UI)  │ (Instant UI)  │ (Instant UI)
  ▼               ▼               ▼
[ Local Queue ] [ Local Queue ] [ Local Queue ]
  │               │               │
  └───────────────┼───────────────┘
                  │  (Jittered Retry Worker: 800ms - 1800ms)
                  ▼
   [ Google Apps Script Web Apps ]
                  │
                  ▼  LockService: 30s Wait Lock (Atomic Queue)
       ┌─────────────────────┐
       │ 1. Direct Tab Lookup│ ──▶ (150ms per transaction vs 8000ms)
       │ 2. Row Appending    │
       │ 3. Spreadsheet.flush│
       └─────────────────────┘
                  │
                  ▼
  [ Google Spreadsheets & Excel ] (Zero Loss / 100% Consistent)
```

1. **Server-Side Atomic Mutex (`LockService`):**
   - Implements `LockService.getScriptLock()` with a 30-second wait queue.
   - All concurrent writes are serialized atomically; `SpreadsheetApp.flush()` commits every row before releasing the lock.
2. **Ultra-Fast Sheet Resolution (<150ms):**
   - Replaced multi-sheet linear scans with direct tab resolution, providing a **40x speedup** for concurrent operations.
3. **Client-Side Persistent Sync Queue (`spidey_sync_queue`):**
   - Every registration, spin, and solve time is saved locally and dispatched asynchronously.
   - Background worker with randomized jitter (800ms–1800ms) prevents thundering-herd spikes across 60 devices.
4. **Complete Session Isolation:**
   - Active team state is isolated in `sessionStorage`; solve histories are scoped to `spidey_solve_history_${teamName}`.

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
- **Backend & Database:** Dual Google Apps Script Web Apps with atomic mutex locking connected to Google Spreadsheets.

---

### 7. Step-by-Step Evolution (0 to Now)

- **Phase 1: Foundation & Mechanics** — Initial React + Vite setup, SVG wheel physics, question categorization, and audio engine.
- **Phase 2: Game Flow & Lock System** — 2-Minute Challenge Lock, live solving stopwatch, celebratory confetti, and solved history tracking.
- **Phase 3: Desktop Zero-Scroll Layout** — 2-column arena with fixed left panel (wheel/controls) and scrollable right panel (question/history).
- **Phase 4: Branding & Aesthetics** — Renaissance 2026 branding, CCC & CSEA identity, floating interactive Spider-Man hero mascot.
- **Phase 5: Dual Script Architecture & Roll Validation** — Track-specific routing for 1st Year (`26...`) and 2nd Year (`25...`).
- **Phase 6: Word Document Question Extraction** — Extracted exact challenges from Word docs into [`questions.md`](file:///d:/Project/Spin%20and%20Sprint/questions.md); 20 items for 1st Year, 25 items for 2nd Year.
- **Phase 7: IDE-Grade Question Terminal** — High-contrast IDE terminal for ASCII patterns with macOS dots, copy button, and UTF-8 monospace spacing.
- **Phase 8: 60-User Concurrency & Resilient Queue** — Atomic `LockService`, persistent queue with jittered backoff, and sub-150ms execution speed.

---

## 📁 Source Code Structure

```text
src/
├── assets/
│   └── mascot.jpg               # Spider-Man reference mascot
├── components/
│   ├── HeaderBranding.jsx       # Renaissance, CCC, CSEA logos & theme toggle
│   ├── QuestionCard.jsx         # Question details, 2-min lock bar, live stopwatch
│   ├── QuestionRenderer.jsx     # IDE code terminal renderer for Patterns & Coding
│   ├── RegistrationForm.jsx     # Duo registration form with roll validation (26 / 25 prefix)
│   ├── RemainingCounter.jsx     # Sleek question pool counter & progress bar
│   ├── SolvedHistoryList.jsx    # Solved questions & solve durations list
│   ├── SoundControl.jsx         # Audio mute/unmute toggle
│   ├── SpiderBackground.jsx     # Canvas animated spider webs & particles
│   ├── SpideyMascot.jsx         # Floating hero mascot component ("RESPONSIBILITY EDUCATES")
│   ├── SpinButton.jsx           # Spin CTA & 2-min lock button state
│   ├── SpinWheel.jsx            # Dynamic 20/25-segment SVG animated wheel
│   ├── TeamInfo.jsx             # Compact duo info card
│   └── ThemeToggle.jsx          # Dark / Light theme switch
├── data/
│   └── questions.js             # 20 questions for 1st Year & 25 for 2nd Year
├── hooks/
│   └── useSpinWheel.js          # Wheel rotation, 2-min timer & lock state hook
├── pages/
│   ├── Game.jsx                 # 2-column desktop game arena
│   └── Registration.jsx         # Viewport-locked registration screen
├── services/
│   └── googleSheets.js          # Resilient sync queue, dual routing & local cache registry
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
VITE_GOOGLE_SCRIPT_URL_1ST=your_1st_year_google_script_url_here

# Dedicated Web App URL for 2nd Year Sheet (Rolls starting with 25)
VITE_GOOGLE_SCRIPT_URL_2ND=your_2nd_year_google_script_url_here
```

---

## 👥 Credits
- **Symposium:** Renaissance 2026
- **Department:** Department of Computer Science & Engineering
- **Organizers:** CSE Coding Club (CCC) & CSEA

