// ============================================================
// Studio Scope: 2026 Campaign Calendar
// Source: WBSTT RFP Appendix + Ralph assumptions
// ============================================================

import { Campaign } from './types';

export const CAMPAIGNS_2026: Campaign[] = [
  {
    id: 'hogwarts-snow-early',
    name: 'Hogwarts in the Snow (Tail)',
    type: 'seasonal',
    startDate: '2026-01-02',
    endDate: '2026-01-12',
    impact: 'minor',
    defaultMultiplier: 1.1,
    platforms: ['ig', 'x', 'tt'],
    description: 'Final days of winter seasonal experience. Mostly residual engagement from holiday period.',
    enabled: true,
  },
  {
    id: 'house-pride',
    name: 'House Pride',
    type: 'feature',
    startDate: '2026-01-17',
    endDate: '2026-03-15',
    impact: 'major',
    defaultMultiplier: 1.3,
    platforms: ['ig', 'x', 'tt', 'fb'],
    description: 'Major feature event celebrating Hogwarts houses. Strong UGC potential with house identity content.',
    enabled: true,
  },
  {
    id: 'sakura-season',
    name: 'Sakura Season',
    type: 'cultural',
    startDate: '2026-03-20',
    endDate: '2026-04-10',
    impact: 'moderate',
    defaultMultiplier: 1.2,
    platforms: ['ig', 'tt'],
    description: 'Cherry blossom season drives massive inbound tourism. Perfect for location-based, visually-led content combining HP sets with sakura imagery.',
    enabled: true,
  },
  {
    id: 'spring-summer-feature',
    name: 'Spring/Summer Feature',
    type: 'feature',
    startDate: '2026-03-18',
    endDate: '2026-09-06',
    impact: 'major',
    defaultMultiplier: 1.25,
    platforms: ['ig', 'x', 'tt', 'fb', 'yt'],
    description: 'Major seasonal feature experience (TBD details). Long duration provides sustained content opportunities.',
    enabled: true,
  },
  {
    id: 'golden-week',
    name: 'Golden Week',
    type: 'cultural',
    startDate: '2026-04-29',
    endDate: '2026-05-05',
    impact: 'major',
    defaultMultiplier: 1.4,
    platforms: ['ig', 'x', 'tt'],
    description: 'Biggest domestic travel period. High foot traffic, UGC opportunities, family content. Historically one of the strongest engagement weeks.',
    enabled: true,
  },
  {
    id: 'summer-holidays',
    name: 'Summer Holidays',
    type: 'seasonal',
    startDate: '2026-07-01',
    endDate: '2026-08-31',
    impact: 'major',
    defaultMultiplier: 1.3,
    platforms: ['ig', 'tt', 'yt'],
    description: 'School holidays drive family visits. WBSTT positioned as premium indoor activity during hot/rainy summer. Strong Reels and TikTok potential.',
    enabled: true,
  },
  {
    id: 'hp-25th-anniversary',
    name: "HP Philosopher's Stone 25th Anniversary",
    type: 'ip_event',
    startDate: '2026-06-26',
    endDate: '2026-07-31',
    impact: 'major',
    defaultMultiplier: 1.5,
    platforms: ['ig', 'x', 'tt', 'fb', 'yt'],
    description: '25th anniversary of the first HP film (released June 2001 UK). Global IP moment. Potential for WB-coordinated campaign, nostalgic content, anniversary merch, special screenings.',
    enabled: true,
  },
  {
    id: 'dark-arts',
    name: 'Dark Arts',
    type: 'feature',
    startDate: '2026-09-10',
    endDate: '2026-11-08',
    impact: 'major',
    defaultMultiplier: 1.35,
    platforms: ['ig', 'x', 'tt', 'yt'],
    description: 'Dark Arts seasonal takeover. Strong visual content, Halloween crossover, popular with core fans and light fans alike.',
    enabled: true,
  },
  {
    id: 'halloween',
    name: 'Halloween',
    type: 'cultural',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    impact: 'major',
    defaultMultiplier: 1.35,
    platforms: ['ig', 'tt'],
    description: 'Halloween overlaps with Dark Arts. TikTok costume content, IG Reels, strong viral potential. One of the highest engagement periods for entertainment brands.',
    enabled: true,
  },
  {
    id: 'hogwarts-snow-winter',
    name: 'Hogwarts in the Snow',
    type: 'seasonal',
    startDate: '2026-11-13',
    endDate: '2027-01-02',
    impact: 'major',
    defaultMultiplier: 1.4,
    platforms: ['ig', 'x', 'tt', 'fb', 'yt'],
    description: 'Winter seasonal experience. Christmas content, gift guides, winter tourism push. Historically strong for follower growth (Nov 2024 saw IG spike of +19K).',
    enabled: true,
  },
  {
    id: 'hp-tv-series',
    name: 'HP TV Series (HBO)',
    type: 'ip_event',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    impact: 'major',
    defaultMultiplier: 1.4,
    platforms: ['ig', 'x', 'tt', 'yt'],
    description: 'Anticipated HP TV series on HBO/Max. Timing TBD but likely fall 2026. Could be the single biggest growth catalyst. Multiplier assumes moderate overlap with WBSTT content strategy.',
    enabled: false, // Disabled by default (timing unconfirmed)
  },
];

// Seasonal adjustment factors by month (1.0 = baseline)
export const SEASONAL_FACTORS: Record<string, number> = {
  '01': 0.85,  // Post-holiday dip
  '02': 0.90,  // Winter low
  '03': 1.05,  // Spring uptick, sakura planning
  '04': 1.15,  // Sakura + Golden Week build
  '05': 1.20,  // Golden Week + spring tourism peak
  '06': 1.00,  // Baseline
  '07': 1.15,  // Summer holidays begin
  '08': 1.10,  // Summer holidays, rainy season
  '09': 1.05,  // Back to school, Dark Arts launch
  '10': 1.15,  // Halloween, autumn tourism
  '11': 1.25,  // Hogwarts in Snow launch, winter tourism
  '12': 1.10,  // Holiday season, year-end
};
