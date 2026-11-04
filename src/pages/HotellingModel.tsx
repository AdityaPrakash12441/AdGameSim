import React, { useState, useMemo } from 'react';
import {
  calculateHotelling,
  findBestResponseForA,
  findBestResponseForB,
  simulateHotellingDynamics,
  HotellingRoundHistory,
} from '../models/hotelling';
import { StatCard } from '../components/StatCard';
import { SliderControl } from '../components/SliderControl';
import { GlobalResultsPanel } from '../components/GlobalResultsPanel';
import { MathExplanation } from '../components/MathExplanation';
import { formatPercentage, formatNumber } from '../utils/calculations';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  Users,
  Target,
  Sparkles,
  RotateCcw,
  Play,
  StepForward,
  Layers,
} from 'lucide-react';

export const HotellingModelPage: React.FC = () => {
  // State for positions and controls
  const [positionA, setPositionA] = useState<number>(0.20);
  const [positionB, setPositionB] = useState<number>(0.80);
  const [numUsers, setNumUsers] = useState<number>(200);
  const [numRounds, setNumRounds] = useState<number>(4);

  // Iterative history state
  const [history, setHistory] = useState<HotellingRoundHistory[] | null>(null);

  // Dynamic outcome calculation
  const outcome = useMemo(() => {
    return calculateHotelling(positionA, positionB, numUsers);
  }, [positionA, positionB, numUsers]);

  // Is at minimum differentiation equilibrium (both at center 0.50)?
  const atCenterEquilibrium =
    Math.abs(positionA - 0.5) < 0.03 && Math.abs(positionB - 0.5) < 0.03;

  // Best response actions
  const handleStepBestResponseA = () => {
    const br = findBestResponseForA(positionB);
    setPositionA(br.bestPosition);
  };

  const handleStepBestResponseB = () => {
    const br = findBestResponseForB(positionA);
    setPositionB(br.bestPosition);
  };

  const handleRunFullConvergence = () => {
    const simHistory = simulateHotellingDynamics(positionA, positionB, numRounds);
    setHistory(simHistory);
    const last = simHistory[simHistory.length - 1];
    setPositionA(last.positionA);
    setPositionB(last.positionB);
  };

  const handleResetPositions = () => {
    setPositionA(0.20);
    setPositionB(0.80);
    setHistory(null);
  };

  // Preset scenarios
  const applyPreset = (preset: 'differentiated' | 'asymmetric' | 'converged') => {
    if (preset === 'differentiated') {
      setPositionA(0.25);
      setPositionB(0.75);
    } else if (preset === 'asymmetric') {
      setPositionA(0.15);
      setPositionB(0.60);
    } else if (preset === 'converged') {
      setPositionA(0.50);
      setPositionB(0.50);
    }
    setHistory(null);
  };

  // Data for convergence trajectory chart if history exists
  const trajectoryChartData = history
    ? history.map((h) => ({
        round: `R${h.round}`,
        'Brand A Position': h.positionA,
        'Brand B Position': h.positionB,
        'Share A (%)': h.shareA,
        'Share B (%)': h.shareB,
      }))
    : [];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Brand A Keyword Position"
          value={positionA.toFixed(2)}
          subtitle={`Market Share: ${formatPercentage(outcome.shareA)} (${formatNumber(outcome.clicksA)} users)`}
          badge={`Audience: [0, ${outcome.cutoffPoint !== null && positionA < positionB ? outcome.cutoffPoint.toFixed(2) : '...'}]`}
          variant="brandA"
          icon={Target}
        />

        <StatCard
          title="Brand B Keyword Position"
          value={positionB.toFixed(2)}
          subtitle={`Market Share: ${formatPercentage(outcome.shareB)} (${formatNumber(outcome.clicksB)} users)`}
          badge={`Audience: [${outcome.cutoffPoint !== null && positionA < positionB ? outcome.cutoffPoint.toFixed(2) : '...'}, 1]`}
          variant="brandB"
          icon={Target}
        />

        <StatCard
          title="Average Audience Mismatch"
          value={outcome.overallAverageDistance.toFixed(3)}
          subtitle={`Social Optimum Mismatch: ${outcome.socialOptimumAverageDistance.toFixed(3)}`}
          variant={outcome.overallAverageDistance <= 0.13 ? 'amber' : 'neutral'}
          badge={outcome.overallAverageDistance <= 0.13 ? 'Socially Optimal' : 'Sub-optimal'}
          icon={Users}
        />

        <StatCard
          title="Equilibrium Status"
          value={atCenterEquilibrium ? 'Minimum Differentiation' : 'Differentiated Segment'}
          subtitle={
            atCenterEquilibrium
              ? 'Both brands clustered at median keyword (0.50)'
              : 'Firms occupy distinct keyword intents'
          }
          variant={atCenterEquilibrium ? 'amber' : 'neutral'}
          badge={atCenterEquilibrium ? 'Nash Equilibrium' : 'Mobile'}
          icon={Sparkles}
        />
      </div>

      {/* Main Interactive Linear Market Visualization */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Linear Market Positioning Map: [0, 1] Audience Spectrum
              </h3>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                Intent Continuum
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Users patronize the nearest advertiser. The boundary line marks the indifferent consumer.
            </p>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Presets:</span>
            <button
              onClick={() => applyPreset('differentiated')}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Social Optimum (0.25, 0.75)
            </button>
            <button
              onClick={() => applyPreset('converged')}
              className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-900 hover:bg-amber-100"
            >
              Nash Center (0.50, 0.50)
            </button>
          </div>
        </div>

        {/* Visual Track Container */}
        <div className="py-6 px-2">
          {/* Label markers for spectrum ends */}
          <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <span>0.00: Niche Segment A (e.g. Budget / Developer)</span>
            </div>
            <div className="text-slate-400 font-mono text-[11px]">Median User (0.50)</div>
            <div className="flex items-center gap-1.5">
              <span>1.00: Niche Segment B (e.g. Luxury / Enterprise)</span>
              <span className="h-2 w-2 rounded-full bg-slate-400" />
            </div>
          </div>

          {/* Linear Market Track */}
          <div className="relative h-16 w-full rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shadow-inner flex items-center">
            {/* Shaded Territories */}
            {outcome.cutoffPoint !== null && (
              <>
                <div
                  className="absolute top-0 bottom-0 left-0 transition-all duration-300"
                  style={{
                    width: `${outcome.cutoffPoint * 100}%`,
                    backgroundColor: positionA < positionB ? 'rgba(37, 99, 235, 0.15)' : 'rgba(5, 150, 105, 0.15)',
                  }}
                />
                <div
                  className="absolute top-0 bottom-0 right-0 transition-all duration-300"
                  style={{
                    width: `${(1 - outcome.cutoffPoint) * 100}%`,
                    backgroundColor: positionA < positionB ? 'rgba(5, 150, 105, 0.15)' : 'rgba(37, 99, 235, 0.15)',
                  }}
                />
              </>
            )}

            {/* Middle Indifference Cutoff Line */}
            {outcome.cutoffPoint !== null && Math.abs(positionA - positionB) > 0.001 && (
              <div
                className="absolute top-0 bottom-0 w-0.5 border-r-2 border-dashed border-amber-600 z-10"
                style={{ left: `${outcome.cutoffPoint * 100}%` }}
                title={`Indifference Cutoff Point: ${outcome.cutoffPoint.toFixed(3)}`}
              >
                <div className="absolute -top-6 -left-8 rounded bg-amber-600 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs whitespace-nowrap">
                  Cutoff: {outcome.cutoffPoint.toFixed(2)}
                </div>
              </div>
            )}

            {/* Center Line Indicator (0.50) */}
            <div
              className="absolute top-0 bottom-0 w-px bg-slate-300 z-0"
              style={{ left: '50%' }}
            />

            {/* Individual User Dots Sample */}
            <div className="absolute inset-0 flex items-center pointer-events-none px-2">
              {outcome.users
                .filter((_, idx) => idx % Math.max(1, Math.floor(outcome.users.length / 50)) === 0)
                .map((u) => (
                  <div
                    key={u.id}
                    className={`absolute h-2 w-2 rounded-full transform -translate-x-1/2 transition-colors ${
                      u.assignedTo === 'Brand A'
                        ? 'bg-blue-600/70'
                        : u.assignedTo === 'Brand B'
                        ? 'bg-emerald-600/70'
                        : 'bg-amber-500'
                    }`}
                    style={{ left: `${u.position * 100}%` }}
                    title={`User at ${u.position.toFixed(2)} -> ${u.assignedTo}`}
                  />
                ))}
            </div>

            {/* Brand A Pin */}
            <div
              className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300"
              style={{ left: `${positionA * 100}%` }}
            >
              <div className="flex flex-col items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md ring-4 ring-blue-100">
                  A
                </div>
                <span className="mt-1 font-mono text-[10px] font-bold text-blue-700 bg-white px-1 rounded shadow-xs border border-blue-200">
                  {positionA.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Brand B Pin */}
            <div
              className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300"
              style={{ left: `${positionB * 100}%` }}
            >
              <div className="flex flex-col items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md ring-4 ring-emerald-100">
                  B
                </div>
                <span className="mt-1 font-mono text-[10px] font-bold text-emerald-700 bg-white px-1 rounded shadow-xs border border-emerald-200">
                  {positionB.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Scale Axis Markers */}
          <div className="mt-3 flex justify-between text-[11px] font-mono text-slate-400">
            <span>0.0</span>
            <span>0.2</span>
            <span>0.4</span>
            <span>0.5 (Center)</span>
            <span>0.6</span>
            <span>0.8</span>
            <span>1.0</span>
          </div>
        </div>

        {/* Territory Share Summary Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-blue-700">
              Brand A Territory: {formatPercentage(outcome.analyticalShareA)}
            </span>
            <span className="text-emerald-700">
              Brand B Territory: {formatPercentage(outcome.analyticalShareB)}
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${outcome.analyticalShareA}%` }}
            />
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${outcome.analyticalShareB}%` }}
            />
          </div>
        </div>
      </div>

      {/* Controls & Best-Response Simulation Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders Box */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Positioning Controls</h3>
              <p className="text-xs text-slate-500">Manually locate advertisers along the [0, 1] line</p>
            </div>
            <button
              onClick={handleResetPositions}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              title="Reset positions"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <SliderControl
            label="Brand A Position (a)"
            value={positionA}
            min={0.0}
            max={1.0}
            step={0.01}
            accentColor="brandA"
            description="Location along intent spectrum"
            onChange={setPositionA}
          />

          <SliderControl
            label="Brand B Position (b)"
            value={positionB}
            min={0.0}
            max={1.0}
            step={0.01}
            accentColor="brandB"
            description="Location along intent spectrum"
            onChange={setPositionB}
          />

          <SliderControl
            label="Simulated Audience Users"
            value={numUsers}
            min={50}
            max={1000}
            step={50}
            unitSuffix=" users"
            accentColor="slate"
            description="Uniformly distributed consumer sample"
            onChange={setNumUsers}
          />

          <SliderControl
            label="Simulation Convergence Rounds"
            value={numRounds}
            min={1}
            max={10}
            step={1}
            unitSuffix=" rounds"
            accentColor="amber"
            description="Rounds for iterative best response"
            onChange={setNumRounds}
          />
        </div>

        {/* Algorithmic Best Responses & Convergence */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Algorithmic Best-Response Engine
                </h3>
                <p className="text-xs text-slate-500">
                  Evaluate all candidate locations to find the share-maximizing position
                </p>
              </div>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-900">
                Hotelling's Law
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Holding the rival fixed, each firm evaluates all positions in $[0, 1]$. To maximize
              market share, a firm positions itself immediately adjacent to the rival on the side with
              the larger captive territory. This creates an inward gravitational pull toward the median
              user ($x = 0.50$).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleStepBestResponseA}
                className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50/60 p-3 text-xs font-semibold text-blue-900 hover:bg-blue-100 transition-colors"
              >
                <StepForward className="h-4 w-4 text-blue-600" />
                <span>Calculate Best Response for Brand A</span>
              </button>

              <button
                onClick={handleStepBestResponseB}
                className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 transition-colors"
              >
                <StepForward className="h-4 w-4 text-emerald-600" />
                <span>Calculate Best Response for Brand B</span>
              </button>
            </div>

            <div className="mt-3">
              <button
                onClick={handleRunFullConvergence}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                <Play className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span>Run Iterative Best-Response Simulation ({numRounds} Rounds)</span>
              </button>
            </div>
          </div>

          {/* Social Welfare Insight */}
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 text-xs text-amber-950">
            <strong>Social Welfare & Keyword Congestion:</strong> When both firms crowd into the
            center ($0.50$), average user distance is $0.250$. If they differentiated at $0.25$ and
            $0.75$ (social optimum), average distance would drop by 50% to $0.125$.
            The Nash Equilibrium forces consumers at the market fringes to see mismatched ads!
          </div>
        </div>
      </div>

      {/* Trajectory History Table and Chart */}
      {history && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Convergence Trajectory Towards Minimum Differentiation
              </h3>
              <p className="text-xs text-slate-500">
                Step-by-step evolution of positions and market shares
              </p>
            </div>
            <button
              onClick={() => setHistory(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Close History
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trajectory Line Chart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trajectoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="round" tick={{ fontSize: 11, fill: '#475569' }} tickLine={false} />
                  <YAxis domain={[0, 1]} tick={{ fontSize: 11, fill: '#475569' }} tickLine={false} />
                  <Tooltip
                    formatter={(val: number) => [val.toFixed(2), '']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '0.75rem',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" />
                  <Line
                    type="monotone"
                    dataKey="Brand A Position"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Brand B Position"
                    stroke="#059669"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* History Table */}
            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 sticky top-0">
                    <th className="py-2 px-2.5 text-left font-semibold">Step</th>
                    <th className="py-2 px-2.5 text-left font-semibold text-blue-700">Pos A</th>
                    <th className="py-2 px-2.5 text-left font-semibold text-emerald-700">Pos B</th>
                    <th className="py-2 px-2.5 text-right font-semibold">Share A</th>
                    <th className="py-2 px-2.5 text-right font-semibold">Share B</th>
                    <th className="py-2 px-2.5 text-left font-semibold">Action Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((h, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2 px-2.5 font-mono font-bold text-slate-600">
                        #{h.round}
                      </td>
                      <td className="py-2 px-2.5 font-mono text-blue-600">
                        {h.positionA.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 font-mono text-emerald-600">
                        {h.positionB.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono text-blue-700">
                        {h.shareA.toFixed(1)}%
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono text-emerald-700">
                        {h.shareB.toFixed(1)}%
                      </td>
                      <td className="py-2 px-2.5 text-[11px] text-slate-600">
                        {h.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Minimum Differentiation vs Niche Positioning Callout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
            <Layers className="h-4 w-4 text-amber-600" />
            <span>Principle of Minimum Differentiation</span>
          </div>
          <h4 className="text-base font-bold text-slate-900">
            Why Everyone Chases the Same Broad Keyword
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            In keyword advertising, targeting broad, central terms (like "auto insurance" or "sneakers")
            provides exposure to the largest audience mass. When prices are fixed or platforms use
            standard auction rules, firms have an irresistible incentive to locate right where their
            competitors are, creating keyword clustering and escalating bid costs.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
            <Target className="h-4 w-4 text-blue-600" />
            <span>Niche Positioning & Long-Tail Keywords</span>
          </div>
          <h4 className="text-base font-bold text-slate-900">
            How Maximum Differentiation Softens Competition
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            In extended Hotelling models where prices are chosen simultaneously (d'Aspremont et al., 1979),
            locating at the same point causes cutthroat Bertrand price wars. To escape zero-profit price
            destruction, brands actively differentiate into niche, long-tail keywords (e.g. "vegan running shoes size 11"),
            securing high local monopoly margins.
          </p>
        </div>
      </div>

      {/* Standardized Global Results Panel */}
      <GlobalResultsPanel
        modelName="Hotelling's Model (Keyword Positioning)"
        parameters={[
          { label: 'Brand A Position (a)', value: positionA.toFixed(2) },
          { label: 'Brand B Position (b)', value: positionB.toFixed(2) },
          { label: 'Audience Users', value: `${numUsers} points` },
          { label: 'Transportation Cost', value: 'Linear d(x) = |x - p|' },
        ]}
        selectedStrategies={[
          { entity: 'Brand A Position', strategy: `x = ${positionA.toFixed(2)}`, colorClass: 'text-blue-600' },
          { entity: 'Brand B Position', strategy: `x = ${positionB.toFixed(2)}`, colorClass: 'text-emerald-600' },
        ]}
        outcomes={[
          { label: 'Brand A Market Share', value: formatPercentage(outcome.analyticalShareA) },
          { label: 'Brand B Market Share', value: formatPercentage(outcome.analyticalShareB) },
          { label: 'Indifference Cutoff (x̂)', value: outcome.cutoffPoint !== null ? outcome.cutoffPoint.toFixed(3) : 'Coincident' },
        ]}
        equilibrium={{
          status: atCenterEquilibrium
            ? 'At Spatial Nash Equilibrium (a* = b* = 0.50)'
            : 'Asymmetric / Differentiated State',
          isEquilibrium: atCenterEquilibrium,
          type: "Hotelling's Minimum Differentiation Equilibrium",
          details: atCenterEquilibrium
            ? 'Both advertisers occupy the median keyword at x = 0.50. Each captures exactly 50% of audience. Neither firm can improve its market share by moving away.'
            : 'Firms occupy separated keyword positions. The firm positioned closer to the market center commands a larger share of the audience.',
        }}
      />

      {/* Section 8: Collapsible Understand the Mathematics */}
      <MathExplanation
        modelTitle="Hotelling's Linear City Positioning Model"
        gameType="Spatial Competition Game on Continuous Unit Interval [0, 1]"
        variables={[
          {
            symbol: 'x \\in [0, 1]',
            name: 'Consumer / User Keyword Intent',
            description: 'Location of a user searching for ads along the preference spectrum',
            unit: 'Normalized coordinate',
          },
          {
            symbol: 'a, b \\in [0, 1]',
            name: 'Advertiser Keyword Positions',
            description: 'Strategic positioning coordinates chosen by Brand A and Brand B',
            unit: 'Normalized coordinate',
          },
          {
            symbol: 'd_i(x) = |x - p_i|',
            name: 'Audience Mismatch Distance',
            description: 'Psychological or relevance distance between user intent and ad creative',
          },
          {
            symbol: '\\hat{x}',
            name: 'Indifferent Consumer Cutoff',
            description: 'The exact coordinate where a user is indifferent between Brand A and Brand B: (a + b) / 2',
          },
          {
            symbol: 'S_A(a, b)',
            name: 'Brand A Market Share',
            description: 'Fraction of total audience captured by Brand A under uniform user density',
            unit: '%',
          },
        ]}
        equations={[
          {
            label: 'Indifferent Consumer Boundary Equation',
            formula: '|\\hat{x} - a| = |\\hat{x} - b| \\implies \\hat{x} = \\frac{a + b}{2} \\quad (\\text{for } a < b)',
            explanation:
              'Because transport costs are linear, the user at the midpoint between the two advertisers is equally attracted to both.',
          },
          {
            label: 'Market Share Demand Function for Firm A',
            formula: 'S_A(a, b) = \\begin{cases} \\frac{a + b}{2} & \\text{if } a < b \\\\ 1 - \\frac{a + b}{2} & \\text{if } a > b \\\\ \\frac{1}{2} & \\text{if } a = b \\end{cases}',
            explanation:
              'Firm A captures all users to its left [0, a] plus half the distance between itself and Firm B [a, (a+b)/2].',
          },
          {
            label: 'Hotelling Minimum Differentiation Nash Equilibrium',
            formula: 'a^* = b^* = 0.50 \\implies S_A(0.5, 0.5) = S_B(0.5, 0.5) = 50\\%',
            explanation:
              'When firms compete on location with fixed prices, any firm away from 0.50 can gain market share by moving toward the center. 0.50 is the unique Nash Equilibrium.',
          },
        ]}
        assumptions={[
          {
            title: 'Uniform Consumer Distribution',
            detail: 'User intent is uniformly distributed with constant density f(x) = 1 along the line [0, 1].',
          },
          {
            title: 'Linear Distance Cost',
            detail: 'Utility loss to the user is strictly proportional to distance: Utility = V - t * |x - p|.',
          },
          {
            title: 'Exogenous / Equal Ad Pricing',
            detail: 'Advertisers compete purely on audience relevance and positioning without varying CPC prices in the baseline model.',
          },
          {
            title: 'Complete Market Coverage',
            detail: 'Every consumer searches for keywords and clicks on their nearest relevant ad.',
          },
        ]}
        calculationSteps={[
          "Sort positions: Assume without loss of generality that a <= b.",
          "Compute boundary cutoff point: midpoint = (a + b) / 2.",
          "For discrete user simulation: Iterate through N users; calculate |x - a| and |x - b|; assign user to closest firm.",
          "Compute market shares: Count clicks for A and B; normalize by total user population.",
          "Calculate average mismatch: Sum winning distances and divide by total users.",
          "Find best response: Grid search candidate coordinates in [0, 1] to maximize share given rival's position.",
        ]}
        resultInterpretation="Hotelling's model demonstrates that competitors in two-firm spatial games are incentivized to mimic each other's positioning rather than spread out to serve niche segments, creating keyword crowding."
        advertisingConnection="In digital marketing, ad copy and landing pages tend to homogenize around the broadest commercial queries ('cheap flights', 'best credit card') to capture maximum traffic volume, even though niche differentiation would provide better relevance for specialized search queries."
      />
    </div>
  );
};
