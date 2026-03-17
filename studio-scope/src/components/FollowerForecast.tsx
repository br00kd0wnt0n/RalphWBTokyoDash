import React, { useMemo } from 'react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import SectionHeader from './shared/SectionHeader';
import MetricCard from './shared/MetricCard';
import ToggleSwitch from './shared/ToggleSwitch';
import type { ForecastMonth, ForecastScenario, Campaign } from '../data/types';
import { KPI_TARGETS, CURRENT_FOLLOWERS } from '../data/historicalData';
import { formatNumber, formatCompact, formatGrowth } from '../utils/formatters';

interface FollowerForecastProps {
  forecast: ForecastMonth[];
  scenario: ForecastScenario;
  showCampaignMarkers: boolean;
  campaigns: Campaign[];
  onScenarioChange: (scenario: ForecastScenario) => void;
  onToggleCampaignMarkers: (show: boolean) => void;
}

const SCENARIOS: { value: ForecastScenario; label: string }[] = [
  { value: 'organic', label: 'Organic Only' },
  { value: 'strategy', label: 'With Strategy' },
  { value: 'campaigns', label: 'With Campaigns' },
];

const FollowerForecast: React.FC<FollowerForecastProps> = React.memo(({
  forecast,
  scenario,
  showCampaignMarkers,
  campaigns,
  onScenarioChange,
  onToggleCampaignMarkers,
}) => {
  const chartData = useMemo(() => {
    let cumBase = 0;
    let cumStrategy = 0;
    let cumCampaigns = 0;
    let cumOptimistic = 0;
    let cumPessimistic = 0;
    const starting = CURRENT_FOLLOWERS.total;

    return [
      {
        label: 'Dec 2025',
        base: starting,
        strategy: starting,
        campaigns: starting,
        optimistic: starting,
        pessimistic: starting,
        month: '2025-12',
      },
      ...forecast.map(f => {
        cumBase += f.totalBase;
        cumStrategy += f.totalStrategy;
        cumCampaigns += f.totalCampaigns;
        cumOptimistic += f.totalOptimistic;
        cumPessimistic += f.totalPessimistic;
        return {
          label: f.label,
          base: starting + cumBase,
          strategy: starting + cumStrategy,
          campaigns: starting + cumCampaigns,
          optimistic: starting + cumOptimistic,
          pessimistic: starting + cumPessimistic,
          month: f.month,
          activeCampaigns: f.activeCampaigns,
        };
      }),
    ];
  }, [forecast]);

  const totalGrowth = useMemo(() => {
    return forecast.reduce((sum, f) => {
      if (scenario === 'organic') return sum + f.totalBase;
      if (scenario === 'strategy') return sum + f.totalStrategy;
      return sum + f.totalCampaigns;
    }, 0);
  }, [forecast, scenario]);

  const target = KPI_TARGETS.followerGrowth;
  const progressPct = Math.min(100, (totalGrowth / target) * 100);
  const endFollowers = CURRENT_FOLLOWERS.total + totalGrowth;

  const primaryKey = scenario === 'organic' ? 'base' : scenario === 'strategy' ? 'strategy' : 'campaigns';

  const growthTable = useMemo(() =>
    forecast.map(f => ({
      label: f.label,
      ig: scenario === 'organic' ? f.platforms.ig.baseGrowth : scenario === 'strategy' ? f.platforms.ig.withStrategy : f.platforms.ig.withCampaigns,
      x: scenario === 'organic' ? f.platforms.x.baseGrowth : scenario === 'strategy' ? f.platforms.x.withStrategy : f.platforms.x.withCampaigns,
      tt: scenario === 'organic' ? f.platforms.tt.baseGrowth : scenario === 'strategy' ? f.platforms.tt.withStrategy : f.platforms.tt.withCampaigns,
      fb: scenario === 'organic' ? f.platforms.fb.baseGrowth : scenario === 'strategy' ? f.platforms.fb.withStrategy : f.platforms.fb.withCampaigns,
      total: scenario === 'organic' ? f.totalBase : scenario === 'strategy' ? f.totalStrategy : f.totalCampaigns,
    })),
    [forecast, scenario]
  );

  // Find campaign markers
  const campaignMarkers = useMemo(() => {
    if (!showCampaignMarkers) return [];
    const markers: { month: string; label: string }[] = [];
    campaigns.filter(c => c.enabled).forEach(c => {
      const startMonth = c.startDate.slice(0, 7);
      if (startMonth.startsWith('2026')) {
        const monthLabel = forecast.find(f => f.month === startMonth)?.label;
        if (monthLabel && !markers.find(m => m.month === monthLabel && m.label === c.name)) {
          markers.push({ month: monthLabel, label: c.name });
        }
      }
    });
    return markers;
  }, [campaigns, showCampaignMarkers, forecast]);

  return (
    <section>
      <SectionHeader
        moduleNumber={3}
        title="Follower Forecast"
        subtitle="12-month projected follower growth across all platforms. The forecast responds to audience, platform, and campaign inputs above."
        id="module-3"
      />

      {/* Scenario toggle + campaign markers */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-1">
          {SCENARIOS.map(s => (
            <button
              key={s.value}
              onClick={() => onScenarioChange(s.value)}
              className={`px-4 py-2 text-xs rounded-inner transition-colors ${
                scenario === s.value
                  ? 'bg-gold text-bg-primary font-medium'
                  : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <ToggleSwitch
          label="Campaign Markers"
          enabled={showCampaignMarkers}
          onChange={onToggleCampaignMarkers}
        />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Projected Total"
          value={formatCompact(endFollowers)}
          trend="up"
          trendLabel={`${formatGrowth(totalGrowth)} from today`}
          accentColor="#d4a843"
        />
        <MetricCard
          label="Monthly Avg Growth"
          value={formatNumber(Math.round(totalGrowth / 12))}
          trend="up"
          trendLabel="Across all platforms"
        />
        <MetricCard
          label="Target: +100K"
          value={`${progressPct.toFixed(0)}%`}
          trend={progressPct >= 100 ? 'up' : progressPct >= 70 ? 'up' : 'flat'}
          trendLabel={progressPct >= 100 ? 'Target exceeded' : `${formatNumber(target - totalGrowth)} remaining`}
          accentColor={progressPct >= 100 ? '#4ade80' : progressPct >= 70 ? '#fbbf24' : '#ef4444'}
        />
        <MetricCard
          label="Seasonal Peak"
          value={forecast.length > 0 ? formatNumber(Math.max(...forecast.map(f => scenario === 'organic' ? f.totalBase : scenario === 'strategy' ? f.totalStrategy : f.totalCampaigns))) : '0'}
          subValue="Best month projected growth"
        />
      </div>

      {/* Target progress bar */}
      <div className="bg-bg-secondary border border-border rounded-card p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-text-secondary text-xs">Progress toward +{formatNumber(target)} goal</p>
          <p className="text-gold text-sm font-mono font-semibold">{formatGrowth(totalGrowth)}</p>
        </div>
        <div className="w-full h-3 bg-bg-tertiary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, progressPct)}%`,
              backgroundColor: progressPct >= 100 ? '#4ade80' : '#d4a843',
            }}
          />
        </div>
      </div>

      {/* Main forecast chart */}
      <div className="bg-bg-secondary border border-border rounded-card p-6 mb-6">
        <h3 className="text-text-primary text-sm font-medium mb-4">12-Month Follower Trajectory</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData} margin={{ top: 30, right: 30, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="optimisticGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="pessimisticGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" strokeOpacity={0.5} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#a0a0b8' }} axisLine={{ stroke: '#2a2a4a' }} />
            <YAxis
              tickFormatter={(v: number) => formatCompact(v)}
              tick={{ fontSize: 11, fill: '#a0a0b8' }}
              axisLine={{ stroke: '#2a2a4a' }}
              domain={['auto', 'auto']}
            />
            <RechartsTooltip
              contentStyle={{ backgroundColor: '#141428', border: '1px solid #2a2a4a', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#f5f0e8' }}
              formatter={(value: number, name: string) => [formatNumber(value), name.charAt(0).toUpperCase() + name.slice(1)]}
            />
            {scenario === 'campaigns' && (
              <>
                <Area type="monotone" dataKey="optimistic" stroke="none" fill="url(#optimisticGrad)" animationDuration={800} />
                <Area type="monotone" dataKey="pessimistic" stroke="none" fill="url(#pessimisticGrad)" animationDuration={800} />
              </>
            )}
            <Area
              type="monotone"
              dataKey={primaryKey}
              stroke="#d4a843"
              strokeWidth={2.5}
              fill="none"
              animationDuration={800}
            />
            {campaignMarkers.map((cm, i) => (
              <ReferenceLine
                key={i}
                x={cm.month}
                stroke="#8a7030"
                strokeDasharray="4 4"
                label={{ value: cm.label, position: 'top', fontSize: 9, fill: '#a0a0b8' }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly growth breakdown */}
      <div className="bg-bg-secondary border border-border rounded-card p-6 overflow-x-auto">
        <h3 className="text-text-primary text-sm font-medium mb-4">Monthly Growth Breakdown</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-text-dim py-2 pr-4 font-medium">Month</th>
              <th className="text-right text-text-dim py-2 px-3 font-medium" style={{ color: '#E1306C' }}>IG</th>
              <th className="text-right text-text-dim py-2 px-3 font-medium" style={{ color: '#f5f5f5' }}>X</th>
              <th className="text-right text-text-dim py-2 px-3 font-medium" style={{ color: '#00F2EA' }}>TT</th>
              <th className="text-right text-text-dim py-2 px-3 font-medium" style={{ color: '#1877F2' }}>FB</th>
              <th className="text-right text-text-dim py-2 pl-3 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {growthTable.map((row) => (
              <tr key={row.label} className="border-b border-border/50 hover:bg-bg-tertiary/30">
                <td className="py-2 pr-4 text-text-secondary font-mono">{row.label}</td>
                <td className="py-2 px-3 text-right text-text-primary font-mono">+{formatNumber(row.ig)}</td>
                <td className="py-2 px-3 text-right text-text-primary font-mono">+{formatNumber(row.x)}</td>
                <td className="py-2 px-3 text-right text-text-primary font-mono">+{formatNumber(row.tt)}</td>
                <td className="py-2 px-3 text-right text-text-primary font-mono">+{formatNumber(row.fb)}</td>
                <td className="py-2 pl-3 text-right text-gold font-mono font-semibold">+{formatNumber(row.total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gold/30">
              <td className="py-3 pr-4 text-text-primary font-semibold">Total</td>
              <td className="py-3 px-3 text-right text-text-primary font-mono font-semibold">
                +{formatNumber(growthTable.reduce((s, r) => s + r.ig, 0))}
              </td>
              <td className="py-3 px-3 text-right text-text-primary font-mono font-semibold">
                +{formatNumber(growthTable.reduce((s, r) => s + r.x, 0))}
              </td>
              <td className="py-3 px-3 text-right text-text-primary font-mono font-semibold">
                +{formatNumber(growthTable.reduce((s, r) => s + r.tt, 0))}
              </td>
              <td className="py-3 px-3 text-right text-text-primary font-mono font-semibold">
                +{formatNumber(growthTable.reduce((s, r) => s + r.fb, 0))}
              </td>
              <td className="py-3 pl-3 text-right text-gold font-mono font-bold text-sm">
                +{formatNumber(growthTable.reduce((s, r) => s + r.total, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
});

FollowerForecast.displayName = 'FollowerForecast';
export default FollowerForecast;
