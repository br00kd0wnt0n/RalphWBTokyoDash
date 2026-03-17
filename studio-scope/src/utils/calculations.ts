import { HISTORICAL_DATA, MONTHS } from '../data/historicalData';
import type { Platform } from '../data/types';

const PLATFORMS: Platform[] = ['ig', 'x', 'tt', 'fb'];

// Get all months except partial Jan 2026
export function getCompleteMonths(): string[] {
  return MONTHS.filter(m => m !== '2026-01');
}

// Get follower count for a platform in a specific month
export function getFollowers(month: string, platform: Platform): number | null {
  const data = HISTORICAL_DATA[month as keyof typeof HISTORICAL_DATA];
  if (!data || !(platform in data)) return null;
  const pd = data[platform as keyof typeof data] as { followers?: number | null };
  return pd?.followers ?? null;
}

// Get net growth for a platform in a specific month
export function getGrowth(month: string, platform: Platform): number {
  const data = HISTORICAL_DATA[month as keyof typeof HISTORICAL_DATA];
  if (!data || !(platform in data)) return 0;
  const pd = data[platform as keyof typeof data] as { net_growth?: number };
  return pd?.net_growth ?? 0;
}

// Get engagements for a platform in a specific month
export function getEngagements(month: string, platform: Platform): number {
  const data = HISTORICAL_DATA[month as keyof typeof HISTORICAL_DATA];
  if (!data || !(platform in data)) return 0;
  const pd = data[platform as keyof typeof data] as { engagements?: number };
  return pd?.engagements ?? 0;
}

// Get posts for a platform in a specific month
export function getPosts(month: string, platform: Platform): number {
  const data = HISTORICAL_DATA[month as keyof typeof HISTORICAL_DATA];
  if (!data || !(platform in data)) return 0;
  const pd = data[platform as keyof typeof data] as { posts?: number };
  return pd?.posts ?? 0;
}

// Get impressions for a platform in a specific month
export function getImpressions(month: string, platform: Platform): number {
  const data = HISTORICAL_DATA[month as keyof typeof HISTORICAL_DATA];
  if (!data || !(platform in data)) return 0;
  const pd = data[platform as keyof typeof data] as { impressions?: number };
  return pd?.impressions ?? 0;
}

// Calculate engagement rate for a month/platform
export function calcEngagementRate(month: string, platform: Platform): number {
  const eng = getEngagements(month, platform);
  const imp = getImpressions(month, platform);
  if (imp === 0) return 0;
  return (eng / imp) * 100;
}

// Get total followers across all platforms for a given month
export function getTotalFollowers(month: string): number {
  return PLATFORMS.reduce((sum, p) => sum + (getFollowers(month, p) ?? 0), 0);
}

// Average engagement rate for a year by platform
export function avgEngagementRate(year: string, platform: Platform): number {
  const yearMonths = getCompleteMonths().filter(m => m.startsWith(year));
  if (yearMonths.length === 0) return 0;
  const sum = yearMonths.reduce((acc, m) => acc + calcEngagementRate(m, platform), 0);
  return sum / yearMonths.length;
}

// Get total engagements for a month across all platforms
export function getTotalEngagements(month: string): number {
  return PLATFORMS.reduce((sum, p) => sum + getEngagements(month, p), 0);
}

// Get months for a specific year
export function getMonthsForYear(year: string): string[] {
  return getCompleteMonths().filter(m => m.startsWith(year));
}

export { PLATFORMS };
