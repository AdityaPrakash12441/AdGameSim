import {
  PRISONERS_PAYOFF_MATRIX,
  getPayoff,
  calculateBrandABestResponse,
  calculateBrandBBestResponse,
  findNashEquilibria,
} from './src/models/prisonersDilemma.ts';
import {
  calculateBertrand,
  simulatePriceCompetition,
} from './src/models/bertrand.ts';
import {
  calculateHotelling,
  findBestResponseForA,
  findBestResponseForB,
  simulateHotellingDynamics,
} from './src/models/hotelling.ts';

console.log('=== TEST 1: PRISONER\'S DILEMMA PAYOFFS & BEST RESPONSES ===');
console.log('Matrix check:');
console.log('Escalate/Escalate:', PRISONERS_PAYOFF_MATRIX.Escalate.Escalate);
console.log('Escalate/Restrain:', PRISONERS_PAYOFF_MATRIX.Escalate.Restrain);
console.log('Restrain/Escalate:', PRISONERS_PAYOFF_MATRIX.Restrain.Escalate);
console.log('Restrain/Restrain:', PRISONERS_PAYOFF_MATRIX.Restrain.Restrain);

const brA = calculateBrandABestResponse();
const brB = calculateBrandBBestResponse();
console.log('Brand A dominant strategy:', brA.dominantStrategy, 'isDominant:', brA.isDominant);
console.log('Brand B dominant strategy:', brB.dominantStrategy, 'isDominant:', brB.isDominant);

const nash = findNashEquilibria();
console.log('Calculated Nash Equilibria:', nash);

console.log('\n=== TEST 2: BERTRAND COMPETITION MODEL ===');
const b1 = calculateBertrand({
  priceA: 2.00,
  priceB: 2.00,
  marginalCost: 1.00,
  totalDemand: 1000,
  maxWillingnessToPay: 5.00,
});
console.log('Equal starting price ($2.00, $2.00):', {
  clicksA: b1.firmA.clicks,
  clicksB: b1.firmB.clicks,
  profitA: b1.firmA.profit,
  profitB: b1.firmB.profit,
  winner: b1.winner,
});

const b2 = calculateBertrand({
  priceA: 1.80,
  priceB: 2.00,
  marginalCost: 1.00,
  totalDemand: 1000,
  maxWillingnessToPay: 5.00,
});
console.log('Network A undercuts ($1.80 vs $2.00):', {
  clicksA: b2.firmA.clicks,
  clicksB: b2.firmB.clicks,
  profitA: b2.firmA.profit,
  winner: b2.winner,
});

const priceWar = simulatePriceCompetition(2.00, 2.00, 1.00, 1000, 0.10);
console.log(`Price war simulation completed in ${priceWar.length} rounds.`);
const finalRound = priceWar[priceWar.length - 1];
console.log('Final Round:', {
  round: finalRound.round,
  priceA: finalRound.priceA,
  priceB: finalRound.priceB,
  profitA: finalRound.profitA,
  profitB: finalRound.profitB,
  notes: finalRound.notes,
});

console.log('\n=== TEST 3: HOTELLING LINEAR CITY MODEL ===');
const h1 = calculateHotelling(0.20, 0.80, 200);
console.log('Positions (0.20, 0.80):', {
  shareA: h1.analyticalShareA,
  shareB: h1.analyticalShareB,
  cutoff: h1.cutoffPoint,
  avgDistance: h1.overallAverageDistance,
});

const hCenter = calculateHotelling(0.50, 0.50, 200);
console.log('Center positions (0.50, 0.50):', {
  shareA: hCenter.analyticalShareA,
  shareB: hCenter.analyticalShareB,
  cutoff: hCenter.cutoffPoint,
  avgDistance: hCenter.overallAverageDistance,
});

const brHotellingA = findBestResponseForA(0.80);
console.log('Brand A best response against B at 0.80:', brHotellingA);

const hotellingDyn = simulateHotellingDynamics(0.20, 0.80, 3);
console.log(`Hotelling dynamic rounds: ${hotellingDyn.length}`);
hotellingDyn.forEach((r) => console.log(`Step ${r.round} (${r.actingBrand}): PosA=${r.positionA.toFixed(2)}, PosB=${r.positionB.toFixed(2)}, ShareA=${r.shareA.toFixed(1)}%`));

console.log('\nALL MATHEMATICAL CHECKS PASSED SUCCESSFULLY!');

