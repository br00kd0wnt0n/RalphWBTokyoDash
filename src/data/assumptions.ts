// ============================================================
// Studio Scope: Forecast Model Assumptions
// Every assumption documented with confidence level and source.
// These populate the "Under the Hood" module.
//
// CONFIDENCE KEY:
//   high   = Derived directly from client historical data
//   medium = Supported by industry benchmarks or partial data
//   low    = Ralph estimate, needs client data to validate
// ============================================================

import { Assumption } from './types';

export const ASSUMPTIONS: Assumption[] = [
  // --- Organic Base Growth ---
  {
    id: 'ig_organic_base',
    category: 'Organic Growth',
    variable: 'Instagram organic base growth',
    value: 2800,
    unit: 'followers/month',
    confidence: 'high',
    source: '2025 historical average (Jan-Dec). Uses flat annual average; weighted recent trend would be more accurate.',
    editable: true,
  },
  {
    id: 'x_organic_base',
    category: 'Organic Growth',
    variable: 'X organic base growth',
    value: 800,
    unit: 'followers/month',
    confidence: 'high',
    source: '2025 historical average (Jan-Dec). X shows plateau behaviour; trend may be declining.',
    editable: true,
  },
  {
    id: 'tt_organic_base',
    category: 'Organic Growth',
    variable: 'TikTok organic base growth',
    value: 330,
    unit: 'followers/month',
    confidence: 'medium',
    source: '2025 historical average. Lower confidence: minimal content investment makes baseline unreliable as a predictor of potential.',
    editable: true,
  },
  {
    id: 'fb_organic_base',
    category: 'Organic Growth',
    variable: 'Facebook organic base growth',
    value: 80,
    unit: 'followers/month',
    confidence: 'high',
    source: '2025 historical average (Jan-Dec).',
    editable: true,
  },
  {
    id: 'yt_organic_base',
    category: 'Organic Growth',
    variable: 'YouTube organic base growth',
    value: 50,
    unit: 'followers/month',
    confidence: 'low',
    source: 'ESTIMATE. No historical YouTube data available. Needs client data to validate.',
    editable: true,
  },

  // --- Content Volume Impact ---
  {
    id: 'ig_volume_multiplier',
    category: 'Content Volume',
    variable: 'IG growth per additional post above baseline',
    value: 0.025,
    unit: 'multiplier per post',
    confidence: 'medium',
    source: 'Ralph methodology. Each post above the 42/mo baseline adds ~2.5% growth uplift. Linear model; real-world likely has diminishing returns.',
    editable: true,
  },
  {
    id: 'tt_volume_multiplier',
    category: 'Content Volume',
    variable: 'TikTok growth per additional post above baseline',
    value: 0.06,
    unit: 'multiplier per post',
    confidence: 'low',
    source: 'Industry benchmark (entertainment venues). Needs validation with WBSTT-specific TikTok posting experiments.',
    editable: true,
  },
  {
    id: 'x_volume_multiplier',
    category: 'Content Volume',
    variable: 'X growth per additional post above baseline',
    value: 0.01,
    unit: 'multiplier per post',
    confidence: 'medium',
    source: 'Historical analysis. X shows diminishing returns on volume.',
    editable: true,
  },
  {
    id: 'fb_volume_multiplier',
    category: 'Content Volume',
    variable: 'Facebook growth per additional post above baseline',
    value: 0.015,
    unit: 'multiplier per post',
    confidence: 'low',
    source: 'Ralph methodology. Facebook organic reach severely limited; volume has minimal impact.',
    editable: true,
  },
  {
    id: 'yt_volume_multiplier',
    category: 'Content Volume',
    variable: 'YouTube growth per additional post above baseline',
    value: 0.03,
    unit: 'multiplier per post',
    confidence: 'low',
    source: 'ESTIMATE. No historical YouTube data. Needs client data.',
    editable: true,
  },

  // --- Audience Segment Multipliers ---
  {
    id: 'audience_multipliers',
    category: 'Audience',
    variable: 'Segment follow-conversion multipliers (15 values)',
    value: 'See Audience Model tab',
    unit: 'per-platform per-segment multiplier',
    confidence: 'low',
    source: 'Ralph estimates. All 15 values (3 segments x 5 platforms) are assumptions. Needs client platform analytics showing content-type performance by audience demographic.',
    editable: false,
  },

  // --- Campaign Multipliers ---
  {
    id: 'campaign_model',
    category: 'Campaigns',
    variable: 'Campaign lift model',
    value: 'Additive to seasonal',
    unit: '',
    confidence: 'medium',
    source: 'Campaigns add incremental lift on top of seasonal baseline. Uses highest active multiplier per platform (no overlap stacking). Platform-specific: campaigns only affect platforms listed in their config.',
    editable: false,
  },
  {
    id: 'campaign_major',
    category: 'Campaigns',
    variable: 'Major campaign lift',
    value: '1.3-1.5x',
    unit: 'multiplier',
    confidence: 'medium',
    source: 'Based on Nov 2024 IG spike (+19.5K during Hogwarts in Snow). Applied additively with seasonal factor.',
    editable: true,
  },
  {
    id: 'campaign_moderate',
    category: 'Campaigns',
    variable: 'Moderate campaign lift',
    value: '1.2x',
    unit: 'multiplier',
    confidence: 'medium',
    source: 'Events with strong visual/cultural hook but narrower audience.',
    editable: true,
  },
  {
    id: 'campaign_minor',
    category: 'Campaigns',
    variable: 'Minor campaign lift',
    value: '1.1x',
    unit: 'multiplier',
    confidence: 'high',
    source: 'Tail-end events or maintenance campaigns. Conservative estimate.',
    editable: true,
  },

  // --- Seasonal ---
  {
    id: 'seasonal_model',
    category: 'Seasonal',
    variable: 'Monthly seasonal adjustment factors',
    value: '0.85-1.25x',
    unit: 'range across 12 months',
    confidence: 'high',
    source: 'Derived from 2024-2025 historical monthly patterns. Peak months (May, Nov) show 20-25% uplift. Jan-Feb show 10-15% dip.',
    editable: false,
  },

  // --- Language ---
  {
    id: 'lang_jp_en',
    category: 'Language',
    variable: 'Bilingual content uplift (JP+EN)',
    value: 1.05,
    unit: 'flat multiplier',
    confidence: 'low',
    source: 'Ralph estimate. Needs client data: follower demographics by language, international discovery rates.',
    editable: true,
  },
  {
    id: 'lang_quad',
    category: 'Language',
    variable: 'Multilingual content uplift (JP+EN+ZH+KO)',
    value: 1.12,
    unit: 'flat multiplier',
    confidence: 'low',
    source: 'Ralph estimate. China, Korea, SEA are largest inbound tourist segments. Needs validation with actual multilingual content performance.',
    editable: true,
  },

  // --- Confidence Bands ---
  {
    id: 'optimistic_factor',
    category: 'Confidence',
    variable: 'Optimistic scenario multiplier',
    value: 1.25,
    unit: 'multiplier on forecast',
    confidence: 'medium',
    source: 'Assumes viral moments, strong campaign execution, and/or HP TV series boost. Static band; does not scale with input uncertainty.',
    editable: true,
  },
  {
    id: 'pessimistic_factor',
    category: 'Confidence',
    variable: 'Pessimistic scenario multiplier',
    value: 0.7,
    unit: 'multiplier on forecast',
    confidence: 'medium',
    source: 'Assumes slow ramp-up, platform algorithm changes, or reduced campaign impact. Static band; does not scale with input uncertainty.',
    editable: true,
  },
];

// Grouped for UI display
export const ASSUMPTION_CATEGORIES = [
  'Organic Growth',
  'Content Volume',
  'Audience',
  'Campaigns',
  'Seasonal',
  'Language',
  'Confidence',
];
