// ============================================================
// Studio Scope: 2026 Campaign Calendar
// Source: Client Event Schedule + Ralph assumptions
// ============================================================

import { Campaign } from './types';

export const CAMPAIGNS_2026: Campaign[] = [
  {
    id: 'winter-wonderland-early',
    name: 'Winter Wonderland (Tail)',
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
    id: 'heritage-collection',
    name: 'Heritage Collection',
    type: 'feature',
    startDate: '2026-01-17',
    endDate: '2026-03-15',
    impact: 'major',
    defaultMultiplier: 1.3,
    platforms: ['ig', 'x', 'tt', 'fb'],
    description: 'Major feature event celebrating brand heritage and legacy. Strong UGC potential with fan identity content.',
    enabled: true,
  },
  {
    id: 'spring-festival',
    name: 'Spring Festival',
    type: 'cultural',
    startDate: '2026-03-20',
    endDate: '2026-04-10',
    impact: 'moderate',
    defaultMultiplier: 1.2,
    platforms: ['ig', 'tt'],
    description: 'Spring season drives massive inbound tourism. Perfect for location-based, visually-led content combining venue sets with seasonal imagery.',
    enabled: true,
  },
  {
    id: 'summer-showcase',
    name: 'Summer Showcase',
    type: 'feature',
    startDate: '2026-03-18',
    endDate: '2026-09-06',
    impact: 'major',
    defaultMultiplier: 1.25,
    platforms: ['ig', 'x', 'tt', 'fb', 'yt'],
    description: 'Major seasonal feature experience. Long duration provides sustained content opportunities.',
    enabled: true,
  },
  {
    id: 'national-holiday',
    name: 'National Holiday Week',
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
    description: 'School holidays drive family visits. Venue positioned as premium indoor activity during summer. Strong Reels and TikTok potential.',
    enabled: true,
  },
  {
    id: 'franchise-25th-anniversary',
    name: 'Franchise 25th Anniversary',
    type: 'ip_event',
    startDate: '2026-06-26',
    endDate: '2026-07-31',
    impact: 'major',
    defaultMultiplier: 1.5,
    platforms: ['ig', 'x', 'tt', 'fb', 'yt'],
    description: '25th anniversary of the franchise. Global IP moment. Potential for coordinated campaign, nostalgic content, anniversary merchandise, special events.',
    enabled: true,
  },
  {
    id: 'fright-nights',
    name: 'Fright Nights',
    type: 'feature',
    startDate: '2026-09-10',
    endDate: '2026-11-08',
    impact: 'major',
    defaultMultiplier: 1.35,
    platforms: ['ig', 'x', 'tt', 'yt'],
    description: 'Seasonal dark-themed takeover. Strong visual content, Halloween crossover, popular with core fans and casual visitors alike.',
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
    description: 'Halloween overlaps with Fright Nights. TikTok costume content, IG Reels, strong viral potential. One of the highest engagement periods for entertainment brands.',
    enabled: true,
  },
  {
    id: 'winter-wonderland',
    name: 'Winter Wonderland',
    type: 'seasonal',
    startDate: '2026-11-13',
    endDate: '2027-01-02',
    impact: 'major',
    defaultMultiplier: 1.4,
    platforms: ['ig', 'x', 'tt', 'fb', 'yt'],
    description: 'Winter seasonal experience. Christmas content, gift guides, winter tourism push. Historically strong for follower growth.',
    enabled: true,
  },
  {
    id: 'franchise-tv-series',
    name: 'Franchise TV Series (Streaming)',
    type: 'ip_event',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    impact: 'major',
    defaultMultiplier: 1.4,
    platforms: ['ig', 'x', 'tt', 'yt'],
    description: 'Anticipated franchise TV series on major streaming platform. Timing TBD but likely fall 2026. Could be the single biggest growth catalyst.',
    enabled: false, // Disabled by default (timing unconfirmed)
  },
];

// Seasonal adjustment factors by month (1.0 = baseline)
export const SEASONAL_FACTORS: Record<string, number> = {
  '01': 0.85,  // Post-holiday dip
  '02': 0.90,  // Winter low
  '03': 1.05,  // Spring uptick
  '04': 1.15,  // Spring + holiday build
  '05': 1.20,  // National holiday + spring tourism peak
  '06': 1.00,  // Baseline
  '07': 1.15,  // Summer holidays begin
  '08': 1.10,  // Summer holidays
  '09': 1.05,  // Back to school, Fright Nights launch
  '10': 1.15,  // Halloween, autumn tourism
  '11': 1.25,  // Winter Wonderland launch, winter tourism
  '12': 1.10,  // Holiday season, year-end
};
