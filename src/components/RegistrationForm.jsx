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
    <div className={`w-full max-w-lg mx-auto p-0.5 rounded-2xl transition-all ${
      isLight
        ? 'bg-gradient-to-b from-red-500 via-rose-300 to-cyan-500 shadow-[0_10px_25px_rgba(0,0,0,0.08)]'
        : 'bg-gradient-to-b from-red-600 via-rose-900 to-[#0c1328] shadow-spider-glow'
    }`}>
      <div className={`rounded-[14px] p-3.5 sm:p-4 border relative transition-colors ${
        isLight
          ? 'bg-white border-red-500/50 text-slate-900 shadow-lg'
          : 'bg-[#090e1f] border-red-500/40 text-white'
      }`}>
        {/* Header Ribbon */}
        <div className="text-center mb-2.5">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border font-mono text-[10px] uppercase tracking-widest mb-1 shadow-sm ${
            isLight ? 'bg-red-50 border-red-400 text-red-700' : 'bg-red-600/30 border-red-500 text-red-300'
          }`}>
            <Users className="w-3 h-3" /> Team Registration Form
          </div>
          <h2 className={`comic-font text-2xl sm:text-3xl tracking-wide uppercase ${
            isLight ? 'text-red-600 font-black' : 'text-white spidey-glow-red'
          }`}>
            Assemble Your Duo
          </h2>
        </div>

        {/* Global Existing Team Resolution Alert */}
        {duplicateTeamPrompt && (
          <div className="mb-2.5 p-2.5 bg-gradient-to-r from-amber-500/20 to-red-500/20 border-2 border-yellow-500 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs shadow-md">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <div>
                <div className={`font-bold text-xs ${isLight ? 'text-amber-900' : 'text-yellow-300'}`}>Existing Team Found</div>
                <p className={`text-[10px] ${isLight ? 'text-slate-700' : 'text-gray-200'}`}>
                  Team <span className="font-bold underline">{duplicateTeamPrompt.teamName}</span> already registered.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                type="button"
                onClick={proceedWithTeam}
                className="px-2.5 py-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white font-black text-[10px] rounded uppercase tracking-wider transition-all shadow"
              >
                USE THIS TEAM &rarr;
              </button>
              <button
                type="button"
                onClick={() => setDuplicateTeamPrompt(null)}
                className={`px-2 py-1 text-[10px] rounded uppercase font-bold border ${
                  isLight ? 'bg-slate-200 text-slate-700 border-slate-300' : 'bg-zinc-800 text-gray-300 border-zinc-700'
                }`}
              >
                EDIT
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2">
          {/* 1st Year vs 2nd Year Track Selector */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 ${
                isLight ? 'text-slate-700' : 'text-gray-300'
              }`}>
                <GraduationCap className="w-3.5 h-3.5 text-cyan-500" /> Academic Track <span className="text-red-500">*</span>
              </span>
              <span className="text-[9px] text-yellow-500 font-mono font-bold uppercase">
                {year === '1st Year' ? '🎯 1st Year Wheel' : '⚡ 2nd Year Wheel'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* 1st Year Option */}
              <button
                type="button"
                onClick={() => handleYearChange('1st Year')}
                className={`py-2 px-3 rounded-lg border-2 text-left transition-all relative flex items-center justify-between ${
                  year === '1st Year'
                    ? isLight
                      ? 'bg-amber-50 border-amber-500 shadow-sm ring-1 ring-amber-400'
                      : 'bg-amber-950/80 border-amber-400 shadow-spider-gold ring-1 ring-yellow-400/50'
                    : isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-600 opacity-70'
                      : 'bg-[#0c142c]/70 border-zinc-800 text-gray-400 opacity-70'
                }`}
              >
                <div className={`text-xs sm:text-sm font-black uppercase comic-font tracking-wide ${
                  year === '1st Year' ? (isLight ? 'text-amber-900' : 'text-yellow-300') : (isLight ? 'text-slate-700' : 'text-gray-300')
                }`}>
                  1st Year
                </div>
                {year === '1st Year' && (
                  <CheckCircle2 className={`w-4 h-4 ${isLight ? 'text-amber-600' : 'text-yellow-400'}`} />
                )}
              </button>

              {/* 2nd Year Option */}
              <button
                type="button"
                onClick={() => handleYearChange('2nd Year')}
                className={`py-2 px-3 rounded-lg border-2 text-left transition-all relative flex items-center justify-between ${
                  year === '2nd Year'
                    ? isLight
                      ? 'bg-cyan-50 border-cyan-500 shadow-sm ring-1 ring-cyan-400'
                      : 'bg-blue-950/80 border-cyan-400 shadow-spider-blue ring-1 ring-cyan-400/50'
                    : isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-600 opacity-70'
                      : 'bg-[#0c142c]/70 border-zinc-800 text-gray-400 opacity-70'
                }`}
              >
                <div className={`text-xs sm:text-sm font-black uppercase comic-font tracking-wide ${
                  year === '2nd Year' ? (isLight ? 'text-cyan-900' : 'text-cyan-300') : (isLight ? 'text-slate-700' : 'text-gray-300')
                }`}>
                  2nd Year
                </div>
                {year === '2nd Year' && (
                  <CheckCircle2 className={`w-4 h-4 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
                )}
              </button>
            </div>
          </div>

          {/* Team Name */}
          <div>
            <label className={`block text-[10px] font-mono font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1 ${
              isLight ? 'text-slate-700' : 'text-gray-300'
            }`}>
              <Shield className="w-3 h-3 text-amber-500" /> Team Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => {
                setTeamName(e.target.value);
                if (errors.teamName) setErrors({ ...errors, teamName: null });
              }}
              placeholder="e.g. Web Warriors / Binary Beasts"
              className={`w-full px-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-500 ${
                isLight
                  ? errors.teamName
                    ? 'border-red-500 bg-red-50 text-slate-900'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  : errors.teamName
                    ? 'border-red-500 bg-red-950/20 text-white'
                    : 'bg-[#0c142c] border-zinc-700 text-white placeholder-gray-500'
              }`}
            />
            {errors.teamName && (
              <p className="text-[9px] text-red-500 mt-0.5 flex items-center gap-1 font-mono font-bold">
                <AlertCircle className="w-2.5 h-2.5" /> {errors.teamName}
              </p>
            )}

            {/* Existing Team Suggestion */}
            {matchTeam && (
              <div className={`mt-1 p-2 border rounded-lg text-xs flex items-center justify-between gap-2 ${
                isLight ? 'bg-cyan-50 border-cyan-500 text-slate-900' : 'bg-blue-950/90 border-cyan-400 text-white'
              }`}>
                <div className="text-[10px]">
                  <span className="font-bold">Existing Team: </span>
                  <span className="underline font-black">{matchTeam.teamName}</span>
                </div>
                <button
                  type="button"
                  onClick={handleUseExistingTeam}
                  className="px-2 py-0.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-[9px] rounded uppercase tracking-wider"
                >
                  USE
                </button>
              </div>
            )}
          </div>

          {/* Member 1 Card */}
          <div className={`p-2.5 border rounded-lg space-y-1 relative ${
            isLight ? 'bg-cyan-50/60 border-cyan-300/80' : 'bg-[#0d1633]/80 border-cyan-500/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1 ${
                isLight ? 'text-cyan-800' : 'text-cyan-400'
              }`}>
                <User className="w-3 h-3" /> Member 1 (Lead)
              </span>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                year === '1st Year'
                  ? (isLight ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-amber-950/60 border-amber-500/40 text-yellow-300')
                  : (isLight ? 'bg-cyan-100 border-cyan-300 text-cyan-900' : 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300')
              }`}>
                {year === '1st Year' ? 'Prefix: 26...' : 'Prefix: 25...'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="text"
                  value={member1Name}
                  onChange={(e) => {
                    setMember1Name(e.target.value);
                    if (errors.member1Name) setErrors({ ...errors, member1Name: null });
                  }}
                  placeholder="Name (e.g. Mithilesh)"
                  className={`w-full px-2.5 py-1.5 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                    isLight
                      ? errors.member1Name
                        ? 'border-red-500 bg-red-50 text-slate-900'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      : errors.member1Name
                        ? 'border-red-500 bg-red-950/20 text-white'
                        : 'bg-[#080d1f] border-zinc-700 text-white placeholder-gray-500'
                  }`}
                />
                {errors.member1Name && (
                  <p className="text-[9px] text-red-500 font-mono font-bold">{errors.member1Name}</p>
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
                  placeholder={year === '1st Year' ? 'Roll (e.g. 26CSR101)' : 'Roll (e.g. 25CSR175)'}
                  className={`w-full px-2.5 py-1.5 border rounded text-xs uppercase font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                    isLight
                      ? errors.member1Roll
                        ? 'border-red-500 bg-red-50 text-slate-900'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      : errors.member1Roll
                        ? 'border-red-500 bg-red-950/30 text-white'
                        : 'bg-[#080d1f] border-zinc-700 text-white placeholder-gray-500'
                  }`}
                />
                {errors.member1Roll && (
                  <p className="text-[9px] text-red-500 font-mono font-bold">{errors.member1Roll}</p>
                )}
              </div>
            </div>

            {/* Existing Name Match Alert for Member 1 */}
            {matchMember1 && (
              <div className={`mt-1 p-2 border rounded text-[10px] flex items-center justify-between gap-1.5 ${
                isLight ? 'bg-amber-50 border-amber-500 text-slate-900' : 'bg-amber-950/90 border-yellow-400 text-white'
              }`}>
                <div>
                  <span className="opacity-80">Existing: </span>
                  <strong>{matchMember1.name}</strong> ({matchMember1.rollNumber})
                </div>
                <button
                  type="button"
                  onClick={handleUseExistingMember1}
                  className="px-2 py-0.5 bg-yellow-400 text-black font-black rounded uppercase text-[8px]"
                >
                  USE {matchMember1.rollNumber}
                </button>
              </div>
            )}
          </div>

          {/* Member 2 Card */}
          <div className={`p-2.5 border rounded-lg space-y-1 relative ${
            isLight ? 'bg-rose-50/60 border-rose-300/80' : 'bg-[#0d1633]/80 border-red-500/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1 ${
                isLight ? 'text-rose-800' : 'text-rose-400'
              }`}>
                <User className="w-3 h-3" /> Member 2 (Partner)
              </span>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                year === '1st Year'
                  ? (isLight ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-amber-950/60 border-amber-500/40 text-yellow-300')
                  : (isLight ? 'bg-rose-100 border-rose-300 text-rose-900' : 'bg-red-950/60 border-red-500/40 text-rose-300')
              }`}>
                {year === '1st Year' ? 'Prefix: 26...' : 'Prefix: 25...'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="text"
                  value={member2Name}
                  onChange={(e) => {
                    setMember2Name(e.target.value);
                    if (errors.member2Name) setErrors({ ...errors, member2Name: null });
                  }}
                  placeholder="Name (e.g. Suresh)"
                  className={`w-full px-2.5 py-1.5 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                    isLight
                      ? errors.member2Name
                        ? 'border-red-500 bg-red-50 text-slate-900'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      : errors.member2Name
                        ? 'border-red-500 bg-red-950/20 text-white'
                        : 'bg-[#080d1f] border-zinc-700 text-white placeholder-gray-500'
                  }`}
                />
                {errors.member2Name && (
                  <p className="text-[9px] text-red-500 font-mono font-bold">{errors.member2Name}</p>
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
                  placeholder={year === '1st Year' ? 'Roll (e.g. 26CSR102)' : 'Roll (e.g. 25CSR208)'}
                  className={`w-full px-2.5 py-1.5 border rounded text-xs uppercase font-mono focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                    isLight
                      ? errors.member2Roll
                        ? 'border-red-500 bg-red-50 text-slate-900'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      : errors.member2Roll
                        ? 'border-red-500 bg-red-950/30 text-white'
                        : 'bg-[#080d1f] border-zinc-700 text-white placeholder-gray-500'
                  }`}
                />
                {errors.member2Roll && (
                  <p className="text-[9px] text-red-500 font-mono font-bold">{errors.member2Roll}</p>
                )}
              </div>
            </div>

            {/* Existing Name Match Alert for Member 2 */}
            {matchMember2 && (
              <div className={`mt-1 p-2 border rounded text-[10px] flex items-center justify-between gap-1.5 ${
                isLight ? 'bg-amber-50 border-amber-500 text-slate-900' : 'bg-amber-950/90 border-yellow-400 text-white'
              }`}>
                <div>
                  <span className="opacity-80">Existing: </span>
                  <strong>{matchMember2.name}</strong> ({matchMember2.rollNumber})
                </div>
                <button
                  type="button"
                  onClick={handleUseExistingMember2}
                  className="px-2 py-0.5 bg-yellow-400 text-black font-black rounded uppercase text-[8px]"
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
            className="w-full py-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-orange-500 text-white font-black text-base sm:text-lg rounded-xl border-2 border-yellow-400 shadow-spider-red hover:shadow-spider-gold transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider mt-1"
          >
            <span className="text-lg animate-bounce">🕸️</span>
            <span className="comic-font tracking-widest text-lg sm:text-xl">
              {isChecking ? 'VERIFYING TEAM...' : 'ENTER SPIN & WHEEL'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
