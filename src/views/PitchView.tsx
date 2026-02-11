import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import PitchHeader from '../components/pitch/PitchHeader';
import PitchWelcomeOverlay from '../components/pitch/PitchWelcomeOverlay';
import WhereYouAre from '../components/pitch/WhereYouAre';
import StrategyControls from '../components/StrategyControls';
import PitchImpact from '../components/pitch/PitchImpact';
import UnderTheHood from '../components/UnderTheHood';
import { useDashboardState } from '../hooks/useDashboardState';

function PitchView() {
  const {
    state,
    forecast,
    totalPostsPerMonth,
    setAudiencePreset,
    updateAudienceSlider,
    updatePlatformConfig,
    setLanguageSplit,
    toggleCampaign,
    updateCampaignMultiplier,
  } = useDashboardState();

  const [showWelcome, setShowWelcome] = useState(true);
  const [showMethodology, setShowMethodology] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {showWelcome && <PitchWelcomeOverlay onClose={() => setShowWelcome(false)} />}

      <PitchHeader
        onInfoClick={() => setShowWelcome(true)}
        onMethodologyClick={() => setShowMethodology(true)}
      />

      <main className="max-w-dashboard mx-auto px-6 py-module space-y-module">
        <WhereYouAre />

        <StrategyControls
          audiencePreset={state.audiencePreset}
          audienceComposition={state.audienceComposition}
          platformConfigs={state.platformConfigs}
          totalPosts={totalPostsPerMonth}
          languageSplit={state.languageSplit}
          campaigns={state.campaigns}
          onPresetChange={setAudiencePreset}
          onSliderChange={updateAudienceSlider}
          onPlatformUpdate={updatePlatformConfig}
          onLanguageChange={setLanguageSplit}
          onToggleCampaign={toggleCampaign}
          onCampaignMultiplierChange={updateCampaignMultiplier}
        />

        <PitchImpact
          forecast={forecast}
          totalPostsPerMonth={totalPostsPerMonth}
        />
      </main>

      {/* Footer with link to full dashboard */}
      <footer className="border-t border-border py-8 text-center">
        <Link
          to="/full"
          className="inline-block px-6 py-2.5 text-sm text-gold border border-gold/30 rounded-inner hover:bg-gold/10 transition-colors mb-4"
        >
          View Full Dashboard
        </Link>
        <p className="text-text-dim text-xs">
          Built by Ralph Innovation &middot; 2026
        </p>
      </footer>

      {/* Methodology modal overlay */}
      {showMethodology && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-bg-primary/90 backdrop-blur-sm" onClick={() => setShowMethodology(false)} />
          <div className="relative w-full max-w-5xl max-h-[85vh] overflow-y-auto bg-bg-secondary border border-border rounded-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-semibold text-text-primary">Under the Hood</h2>
              <button
                onClick={() => setShowMethodology(false)}
                className="text-text-dim hover:text-text-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <UnderTheHood compact />
          </div>
        </div>
      )}
    </div>
  );
}

export default PitchView;
