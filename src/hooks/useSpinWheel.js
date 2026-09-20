import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { getQuestionsForYear } from '../data/questions';
import { sound } from '../utils/audio';
import { normalizeYear, saveTeamSpinResult, saveTeamSolvingTime, getTeamSolvingHistory } from '../services/googleSheets';

const LOCK_DURATION_SECONDS = 120; // 2 minutes challenge lock

const getTeamStorageKey = (teamData) => {
  if (!teamData?.teamName) return 'default_team';
  const name = teamData.teamName.trim().toLowerCase().replace(/\s+/g, '_');
  const roll = (teamData.member1Roll || '').trim().toUpperCase().replace(/\s+/g, '');
  return `${name}_${roll}`;
};

export function useSpinWheel(teamData) {
  const currentYear = normalizeYear(teamData?.year);
  const questions = useMemo(() => getQuestionsForYear(currentYear), [currentYear]);
  const teamKey = useMemo(() => getTeamStorageKey(teamData), [teamData]);

  // 1. Initial used questions from localStorage
  const [usedQuestionIds, setUsedQuestionIds] = useState(() => {
    try {
      const saved = localStorage.getItem(`spidey_used_questions_${teamKey}`);
      const list = saved ? JSON.parse(saved) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  });

  // 2. Initial active spin state from localStorage
  const initialActiveSpin = useMemo(() => {
    try {
      const saved = localStorage.getItem(`spidey_active_spin_${teamKey}`);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed && parsed.selectedQuestion) {
        return parsed;
      }
    } catch (e) {}
    return null;
  }, [teamKey]);

  const [selectedQuestion, setSelectedQuestion] = useState(() => initialActiveSpin?.selectedQuestion || null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLocked, setIsLocked] = useState(() => Boolean(initialActiveSpin?.selectedQuestion));

  // Calculate remaining lock seconds on mount / refresh
  const [lockRemainingSeconds, setLockRemainingSeconds] = useState(() => {
    if (initialActiveSpin?.lockEndTime) {
      const remaining = Math.ceil((initialActiveSpin.lockEndTime - Date.now()) / 1000);
      return Math.max(0, remaining);
    }
    return 0;
  });

  const [rotation, setRotation] = useState(() => initialActiveSpin?.rotation || 0);
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(() => initialActiveSpin?.activeHighlightIndex ?? null);

  // Live Solving Stopwatch Counter & History
  const [elapsedSolvingSeconds, setElapsedSolvingSeconds] = useState(() => {
    if (initialActiveSpin?.questionStartTime) {
      const elapsed = Math.floor((Date.now() - initialActiveSpin.questionStartTime) / 1000);
      return Math.max(0, elapsed);
    }
    return 0;
  });

  const [solvingHistory, setSolvingHistory] = useState(() => {
    return getTeamSolvingHistory(teamData?.teamName);
  });

  const rotationRef = useRef(initialActiveSpin?.rotation || 0);
  const tickIntervalRef = useRef(null);
  const lockTimerRef = useRef(null);
  const lockEndTimeRef = useRef(initialActiveSpin?.lockEndTime || null);
  const questionStartTimeRef = useRef(initialActiveSpin?.questionStartTime || null);

  const totalSegments = questions.length; // 20 or 25
  const segmentAngle = 360 / totalSegments;

  // Available questions pool (strictly excludes used questions)
  const availableQuestions = questions.filter(
    (q) => !usedQuestionIds.includes(q.id)
  );

  // When teamKey changes, synchronize state with persistent storage
  useEffect(() => {
    try {
      const savedUsed = localStorage.getItem(`spidey_used_questions_${teamKey}`);
      const list = savedUsed ? JSON.parse(savedUsed) : [];
      setUsedQuestionIds(Array.isArray(list) ? list : []);

      const savedSpin = localStorage.getItem(`spidey_active_spin_${teamKey}`);
      if (savedSpin) {
        const parsed = JSON.parse(savedSpin);
        if (parsed?.selectedQuestion) {
          setSelectedQuestion(parsed.selectedQuestion);
          setIsLocked(true);
          setRotation(parsed.rotation || 0);
          rotationRef.current = parsed.rotation || 0;
          setActiveHighlightIndex(parsed.activeHighlightIndex ?? null);
          lockEndTimeRef.current = parsed.lockEndTime || null;
          questionStartTimeRef.current = parsed.questionStartTime || null;
          if (parsed.lockEndTime) {
            const rem = Math.max(0, Math.ceil((parsed.lockEndTime - Date.now()) / 1000));
            setLockRemainingSeconds(rem);
          } else {
            setLockRemainingSeconds(0);
          }
          if (parsed.questionStartTime) {
            const el = Math.max(0, Math.floor((Date.now() - parsed.questionStartTime) / 1000));
            setElapsedSolvingSeconds(el);
          } else {
            setElapsedSolvingSeconds(0);
          }
          return;
        }
      }

      // If no active spin for this team:
      setSelectedQuestion(null);
      setIsLocked(false);
      setLockRemainingSeconds(0);
      setActiveHighlightIndex(null);
      lockEndTimeRef.current = null;
      questionStartTimeRef.current = null;
      setElapsedSolvingSeconds(0);
    } catch (e) {
      console.error("Error synchronizing spin state:", e);
    }
  }, [teamKey]);

  // Sync solving history if team changes
  useEffect(() => {
    if (teamData?.teamName) {
      setSolvingHistory(getTeamSolvingHistory(teamData.teamName));
    }
  }, [teamData?.teamName]);

  // Live Solving Stopwatch Counter
  useEffect(() => {
    let solveTimer = null;
    if (selectedQuestion && isLocked) {
      solveTimer = setInterval(() => {
        if (questionStartTimeRef.current) {
          const elapsed = Math.max(0, Math.floor((Date.now() - questionStartTimeRef.current) / 1000));
          setElapsedSolvingSeconds(elapsed);
        }
      }, 1000);
    } else {
      setElapsedSolvingSeconds(0);
    }

    return () => {
      if (solveTimer) clearInterval(solveTimer);
    };
  }, [selectedQuestion, isLocked]);

  // 2-Minute Lock Countdown Timer
  useEffect(() => {
    if (lockRemainingSeconds > 0) {
      lockTimerRef.current = setInterval(() => {
        if (!lockEndTimeRef.current) return;
        const diff = Math.max(0, Math.ceil((lockEndTimeRef.current - Date.now()) / 1000));
        setLockRemainingSeconds(diff);
        if (diff <= 0) {
          clearInterval(lockTimerRef.current);
        }
      }, 1000);
    }

    return () => {
      if (lockTimerRef.current) clearInterval(lockTimerRef.current);
    };
  }, [lockRemainingSeconds > 0]);

  const formatSolveTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const spin = useCallback(() => {
    if (isSpinning || isLocked || availableQuestions.length === 0 || lockRemainingSeconds > 0) {
      return;
    }

    // 1. Pick a random question from available unused list
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const chosenQuestion = availableQuestions[randomIndex];

    // Find its index in the full wheel
    const targetSegmentIndex = questions.findIndex((q) => q.id === chosenQuestion.id);

    setIsSpinning(true);
    setActiveHighlightIndex(null);
    sound.playSpinSwoosh();

    // Mark as used IMMEDIATELY so it can NEVER be picked again, and save to localStorage
    setUsedQuestionIds((prev) => {
      const next = prev.includes(chosenQuestion.id) ? prev : [...prev, chosenQuestion.id];
      try {
        localStorage.setItem(`spidey_used_questions_${teamKey}`, JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    // 2. Exact Physics & Rotation Calculation:
    const segmentCenterAngle = targetSegmentIndex * segmentAngle + segmentAngle / 2;
    const targetStopAngle = (360 - segmentCenterAngle) % 360;

    // Current normalized angle
    const currentAngle = rotationRef.current % 360;
    let delta = (targetStopAngle - currentAngle) % 360;
    if (delta < 0) delta += 360;

    // 5 to 7 full revolutions for smooth deceleration
    const extraRotations = 360 * (5 + Math.floor(Math.random() * 2));
    const finalRotation = rotationRef.current + extraRotations + delta;

    rotationRef.current = finalRotation;
    setRotation(finalRotation);

    // Audio ticking simulation while spinning
    const spinDuration = 5500; // 5.5 seconds
    const startTime = Date.now();

    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);

    let lastTickAngle = currentAngle;
    const tickChecker = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentSimulatedAngle =
        rotationRef.current -
        (1 - easedProgress) * (finalRotation - (rotationRef.current - extraRotations - delta));

      if (Math.abs(currentSimulatedAngle - lastTickAngle) >= segmentAngle * 0.7) {
        sound.playTick();
        lastTickAngle = currentSimulatedAngle;
      }

      if (progress >= 1) {
        clearInterval(tickChecker);
      }
    }, 40);

    // 3. Wheel Landing & 2-Minute Lock Sequence
    setTimeout(() => {
      clearInterval(tickChecker);
      setIsSpinning(false);
      setIsLocked(true);
      setActiveHighlightIndex(targetSegmentIndex);
      setSelectedQuestion(chosenQuestion);

      const now = Date.now();
      const lockEnd = now + LOCK_DURATION_SECONDS * 1000;

      // Start solving stopwatch
      questionStartTimeRef.current = now;
      setElapsedSolvingSeconds(0);

      // Start 2-minute (120 seconds) lock countdown
      lockEndTimeRef.current = lockEnd;
      setLockRemainingSeconds(LOCK_DURATION_SECONDS);

      // Persist active spin state so refresh will NOT lose lock or question
      try {
        localStorage.setItem(
          `spidey_active_spin_${teamKey}`,
          JSON.stringify({
            selectedQuestion: chosenQuestion,
            isLocked: true,
            lockEndTime: lockEnd,
            questionStartTime: now,
            rotation: finalRotation,
            activeHighlightIndex: targetSegmentIndex,
          })
        );
      } catch (e) {
        console.error("Error persisting active spin:", e);
      }

      sound.playLock();
      setTimeout(() => {
        sound.playFanfare();
      }, 250);

      // Save initial spin record in Google Sheets in background
      if (teamData) {
        saveTeamSpinResult(teamData, chosenQuestion);
      }
    }, spinDuration);
  }, [isSpinning, isLocked, availableQuestions, teamData, segmentAngle, teamKey, lockRemainingSeconds, questions]);

  // Next Spin: calculate time taken to solve, log history, unlock wheel
  const nextSpin = useCallback(() => {
    // Only allow unlocking when 2-min timer has expired
    if (lockRemainingSeconds > 0) return;

    if (selectedQuestion) {
      const startTime = questionStartTimeRef.current || Date.now();
      const timeTakenSecs = Math.max(1, Math.round((Date.now() - startTime) / 1000));
      const timeTakenFmt = formatSolveTime(timeTakenSecs);

      // Save solve time to history & Google Sheets
      if (teamData) {
        saveTeamSolvingTime(teamData, selectedQuestion, timeTakenSecs, timeTakenFmt).then((newRecord) => {
          if (newRecord) {
            setSolvingHistory((prev) => [newRecord, ...prev]);
          }
        });
      }

      // Ensure usedQuestionIds has this question saved
      setUsedQuestionIds((prev) => {
        const next = prev.includes(selectedQuestion.id) ? prev : [...prev, selectedQuestion.id];
        try {
          localStorage.setItem(`spidey_used_questions_${teamKey}`, JSON.stringify(next));
        } catch (e) {}
        return next;
      });
    }

    // Clear active spin state from localStorage
    try {
      localStorage.removeItem(`spidey_active_spin_${teamKey}`);
    } catch (e) {}

    sound.playButtonClick();
    setSelectedQuestion(null);
    setIsLocked(false);
    setIsSpinning(false);
    setLockRemainingSeconds(0);
    setActiveHighlightIndex(null);
    questionStartTimeRef.current = null;
    lockEndTimeRef.current = null;
    setElapsedSolvingSeconds(0);
  }, [selectedQuestion, lockRemainingSeconds, teamData, teamKey]);

  return {
    questions,
    availableQuestions,
    usedQuestionIds,
    selectedQuestion,
    isSpinning,
    isLocked,
    lockRemainingSeconds,
    totalLockDuration: LOCK_DURATION_SECONDS,
    formattedLockTime: formatTime(lockRemainingSeconds),
    rotation,
    activeHighlightIndex,
    spin,
    nextSpin,
    elapsedSolvingSeconds,
    formattedElapsedSolvingTime: formatTime(elapsedSolvingSeconds),
    formattedSolveDuration: formatSolveTime(elapsedSolvingSeconds),
    solvingHistory,
    totalQuestions: questions.length,
    remainingCount: availableQuestions.length,
    isCompleted: availableQuestions.length === 0,
  };
}
