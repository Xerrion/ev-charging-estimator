// Common tips that apply to all EV charging scenarios
export const commonTips = {
  general: [
    'Charge during off-peak hours to save on electricity costs',
    'Keep your EV battery between 20-80% for optimal battery health'
  ]
};

// Charging Time Calculator Tips
export function getChargingTimeTips(params: {
  batteryKwh: number;
  targetCharge: number;
  chargingPower: number;
  chargingEfficiency: number;
  temperatureC?: number;
  phases?: number;
  chargingTimeHours: number;
  chargingTimeMinutes: number;
  actualChargingPower?: number;
  limitingFactor?: 'c-rate' | 'phases' | 'temperature' | null;
}): string[] {
  const {
    batteryKwh,
    targetCharge,
    chargingPower,
    chargingEfficiency,
    temperatureC = 20,
    phases = 3,
    chargingTimeHours,
    chargingTimeMinutes,
    actualChargingPower,
    limitingFactor
  } = params;

  const tips = [
    // Start with a common tip
    'Charge during off-peak hours to save on electricity costs'
  ];

  // Tips based on limiting factors
  if (limitingFactor === 'c-rate') {
    tips.push(`Your battery capacity limits maximum charging to around ${actualChargingPower} kW`);
    tips.push('Battery chemistry limits how quickly it can safely accept charge');
  } else if (limitingFactor === 'phases') {
    tips.push(`Your ${phases}-phase charging setup limits maximum power to ${actualChargingPower} kW`);
    if (phases === 1) {
      tips.push('Consider a 3-phase charger for faster charging speeds');
    }
  } else if (limitingFactor === 'temperature') {
    if (temperatureC < 10) {
      tips.push('Cold batteries charge slower - preconditioning can help improve charging speed');
      tips.push('Using battery warming features before charging can significantly reduce charging time');
    } else if (temperatureC > 40) {
      tips.push('High temperatures can affect charging speed and battery health');
      tips.push('Try to charge in shade or during cooler parts of the day when possible');
    }
  }

  // Tips based on charging power
  if (chargingPower > 50) {
    tips.push('High-power DC charging can degrade battery faster if used frequently');
    tips.push('Fast charging works best in the 20-80% range of battery capacity');
  } else if (chargingPower <= 11) {
    tips.push('Consider overnight charging with this power level');
    tips.push('Level 2 home charging is ideal for daily use and battery longevity');
  }

  // Tips based on target charge
  if (targetCharge > 90) {
    tips.push('Regularly charging to 100% can accelerate battery degradation');
    tips.push('Consider limiting regular charges to 80-90% for longer battery life');
  } else if (targetCharge < 50) {
    tips.push('Frequent shallow charging cycles are optimal for battery health');
  }

  // Tips based on efficiency
  if (chargingEfficiency < 85) {
    tips.push('Low efficiency means more electricity used and longer charging times');
    tips.push('Check your charging equipment for issues that may reduce efficiency');
  }

  // Tips based on battery size
  if (batteryKwh > 100) {
    tips.push('Large batteries benefit from smart charging to avoid peak electricity rates');
  }

  // Charging time specific tips
  if (chargingTimeHours > 8) {
    tips.push('Consider a higher power charger for shorter charging sessions');
  } else if (chargingTimeHours < 1 && chargingTimeMinutes < 30) {
    tips.push('Quick top-ups are great for extending range during long trips');
  }

  // Temperature specific tips (if not already covered by limiting factor)
  if (limitingFactor !== 'temperature') {
    if (temperatureC < 0) {
      tips.push('Very cold temperatures significantly reduce charging speed and range');
    } else if (temperatureC > 35) {
      tips.push('Battery cooling systems work harder in hot weather, which may affect charging');
    }
  }

  // Phase specific tips (if not already covered by limiting factor)
  if (limitingFactor !== 'phases' && phases === 1 && chargingPower > 7.4) {
    tips.push('Single-phase charging is typically limited to around 7.4 kW in most regions');
  }

  return tips;
}

// Charge Frequency Calculator Tips
export function getFrequencyTips(params: {
  weeklyDistanceKm: number;
  batteryKwh: number;
  consumptionKwhPer100km: number;
  usableFraction: number;
  effectiveRangeKm: number;
  weeklyCharges: number;
}): string[] {
  const { weeklyDistanceKm, batteryKwh, consumptionKwhPer100km, usableFraction, effectiveRangeKm, weeklyCharges } =
    params;

  const tips = [
    // Common tip for all scenarios
    'Plan your charging schedule around your weekly driving needs'
  ];

  // Check if range is close to weekly distance (within 10%)
  const threshold = 0.1;
  const ratio = weeklyDistanceKm / effectiveRangeKm;
  const isCloseToLimit = ratio > 1 - threshold && ratio < 1;

  // Tips based on weekly charging frequency
  if (isCloseToLimit) {
    tips.push('An extra charge has been added because your range is very close to your weekly distance');
    tips.push('This safety margin helps prevent unexpected range issues due to varied driving conditions');
  } else if (weeklyCharges < 1) {
    tips.push('Your EV can handle your weekly driving needs with minimal charging');
    tips.push('Consider charging only when battery drops below 30% for optimal battery health');
  } else if (weeklyCharges > 3) {
    tips.push('Your high charging frequency suggests you may benefit from a vehicle with longer range');
    tips.push('Consider workplace or destination charging to supplement home charging');
  } else {
    tips.push('Your charging frequency is in the optimal range for most EV owners');
  }

  // Tips based on energy consumption
  if (consumptionKwhPer100km > 20) {
    tips.push('Your energy consumption is high - driving at lower speeds and smoother acceleration can help');
    tips.push('Consider using eco mode to improve efficiency and range');
  } else if (consumptionKwhPer100km < 15) {
    tips.push('Your energy consumption is efficient, helping maximize your range between charges');
  }

  // Tips based on battery capacity and usable fraction
  if (batteryKwh > 75 && usableFraction < 0.85) {
    tips.push(
      'Your large battery with conservative usable range settings provides a good balance of range and longevity'
    );
  } else if (batteryKwh < 50) {
    tips.push('With a smaller battery, finding convenient charging locations for longer trips is important');
  }

  // Tips based on range vs distance
  const rangeRatio = effectiveRangeKm / weeklyDistanceKm;

  if (rangeRatio > 2) {
    tips.push('Your range greatly exceeds your weekly needs - you have lots of flexibility in charging schedule');
  } else if (rangeRatio < 1.2 && !isCloseToLimit) {
    tips.push('Your range is close to your weekly distance - consider charging more frequently to avoid range anxiety');
  }

  return tips;
}

// Cost Calculator Tips
export function getCostTips(): string[] {
  return [
    'Off-peak electricity rates can significantly reduce charging costs',
    'Home charging is typically much cheaper than public charging stations',
    'Solar panels can help offset your EV charging costs',
    'Some utilities offer special EV charging rates or programs',
    'Consider using a smart charger that can automatically charge during cheaper rate periods'
  ];
}

// Error Tips
export function getErrorTips(): string[] {
  return ['Check your input values and try again', 'Make sure all parameters are within reasonable ranges'];
}
