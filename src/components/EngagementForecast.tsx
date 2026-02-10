import React, { useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
} from 'recharts';
import SectionHeader from './shared/SectionHeader';
import MetricCard from './shared/MetricCard';
import type { ForecastMonth } from '../data/types';
import { PLATFORM_COLORS } from '../data/types';
import { formatNumber, formatCompact } from '../utils/formatters';
import { getEngagements, getMonthsForYear, PLATFORMS } from '../utils/calculations';

interface EngagementForecastProps {
  forecast: ForecastMonth[];
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const EngagementForecast: React.FC<EngagementForecastProps> = React.memo(({ forecast }) => {
  const yoyData = useMemo(() => {
    const months2024 = getMonthsForYear('2024');
    const months2025 = getMonthsForYear('2025');

    return MONTH_LABELS.map((label, i) => {
      const mm = String(i + 1).padStart(2, '0');
      const m2024 = months2024.find(m => m.endsWith(`-${mm}`));
      const m2025 = months2025.find(m => m.endsWith(`-${mm}`));

      let eng2024 = 0;
      let eng2025 = 0;
      if (m2024) PLATFORMS.forEach(p => { eng2024 += getEngagements(m2024, p); });
      if (m2025) PLATFORMS.forEach(p => { eng2025 += getEngagements(m2025, p); });

      // Derive 2026 projection from forecast strategy multiplier
      const forecastMonth = forecast[i];
      const strategyLift = forecastMonth && forecastMonth.totalBase > 0
        ? forecastMonth.totalCampaigns / forecastMonth.totalBase
        : 1.0;
      const eng2026 = Math.round(eng2025 * strategyLift);

      return { label, eng2024, eng2025, eng2026 };
    });
  }, [forecast]);

  const platformEngData = useMemo(() => {
    const months2025 = getMonthsForYear('2025');
    return PLATFORMS.map(p => {
      let totalEng = 0;
      months2025.forEach(m => {
        totalEng += getEngagements(m, p);
      });
      const avgMonthly = totalEng / months2025.length;
      return { platform: p.toUpperCase(), avgEngagement: Math.round(avgMonthly), color: PLATFORM_COLORS[p] };
    });
  }, []);

  const total2024 = yoyData.reduce((s, d) => s + d.eng2024, 0);
  const total2025 = yoyData.reduce((s, d) => s + d.eng2025, 0);
  const yoyChange = total2025 > 0 && total2024 > 0
    ? ((total2025 - total2024) / total2024 * 100).toFixed(1)
    : '0';

  const projected2026Total = yoyData.reduce((s, d) => s + d.eng2026, 0);
  const projected2026YoY = total2025 > 0
    ? ((projected2026Total - total2025) / total2025 * 100).toFixed(1)
    : '0';
  const targetReached = Number(projected2026YoY) >= 10;

  return (
    <section>
      <SectionHeader
        moduleNumber={4}
        title="Engagement Forecast"
        subtitle="Tracking the +10% YoY engagement KPI. Balancing reach expansion with engagement depth."
        id="module-4"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="2024 Total Engagements"
          value={formatCompact(total2024)}
        />
        <MetricCard
          label="2025 Total Engagements"
          value={formatCompact(total2025)}
          trend={total2025 > total2024 ? 'up' : 'down'}
          trendLabel={`${yoyChange}% YoY`}
        />
        <MetricCard
          label="2026 Projected"
          value={formatCompact(projected2026Total)}
          trend={Number(projected2026YoY) > 0 ? 'up' : 'down'}
          trendLabel={`${projected2026YoY}% vs 2025`}
        />
        <MetricCard
          label="YoY Target: +10%"
          value={targetReached ? 'On Track' : 'Watch'}
          accentColor={targetReached ? '#4ade80' : '#fbbf24'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-bg-secondary border border-border rounded-card p-6">
          <h3 className="text-text-primary text-sm font-medium mb-4">Year-over-Year Engagement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yoyData} margin={{ top: 30, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" strokeOpacity={0.5} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#a0a0b8' }} axisLine={{ stroke: '#2a2a4a' }} />
              <YAxis tickFormatter={(v: number) => formatCompact(v)} tick={{ fontSize: 11, fill: '#a0a0b8' }} axisLine={{ stroke: '#2a2a4a' }} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#141428', border: '1px solid #2a2a4a', borderRadius: 8, fontSize: 12 }}
                formatter={(value: number, name: string) => [formatNumber(value), name]}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="eng2024" name="2024" stroke="#5a5a72" strokeWidth={1.5} dot={false} animationDuration={800} />
              <Line type="monotone" dataKey="eng2025" name="2025" stroke="#d4a843" strokeWidth={2} dot={false} animationDuration={800} />
              <Line type="monotone" dataKey="eng2026" name="2026 (Proj)" stroke="#4ade80" strokeWidth={2} strokeDasharray="6 3" dot={false} animationDuration={800} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-bg-secondary border border-border rounded-card p-6">
          <h3 className="text-text-primary text-sm font-medium mb-4">Average Monthly Engagement by Platform</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformEngData} margin={{ top: 30, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" strokeOpacity={0.5} />
              <XAxis dataKey="platform" tick={{ fontSize: 11, fill: '#a0a0b8' }} axisLine={{ stroke: '#2a2a4a' }} />
              <YAxis tickFormatter={(v: number) => formatCompact(v)} tick={{ fontSize: 11, fill: '#a0a0b8' }} axisLine={{ stroke: '#2a2a4a' }} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#141428', border: '1px solid #2a2a4a', borderRadius: 8, fontSize: 12 }}
                formatter={(value: number) => [formatNumber(value), 'Avg Monthly']}
              />
              <Bar dataKey="avgEngagement" animationDuration={800}>
                {platformEngData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-bg-secondary border border-border rounded-card p-6">
        <h3 className="text-text-primary text-sm font-medium mb-3">Strategic Tension: Reach vs. Engagement Depth</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-4 bg-bg-tertiary rounded-inner">
            <p className="text-success text-xs font-mono uppercase tracking-wider mb-2">Expanding Reach</p>
            <p className="text-text-primary text-sm font-medium mb-1">Total engagement volume increases</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              Shifting toward casual fans and tourists grows total impressions and engagement volume. More people see and interact with content, even if individual post performance varies.
            </p>
          </div>
          <div className="p-4 bg-bg-tertiary rounded-inner">
            <p className="text-warning text-xs font-mono uppercase tracking-wider mb-2">Depth Tradeoff</p>
            <p className="text-text-primary text-sm font-medium mb-1">Per-post engagement rate may dip</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              Casual audiences engage at lower per-post rates than core fans. The strategy prioritizes total engagement growth over rate maintenance, which is the more meaningful business metric for WBSTT.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

EngagementForecast.displayName = 'EngagementForecast';
export default EngagementForecast;
