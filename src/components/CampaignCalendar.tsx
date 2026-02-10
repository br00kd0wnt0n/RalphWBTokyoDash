import React, { useMemo } from 'react';
import SectionHeader from './shared/SectionHeader';
import ToggleSwitch from './shared/ToggleSwitch';
import SliderControl from './shared/SliderControl';
import PlatformBadge from './shared/PlatformBadge';
import type { Campaign, Platform } from '../data/types';
import { SEASONAL_FACTORS } from '../data/campaigns';

interface CampaignCalendarProps {
  campaigns: Campaign[];
  onToggle: (id: string) => void;
  onMultiplierChange: (id: string, multiplier: number) => void;
  embedded?: boolean;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const IMPACT_COLORS = {
  major: '#d4a843',
  moderate: '#fbbf24',
  minor: '#5a5a72',
};

const CampaignCalendar: React.FC<CampaignCalendarProps> = React.memo(({
  campaigns,
  onToggle,
  onMultiplierChange,
  embedded,
}) => {
  // Calculate Gantt positions
  const ganttData = useMemo(() => {
    return campaigns.map(c => {
      const startMonth = parseInt(c.startDate.slice(5, 7), 10);
      const startDay = parseInt(c.startDate.slice(8, 10), 10);
      const endMonth = parseInt(c.endDate.slice(5, 7), 10);
      const endDay = parseInt(c.endDate.slice(8, 10), 10);

      // Clamp to 2026
      const start = Math.max(0, (startMonth - 1) + (startDay - 1) / 30);
      const end = Math.min(12, (endMonth > 12 || c.endDate.startsWith('2027')) ? 12 : (endMonth - 1) + endDay / 30);

      return {
        ...c,
        startPct: (start / 12) * 100,
        widthPct: ((end - start) / 12) * 100,
      };
    });
  }, [campaigns]);

  const seasonalData = useMemo(() =>
    MONTHS.map((label, i) => {
      const mm = String(i + 1).padStart(2, '0');
      return { label, factor: SEASONAL_FACTORS[mm] ?? 1.0 };
    }),
    []
  );

  const content = (
    <>
      {/* Seasonal overlay */}
      <div className="bg-bg-secondary border border-border rounded-card p-6 mb-6">
        <h3 className="text-text-primary text-sm font-medium mb-4">Seasonal Adjustment Factors</h3>
        <div className="flex items-end gap-1 h-24">
          {seasonalData.map(d => {
            const height = ((d.factor - 0.7) / 0.6) * 100;
            return (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-text-dim font-mono">{d.factor.toFixed(2)}x</span>
                <div
                  className="w-full rounded-sm transition-all"
                  style={{
                    height: `${Math.max(8, height)}%`,
                    backgroundColor: d.factor >= 1.15 ? '#d4a843' : d.factor >= 1.0 ? '#8a7030' : '#2a2a4a',
                  }}
                />
                <span className="text-[10px] text-text-dim">{d.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gantt timeline */}
      <div className="bg-bg-secondary border border-border rounded-card p-6 mb-6">
        <h3 className="text-text-primary text-sm font-medium mb-4">Campaign Timeline</h3>
        <div className="mb-2 flex border-b border-border pb-2">
          {MONTHS.map(m => (
            <div key={m} className="flex-1 text-center text-[10px] text-text-dim">{m}</div>
          ))}
        </div>
        <div className="space-y-2">
          {ganttData.map(c => (
            <div key={c.id} className="relative h-7 group">
              <div
                className={`absolute h-full rounded-sm transition-opacity ${c.enabled ? 'opacity-100' : 'opacity-30'}`}
                style={{
                  left: `${c.startPct}%`,
                  width: `${Math.max(2, c.widthPct)}%`,
                  backgroundColor: IMPACT_COLORS[c.impact],
                }}
              >
                <span className="absolute inset-0 flex items-center px-2 text-[10px] text-bg-primary font-medium truncate">
                  {c.name}
                </span>
              </div>
              <div className="absolute right-0 top-0 h-full flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-text-dim px-2">{c.defaultMultiplier.toFixed(1)}x</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4">
          {Object.entries(IMPACT_COLORS).map(([key, color]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
              <span className="text-text-dim text-[10px] capitalize">{key}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {campaigns.map(c => (
          <div
            key={c.id}
            className={`bg-bg-secondary border rounded-card p-5 transition-all ${
              c.enabled ? 'border-border' : 'border-border opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-text-primary text-sm font-medium">{c.name}</h4>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                    style={{ backgroundColor: `${IMPACT_COLORS[c.impact]}20`, color: IMPACT_COLORS[c.impact] }}
                  >
                    {c.impact}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-bg-tertiary text-text-dim rounded font-mono">
                    {c.type}
                  </span>
                </div>
                <p className="text-text-dim text-xs">{c.startDate} to {c.endDate}</p>
              </div>
              <ToggleSwitch label="" enabled={c.enabled} onChange={() => onToggle(c.id)} />
            </div>
            <p className="text-text-secondary text-xs mb-3 leading-relaxed">{c.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {c.platforms.map(p => (
                  <PlatformBadge key={p} platform={p as Platform} size="sm" />
                ))}
              </div>
              <div className="w-32">
                <SliderControl
                  label="Multiplier"
                  value={c.defaultMultiplier}
                  min={1}
                  max={2}
                  step={0.05}
                  onChange={(v) => onMultiplierChange(c.id, v)}
                  formatValue={(v) => `${v.toFixed(2)}x`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  if (embedded) return content;

  return (
    <section>
      <SectionHeader
        moduleNumber={6}
        title="Campaign Calendar"
        subtitle="2026 events and campaigns that drive forecast multipliers. Toggle campaigns on/off to see their impact."
        id="module-6"
      />
      {content}
    </section>
  );
});

CampaignCalendar.displayName = 'CampaignCalendar';
export default CampaignCalendar;
