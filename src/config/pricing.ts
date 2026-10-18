/** AraratPay's single transaction fee on every flow. */
export const flatFeeRate = 0.01;
export const flatFeeLabel = "1%";

/** Typical published card-processing rates, illustrative comparison only. */
export const cardComparison = {
  cardRate: 0.029,
  cardFixedFee: 0.30,
  estimatedTransactionsPerMonth: 100,
  illustrativeChargebackCost: 15,
  illustrativeChargebackCount: 2,
} as const;

/** Illustrative effective-fee bands for the homepage gauge. */
export const illustrativeFeeBands = { lowMax: 0.015, averageMax: 0.025, gaugeMax: 0.04 } as const;
