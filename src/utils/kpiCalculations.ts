import type { ForecastMonth } from '../data/types';
import { getEngagements, getMonthsForYear, PLATFORMS } from './calculations';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface EngagementYoYResult {
  total2025: number;
  projected2026: number;
  yoyPercent: number;
  targetMet: boolean;
}

/**
 * Calculate engagement YoY projection using the forecast's strategy/campaign lift ratio.
 * Extracts logic previously embedded in EngagementForecast.tsx so both views can use it.
 */
export function calcEngagementYoY(forecast: ForecastMonth[]): EngagementYoYResult {
  const months2025 = getMonthsForYear('2025');

  let total2025 = 0;
  let projected2026 = 0;

  MONTH_LABELS.forEach((_, i) => {
    const mm = String(i + 1).padStart(2, '0');
    const m2025 = months2025.find(m => m.endsWith(`-${mm}`));

    let eng2025 = 0;
    if (m2025) PLATFORMS.forEach(p => { eng2025 += getEngagements(m2025, p); });

    const forecastMonth = forecast[i];
    const strategyLift = forecastMonth && forecastMonth.totalBase > 0
      ? forecastMonth.totalCampaigns / forecastMonth.totalBase
      : 1.0;
    const eng2026 = Math.round(eng2025 * strategyLift);

    total2025 += eng2025;
    projected2026 += eng2026;
  });

  const yoyPercent = total2025 > 0
    ? ((projected2026 - total2025) / total2025) * 100
    : 0;

  return {
    total2025,
    projected2026,
    yoyPercent,
    targetMet: yoyPercent >= 10,
  };
}
