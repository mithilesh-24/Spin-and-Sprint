import React, { useState } from 'react';
import { Code2, HelpCircle, Terminal, Bug, Lightbulb, Zap } from 'lucide-react';

export default function QuestionRenderer({ question, theme = 'dark' }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const isLight = theme === 'light';

  if (!question) return null;

  const { pattern } = question;

  // 1. MCQ
  if (pattern === 'MCQ') {
    return (
      <div className="space-y-4">
        <div className={`p-4 rounded-xl border ${
          isLight ? 'bg-slate-50 border-slate-300' : 'bg-zinc-900/90 border-red-500/30'
        }`}>
          <p className={`text-lg sm:text-xl font-medium leading-relaxed ${isLight ? 'text-slate-900 font-semibold' : 'text-white'}`}>
            {question.question}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options?.map((opt) => (
            <div
              key={opt.key}
              className={`group p-3.5 border-2 rounded-xl flex items-start gap-3 transition-all duration-200 shadow-md ${
                isLight
                  ? 'bg-white border-slate-200 hover:border-cyan-500 hover:shadow-md'
                  : 'bg-[#0e162d] border-zinc-700/70 hover:border-cyan-400 hover:shadow-spider-blue'
              }`}
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-tr from-red-600 to-rose-500 text-white font-black flex items-center justify-center text-sm shadow">
                {opt.key}
              </span>
              <span className={`text-sm sm:text-base font-medium pt-1 ${isLight ? 'text-slate-800' : 'text-gray-200'}`}>
                {opt.text}
              </span>
            </div>
          ))}
        </div>

        {/* Optional Answer Toggle */}
        <div className="pt-2">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="text-xs font-mono text-cyan-500 hover:text-cyan-600 flex items-center gap-1.5 underline underline-offset-4 font-bold"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            {showAnswer ? 'Hide Answer Key' : 'Reveal Answer Key'}
          </button>
          {showAnswer && (
            <div className={`mt-2 p-3 border rounded-lg text-sm ${
              isLight ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-medium' : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
            }`}>
              <span className="font-bold">Correct Option: {question.correctAnswer}</span> — {question.explanation}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. CODING
  if (pattern === 'CODING') {
    return (
      <div className="space-y-4">
        {/* Problem Description */}
        <div className={`p-4 rounded-xl border ${
          isLight ? 'bg-slate-50 border-slate-300' : 'bg-zinc-900/90 border-red-500/30'
        }`}>
          <h4 className="text-xs font-mono uppercase tracking-wider text-red-500 font-bold mb-1 flex items-center gap-1.5">
            <Code2 className="w-4 h-4" /> Problem Statement
          </h4>
          <p className={`text-base sm:text-lg font-medium leading-relaxed ${isLight ? 'text-slate-900 font-semibold' : 'text-white'}`}>
            {question.question}
          </p>
        </div>

        {/* Input & Output Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className={`p-3.5 border rounded-xl ${
            isLight ? 'bg-white border-cyan-400/60 shadow-sm' : 'bg-[#0b1329] border-cyan-500/30'
          }`}>
            <span className="text-xs font-mono uppercase text-cyan-600 font-bold block mb-1">
              Sample Input
            </span>
            <code className={`text-xs sm:text-sm font-mono break-words block p-2 rounded ${
              isLight ? 'bg-slate-100 text-slate-900 border border-slate-200' : 'bg-black/50 text-amber-300'
            }`}>
              {question.input}
            </code>
          </div>

          <div className={`p-3.5 border rounded-xl ${
            isLight ? 'bg-white border-emerald-400/60 shadow-sm' : 'bg-[#0b1329] border-emerald-500/30'
          }`}>
            <span className="text-xs font-mono uppercase text-emerald-600 font-bold block mb-1">
              Expected Output
            </span>
            <code className={`text-xs sm:text-sm font-mono break-words block p-2 rounded ${
              isLight ? 'bg-slate-100 text-emerald-800 border border-slate-200' : 'bg-black/50 text-emerald-300'
            }`}>
              {question.output}
            </code>
          </div>
        </div>

        {/* Constraints & Example */}
        {(question.constraints || question.example) && (
          <div className={`p-3 border rounded-lg space-y-1.5 text-xs font-mono ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-zinc-900/60 border-zinc-800 text-gray-300'
          }`}>
            {question.constraints && (
              <p><span className="text-red-500 font-bold">Constraints:</span> {question.constraints}</p>
            )}
            {question.example && (
              <p><span className="text-amber-600 font-bold">Note:</span> {question.example}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  // 3. DEBUGGING
  if (pattern === 'DEBUGGING') {
    return (
      <div className="space-y-4">
        <div className={`p-4 rounded-xl border ${
          isLight ? 'bg-slate-50 border-slate-300' : 'bg-zinc-900/90 border-red-500/30'
        }`}>
          <h4 className="text-xs font-mono uppercase tracking-wider text-rose-500 font-bold mb-1 flex items-center gap-1.5">
            <Bug className="w-4 h-4" /> Bug Hunt Mission
          </h4>
          <p className={`text-base sm:text-lg font-medium ${isLight ? 'text-slate-900 font-semibold' : 'text-white'}`}>
            {question.question}
          </p>
        </div>

        {/* Code Snippet */}
        {question.code && (
          <div className="relative rounded-xl overflow-hidden border-2 border-red-500/40 bg-[#0a0f1d] shadow-xl">
            <div className="px-4 py-2 bg-red-950/80 border-b border-red-500/30 flex items-center justify-between text-xs font-mono text-red-300">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-red-400" /> Source Code (Find & Fix Error)
              </span>
              <span className="text-red-400/80 font-bold">🚨 BUGGED</span>
            </div>
            <pre className="p-4 text-xs sm:text-sm font-mono text-cyan-200 overflow-x-auto leading-relaxed">
              <code>{question.code}</code>
            </pre>
          </div>
        )}

        {/* Solution Toggle */}
        <div>
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="text-xs font-mono text-cyan-500 hover:text-cyan-600 flex items-center gap-1.5 underline underline-offset-4 font-bold"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            {showAnswer ? 'Hide Bug Explanation & Fix' : 'Reveal Bug Explanation & Fix'}
          </button>
          {showAnswer && (
            <div className={`mt-2 p-3.5 border rounded-xl space-y-1.5 text-xs sm:text-sm ${
              isLight ? 'bg-rose-50 border-rose-300 text-slate-800' : 'bg-red-950/40 border-red-500/40 text-rose-200'
            }`}>
              <p><span className="text-red-500 font-bold">Bug:</span> {question.bugDescription}</p>
              <p><span className="text-emerald-600 font-bold">Fix:</span> {question.solution}</p>
            </div>
          )}
        </div>
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
