import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import MetricCard from '../shared/MetricCard';
import { CURRENT_FOLLOWERS, AVG_MONTHLY_GROWTH_2025 } from '../../data/historicalData';
import { PLATFORM_LABELS, PLATFORM_COLORS } from '../../data/types';
import type { Platform } from '../../data/types';
import { formatCompact, formatGrowth } from '../../utils/formatters';

const DISPLAY_PLATFORMS: Platform[] = ['ig', 'x', 'tt', 'fb'];

const WhereYouAre: React.FC = React.memo(() => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section>
      <div className="mb-6">
        <h2 className="font-display text-3xl font-semibold text-text-primary mb-2">
          Where You Are
        </h2>
        <p className="text-text-secondary text-sm max-w-2xl">
          WBSTT social presence as of December 2025. The foundation for everything that follows.
        </p>
      </div>

      {/* Collapsed: 3 summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <MetricCard
          label="Total Followers"
          value={formatCompact(CURRENT_FOLLOWERS.total)}
          subValue="Across IG, X, TT, FB"
          accentColor="#d4a843"
        />
        <MetricCard
          label="Primary Engine"
          value="Instagram"
          subValue={`${formatCompact(CURRENT_FOLLOWERS.ig)} followers (42%)`}
          accentColor="#E1306C"
        />
        <MetricCard
          label="Avg Monthly Growth"
          value={formatGrowth(AVG_MONTHLY_GROWTH_2025.total)}
          subValue="2025 average across all platforms"
          trend="up"
          trendLabel={`${formatGrowth(AVG_MONTHLY_GROWTH_2025.ig)}/mo on IG`}
        />
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs text-text-dim hover:text-gold transition-colors mb-4"
      >
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        {expanded ? 'Collapse' : 'Platform breakdown'}
      </button>

      {/* Expanded: platform cards + insights */}
      {expanded && (
        <div className="space-y-4 animate-in">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {DISPLAY_PLATFORMS.map(p => (
              <div
                key={p}
                className="bg-bg-secondary border border-border rounded-card p-5"
              >
                <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2">
                  {PLATFORM_LABELS[p]}
                </p>
                <p className="text-xl font-semibold" style={{ color: PLATFORM_COLORS[p] }}>
                  {formatCompact(CURRENT_FOLLOWERS[p as keyof typeof CURRENT_FOLLOWERS] as number)}
                </p>
                <p className="text-text-dim text-xs mt-1">
                  {formatGrowth(AVG_MONTHLY_GROWTH_2025[p as keyof typeof AVG_MONTHLY_GROWTH_2025] as number)}/mo avg
                </p>
              </div>
            ))}
          </div>

          {/* Insight callouts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 bg-bg-tertiary rounded-inner border-l-2 border-[#E1306C]">
              <p className="text-text-primary text-xs font-medium mb-1">Instagram is the growth engine</p>
              <p className="text-text-dim text-[11px] leading-relaxed">
                IG accounts for 42% of total followers and 70% of monthly growth ({formatGrowth(AVG_MONTHLY_GROWTH_2025.ig)}/mo). Strategy should protect and accelerate this channel.
              </p>
            </div>
            <div className="p-4 bg-bg-tertiary rounded-inner border-l-2 border-[#00F2EA]">
              <p className="text-text-primary text-xs font-medium mb-1">TikTok: underperforming vs. potential</p>
              <p className="text-text-dim text-[11px] leading-relaxed">
                108K followers but only {formatGrowth(AVG_MONTHLY_GROWTH_2025.tt)}/mo growth. Low posting volume (avg 10/mo) limits algorithmic discovery. Biggest opportunity for uplift.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
});

WhereYouAre.displayName = 'WhereYouAre';
export default WhereYouAre;
