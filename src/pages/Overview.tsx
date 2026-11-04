import React from 'react';
import { PageId } from '../components/Sidebar';
import {
  Swords,
  TrendingDown,
  Compass,
  ArrowRight,
  Sparkles,
  Scale,
  ShieldAlert,
} from 'lucide-react';

interface OverviewProps {
  onSelectPage: (page: PageId) => void;
}

export const Overview: React.FC<OverviewProps> = ({ onSelectPage }) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-card">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Interactive Game-Theoretic Simulation Lab</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Game-Theoretic Analysis of <br />
            <span className="text-amber-600">Online Advertising Competition</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Convert abstract mathematical game theory models into interactive, verifiable simulations.
            Explore how modern digital advertisers, keyword bidders, and ad networks make strategic
            pricing, positioning, and budget decisions under competitive market pressures.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectPage('prisoners')}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all hover:gap-3"
            >
              <span>Explore Simulations</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onSelectPage('about')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all"
            >
              <span>Project Documentation</span>
            </button>
          </div>
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-gradient-to-br from-amber-100/50 to-blue-50/50 blur-3xl -z-0 pointer-events-none" />
      </div>

      {/* 3 Model Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Core Simulation Models</h3>
            <p className="text-xs text-slate-500">
              Three mathematical frameworks modeling distinct facets of digital ad competition
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Prisoner's Dilemma */}
          <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:scale-105 transition-transform">
                  <Swords className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold text-blue-800">
                  Normal-Form Game
                </span>
              </div>

              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                Model 1
              </div>
              <h4 className="text-lg font-bold text-slate-900 mt-1">
                The Advertising Budget War
              </h4>

              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Demonstrates how two rival brands (e.g. Nike vs. Adidas) fall into an escalated
                spending trap. Even though mutual restraint yields higher joint profits ($8M vs $4M),
                escalation is the strictly dominant strategy.
              </p>

              <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Nash Equilibrium:</span>
                  <span className="font-mono font-bold text-slate-900">(Escalate, Escalate)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Pareto Optimum:</span>
                  <span className="font-mono font-bold text-emerald-700">(Restrain, Restrain)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Key Phenomenon:</span>
                  <span className="font-medium text-slate-800">Surplus extraction by ad platforms</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectPage('prisoners')}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              <span>Launch Budget Simulation</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 2: Bertrand Competition */}
          <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:scale-105 transition-transform">
                  <TrendingDown className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  Price Competition
                </span>
              </div>

              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                Model 2
              </div>
              <h4 className="text-lg font-bold text-slate-900 mt-1">The CPC Price War</h4>

              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Simulates price competition between ad networks selling homogeneous clicks.
                Because buyers purchase exclusively from the lowest-cost provider, repeated
                undercutting drives CPC down to marginal cost ($P = MC$).
              </p>

              <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Starting CPC:</span>
                  <span className="font-mono font-bold text-slate-900">$2.00 / click</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Marginal Cost (MC):</span>
                  <span className="font-mono font-bold text-slate-900">$1.00 / click</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Bertrand Paradox:</span>
                  <span className="font-medium text-emerald-700">Economic profit collapses to $0</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectPage('bertrand')}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              <span>Launch Price War Simulator</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 3: Hotelling's Model */}
          <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200 group-hover:scale-105 transition-transform">
                  <Compass className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                  Spatial Market
                </span>
              </div>

              <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                Model 3
              </div>
              <h4 className="text-lg font-bold text-slate-900 mt-1">
                Why Everyone Chases the Same Keyword
              </h4>

              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Applies Hotelling's Linear City model to search intent and keyword positioning.
                Demonstrates how competing advertisers converge on median keywords (Principle of
                Minimum Differentiation) and how niche targeting escapes clustering.
              </p>

              <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Market Domain:</span>
                  <span className="font-mono font-bold text-slate-900">Line [0, 1] Intent Spectrum</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Equilibrium Position:</span>
                  <span className="font-mono font-bold text-amber-800">Center (a* = b* = 0.50)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Market Dynamic:</span>
                  <span className="font-medium text-slate-800">Minimum Differentiation</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectPage('hotelling')}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              <span>Launch Keyword Positioning</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Nash Equilibrium Deep-Dive Section */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Understanding Nash Equilibrium in Advertising
            </h3>
            <p className="text-xs text-slate-500">
              The foundational solution concept introduced by John Nash (1950)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
          <div className="space-y-3">
            <p>
              In game theory, a <strong>Nash Equilibrium</strong> is a state of a game where no player
              has an incentive to deviate from their chosen strategy unilaterally. Given what the other
              competitors are doing, each player is executing their strictly best response:
            </p>

            <div className="rounded-xl bg-slate-900 text-amber-200 font-mono p-3 text-xs border border-slate-800 shadow-inner">
              {"u_i(s_i*, s_{-i}*) ≥ u_i(s_i, s_{-i}*)  ∀ s_i ∈ S_i"}
            </div>

            <p>
              In online advertising auctions, an advertiser cannot simply bid lower without losing
              valuable ad rank and conversions, nor can they bid higher without spending more than the
              marginal return of the customer acquisition.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4">
              <h4 className="font-bold text-amber-900 text-xs mb-1 flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-amber-700" />
                The Core Paradox: Individual Rationality vs. Collective Welfare
              </h4>
              <p className="text-amber-950 text-xs leading-relaxed">
                A critical insight across all three models is that a Nash Equilibrium is <strong>not
                necessarily socially optimal</strong> or even optimal for the advertisers themselves.
                Unregulated competitive self-interest frequently traps firms in price wars, excessive
                bidding budgets, and congested keyword targeting.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="rounded-lg bg-slate-50 p-2 border border-slate-200/60">
                <div className="font-bold text-slate-900 text-sm">Non-Cooperative</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Independent Decisions</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-2 border border-slate-200/60">
                <div className="font-bold text-slate-900 text-sm">Best Response</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Optimal Reaction</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-2 border border-slate-200/60">
                <div className="font-bold text-slate-900 text-sm">Self-Enforcing</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Zero Deviations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
