import React from 'react';
import SectionHeader from './shared/SectionHeader';
import SliderControl from './shared/SliderControl';
import PlatformBadge from './shared/PlatformBadge';
import type { Platform, PlatformConfig, LanguageSplit } from '../data/types';
import { PLATFORM_COLORS } from '../data/types';
import { KPI_TARGETS } from '../data/historicalData';

interface PlatformMatrixProps {
  platformConfigs: Record<Platform, PlatformConfig>;
  totalPosts: number;
  languageSplit: LanguageSplit;
  onPlatformUpdate: (platform: Platform, updates: Partial<PlatformConfig>) => void;
  onLanguageChange: (split: LanguageSplit) => void;
  embedded?: boolean;
}

const LANGUAGE_OPTIONS: { value: LanguageSplit; label: string; desc: string }[] = [
  { value: 'jp_only', label: 'JP', desc: 'Japanese only' },
  { value: 'jp_en', label: 'JP + EN', desc: 'Japanese and English' },
  { value: 'jp_en_zh_ko', label: 'JP + EN + ZH + KO', desc: 'Multilingual (tourist reach)' },
];

const PLATFORMS: Platform[] = ['ig', 'tt', 'x', 'fb', 'yt'];

const CONTENT_TYPES = ['video', 'static', 'stories', 'ugc'] as const;
const CONTENT_COLORS = {
  video: '#E1306C',
  static: '#1877F2',
  stories: '#fbbf24',
  ugc: '#4ade80',
};

const PlatformMatrix: React.FC<PlatformMatrixProps> = React.memo(({
  platformConfigs,
  totalPosts,
  languageSplit,
  onPlatformUpdate,
  onLanguageChange,
  embedded,
}) => {
  const target = KPI_TARGETS.postsPerMonth;
  const isOverTarget = totalPosts > target;

  const content = (
    <>
      {/* Controls row: Total posts + Language split */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="bg-bg-secondary border border-border rounded-card px-6 py-4 inline-flex items-center gap-4">
          <div>
            <p className="text-text-dim text-xs uppercase tracking-wider">Total Posts/Month</p>
            <p className={`text-2xl font-mono font-semibold ${isOverTarget ? 'text-warning' : 'text-success'}`}>
              {totalPosts}
            </p>
          </div>
          <div className="text-text-dim text-sm">/</div>
          <div>
            <p className="text-text-dim text-xs uppercase tracking-wider">KPI Target</p>
            <p className="text-2xl font-mono font-semibold text-text-primary">{target}</p>
          </div>
        </div>

        <div className="bg-bg-secondary border border-border rounded-card px-6 py-4">
          <p className="text-text-dim text-xs uppercase tracking-wider mb-2">Language Strategy</p>
          <div className="flex items-center gap-1">
            {LANGUAGE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => onLanguageChange(opt.value)}
                className={`px-3 py-1.5 text-[11px] rounded-inner transition-colors ${
                  languageSplit === opt.value
                    ? 'bg-gold text-bg-primary font-medium'
                    : 'bg-bg-tertiary text-text-dim hover:text-text-secondary'
                }`}
                title={opt.desc}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Platform rows */}
      <div className="space-y-3">
        {PLATFORMS.map(p => {
          const config = platformConfigs[p];
          return (
            <div
              key={p}
              className="bg-bg-secondary border border-border rounded-card p-5"
              style={{ borderLeftWidth: 3, borderLeftColor: PLATFORM_COLORS[p] }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                <div className="lg:col-span-2 flex items-center gap-2">
                  <PlatformBadge platform={p} showLabel size="md" />
                </div>

                <div className="lg:col-span-4">
                  <SliderControl
                    label="Posts/Month"
                    value={config.postsPerMonth}
                    min={0}
                    max={30}
                    onChange={(v) => onPlatformUpdate(p, { postsPerMonth: v })}
                  />
                </div>

                <div className="lg:col-span-4">
                  <p className="text-text-dim text-[10px] uppercase tracking-wider mb-2">Content Mix</p>
                  <div className="flex h-4 rounded-sm overflow-hidden">
                    {CONTENT_TYPES.map(ct => {
                      const pct = config.contentMix[ct];
                      if (pct === 0) return null;
                      return (
                        <div
                          key={ct}
                          className="relative group"
                          style={{ width: `${pct}%`, backgroundColor: CONTENT_COLORS[ct] }}
                        >
                          <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-bg-tertiary border border-border rounded text-[10px] text-text-secondary whitespace-nowrap opacity-0 group-hover:opacity-100 z-10">
                            {ct}: {pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-3 mt-1.5">
                    {CONTENT_TYPES.map(ct => (
                      <div key={ct} className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: CONTENT_COLORS[ct] }} />
                        <span className="text-[10px] text-text-dim">{ct}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2 text-right">
                  <span className="text-text-dim text-[10px] uppercase tracking-wider block mb-1">Audience</span>
                  <span className="text-xs text-text-secondary capitalize">{config.primaryAudience}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  if (embedded) return content;

  return (
    <section>
      <SectionHeader
        moduleNumber={3}
        title="Platform Strategy Matrix"
        subtitle="Allocate content volume and type across platforms. Driven by audience composition."
        id="module-3"
      />
      {content}
    </section>
  );
});

PlatformMatrix.displayName = 'PlatformMatrix';
export default PlatformMatrix;
