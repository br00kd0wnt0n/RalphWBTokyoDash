import React, { useMemo, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell,
} from 'recharts';
import SectionHeader from './shared/SectionHeader';
import MetricCard from './shared/MetricCard';
import PlatformBadge from './shared/PlatformBadge';
import { HISTORICAL_DATA, MONTHS, CURRENT_FOLLOWERS, AVG_MONTHLY_GROWTH_2025 } from '../data/historicalData';
import { PLATFORM_COLORS, type Platform } from '../data/types';
import { formatNumber, formatCompact, formatGrowth, formatMonthShort } from '../utils/formatters';
import { getFollowers, getEngagements, getImpressions, getCompleteMonths } from '../utils/calculations';

const PLATFORMS: Platform[] = ['ig', 'x', 'tt', 'fb'];

const MILESTONES: { month: string; label: string }[] = [
  { month: '2023-06', label: 'Launch' },
  { month: '2024-11', label: 'IG Spike (+19.5K)' },
  { month: '2025-11', label: 'X Surge (+9.2K)' },
];

const StateOfPlay: React.FC = React.memo(() => {
  const [chartTab, setChartTab] = useState<'growth' | 'engagement'>('growth');

  const timelineData = useMemo(() => {
    const completeMonths = getCompleteMonths();
    return completeMonths.map(month => {
      const row: Record<string, unknown> = { month, label: formatMonthShort(month) };
      PLATFORMS.forEach(p => {
        row[p] = getFollowers(month, p);
      });
      return row;
    });
  }, []);

  const platformSplit = useMemo(() => {
    const total = CURRENT_FOLLOWERS.total;
    return PLATFORMS.map(p => ({
      name: p,
      value: CURRENT_FOLLOWERS[p as keyof typeof CURRENT_FOLLOWERS] as number,
      pct: ((CURRENT_FOLLOWERS[p as keyof typeof CURRENT_FOLLOWERS] as number) / total * 100).toFixed(1),
    }));
  }, []);

  const avgEngagement = useMemo(() => {
    const months2025 = getCompleteMonths().filter(m => m.startsWith('2025'));
    const result: Record<Platform, number> = { ig: 0, x: 0, tt: 0, fb: 0, yt: 0 };
    PLATFORMS.forEach(p => {
      const rates = months2025.map(m => {
        const eng = getEngagements(m, p);
        const imp = getImpressions(m, p);
        return imp > 0 ? (eng / imp) * 100 : 0;
      });
      result[p] = rates.reduce((a, b) => a + b, 0) / rates.length;
    });
    return result;
  }, []);

  const engagementBarData = useMemo(() => {
    const completeMonths = getCompleteMonths();
    return completeMonths.map(month => {
      const row: Record<string, unknown> = { month, label: formatMonthShort(month) };
      PLATFORMS.forEach(p => {
        row[p] = getEngagements(month, p);
      });
      return row;
    });
  }, []);

  return (
    <section>
      <SectionHeader
        moduleNumber={1}
        title="State of Play"
        subtitle="Where WBSTT stands today and how it got here. 30 months of social growth data across four platforms."
        id="module-1"
      />

      {/* Tabbed chart: Follower Growth / Engagement Volume */}
      <div className="bg-bg-secondary border border-border rounded-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1">
            {(['growth', 'engagement'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setChartTab(tab)}
                className={`px-4 py-1.5 text-xs rounded-inner transition-colors ${
                  chartTab === tab
                    ? 'bg-bg-tertiary text-gold font-medium'
                    : 'text-text-dim hover:text-text-secondary'
                }`}
              >
                {tab === 'growth' ? 'Follower Growth' : 'Engagement Volume'}
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            {PLATFORMS.map(p => (
              <div key={p} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: PLATFORM_COLORS[p] }} />
                <span className="text-text-dim text-[10px]">{p.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>

        {chartTab === 'growth' ? (
          <ResponsiveContainer width="100%" height={360}>
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
              {PLATFORMS.map(p => (
                <Line key={p} type="monotone" dataKey={p} stroke={PLATFORM_COLORS[p]} strokeWidth={2} dot={false} connectNulls animationDuration={800} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={engagementBarData} margin={{ top: 30, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" strokeOpacity={0.5} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#a0a0b8' }} interval={2} axisLine={{ stroke: '#2a2a4a' }} />
              <YAxis tickFormatter={(v: number) => formatCompact(v)} tick={{ fontSize: 11, fill: '#a0a0b8' }} axisLine={{ stroke: '#2a2a4a' }} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#141428', border: '1px solid #2a2a4a', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#f5f0e8' }}
                formatter={(value: number, name: string) => [formatNumber(value), name.toUpperCase()]}
              />
              {PLATFORMS.map(p => (
                <Bar key={p} dataKey={p} stackId="eng" fill={PLATFORM_COLORS[p]} animationDuration={800} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Platform snapshot + Follower distribution side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Platform at a glance */}
        <div className="bg-bg-secondary border border-border rounded-card p-6 flex flex-col">
          <h3 className="text-text-primary text-sm font-medium mb-4">Platform at a Glance</h3>
          <div className="flex flex-col gap-3 flex-1 justify-between">
            {PLATFORMS.map(p => {
              const followers = CURRENT_FOLLOWERS[p as keyof typeof CURRENT_FOLLOWERS] as number;
              const growth = AVG_MONTHLY_GROWTH_2025[p as keyof typeof AVG_MONTHLY_GROWTH_2025] as number;
              const labels: Record<Platform, string> = { ig: 'Instagram', x: 'X / Twitter', tt: 'TikTok', fb: 'Facebook', yt: 'YouTube' };
              const maxFollowers = CURRENT_FOLLOWERS.ig;
              const barPct = (followers / maxFollowers) * 100;
              return (
                <div key={p} className="p-3 bg-bg-tertiary rounded-inner">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-medium" style={{ color: PLATFORM_COLORS[p] }}>{labels[p]}</p>
                    <p className="text-text-primary text-sm font-semibold font-mono">{formatCompact(followers)}</p>
                  </div>
                  <div className="w-full h-1.5 bg-bg-primary rounded-full overflow-hidden mb-1.5">
                    <div className="h-full rounded-full transition-all" style={{ width: `${barPct}%`, backgroundColor: PLATFORM_COLORS[p] }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-[11px] ${growth > 0 ? 'text-success' : 'text-danger'}`}>
                      {formatGrowth(growth)}/mo avg
                    </p>
                    <p className="text-text-dim text-[11px] font-mono">Eng: {avgEngagement[p].toFixed(2)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Follower distribution donut */}
        <div className="bg-bg-secondary border border-border rounded-card p-6 flex flex-col">
          <h3 className="text-text-primary text-sm font-medium mb-4">Follower Distribution</h3>
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6">
            <div className="w-full max-w-[280px] flex-shrink-0">
              <ResponsiveContainer width="100%" aspect={1}>
                <PieChart>
                  <Pie
                    data={platformSplit}
                    cx="50%"
                    cy="50%"
                    innerRadius="45%"
                    outerRadius="78%"
                    dataKey="value"
                    animationDuration={800}
                    paddingAngle={2}
                  >
                    {platformSplit.map(entry => (
                      <Cell key={entry.name} fill={PLATFORM_COLORS[entry.name as Platform]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#141428', border: '1px solid #2a2a4a', borderRadius: 8, fontSize: 12 }}
                    formatter={(value: number, _name: string, props: any) => {
                      const p = props?.payload as { name: string; pct: string } | undefined;
                      const platformLabels: Record<string, string> = { ig: 'Instagram', x: 'X / Twitter', tt: 'TikTok', fb: 'Facebook' };
                      const label = p ? platformLabels[p.name] || p.name.toUpperCase() : '';
                      const pct = p?.pct || '';
                      return [`${formatNumber(value)} (${pct}%)`, label];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-3 w-full lg:w-auto">
              {platformSplit.map(entry => {
                const platformLabels: Record<string, string> = { ig: 'Instagram', x: 'X / Twitter', tt: 'TikTok', fb: 'Facebook' };
                return (
                  <div key={entry.name} className="flex items-center gap-3 p-2.5 bg-bg-tertiary rounded-inner">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: PLATFORM_COLORS[entry.name as Platform] }} />
                    <span className="text-text-primary text-xs font-medium w-24">{platformLabels[entry.name] || entry.name}</span>
                    <span className="text-text-secondary text-sm font-mono font-semibold">{formatCompact(entry.value)}</span>
                    <span className="text-text-dim text-xs font-mono ml-auto">{entry.pct}%</span>
                  </div>
                );
              })}
              <div className="pt-2 border-t border-border mt-1">
                <div className="flex items-center justify-between px-2.5">
                  <span className="text-text-secondary text-xs font-medium">Total</span>
                  <span className="text-gold text-sm font-mono font-semibold">{formatCompact(CURRENT_FOLLOWERS.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key insight callouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-bg-secondary border border-border rounded-card p-5">
          <p className="text-gold text-xs font-mono uppercase tracking-widest mb-2">Insight</p>
          <p className="text-text-primary text-sm font-medium mb-1">Instagram is the growth engine</p>
          <p className="text-text-secondary text-xs">224K followers, accounting for 42% of total audience. Consistent +2,800/mo with Nov 2024 spike reaching +19.5K.</p>
        </div>
        <div className="bg-bg-secondary border border-border rounded-card p-5">
          <p className="text-gold text-xs font-mono uppercase tracking-widest mb-2">Insight</p>
          <p className="text-text-primary text-sm font-medium mb-1">X has plateaued since launch</p>
          <p className="text-text-secondary text-xs">Started strong at 157K in June 2023 but has only added ~37K in 30 months. Average monthly growth of just 800, with several negative months.</p>
        </div>
        <div className="bg-bg-secondary border border-border rounded-card p-5">
          <p className="text-gold text-xs font-mono uppercase tracking-widest mb-2">Insight</p>
          <p className="text-text-primary text-sm font-medium mb-1">TikTok is underperforming its potential</p>
          <p className="text-text-secondary text-xs">Only 108K followers despite early viral success (22K in Jul 2023). Low content volume (avg 10 posts/mo) is limiting algorithmic discovery.</p>
        </div>
      </div>
    </section>
  );
});

StateOfPlay.displayName = 'StateOfPlay';
export default StateOfPlay;
