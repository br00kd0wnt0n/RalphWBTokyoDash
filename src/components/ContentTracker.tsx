import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';
import SectionHeader from './shared/SectionHeader';
import MetricCard from './shared/MetricCard';
import { HISTORICAL_DATA } from '../data/historicalData';
import { PLATFORM_COLORS, type Platform } from '../data/types';
import { formatNumber, formatMonthShort } from '../utils/formatters';
import { getPosts, getCompleteMonths, PLATFORMS } from '../utils/calculations';

const ContentTracker: React.FC = React.memo(() => {
  const postData = useMemo(() => {
    // Use 2025 data
    const months2025 = getCompleteMonths().filter(m => m.startsWith('2025'));
    return months2025.map(month => {
      const row: Record<string, unknown> = { month, label: formatMonthShort(month) };
      let total = 0;
      PLATFORMS.forEach(p => {
        const posts = getPosts(month, p);
        row[p] = posts;
        total += posts;
      });
      row.total = total;
      return row;
    });
  }, []);

  const avgPosts = useMemo(() => {
    if (postData.length === 0) return 0;
    return Math.round(postData.reduce((s, d) => s + (d.total as number), 0) / postData.length);
  }, [postData]);

  // Content type estimates (based on typical mix from the data)
  const contentBreakdown = useMemo(() => {
    return PLATFORMS.map(p => {
      const months2025 = getCompleteMonths().filter(m => m.startsWith('2025'));
      const avgMonthly = months2025.reduce((s, m) => s + getPosts(m, p), 0) / months2025.length;
      return { platform: p.toUpperCase(), posts: Math.round(avgMonthly), color: PLATFORM_COLORS[p] };
    });
  }, []);

  return (
    <section>
      <SectionHeader
        moduleNumber={5}
        title="Content Volume Tracker"
        subtitle="Tracking content output against the 50 posts/month KPI target."
        id="module-5"
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <MetricCard
          label="Current Avg Posts/Month"
          value={formatNumber(avgPosts)}
          subValue="Across all platforms (2025)"
        />
        <MetricCard
          label="KPI Target"
          value="50"
          subValue="Strategic posts/month"
        />
        <MetricCard
          label="Reframing"
          value="Quality"
          subValue={`${avgPosts} posts/mo → 50 focused, strategic posts`}
        />
      </div>

      {/* Monthly stacked bar chart */}
      <div className="bg-bg-secondary border border-border rounded-card p-6 mb-6">
        <h3 className="text-text-primary text-sm font-medium mb-4">Monthly Posts by Platform (2025)</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={postData} margin={{ top: 30, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" strokeOpacity={0.5} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#a0a0b8' }} axisLine={{ stroke: '#2a2a4a' }} />
            <YAxis tick={{ fontSize: 11, fill: '#a0a0b8' }} axisLine={{ stroke: '#2a2a4a' }} />
            <RechartsTooltip
              contentStyle={{ backgroundColor: '#141428', border: '1px solid #2a2a4a', borderRadius: 8, fontSize: 12 }}
              formatter={(value: number, name: string) => [value, name.toUpperCase()]}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={50} stroke="#d4a843" strokeDasharray="6 3" label={{ value: 'Target: 50', position: 'right', fontSize: 10, fill: '#d4a843' }} />
            {PLATFORMS.map(p => (
              <Bar key={p} dataKey={p} stackId="posts" fill={PLATFORM_COLORS[p]} animationDuration={800} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Platform breakdown */}
      <div className="bg-bg-secondary border border-border rounded-card p-6">
        <h3 className="text-text-primary text-sm font-medium mb-4">Average Monthly Posts by Platform</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {contentBreakdown.map(d => (
            <div key={d.platform} className="text-center">
              <p className="text-2xl font-mono font-semibold" style={{ color: d.color }}>{d.posts}</p>
              <p className="text-text-secondary text-xs mt-1">{d.platform}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-bg-tertiary rounded-inner">
          <p className="text-gold text-xs font-mono uppercase tracking-widest mb-2">Strategic Note</p>
          <p className="text-text-secondary text-xs leading-relaxed">
            WBSTT currently publishes ~{avgPosts} posts/month across all platforms. The 50 posts/month KPI is not a volume reduction target. It is a reframing: shifting from quantity-driven posting to strategic, audience-specific content allocation where every post serves a measurable purpose.
          </p>
        </div>
      </div>
    </section>
  );
});

ContentTracker.displayName = 'ContentTracker';
export default ContentTracker;
