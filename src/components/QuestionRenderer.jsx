import React, { useState } from 'react';
import { Code2, Terminal, Bug, Lightbulb, Copy, Check, Info, Layers, Sparkles, FileText, Play } from 'lucide-react';

export default function QuestionRenderer({ question, theme = 'dark' }) {
  const [copied, setCopied] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const isLight = theme === 'light';

  if (!question) return null;

  const { pattern } = question;

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. PATTERN CHALLENGES
  if (pattern === 'PATTERN') {
    return (
      <div className="space-y-4">
        {/* Problem Statement Box */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            isLight
              ? 'bg-slate-50/90 border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] text-slate-900'
              : 'bg-[#0e1424]/90 border-slate-800/80 shadow-lg text-slate-100'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold tracking-wide uppercase ${
                isLight
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Pattern Challenge
            </span>
          </div>

          <p className="text-base sm:text-lg font-medium leading-relaxed tracking-normal">
            {question.question || "Write a program to generate the pattern shown below for the given input."}
          </p>
        </div>

        {/* Input Specs & Terminal Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
          {/* Left Column: Input & Constraints (5 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {/* Input Card */}
            <div
              className={`p-4 rounded-2xl border flex-1 flex flex-col justify-between ${
                isLight
                  ? 'bg-white border-slate-200 shadow-sm'
                  : 'bg-[#0b1020] border-slate-800 shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                    <Play className="w-3 h-3 text-cyan-500 fill-cyan-500" /> Input Value
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800/80 text-slate-400'
                  }`}>
                    Parameter
                  </span>
                </div>

                <div
                  className={`p-3 rounded-xl font-mono text-base font-extrabold flex items-center justify-center text-center border ${
                    isLight
                      ? 'bg-cyan-50/70 border-cyan-200 text-cyan-950 shadow-inner'
                      : 'bg-[#060c18] border-cyan-500/30 text-cyan-300 shadow-inner'
                  }`}
                >
                  {question.input}
                </div>
              </div>

              {/* Constraints Info */}
              {question.constraints && (
                <div className={`mt-3 pt-3 border-t text-xs font-mono flex items-start gap-1.5 ${
                  isLight ? 'border-slate-100 text-slate-600' : 'border-slate-800/80 text-slate-400'
                }`}>
                  <Info className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-500">Constraint: </span>
                    <span className="font-semibold">{question.constraints}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: IDE Code Terminal Preview (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="rounded-2xl overflow-hidden border border-slate-700/60 bg-[#070b14] shadow-2xl flex flex-col h-full">
              {/* Terminal Window Header */}
              <div className="px-4 py-2.5 bg-[#0d1322] border-b border-slate-800 flex items-center justify-between select-none">
                {/* Window Dots */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm" />
                  </div>
                  <div className="ml-3 flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>expected_output.txt</span>
                  </div>
                </div>

                {/* Right Header: Copy Button & Badge */}
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                    Target Output
                  </span>
                  <button
                    onClick={() => handleCopy(question.output)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
                    title="Copy output pattern"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code Pre Block */}
              <div className="p-4 sm:p-5 flex-1 flex items-center justify-center bg-[#050811] overflow-x-auto min-h-[160px]">
                <pre className="font-mono text-base sm:text-lg md:text-xl font-bold text-yellow-300 leading-snug tracking-[0.18em] select-all whitespace-pre text-left">
                  {question.output}
                </pre>
              </div>

              {/* Terminal Footer Bar */}
              <div className="px-4 py-1.5 bg-[#090e1a] border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>UTF-8 &bull; Monospace Output</span>
                <span className="text-slate-400 font-bold">Exact spacing required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. BASIC PROGRAMMING / CODING
  if (pattern === 'BASIC PROGRAMMING' || pattern === 'CODING') {
    return (
      <div className="space-y-4">
        {/* Problem Statement Box */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            isLight
              ? 'bg-slate-50/90 border-slate-200/80 shadow-sm text-slate-900'
              : 'bg-[#0e1424]/90 border-slate-800/80 shadow-lg text-slate-100'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold tracking-wide uppercase ${
                isLight
                  ? 'bg-cyan-100 text-cyan-900 border border-cyan-300'
                  : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-500" />
              Programming Challenge
            </span>
          </div>

          <p className="text-base sm:text-lg font-medium leading-relaxed">
            {question.question}
          </p>
        </div>

        {/* Input & Output Specs in Side-by-Side Modern Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Input Box */}
          <div
            className={`p-4 rounded-2xl border flex flex-col justify-between ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0b1020] border-slate-800 shadow-md'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                  <Play className="w-3 h-3 text-cyan-500 fill-cyan-500" /> Sample Input
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-400'
                }`}>
                  stdin
                </span>
              </div>
              <div
                className={`p-3 rounded-xl font-mono text-sm sm:text-base font-bold break-words border ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-900'
                    : 'bg-[#060c18] border-slate-800 text-cyan-300'
                }`}
              >
                {question.input}
              </div>
            </div>
          </div>

          {/* Expected Output Box */}
          <div
            className={`p-4 rounded-2xl border flex flex-col justify-between ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0b1020] border-slate-800 shadow-md'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-emerald-500" /> Expected Output
                </span>
                <button
                  onClick={() => handleCopy(question.output)}
                  className="text-[11px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div
                className={`p-3 rounded-xl font-mono text-sm sm:text-base font-bold whitespace-pre-wrap break-words border ${
                  isLight
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-[#060c18] border-emerald-500/30 text-emerald-300'
                }`}
              >
                {question.output}
              </div>
            </div>
          </div>
        </div>

        {/* Constraints */}
        {question.constraints && (
          <div
            className={`p-3.5 rounded-xl border space-y-1 text-xs font-mono ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-[#0e1424]/80 border-slate-800/80 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              <span><strong className="text-red-500 dark:text-red-400">Constraints:</strong> {question.constraints}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. DEBUGGING
  if (pattern === 'DEBUGGING') {
    return (
      <div className="space-y-4">
        <div
          className={`p-4 rounded-2xl border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0e1424] border-slate-800'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-500 uppercase tracking-wider mb-1">
            <Bug className="w-4 h-4" /> Bug Hunt Challenge
          </div>
          <p className="text-base font-medium leading-relaxed">
            {question.question}
          </p>
        </div>

        {question.code && (
          <div className="rounded-2xl overflow-hidden border border-rose-500/30 bg-[#070b14] shadow-xl">
            <div className="px-4 py-2 bg-rose-950/40 border-b border-rose-500/20 flex items-center justify-between text-xs font-mono text-rose-300">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-rose-400" /> Source Code (Buggy)
              </span>
              <span className="text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/30 text-[10px]">
                NEEDS FIX
              </span>
            </div>
            <pre className="p-4 text-xs sm:text-sm font-mono text-cyan-200 overflow-x-auto leading-relaxed">
              <code>{question.code}</code>
            </pre>
          </div>
        )}
      </div>
    );
  }

  // 4. OUTPUT PREDICTION
  if (pattern === 'OUTPUT PREDICTION') {
    return (
      <div className="space-y-4">
        <div className={`p-4 rounded-xl border ${
          isLight ? 'bg-slate-50 border-slate-300' : 'bg-zinc-900/90 border-red-500/30'
        }`}>
          <p className={`text-base sm:text-lg font-medium ${isLight ? 'text-slate-900 font-semibold' : 'text-white'}`}>
            {question.question}
          </p>
        </div>

        {/* Code Snippet */}
        {question.code && (
          <div className="rounded-xl overflow-hidden border-2 border-cyan-500/40 bg-[#0a0f1d] shadow-xl">
            <div className="px-4 py-2 bg-cyan-950/70 border-b border-cyan-500/30 flex items-center justify-between text-xs font-mono text-cyan-300">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Code Snippet
              </span>
              <span>stdout analysis</span>
            </div>
            <pre className="p-4 text-xs sm:text-sm font-mono text-yellow-200 overflow-x-auto leading-relaxed">
              <code>{question.code}</code>
            </pre>
          </div>
        )}

        {/* Output Toggle */}
        <div>
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="text-xs font-mono text-cyan-500 hover:text-cyan-600 flex items-center gap-1.5 underline underline-offset-4 font-bold"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            {showAnswer ? 'Hide Predicted Output' : 'Reveal Predicted Output'}
          </button>
          {showAnswer && (
            <div className={`mt-2 p-3.5 border rounded-xl space-y-1.5 text-xs sm:text-sm ${
              isLight ? 'bg-emerald-50 border-emerald-300 text-slate-800' : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
            }`}>
              <span className="text-emerald-600 font-mono font-bold block">Exact Output:</span>
              <pre className={`p-2.5 rounded font-mono text-xs overflow-x-auto whitespace-pre ${
                isLight ? 'bg-slate-100 text-emerald-800 border border-slate-200' : 'bg-black/60 text-emerald-300'
              }`}>
                {question.output}
              </pre>
              {question.explanation && (
                <p className={`text-xs mt-1 font-sans ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>{question.explanation}</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 5. THEORY
  if (pattern === 'THEORY') {
    return (
      <div className="space-y-4">
        <div className={`p-5 rounded-xl border ${
          isLight ? 'bg-slate-50 border-slate-300' : 'bg-zinc-900/90 border-red-500/30'
        }`}>
          <h4 className="text-xs font-mono uppercase tracking-wider text-amber-500 font-bold mb-1 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" /> Conceptual Question
          </h4>
          <p className={`text-lg sm:text-xl font-medium leading-relaxed ${isLight ? 'text-slate-900 font-semibold' : 'text-white'}`}>
            {question.question}
          </p>
        </div>

        {/* Details / Explanation */}
        {question.details && (
          <div className={`p-4 border rounded-xl text-sm whitespace-pre-line leading-relaxed ${
            isLight ? 'bg-white border-blue-400/40 text-slate-800 shadow-sm' : 'bg-[#0c1328] border-blue-500/30 text-gray-200'
          }`}>
            {question.details}
          </div>
        )}
      </div>
    );
  }

  // 6. RAPID FIRE (High contrast in both White and Dark Themes)
  if (pattern === 'RAPID FIRE') {
    return (
      <div className="space-y-5 text-center py-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-500 text-xs font-black tracking-widest uppercase animate-pulse">
          <Zap className="w-3.5 h-3.5" /> Rapid Fire Lightning Round
        </div>

        <div className={`p-6 sm:p-8 rounded-2xl border-2 shadow-md ${
          isLight
            ? 'bg-gradient-to-br from-amber-50 via-white to-red-50 border-yellow-500/80 shadow-[0_8px_25px_rgba(251,191,36,0.2)]'
            : 'bg-gradient-to-br from-[#180909] via-zinc-900 to-[#0a1128] border-yellow-400/60 shadow-spider-gold'
        }`}>
          <p className={`text-xl sm:text-2xl font-bold leading-relaxed ${
            isLight ? 'text-slate-900 font-black' : 'text-white font-bold'
          }`}>
            "{question.question}"
          </p>
        </div>

        {/* Answer Reveal */}
        <div>
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="text-xs font-mono text-cyan-500 hover:text-cyan-600 flex items-center justify-center gap-1.5 underline underline-offset-4 mx-auto font-bold"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            {showAnswer ? 'Hide Lightning Answer' : 'Reveal Lightning Answer'}
          </button>
          {showAnswer && (
            <div className={`mt-3 p-4 border rounded-xl font-bold text-base max-w-lg mx-auto ${
              isLight ? 'bg-yellow-50 border-yellow-400 text-yellow-900' : 'bg-yellow-950/40 border-yellow-500/50 text-yellow-200'
            }`}>
              🎯 {question.answer || question.details}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default Fallback
  return (
    <div className={`p-4 rounded-xl ${isLight ? 'bg-slate-100 text-slate-900' : 'bg-zinc-900 text-white'}`}>
      <p>{question.question}</p>
    </div>
  );
}
