import React, { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from 'recharts';
import type { ForecastMonth } from '../../data/types';
import { KPI_TARGETS, CURRENT_FOLLOWERS } from '../../data/historicalData';
import { formatNumber, formatCompact, formatGrowth } from '../../utils/formatters';
import { calcEngagementYoY } from '../../utils/kpiCalculations';

interface PitchImpactProps {
  forecast: ForecastMonth[];
  totalPostsPerMonth: number;
}

const PitchImpact: React.FC<PitchImpactProps> = React.memo(({ forecast, totalPostsPerMonth }) => {
  // KPI 1: Follower Growth
  const totalGrowth = useMemo(
    () => forecast.reduce((sum, f) => sum + f.totalCampaigns, 0),
    [forecast]
  );
  const followerTarget = KPI_TARGETS.followerGrowth;
  const followerPct = Math.min(100, (totalGrowth / followerTarget) * 100);

  // KPI 2: Engagement YoY
  const engResult = useMemo(() => calcEngagementYoY(forecast), [forecast]);
  const engPct = Math.min(100, (engResult.yoyPercent / 10) * 100);

  // KPI 3: Strategic Posts
  const postTarget = KPI_TARGETS.postsPerMonth;
  const postPct = Math.min(100, (totalPostsPerMonth / postTarget) * 100);

  // Forecast chart data (cumulative followers, single line)
  const chartData = useMemo(() => {
    const starting = CURRENT_FOLLOWERS.total;
    let cumulative = 0;
    return [
      { label: 'Dec \'25', followers: starting },
      ...forecast.map(f => {
        cumulative += f.totalCampaigns;
        return {
          label: f.label.replace(' 2026', ' \'26'),
          followers: starting + cumulative,
        };
      }),
    ];
  }, [forecast]);

  return (
    <section>
      <div className="mb-6">
        <h2 className="font-display text-3xl font-semibold text-text-primary mb-2">
          The Impact
        </h2>
        <p className="text-text-secondary text-sm max-w-2xl">
          Projected results against the three RFP KPIs, driven by the strategy controls above.
        </p>
      </div>

      {/* 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Follower Growth */}
        <div className="bg-bg-secondary border border-border rounded-card p-6">
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-3">
            Follower Growth
          </p>
          <p className="text-3xl font-semibold text-text-primary mb-1">
            {formatGrowth(totalGrowth)}
          </p>
          <p className="text-text-dim text-xs mb-3">
            Target: {formatGrowth(followerTarget)}
          </p>
          <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${followerPct}%`,
                backgroundColor: followerPct >= 100 ? '#4ade80' : followerPct >= 70 ? '#d4a843' : '#ef4444',
              }}
            />
          </div>
          <p className="text-right text-text-dim text-[10px] font-mono mt-1">
            {followerPct.toFixed(0)}%
          </p>
        </div>

        {/* Engagement YoY */}
        <div className="bg-bg-secondary border border-border rounded-card p-6">
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-3">
            Engagement YoY
          </p>
          <p className="text-3xl font-semibold text-text-primary mb-1">
            +{engResult.yoyPercent.toFixed(1)}%
          </p>
          <p className="text-text-dim text-xs mb-3">
            Target: +10%
          </p>
          <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${engPct}%`,
                backgroundColor: engResult.targetMet ? '#4ade80' : engPct >= 70 ? '#d4a843' : '#ef4444',
              }}
            />
          </div>
          <p className="text-right text-text-dim text-[10px] font-mono mt-1">
            {engPct.toFixed(0)}%
          </p>
        </div>

        {/* Strategic Posts */}
        <div className="bg-bg-secondary border border-border rounded-card p-6">
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-3">
            Strategic Posts
          </p>
          <p className="text-3xl font-semibold text-text-primary mb-1">
            {totalPostsPerMonth}/mo
          </p>
          <p className="text-text-dim text-xs mb-3">
            Target: {postTarget}/mo
          </p>
          <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${postPct}%`,
                backgroundColor: postPct >= 90 ? '#4ade80' : postPct >= 70 ? '#d4a843' : '#ef4444',
              }}
            />
          </div>
          <p className="text-right text-text-dim text-[10px] font-mono mt-1">
            {postPct.toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Live update note */}
      <p className="text-text-dim text-[11px] mb-4 flex items-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold gold-pulse" />
        KPI projections update live as you adjust strategy controls
      </p>

      {/* Forecast chart (single gold line, cumulative followers) */}
      <div className="bg-bg-secondary border border-border rounded-card p-6">
        <h3 className="text-text-primary text-sm font-medium mb-4">12-Month Follower Trajectory</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="pitchGoldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4a843" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#d4a843" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" strokeOpacity={0.5} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#a0a0b8' }}
              axisLine={{ stroke: '#2a2a4a' }}
            />
            <YAxis
              tickFormatter={(v: number) => formatCompact(v)}
              tick={{ fontSize: 11, fill: '#a0a0b8' }}
              axisLine={{ stroke: '#2a2a4a' }}
              domain={['auto', 'auto']}
            />
            <RechartsTooltip
              contentStyle={{ backgroundColor: '#141428', border: '1px solid #2a2a4a', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#f5f0e8' }}
              formatter={(value: number) => [formatNumber(value), 'Total Followers']}
            />
            <Area
              type="monotone"
              dataKey="followers"
              stroke="#d4a843"
              strokeWidth={2.5}
              fill="url(#pitchGoldGrad)"
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
});

PitchImpact.displayName = 'PitchImpact';
export default PitchImpact;
