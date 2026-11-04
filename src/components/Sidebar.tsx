import React from 'react';
import {
  LayoutDashboard,
  Swords,
  TrendingDown,
  Compass,
  Info,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export type PageId = 'overview' | 'prisoners' | 'bertrand' | 'hotelling' | 'about';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: PageId;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    sublabel: 'Executive Summary',
    icon: LayoutDashboard,
  },
  {
    id: 'prisoners',
    label: "Prisoner's Dilemma",
    sublabel: 'Advertising Budget War',
    icon: Swords,
    badge: 'Budget War',
  },
  {
    id: 'bertrand',
    label: 'Bertrand Competition',
    sublabel: 'CPC Price War',
    icon: TrendingDown,
    badge: 'Pricing War',
  },
  {
    id: 'hotelling',
    label: "Hotelling's Model",
    sublabel: 'Keyword Positioning',
    icon: Compass,
    badge: 'Spatial War',
  },
  {
    id: 'about',
    label: 'About the Project',
    sublabel: 'Team & Academic Basis',
    icon: Info,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  isOpenMobile,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white shadow-sm shadow-amber-500/20">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900">AdGameSim</span>
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                  v1.0
                </span>
              </div>
              <p className="text-xs font-medium text-slate-400">Ad Competition Simulator</p>
            </div>
          </div>
        </div>

        {/* Course Banner */}
        <div className="mx-4 mt-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Course Project</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700">
              <Sparkles className="h-3 w-3" /> V Semester
            </span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
            Game-Theoretic Analysis of Online Advertising Competition
          </p>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
          <div className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Simulations & Models
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectPage(item.id);
                  onCloseMobile();
                }}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      isActive
                        ? 'bg-slate-800 text-amber-400'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-medium leading-none">{item.label}</div>
                    <div
                      className={`text-[11px] mt-1 truncate ${
                        isActive ? 'text-slate-300' : 'text-slate-400'
                      }`}
                    >
                      {item.sublabel}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pl-2 shrink-0">
                  {item.badge && !isActive && (
                    <span className="hidden sm:inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      isActive
                        ? 'text-amber-400 translate-x-0.5'
                        : 'text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/60">
            <div className="text-xs font-semibold text-slate-800">Game Theory Laboratory</div>
            <div className="mt-0.5 text-[11px] text-slate-500">
              Interactive Mathematical Research Simulation
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-200/60 pt-2">
              <span>Pure Client-Side Math</span>
              <span className="font-mono text-emerald-600 font-semibold">● Active</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

