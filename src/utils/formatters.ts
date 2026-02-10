// ============================================================
// Studio Scope: Formatting Utilities
// ============================================================

/**
 * Format a number with commas: 224070 -> "224,070"
 */
export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

/**
 * Format a number with K/M suffix: 224070 -> "224.1K"
 */
export function formatCompact(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

/**
 * Format a number with +/- prefix: 2800 -> "+2,800", -571 -> "-571"
 */
export function formatGrowth(n: number): string {
  const prefix = n >= 0 ? '+' : '';
  return `${prefix}${formatNumber(n)}`;
}

/**
 * Format a percentage: 0.85 -> "85%", 1.25 -> "125%"
 */
export function formatPercent(n: number, decimals = 0): string {
  return `${(n * 100).toFixed(decimals)}%`;
}

/**
 * Format engagement rate: 0.8522 -> "0.85%"
 */
export function formatRate(n: number): string {
  return `${n.toFixed(2)}%`;
}

/**
 * Format month key to display: "2025-11" -> "Nov 2025"
 */
const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function formatMonth(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  return `${MONTH_NAMES[parseInt(month, 10) - 1]} ${year}`;
}

/**
 * Format month key to short: "2025-11" -> "Nov '25"
 */
export function formatMonthShort(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  return `${MONTH_NAMES[parseInt(month, 10) - 1]} '${year.slice(2)}`;
}

/**
 * Get growth trend color class
 */
export function growthColor(n: number): string {
  if (n > 0) return 'text-success';
  if (n < 0) return 'text-danger';
  return 'text-text-dim';
}
