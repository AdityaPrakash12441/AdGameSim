import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export interface ResultParamItem {
  label: string;
  value: string | number;
  subtext?: string;
}

export interface ResultOutcomeItem {
  label: string;
  value: string | number;
  tag?: string;
  color?: 'blue' | 'emerald' | 'amber' | 'slate';
}

interface GlobalResultsPanelProps {
  modelName: string;
  parameters: ResultParamItem[];
  selectedStrategies: { entity: string; strategy: string; colorClass?: string }[];
  outcomes: ResultOutcomeItem[];
  equilibrium: {
    status: string;
    isEquilibrium: boolean;
    type: string;
    details: string;
  };
}

export const GlobalResultsPanel: React.FC<GlobalResultsPanelProps> = ({
  modelName,
  parameters,
  selectedStrategies,
  outcomes,
  equilibrium,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Standardized Game Theory Analytics
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">
            {modelName} — Live System State
          </h3>
        </div>

        {/* Equilibrium Pill */}
        <div
          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold ${
            equilibrium.isEquilibrium
              ? 'border-amber-300 bg-amber-50 text-amber-900 shadow-xs'
              : 'border-slate-200 bg-slate-50 text-slate-700'
          }`}
        >
          {equilibrium.isEquilibrium ? (
            <Sparkles className="h-4 w-4 text-amber-600 animate-pulse" />
          ) : (
            <AlertCircle className="h-4 w-4 text-slate-400" />
          )}
          <span>{equilibrium.status}</span>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Current Parameters */}
        <div className="rounded-xl border border-slate-200/70 bg-slate-50/50 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Current Parameters
          </div>
          <div className="space-y-2">
            {parameters.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-slate-600">{p.label}</span>
                <span className="font-mono font-bold text-slate-900">{p.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Selected Strategies */}
        <div className="rounded-xl border border-slate-200/70 bg-slate-50/50 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Active Strategy Profile
          </div>
          <div className="space-y-2">
            {selectedStrategies.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-slate-600">{s.entity}</span>
                <span className={`font-semibold ${s.colorClass || 'text-slate-900'}`}>
                  {s.strategy}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Calculated Outcomes */}
        <div className="rounded-xl border border-slate-200/70 bg-slate-50/50 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Calculated Payoffs & Shares
          </div>
          <div className="space-y-2">
            {outcomes.map((o, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-slate-600">{o.label}</span>
                <span className="font-mono font-bold text-slate-900">{o.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Equilibrium Diagnosis */}
        <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-amber-700" />
            <span>{equilibrium.type}</span>
          </div>
          <p className="text-xs text-amber-950 leading-relaxed mt-1">
            {equilibrium.details}
          </p>
        </div>
      </div>
    </div>
  );
};
