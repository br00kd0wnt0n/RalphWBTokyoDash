import { useState, useCallback, useMemo } from 'react';
import type {
  AudiencePreset,
  AudienceComposition,
  Platform,
  PlatformConfig,
  LanguageSplit,
  Campaign,
  ForecastScenario,
  DashboardState,
} from '../data/types';
import { AUDIENCE_PRESETS, DEFAULT_PRESET } from '../data/audiences';
import { CAMPAIGNS_2026 } from '../data/campaigns';
import { generateForecast } from '../utils/forecastEngine';

const DEFAULT_PLATFORM_CONFIGS: Record<Platform, PlatformConfig> = {
  ig: {
    platform: 'ig',
    postsPerMonth: 18,
    contentMix: { video: 40, static: 30, stories: 20, ugc: 10 },
    primaryAudience: 'light',
    languageSplit: 'jp_en',
  },
  tt: {
    platform: 'tt',
    postsPerMonth: 12,
    contentMix: { video: 100, static: 0, stories: 0, ugc: 0 },
    primaryAudience: 'light',
    languageSplit: 'jp_en',
  },
  x: {
    platform: 'x',
    postsPerMonth: 12,
    contentMix: { video: 20, static: 50, stories: 0, ugc: 30 },
    primaryAudience: 'core',
    languageSplit: 'jp_only',
  },
  fb: {
    platform: 'fb',
    postsPerMonth: 4,
    contentMix: { video: 30, static: 50, stories: 10, ugc: 10 },
    primaryAudience: 'tourist',
    languageSplit: 'jp_en',
  },
  yt: {
    platform: 'yt',
    postsPerMonth: 4,
    contentMix: { video: 100, static: 0, stories: 0, ugc: 0 },
    primaryAudience: 'tourist',
    languageSplit: 'jp_en',
  },
};

const PRESET_PLATFORM_DEFAULTS: Record<Exclude<AudiencePreset, 'custom'>, Record<Platform, Partial<PlatformConfig>>> = {
  core_retention: {
    ig: { postsPerMonth: 15, primaryAudience: 'core' },
    tt: { postsPerMonth: 8, primaryAudience: 'core' },
    x: { postsPerMonth: 18, primaryAudience: 'core' },
    fb: { postsPerMonth: 5, primaryAudience: 'core' },
    yt: { postsPerMonth: 4, primaryAudience: 'core' },
  },
  casual_expansion: {
    ig: { postsPerMonth: 18, primaryAudience: 'light' },
    tt: { postsPerMonth: 12, primaryAudience: 'light' },
    x: { postsPerMonth: 12, primaryAudience: 'core' },
    fb: { postsPerMonth: 4, primaryAudience: 'tourist' },
    yt: { postsPerMonth: 4, primaryAudience: 'tourist' },
  },
  tourism_push: {
    ig: { postsPerMonth: 20, primaryAudience: 'tourist' },
    tt: { postsPerMonth: 10, primaryAudience: 'tourist' },
    x: { postsPerMonth: 8, primaryAudience: 'core' },
    fb: { postsPerMonth: 6, primaryAudience: 'tourist' },
    yt: { postsPerMonth: 6, primaryAudience: 'tourist' },
  },
};

export function useDashboardState() {
  const [activeModule, setActiveModule] = useState(1);
  const [audiencePreset, setAudiencePresetState] = useState<AudiencePreset>(DEFAULT_PRESET.id);
  const [audienceComposition, setAudienceComposition] = useState<AudienceComposition>(
    DEFAULT_PRESET.composition
  );
  const [platformConfigs, setPlatformConfigs] = useState<Record<Platform, PlatformConfig>>(
    DEFAULT_PLATFORM_CONFIGS
  );
  const [languageSplit, setLanguageSplit] = useState<LanguageSplit>('jp_en');
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS_2026);
  const [forecastScenario, setForecastScenario] = useState<ForecastScenario>('campaigns');
  const [showCampaignMarkers, setShowCampaignMarkers] = useState(true);

  const setAudiencePreset = useCallback((preset: AudiencePreset) => {
    setAudiencePresetState(preset);
    const presetConfig = AUDIENCE_PRESETS.find(p => p.id === preset);
    if (presetConfig) {
      setAudienceComposition(presetConfig.composition);
    }
    if (preset !== 'custom' && preset in PRESET_PLATFORM_DEFAULTS) {
      const overrides = PRESET_PLATFORM_DEFAULTS[preset as Exclude<AudiencePreset, 'custom'>];
      setPlatformConfigs(prev => {
        const next = { ...prev };
        for (const p of Object.keys(overrides) as Platform[]) {
          next[p] = { ...prev[p], ...overrides[p] };
        }
        return next;
      });
    }
  }, []);

  const updateAudienceSlider = useCallback((segment: keyof AudienceComposition, value: number) => {
    setAudiencePresetState('custom');
    setAudienceComposition(prev => {
      const others = Object.keys(prev).filter(k => k !== segment) as (keyof AudienceComposition)[];
      const remaining = 100 - value;
      const currentOthersSum = others.reduce((s, k) => s + prev[k], 0);

      const newComp = { ...prev, [segment]: value };
      if (currentOthersSum > 0) {
        for (const k of others) {
          newComp[k] = Math.round((prev[k] / currentOthersSum) * remaining);
        }
        // Fix rounding
        const total = Object.values(newComp).reduce((s, v) => s + v, 0);
        if (total !== 100) {
          newComp[others[0]] += 100 - total;
        }
      } else {
        const share = Math.round(remaining / others.length);
        others.forEach((k, i) => {
          newComp[k] = i === others.length - 1 ? remaining - share * (others.length - 1) : share;
        });
      }
      return newComp;
    });
  }, []);

  const updatePlatformConfig = useCallback((platform: Platform, updates: Partial<PlatformConfig>) => {
    setPlatformConfigs(prev => ({
      ...prev,
      [platform]: { ...prev[platform], ...updates },
    }));
  }, []);

  const toggleCampaign = useCallback((campaignId: string) => {
    setCampaigns(prev =>
      prev.map(c => (c.id === campaignId ? { ...c, enabled: !c.enabled } : c))
    );
  }, []);

  const updateCampaignMultiplier = useCallback((campaignId: string, multiplier: number) => {
    setCampaigns(prev =>
      prev.map(c => (c.id === campaignId ? { ...c, defaultMultiplier: multiplier } : c))
    );
  }, []);

  const forecast = useMemo(
    () => generateForecast(audienceComposition, platformConfigs, campaigns, languageSplit),
    [audienceComposition, platformConfigs, campaigns, languageSplit]
  );

  const totalPostsPerMonth = useMemo(
    () => (Object.values(platformConfigs) as PlatformConfig[]).reduce((sum, c) => sum + c.postsPerMonth, 0),
    [platformConfigs]
  );

  const state: DashboardState = {
    activeModule,
    audiencePreset,
    audienceComposition,
    platformConfigs,
    languageSplit,
    campaigns,
    forecastScenario,
    showCampaignMarkers,
  };

  return {
    state,
    forecast,
    totalPostsPerMonth,
    setActiveModule,
    setAudiencePreset,
    updateAudienceSlider,
    updatePlatformConfig,
    setLanguageSplit,
    toggleCampaign,
    updateCampaignMultiplier,
    setForecastScenario,
    setShowCampaignMarkers,
    setCampaigns,
  };
}
