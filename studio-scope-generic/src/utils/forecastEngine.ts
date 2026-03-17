import type { Platform, AudienceComposition, PlatformConfig, Campaign, ForecastMonth, LanguageSplit } from '../data/types';
import { AVG_MONTHLY_GROWTH_2025, AVG_MONTHLY_POSTS_2025, CURRENT_FOLLOWERS } from '../data/historicalData';
import { SEGMENTS } from '../data/audiences';
import { SEASONAL_FACTORS } from '../data/campaigns';

// ============================================================
// Content Volume
// Source: Ralph methodology (medium confidence)
// Linear model: each post above baseline adds a fixed % uplift.
// ASSUMPTION: Linear relationship. Real-world likely has diminishing
// returns. Would need A/B testing data to model accurately.
// ============================================================
const VOLUME_MULTIPLIERS: Record<Platform, number> = {
  ig: 0.025,  // 2.5% per post above baseline
  x: 0.01,    // 1% per post (diminishing returns observed)
  tt: 0.06,   // 6% per post (algorithm-driven discovery)
  fb: 0.015,  // 1.5% per post (limited organic reach)
  yt: 0.03,   // ESTIMATE: no historical data
};

const BASELINE_POSTS: Record<Platform, number> = {
  ig: AVG_MONTHLY_POSTS_2025.ig,  // 42
  x: AVG_MONTHLY_POSTS_2025.x,    // 33
  tt: AVG_MONTHLY_POSTS_2025.tt,   // 10
  fb: AVG_MONTHLY_POSTS_2025.fb,   // 23
  yt: 2,                           // ESTIMATE: no historical data
};

// ============================================================
// Organic Base Growth
// Source: 2025 full-year historical averages (high confidence for IG/X/FB)
// ASSUMPTION: 2025 average continues as baseline. Does not account
// for acceleration or deceleration trends within 2025.
// NEEDS CLIENT DATA: Monthly trend direction to use weighted recent
// average instead of flat annual average.
// ============================================================
const ORGANIC_BASE: Record<Platform, number> = {
  ig: AVG_MONTHLY_GROWTH_2025.ig,  // 2,800
  x: AVG_MONTHLY_GROWTH_2025.x,    // 800
  tt: AVG_MONTHLY_GROWTH_2025.tt,   // 330
  fb: AVG_MONTHLY_GROWTH_2025.fb,   // 80
  yt: 50,                           // ESTIMATE: no historical data, no baseline followers tracked
};

function contentVolumeMultiplier(platform: Platform, postsPerMonth: number): number {
  const diff = postsPerMonth - BASELINE_POSTS[platform];
  const mult = VOLUME_MULTIPLIERS[platform];
  return Math.max(0.5, 1 + diff * mult);
}

// ============================================================
// Audience Composition
// ASSUMPTION: All followConversionMultiplier values are Ralph estimates.
// NEEDS CLIENT DATA: Platform analytics showing which content types
// (proxy for audience segment) drove actual follows per platform.
// ============================================================
function audienceCompositionMultiplier(
  composition: AudienceComposition,
  platform: Platform
): number {
  const coreWeight = composition.core / 100;
  const lightWeight = composition.light / 100;
  const touristWeight = composition.tourist / 100;

  const coreMult = SEGMENTS.core.followConversionMultiplier[platform];
  const lightMult = SEGMENTS.light.followConversionMultiplier[platform];
  const touristMult = SEGMENTS.tourist.followConversionMultiplier[platform];

  return coreWeight * coreMult + lightWeight * lightMult + touristWeight * touristMult;
}

// ============================================================
// Campaigns: platform-specific, no overlap stacking
// Uses the highest active campaign multiplier for THIS platform only.
// Campaigns only apply to the platforms listed in their config.
// ============================================================
function campaignLiftForMonth(
  monthKey: string,
  campaigns: Campaign[],
  platform: Platform
): number {
  const activeCampaigns = campaigns.filter(c => {
    if (!c.enabled) return false;
    if (!c.platforms.includes(platform)) return false;
    return monthKey >= c.startDate.slice(0, 7) && monthKey <= c.endDate.slice(0, 7);
  });

  if (activeCampaigns.length === 0) return 0;

  // Use highest campaign multiplier only. Returns the LIFT portion (mult - 1).
  return Math.max(...activeCampaigns.map(c => c.defaultMultiplier)) - 1;
}

function getSeasonalFactor(monthKey: string): number {
  const mm = monthKey.slice(5, 7);
  return SEASONAL_FACTORS[mm] ?? 1.0;
}

function getActiveCampaignIds(monthKey: string, campaigns: Campaign[]): string[] {
  return campaigns
    .filter(c => c.enabled && monthKey >= c.startDate.slice(0, 7) && monthKey <= c.endDate.slice(0, 7))
    .map(c => c.id);
}

// ============================================================
// Language
// ASSUMPTION: Flat uplift per language tier. Low confidence.
// NEEDS CLIENT DATA: Actual follower demographics showing
// international audience % and language-driven discovery rates.
// ============================================================
function languageMultiplier(lang: LanguageSplit): number {
  if (lang === 'jp_en_zh_ko') return 1.12;
  if (lang === 'jp_en') return 1.05;
  return 1.0;
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ============================================================
// FORECAST FORMULA
//
// baseGrowth = organic * seasonal
// withStrategy = organic * volumeMult * audienceMult * langMult * seasonal
// withCampaigns = organic * volumeMult * audienceMult * langMult * (seasonal + campLift)
//
// Key design decisions:
// - Campaigns are ADDITIVE to seasonal (not multiplicative) to prevent
//   double-counting peaks already reflected in seasonal factors.
// - Campaign lift is platform-specific using each campaign's platforms array.
// - withStrategy and withCampaigns are floored at baseGrowth so that
//   strategy layers never underperform organic baseline.
// ============================================================
export function generateForecast(
  composition: AudienceComposition,
  platformConfigs: Record<Platform, PlatformConfig>,
  campaigns: Campaign[],
  lang: LanguageSplit = 'jp_en'
): ForecastMonth[] {
  const platforms: Platform[] = ['ig', 'x', 'tt', 'fb', 'yt'];
  const months: ForecastMonth[] = [];
  let cumulativeGrowth = 0;

  for (let m = 1; m <= 12; m++) {
    const mm = String(m).padStart(2, '0');
    const monthKey = `2026-${mm}`;
    const label = `${MONTH_LABELS[m - 1]} 2026`;
    const seasonal = getSeasonalFactor(monthKey);
    const activeCampaigns = getActiveCampaignIds(monthKey, campaigns);

    const platformResults: Record<string, { baseGrowth: number; withStrategy: number; withCampaigns: number; optimistic: number; pessimistic: number }> = {};

    let totalBase = 0;
    let totalStrategy = 0;
    let totalCampaigns = 0;
    let totalOptimistic = 0;
    let totalPessimistic = 0;

    for (const p of platforms) {
      const organic = ORGANIC_BASE[p];
      const config = platformConfigs[p];
      const posts = config?.postsPerMonth ?? BASELINE_POSTS[p];

      const baseGrowth = Math.round(organic * seasonal);
      const volumeMult = contentVolumeMultiplier(p, posts);
      const audienceMult = audienceCompositionMultiplier(composition, p);
      const langMult = languageMultiplier(lang);

      // Campaign lift is additive to seasonal, platform-specific
      const campLift = campaignLiftForMonth(monthKey, campaigns, p);
      const strategyMult = volumeMult * audienceMult * langMult;

      const withStrategy = Math.max(baseGrowth, Math.round(organic * strategyMult * seasonal));
      const withCampaigns = Math.max(baseGrowth, Math.round(organic * strategyMult * (seasonal + campLift)));
      const optimistic = Math.round(withCampaigns * 1.25);
      const pessimistic = Math.round(withCampaigns * 0.7);

      platformResults[p] = { baseGrowth, withStrategy, withCampaigns, optimistic, pessimistic };
      totalBase += baseGrowth;
      totalStrategy += withStrategy;
      totalCampaigns += withCampaigns;
      totalOptimistic += optimistic;
      totalPessimistic += pessimistic;
    }

    cumulativeGrowth += totalCampaigns;

    months.push({
      month: monthKey,
      label,
      platforms: platformResults as ForecastMonth['platforms'],
      totalBase,
      totalStrategy,
      totalCampaigns,
      totalOptimistic,
      totalPessimistic,
      cumulativeGrowth,
      activeCampaigns,
      seasonalFactor: seasonal,
    });
  }

  return months;
}

export function getTotalProjectedGrowth(forecast: ForecastMonth[]): number {
  return forecast.length > 0 ? forecast[forecast.length - 1].cumulativeGrowth : 0;
}

export function getProjectedFollowers(forecast: ForecastMonth[]): number {
  const startingTotal = CURRENT_FOLLOWERS.total;
  return startingTotal + getTotalProjectedGrowth(forecast);
}

export { ORGANIC_BASE, BASELINE_POSTS };
