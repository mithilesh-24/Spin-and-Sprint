import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { getQuestionsForYear } from '../data/questions';
import { sound } from '../utils/audio';
import { saveTeamSpinResult, saveTeamSolvingTime, getTeamSolvingHistory } from '../services/googleSheets';

const LOCK_DURATION_SECONDS = 120; // 2 minutes challenge lock

export function useSpinWheel(teamData) {
  const currentYear = teamData?.year || '2nd Year';
  const questions = useMemo(() => getQuestionsForYear(currentYear), [currentYear]);

  const [usedQuestionIds, setUsedQuestionIds] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockRemainingSeconds, setLockRemainingSeconds] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(null);

  // Live Solving Stopwatch Counter & History
  const [elapsedSolvingSeconds, setElapsedSolvingSeconds] = useState(0);
  const [solvingHistory, setSolvingHistory] = useState(() => {
    return getTeamSolvingHistory(teamData?.teamName);
  });

  const rotationRef = useRef(0);
  const tickIntervalRef = useRef(null);
  const lockTimerRef = useRef(null);
  const lockEndTimeRef = useRef(null);
  const questionStartTimeRef = useRef(null);

  const totalSegments = questions.length; // 20
  const segmentAngle = 360 / totalSegments; // 18 degrees

  // Available questions pool
  const availableQuestions = questions.filter(
    (q) => !usedQuestionIds.includes(q.id)
  );

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
    } else {
      if (lockTimerRef.current) clearInterval(lockTimerRef.current);
    }

    return () => {
      if (lockTimerRef.current) clearInterval(lockTimerRef.current);
    };
  }, [lockRemainingSeconds]);

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

    // Find its index in the full 20-segment wheel (0 to 19)
    const targetSegmentIndex = questions.findIndex((q) => q.id === chosenQuestion.id);

    setIsSpinning(true);
    setActiveHighlightIndex(null);
    sound.playSpinSwoosh();

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

      // Start solving stopwatch
      questionStartTimeRef.current = Date.now();
      setElapsedSolvingSeconds(0);

      // Start 2-minute (120 seconds) lock countdown
      lockEndTimeRef.current = Date.now() + LOCK_DURATION_SECONDS * 1000;
      setLockRemainingSeconds(LOCK_DURATION_SECONDS);

      sound.playLock();
      setTimeout(() => {
        sound.playFanfare();
      }, 250);

      // Save initial spin record in Google Sheets in background
      if (teamData) {
        saveTeamSpinResult(teamData, chosenQuestion);
      }
    }, spinDuration);
  }, [isSpinning, isLocked, availableQuestions, teamData, segmentAngle, totalSegments, lockRemainingSeconds, questions]);

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

      setUsedQuestionIds((prev) =>
        prev.includes(selectedQuestion.id) ? prev : [...prev, selectedQuestion.id]
      );
    }

    sound.playButtonClick();
    setSelectedQuestion(null);
    setIsLocked(false);
    setIsSpinning(false);
    setLockRemainingSeconds(0);
    setActiveHighlightIndex(null);
    questionStartTimeRef.current = null;
    setElapsedSolvingSeconds(0);
  }, [selectedQuestion, lockRemainingSeconds, teamData]);

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
