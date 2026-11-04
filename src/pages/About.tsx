import React from 'react';
import {
  Users,
  BookOpen,
  GraduationCap,
  Code2,
  CheckCircle2,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const teamMembers = [
    { name: 'Kritik Saha', regNo: '2427030549', role: 'Mathematical Modeling & Bertrand Logic' },
    { name: 'Aditya Prakash', regNo: '2427030541', role: 'Full-Stack Architecture & UI/UX Design' },
    { name: 'Praneel Ghosh', regNo: '2427030797', role: 'Hotelling Spatial Dynamics & Algorithms' },
    { name: 'Dhruv Singh', regNo: '2427030595', role: "Prisoner's Dilemma & Payoff Mechanics" },
  ];

  const references = [
    {
      id: 1,
      author: 'Hotelling, H.',
      year: 1929,
      title: 'Stability in Competition',
      journal: 'The Economic Journal, 39(153), 41–57',
      description:
        'The foundational treatise introducing the Linear City model, spatial competition, and the Principle of Minimum Differentiation.',
    },
    {
      id: 2,
      author: 'Varian, H. R.',
      year: 2007,
      title: 'Position Auctions',
      journal: 'International Journal of Industrial Organization, 25(6), 1163–1178',
      description:
        'Formal game-theoretic analysis of search engine keyword ad auctions, symmetric Nash equilibria, and click-through rate decay.',
    },
    {
      id: 3,
      author: 'Edelman, B., Ostrovsky, M., and Schwarz, M.',
      year: 2007,
      title: 'Internet Advertising and the Generalized Second-Price Auction: Selling Billions of Dollars Worth of Keywords',
      journal: 'American Economic Review, 97(1), 242–259',
      description:
        'The definitive economic paper proving existence of locally envy-free equilibria in the Generalized Second-Price (GSP) ad auctions.',
    },
    {
      id: 4,
      author: 'Dixit, A. and Nalebuff, B.',
      year: 1991,
      title: 'Thinking Strategically: The Competitive Edge in Business, Politics, and Everyday Life',
      journal: 'W. W. Norton & Company',
      description:
        'Classic textbook on simultaneous games, credible commitments, and non-cooperative equilibria in corporate budget wars.',
    },
  ];

  const techStack = [
    { name: 'React 18', category: 'Frontend UI', detail: 'Component architecture with strict typing' },
    { name: 'TypeScript', category: 'Language', detail: 'Strict mathematical models and data interfaces' },
    { name: 'Vite', category: 'Build Tooling', detail: 'Modern ES-module development and production bundling' },
    { name: 'Tailwind CSS', category: 'Design System', detail: 'SaaS analytics aesthetic with custom color tokens' },
    { name: 'Recharts', category: 'Data Visualization', detail: 'SVG responsive charts, bar graphs, and linear distributions' },
    { name: 'Lucide React', category: 'Icons', detail: 'Clean typography and semantic iconography' },
    { name: 'Client-Side Math', category: 'Engine', detail: '100% deterministic, zero backend or server dependency' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Project Overview Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 border border-amber-500/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 uppercase">
                  Course Project
                </span>
                <span className="text-xs font-semibold text-slate-500">V Semester</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                AdGameSim — Online Advertising Competition Simulator
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Verified Implementation
            </span>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-600 leading-relaxed max-w-4xl">
          <p className="text-base text-slate-800 font-medium">
            This project demonstrates how classical game-theoretic models can be applied to online
            advertising competition. It implements three mathematical models —{' '}
            <strong className="text-slate-900">Prisoner's Dilemma</strong>,{' '}
            <strong className="text-slate-900">Bertrand Competition</strong>, and{' '}
            <strong className="text-slate-900">Hotelling's Linear City Model</strong> — to simulate
            strategic advertiser decisions, pricing competition, and audience positioning.
          </p>

          <p>
            Developed as part of the academic curriculum for the <strong>Game Theory</strong> course,
            this interactive laboratory translates mathematical theorems (Nash Equilibria, Strictly
            Dominant Strategies, Hotelling's Law of Minimum Differentiation, and the Bertrand Paradox)
            into empirical, client-side simulations.
          </p>
        </div>
      </div>

      {/* Project Team Section */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Project Team</h3>
            <p className="text-xs text-slate-500">
              Department of Computer Science & Engineering — V Semester
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-5 hover:bg-white hover:shadow-card transition-all"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-amber-400 font-bold text-sm mb-3">
                {member.name.charAt(0)}
              </div>
              <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
              <div className="mt-1 font-mono text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 inline-block">
                {member.regNo}
              </div>
              <p className="mt-3 text-xs text-slate-500 leading-relaxed border-t border-slate-200/60 pt-2">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack Details */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Technology Architecture</h3>
            <p className="text-xs text-slate-500">
              Built with modern full-stack web standards and client-side reactive mathematics
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {techStack.map((tech, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200/70 bg-slate-50/40 p-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-900">{tech.name}</span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                  {tech.category}
                </span>
              </div>
              <p className="text-xs text-slate-500">{tech.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Academic References */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Academic Literature & Citations</h3>
            <p className="text-xs text-slate-500">
              Primary economic and game-theoretic foundations referenced in this project
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {references.map((ref) => (
            <div
              key={ref.id}
              className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-baseline gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 font-mono text-[11px] font-bold text-slate-700">
                  {ref.id}
                </span>
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {ref.author} ({ref.year}). <em>{ref.title}</em>.
                  </div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">{ref.journal}</div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {ref.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
