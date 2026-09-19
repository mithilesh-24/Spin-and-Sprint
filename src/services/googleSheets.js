// Google Sheets API Service & Local Participant Registry — Renaissance 2026

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';

// Local storage keys
const LOCAL_STORAGE_KEY_PARTICIPANTS = 'spidey_participants_registry';
const LOCAL_STORAGE_KEY_TEAMS = 'spidey_teams_history';
const LOCAL_STORAGE_KEY_SPINS = 'spidey_spin_logs';

// Default sample participants (empty for production)
const DEFAULT_PARTICIPANTS = [];

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

// Validate roll number format (e.g. 24CSR175, 25ITR012, 23ECR099)
export function isValidRollNumber(roll) {
  if (!roll) return false;
  const regex = /^[0-9]{2}[A-Za-z]{2,4}[0-9]{2,4}$/;
  return regex.test(roll.trim());
}

// Lookup existing participant by Roll Number (Primary) and Name (Secondary)
export async function lookupParticipant({ name, rollNumber, year = '2nd Year' }) {
  initLocalRegistry();
  const cleanRoll = normalizeRollNumber(rollNumber);
  const cleanName = normalizeName(name);

  let localList = [];
  try {
    localList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PARTICIPANTS) || '[]');
  } catch (e) {
    localList = DEFAULT_PARTICIPANTS;
  }

  // 1. Primary: Match by Roll Number
  if (cleanRoll) {
    const matchByRoll = localList.find(p => normalizeRollNumber(p.rollNumber) === cleanRoll);
    if (matchByRoll) {
      return { matchType: 'roll', participant: matchByRoll };
    }
  }

  // 2. Secondary: Match by Name
  if (cleanName && cleanName.length >= 2) {
    const matchByName = localList.find(p => normalizeName(p.name) === cleanName);
    if (matchByName) {
      return { matchType: 'name', participant: matchByName };
    }
  }

  // 3. Remote Google Sheets query if configured
  if (GOOGLE_SCRIPT_URL) {
    try {
      let queryParam = '';
      if (cleanRoll) queryParam = `roll=${encodeURIComponent(cleanRoll)}`;
      else if (cleanName) queryParam = `name=${encodeURIComponent(cleanName)}`;

      if (queryParam) {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=lookup&year=${encodeURIComponent(year)}&${queryParam}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.found && data.participant) {
            saveParticipantLocally(data.participant);
            return { matchType: cleanRoll ? 'roll' : 'name', participant: data.participant };
          }
        }
      }
    } catch (err) {
      console.warn("Google Sheet remote lookup error:", err);
    }
  }

  return null;
}

// Lookup participant by name
export async function lookupParticipantByName(name, year = '2nd Year') {
  const clean = normalizeName(name);
  if (!clean || clean.length < 2) return null;
  const res = await lookupParticipant({ name: clean, year });
  return res ? res.participant : null;
}

// Lookup participant by roll number
export async function lookupParticipantByRoll(roll, year = '2nd Year') {
  const clean = normalizeRollNumber(roll);
  if (!clean) return null;
  const res = await lookupParticipant({ rollNumber: clean, year });
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

// Lookup existing team by team name
export async function lookupTeamByName(searchTeamName, year = '2nd Year') {
  initLocalRegistry();
  const cleanSearch = normalizeName(searchTeamName);
  if (!cleanSearch || cleanSearch.length < 2) return null;

  let teams = [];
  try {
    teams = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TEAMS) || '[]');
  } catch (e) {
    teams = [];
  }

  const localTeam = teams.find(t => normalizeName(t.teamName) === cleanSearch);
  if (localTeam) return localTeam;

  return null;
}

// Check if team already participated (order-independent roll number match)
export async function checkTeamAlreadyParticipated(roll1, roll2, year = '2nd Year') {
  initLocalRegistry();
  const r1 = normalizeRollNumber(roll1);
  const r2 = normalizeRollNumber(roll2);

  if (!r1 || !r2) return false;

  let teams = [];
  try {
    teams = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TEAMS) || '[]');
  } catch (e) {
    teams = [];
  }

  const isDuplicateLocal = teams.some(t => {
    const tr1 = normalizeRollNumber(t.member1Roll);
    const tr2 = normalizeRollNumber(t.member2Roll);
    return (tr1 === r1 && tr2 === r2) || (tr1 === r2 && tr2 === r1);
  });

  if (isDuplicateLocal) return true;

  if (GOOGLE_SCRIPT_URL) {
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=checkTeam&year=${encodeURIComponent(year)}&roll1=${encodeURIComponent(r1)}&roll2=${encodeURIComponent(r2)}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.alreadyParticipated) return true;
      }
    } catch (e) {
      console.warn("Remote checkTeam failed:", e);
    }
  }

  return false;
}

// Register team initially to Google Sheet and local storage
export async function registerTeam(teamData) {
  initLocalRegistry();
  const year = teamData.year || '2nd Year';
  const entryTime = teamData.entryTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const record = {
    teamName: teamData.teamName.trim(),
    year: year,
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

    saveParticipantLocally({ name: record.member1Name, rollNumber: record.member1Roll, year });
    saveParticipantLocally({ name: record.member2Name, rollNumber: record.member2Roll, year });
  } catch (e) {
    console.error(e);
  }

  if (GOOGLE_SCRIPT_URL) {
    try {
      const payload = {
        action: 'register_team',
        year: record.year,
        teamName: record.teamName,
        member1Name: record.member1Name,
        member1Roll: record.member1Roll,
        member2Name: record.member2Name,
        member2Roll: record.member2Roll,
        entryTime: record.entryTime
      };

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn("Failed to sync registration to Google Sheet:", err);
    }
  }

  return record;
}

// Save complete team record and spin result to Google Sheet (Updates Main + Appends to Team Tab)
export async function saveTeamSpinResult(teamData, questionData) {
  initLocalRegistry();

  const now = new Date();
  const spinTimeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const year = teamData.year || '2nd Year';

  const record = {
    action: 'spin_result',
    teamName: teamData.teamName.trim(),
    year: year,
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

  // If Google Script URL exists, send to endpoint
  if (GOOGLE_SCRIPT_URL) {
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(record)
      });
    } catch (err) {
      console.warn("Failed to sync spin to Google Sheet:", err);
    }
  }

  return record;
}

// Save solve time taken for a question and sync to storage/Google Sheet
export async function saveTeamSolvingTime(teamData, questionData, timeTakenSeconds, timeTakenFormatted) {
  initLocalRegistry();
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
  if (GOOGLE_SCRIPT_URL) {
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'solve_time',
          year: teamData.year || '2nd Year',
          teamName: teamData.teamName,
          member1Roll: normalizeRollNumber(teamData.member1Roll),
          member2Roll: normalizeRollNumber(teamData.member2Roll),
          questionNumber: questionData.number,
          questionName: questionData.name,
          timeTaken: timeTakenFormatted,
          timeTakenSeconds: timeTakenSeconds
        })
      });
    } catch (err) {
      console.warn("Failed to sync solve time to Google Sheet:", err);
    }
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
