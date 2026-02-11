import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import MetricCard from '../shared/MetricCard';
import { CURRENT_FOLLOWERS, AVG_MONTHLY_GROWTH_2025 } from '../../data/historicalData';
import { PLATFORM_LABELS, PLATFORM_COLORS } from '../../data/types';
import type { Platform } from '../../data/types';
import { formatCompact, formatGrowth, formatNumber, formatMonthShort } from '../../utils/formatters';
import { getFollowers, getCompleteMonths } from '../../utils/calculations';

const DISPLAY_PLATFORMS: Platform[] = ['ig', 'x', 'tt', 'fb'];

const MILESTONES: { month: string; label: string }[] = [
  { month: '2023-06', label: 'Launch' },
  { month: '2024-11', label: 'IG Spike (+19.5K)' },
  { month: '2025-11', label: 'X Surge (+9.2K)' },
];

const WhereYouAre: React.FC = React.memo(() => {
  const [expanded, setExpanded] = useState(true);

  const timelineData = useMemo(() => {
    const completeMonths = getCompleteMonths();
    return completeMonths.map(month => {
      const row: Record<string, unknown> = { month, label: formatMonthShort(month) };
      DISPLAY_PLATFORMS.forEach(p => {
        row[p] = getFollowers(month, p);
      });
      return row;
    });
  }, []);

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
        {expanded ? 'Collapse' : 'See the full picture'}
      </button>

      {/* Expanded: historical chart + platform cards + insights */}
      {expanded && (
        <div className="space-y-4 animate-in">
          {/* Historical follower timeline */}
          <div className="bg-bg-secondary border border-border rounded-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-text-primary text-sm font-medium">Follower Growth: Jun 2023 to Dec 2025</h3>
              <div className="flex gap-4">
                {DISPLAY_PLATFORMS.map(p => (
                  <div key={p} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: PLATFORM_COLORS[p] }} />
                    <span className="text-text-dim text-[10px]">{p.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={timelineData} margin={{ top: 30, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" strokeOpacity={0.5} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#a0a0b8' }} interval={2} axisLine={{ stroke: '#2a2a4a' }} />
                <YAxis tickFormatter={(v: number) => formatCompact(v)} tick={{ fontSize: 11, fill: '#a0a0b8' }} axisLine={{ stroke: '#2a2a4a' }} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#141428', border: '1px solid #2a2a4a', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#f5f0e8' }}
                  formatter={(value: number, name: string) => [formatNumber(value), name.toUpperCase()]}
                />
                {MILESTONES.map(ms => (
                  <ReferenceLine
                    key={ms.month}
                    x={formatMonthShort(ms.month)}
                    stroke="#8a7030"
                    strokeDasharray="4 4"
                    label={{ value: ms.label, position: 'top', fontSize: 10, fill: '#a0a0b8' }}
                  />
                ))}
                {DISPLAY_PLATFORMS.map(p => (
                  <Line key={p} type="monotone" dataKey={p} stroke={PLATFORM_COLORS[p]} strokeWidth={2} dot={false} connectNulls animationDuration={800} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Platform breakdown cards */}
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
