import React, { useState } from 'react';
import SectionHeader from './shared/SectionHeader';
import AudienceEngine from './AudienceEngine';
import PlatformMatrix from './PlatformMatrix';
import CampaignCalendar from './CampaignCalendar';
import type {
  AudiencePreset,
  AudienceComposition,
  Platform,
  PlatformConfig,
  LanguageSplit,
  Campaign,
} from '../data/types';

interface StrategyControlsProps {
  audiencePreset: AudiencePreset;
  audienceComposition: AudienceComposition;
  platformConfigs: Record<Platform, PlatformConfig>;
  totalPosts: number;
  languageSplit: LanguageSplit;
  campaigns: Campaign[];
  onPresetChange: (preset: AudiencePreset) => void;
  onSliderChange: (segment: keyof AudienceComposition, value: number) => void;
  onPlatformUpdate: (platform: Platform, updates: Partial<PlatformConfig>) => void;
  onLanguageChange: (split: LanguageSplit) => void;
  onToggleCampaign: (id: string) => void;
  onCampaignMultiplierChange: (id: string, multiplier: number) => void;
}

const TABS = [
  { key: 'audience', label: 'Audience' },
  { key: 'platform', label: 'Platform' },
  { key: 'campaigns', label: 'Campaigns' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

const StrategyControls: React.FC<StrategyControlsProps> = React.memo(({
  audiencePreset,
  audienceComposition,
  platformConfigs,
  totalPosts,
  languageSplit,
  campaigns,
  onPresetChange,
  onSliderChange,
  onPlatformUpdate,
  onLanguageChange,
  onToggleCampaign,
  onCampaignMultiplierChange,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('audience');

  return (
    <section>
      <SectionHeader
        moduleNumber={2}
        title="Strategy Controls"
        subtitle={<>Configure audience, platform allocation, and campaigns. <span className="live-hint">The forecast below updates live.</span> <button onClick={() => document.getElementById('module-3')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="inline-flex items-center gap-1 ml-1 text-gold hover:text-gold-light transition-colors text-xs font-medium">Jump to Forecast <span aria-hidden="true">&darr;</span></button></>}
        id="module-2"
      />

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 border-b border-border pb-0">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 text-xs font-mono transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? 'border-gold text-gold'
                : 'border-transparent text-text-dim hover:text-text-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'audience' && (
        <AudienceEngine
          embedded
          preset={audiencePreset}
          composition={audienceComposition}
          onPresetChange={onPresetChange}
          onSliderChange={onSliderChange}
        />
      )}

      {activeTab === 'platform' && (
        <PlatformMatrix
          embedded
          platformConfigs={platformConfigs}
          totalPosts={totalPosts}
          languageSplit={languageSplit}
          onPlatformUpdate={onPlatformUpdate}
          onLanguageChange={onLanguageChange}
        />
      )}

      {activeTab === 'campaigns' && (
        <CampaignCalendar
          embedded
          campaigns={campaigns}
          onToggle={onToggleCampaign}
          onMultiplierChange={onCampaignMultiplierChange}
        />
      )}
    </section>
  );
});

StrategyControls.displayName = 'StrategyControls';
export default StrategyControls;
