import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  badge,
  headerAction,
  children,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card transition-all ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            {badge && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {headerAction && <div className="flex items-center gap-2">{headerAction}</div>}
      </div>

      <div className="w-full">{children}</div>
    </div>
  );
};

