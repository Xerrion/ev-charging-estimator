/**
 * Format a number with the specified number of decimal places
 */
export function formatNumber(value: number, decimals = 0): string {
  if (Number.isNaN(value) || typeof value !== 'number') {
    return 'N/A';
  }
  return value.toFixed(decimals);
}

/**
 * Format a number as currency with the given currency code
 */
export function formatCurrency(value: number, currencyCode = 'USD', decimals = 2): string {
  if (Number.isNaN(value) || typeof value !== 'number') {
    return 'N/A';
  }

  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode
    }).format(value);
  } catch (error) {
    console.error('Error formatting currency:', error);
    // Fallback if currency code is invalid
    return `${currencyCode} ${value.toFixed(decimals)}`;
  }
}

/**
 * Format a percentage value
 */
export function formatPercent(value: number, decimals = 0): string {
  if (Number.isNaN(value) || typeof value !== 'number') {
    return 'N/A';
  }
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a time value in hours and minutes
 */
export function formatTime(hours: number, minutes: number): string {
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return 'N/A';
  }

  if (hours === 0 && minutes === 0) {
    return '0 minutes';
  }

  const hoursText = hours > 0 ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : '';
  const minutesText = minutes > 0 ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}` : '';

  if (hoursText && minutesText) {
    return `${hoursText} ${minutesText}`;
  }

  return hoursText || minutesText;
}

/**
 * Formats a distance value in kilometers with the appropriate unit.
 * - Less than 10 km will have 1 decimal place
 * - 10 km or more will be rounded to whole numbers
 */
export function formatDistance(kilometers: number): string {
  if (kilometers < 10) {
    return `${Math.round(kilometers * 10) / 10} km`;
  }
  return `${Math.round(kilometers)} km`;
}

/**
 * Formats a value to ensure it's a valid number and handles decimals appropriately
 */
function formatValueDecimals(val: number, allowDecimals: boolean): number {
  if (isNaN(val)) return 0;
  return allowDecimals ? val : Math.round(val);
}

/**
 * Helper function to format a value if it's a number
 */
export function formatValue(val: number): number {
  const formattedValue = formatValueDecimals(val, true);
  return formattedValue;
}
