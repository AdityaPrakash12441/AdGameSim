import React from 'react';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unitPrefix?: string;
  unitSuffix?: string;
  description?: string;
  onChange: (value: number) => void;
  disabled?: boolean;
  accentColor?: 'brandA' | 'brandB' | 'amber' | 'slate';
}

export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unitPrefix = '',
  unitSuffix = '',
  description,
  onChange,
  disabled = false,
  accentColor = 'slate',
}) => {
  const accentClasses = {
    brandA: 'accent-blue-600 focus:ring-blue-500',
    brandB: 'accent-emerald-600 focus:ring-emerald-500',
    amber: 'accent-amber-600 focus:ring-amber-500',
    slate: 'accent-slate-800 focus:ring-slate-500',
  }[accentColor];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseFloat(e.target.value);
    if (!isNaN(num)) {
      onChange(Math.min(Math.max(num, min), max));
    }
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:border-slate-300">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-slate-700 tracking-tight">
          {label}
        </label>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 font-mono">{unitPrefix}</span>
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={handleInputChange}
            className="w-20 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-right font-mono text-xs font-semibold text-slate-800 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          {unitSuffix && <span className="text-xs text-slate-400 font-medium">{unitSuffix}</span>}
        </div>
      </div>

      <div className="relative mt-2 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={`h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 ${accentClasses}`}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>
          {unitPrefix}
          {min}
          {unitSuffix}
        </span>
        {description && (
          <span className="text-[11px] text-slate-500 font-sans italic truncate max-w-[200px]">
            {description}
          </span>
        )}
        <span>
          {unitPrefix}
          {max}
          {unitSuffix}
        </span>
      </div>
    </div>
  );
};

