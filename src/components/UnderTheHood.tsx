import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import SectionHeader from './shared/SectionHeader';
import { ASSUMPTIONS, ASSUMPTION_CATEGORIES } from '../data/assumptions';
import { SEGMENTS } from '../data/audiences';
import { SEASONAL_FACTORS } from '../data/campaigns';
import type { Platform } from '../data/types';

const TABS = [
  'Data Sources',
  'Forecast Formula',
  'Assumptions Log',
  'Seasonal Model',
  'Audience Model',
];

const CONFIDENCE_COLORS = {
  high: '#4ade80',
  medium: '#fbbf24',
  low: '#ef4444',
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface UnderTheHoodProps {
  compact?: boolean;
}

const UnderTheHood: React.FC<UnderTheHoodProps> = React.memo(({ compact = false }) => {
  const [activeTab, setActiveTab] = useState(0);

  const seasonalChartData = useMemo(() =>
    MONTH_LABELS.map((label, i) => {
      const mm = String(i + 1).padStart(2, '0');
      const factor = SEASONAL_FACTORS[mm] ?? 1.0;
      return { label, factor };
    }),
    []
  );

  return (
    <section>
      {!compact && (
        <SectionHeader
          moduleNumber={6}
          title="Under the Hood"
          subtitle="Full methodology transparency. Every assumption documented with confidence level and source."
          id="module-6"
        />
      )}

      {/* Tab navigation */}
      <div className="flex gap-1 mb-6 border-b border-border pb-0">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2.5 text-xs font-mono transition-colors border-b-2 -mb-px ${
              activeTab === i
                ? 'border-gold text-gold'
                : 'border-transparent text-text-dim hover:text-text-secondary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 0: Data Sources */}
      {activeTab === 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-bg-secondary border border-border rounded-card p-6">
            <h4 className="text-gold text-xs font-mono uppercase tracking-widest mb-3">Client Data</h4>
            <ul className="space-y-3 text-xs text-text-secondary">
              <li className="p-3 bg-bg-tertiary rounded-inner">
                <p className="text-text-primary font-medium mb-1">Platform Analytics CSV</p>
                <p>Monthly export covering IG, X, TT, FB from Jun 2023 to Jan 2026</p>
              </li>
              <li className="p-3 bg-bg-tertiary rounded-inner">
                <p className="text-text-primary font-medium mb-1">Native Platform Access</p>
                <p>Direct API data from Instagram Insights, X Analytics, TikTok Creator Studio, Facebook Business Suite</p>
              </li>
              <li className="p-3 bg-bg-tertiary rounded-inner">
                <p className="text-text-primary font-medium mb-1">Event Calendar</p>
                <p>WBSTT 2026 event schedule from RFP Appendix</p>
              </li>
            </ul>
          </div>
          <div className="bg-bg-secondary border border-border rounded-card p-6">
            <h4 className="text-gold text-xs font-mono uppercase tracking-widest mb-3">Industry Benchmarks</h4>
            <ul className="space-y-3 text-xs text-text-secondary">
              <li className="p-3 bg-bg-tertiary rounded-inner">
                <p className="text-text-primary font-medium mb-1">Rival IQ 2025 Entertainment Report</p>
                <p>Engagement rate benchmarks for entertainment venue accounts</p>
              </li>
              <li className="p-3 bg-bg-tertiary rounded-inner">
                <p className="text-text-primary font-medium mb-1">JTB Tourism Statistics</p>
                <p>Japan inbound tourism data (42.4M projected visitors 2025)</p>
              </li>
              <li className="p-3 bg-bg-tertiary rounded-inner">
                <p className="text-text-primary font-medium mb-1">Social Insider Platform Reports</p>
                <p>Content volume to growth rate correlations by platform</p>
              </li>
            </ul>
          </div>
          <div className="bg-bg-secondary border border-border rounded-card p-6">
            <h4 className="text-gold text-xs font-mono uppercase tracking-widest mb-3">Ralph Methodology</h4>
            <ul className="space-y-3 text-xs text-text-secondary">
              <li className="p-3 bg-bg-tertiary rounded-inner">
                <p className="text-text-primary font-medium mb-1">Audience Segmentation Model</p>
                <p>Proprietary framework mapping audience segments to platform behaviour and conversion rates</p>
              </li>
              <li className="p-3 bg-bg-tertiary rounded-inner">
                <p className="text-text-primary font-medium mb-1">Content Volume Impact Model</p>
                <p>Regression analysis of post volume vs follower growth by platform</p>
              </li>
              <li className="p-3 bg-bg-tertiary rounded-inner">
                <p className="text-text-primary font-medium mb-1">Campaign Multiplier Framework</p>
                <p>Historical analysis of event-driven growth spikes mapped to multiplier assumptions</p>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 1: Forecast Formula */}
      {activeTab === 1 && (
        <div className="space-y-4">
          <div className="bg-bg-secondary border border-border rounded-card p-6">
            <h4 className="text-gold text-xs font-mono uppercase tracking-widest mb-4">Base Forecast (Organic Only)</h4>
            <div className="font-mono text-sm leading-loose">
              <p className="text-gold mb-3">baseGrowth[platform] =</p>
              <div className="pl-6 flex items-center gap-3 flex-wrap">
                <div className="p-3 bg-bg-tertiary rounded-inner">
                  <span className="text-text-primary">organicBase[platform]</span>
                  <p className="text-text-dim text-xs mt-1">Historical average monthly follower growth (2025 data)</p>
                </div>
                <span className="text-text-dim font-bold">x</span>
                <div className="p-3 bg-bg-tertiary rounded-inner">
                  <span className="text-text-primary">seasonalFactor[month]</span>
                  <p className="text-text-dim text-xs mt-1">Monthly adjustment: Golden Week 1.20x, Nov peak 1.25x, Jan dip 0.85x</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-bg-secondary border border-border rounded-card p-6">
            <h4 className="text-gold text-xs font-mono uppercase tracking-widest mb-4">With Strategy</h4>
            <div className="font-mono text-sm leading-loose">
              <p className="text-gold mb-3">withStrategy[platform] = max( baseGrowth, organicBase x strategyMult x seasonal )</p>
              <div className="pl-6 space-y-3">
                <p className="text-text-dim text-xs">Where <span className="text-text-primary">strategyMult</span> =</p>
                <div className="pl-4 flex items-center gap-3 flex-wrap">
                  <div className="p-3 bg-bg-tertiary rounded-inner">
                    <span className="text-text-primary">volumeMult</span>
                    <p className="text-text-dim text-xs mt-1">Each post above baseline adds a platform-specific % uplift. Floored at 0.5x.</p>
                  </div>
                  <span className="text-text-dim font-bold">x</span>
                  <div className="p-3 bg-bg-tertiary rounded-inner">
                    <span className="text-text-primary">audienceMult</span>
                    <p className="text-text-dim text-xs mt-1">Weighted average of segment conversion rates based on audience mix.</p>
                  </div>
                  <span className="text-text-dim font-bold">x</span>
                  <div className="p-3 bg-bg-tertiary rounded-inner">
                    <span className="text-text-primary">langMult</span>
                    <p className="text-text-dim text-xs mt-1">JP only: 1.0x, JP+EN: 1.05x, Quad-lingual: 1.12x</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-bg-secondary border border-border rounded-card p-6">
            <h4 className="text-gold text-xs font-mono uppercase tracking-widest mb-4">With Campaigns</h4>
            <div className="font-mono text-sm leading-loose">
              <p className="text-gold mb-3">withCampaigns[platform] = max( baseGrowth, organicBase x strategyMult x (seasonal + campLift) )</p>
              <div className="pl-6 space-y-3">
                <div className="p-3 bg-bg-tertiary rounded-inner">
                  <span className="text-text-primary">campLift[platform]</span>
                  <p className="text-text-dim text-xs mt-1">Highest active campaign multiplier minus 1 (the lift portion only). Platform-specific: campaigns only affect their listed platforms. No overlap stacking.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-bg-secondary border border-border rounded-card p-6">
            <h4 className="text-text-dim text-xs font-mono uppercase tracking-widest mb-3">Key Design Decisions</h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li className="flex gap-2">
                <span className="text-gold shrink-0">1.</span>
                <span>Campaigns are <strong className="text-text-primary">additive</strong> to seasonal factors, not multiplicative. This prevents double-counting peaks already reflected in seasonal data.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gold shrink-0">2.</span>
                <span>Strategy and campaign results are <strong className="text-text-primary">floored at baseGrowth</strong>. Strategy layers never underperform organic baseline.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gold shrink-0">3.</span>
                <span>Only the <strong className="text-text-primary">highest</strong> active campaign multiplier applies per platform. No overlap stacking or diminishing returns.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gold shrink-0">4.</span>
                <span>Audience multipliers can go <strong className="text-text-primary">below 1.0</strong> (e.g., core fans on TikTok = 0.6x), but the result-level floor ensures the forecast stays realistic.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 2: Assumptions Log */}
      {activeTab === 2 && (
        <div className="bg-bg-secondary border border-border rounded-card p-6 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-text-dim py-2 pr-4 font-mono font-medium">Category</th>
                <th className="text-left text-text-dim py-2 pr-4 font-mono font-medium">Variable</th>
                <th className="text-right text-text-dim py-2 pr-4 font-mono font-medium">Value</th>
                <th className="text-left text-text-dim py-2 pr-4 font-mono font-medium">Unit</th>
                <th className="text-center text-text-dim py-2 pr-4 font-mono font-medium">Confidence</th>
                <th className="text-left text-text-dim py-2 font-mono font-medium">Source</th>
              </tr>
            </thead>
            <tbody>
              {ASSUMPTIONS.map(a => (
                <tr key={a.id} className="border-b border-border/50 hover:bg-bg-tertiary/30">
                  <td className="py-2.5 pr-4 text-text-secondary">{a.category}</td>
                  <td className="py-2.5 pr-4 text-text-primary">{a.variable}</td>
                  <td className="py-2.5 pr-4 text-right text-text-primary font-mono">{a.value}</td>
                  <td className="py-2.5 pr-4 text-text-dim">{a.unit}</td>
                  <td className="py-2.5 pr-4 text-center">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-[10px] font-mono"
                      style={{
                        backgroundColor: `${CONFIDENCE_COLORS[a.confidence]}20`,
                        color: CONFIDENCE_COLORS[a.confidence],
                      }}
                    >
                      {a.confidence}
                    </span>
                  </td>
                  <td className="py-2.5 text-text-dim text-[11px]">{a.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Seasonal Model */}
      {activeTab === 3 && (
        <div className="bg-bg-secondary border border-border rounded-card p-6">
          <h4 className="text-text-primary text-sm font-medium mb-4">Monthly Seasonal Adjustment Factors</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={seasonalChartData} margin={{ top: 30, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" strokeOpacity={0.5} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#a0a0b8' }} axisLine={{ stroke: '#2a2a4a' }} />
              <YAxis domain={[0.7, 1.4]} tick={{ fontSize: 11, fill: '#a0a0b8' }} axisLine={{ stroke: '#2a2a4a' }} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#141428', border: '1px solid #2a2a4a', borderRadius: 8, fontSize: 12 }}
                formatter={(value: number) => [`${value.toFixed(2)}x`, 'Factor']}
              />
              <Bar dataKey="factor" animationDuration={800}>
                {seasonalChartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.factor >= 1.15 ? '#d4a843' : entry.factor >= 1.0 ? '#8a7030' : '#5a5a72'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-bg-tertiary rounded-inner">
            <p className="text-text-secondary text-xs leading-relaxed">
              Seasonal factors are derived from 2024-2025 historical patterns. Peak months (May for Golden Week, November for winter seasonals) show 20-25% uplift. January and February show 10-15% dip post-holiday.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Audience Model */}
      {activeTab === 4 && (
        <div className="space-y-4">
          {(['core', 'light', 'tourist'] as const).map(seg => {
            const s = SEGMENTS[seg];
            return (
              <div key={seg} className="bg-bg-secondary border border-border rounded-card p-6">
                <h4 className="text-text-primary text-sm font-medium mb-3">{s.label}</h4>
                <p className="text-text-secondary text-xs mb-4">{s.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-text-dim text-[10px] font-mono uppercase tracking-wider mb-2">Follow Conversion Multiplier by Platform</p>
                    <div className="space-y-1.5">
                      {(Object.entries(s.followConversionMultiplier) as [Platform, number][]).map(([p, v]) => (
                        <div key={p} className="flex items-center gap-2">
                          <span className="text-text-dim text-xs w-8 uppercase">{p}</span>
                          <div className="flex-1 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                            <div className="h-full bg-gold rounded-full" style={{ width: `${(v / 1.5) * 100}%` }} />
                          </div>
                          <span className="text-text-secondary text-xs font-mono w-10 text-right">{v.toFixed(1)}x</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-text-dim text-[10px] font-mono uppercase tracking-wider mb-2">Engagement Rate Multiplier by Platform</p>
                    <div className="space-y-1.5">
                      {(Object.entries(s.engagementRateMultiplier) as [Platform, number][]).map(([p, v]) => (
                        <div key={p} className="flex items-center gap-2">
                          <span className="text-text-dim text-xs w-8 uppercase">{p}</span>
                          <div className="flex-1 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                            <div className="h-full bg-success rounded-full" style={{ width: `${(v / 1.5) * 100}%` }} />
                          </div>
                          <span className="text-text-secondary text-xs font-mono w-10 text-right">{v.toFixed(1)}x</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
});

UnderTheHood.displayName = 'UnderTheHood';
export default UnderTheHood;
