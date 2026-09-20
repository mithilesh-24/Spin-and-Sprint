import React, { useState, useEffect } from 'react';
import {
  Users,
  User,
  Shield,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import {
  lookupParticipantByName,
  lookupTeamByName,
  isValidRollNumber,
  getRollNumberErrorMessage,
  normalizeRollNumber,
  checkTeamAlreadyParticipated,
  registerTeam,
  normalizeYear,
} from '../services/googleSheets';
import { sound } from '../utils/audio';

export default function RegistrationForm({ onRegisterSuccess, theme = 'dark' }) {
  const isLight = theme === 'light';
  const [year, setYear] = useState('1st Year'); // '1st Year' or '2nd Year'
  const [teamName, setTeamName] = useState('');
  const [member1Name, setMember1Name] = useState('');
  const [member1Roll, setMember1Roll] = useState('');
  const [member2Name, setMember2Name] = useState('');
  const [member2Roll, setMember2Roll] = useState('');

  // Lookup match states for Team, Member 1 & 2
  const [matchTeam, setMatchTeam] = useState(null);
  const [matchMember1, setMatchMember1] = useState(null);
  const [matchMember2, setMatchMember2] = useState(null);

  // Errors & Warnings
  const [errors, setErrors] = useState({});
  const [duplicateTeamPrompt, setDuplicateTeamPrompt] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  // Clear roll errors if track changes
  const handleYearChange = (newYear) => {
    setYear(newYear);
    setErrors(prev => ({
      ...prev,
      member1Roll: null,
      member2Roll: null
    }));
    sound.playButtonClick();
  };

  // Debounced lookup for Team Name
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (teamName.trim().length >= 2) {
        const foundTeam = await lookupTeamByName(teamName, year);
        if (foundTeam) {
          if (
            !member1Name ||
            !member2Name ||
            normalizeRollNumber(member1Roll) !== normalizeRollNumber(foundTeam.member1Roll)
          ) {
            setMatchTeam(foundTeam);
          } else {
            setMatchTeam(null);
          }
        } else {
          setMatchTeam(null);
        }
      } else {
        setMatchTeam(null);
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [teamName, member1Name, member1Roll, member2Name, year]);

  // Debounced lookup for Member 1
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (member1Name.trim().length >= 2) {
        const found = await lookupParticipantByName(member1Name, year);
        if (found) {
          if (!member1Roll || normalizeRollNumber(member1Roll) !== normalizeRollNumber(found.rollNumber)) {
            setMatchMember1(found);
          } else {
            setMatchMember1(null);
          }
        } else {
          setMatchMember1(null);
        }
      } else {
        setMatchMember1(null);
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [member1Name, member1Roll, year]);

  // Debounced lookup for Member 2
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (member2Name.trim().length >= 2) {
        const found = await lookupParticipantByName(member2Name, year);
        if (found) {
          if (!member2Roll || normalizeRollNumber(member2Roll) !== normalizeRollNumber(found.rollNumber)) {
            setMatchMember2(found);
          } else {
            setMatchMember2(null);
          }
        } else {
          setMatchMember2(null);
        }
      } else {
        setMatchMember2(null);
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [member2Name, member2Roll, year]);

  const handleUseExistingTeam = () => {
    if (matchTeam) {
      setTeamName(matchTeam.teamName);
      if (matchTeam.year) setYear(matchTeam.year);
      setMember1Name(matchTeam.member1Name);
      setMember1Roll(matchTeam.member1Roll);
      setMember2Name(matchTeam.member2Name);
      setMember2Roll(matchTeam.member2Roll);
      setMatchTeam(null);
      setErrors({});
      setDuplicateTeamPrompt(null);
      sound.playButtonClick();
    }
  };

  const handleUseExistingMember1 = () => {
    if (matchMember1) {
      setMember1Roll(matchMember1.rollNumber);
      setMatchMember1(null);
      sound.playButtonClick();
    }
  };

  const handleUseExistingMember2 = () => {
    if (matchMember2) {
      setMember2Roll(matchMember2.rollNumber);
      setMatchMember2(null);
      sound.playButtonClick();
    }
  };

  const validate = () => {
    const errs = {};
    setDuplicateTeamPrompt(null);

    if (!teamName.trim()) {
      errs.teamName = 'Team Name is required.';
    }

    if (!member1Name.trim()) {
      errs.member1Name = 'Member 1 Name is required.';
    }

    const m1Error = getRollNumberErrorMessage(member1Roll, year);
    if (m1Error) {
      errs.member1Roll = m1Error;
    }

    if (!member2Name.trim()) {
      errs.member2Name = 'Member 2 Name is required.';
    }

    const m2Error = getRollNumberErrorMessage(member2Roll, year);
    if (m2Error) {
      errs.member2Roll = m2Error;
    }

    if (
      member1Roll.trim() &&
      member2Roll.trim() &&
      normalizeRollNumber(member1Roll) === normalizeRollNumber(member2Roll)
    ) {
      errs.member2Roll = 'Team members must have different roll numbers.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const proceedWithTeam = () => {
    const canonicalYear = normalizeYear(year);
    const teamPayload = {
      teamName: teamName.trim(),
      year: canonicalYear,
      member1Name: member1Name.trim(),
      member1Roll: normalizeRollNumber(member1Roll),
      member2Name: member2Name.trim(),
      member2Roll: normalizeRollNumber(member2Roll),
      entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    // Asynchronously save to Google Sheets & local cache without stalling the UI transition
    registerTeam(teamPayload).catch(regErr => {
      console.warn("Background registration sync note:", regErr);
    });

    // Immediate transition to the wheel game page
    onRegisterSuccess(teamPayload);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    sound.playButtonClick();

    if (!validate()) return;

    setIsChecking(true);

    try {
      const isDuplicate = await checkTeamAlreadyParticipated(member1Roll, member2Roll, year);
      if (isDuplicate) {
        setDuplicateTeamPrompt({
          teamName: teamName.trim(),
          year: year,
          member1Name: member1Name.trim(),
          member1Roll: normalizeRollNumber(member1Roll),
          member2Name: member2Name.trim(),
          member2Roll: normalizeRollNumber(member2Roll)
        });
        setIsChecking(false);
        return;
      }

      proceedWithTeam();
    } catch (err) {
      console.warn("Duplicate check bypassed:", err);
      proceedWithTeam();
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className={`w-full max-w-lg mx-auto p-1 rounded-2xl transition-all duration-300 ${
      isLight
        ? 'bg-gradient-to-b from-red-500 via-rose-300 to-cyan-500 shadow-[0_12px_35px_rgba(226,54,54,0.12)]'
        : 'bg-gradient-to-b from-red-600 via-rose-900 to-[#0c1328] shadow-spider-glow'
    }`}>
      <div className={`rounded-[14px] p-4 sm:p-5 md:p-6 border relative transition-colors ${
        isLight
          ? 'bg-white border-red-500/40 text-slate-900 shadow-xl'
          : 'bg-[#090e1f] border-red-500/40 text-white backdrop-blur-md'
      }`}>
        {/* Header Ribbon */}
        <div className="text-center mb-3.5">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono text-[11px] font-bold uppercase tracking-widest mb-1.5 shadow-sm ${
            isLight ? 'bg-red-50 border-red-300 text-red-700' : 'bg-red-600/25 border-red-500/50 text-red-300'
          }`}>
            <Users className="w-3.5 h-3.5" /> Team Registration Form
          </div>
          <h2 className={`comic-font text-3xl sm:text-4xl tracking-wide uppercase leading-tight ${
            isLight ? 'text-red-600 font-black' : 'text-white spidey-glow-red'
          }`}>
            Assemble Your Duo
          </h2>
        </div>

        {/* Global Existing Team Resolution Alert */}
        {duplicateTeamPrompt && (
          <div className="mb-3.5 p-3 bg-gradient-to-r from-amber-500/20 to-red-500/20 border-2 border-yellow-500 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs shadow-md animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <div>
                <div className={`font-bold text-xs ${isLight ? 'text-amber-900' : 'text-yellow-300'}`}>Existing Team Found</div>
                <p className={`text-[11px] ${isLight ? 'text-slate-700' : 'text-gray-200'}`}>
                  Team <span className="font-bold underline">{duplicateTeamPrompt.teamName}</span> already registered.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
              <button
                type="button"
                onClick={proceedWithTeam}
                className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white font-black text-xs rounded-lg uppercase tracking-wider transition-all shadow"
              >
                USE THIS TEAM &rarr;
              </button>
              <button
                type="button"
                onClick={() => setDuplicateTeamPrompt(null)}
                className={`px-2.5 py-1.5 text-xs rounded-lg uppercase font-bold border ${
                  isLight ? 'bg-slate-200 text-slate-700 border-slate-300' : 'bg-zinc-800 text-gray-300 border-zinc-700'
                }`}
              >
                EDIT
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
          {/* 1st Year vs 2nd Year Track Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isLight ? 'text-slate-700' : 'text-gray-300'
              }`}>
                <GraduationCap className="w-4 h-4 text-cyan-500" /> Academic Track <span className="text-red-500">*</span>
              </span>
              <span className="text-[10px] sm:text-xs text-yellow-500 font-mono font-bold uppercase">
                {year === '1st Year' ? '🎯 1st Year Wheel' : '⚡ 2nd Year Wheel'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {/* 1st Year Option */}
              <button
                type="button"
                onClick={() => handleYearChange('1st Year')}
                className={`py-2.5 sm:py-3 px-3.5 rounded-xl border-2 text-left transition-all relative flex items-center justify-between shadow-sm cursor-pointer ${
                  year === '1st Year'
                    ? isLight
                      ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-400/50 shadow-md'
                      : 'bg-amber-950/80 border-amber-400 shadow-spider-gold ring-2 ring-yellow-400/40'
                    : isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 opacity-75'
                      : 'bg-[#0c142c]/70 border-zinc-800 text-gray-400 hover:border-zinc-700 opacity-75'
                }`}
              >
                <div className={`text-sm sm:text-base font-black uppercase comic-font tracking-wide ${
                  year === '1st Year' ? (isLight ? 'text-amber-900' : 'text-yellow-300') : (isLight ? 'text-slate-700' : 'text-gray-300')
                }`}>
                  1st Year
                </div>
                {year === '1st Year' && (
                  <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 ${isLight ? 'text-amber-600' : 'text-yellow-400'}`} />
                )}
              </button>

              {/* 2nd Year Option */}
              <button
                type="button"
                onClick={() => handleYearChange('2nd Year')}
                className={`py-2.5 sm:py-3 px-3.5 rounded-xl border-2 text-left transition-all relative flex items-center justify-between shadow-sm cursor-pointer ${
                  year === '2nd Year'
                    ? isLight
                      ? 'bg-cyan-50/90 border-cyan-500 ring-2 ring-cyan-400/50 shadow-md'
                      : 'bg-blue-950/80 border-cyan-400 shadow-spider-blue ring-2 ring-cyan-400/40'
                    : isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 opacity-75'
                      : 'bg-[#0c142c]/70 border-zinc-800 text-gray-400 hover:border-zinc-700 opacity-75'
                }`}
              >
                <div className={`text-sm sm:text-base font-black uppercase comic-font tracking-wide ${
                  year === '2nd Year' ? (isLight ? 'text-cyan-900' : 'text-cyan-300') : (isLight ? 'text-slate-700' : 'text-gray-300')
                }`}>
                  2nd Year
                </div>
                {year === '2nd Year' && (
                  <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
                )}
              </button>
            </div>
          </div>

          {/* Team Name */}
          <div>
            <label className={`block text-xs font-mono font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${
              isLight ? 'text-slate-700' : 'text-gray-300'
            }`}>
              <Shield className="w-3.5 h-3.5 text-amber-500" /> Team Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={teamName}
                onChange={(e) => {
                  setTeamName(e.target.value);
                  if (errors.teamName) setErrors({ ...errors, teamName: null });
                }}
                placeholder="Enter Team Name (e.g. Code Warriors)"
                className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 rounded-xl text-sm sm:text-base font-medium transition-all duration-200 focus:outline-none ${
                  isLight
                    ? errors.teamName
                      ? 'border-red-500 bg-red-50/70 text-slate-900'
                      : 'bg-slate-50/60 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                    : errors.teamName
                      ? 'border-red-500 bg-red-950/30 text-white'
                      : 'bg-[#070d1e] border-slate-700/80 text-white placeholder-gray-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                }`}
              />
            </div>
            {errors.teamName && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1.5 font-mono font-bold">
                <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.teamName}
              </p>
            )}

            {/* Existing Team Suggestion */}
            {matchTeam && (
              <div className={`mt-2 p-2.5 border rounded-xl text-xs sm:text-sm flex items-center justify-between gap-2 shadow-sm ${
                isLight ? 'bg-cyan-50 border-cyan-400 text-slate-900' : 'bg-blue-950/90 border-cyan-400 text-white'
              }`}>
                <div className="text-xs">
                  <span className="font-semibold text-slate-500 dark:text-slate-300">Existing Team: </span>
                  <span className="underline font-black text-cyan-600 dark:text-cyan-300">{matchTeam.teamName}</span>
                </div>
                <button
                  type="button"
                  onClick={handleUseExistingTeam}
                  className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-lg uppercase tracking-wider shadow-sm transition-all"
                >
                  USE
                </button>
              </div>
            )}
          </div>

          {/* Member 1 Card */}
          <div className={`p-3 sm:p-3.5 border-2 rounded-xl space-y-2 relative transition-all ${
            isLight ? 'bg-cyan-50/50 border-cyan-200/90' : 'bg-[#0d1633]/70 border-cyan-500/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 ${
                isLight ? 'text-cyan-800' : 'text-cyan-400'
              }`}>
                <User className="w-3.5 h-3.5" /> Member 1 (Lead)
              </span>
              {year === '2nd Year' && (
                <span className={`text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${
                  isLight ? 'bg-cyan-100 border-cyan-300 text-cyan-900' : 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
                }`}>
                  Prefix: 25...
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
              <div>
                <input
                  type="text"
                  value={member1Name}
                  onChange={(e) => {
                    setMember1Name(e.target.value);
                    if (errors.member1Name) setErrors({ ...errors, member1Name: null });
                  }}
                  placeholder="Full Name"
                  className={`w-full px-3.5 py-2 sm:py-2.5 border-2 rounded-lg text-sm font-medium transition-all focus:outline-none ${
                    isLight
                      ? errors.member1Name
                        ? 'border-red-500 bg-red-50 text-slate-900'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                      : errors.member1Name
                        ? 'border-red-500 bg-red-950/20 text-white'
                        : 'bg-[#080d1f] border-zinc-700 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                  }`}
                />
                {errors.member1Name && (
                  <p className="text-[11px] text-red-500 mt-1 font-mono font-bold flex items-center gap-1">
                    <AlertCircle className="w-2.5 h-2.5" /> {errors.member1Name}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  value={member1Roll}
                  onChange={(e) => {
                    setMember1Roll(e.target.value.toUpperCase());
                    if (errors.member1Roll) setErrors({ ...errors, member1Roll: null });
                  }}
                  placeholder={year === '1st Year' ? 'Roll No' : 'Roll No (25...)'}
                  className={`w-full px-3.5 py-2 sm:py-2.5 border-2 rounded-lg text-sm uppercase font-mono font-semibold transition-all focus:outline-none ${
                    isLight
                      ? errors.member1Roll
                        ? 'border-red-500 bg-red-50 text-slate-900'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                      : errors.member1Roll
                        ? 'border-red-500 bg-red-950/30 text-white'
                        : 'bg-[#080d1f] border-zinc-700 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                  }`}
                />
                {errors.member1Roll && (
                  <p className="text-[11px] text-red-500 mt-1 font-mono font-bold flex items-center gap-1">
                    <AlertCircle className="w-2.5 h-2.5" /> {errors.member1Roll}
                  </p>
                )}
              </div>
            </div>

            {/* Existing Name Match Alert for Member 1 */}
            {matchMember1 && (
              <div className={`mt-2 p-2 border rounded-lg text-xs flex items-center justify-between gap-2 ${
                isLight ? 'bg-amber-50 border-amber-400 text-slate-900' : 'bg-amber-950/90 border-yellow-400 text-white'
              }`}>
                <div className="truncate">
                  <span className="opacity-75">Existing: </span>
                  <strong>{matchMember1.name}</strong> ({matchMember1.rollNumber})
                </div>
                <button
                  type="button"
                  onClick={handleUseExistingMember1}
                  className="px-2.5 py-1 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded uppercase text-[10px] flex-shrink-0 transition-colors"
                >
                  USE {matchMember1.rollNumber}
                </button>
              </div>
            )}
          </div>

          {/* Member 2 Card */}
          <div className={`p-3 sm:p-3.5 border-2 rounded-xl space-y-2 relative transition-all ${
            isLight ? 'bg-rose-50/50 border-rose-200/90' : 'bg-[#0d1633]/70 border-red-500/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 ${
                isLight ? 'text-rose-800' : 'text-rose-400'
              }`}>
                <User className="w-3.5 h-3.5" /> Member 2 (Partner)
              </span>
              {year === '2nd Year' && (
                <span className={`text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${
                  isLight ? 'bg-rose-100 border-rose-300 text-rose-900' : 'bg-red-950/60 border-red-500/40 text-rose-300'
                }`}>
                  Prefix: 25...
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
              <div>
                <input
                  type="text"
                  value={member2Name}
                  onChange={(e) => {
                    setMember2Name(e.target.value);
                    if (errors.member2Name) setErrors({ ...errors, member2Name: null });
                  }}
                  placeholder="Full Name"
                  className={`w-full px-3.5 py-2 sm:py-2.5 border-2 rounded-lg text-sm font-medium transition-all focus:outline-none ${
                    isLight
                      ? errors.member2Name
                        ? 'border-red-500 bg-red-50 text-slate-900'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : errors.member2Name
                        ? 'border-red-500 bg-red-950/20 text-white'
                        : 'bg-[#080d1f] border-zinc-700 text-white placeholder-gray-500 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20'
                  }`}
                />
                {errors.member2Name && (
                  <p className="text-[11px] text-red-500 mt-1 font-mono font-bold flex items-center gap-1">
                    <AlertCircle className="w-2.5 h-2.5" /> {errors.member2Name}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  value={member2Roll}
                  onChange={(e) => {
                    setMember2Roll(e.target.value.toUpperCase());
                    if (errors.member2Roll) setErrors({ ...errors, member2Roll: null });
                  }}
                  placeholder={year === '1st Year' ? 'Roll No' : 'Roll No (25...)'}
                  className={`w-full px-3.5 py-2 sm:py-2.5 border-2 rounded-lg text-sm uppercase font-mono font-semibold transition-all focus:outline-none ${
                    isLight
                      ? errors.member2Roll
                        ? 'border-red-500 bg-red-50 text-slate-900'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : errors.member2Roll
                        ? 'border-red-500 bg-red-950/30 text-white'
                        : 'bg-[#080d1f] border-zinc-700 text-white placeholder-gray-500 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20'
                  }`}
                />
                {errors.member2Roll && (
                  <p className="text-[11px] text-red-500 mt-1 font-mono font-bold flex items-center gap-1">
                    <AlertCircle className="w-2.5 h-2.5" /> {errors.member2Roll}
                  </p>
                )}
              </div>
            </div>

            {/* Existing Name Match Alert for Member 2 */}
            {matchMember2 && (
              <div className={`mt-2 p-2 border rounded-lg text-xs flex items-center justify-between gap-2 ${
                isLight ? 'bg-amber-50 border-amber-400 text-slate-900' : 'bg-amber-950/90 border-yellow-400 text-white'
              }`}>
                <div className="truncate">
                  <span className="opacity-75">Existing: </span>
                  <strong>{matchMember2.name}</strong> ({matchMember2.rollNumber})
                </div>
                <button
                  type="button"
                  onClick={handleUseExistingMember2}
                  className="px-2.5 py-1 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded uppercase text-[10px] flex-shrink-0 transition-colors"
                >
                  USE {matchMember2.rollNumber}
                </button>
              </div>
            )}
          </div>

          {/* Large CTA Submit Button */}
          <button
            type="submit"
            disabled={isChecking}
            className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-orange-500 text-white font-black text-lg sm:text-xl rounded-xl border-2 border-yellow-400 shadow-spider-red hover:shadow-spider-gold transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider mt-2 cursor-pointer"
          >
            <span className="text-xl animate-bounce">🕸️</span>
            <span className="comic-font tracking-widest text-xl sm:text-2xl">
              {isChecking ? 'VERIFYING TEAM...' : 'ENTER SPIN & WHEEL'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
