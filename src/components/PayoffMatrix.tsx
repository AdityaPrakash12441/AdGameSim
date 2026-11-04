import React from 'react';
import {
  Strategy,
  STRATEGIES,
  PRISONERS_PAYOFF_MATRIX,
  calculateBrandABestResponse,
  calculateBrandBBestResponse,
  findNashEquilibria,
} from '../models/prisonersDilemma';
import { Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface PayoffMatrixProps {
  selectedA: Strategy;
  selectedB: Strategy;
  onSelectA: (s: Strategy) => void;
  onSelectB: (s: Strategy) => void;
}

export const PayoffMatrix: React.FC<PayoffMatrixProps> = ({
  selectedA,
  selectedB,
  onSelectA,
  onSelectB,
}) => {
  const brA = calculateBrandABestResponse();
  const brB = calculateBrandBBestResponse();
  const equilibria = findNashEquilibria();

  const isNashCell = (row: Strategy, col: Strategy) => {
    return equilibria.some((eq) => eq.strategyA === row && eq.strategyB === col);
  };

  const isParetoCell = (row: Strategy, col: Strategy) => {
    return row === 'Restrain' && col === 'Restrain';
  };

  return (
    <div className="space-y-6">
      {/* Strategy selector buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Brand A Selector */}
        <div className="rounded-xl border border-blue-200/80 bg-blue-50/40 p-4">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-100" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Brand A Strategy (Row)
              </span>
            </div>
            {brA.isDominant && (
              <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-800">
                <ShieldCheck className="h-3 w-3" /> Dominant: {brA.dominantStrategy}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {STRATEGIES.map((strategy) => {
              const isSelected = selectedA === strategy;
              return (
                <button
                  key={strategy}
                  onClick={() => onSelectA(strategy)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/50'
                      : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200'
                  }`}
                >
                  {strategy} Ad Spend
                </button>
              );
            })}
          </div>
        </div>

        {/* Brand B Selector */}
        <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-4">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Brand B Strategy (Column)
              </span>
            </div>
            {brB.isDominant && (
              <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                <ShieldCheck className="h-3 w-3" /> Dominant: {brB.dominantStrategy}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {STRATEGIES.map((strategy) => {
              const isSelected = selectedB === strategy;
              return (
                <button
                  key={strategy}
                  onClick={() => onSelectB(strategy)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/50'
                      : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
                  }`}
                >
                  {strategy} Ad Spend
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payoff Grid 2x2 */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Normal-Form Payoff Matrix</h4>
            <p className="text-xs text-slate-500">
              Interactive 2×2 grid showing annual profits in millions of dollars: ($M Brand A, $M Brand B)
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 font-medium text-blue-700">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Brand A Payoff
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> Brand B Payoff
            </span>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="relative overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-1/4 p-2"></th>
                <th colSpan={2} className="p-2 text-center text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50/60 rounded-t-xl border border-emerald-200/50">
                  Brand B (Column Player)
                </th>
              </tr>
              <tr>
                <th className="p-2 text-left text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50/60 rounded-tl-xl border border-blue-200/50">
                  Brand A (Row Player)
                </th>
                <th className="w-3/8 p-3 text-center text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200">
                  B: Escalate Spending
                </th>
                <th className="w-3/8 p-3 text-center text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200">
                  B: Restrain Spending
                </th>
              </tr>
            </thead>
            <tbody>
              {STRATEGIES.map((rowStrat) => (
                <tr key={rowStrat}>
                  {/* Row Header */}
                  <th className="p-3 text-left text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 whitespace-nowrap">
                    A: {rowStrat} Spending
                  </th>

                  {/* Cells */}
                  {STRATEGIES.map((colStrat) => {
                    const [pA, pB] = PRISONERS_PAYOFF_MATRIX[rowStrat][colStrat];
                    const isSelected = selectedA === rowStrat && selectedB === colStrat;
                    const isNash = isNashCell(rowStrat, colStrat);
                    const isPareto = isParetoCell(rowStrat, colStrat);

                    return (
                      <td
                        key={`${rowStrat}-${colStrat}`}
                        onClick={() => {
                          onSelectA(rowStrat);
                          onSelectB(colStrat);
                        }}
                        className={`cursor-pointer p-4 transition-all relative border ${
                          isSelected
                            ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-400/70 shadow-md'
                            : 'bg-white hover:bg-slate-50/80 border-slate-200'
                        }`}
                      >
                        {/* Selected Indicator Pill */}
                        {isSelected && (
                          <span className="absolute top-2 right-2 flex items-center gap-1 rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                            SELECTED
                          </span>
                        )}

                        <div className="flex flex-col items-center justify-center py-2">
                          <div className="flex items-center gap-2 font-mono text-xl sm:text-2xl font-bold">
                            <span className="text-blue-600">${pA}M</span>
                            <span className="text-slate-300">,</span>
                            <span className="text-emerald-600">${pB}M</span>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
                            {isNash && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                                <Sparkles className="h-3 w-3 text-amber-600" />
                                Nash Equilibrium
                              </span>
                            )}
                            {isPareto && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-2 py-0.5 text-[10px] font-bold text-emerald-900">
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                Pareto Optimal
                              </span>
                            )}
                          </div>

                          <div className="mt-1 text-[11px] text-slate-400">
                            Combined: ${(pA + pB)}M
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[11px] text-slate-400 italic text-center">
          Click any cell directly to inspect the strategic outcome, or use the strategy selectors above.
        </p>
      </div>
    </div>
  );
};
