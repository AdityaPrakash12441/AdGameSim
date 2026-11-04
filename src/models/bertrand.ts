export interface BertrandParams {
  priceA: number;
  priceB: number;
  marginalCost: number;
  totalDemand: number;
  maxWillingnessToPay: number;
}

export interface BertrandFirmResult {
  price: number;
  clicks: number;
  revenue: number;
  cost: number;
  profit: number;
  marketShare: number;
}

export interface BertrandOutcome {
  firmA: BertrandFirmResult;
  firmB: BertrandFirmResult;
  totalRevenue: number;
  totalIndustryProfit: number;
  winner: 'Network A' | 'Network B' | 'Split' | 'None';
  equilibriumStatus: 'Above Equilibrium' | 'Nash Equilibrium (P = MC)' | 'Sub-marginal (Loss)';
}

export interface PriceWarRound {
  round: number;
  priceA: number;
  priceB: number;
  clicksA: number;
  clicksB: number;
  profitA: number;
  profitB: number;
  winner: string;
  notes: string;
}

/**
 * Calculates single-period Bertrand competition outcome.
 */
export function calculateBertrand(params: BertrandParams): BertrandOutcome {
  const { priceA, priceB, marginalCost, totalDemand, maxWillingnessToPay } = params;

  // Demand drops to 0 if price exceeds max willingness to pay
  const validA = priceA <= maxWillingnessToPay;
  const validB = priceB <= maxWillingnessToPay;

  let clicksA = 0;
  let clicksB = 0;
  let winner: 'Network A' | 'Network B' | 'Split' | 'None' = 'None';

  if (!validA && !validB) {
    winner = 'None';
  } else if (!validA) {
    clicksB = totalDemand;
    winner = 'Network B';
  } else if (!validB) {
    clicksA = totalDemand;
    winner = 'Network A';
  } else {
    // Both are within willingness to pay
    // Comparing with small epsilon to account for floating point precision
    const priceDiff = Number((priceA - priceB).toFixed(4));

    if (priceDiff < 0) {
      // Price A is strictly lower
      clicksA = totalDemand;
      clicksB = 0;
      winner = 'Network A';
    } else if (priceDiff > 0) {
      // Price B is strictly lower
      clicksA = 0;
      clicksB = totalDemand;
      winner = 'Network B';
    } else {
      // Equal prices: demand is split 50/50
      clicksA = totalDemand / 2;
      clicksB = totalDemand / 2;
      winner = 'Split';
    }
  }

  const revenueA = priceA * clicksA;
  const costA = marginalCost * clicksA;
  const profitA = revenueA - costA;
  const marketShareA = totalDemand > 0 ? (clicksA / totalDemand) * 100 : 0;

  const revenueB = priceB * clicksB;
  const costB = marginalCost * clicksB;
  const profitB = revenueB - costB;
  const marketShareB = totalDemand > 0 ? (clicksB / totalDemand) * 100 : 0;

  let equilibriumStatus: 'Above Equilibrium' | 'Nash Equilibrium (P = MC)' | 'Sub-marginal (Loss)' =
    'Above Equilibrium';

  const atEquilibrium =
    Math.abs(priceA - marginalCost) < 0.001 && Math.abs(priceB - marginalCost) < 0.001;
  const subMarginal = priceA < marginalCost || priceB < marginalCost;

  if (atEquilibrium) {
    equilibriumStatus = 'Nash Equilibrium (P = MC)';
  } else if (subMarginal) {
    equilibriumStatus = 'Sub-marginal (Loss)';
  }

  return {
    firmA: {
      price: priceA,
      clicks: clicksA,
      revenue: revenueA,
      cost: costA,
      profit: profitA,
      marketShare: marketShareA,
    },
    firmB: {
      price: priceB,
      clicks: clicksB,
      revenue: revenueB,
      cost: costB,
      profit: profitB,
      marketShare: marketShareB,
    },
    totalRevenue: revenueA + revenueB,
    totalIndustryProfit: profitA + profitB,
    winner,
    equilibriumStatus,
  };
}

/**
 * Simulates a sequential price-undercutting war until both networks reach marginal cost.
 */
export function simulatePriceCompetition(
  initialPriceA: number,
  initialPriceB: number,
  marginalCost: number,
  totalDemand: number,
  step: number = 0.10,
  maxRounds: number = 25
): PriceWarRound[] {
  const rounds: PriceWarRound[] = [];
  let curA = Math.max(initialPriceA, marginalCost);
  let curB = Math.max(initialPriceB, marginalCost);

  for (let r = 1; r <= maxRounds; r++) {
    const outcome = calculateBertrand({
      priceA: curA,
      priceB: curB,
      marginalCost,
      totalDemand,
      maxWillingnessToPay: 10,
    });

    let notes = '';
    const atEquilibrium =
      Math.abs(curA - marginalCost) < 0.001 && Math.abs(curB - marginalCost) < 0.001;

    if (r === 1) {
      notes =
        curA === curB
          ? `Equal starting CPC ($${curA.toFixed(2)}). 50/50 split.`
          : curA < curB
          ? `Network A leads with lower CPC ($${curA.toFixed(2)}).`
          : `Network B leads with lower CPC ($${curB.toFixed(2)}).`;
    } else if (atEquilibrium) {
      notes = `Bertrand Nash Equilibrium reached: P = MC ($${marginalCost.toFixed(2)}). Zero economic profit.`;
    } else if (outcome.winner === 'Network A') {
      notes = `Network A captures market. Network B has incentive to undercut.`;
    } else if (outcome.winner === 'Network B') {
      notes = `Network B captures market. Network A has incentive to undercut.`;
    } else {
      notes = `Prices tied above MC. Both networks have incentive to undercut by $${step.toFixed(2)}.`;
    }

    rounds.push({
      round: r,
      priceA: Number(curA.toFixed(2)),
      priceB: Number(curB.toFixed(2)),
      clicksA: outcome.firmA.clicks,
      clicksB: outcome.firmB.clicks,
      profitA: Number(outcome.firmA.profit.toFixed(2)),
      profitB: Number(outcome.firmB.profit.toFixed(2)),
      winner: outcome.winner,
      notes,
    });

    if (atEquilibrium) {
      break;
    }

    // Undercutting dynamics for next round:
    // If prices differ, the higher-price firm cuts below the lower firm
    // If prices are equal and above MC, both firms attempt to undercut
    if (Math.abs(curA - curB) < 0.001) {
      // Both firms undercut simultaneously or one initiates
      const nextPrice = Math.max(marginalCost, Number((curA - step).toFixed(2)));
      curA = nextPrice;
      curB = nextPrice;
    } else if (curA > curB) {
      // Network A undercuts Network B
      curA = Math.max(marginalCost, Number((curB - step).toFixed(2)));
    } else {
      // Network B undercuts Network A
      curB = Math.max(marginalCost, Number((curA - step).toFixed(2)));
    }
  }

  return rounds;
}

