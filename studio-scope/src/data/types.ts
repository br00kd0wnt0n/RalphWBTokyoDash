// ============================================================
// Studio Scope: Type Definitions
// ============================================================

// --- Platform ---

export type Platform = 'ig' | 'x' | 'tt' | 'fb' | 'yt';

export const PLATFORM_LABELS: Record<Platform, string> = {
  ig: 'Instagram',
  x: 'X / Twitter',
  tt: 'TikTok',
  fb: 'Facebook',
  yt: 'YouTube',
};

export const PLATFORM_COLORS: Record<Platform, string> = {
  ig: '#E1306C',
  x: '#f5f5f5',
  tt: '#00F2EA',
  fb: '#1877F2',
  yt: '#FF0000',
};

// --- Historical Data ---

export interface PlatformMonthlyData {
  followers: number | null;
  net_growth: number;
  posts: number;
  impressions: number;
  engagements: number;
  likes: number;
  video_views: number;
  // Platform-specific fields (nullable)
  comments?: number;
  shares?: number;
  saves?: number;
  reach?: number;
  reels_views?: number;
  reposts?: number;
  replies?: number;
  profile_clicks?: number;
  profile_views?: number;
  reactions?: number;
  followers_gained?: number;
  followers_lost?: number;
  engagement_rate?: number | null;
}

export interface MonthlySnapshot {
  month: string; // "2023-06"
  ig: PlatformMonthlyData;
  x: PlatformMonthlyData;
  tt: PlatformMonthlyData;
  fb: PlatformMonthlyData;
}

// --- Audience Segments ---

export type AudienceSegment = 'core' | 'light' | 'tourist';

export interface SegmentDefinition {
  id: AudienceSegment;
  label: string;
  description: string;
  estimatedPool: string;
  ageRange: string;
  platformAffinity: Platform[];
  contentStyle: string[];
  followConversionMultiplier: Record<Platform, number>;
  engagementRateMultiplier: Record<Platform, number>;
}

export type AudiencePreset = 'core_retention' | 'casual_expansion' | 'tourism_push' | 'custom';

export interface AudienceComposition {
  core: number;   // 0-100, all three sum to 100
  light: number;
  tourist: number;
}

export interface AudiencePresetConfig {
  id: AudiencePreset;
  label: string;
  description: string;
  recommended?: boolean;
  composition: AudienceComposition;
}

// --- Platform Strategy ---

export type ContentType = 'video' | 'static' | 'stories' | 'ugc';

export type LanguageSplit = 'jp_only' | 'jp_en' | 'jp_en_zh_ko';

export interface PlatformConfig {
  platform: Platform;
  postsPerMonth: number;
  contentMix: Record<ContentType, number>; // percentages summing to 100
  primaryAudience: AudienceSegment;
  languageSplit: LanguageSplit;
}

// --- Campaign Calendar ---

export type CampaignType = 'feature' | 'seasonal' | 'cultural' | 'ip_event';
export type CampaignImpact = 'major' | 'moderate' | 'minor';

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  startDate: string; // "2026-01-17"
  endDate: string;
  impact: CampaignImpact;
  defaultMultiplier: number; // 1.0 = no effect, 1.4 = 40% lift
  platforms: Platform[];
  description: string;
  enabled: boolean;
}

// --- Forecast ---

export interface ForecastMonth {
  month: string; // "2026-01"
  label: string; // "Jan 2026"
  platforms: Record<Platform, {
    baseGrowth: number;
    withStrategy: number;
    withCampaigns: number;
    optimistic: number;
    pessimistic: number;
  }>;
  totalBase: number;
  totalStrategy: number;
  totalCampaigns: number;
  totalOptimistic: number;
  totalPessimistic: number;
  cumulativeGrowth: number;
  activeCampaigns: string[];
  seasonalFactor: number;
}

export type ForecastScenario = 'organic' | 'strategy' | 'campaigns';

// --- Assumptions ---

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface Assumption {
  id: string;
  category: string;
  variable: string;
  value: number | string;
  unit: string;
  confidence: ConfidenceLevel;
  source: string;
  editable: boolean;
}

// --- Dashboard State ---

export interface DashboardState {
  activeModule: number;
  audiencePreset: AudiencePreset;
  audienceComposition: AudienceComposition;
  platformConfigs: Record<Platform, PlatformConfig>;
  languageSplit: LanguageSplit;
  campaigns: Campaign[];
  forecastScenario: ForecastScenario;
  showCampaignMarkers: boolean;
}
