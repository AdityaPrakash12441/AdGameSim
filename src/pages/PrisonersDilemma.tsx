import React, { useState } from 'react';
import {
  Strategy,
  getPayoff,
  PRISONERS_PAYOFF_MATRIX,
} from '../models/prisonersDilemma';
import { PayoffMatrix } from '../components/PayoffMatrix';
import { StatCard } from '../components/StatCard';
import { ChartCard } from '../components/ChartCard';
import { GlobalResultsPanel } from '../components/GlobalResultsPanel';
import { MathExplanation } from '../components/MathExplanation';
import { formatMillions } from '../utils/calculations';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  Sparkles,
  HelpCircle,
  Flame,
  CheckCircle2,
} from 'lucide-react';

export const PrisonersDilemmaPage: React.FC = () => {
  const [selectedA, setSelectedA] = useState<Strategy>('Escalate');
  const [selectedB, setSelectedB] = useState<Strategy>('Escalate');

  const currentOutcome = getPayoff(selectedA, selectedB);

  const isNash = selectedA === 'Escalate' && selectedB === 'Escalate';
  const isPareto = selectedA === 'Restrain' && selectedB === 'Restrain';

  // Bar chart data comparing all 4 outcomes
  const comparisonData = [
    {
      profile: 'Escalate / Escalate',
      shortLabel: '(Esc, Esc)',
      brandA: PRISONERS_PAYOFF_MATRIX.Escalate.Escalate[0],
      brandB: PRISONERS_PAYOFF_MATRIX.Escalate.Escalate[1],
      total: 4,
      isNash: true,
      isCurrent: selectedA === 'Escalate' && selectedB === 'Escalate',
    },
    {
      profile: 'Escalate / Restrain',
      shortLabel: '(Esc, Res)',
      brandA: PRISONERS_PAYOFF_MATRIX.Escalate.Restrain[0],
      brandB: PRISONERS_PAYOFF_MATRIX.Escalate.Restrain[1],
      total: 6,
      isCurrent: selectedA === 'Escalate' && selectedB === 'Restrain',
    },
    {
      profile: 'Restrain / Escalate',
      shortLabel: '(Res, Esc)',
      brandA: PRISONERS_PAYOFF_MATRIX.Restrain.Escalate[0],
      brandB: PRISONERS_PAYOFF_MATRIX.Restrain.Escalate[1],
      total: 6,
      isCurrent: selectedA === 'Restrain' && selectedB === 'Escalate',
    },
    {
      profile: 'Restrain / Restrain',
      shortLabel: '(Res, Res)',
      brandA: PRISONERS_PAYOFF_MATRIX.Restrain.Restrain[0],
      brandB: PRISONERS_PAYOFF_MATRIX.Restrain.Restrain[1],
      total: 8,
      isPareto: true,
      isCurrent: selectedA === 'Restrain' && selectedB === 'Restrain',
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Brand A Annual Profit"
          value={formatMillions(currentOutcome.brandAProfit)}
          subtitle={`Strategy: ${selectedA} Advertising`}
          badge={selectedA === 'Escalate' ? 'Dominant Choice' : 'Cooperative'}
          variant="brandA"
          icon={DollarSign}
        />

        <StatCard
          title="Brand B Annual Profit"
          value={formatMillions(currentOutcome.brandBProfit)}
          subtitle={`Strategy: ${selectedB} Advertising`}
          badge={selectedB === 'Escalate' ? 'Dominant Choice' : 'Cooperative'}
          variant="brandB"
          icon={DollarSign}
        />

        <StatCard
          title="Combined Industry Profit"
          value={formatMillions(currentOutcome.combinedProfit)}
          subtitle={
            isPareto
              ? 'Maximal joint surplus ($8.0M)'
              : isNash
              ? 'Diluted by ad war ($4.0M)'
              : 'Asymmetric distribution ($6.0M)'
          }
          variant={isPareto ? 'amber' : isNash ? 'neutral' : 'neutral'}
          badge={isPareto ? 'Pareto Optimal' : undefined}
          icon={TrendingUp}
        />

        <StatCard
          title="Equilibrium Status"
          value={isNash ? 'Nash Equilibrium' : isPareto ? 'Pareto Optimum' : 'Unstable Profile'}
          subtitle={
            isNash
              ? 'No brand can unilaterally deviate profitably'
              : 'Both brands face incentive to defect'
          }
          variant={isNash ? 'amber' : 'neutral'}
          badge={isNash ? 'Stable' : 'Unstable'}
          icon={Sparkles}
        />
      </div>

      {/* Main Simulation Workspace: 2x2 Matrix & Strategy Selection */}
      <PayoffMatrix
        selectedA={selectedA}
        selectedB={selectedB}
        onSelectA={setSelectedA}
        onSelectB={setSelectedB}
      />

      {/* Comparison Grid: Individually Rational vs Collectively Better */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outcome Comparison Chart */}
        <ChartCard
          title="Payoff Comparison Across Strategy Profiles"
          subtitle="Annual profit for Brand A and Brand B in all four matrix states ($ Millions)"
          badge="Payoff Comparison"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="shortLabel"
                  tick={{ fontSize: 11, fill: '#475569' }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#475569' }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  domain={[0, 8]}
                  unit="M"
                />
                <Tooltip
                  formatter={(val: number) => [`$${val}M`, '']}
                  labelFormatter={(lbl) => `Strategy Pair: ${lbl}`}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '0.75rem',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                  iconType="circle"
                />
                <Bar
                  dataKey="brandA"
                  name="Brand A ($M)"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
                <Bar
                  dataKey="brandB"
                  name="Brand B ($M)"
                  fill="#059669"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
            <span>(Esc, Esc) = Nash Equilibrium ($4M total)</span>
            <span className="font-semibold text-emerald-700">
              (Res, Res) = Social Optimum ($8M total)
            </span>
          </div>
        </ChartCard>

        {/* Deep Dive Comparison Card: Individually Rational vs Collectively Better */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Individual Rationality vs. Collective Optimization
              </h3>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-900">
                Fundamental Conflict
              </span>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              {/* Box 1: Individually Rational */}
              <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-3.5">
                <div className="flex items-center justify-between font-bold text-amber-950 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-amber-600" />
                    Individually Rational Outcome: (Escalate, Escalate)
                  </span>
                  <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-amber-300">
                    $2M + $2M = $4M
                  </span>
                </div>
                <p className="leading-relaxed text-amber-950">
                  Because <em>Escalate</em> strictly dominates <em>Restrain</em> for both brands (giving
                  6 &gt; 4 if the rival restrains, and 2 &gt; 0 if the rival escalates), rational
                  self-interest compels both advertisers to bid aggressively. Neither can safely
                  restrain unilaterally without surrendering market share and earning $0M.
                </p>
              </div>

              {/* Box 2: Collectively Better */}
              <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-3.5">
                <div className="flex items-center justify-between font-bold text-emerald-950 mb-1">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Collectively Better Outcome: (Restrain, Restrain)
                  </span>
                  <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-800">
                    $4M + $4M = $8M
                  </span>
                </div>
                <p className="leading-relaxed text-emerald-950">
                  If both brands mutually restrain ad expenditures, industry profits double from $4M
                  to $8M. However, this state is <strong>inherently unstable</strong> in a non-cooperative
                  game: each firm has a private temptation to defect to <em>Escalate</em> and capture
                  $6M, leaving the cooperator with $0.
                </p>
              </div>
            </div>
          </div>

          {/* Quick takeaway */}
          <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-200/60 text-xs text-slate-500">
            <strong>Key Takeaway:</strong> In competitive ad auctions, advertising is largely a
            defensive zero-sum tax. Aggressive bids cancel each other out, transferring $4M of industry
            surplus directly into the ad exchange's pocket.
          </div>
        </div>
      </div>

      {/* Visual Explanation Section: "Why do rational brands overspend?" */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Why Do Rational Brands Overspend?
            </h3>
            <p className="text-xs text-slate-500">
              The microeconomics of defensive keyword bidding in Google and Bing ad auctions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
          <div className="space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 font-mono text-[11px] font-bold text-slate-700">
                1
              </span>
              <span>The Defensive Bidding Imperative</span>
            </div>
            <p>
              When a consumer searches for high-intent queries (e.g. <em>"best CRM software"</em> or
              branded terms like <em>"Nike shoes"</em>), the top sponsored ad slot captures up to 45%
              of total user clicks. If Brand A restrains ad spending while Brand B escalates, Brand B
              converts the customer, capturing $6M while Brand A is completely shut out ($0M).
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 font-mono text-[11px] font-bold text-slate-700">
                2
              </span>
              <span>The Dominant Strategy Trap</span>
            </div>
            <p>
              Brand A evaluates:
              <br />
              • If Brand B escalates: A gets $2M by escalating vs. $0M by restraining.
              <br />
              • If Brand B restrains: A gets $6M by escalating vs. $4M by restraining.
              <br />
              In both scenarios, <strong>Escalating yields strictly higher profit</strong>. Because
              Brand B faces the exact identical incentive structure, both escalate simultaneously.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 font-mono text-[11px] font-bold text-slate-700">
                3
              </span>
              <span>Platform Rent Extraction</span>
            </div>
            <p>
              When both brands escalate, user intent is divided evenly, but auction clearing prices
              (CPC) rise sharply. The extra advertising budget is not burned into the ether; it is
              monetized by the search engine platform as revenue, effectively taxing the duopoly.
            </p>
          </div>
        </div>
      </div>

      {/* Standardized Global Results Panel */}
      <GlobalResultsPanel
        modelName="Prisoner's Dilemma (Advertising Budget War)"
        parameters={[
          { label: 'Brand A Payoff Matrix', value: '4 States ($M)' },
          { label: 'Brand B Payoff Matrix', value: '4 States ($M)' },
          { label: 'Market Structure', value: 'Duopoly' },
          { label: 'Information', value: 'Complete / Simultaneous' },
        ]}
        selectedStrategies={[
          { entity: 'Brand A', strategy: `${selectedA} Spending`, colorClass: 'text-blue-600' },
          { entity: 'Brand B', strategy: `${selectedB} Spending`, colorClass: 'text-emerald-600' },
        ]}
        outcomes={[
          { label: 'Brand A Profit', value: formatMillions(currentOutcome.brandAProfit) },
          { label: 'Brand B Profit', value: formatMillions(currentOutcome.brandBProfit) },
          { label: 'Combined Profit', value: formatMillions(currentOutcome.combinedProfit) },
        ]}
        equilibrium={{
          status: isNash
            ? 'Nash Equilibrium: (Escalate, Escalate)'
            : 'Off-Equilibrium Strategy Profile',
          isEquilibrium: isNash,
          type: 'Strictly Dominant Strategy Equilibrium',
          details: isNash
            ? 'Both brands choose Escalate. Neither has an incentive to deviate to Restrain because doing so drops profit from $2M to $0M.'
            : 'Current state is off-equilibrium. At least one brand can unilaterally increase profits by switching to Escalate.',
        }}
      />

      {/* Section 8: Collapsible Understand the Mathematics */}
      <MathExplanation
        modelTitle="Prisoner's Dilemma Budget War"
        gameType="Finite Normal-Form Game with Dominant Strategies"
        variables={[
          {
            symbol: 'S_i',
            name: 'Strategy Space',
            description: "Binary decision set for brand i: {Escalate, Restrain}",
          },
          {
            symbol: 'u_i(s_A, s_B)',
            name: 'Payoff Function',
            description: 'Annual profit function mapping strategy pairs to earnings in $ Millions',
            unit: '$M USD',
          },
          {
            symbol: 's_i^*',
            name: 'Dominant Strategy',
            description: 'A strategy that strictly outperforms all alternatives regardless of opponent choice',
          },
          {
            symbol: 'Π_joint',
            name: 'Industry Profit',
            description: 'Total combined earnings across both competing brands: u_A + u_B',
            unit: '$M USD',
          },
        ]}
        equations={[
          {
            label: 'Strict Dominance Condition for Brand i',
            formula: 'u_i(Escalate, s_{-i}) > u_i(Restrain, s_{-i}) \\quad \\forall s_{-i} \\in \\{Escalate, Restrain\\}',
            explanation:
              'For any strategy chosen by the rival s_{-i}, choosing Escalate produces strictly greater profit than Restrain (2 > 0 and 6 > 4).',
          },
          {
            label: 'Nash Equilibrium Condition',
            formula: 'u_A(s_A^*, s_B^*) \\ge u_A(s_A, s_B^*) \\quad \\text{and} \\quad u_B(s_A^*, s_B^*) \\ge u_B(s_A^*, s_B)',
            explanation:
              'Profile (Escalate, Escalate) satisfies the Nash equilibrium because u_A(Esc, Esc) = 2 >= u_A(Res, Esc) = 0, and symmetrically for Brand B.',
          },
          {
            label: 'Pareto Inefficiency of Nash Outcome',
            formula: 'u_i(Restrain, Restrain) > u_i(Escalate, Escalate) \\quad \\forall i \\in \\{A, B\\}',
            explanation:
              'Both players receive 4 > 2 under mutual restraint. Hence, the unique Nash Equilibrium is strictly Pareto dominated.',
          },
        ]}
        assumptions={[
          {
            title: 'Simultaneous & Non-Cooperative Play',
            detail: 'Firms make advertising budget commitments without legally binding collusive agreements.',
          },
          {
            title: 'Symmetric Information & Payoffs',
            detail: 'Both advertisers have complete knowledge of the payoff matrix and brand valuations.',
          },
          {
            title: 'Fixed Audience Size',
            detail: 'Total category consumer demand is relatively inelastic; ad spend reallocates market share.',
          },
          {
            title: 'Single-Shot Interaction',
            detail: 'Modeled as a static game. (In infinitely repeated games with high discount factor δ, cooperation can be sustained via grim trigger strategies).',
          },
        ]}
        calculationSteps={[
          "Read selected strategies sA and sB from user input.",
          "Look up payoffs [uA, uB] in the 2x2 presentation payoff matrix.",
          "Evaluate best responses: br_A(sB) = argmax_{sA} uA(sA, sB). Confirm br_A(Escalate) = Escalate and br_A(Restrain) = Escalate.",
          "Identify dominant strategy: Since br_A is constant across all opponent actions, Escalate is strictly dominant.",
          "Evaluate Nash equilibrium: Verify that profile (Escalate, Escalate) has zero profitable deviations.",
          "Evaluate Pareto criterion: Compare joint sum $4M at equilibrium against $8M under mutual restraint.",
        ]}
        resultInterpretation="Rational individual self-interest drives both brands to escalate spending. Even though both would prefer the $4M profit of mutual restraint, the fear of earning $0M if the rival escalates forces both into the $2M equilibrium."
        advertisingConnection="In real-world Google Ads and retail media networks, rival brands engage in aggressive defensive bidding on their own brand keywords and high-intent generic keywords. This defensive spending acts as an arms race that inflates cost-per-click without expanding the total consumer market."
      />
    </div>
  );
};
