import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'brandA' | 'brandB' | 'amber' | 'neutral' | 'danger';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  badge,
  icon: Icon,
  variant = 'neutral',
}) => {
  const variantStyles = {
    brandA: {
      border: 'border-blue-200/80',
      bg: 'bg-white',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-50 text-blue-600',
      accentBar: 'bg-blue-600',
    },
    brandB: {
      border: 'border-emerald-200/80',
      bg: 'bg-white',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconBg: 'bg-emerald-50 text-emerald-600',
      accentBar: 'bg-emerald-600',
    },
    amber: {
      border: 'border-amber-200/80',
      bg: 'bg-white',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      iconBg: 'bg-amber-50 text-amber-700',
      accentBar: 'bg-amber-500',
    },
    neutral: {
      border: 'border-slate-200/80',
      bg: 'bg-white',
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
      iconBg: 'bg-slate-100 text-slate-600',
      accentBar: 'bg-slate-400',
    },
    danger: {
      border: 'border-rose-200/80',
      bg: 'bg-white',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      iconBg: 'bg-rose-50 text-rose-600',
      accentBar: 'bg-rose-500',
    },
  }[variant];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${variantStyles.border} ${variantStyles.bg} p-5 shadow-card transition-all hover:shadow-card-hover`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
              {value}
            </span>
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 line-clamp-1">{subtitle}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          {Icon && (
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${variantStyles.iconBg}`}>
              <Icon className="h-5 w-5" />
            </div>
          )}
          {badge && (
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${variantStyles.badgeBg}`}
            >
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

