// ============================================================
// Studio Scope: Audience Segment Definitions & Presets
// ============================================================

import { SegmentDefinition, AudiencePresetConfig } from './types';

// ============================================================
// IMPORTANT: followConversionMultiplier and engagementRateMultiplier
// values are Ralph estimates, NOT derived from client data.
// NEEDS CLIENT DATA: Platform-level audience demographics and
// content-type performance data to validate or replace these values.
// ============================================================
export const SEGMENTS: Record<string, SegmentDefinition> = {
  core: {
    id: 'core',
    label: 'Core Fans',
    description: 'Dedicated Harry Potter fans who have read multiple books, seen all films, and actively engage with HP content. Primarily domestic Japanese audience aged 15-45.',
    estimatedPool: '9.4M active',
    ageRange: '15-45',
    platformAffinity: ['x', 'ig'],
    contentStyle: ['Deep lore', 'Behind-the-scenes', 'Exclusive reveals', 'Merchandise previews', 'Character deep-dives'],
    followConversionMultiplier: {
      ig: 1.0,
      x: 1.2,
      tt: 0.6,
      fb: 0.8,
      yt: 0.7,
    },
    engagementRateMultiplier: {
      ig: 1.2,
      x: 1.3,
      tt: 0.7,
      fb: 1.0,
      yt: 0.9,
    },
  },
  light: {
    id: 'light',
    label: 'Light Fans',
    description: 'Have read at least one HP book or seen at least one film. Entertainment seekers aged 18-35 who enjoy themed experiences but are not deeply invested in lore. High potential for FOMO-driven content.',
    estimatedPool: '19.6M lapsed',
    ageRange: '18-35',
    platformAffinity: ['tt', 'ig'],
    contentStyle: ['Experience-led', 'FOMO/viral', 'Fun and shareable', 'Visual spectacle', 'Trending formats'],
    followConversionMultiplier: {
      ig: 1.1,
      x: 0.5,
      tt: 1.4,
      fb: 0.6,
      yt: 0.8,
    },
    engagementRateMultiplier: {
      ig: 0.9,
      x: 0.5,
      tt: 1.3,
      fb: 0.7,
      yt: 1.0,
    },
  },
  tourist: {
    id: 'tourist',
    label: 'Inbound Tourists',
    description: 'International visitors planning or currently on Tokyo trips. Key markets: China, Korea, US, Southeast Asia. Motivated by visual spectacle and practical visit information. Multilingual content essential.',
    estimatedPool: 'Variable (42.4M inbound 2025)',
    ageRange: '20-50',
    platformAffinity: ['ig', 'yt', 'tt'],
    contentStyle: ['Location/access info', 'Visual spectacle', 'Multilingual captions', 'Ticket/visit guides', 'Photo spot highlights'],
    followConversionMultiplier: {
      ig: 1.3,
      x: 0.3,
      tt: 1.0,
      fb: 0.9,
      yt: 1.2,
    },
    engagementRateMultiplier: {
      ig: 0.8,
      x: 0.3,
      tt: 0.9,
      fb: 0.8,
      yt: 1.1,
    },
  },
};

export const AUDIENCE_PRESETS: AudiencePresetConfig[] = [
  {
    id: 'core_retention',
    label: 'Core Retention',
    description: 'Prioritise existing fan base. Maintain high engagement rates on X and IG with lore-heavy content. Lower growth ceiling but stronger per-follower value.',
    composition: { core: 70, light: 20, tourist: 10 },
  },
  {
    id: 'casual_expansion',
    label: 'Casual Expansion',
    description: 'Shift toward light fans on TikTok and IG Reels. Highest growth potential. Requires experience-led, visually-driven content strategy.',
    recommended: true,
    composition: { core: 30, light: 50, tourist: 20 },
  },
  {
    id: 'tourism_push',
    label: 'Tourism Push',
    description: 'Maximise inbound tourist reach with multilingual content. Strongest social-to-attendance conversion but requires JP/EN/ZH/KO content pipeline.',
    composition: { core: 20, light: 30, tourist: 50 },
  },
  {
    id: 'custom',
    label: 'Custom',
    description: 'Manually adjust the audience segment mix using the sliders below.',
    composition: { core: 34, light: 33, tourist: 33 },
  },
];

export const DEFAULT_PRESET: AudiencePresetConfig = AUDIENCE_PRESETS[1]; // Casual Expansion
