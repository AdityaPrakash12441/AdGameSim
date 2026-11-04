import React, { useState, useMemo } from 'react';
import {
  calculateBertrand,
  simulatePriceCompetition,
  PriceWarRound,
} from '../models/bertrand';
import { StatCard } from '../components/StatCard';
import { ChartCard } from '../components/ChartCard';
import { SliderControl } from '../components/SliderControl';
import { GlobalResultsPanel } from '../components/GlobalResultsPanel';
import { MathExplanation } from '../components/MathExplanation';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/calculations';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  DollarSign,
  PieChart as PieIcon,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const BertrandCompetitionPage: React.FC = () => {
  // Initial parameters as mandated by the prompt
  const [priceA, setPriceA] = useState<number>(2.00);
  const [priceB, setPriceB] = useState<number>(2.00);
  const [marginalCost, setMarginalCost] = useState<number>(1.00);
  const [totalDemand, setTotalDemand] = useState<number>(1000);
  const maxWtp = 5.00;
  const [undercutStep, setUndercutStep] = useState<number>(0.10);

  // Price war simulation state
  const [simulationRounds, setSimulationRounds] = useState<PriceWarRound[] | null>(null);

  // Dynamic single-period outcome calculation
  const outcome = useMemo(() => {
    return calculateBertrand({
      priceA,
      priceB,
      marginalCost,
      totalDemand,
      maxWillingnessToPay: maxWtp,
    });
  }, [priceA, priceB, marginalCost, totalDemand, maxWtp]);

  const atNash =
    Math.abs(priceA - marginalCost) < 0.001 && Math.abs(priceB - marginalCost) < 0.001;

  // Run repeated undercutting simulation
  const handleRunSimulation = () => {
    const startA = Math.max(priceA, marginalCost);
    const startB = Math.max(priceB, marginalCost);
    const rounds = simulatePriceCompetition(
      startA,
      startB,
      marginalCost,
      totalDemand,
      undercutStep,
      20
    );
    setSimulationRounds(rounds);
  };

  const handleResetSimulation = () => {
    setPriceA(2.00);
    setPriceB(2.00);
    setMarginalCost(1.00);
    setTotalDemand(1000);
    setSimulationRounds(null);
  };

  // Pie chart data for market share
  const shareData = [
    { name: 'Network A', value: outcome.firmA.clicks, color: '#2563eb' },
    { name: 'Network B', value: outcome.firmB.clicks, color: '#059669' },
  ];

  // Bar chart data for profit & revenue comparison
  const financialData = [
    {
      metric: 'Revenue ($)',
      'Network A': outcome.firmA.revenue,
      'Network B': outcome.firmB.revenue,
    },
    {
      metric: 'Cost ($)',
      'Network A': outcome.firmA.cost,
      'Network B': outcome.firmB.cost,
    },
    {
      metric: 'Profit ($)',
      'Network A': outcome.firmA.profit,
      'Network B': outcome.firmB.profit,
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Network A CPC & Profit"
          value={formatCurrency(outcome.firmA.profit)}
          subtitle={`CPC: ${formatCurrency(priceA)} | ${formatNumber(outcome.firmA.clicks)} clicks`}
          badge={outcome.winner === 'Network A' ? 'Lowest CPC' : undefined}
          variant="brandA"
          icon={DollarSign}
        />

        <StatCard
          title="Network B CPC & Profit"
          value={formatCurrency(outcome.firmB.profit)}
          subtitle={`CPC: ${formatCurrency(priceB)} | ${formatNumber(outcome.firmB.clicks)} clicks`}
          badge={outcome.winner === 'Network B' ? 'Lowest CPC' : undefined}
          variant="brandB"
          icon={DollarSign}
        />

        <StatCard
          title="Market Demand Allocation"
          value={
            outcome.winner === 'Split'
              ? '50% / 50% Split'
              : `${outcome.winner} 100%`
          }
          subtitle={`Total Available Demand: ${formatNumber(totalDemand)} clicks`}
          variant="neutral"
          badge={outcome.winner === 'Split' ? 'Price Parity' : 'Monopolized'}
          icon={PieIcon}
        />

        <StatCard
          title="Bertrand Equilibrium Status"
          value={atNash ? 'At Equilibrium (P = MC)' : 'Above MC (Vulnerable)'}
          subtitle={`Marginal Cost Benchmark: ${formatCurrency(marginalCost)}`}
          variant={atNash ? 'amber' : 'neutral'}
          badge={atNash ? 'Stable' : 'Undercut Risk'}
          icon={Sparkles}
        />
      </div>

      {/* Interactive Controls & Live Outcome */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders Panel */}
        <div className="lg:col-span-1 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Interactive Market Controls</h3>
              <p className="text-xs text-slate-500">Configure prices, marginal cost & demand</p>
            </div>
            <button
              onClick={handleResetSimulation}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Reset to default initial parameters"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <SliderControl
            label="Network A CPC"
            value={priceA}
            min={marginalCost}
            max={maxWtp}
            step={0.05}
            unitPrefix="$"
            unitSuffix="/click"
            accentColor="brandA"
            description="Network A per-click price"
            onChange={setPriceA}
          />

          <SliderControl
            label="Network B CPC"
            value={priceB}
            min={marginalCost}
            max={maxWtp}
            step={0.05}
            unitPrefix="$"
            unitSuffix="/click"
            accentColor="brandB"
            description="Network B per-click price"
            onChange={setPriceB}
          />

          <SliderControl
            label="Marginal Cost (c)"
            value={marginalCost}
            min={0.50}
            max={3.00}
            step={0.05}
            unitPrefix="$"
            unitSuffix="/click"
            accentColor="amber"
            description="Ad serving & infrastructure cost"
            onChange={(val) => {
              setMarginalCost(val);
              if (priceA < val) setPriceA(val);
              if (priceB < val) setPriceB(val);
            }}
          />

          <SliderControl
            label="Total Advertiser Demand"
            value={totalDemand}
            min={100}
            max={5000}
            step={50}
            unitSuffix=" clicks"
            accentColor="slate"
            description="Total clicks demanded by advertisers"
            onChange={setTotalDemand}
          />

          <SliderControl
            label="Undercutting Step (ε)"
            value={undercutStep}
            min={0.02}
            max={0.25}
            step={0.01}
            unitPrefix="$"
            unitSuffix="/round"
            accentColor="amber"
            description="Price reduction per competition round"
            onChange={setUndercutStep}
          />

          <div className="pt-2">
            <button
              onClick={handleRunSimulation}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all active:scale-[0.99]"
            >
              <Play className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span>Run Price Competition (Undercutting)</span>
            </button>
            <p className="mt-2 text-center text-[11px] text-slate-400">
              Simulates sequential price undercutting until P = MC
            </p>
          </div>
        </div>

        {/* Live Charts: Market Share & Profit Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Market Share Pie Chart */}
            <ChartCard
              title="Market Share Breakdown"
              subtitle="Demand captured based on price advantage"
              badge={outcome.winner}
            >
              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={shareData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {shareData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => [`${formatNumber(val)} clicks (${formatPercentage(totalDemand > 0 ? (val / totalDemand) * 100 : 0)})`, '']}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '0.75rem',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-2">
                  <span className="font-semibold text-blue-900">Network A</span>
                  <div className="font-mono text-base font-bold text-blue-700">
                    {formatPercentage(outcome.firmA.marketShare)}
                  </div>
                  <div className="text-[10px] text-blue-600">
                    {formatNumber(outcome.firmA.clicks)} clicks
                  </div>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-2">
                  <span className="font-semibold text-emerald-900">Network B</span>
                  <div className="font-mono text-base font-bold text-emerald-700">
                    {formatPercentage(outcome.firmB.marketShare)}
                  </div>
                  <div className="text-[10px] text-emerald-600">
                    {formatNumber(outcome.firmB.clicks)} clicks
                  </div>
                </div>
              </div>
            </ChartCard>

            {/* Financials Bar Chart */}
            <ChartCard
              title="Financial Comparison"
              subtitle="Revenue, Cost, and Profit comparison"
              badge="Financials"
            >
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="metric" tick={{ fontSize: 11, fill: '#475569' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} />
                    <Tooltip
                      formatter={(val: number) => [formatCurrency(val), '']}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '0.75rem',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" />
                    <Bar dataKey="Network A" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Network B" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2 font-mono">
                <span>Profit A: {formatCurrency(outcome.firmA.profit)}</span>
                <span>Profit B: {formatCurrency(outcome.firmB.profit)}</span>
              </div>
            </ChartCard>
          </div>

          {/* CPC Margin Spread Visualization */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                CPC Price Spread vs. Marginal Cost Benchmark
              </span>
              <span className="font-mono text-xs text-slate-500">
                MC = {formatCurrency(marginalCost)}
              </span>
            </div>

            <div className="relative pt-6 pb-2">
              {/* Scale Line */}
              <div className="h-3 w-full rounded-full bg-slate-100 relative overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 bg-amber-500/30"
                  style={{
                    left: '0%',
                    width: `${((marginalCost - 0.5) / (maxWtp - 0.5)) * 100}%`,
                  }}
                  title="Unprofitable zone below marginal cost"
                />
              </div>

              {/* Pins for Network A, Network B, and MC */}
              <div
                className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                style={{
                  left: `${Math.max(4, Math.min(96, ((priceA - 0.5) / (maxWtp - 0.5)) * 100))}%`,
                }}
              >
                <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs font-mono">
                  A: ${priceA.toFixed(2)}
                </span>
                <div className="h-4 w-0.5 bg-blue-600" />
              </div>

              <div
                className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                style={{
                  left: `${Math.max(4, Math.min(96, ((priceB - 0.5) / (maxWtp - 0.5)) * 100))}%`,
                }}
              >
                <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs font-mono">
                  B: ${priceB.toFixed(2)}
                </span>
                <div className="h-4 w-0.5 bg-emerald-600" />
              </div>
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-2">
              <span>Min ($0.50)</span>
              <span className="text-amber-700 font-semibold">
                Marginal Cost: ${marginalCost.toFixed(2)}
              </span>
              <span>Max WTP (${maxWtp.toFixed(2)})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Repeated Undercutting Simulation Table */}
      {simulationRounds && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Dynamic Price War Simulation (Iterative Undercutting)
                </h3>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                  {simulationRounds.length} Rounds to Equilibrium
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Each round, the firm losing the market undercuts by $0.10 until both reach marginal cost ($1.00)
              </p>
            </div>
            <button
              onClick={() => setSimulationRounds(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Clear Table
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="py-2.5 px-3 text-left font-semibold">Round</th>
                  <th className="py-2.5 px-3 text-left font-semibold text-blue-700">Network A CPC</th>
                  <th className="py-2.5 px-3 text-left font-semibold text-emerald-700">Network B CPC</th>
                  <th className="py-2.5 px-3 text-left font-semibold">Market Winner</th>
                  <th className="py-2.5 px-3 text-right font-semibold text-blue-700">Profit A</th>
                  <th className="py-2.5 px-3 text-right font-semibold text-emerald-700">Profit B</th>
                  <th className="py-2.5 px-3 text-left font-semibold">Strategic Dynamics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {simulationRounds.map((r) => {
                  const isEnd =
                    Math.abs(r.priceA - marginalCost) < 0.001 &&
                    Math.abs(r.priceB - marginalCost) < 0.001;

                  return (
                    <tr
                      key={r.round}
                      className={`hover:bg-slate-50 transition-colors ${
                        isEnd ? 'bg-amber-50/70 font-semibold' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-600">
                        #{r.round}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-blue-600">
                        {formatCurrency(r.priceA)}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-emerald-600">
                        {formatCurrency(r.priceB)}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            r.winner === 'Network A'
                              ? 'bg-blue-100 text-blue-800'
                              : r.winner === 'Network B'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {r.winner}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-blue-700">
                        {formatCurrency(r.profitA)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-700">
                        {formatCurrency(r.profitB)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                        {r.notes}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 text-xs text-amber-950">
            <strong>Bertrand Equilibrium Analysis:</strong> Under standard homogeneous-product
            Bertrand assumptions with identical marginal costs, continuous prices, and no capacity
            constraints, the unique Nash Equilibrium is $P^* = MC = \$1.00$. At this price, economic
            profit collapses to zero.
            <div className="mt-1 font-mono text-[11px] text-amber-900">
              Note: This simulation implements a discrete price-step approximation (tick size: ${undercutStep.toFixed(2)}).
            </div>
          </div>
        </div>
      )}

      {/* Standardized Global Results Panel */}
      <GlobalResultsPanel
        modelName="Bertrand Competition (CPC Price War)"
        parameters={[
          { label: 'Network A CPC', value: formatCurrency(priceA) },
          { label: 'Network B CPC', value: formatCurrency(priceB) },
          { label: 'Marginal Cost (c)', value: formatCurrency(marginalCost) },
          { label: 'Total Demand', value: `${formatNumber(totalDemand)} clicks` },
        ]}
        selectedStrategies={[
          { entity: 'Network A', strategy: `CPC: ${formatCurrency(priceA)}`, colorClass: 'text-blue-600' },
          { entity: 'Network B', strategy: `CPC: ${formatCurrency(priceB)}`, colorClass: 'text-emerald-600' },
        ]}
        outcomes={[
          { label: 'Network A Profit', value: formatCurrency(outcome.firmA.profit) },
          { label: 'Network B Profit', value: formatCurrency(outcome.firmB.profit) },
          { label: 'Industry Surplus', value: formatCurrency(outcome.totalIndustryProfit) },
        ]}
        equilibrium={{
          status: atNash ? 'At Bertrand Nash Equilibrium (P = MC)' : 'Above Marginal Cost',
          isEquilibrium: atNash,
          type: 'Bertrand Price Competition Equilibrium',
          details: atNash
            ? `Price equals marginal cost ($${marginalCost.toFixed(2)}). Zero economic profit ($0.00). Neither network can lower price without making losses, nor raise price without losing 100% of volume.`
            : `Current prices exceed marginal cost. The losing or tied network has a profitable unilateral incentive to undercut price by ε to capture the entire market.`,
        }}
      />

      {/* Section 8: Collapsible Understand the Mathematics */}
      <MathExplanation
        modelTitle="Bertrand Competition Model"
        gameType="Continuous Price Competition Game (Duopoly)"
        variables={[
          {
            symbol: 'P_i',
            name: 'Cost-Per-Click (CPC)',
            description: 'Price charged to advertisers for one click by network i in {A, B}',
            unit: 'USD / click',
          },
          {
            symbol: 'c',
            name: 'Marginal Cost',
            description: 'Cost to serve, track, and auction one click impression (server, bandwidth, fraud detection)',
            unit: 'USD / click',
          },
          {
            symbol: 'Q_{total}',
            name: 'Aggregate Advertiser Demand',
            description: 'Total click volume demanded by advertisers at or below maximum reservation price',
            unit: 'Clicks',
          },
          {
            symbol: 'V',
            name: 'Reservation Value',
            description: 'Maximum willingness to pay per click by advertisers ($5.00)',
            unit: 'USD / click',
          },
          {
            symbol: 'Π_i',
            name: 'Firm Profit',
            description: 'Total economic profit earned by network i: (P_i - c) * Q_i',
            unit: 'USD',
          },
        ]}
        equations={[
          {
            label: 'Demand Allocation Function for Network A',
            formula: 'Q_A(P_A, P_B) = \\begin{cases} Q_{total} & \\text{if } P_A < P_B \\le V \\\\ \\frac{1}{2} Q_{total} & \\text{if } P_A = P_B \\le V \\\\ 0 & \\text{if } P_A > P_B \\end{cases}',
            explanation:
              'Homogeneous advertising buyers have perfect elasticity: 100% of advertiser volume flows to the network with the lowest CPC.',
          },
          {
            label: 'Profit Objective Function',
            formula: '\\Pi_i(P_i, P_j) = (P_i - c) \\cdot Q_i(P_i, P_j)',
            explanation:
              'Each network seeks to maximize economic profit. Any price P_i > c yields positive margin; any price P_i < c yields negative margin.',
          },
          {
            label: 'Bertrand Nash Equilibrium Condition',
            formula: 'P_A^* = P_B^* = c \\implies \\Pi_A^* = \\Pi_B^* = 0',
            explanation:
              'If P > c, either firm can undercut by ε > 0 and double its sales volume. The only price pair where neither has a profitable deviation is P = c.',
          },
        ]}
        assumptions={[
          {
            title: 'Homogeneous Ad Impressions',
            detail: 'Ad clicks from Network A and Network B deliver identical conversion rates and traffic quality to the advertiser.',
          },
          {
            title: 'Zero Capacity Constraints',
            detail: 'Each network can satisfy 100% of market demand without experiencing rising marginal costs.',
          },
          {
            title: 'Perfect Information',
            detail: 'Advertisers observe all network CPC prices instantaneously without search friction.',
          },
          {
            title: 'Identical Constant Marginal Cost',
            detail: 'Both networks share identical cost functions with marginal cost c = $1.00.',
          },
        ]}
        calculationSteps={[
          "Compare priceA and priceB with reservation value V and marginal cost c.",
          "Determine demand allocation: If PA < PB, QA = Qtotal and QB = 0; if PA > PB, QB = Qtotal and QA = 0; if tied, QA = QB = Qtotal / 2.",
          "Calculate financial metrics: Revenue = P * Q; Cost = c * Q; Profit = (P - c) * Q.",
          "Evaluate equilibrium status: If PA == PB == c, system is at Bertrand Nash Equilibrium.",
          "Run sequential simulation: In round t, the losing firm sets price = max(c, opponentPrice - step) until reaching c.",
        ]}
        resultInterpretation="The Bertrand Paradox reveals that even with just two competitors (duopoly), intense price competition over homogeneous goods drives market prices down to marginal cost, eliminating all economic profit."
        advertisingConnection="In programmatic ad tech and real-time bidding (RTB) exchanges, supply-side platforms (SSPs) compete on take-rates. Platforms that fail to differentiate quality face severe margin compression toward basic hosting costs."
      />
    </div>
  );
};
