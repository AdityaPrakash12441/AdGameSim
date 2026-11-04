import React from 'react';
import { Menu, BookOpen, HelpCircle } from 'lucide-react';
import { PageId } from './Sidebar';

interface HeaderProps {
  currentPage: PageId;
  onOpenMobileSidebar: () => void;
  onSelectPage: (page: PageId) => void;
}

const PAGE_META: Record<PageId, { title: string; subtitle: string; category: string }> = {
  overview: {
    title: 'Advertising Competition Simulator',
    subtitle: 'Strategic decision-making models applied to online advertising auctions and positioning',
    category: 'Executive Dashboard',
  },
  prisoners: {
    title: "The Advertising Budget War",
    subtitle: "Prisoner's Dilemma applied to keyword bidding escalations and defensive ad spending",
    category: 'Normal-Form Game',
  },
  bertrand: {
    title: 'The CPC Price War',
    subtitle: 'Bertrand Competition with homogeneous impressions and price-undercutting dynamics',
    category: 'Price Competition Model',
  },
  hotelling: {
    title: 'Why Everyone Chases the Same Keyword',
    subtitle: "Hotelling's Linear City model applied to keyword intent and audience differentiation",
    category: 'Spatial Competition Model',
  },
  about: {
    title: 'About the Project',
    subtitle: 'Academic background, team members, literature citations, and mathematical formulation',
    category: 'Academic Documentation',
  },
};

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onOpenMobileSidebar,
  onSelectPage,
}) => {
  const meta = PAGE_META[currentPage];

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 sm:px-8 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-slate-600 uppercase">
              {meta.category}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            {meta.title}
          </h1>
        </div>
      </div>

      {/* Quick Action Badges */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onSelectPage('about')}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <BookOpen className="h-3.5 w-3.5 text-slate-500" />
          <span>Academic References</span>
        </button>

        <a
          href="#math-explanation"
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-500/20 transition-colors"
          title="Scroll to Mathematical Explanation"
        >
          <HelpCircle className="h-3.5 w-3.5 text-amber-700" />
          <span>Theory & Equations</span>
        </a>
      </div>
    </header>
  );
};
