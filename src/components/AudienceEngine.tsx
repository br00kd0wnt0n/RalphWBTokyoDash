import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import SectionHeader from './shared/SectionHeader';
import SliderControl from './shared/SliderControl';
import PlatformBadge from './shared/PlatformBadge';
import type { AudiencePreset, AudienceComposition, Platform } from '../data/types';
import { AUDIENCE_PRESETS, SEGMENTS } from '../data/audiences';

interface AudienceEngineProps {
  preset: AudiencePreset;
  composition: AudienceComposition;
  onPresetChange: (preset: AudiencePreset) => void;
  onSliderChange: (segment: keyof AudienceComposition, value: number) => void;
  embedded?: boolean;
}

const SEGMENT_COLORS = {
  core: '#d4a843',
  light: '#4ade80',
  tourist: '#00F2EA',
};

const AudienceEngine: React.FC<AudienceEngineProps> = React.memo(({
  preset,
  composition,
  onPresetChange,
  onSliderChange,
  embedded,
}) => {
  const donutData = useMemo(() => [
    { name: 'Core Fans', value: composition.core, color: SEGMENT_COLORS.core },
    { name: 'Light Fans', value: composition.light, color: SEGMENT_COLORS.light },
    { name: 'Tourists', value: composition.tourist, color: SEGMENT_COLORS.tourist },
  ], [composition]);

  const content = (
    <>
      {/* Preset selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {AUDIENCE_PRESETS.map(p => (
          <button
            key={p.id}
            onClick={() => onPresetChange(p.id)}
            className={`text-left p-4 rounded-card border transition-all duration-200 ${
              preset === p.id
                ? 'border-gold bg-bg-tertiary'
                : 'border-border bg-bg-secondary hover:border-gold-dim'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-sm font-medium ${preset === p.id ? 'text-gold' : 'text-text-primary'}`}>
                {p.label}
              </span>
              {p.recommended && (
                <span className="text-[10px] px-1.5 py-0.5 bg-gold/20 text-gold rounded font-mono">
                  REC
                </span>
              )}
            </div>
            <p className="text-text-dim text-xs leading-relaxed">{p.description}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders + Donut */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-bg-secondary border border-border rounded-card p-6">
            <h3 className="text-text-primary text-sm font-medium mb-5">Audience Mix</h3>
            <div className="space-y-5">
              {(['core', 'light', 'tourist'] as const).map(seg => (
                <SliderControl
                  key={seg}
                  label={SEGMENTS[seg].label}
                  value={composition[seg]}
                  min={0}
                  max={100}
                  onChange={(v) => onSliderChange(seg, v)}
                  formatValue={(v) => `${v}%`}
                />
              ))}
            </div>
          </div>
          <div className="bg-bg-secondary border border-border rounded-card p-6 flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  animationDuration={300}
                >
                  {donutData.map(d => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              {donutData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-text-secondary text-xs">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Segment detail cards */}
        <div className="lg:col-span-2 space-y-4">
          {(['core', 'light', 'tourist'] as const).map(seg => {
            const s = SEGMENTS[seg];
            return (
              <div
                key={seg}
                className="bg-bg-secondary border border-border rounded-card p-5"
                style={{ borderLeftWidth: 3, borderLeftColor: SEGMENT_COLORS[seg] }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-text-primary font-medium text-sm">{s.label}</h4>
                    <p className="text-text-dim text-xs mt-0.5">{s.ageRange} | {s.estimatedPool}</p>
                  </div>
                  <span
                    className="text-lg font-mono font-semibold"
                    style={{ color: SEGMENT_COLORS[seg] }}
                  >
                    {composition[seg]}%
                  </span>
                </div>
                <p className="text-text-secondary text-xs mb-3 leading-relaxed">{s.description}</p>
                <div className="flex flex-wrap gap-3 mb-3">
                  <div>
                    <p className="text-text-dim text-[10px] uppercase tracking-wider mb-1">Platform Affinity</p>
                    <div className="flex gap-2">
                      {s.platformAffinity.map(p => (
                        <PlatformBadge key={p} platform={p as Platform} size="sm" />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-text-dim text-[10px] uppercase tracking-wider mb-1">Content Style</p>
                    <div className="flex flex-wrap gap-1">
                      {s.contentStyle.slice(0, 3).map(style => (
                        <span key={style} className="text-[10px] px-2 py-0.5 bg-bg-tertiary text-text-secondary rounded">
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );

  if (embedded) return content;

  return (
    <section>
      <SectionHeader
        moduleNumber={2}
        title="Audience Composition Engine"
        subtitle="Define the target audience mix. This drives platform allocation and forecast projections."
        id="module-2"
      />
      {content}
    </section>
  );
});

AudienceEngine.displayName = 'AudienceEngine';
export default AudienceEngine;
