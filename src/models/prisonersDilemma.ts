export type Strategy = 'Escalate' | 'Restrain';

export interface PayoffOutcome {
  brandAProfit: number;
  brandBProfit: number;
  combinedProfit: number;
}

export interface BestResponseResult {
  bestResponseToEscalate: Strategy;
  bestResponseToRestrain: Strategy;
  dominantStrategy: Strategy | null;
  isDominant: boolean;
}

export interface NashEquilibriumResult {
  strategyA: Strategy;
  strategyB: Strategy;
  payoffA: number;
  payoffB: number;
  isParetoOptimal: boolean;
}

// Payoff Matrix from college presentation (Annual profit in millions of dollars)
// Matrix[StrategyA][StrategyB] = [PayoffA, PayoffB]
export const PRISONERS_PAYOFF_MATRIX: Record<Strategy, Record<Strategy, [number, number]>> = {
  Escalate: {
    Escalate: [2, 2],
    Restrain: [6, 0],
  },
  Restrain: {
    Escalate: [0, 6],
    Restrain: [4, 4],
  },
};

export const STRATEGIES: Strategy[] = ['Escalate', 'Restrain'];

/**
 * Returns payoff for a given strategy pair.
 */
export function getPayoff(strategyA: Strategy, strategyB: Strategy): PayoffOutcome {
  const [profitA, profitB] = PRISONERS_PAYOFF_MATRIX[strategyA][strategyB];
  return {
    brandAProfit: profitA,
    brandBProfit: profitB,
    combinedProfit: profitA + profitB,
  };
}

/**
 * Compute best responses for Brand A against both potential strategies of Brand B.
 * Evaluates whether a dominant strategy exists.
 */
export function calculateBrandABestResponse(): BestResponseResult {
  // If B escalates: A compares Escalate (2) vs Restrain (0)
  const brToEscalate: Strategy =
    PRISONERS_PAYOFF_MATRIX['Escalate']['Escalate'][0] >= PRISONERS_PAYOFF_MATRIX['Restrain']['Escalate'][0]
      ? 'Escalate'
      : 'Restrain';

  // If B restrains: A compares Escalate (6) vs Restrain (4)
  const brToRestrain: Strategy =
    PRISONERS_PAYOFF_MATRIX['Escalate']['Restrain'][0] >= PRISONERS_PAYOFF_MATRIX['Restrain']['Restrain'][0]
      ? 'Escalate'
      : 'Restrain';

  const isDominant = brToEscalate === brToRestrain;
  const dominantStrategy = isDominant ? brToEscalate : null;

  return {
    bestResponseToEscalate: brToEscalate,
    bestResponseToRestrain: brToRestrain,
    dominantStrategy,
    isDominant,
  };
}

/**
 * Compute best responses for Brand B against both potential strategies of Brand A.
 */
export function calculateBrandBBestResponse(): BestResponseResult {
  // If A escalates: B compares Escalate (2) vs Restrain (0)
  const brToEscalate: Strategy =
    PRISONERS_PAYOFF_MATRIX['Escalate']['Escalate'][1] >= PRISONERS_PAYOFF_MATRIX['Escalate']['Restrain'][1]
      ? 'Escalate'
      : 'Restrain';

  // If A restrains: B compares Escalate (6) vs Restrain (4)
  const brToRestrain: Strategy =
    PRISONERS_PAYOFF_MATRIX['Restrain']['Escalate'][1] >= PRISONERS_PAYOFF_MATRIX['Restrain']['Restrain'][1]
      ? 'Escalate'
      : 'Restrain';

  const isDominant = brToEscalate === brToRestrain;
  const dominantStrategy = isDominant ? brToEscalate : null;

  return {
    bestResponseToEscalate: brToEscalate,
    bestResponseToRestrain: brToRestrain,
    dominantStrategy,
    isDominant,
  };
}

/**
 * Finds all pure-strategy Nash Equilibria programmatically.
 * A profile (sA, sB) is a Nash Equilibrium if:
 * u_A(sA, sB) >= u_A(sA', sB) for all sA' AND
 * u_B(sA, sB) >= u_B(sA, sB') for all sB'
 */
export function findNashEquilibria(): NashEquilibriumResult[] {
  const equilibria: NashEquilibriumResult[] = [];

  for (const sA of STRATEGIES) {
    for (const sB of STRATEGIES) {
      const currentPayoff = PRISONERS_PAYOFF_MATRIX[sA][sB];

      // Check if A has any profitable deviation
      const aDeviations = STRATEGIES.map((altA) => PRISONERS_PAYOFF_MATRIX[altA][sB][0]);
      const isABest = currentPayoff[0] === Math.max(...aDeviations);

      // Check if B has any profitable deviation
      const bDeviations = STRATEGIES.map((altB) => PRISONERS_PAYOFF_MATRIX[sA][altB][1]);
      const isBBest = currentPayoff[1] === Math.max(...bDeviations);

      if (isABest && isBBest) {
        // Check Pareto optimality: Is there another outcome where both are >= and at least one is > ?
        let isPareto = true;
        for (const testA of STRATEGIES) {
          for (const testB of STRATEGIES) {
            const testPayoff = PRISONERS_PAYOFF_MATRIX[testA][testB];
            if (
              (testPayoff[0] > currentPayoff[0] && testPayoff[1] >= currentPayoff[1]) ||
              (testPayoff[0] >= currentPayoff[0] && testPayoff[1] > currentPayoff[1])
            ) {
              isPareto = false;
              break;
            }
          }
          if (!isPareto) break;
        }

        equilibria.push({
          strategyA: sA,
          strategyB: sB,
          payoffA: currentPayoff[0],
          payoffB: currentPayoff[1],
          isParetoOptimal: isPareto,
        });
      }
    }
  }

  return equilibria;
}
