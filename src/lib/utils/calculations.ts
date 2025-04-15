/**
 * Utility functions for EV charging calculations
 */

/**
 * Calculates the effective range of an EV in kilometers
 */
export function calculateEffectiveRange({
  batteryKwh,
  consumptionKwhPer100km,
  usableFraction = 0.9
}: {
  batteryKwh: number;
  consumptionKwhPer100km: number;
  usableFraction?: number;
}): number {
  // Calculate how far the vehicle can go on a single charge
  const effectiveRangeKm = ((batteryKwh * usableFraction) / consumptionKwhPer100km) * 100;
  return Number(effectiveRangeKm.toFixed(2));
}

/**
 * Calculates weekly charges needed based on driving distance and vehicle range
 */
export function calculateWeeklyCharges({
  weeklyDistanceKm,
  effectiveRangeKm
}: {
  weeklyDistanceKm: number;
  effectiveRangeKm: number;
}): number {
  if (effectiveRangeKm <= 0) return 0;

  // Calculate the basic number of charges
  const basicCharges = Math.ceil(weeklyDistanceKm / effectiveRangeKm);

  // If range is very close to weekly distance (within 10%), add an extra charge for safety
  const threshold = 0.1; // 10% threshold
  const isCloseToLimit =
    basicCharges > 0 && weeklyDistanceKm / effectiveRangeKm > 1 - threshold && weeklyDistanceKm / effectiveRangeKm < 1;

  return isCloseToLimit ? basicCharges + 1 : basicCharges;
}

/**
 * Estimates the number of EV charges required per week based on driving habits and vehicle specifications
 */
export function weeklyEvChargeEstimator({
  weeklyDistanceKm,
  batteryKwh,
  consumptionKwhPer100km,
  usableFraction = 0.9
}: {
  weeklyDistanceKm: number;
  batteryKwh: number;
  consumptionKwhPer100km: number;
  usableFraction?: number;
}) {
  const effectiveRangeKm = calculateEffectiveRange({
    batteryKwh,
    consumptionKwhPer100km,
    usableFraction
  });

  const weeklyCharges = calculateWeeklyCharges({
    weeklyDistanceKm,
    effectiveRangeKm
  });

  const co2Savings = calculateCO2Savings({
    weeklyDistanceKm
  });

  return {
    effectiveRangeKm,
    weeklyCharges,
    co2Savings
  };
}

/**
 * Calculates the estimated annual charging costs
 */
export function calculateAnnualChargingCost({
  weeklyCharges,
  batteryKwh,
  costPerKwh = 0.3,
  usableFraction = 0.9
}: {
  weeklyCharges: number;
  batteryKwh: number;
  costPerKwh: number;
  usableFraction?: number;
}): number {
  const energyPerCharge = batteryKwh * usableFraction;
  const weeklyCost = weeklyCharges * energyPerCharge * costPerKwh;
  const annualCost = weeklyCost * 52;

  return Number(annualCost.toFixed(2));
}

/**
 * Calculates the CO2 emissions saved compared to a gasoline vehicle
 */
export function calculateCO2Savings({
  weeklyDistanceKm,
  gasolineEmissionsGramPerKm = 120,
  electricityEmissionsGramPerKm = 30
}: {
  weeklyDistanceKm: number;
  gasolineEmissionsGramPerKm?: number;
  electricityEmissionsGramPerKm?: number;
}): number {
  const annualDistanceKm = weeklyDistanceKm * 52;
  const gasolineEmissionsKg = (annualDistanceKm * gasolineEmissionsGramPerKm) / 1000;
  const electricityEmissionsKg = (annualDistanceKm * electricityEmissionsGramPerKm) / 1000;
  const savingsKg = gasolineEmissionsKg - electricityEmissionsKg;

  return Number(savingsKg.toFixed(2));
}

/**
 * Calculates charging time and energy needed to charge an EV battery
 */
export function calculateChargingTime({
  batteryKwh,
  initialCharge,
  targetCharge,
  chargingPower,
  chargingEfficiency,
  temperatureC = 20, // Default to room temperature (20°C)
  phases = 3 // Default to 3-phase charging
}: {
  batteryKwh: number;
  initialCharge: number; // percentage
  targetCharge: number; // percentage
  chargingPower: number; // kW
  chargingEfficiency: number; // percentage
  temperatureC?: number; // Temperature in Celsius
  phases?: number; // Number of charging phases (1, 2, or 3)
}): {
  chargingTimeHours: number;
  chargingTimeMinutes: number;
  energyNeeded: number;
  technicalLimitExceeded?: boolean;
  actualChargingPower: number;
  limitingFactor?: 'c-rate' | 'phases' | 'temperature' | null;
} {
  // Apply phase-based power limitations
  const phaseBasedPower = applyPhaseLimitation(chargingPower, phases);

  // Check if charging power exceeds technical limits
  const technicalLimit = getMaxChargingPower(batteryKwh);
  const technicalLimitExceeded = phaseBasedPower > technicalLimit;

  // Get the actual charging power after applying all limitations
  let actualChargingPower = phaseBasedPower;
  let limitingFactor: 'c-rate' | 'phases' | 'temperature' | null = null;

  // Determine which factor is limiting the charging power
  if (phaseBasedPower < chargingPower) {
    limitingFactor = 'phases';
    actualChargingPower = phaseBasedPower;
  }

  if (technicalLimitExceeded) {
    limitingFactor = 'c-rate';
    actualChargingPower = technicalLimit;
  }

  // Apply temperature effects to actual charging power
  const temperatureMultiplier = getTemperatureMultiplier(temperatureC);
  if (temperatureMultiplier < 1.0) {
    limitingFactor = 'temperature';
    actualChargingPower = actualChargingPower * temperatureMultiplier;
  }

  // Calculate energy needed
  const energyToCharge = (batteryKwh * (targetCharge - initialCharge)) / 100;

  // Apply charging efficiency
  const energyWithEfficiency = energyToCharge / (chargingEfficiency / 100);

  // Apply progressive charging slowdown based on state of charge
  let totalChargingTimeHours = 0;

  // Break down charging into segments based on state of charge
  const chargingSegments = segmentCharging(initialCharge, targetCharge);

  for (const segment of chargingSegments) {
    const segmentSizePercent = segment.end - segment.start;
    const segmentEnergyKwh = (batteryKwh * segmentSizePercent) / 100 / (chargingEfficiency / 100);
    const speedMultiplier = segment.speedMultiplier;

    // Calculate time for this segment
    const segmentTimeHours = segmentEnergyKwh / (actualChargingPower * speedMultiplier);
    totalChargingTimeHours += segmentTimeHours;
  }

  const hours = Math.floor(totalChargingTimeHours);
  const minutes = Math.round((totalChargingTimeHours - hours) * 60);

  return {
    chargingTimeHours: hours,
    chargingTimeMinutes: minutes,
    energyNeeded: Number(energyWithEfficiency.toFixed(2)),
    technicalLimitExceeded,
    actualChargingPower: Number(actualChargingPower.toFixed(1)),
    limitingFactor
  };
}

/**
 * Divides the charging process into segments based on state of charge levels,
 * applying different charging speeds to each segment
 */
function segmentCharging(
  initialCharge: number,
  targetCharge: number
): Array<{
  start: number;
  end: number;
  speedMultiplier: number;
}> {
  const segments = [];
  const thresholds = [
    { threshold: 50, multiplier: 1.0 },
    { threshold: 70, multiplier: 0.9 },
    { threshold: 80, multiplier: 0.7 },
    { threshold: 90, multiplier: 0.4 },
    { threshold: 100, multiplier: 0.2 }
  ];

  let currentCharge = initialCharge;

  for (const { threshold, multiplier } of thresholds) {
    if (currentCharge < threshold && targetCharge > currentCharge) {
      const end = Math.min(threshold, targetCharge);
      segments.push({
        start: currentCharge,
        end: end,
        speedMultiplier: multiplier
      });
      currentCharge = end;

      // Break if we've reached the target
      if (currentCharge >= targetCharge) {
        break;
      }
    }
  }

  return segments;
}

/**
 * Applies phase-based limitations to the charging power
 * Most home chargers are limited by the number of phases available
 */
function applyPhaseLimitation(requestedPower: number, phases: number): number {
  // Maximum power per phase for typical home installations (7.4 kW)
  const maxPerPhase = 7.4;

  // Maximum power based on phases
  const phaseLimit = phases * maxPerPhase;

  return Math.min(requestedPower, phaseLimit);
}

/**
 * Returns a multiplier for charging speed based on battery temperature
 * Cold batteries charge significantly slower due to chemistry limitations
 */
function getTemperatureMultiplier(temperatureC: number): number {
  if (temperatureC < -10) return 0.3; // Extreme cold, severe reduction
  if (temperatureC < 0) return 0.5; // Very cold, significant reduction
  if (temperatureC < 10) return 0.8; // Cold, moderate reduction
  if (temperatureC > 40) return 0.9; // Hot, slight reduction
  return 1.0; // Ideal temperature range
}

/**
 * Validates if the charging power is technically feasible for the given battery capacity
 * Most EVs can't charge faster than a certain C-rate due to battery chemistry and thermal constraints
 */
export function validateTechnicalLimits(batteryKwh: number, chargingPower: number): boolean {
  return chargingPower <= getMaxChargingPower(batteryKwh);
}

/**
 * Calculates the maximum charging power based on battery capacity and C-rate limits
 * Most EVs have battery protection systems that limit the maximum charging rate
 */
function getMaxChargingPower(batteryKwh: number): number {
  // Modern EVs generally limit to 3C for safety and longevity
  // High-end performance EVs may reach up to 3.5C in perfect conditions
  const maxCRate = 3.0;
  return batteryKwh * maxCRate;
}

/**
 * Formats time into a human-readable string
 */
export function formatTime(hours: number, minutes: number): string {
  if (hours === 0 && minutes === 0) return 'N/A';

  const hoursText = hours > 0 ? `${hours} hour${hours !== 1 ? 's' : ''}` : '';
  const minutesText = minutes > 0 ? `${minutes} minute${minutes !== 1 ? 's' : ''}` : '';

  if (hours > 0 && minutes > 0) {
    return `${hoursText} and ${minutesText}`;
  }

  return hoursText || minutesText;
}

/**
 * Checks if a safety charge was added due to range being close to distance
 */
export function isSafetyChargeAdded({
  weeklyDistanceKm,
  effectiveRangeKm,
  threshold = 0.1
}: {
  weeklyDistanceKm: number;
  effectiveRangeKm: number;
  threshold?: number;
}): boolean {
  const ratio = weeklyDistanceKm / effectiveRangeKm;
  return ratio > 1 - threshold && ratio < 1;
}

/**
 * Gets a description for weekly charges based on frequency and safety margin
 */
export function getWeeklyChargesDescription({
  charges,
  safetyChargeAdded
}: {
  charges: number;
  safetyChargeAdded: boolean;
}): string {
  if (safetyChargeAdded) return 'Extra charge added for safety margin';
  if (charges <= 1) return 'Less than once per week';
  if (charges > 3) return 'Frequent charging needed';
  return 'Normal charging frequency';
}

/**
 * Generates charging time stats items for display
 */
export function generateChargingTimeStats({
  chargingTimeHours,
  chargingTimeMinutes,
  energyNeeded,
  initialCharge,
  targetCharge,
  technicalLimitExceeded
}: {
  chargingTimeHours: number;
  chargingTimeMinutes: number;
  energyNeeded: number;
  initialCharge: number;
  targetCharge: number;
  technicalLimitExceeded?: boolean;
}): Array<{
  title: string;
  value: number | string;
  unit?: string;
  description?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
}> {
  return [
    {
      title: 'Charging Time',
      value: chargingTimeHours > 0 ? chargingTimeHours : chargingTimeMinutes > 0 ? '<1' : 'N/A',
      unit: ' hr',
      description: formatTime(chargingTimeHours, chargingTimeMinutes),
      color: technicalLimitExceeded ? 'warning' : 'primary'
    },
    {
      title: 'Energy Required',
      value: energyNeeded,
      unit: ' kWh',
      description: `${initialCharge}% → ${targetCharge}% charge`,
      color: 'secondary'
    }
  ];
}

/**
 * Generates frequency stats items for display
 */
export function generateFrequencyStats({
  effectiveRangeKm,
  weeklyCharges,
  co2Savings,
  safetyChargeAdded
}: {
  effectiveRangeKm: number;
  weeklyCharges: number;
  co2Savings: number;
  safetyChargeAdded: boolean;
}): Array<{
  title: string;
  value: number | string;
  unit?: string;
  description?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
}> {
  return [
    {
      title: 'Effective Range',
      value: effectiveRangeKm,
      unit: ' km',
      description: 'Kilometers on a full charge',
      color: 'primary'
    },
    {
      title: 'Weekly Charges',
      value: weeklyCharges,
      description: getWeeklyChargesDescription({
        charges: weeklyCharges,
        safetyChargeAdded
      }),
      color: safetyChargeAdded ? 'warning' : 'secondary'
    },
    {
      title: 'CO₂ Savings',
      value: co2Savings,
      unit: ' kg',
      description: 'Compared to gasoline vehicles',
      color: 'accent'
    }
  ];
}

export const REGIONAL_EMISSIONS = {
  EUROPE: {
    gasolineEmissionsGramPerKm: 120,
    electricityEmissionsGramPerKm: 40
  },
  USA: {
    gasolineEmissionsGramPerKm: 130,
    electricityEmissionsGramPerKm: 70
  },
  CHINA: {
    gasolineEmissionsGramPerKm: 125,
    electricityEmissionsGramPerKm: 90
  }
};

/**
 * Estimates battery degradation based on charging characteristics and cycles
 * This is a simplified model based on typical lithium-ion battery degradation patterns
 */
export function estimateBatteryDegradation({
  batteryAgeYears = 0,
  chargingCycles = 0,
  fastChargingPercentage = 0,
  regularlyChargedAbove90Percent = false,
  regularlyDischargedBelow10Percent = false,
  operatingInHighTemperatures = false
}: {
  batteryAgeYears?: number;
  chargingCycles?: number;
  fastChargingPercentage?: number; // 0-100
  regularlyChargedAbove90Percent?: boolean;
  regularlyDischargedBelow10Percent?: boolean;
  operatingInHighTemperatures?: boolean;
}): {
  estimatedCapacityRemaining: number; // percentage of original capacity
  estimatedRangeImpact: number; // percentage of range reduction
  recommendations: string[];
} {
  // Base degradation from age (about 2-3% per year for typical batteries)
  const ageDegradation = Math.min(batteryAgeYears * 2.5, 20);

  // Degradation from charging cycles (typically 10% after 1500 cycles)
  const cycleDegradation = Math.min((chargingCycles / 1500) * 10, 30);

  // Fast charging impact (additional degradation from DC fast charging)
  const fastChargingDegradation = (fastChargingPercentage / 100) * 5;

  // High state of charge impact
  const highSocDegradation = regularlyChargedAbove90Percent ? 5 : 0;

  // Low state of charge impact
  const lowSocDegradation = regularlyDischargedBelow10Percent ? 5 : 0;

  // Temperature impact
  const tempDegradation = operatingInHighTemperatures ? 7 : 0;

  // Calculate total degradation (capped at 40% as batteries rarely degrade beyond this without replacement)
  const totalDegradation = Math.min(
    ageDegradation +
      cycleDegradation +
      fastChargingDegradation +
      highSocDegradation +
      lowSocDegradation +
      tempDegradation,
    40
  );

  // Generate recommendations
  const recommendations: string[] = [];

  if (fastChargingPercentage > 30) {
    recommendations.push('Consider reducing DC fast charging frequency to minimize battery degradation');
  }

  if (regularlyChargedAbove90Percent) {
    recommendations.push('Try to limit regular charging to 80-90% to extend battery lifespan');
  }

  if (regularlyDischargedBelow10Percent) {
    recommendations.push('Avoid frequently running the battery below 10% to preserve capacity');
  }

  if (operatingInHighTemperatures) {
    recommendations.push('When possible, park in shade and avoid charging in extreme heat');
  }

  return {
    estimatedCapacityRemaining: 100 - totalDegradation,
    estimatedRangeImpact: totalDegradation,
    recommendations
  };
}

/**
 * Calculates the effective range of an EV with more factors taken into account
 */
export function calculateAdvancedRange({
  batteryKwh,
  consumptionKwhPer100km,
  usableFraction = 0.9,
  temperatureC = 20,
  useClimateControl = false,
  terrainType = 'flat',
  drivingSpeed = 'moderate',
  batteryAgeYears = 0
}: {
  batteryKwh: number;
  consumptionKwhPer100km: number;
  usableFraction?: number;
  temperatureC?: number;
  useClimateControl?: boolean;
  terrainType?: 'flat' | 'hilly' | 'mountainous';
  drivingSpeed?: 'slow' | 'moderate' | 'fast';
  batteryAgeYears?: number;
}): {
  effectiveRangeKm: number;
  adjustedConsumption: number;
  rangeImpactFactors: {
    temperature: number;
    climate: number;
    terrain: number;
    speed: number;
    degradation: number;
  };
} {
  // Base consumption
  let adjustedConsumption = consumptionKwhPer100km;

  // Temperature impact on consumption
  let temperatureMultiplier = 1.0;
  if (temperatureC < -10) {
    temperatureMultiplier = 1.4; // 40% more consumption in extreme cold
  } else if (temperatureC < 0) {
    temperatureMultiplier = 1.25; // 25% more consumption in cold
  } else if (temperatureC < 10) {
    temperatureMultiplier = 1.1; // 10% more consumption in cool weather
  }

  // Climate control impact
  const climateControlMultiplier = useClimateControl ? (temperatureC < 10 || temperatureC > 30 ? 1.15 : 1.05) : 1.0;

  // Terrain impact
  let terrainMultiplier = 1.0;
  switch (terrainType) {
    case 'hilly':
      terrainMultiplier = 1.1; // 10% more consumption
      break;
    case 'mountainous':
      terrainMultiplier = 1.25; // 25% more consumption
      break;
  }

  // Speed impact
  let speedMultiplier = 1.0;
  switch (drivingSpeed) {
    case 'slow':
      speedMultiplier = 0.9; // 10% less consumption
      break;
    case 'fast':
      speedMultiplier = 1.2; // 20% more consumption
      break;
  }

  // Battery degradation impact
  // Simplified model: 2.5% degradation per year of battery age
  let degradationMultiplier = 1.0;
  if (batteryAgeYears > 0) {
    // Calculate remaining capacity percentage (100% - degradation)
    const remainingCapacity = 100 - Math.min(batteryAgeYears * 2.5, 30);
    degradationMultiplier = remainingCapacity / 100;
  }

  // Apply all multipliers to consumption
  adjustedConsumption =
    consumptionKwhPer100km * temperatureMultiplier * climateControlMultiplier * terrainMultiplier * speedMultiplier;

  // Calculate range with adjusted consumption and degradation
  const effectiveRangeKm = ((batteryKwh * usableFraction * degradationMultiplier) / adjustedConsumption) * 100;

  return {
    effectiveRangeKm: Number(effectiveRangeKm.toFixed(2)),
    adjustedConsumption: Number(adjustedConsumption.toFixed(2)),
    rangeImpactFactors: {
      temperature: Number((temperatureMultiplier - 1) * 100),
      climate: Number((climateControlMultiplier - 1) * 100),
      terrain: Number((terrainMultiplier - 1) * 100),
      speed: Number((speedMultiplier - 1) * 100),
      degradation: Number((1 - degradationMultiplier) * 100)
    }
  };
}

/**
 * Calculates charging costs based on electricity rates and time-of-use
 */
export function calculateChargingCost({
  energyNeededKwh,
  baseElectricityRate,
  useTimeOfUseRates = false,
  offPeakRate,
  peakRate,
  chargingDuringOffPeak = 0, // percentage of charging done during off-peak (0-100)
  includeFees = true,
  fixedFee = 0,
  taxRate = 0
}: {
  energyNeededKwh: number;
  baseElectricityRate: number; // cost per kWh
  useTimeOfUseRates?: boolean;
  offPeakRate?: number;
  peakRate?: number;
  chargingDuringOffPeak?: number; // percentage
  includeFees?: boolean;
  fixedFee?: number;
  taxRate?: number; // percentage
}): {
  totalCost: number;
  costPerKwh: number;
  breakdown: {
    energyCost: number;
    fees: number;
    taxes: number;
  };
} {
  // Calculate base energy cost
  let energyCost = 0;

  if (useTimeOfUseRates && offPeakRate !== undefined && peakRate !== undefined) {
    // Calculate with time-of-use rates
    const offPeakPercentage = chargingDuringOffPeak / 100;
    const peakPercentage = 1 - offPeakPercentage;

    const offPeakEnergy = energyNeededKwh * offPeakPercentage;
    const peakEnergy = energyNeededKwh * peakPercentage;

    energyCost = offPeakEnergy * offPeakRate + peakEnergy * peakRate;
  } else {
    // Calculate with flat rate
    energyCost = energyNeededKwh * baseElectricityRate;
  }

  // Add fixed fees if included
  const fees = includeFees ? fixedFee : 0;

  // Calculate taxes
  const taxes = (energyCost + fees) * (taxRate / 100);

  // Calculate total cost
  const totalCost = energyCost + fees + taxes;

  // Calculate effective cost per kWh
  const costPerKwh = totalCost / energyNeededKwh;

  return {
    totalCost: Number(totalCost.toFixed(2)),
    costPerKwh: Number(costPerKwh.toFixed(4)),
    breakdown: {
      energyCost: Number(energyCost.toFixed(2)),
      fees: Number(fees.toFixed(2)),
      taxes: Number(taxes.toFixed(2))
    }
  };
}

/**
 * Generate stats data for the cost calculator UI
 */
export function generateCostStats(params: {
  costPerCharge: number;
  weeklyCost: number;
  monthlyCost: number;
  annualCost: number;
  energyPerCharge: number;
  currency: string;
  chargeProvider?: string;
}): Array<{
  title: string;
  value: number | string;
  unit?: string;
  description?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
}> {
  const { costPerCharge, weeklyCost, monthlyCost, annualCost, energyPerCharge, currency, chargeProvider } = params;

  return [
    {
      title: 'Cost Per Charge',
      value: costPerCharge.toFixed(2),
      unit: currency,
      description: `Estimated cost for a single charging session${chargeProvider ? ` with ${chargeProvider}` : ''}`,
      color: 'accent'
    },
    {
      title: 'Weekly Cost',
      value: weeklyCost.toFixed(2),
      unit: currency,
      description: 'Projected weekly charging expenses',
      color: 'primary'
    },
    {
      title: 'Monthly Cost',
      value: monthlyCost.toFixed(2),
      unit: currency,
      description: 'Projected monthly charging expenses',
      color: 'info'
    },
    {
      title: 'Annual Cost',
      value: annualCost.toFixed(2),
      unit: currency,
      description: 'Projected annual charging expenses',
      color: 'success'
    },
    {
      title: 'Energy Per Charge',
      value: energyPerCharge.toFixed(2),
      unit: 'kWh',
      description: 'Energy consumed per charging session including efficiency losses',
      color: 'warning'
    }
  ];
}
