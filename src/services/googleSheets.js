// Google Sheets API Service & Local Participant Registry — Renaissance 2026

const GOOGLE_SCRIPT_URL_1ST = import.meta.env.VITE_GOOGLE_SCRIPT_URL_1ST || '';
const GOOGLE_SCRIPT_URL_2ND = import.meta.env.VITE_GOOGLE_SCRIPT_URL_2ND || '';
const GOOGLE_SCRIPT_URL_DEFAULT = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';

// Local storage keys
const LOCAL_STORAGE_KEY_PARTICIPANTS = 'spidey_participants_registry';
const LOCAL_STORAGE_KEY_TEAMS = 'spidey_teams_history';
const LOCAL_STORAGE_KEY_SPINS = 'spidey_spin_logs';
const LOCAL_STORAGE_KEY_QUEUE = 'spidey_sync_queue';

// Default sample participants (empty for production)
const DEFAULT_PARTICIPANTS = [];

let isProcessingQueue = false;

/**
 * Resilient Background Sync Queue Worker
 * Ensures zero data loss when multiple teams submit simultaneously or during network fluctuations.
 */
export async function processSyncQueue() {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_QUEUE);
    if (!raw) {
      isProcessingQueue = false;
      return;
    }
    const queue = JSON.parse(raw);
    if (!Array.isArray(queue) || queue.length === 0) {
      isProcessingQueue = false;
      return;
    }

    const item = queue[0];
    const scriptUrl = getGoogleScriptUrlForYear(item.payload?.year);

    if (!scriptUrl) {
      queue.shift();
      localStorage.setItem(LOCAL_STORAGE_KEY_QUEUE, JSON.stringify(queue));
      isProcessingQueue = false;
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    try {
      console.log(`[Sync Queue Dispatch -> ${item.payload?.year}]`, item.payload?.action, "Team:", item.payload?.teamName);
      await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        signal: controller.signal,
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(item.payload)
      });
      clearTimeout(timeoutId);

      // Successfully synced: Remove from queue
      queue.shift();
      localStorage.setItem(LOCAL_STORAGE_KEY_QUEUE, JSON.stringify(queue));
      console.log("[Sync Queue Success] Processed item:", item.payload?.action);
    } catch (err) {
      clearTimeout(timeoutId);
      item.attempts = (item.attempts || 0) + 1;
      if (item.attempts >= 6) {
        // Drop after 6 retries to prevent blocking other items
        queue.shift();
      }
      localStorage.setItem(LOCAL_STORAGE_KEY_QUEUE, JSON.stringify(queue));
      console.warn("[Sync Queue Retry Scheduled]", err?.name === 'AbortError' ? 'Timeout' : err);
    }
  } catch (e) {
    console.error("[Sync Queue Error]", e);
  } finally {
    isProcessingQueue = false;
    try {
      const remaining = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_QUEUE) || '[]');
      if (remaining.length > 0) {
        // Jittered backoff (800ms - 1800ms) to smoothly distribute server load across 60+ participants
        const nextDelay = 800 + Math.floor(Math.random() * 1000);
        setTimeout(processSyncQueue, nextDelay);
      }
    } catch (e) {}
  }
}

/**
 * Enqueue payload into persistent queue for guaranteed delivery
 */
function enqueueSync(payload) {
  try {
    const queue = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_QUEUE) || '[]');
    queue.push({
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      payload,
      attempts: 0,
      createdAt: Date.now()
    });
    localStorage.setItem(LOCAL_STORAGE_KEY_QUEUE, JSON.stringify(queue));
    // Immediately trigger processor
    setTimeout(processSyncQueue, 50);
  } catch (e) {
    console.error("Failed to enqueue sync item", e);
  }
}

// Auto-trigger sync queue on reconnect and periodically
if (typeof window !== 'undefined') {
  window.addEventListener('online', processSyncQueue);
  setInterval(processSyncQueue, 15000);
}

/**
 * Normalizes year string to strict canonical format: "1st Year" or "2nd Year"
 * Throws an error if year is missing or invalid.
 */
export function normalizeYear(year) {
  const value = String(year || "").trim().toLowerCase();

  if (
    value === "1st" ||
    value === "1st year" ||
    value === "first" ||
    value === "first year" ||
    value === "1"
  ) {
    return "1st Year";
  }

  if (
    value === "2nd" ||
    value === "2nd year" ||
    value === "second" ||
    value === "second year" ||
    value === "2"
  ) {
    return "2nd Year";
  }

  throw new Error(`Invalid or missing academic track year: "${year}"`);
}

/**
 * Returns the specific Google Apps Script URL for the given Academic Track Year.
 * Routes to VITE_GOOGLE_SCRIPT_URL_1ST for 1st Year, VITE_GOOGLE_SCRIPT_URL_2ND for 2nd Year,
 * and falls back to VITE_GOOGLE_SCRIPT_URL if the specific URL is not defined.
 */
export function getGoogleScriptUrlForYear(year) {
  try {
    const canonical = normalizeYear(year);
    if (canonical === '1st Year') {
      return GOOGLE_SCRIPT_URL_1ST || GOOGLE_SCRIPT_URL_DEFAULT || '';
    }
    if (canonical === '2nd Year') {
      return GOOGLE_SCRIPT_URL_2ND || GOOGLE_SCRIPT_URL_DEFAULT || '';
    }
  } catch (e) {
    // Fallback if year parameter is not yet selected
  }
  return GOOGLE_SCRIPT_URL_DEFAULT || GOOGLE_SCRIPT_URL_2ND || GOOGLE_SCRIPT_URL_1ST || '';
}

/**
 * Centralized GET caller for Google Apps Script Web App with AbortController timeout
 */
async function callGoogleScript(params, timeoutMs = 3500) {
  const scriptUrl = getGoogleScriptUrlForYear(params?.year);
  if (!scriptUrl) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = new URL(scriptUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });

    console.log(`[Google Sheets GET -> ${params?.year || 'Default'}]`, params, "Endpoint:", scriptUrl);
    const response = await fetch(url.toString(), {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[Google Sheets GET] Failed with status ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log("[Google Sheets GET Result]", data);
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn("[Google Sheets GET Notice / Timeout]", err?.name === 'AbortError' ? 'Fast timeout bypassed' : err);
    return null;
  }
}

/**
 * Centralized POST caller for Google Apps Script Web App
 * Automatically enqueues payloads to the persistent queue for reliable asynchronous processing.
 */
async function postToGoogleScript(payload) {
  enqueueSync(payload);
  return true;
}

export function clearAllLocalTeamsData() {
  try {
    sessionStorage.removeItem('spidey_active_team');
    localStorage.removeItem(LOCAL_STORAGE_KEY_PARTICIPANTS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_TEAMS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_SPINS);
    // Clear all team solve histories
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('spidey_solve_history_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (e) {
    console.error("Error clearing local teams data", e);
  }
}

export function initLocalRegistry() {
  if (!localStorage.getItem(LOCAL_STORAGE_KEY_PARTICIPANTS)) {
    localStorage.setItem(LOCAL_STORAGE_KEY_PARTICIPANTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEY_TEAMS)) {
    localStorage.setItem(LOCAL_STORAGE_KEY_TEAMS, JSON.stringify([]));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEY_SPINS)) {
    localStorage.setItem(LOCAL_STORAGE_KEY_SPINS, JSON.stringify([]));
  }
}

// Normalize strings for comparison (trim, lowercase, collapse multiple spaces)
export function normalizeName(name) {
  if (!name) return '';
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

// Normalize roll number
export function normalizeRollNumber(roll) {
  if (!roll) return '';
  return roll.trim().toUpperCase().replace(/\s+/g, '');
}

/**
 * Validate roll number format based on Academic Track:
 * - 1st Year: MUST start with '26' (e.g. 26CSR101, 26ITR012)
 * - 2nd Year: MUST start with '25' (e.g. 25CSR175, 25ITR023)
 * - If year is not specified: checks general standard pattern /^[0-9]{2}[A-Za-z]{2,4}[0-9]{1,4}$/
 */
export function isValidRollNumber(roll, year) {
  if (!roll) return false;
  const clean = roll.trim().toUpperCase();

  if (!year) {
    const genericRegex = /^[0-9]{2}[A-Za-z]{2,4}[0-9]{1,4}$/;
    return genericRegex.test(clean);
  }

  try {
    const canonicalYear = normalizeYear(year);
    if (canonicalYear === "1st Year") {
      const firstYearRegex = /^26[A-Za-z]{2,4}[0-9]{1,4}$/;
      return firstYearRegex.test(clean);
    }
    if (canonicalYear === "2nd Year") {
      const secondYearRegex = /^25[A-Za-z]{2,4}[0-9]{1,4}$/;
      return secondYearRegex.test(clean);
    }
  } catch (e) {
    const genericRegex = /^[0-9]{2}[A-Za-z]{2,4}[0-9]{1,4}$/;
    return genericRegex.test(clean);
  }

  return false;
}

/**
 * Returns human-friendly error messages specific to academic track rules
 */
export function getRollNumberErrorMessage(roll, year) {
  if (!roll || !roll.trim()) {
    return 'Roll Number is required.';
  }
  const clean = roll.trim().toUpperCase();
  let canonicalYear = null;
  try {
    canonicalYear = normalizeYear(year);
  } catch (e) {
    canonicalYear = null;
  }

  if (canonicalYear === "1st Year") {
    if (!clean.startsWith("26")) {
      return '1st Year roll numbers must start with 26 (e.g. 26CSR101)';
    }
    if (!isValidRollNumber(clean, "1st Year")) {
      return 'Invalid 1st Year format (e.g. 26CSR101)';
    }
  } else if (canonicalYear === "2nd Year") {
    if (!clean.startsWith("25")) {
      return '2nd Year roll numbers must start with 25 (e.g. 25CSR175)';
    }
    if (!isValidRollNumber(clean, "2nd Year")) {
      return 'Invalid 2nd Year format (e.g. 25CSR175)';
    }
  } else {
    if (!isValidRollNumber(clean)) {
      return 'Invalid roll number format (e.g. 25CSR175 or 26CSR101)';
    }
  }

  return null;
}

// Lookup existing participant by Roll Number (Primary) and Name (Secondary)
export async function lookupParticipant({ name, rollNumber, year }) {
  initLocalRegistry();
  const canonicalYear = normalizeYear(year);
  const cleanRoll = normalizeRollNumber(rollNumber);
  const cleanName = normalizeName(name);

  let localList = [];
  try {
    localList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PARTICIPANTS) || '[]');
  } catch (e) {
    localList = DEFAULT_PARTICIPANTS;
  }

  // 1. Primary: Match by Roll Number and matching Year
  if (cleanRoll) {
    const matchByRoll = localList.find(p => 
      normalizeRollNumber(p.rollNumber) === cleanRoll && 
      (!p.year || normalizeYear(p.year) === canonicalYear)
    );
    if (matchByRoll) {
      return { matchType: 'roll', participant: matchByRoll };
    }
  }

  // 2. Secondary: Match by Name and matching Year
  if (cleanName && cleanName.length >= 2) {
    const matchByName = localList.find(p => 
      normalizeName(p.name) === cleanName && 
      (!p.year || normalizeYear(p.year) === canonicalYear)
    );
    if (matchByName) {
      return { matchType: 'name', participant: matchByName };
    }
  }

  // 3. Remote Google Sheets query with explicit Year
  if (getGoogleScriptUrlForYear(canonicalYear)) {
    const params = {
      action: 'lookup',
      year: canonicalYear
    };
    if (cleanRoll) params.roll = cleanRoll;
    else if (cleanName) params.name = cleanName;

    if (params.roll || params.name) {
      const data = await callGoogleScript(params);
      if (data && data.found && data.participant) {
        saveParticipantLocally({ ...data.participant, year: canonicalYear });
        return { matchType: cleanRoll ? 'roll' : 'name', participant: data.participant };
      }
    }
  }

  return null;
}

// Lookup participant by name with required year
export async function lookupParticipantByName(name, year) {
  const clean = normalizeName(name);
  if (!clean || clean.length < 2) return null;
  const canonicalYear = normalizeYear(year);
  const res = await lookupParticipant({ name: clean, year: canonicalYear });
  return res ? res.participant : null;
}

// Lookup participant by roll number with required year
export async function lookupParticipantByRoll(roll, year) {
  const clean = normalizeRollNumber(roll);
  if (!clean) return null;
  const canonicalYear = normalizeYear(year);
  const res = await lookupParticipant({ rollNumber: clean, year: canonicalYear });
  return res ? res.participant : null;
}

// Save participant to local cache
export function saveParticipantLocally(participant) {
  initLocalRegistry();
  try {
    const list = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PARTICIPANTS) || '[]');
    const cleanRoll = normalizeRollNumber(participant.rollNumber);
    const existingIndex = list.findIndex(p => normalizeRollNumber(p.rollNumber) === cleanRoll);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...participant };
    } else {
      list.push(participant);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY_PARTICIPANTS, JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
}

// Lookup existing team by team name and year
export async function lookupTeamByName(searchTeamName, year) {
  initLocalRegistry();
  const cleanSearch = normalizeName(searchTeamName);
  if (!cleanSearch || cleanSearch.length < 2) return null;
  const canonicalYear = normalizeYear(year);

  let teams = [];
  try {
    teams = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TEAMS) || '[]');
  } catch (e) {
    teams = [];
  }

  const localTeam = teams.find(t => 
    normalizeName(t.teamName) === cleanSearch && 
    (!t.year || normalizeYear(t.year) === canonicalYear)
  );
  if (localTeam) return localTeam;

  return null;
}

// Check if team already participated (order-independent roll number match) with required year
export async function checkTeamAlreadyParticipated(roll1, roll2, year) {
  initLocalRegistry();
  const r1 = normalizeRollNumber(roll1);
  const r2 = normalizeRollNumber(roll2);
  const canonicalYear = normalizeYear(year);

  if (!r1 || !r2) return false;

  let teams = [];
  try {
    teams = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TEAMS) || '[]');
  } catch (e) {
    teams = [];
  }

  const isDuplicateLocal = teams.some(t => {
    if (t.year && normalizeYear(t.year) !== canonicalYear) return false;
    const tr1 = normalizeRollNumber(t.member1Roll);
    const tr2 = normalizeRollNumber(t.member2Roll);
    return (tr1 === r1 && tr2 === r2) || (tr1 === r2 && tr2 === r1);
  });

  if (isDuplicateLocal) return true;

  if (getGoogleScriptUrlForYear(canonicalYear)) {
    try {
      const data = await callGoogleScript({
        action: 'checkTeam',
        year: canonicalYear,
        roll1: r1,
        roll2: r2
      }, 800);
      if (data && data.alreadyParticipated) return true;
    } catch (e) {
      console.warn("Remote check passed through:", e);
    }
  }

  return false;
}

// Register team initially to Google Sheet and local storage
export async function registerTeam(teamData) {
  initLocalRegistry();
  const canonicalYear = normalizeYear(teamData?.year);
  const entryTime = teamData.entryTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const record = {
    teamName: teamData.teamName.trim(),
    year: canonicalYear,
    member1Name: teamData.member1Name.trim(),
    member1Roll: normalizeRollNumber(teamData.member1Roll),
    member2Name: teamData.member2Name.trim(),
    member2Roll: normalizeRollNumber(teamData.member2Roll),
    entryTime: entryTime,
    questionCount: 0,
    timestamp: new Date().toISOString()
  };

  try {
    const teams = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TEAMS) || '[]');
    const r1 = record.member1Roll;
    const r2 = record.member2Roll;
    const existingIdx = teams.findIndex(t => {
      const tr1 = normalizeRollNumber(t.member1Roll);
      const tr2 = normalizeRollNumber(t.member2Roll);
      return (tr1 === r1 && tr2 === r2) || (tr1 === r2 && tr2 === r1);
    });

    if (existingIdx === -1) {
      teams.push(record);
      localStorage.setItem(LOCAL_STORAGE_KEY_TEAMS, JSON.stringify(teams));
    }

    saveParticipantLocally({ name: record.member1Name, rollNumber: record.member1Roll, year: canonicalYear });
    saveParticipantLocally({ name: record.member2Name, rollNumber: record.member2Roll, year: canonicalYear });
  } catch (e) {
    console.error(e);
  }

  if (getGoogleScriptUrlForYear(record.year)) {
    await postToGoogleScript({
      action: 'register_team',
      year: record.year,
      teamName: record.teamName,
      member1Name: record.member1Name,
      member1Roll: record.member1Roll,
      member2Name: record.member2Name,
      member2Roll: record.member2Roll,
      entryTime: record.entryTime
    });
  }

  return record;
}

// Save complete team record and spin result to Google Sheet (Updates Main + Appends to Team Tab)
export async function saveTeamSpinResult(teamData, questionData) {
  initLocalRegistry();

  const now = new Date();
  const spinTimeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const canonicalYear = normalizeYear(teamData?.year);

  const record = {
    action: 'spin_result',
    teamName: teamData.teamName.trim(),
    year: canonicalYear,
    member1Name: teamData.member1Name.trim(),
    member1Roll: normalizeRollNumber(teamData.member1Roll),
    member2Name: teamData.member2Name.trim(),
    member2Roll: normalizeRollNumber(teamData.member2Roll),
    entryTime: teamData.entryTime || now.toLocaleTimeString(),
    questionNumber: questionData.number,
    questionName: questionData.name,
    questionPattern: questionData.pattern,
    difficulty: questionData.difficulty || 'Medium',
    spinTime: spinTimeString,
    timestamp: now.toISOString()
  };

  // Save spin to local spin history
  try {
    const spins = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SPINS) || '[]');
    spins.push(record);
    localStorage.setItem(LOCAL_STORAGE_KEY_SPINS, JSON.stringify(spins));
  } catch (e) {
    console.error("Local save spin error", e);
  }

  // Send to Google Apps Script endpoint
  if (getGoogleScriptUrlForYear(record.year)) {
    await postToGoogleScript(record);
  }

  return record;
}

// Save solve time taken for a question and sync to storage/Google Sheet
export async function saveTeamSolvingTime(teamData, questionData, timeTakenSeconds, timeTakenFormatted) {
  initLocalRegistry();
  const canonicalYear = normalizeYear(teamData?.year);
  const storageKey = `spidey_solve_history_${normalizeName(teamData.teamName)}`;
  const record = {
    teamName: teamData.teamName,
    questionNumber: questionData.number,
    questionName: questionData.name,
    pattern: questionData.pattern,
    difficulty: questionData.difficulty,
    timeTakenSeconds: timeTakenSeconds,
    timeTakenFormatted: timeTakenFormatted,
    solvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };

  try {
    const history = JSON.parse(localStorage.getItem(storageKey) || '[]');
    history.unshift(record);
    localStorage.setItem(storageKey, JSON.stringify(history));
  } catch (e) {
    console.error(e);
  }

  // Update in Google Sheet if configured
  if (getGoogleScriptUrlForYear(canonicalYear)) {
    await postToGoogleScript({
      action: 'solve_time',
      year: canonicalYear,
      teamName: teamData.teamName,
      member1Roll: normalizeRollNumber(teamData.member1Roll),
      member2Roll: normalizeRollNumber(teamData.member2Roll),
      questionNumber: questionData.number,
      questionName: questionData.name,
      timeTaken: timeTakenFormatted,
      timeTakenSeconds: timeTakenSeconds
    });
  }

  return record;
}

// Get solving history for active team
export function getTeamSolvingHistory(teamName) {
  if (!teamName) return [];
  initLocalRegistry();
  try {
    const storageKey = `spidey_solve_history_${normalizeName(teamName)}`;
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  } catch (e) {
    return [];
  }
}
