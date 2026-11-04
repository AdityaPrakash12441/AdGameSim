export interface UserPoint {
  id: number;
  position: number;
  distanceA: number;
  distanceB: number;
  assignedTo: 'Brand A' | 'Brand B' | 'Split';
  winningDistance: number;
}

export interface HotellingOutcome {
  positionA: number;
  positionB: number;
  users: UserPoint[];
  clicksA: number;
  clicksB: number;
  shareA: number; // percentage 0-100
  shareB: number; // percentage 0-100
  analyticalShareA: number;
  analyticalShareB: number;
  cutoffPoint: number | null; // midpoint if a != b
  averageDistanceA: number;
  averageDistanceB: number;
  overallAverageDistance: number;
  socialOptimumAverageDistance: number;
}

export interface HotellingRoundHistory {
  round: number;
  positionA: number;
  positionB: number;
  shareA: number;
  shareB: number;
  actingBrand: 'Brand A' | 'Brand B' | 'Initial';
  description: string;
}

/**
 * Generates uniformly spaced user positions in [0, 1].
 */
export function generateUsers(numUsers: number): number[] {
  const users: number[] = [];
  for (let i = 0; i < numUsers; i++) {
    // Centered in each bin for representative uniform distribution
    users.push(Number(((i + 0.5) / numUsers).toFixed(4)));
  }
  return users;
}

/**
 * Calculates user allocation and market shares for given advertiser positions.
 */
export function calculateHotelling(
  posA: number,
  posB: number,
  numUsers: number = 200
): HotellingOutcome {
  // Clamp positions to [0, 1]
  const a = Math.max(0, Math.min(1, Number(posA.toFixed(3))));
  const b = Math.max(0, Math.min(1, Number(posB.toFixed(3))));

  const userPositions = generateUsers(numUsers);
  let clicksA = 0;
  let clicksB = 0;
  let totalDistanceA = 0;
  let totalDistanceB = 0;
  let totalWinningDistance = 0;

  const users: UserPoint[] = userPositions.map((x, idx) => {
    const distanceA = Math.abs(x - a);
    const distanceB = Math.abs(x - b);
    let assignedTo: 'Brand A' | 'Brand B' | 'Split' = 'Split';
    let winningDistance = 0;

    const diff = Number((distanceA - distanceB).toFixed(5));

    if (diff < 0) {
      assignedTo = 'Brand A';
      clicksA += 1;
      winningDistance = distanceA;
      totalDistanceA += distanceA;
    } else if (diff > 0) {
      assignedTo = 'Brand B';
      clicksB += 1;
      winningDistance = distanceB;
      totalDistanceB += distanceB;
    } else {
      assignedTo = 'Split';
      clicksA += 0.5;
      clicksB += 0.5;
      winningDistance = distanceA;
      totalDistanceA += distanceA * 0.5;
      totalDistanceB += distanceB * 0.5;
    }

    totalWinningDistance += winningDistance;

    return {
      id: idx,
      position: x,
      distanceA: Number(distanceA.toFixed(4)),
      distanceB: Number(distanceB.toFixed(4)),
      assignedTo,
      winningDistance: Number(winningDistance.toFixed(4)),
    };
  });

  const shareA = (clicksA / numUsers) * 100;
  const shareB = (clicksB / numUsers) * 100;

  // Analytical market shares under continuous uniform [0, 1] distribution
  let analyticalShareA = 50;
  let analyticalShareB = 50;
  let cutoffPoint: number | null = null;

  if (Math.abs(a - b) < 0.0001) {
    analyticalShareA = 50;
    analyticalShareB = 50;
    cutoffPoint = a;
  } else if (a < b) {
    cutoffPoint = Number(((a + b) / 2).toFixed(4));
    analyticalShareA = cutoffPoint * 100;
    analyticalShareB = (1 - cutoffPoint) * 100;
  } else {
    cutoffPoint = Number(((a + b) / 2).toFixed(4));
    analyticalShareB = cutoffPoint * 100;
    analyticalShareA = (1 - cutoffPoint) * 100;
  }

  const avgDistA = clicksA > 0 ? totalDistanceA / clicksA : 0;
  const avgDistB = clicksB > 0 ? totalDistanceB / clicksB : 0;
  const overallAvgDist = totalWinningDistance / numUsers;

  // Social optimum locations are 0.25 and 0.75, where average distance is 0.125
  const socialOptimumAverageDistance = 0.125;

  return {
    positionA: a,
    positionB: b,
    users,
    clicksA,
    clicksB,
    shareA: Number(shareA.toFixed(2)),
    shareB: Number(shareB.toFixed(2)),
    analyticalShareA: Number(analyticalShareA.toFixed(2)),
    analyticalShareB: Number(analyticalShareB.toFixed(2)),
    cutoffPoint,
    averageDistanceA: Number(avgDistA.toFixed(4)),
    averageDistanceB: Number(avgDistB.toFixed(4)),
    overallAverageDistance: Number(overallAvgDist.toFixed(4)),
    socialOptimumAverageDistance,
  };
}

/**
 * Evaluates candidate positions for Brand A holding Brand B fixed,
 * and programmatically finds the position that maximizes Brand A's audience share.
 * Discretization step controls grid resolution.
 */
export function findBestResponseForA(
  currentPosB: number,
  gridStep: number = 0.01,
  minSeparation: number = 0.02
): { bestPosition: number; maxShare: number } {
  let bestPosition = 0.5;
  let maxShare = -1;

  // Evaluate candidate positions from 0 to 1
  for (let candidate = 0; candidate <= 1.0001; candidate += gridStep) {
    const posA = Number(candidate.toFixed(3));
    
    // In spatial games, choosing the exact same position splits 50/50.
    // If firm wants to capture the majority side, it positions minSeparation to the left or right of B.
    const outcome = calculateHotelling(posA, currentPosB, 200);

    // Prefer strictly greater share; if tied, prefer position closest to current/center
    if (outcome.analyticalShareA > maxShare) {
      maxShare = outcome.analyticalShareA;
      bestPosition = posA;
    } else if (Math.abs(outcome.analyticalShareA - maxShare) < 0.001) {
      // Tie breaker: choose the one with shorter user mismatch or nearer center
      if (Math.abs(posA - 0.5) < Math.abs(bestPosition - 0.5)) {
        bestPosition = posA;
      }
    }
  }

  // To prevent numerical grid quantization quirks where posA = posB exactly,
  // we ensure that if stepping towards B, A steps just inside the larger segment:
  if (Math.abs(bestPosition - currentPosB) < gridStep) {
    if (currentPosB > 0.5) {
      bestPosition = Math.max(0, Number((currentPosB - minSeparation).toFixed(3)));
    } else if (currentPosB < 0.5) {
      bestPosition = Math.min(1, Number((currentPosB + minSeparation).toFixed(3)));
    } else {
      bestPosition = 0.5;
    }
    const finalCalc = calculateHotelling(bestPosition, currentPosB, 200);
    maxShare = finalCalc.analyticalShareA;
  }

  return { bestPosition, maxShare };
}

/**
 * Evaluates candidate positions for Brand B holding Brand A fixed,
 * and programmatically finds the position that maximizes Brand B's audience share.
 */
export function findBestResponseForB(
  currentPosA: number,
  gridStep: number = 0.01,
  minSeparation: number = 0.02
): { bestPosition: number; maxShare: number } {
  let bestPosition = 0.5;
  let maxShare = -1;

  for (let candidate = 0; candidate <= 1.0001; candidate += gridStep) {
    const posB = Number(candidate.toFixed(3));
    const outcome = calculateHotelling(currentPosA, posB, 200);

    if (outcome.analyticalShareB > maxShare) {
      maxShare = outcome.analyticalShareB;
      bestPosition = posB;
    } else if (Math.abs(outcome.analyticalShareB - maxShare) < 0.001) {
      if (Math.abs(posB - 0.5) < Math.abs(bestPosition - 0.5)) {
        bestPosition = posB;
      }
    }
  }

  if (Math.abs(bestPosition - currentPosA) < gridStep) {
    if (currentPosA > 0.5) {
      bestPosition = Math.max(0, Number((currentPosA - minSeparation).toFixed(3)));
    } else if (currentPosA < 0.5) {
      bestPosition = Math.min(1, Number((currentPosA + minSeparation).toFixed(3)));
    } else {
      bestPosition = 0.5;
    }
    const finalCalc = calculateHotelling(currentPosA, bestPosition, 200);
    maxShare = finalCalc.analyticalShareB;
  }

  return { bestPosition, maxShare };
}

/**
 * Simulates iterative best-response dynamics over multiple rounds.
 */
export function simulateHotellingDynamics(
  startPosA: number,
  startPosB: number,
  numRounds: number = 5
): HotellingRoundHistory[] {
  const history: HotellingRoundHistory[] = [];

  let curA = startPosA;
  let curB = startPosB;

  const initOutcome = calculateHotelling(curA, curB);
  history.push({
    round: 0,
    positionA: curA,
    positionB: curB,
    shareA: initOutcome.analyticalShareA,
    shareB: initOutcome.analyticalShareB,
    actingBrand: 'Initial',
    description: `Starting configuration: Brand A at ${curA.toFixed(2)}, Brand B at ${curB.toFixed(2)}.`,
  });

  for (let r = 1; r <= numRounds; r++) {
    // Brand A best responds to Brand B
    const brA = findBestResponseForA(curB);
    curA = brA.bestPosition;
    let outcome = calculateHotelling(curA, curB);

    history.push({
      round: r * 2 - 1,
      positionA: curA,
      positionB: curB,
      shareA: outcome.analyticalShareA,
      shareB: outcome.analyticalShareB,
      actingBrand: 'Brand A',
      description: `Brand A shifts to ${curA.toFixed(2)} to maximize share against B (${brA.maxShare.toFixed(1)}%).`,
    });

    // Check convergence to center (0.5, 0.5)
    if (Math.abs(curA - 0.5) < 0.02 && Math.abs(curB - 0.5) < 0.02) {
      break;
    }

    // Brand B best responds to Brand A
    const brB = findBestResponseForB(curA);
    curB = brB.bestPosition;
    outcome = calculateHotelling(curA, curB);

    history.push({
      round: r * 2,
      positionA: curA,
      positionB: curB,
      shareA: outcome.analyticalShareA,
      shareB: outcome.analyticalShareB,
      actingBrand: 'Brand B',
      description: `Brand B shifts to ${curB.toFixed(2)} to capture the larger segment (${brB.maxShare.toFixed(1)}%).`,
    });

    if (Math.abs(curA - 0.5) < 0.02 && Math.abs(curB - 0.5) < 0.02) {
      break;
    }
  }

  return history;
}
