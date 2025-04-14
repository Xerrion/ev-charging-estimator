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
