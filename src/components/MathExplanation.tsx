import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Binary, Lightbulb, HelpCircle } from 'lucide-react';

export interface MathVariable {
  symbol: string;
  name: string;
  description: string;
  unit?: string;
}

export interface MathAssumption {
  title: string;
  detail: string;
}

export interface MathExplanationProps {
  modelTitle: string;
  gameType: string;
  variables: MathVariable[];
  equations: { label: string; formula: string; explanation: string }[];
  assumptions: MathAssumption[];
  calculationSteps: string[];
  advertisingConnection: string;
  resultInterpretation: string;
  defaultExpanded?: boolean;
}

export const MathExplanation: React.FC<MathExplanationProps> = ({
  modelTitle,
  gameType,
  variables,
  equations,
  assumptions,
  calculationSteps,
  advertisingConnection,
  resultInterpretation,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  return (
    <section
      id="math-explanation"
      className="rounded-2xl border border-slate-200/90 bg-white shadow-card overflow-hidden transition-all scroll-mt-24"
    >
      {/* Header bar / Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4 text-left transition-colors hover:bg-slate-100/80"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Understand the Mathematics</h3>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                {gameType}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Theoretical formulation, formal equations, assumptions, and online ad mechanics for {modelTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span>{isExpanded ? 'Collapse' : 'Expand Details'}</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6 space-y-6 text-sm text-slate-700">
          {/* Variables and Parameters */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              <Binary className="h-4 w-4 text-amber-600" />
              <span>1. Mathematical Variables & Parameters</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {variables.map((v) => (
                <div
                  key={v.symbol}
                  className="rounded-xl border border-slate-200/70 bg-slate-50/50 p-3 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-mono text-sm font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                      {v.symbol}
                    </span>
                    {v.unit && (
                      <span className="text-[11px] font-mono text-slate-400">{v.unit}</span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-slate-800">{v.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {v.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Governing Equations */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-[10px] text-white font-mono">
                Σ
              </span>
              <span>2. Mathematical Equations & Best-Response Rules</span>
            </div>
            <div className="space-y-3">
              {equations.map((eq, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-slate-900 text-slate-100 p-4 font-mono text-sm shadow-inner"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 font-sans border-b border-slate-800 pb-2 mb-2">
                    <span className="font-semibold text-amber-400">{eq.label}</span>
                  </div>
                  <div className="text-base text-amber-200 py-1 overflow-x-auto whitespace-pre font-mono">
                    {eq.formula}
                  </div>
                  <p className="mt-2 text-xs font-sans text-slate-300 leading-relaxed border-t border-slate-800 pt-2">
                    {eq.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Theoretical Assumptions */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <span>3. Model Assumptions</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {assumptions.map((asm, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5"
                >
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    {asm.title}
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{asm.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Calculation */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[10px] text-slate-800 font-bold">
                →
              </span>
              <span>4. Algorithmic Execution Steps</span>
            </div>
            <ol className="space-y-2 list-decimal list-inside text-xs text-slate-600 bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 leading-relaxed">
              {calculationSteps.map((step, idx) => (
                <li key={idx} className="pl-1">
                  <span className="text-slate-800 font-medium">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Results Interpretation & Advertising Connection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="rounded-xl bg-blue-50/60 border border-blue-200/70 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-900 mb-1.5">
                <HelpCircle className="h-4 w-4 text-blue-600" />
                <span>What the Result Means</span>
              </div>
              <p className="text-xs text-blue-950 leading-relaxed">{resultInterpretation}</p>
            </div>

            <div className="rounded-xl bg-amber-50/60 border border-amber-200/70 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5">
                <Lightbulb className="h-4 w-4 text-amber-600" />
                <span>Real-World Online Advertising Connection</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed">{advertisingConnection}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

