import React, { useCallback, useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import StateOfPlay from './components/StateOfPlay';
import StrategyControls from './components/StrategyControls';
import FollowerForecast from './components/FollowerForecast';
import EngagementForecast from './components/EngagementForecast';
import ContentTracker from './components/ContentTracker';
import UnderTheHood from './components/UnderTheHood';
import AIAssessment from './components/AIAssessment';
import { useDashboardState } from './hooks/useDashboardState';

function App() {
  const {
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
  } = useDashboardState();

  const mainRef = useRef<HTMLElement>(null);
  const [visibleModule, setVisibleModule] = useState(1);

  const scrollToModule = useCallback((moduleNum: number) => {
    const el = document.getElementById(`module-${moduleNum}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveModule(moduleNum);
    }
  }, [setActiveModule]);

  // Track which module is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const num = parseInt(id.replace('module-', ''), 10);
            if (!isNaN(num)) {
              setVisibleModule(num);
            }
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
    );

    for (let i = 1; i <= 7; i++) {
      const el = document.getElementById(`module-${i}`);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Header activeModule={visibleModule} onModuleClick={scrollToModule} />

      <main ref={mainRef} className="max-w-dashboard mx-auto px-6 py-module space-y-module">
        <StateOfPlay />

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

        <FollowerForecast
          forecast={forecast}
          scenario={state.forecastScenario}
          showCampaignMarkers={state.showCampaignMarkers}
          campaigns={state.campaigns}
          onScenarioChange={setForecastScenario}
          onToggleCampaignMarkers={setShowCampaignMarkers}
        />

        <EngagementForecast forecast={forecast} />

        <ContentTracker />

        <UnderTheHood />

        <AIAssessment />
      </main>

      <footer className="border-t border-border py-6 text-center text-text-dim text-xs">
        Built by Ralph Innovation &middot; 2026
      </footer>
    </div>
  );
}

export default App;
