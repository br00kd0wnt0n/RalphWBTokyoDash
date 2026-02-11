import React, { useMemo } from 'react';
import { TrendingUp, ArrowRight, DollarSign } from 'lucide-react';
import type { ForecastMonth, Platform, PlatformConfig, AudienceComposition, LanguageSplit, Campaign } from '../../data/types';
import { KPI_TARGETS, AVG_MONTHLY_POSTS_2025 } from '../../data/historicalData';
import { formatNumber, formatGrowth, formatCompact } from '../../utils/formatters';
import { generateForecast, getTotalProjectedGrowth } from '../../utils/forecastEngine';
import { COST_PER_FOLLOWER } from './PitchImpact';

interface GapAnalysisProps {
  forecast: ForecastMonth[];
  totalPostsPerMonth: number;
  platformConfigs: Record<Platform, PlatformConfig>;
  audienceComposition: AudienceComposition;
  languageSplit: LanguageSplit;
  campaigns: Campaign[];
  paidBudget: number;
  onPaidBudgetChange: (budget: number) => void;
}

type Confidence = 'high' | 'medium' | 'low';

interface Recommendation {
  lever: string;
  detail: string;
  additionalFollowers: number;
  newTotal: number;
  confidence: Confidence;
}

const CONFIDENCE_COLORS: Record<Confidence, string> = {
  high: '#4ade80',
  medium: '#fbbf24',
  low: '#ef4444',
};

const CONFIDENCE_LABELS: Record<Confidence, string> = {
  high: 'High confidence',
  medium: 'Medium confidence',
  low: 'Low confidence',
};

function cloneConfigs(configs: Record<Platform, PlatformConfig>): Record<Platform, PlatformConfig> {
  const out = {} as Record<Platform, PlatformConfig>;
  for (const p of Object.keys(configs) as Platform[]) {
    out[p] = { ...configs[p], contentMix: { ...configs[p].contentMix } };
  }
  return out;
}

const BUDGET_STEPS = [0, 500, 1000, 1500, 2000, 3000, 4000, 5000, 7500, 10000];

const GapAnalysis: React.FC<GapAnalysisProps> = React.memo(({
  forecast,
  totalPostsPerMonth,
  platformConfigs,
  audienceComposition,
  languageSplit,
  campaigns,
  paidBudget,
  onPaidBudgetChange,
}) => {
  const organicGrowth = useMemo(
    () => getTotalProjectedGrowth(forecast),
    [forecast]
  );

  const paidFollowersPerMonth = Math.round(paidBudget / COST_PER_FOLLOWER);
  const paidFollowersTotal = paidFollowersPerMonth * 12;
  const currentGrowth = organicGrowth + paidFollowersTotal;

  const followerGap = KPI_TARGETS.followerGrowth - currentGrowth;
  const hasFollowerGap = followerGap > 0;

  const recommendations = useMemo(() => {
    const recs: Recommendation[] = [];

    // Helper: run a modified forecast and return the organic delta
    function simulate(
      modComposition: AudienceComposition,
      modConfigs: Record<Platform, PlatformConfig>,
      modCampaigns: Campaign[],
      modLang: LanguageSplit,
    ): number {
      const modForecast = generateForecast(modComposition, modConfigs, modCampaigns, modLang);
      return getTotalProjectedGrowth(modForecast) - organicGrowth;
    }

    // 1. TikTok volume opportunity
    const ttPosts = platformConfigs.tt?.postsPerMonth ?? 0;
    if (ttPosts < 15) {
      const modConfigs = cloneConfigs(platformConfigs);
      modConfigs.tt = { ...modConfigs.tt, postsPerMonth: 15 };
      const delta = simulate(audienceComposition, modConfigs, campaigns, languageSplit);
      if (delta > 0) {
        recs.push({
          lever: 'Increase TikTok to 15 posts/mo',
          detail: `TikTok has the highest per-post growth uplift (6%) but is at just ${ttPosts} posts/mo. Increasing to 15 leverages algorithmic discovery on the platform with the most untapped potential.`,
          additionalFollowers: delta,
          newTotal: currentGrowth + delta,
          confidence: 'medium',
        });
      }
    }

    // 2. Language expansion
    if (languageSplit === 'jp_only') {
      const delta = simulate(audienceComposition, platformConfigs, campaigns, 'jp_en');
      if (delta > 0) {
        recs.push({
          lever: 'Enable bilingual content (JP+EN)',
          detail: 'Japanese-only content misses the inbound tourist audience (42.4M visitors projected). Bilingual content applies a 1.05x growth multiplier across all platforms.',
          additionalFollowers: delta,
          newTotal: currentGrowth + delta,
          confidence: 'low',
        });
      }
    } else if (languageSplit === 'jp_en') {
      const delta = simulate(audienceComposition, platformConfigs, campaigns, 'jp_en_zh_ko');
      if (delta > 0) {
        recs.push({
          lever: 'Expand to quad-lingual (JP+EN+ZH+KO)',
          detail: 'Adding Chinese and Korean unlocks key inbound markets. Increases the language multiplier from 1.05x to 1.12x across all platform growth.',
          additionalFollowers: delta,
          newTotal: currentGrowth + delta,
          confidence: 'low',
        });
      }
    }

    // 3. Disabled campaigns
    const disabledCampaigns = campaigns.filter(c => !c.enabled);
    if (disabledCampaigns.length > 0) {
      // Enable all disabled campaigns
      const modCampaigns = campaigns.map(c => c.enabled ? c : { ...c, enabled: true });
      const delta = simulate(audienceComposition, platformConfigs, modCampaigns, languageSplit);
      if (delta > 0) {
        const names = disabledCampaigns.slice(0, 2).map(c => c.name).join(', ');
        const suffix = disabledCampaigns.length > 2 ? ` +${disabledCampaigns.length - 2} more` : '';
        recs.push({
          lever: `Activate disabled campaigns`,
          detail: `${disabledCampaigns.length} campaign${disabledCampaigns.length > 1 ? 's' : ''} currently disabled: ${names}${suffix}. Campaign multipliers drive concentrated growth during peak cultural moments.`,
          additionalFollowers: delta,
          newTotal: currentGrowth + delta,
          confidence: 'medium',
        });
      }
    }

    // 4. Instagram volume headroom
    const igPosts = platformConfigs.ig?.postsPerMonth ?? 0;
    if (igPosts < 25) {
      const modConfigs = cloneConfigs(platformConfigs);
      modConfigs.ig = { ...modConfigs.ig, postsPerMonth: 25 };
      const delta = simulate(audienceComposition, modConfigs, campaigns, languageSplit);
      if (delta > 0) {
        recs.push({
          lever: 'Increase Instagram to 25 posts/mo',
          detail: `Instagram is the primary growth engine (${formatGrowth(2800)}/mo organic) but set to ${igPosts} posts/mo vs. a historical average of ${AVG_MONTHLY_POSTS_2025.ig}. Each additional post adds 2.5% follower uplift.`,
          additionalFollowers: delta,
          newTotal: currentGrowth + delta,
          confidence: 'medium',
        });
      }
    }

    // 5. Audience heavily skewed to core
    if (audienceComposition.core > 50) {
      const modComp: AudienceComposition = { core: 30, light: 50, tourist: 20 };
      const delta = simulate(modComp, platformConfigs, campaigns, languageSplit);
      if (delta > 0) {
        recs.push({
          lever: 'Shift to Casual Expansion mix',
          detail: `Core fans are at ${audienceComposition.core}%. The Casual Expansion preset (30/50/20) unlocks light fan conversion on TikTok (1.4x) and Instagram (1.1x), where the largest growth pools exist.`,
          additionalFollowers: delta,
          newTotal: currentGrowth + delta,
          confidence: 'low',
        });
      }
    }

    // 6. Low tourist share
    if (audienceComposition.tourist < 15 && audienceComposition.core <= 50) {
      const shift = 15 - audienceComposition.tourist;
      const modComp: AudienceComposition = {
        core: Math.max(0, audienceComposition.core - Math.ceil(shift / 2)),
        light: Math.max(0, audienceComposition.light - Math.floor(shift / 2)),
        tourist: 15,
      };
      // Normalize to 100
      const sum = modComp.core + modComp.light + modComp.tourist;
      if (sum !== 100) modComp.light += 100 - sum;
      const delta = simulate(modComp, platformConfigs, campaigns, languageSplit);
      if (delta > 0) {
        recs.push({
          lever: 'Increase tourist allocation to 15%',
          detail: `Tourist segment at ${audienceComposition.tourist}%. Tourists have the highest IG follow conversion (1.3x) and drive the social-to-attendance pipeline that differentiates WBSTT strategy.`,
          additionalFollowers: delta,
          newTotal: currentGrowth + delta,
          confidence: 'low',
        });
      }
    }

    // Sort by additional followers descending, drop anything under 1% of target
    const minImpact = KPI_TARGETS.followerGrowth * 0.01;
    return recs
      .filter(r => r.additionalFollowers >= minImpact)
      .sort((a, b) => b.additionalFollowers - a.additionalFollowers);
  }, [organicGrowth, currentGrowth, platformConfigs, audienceComposition, languageSplit, campaigns]);

  return (
    <div className="mt-8">
      {/* Section title */}
      <div className="mb-6">
        <h2 className="font-display text-3xl font-semibold text-text-primary mb-2">
          {hasFollowerGap ? 'What gets us to 100K?' : 'Target: 100K'}
        </h2>
        <p className="text-text-secondary text-sm max-w-2xl">
          {hasFollowerGap
            ? <>The current strategy projects {formatGrowth(currentGrowth)} new followers, leaving a gap of {formatNumber(followerGap)}. Each recommendation below shows its projected uplift if applied independently.</>
            : <>The current strategy projects {formatGrowth(currentGrowth)} followers, meeting the +{formatNumber(KPI_TARGETS.followerGrowth)} target. Adjust the controls to explore alternative scenarios.</>
          }
        </p>
      </div>

      {/* Current projection baseline */}
      <div className={`flex items-center gap-3 mb-6 p-4 bg-bg-secondary border rounded-card ${hasFollowerGap ? 'border-border' : 'border-success/30'}`}>
        <div className="flex-1">
          <p className="text-text-dim text-[10px] font-mono uppercase tracking-wider mb-1">Current Projection</p>
          <p className={`text-2xl font-semibold font-mono ${hasFollowerGap ? 'text-gold' : 'text-success'}`}>{formatGrowth(currentGrowth)}</p>
          {paidBudget > 0 && (
            <p className="text-text-dim text-[9px] font-mono mt-0.5">
              {formatGrowth(organicGrowth)} organic + {formatGrowth(paidFollowersTotal)} paid
            </p>
          )}
        </div>
        <div className="w-px h-10 bg-border" />
        <div className="flex-1">
          <p className="text-text-dim text-[10px] font-mono uppercase tracking-wider mb-1">Target</p>
          <p className="text-text-primary text-2xl font-semibold font-mono">{formatGrowth(KPI_TARGETS.followerGrowth)}</p>
        </div>
        <div className="w-px h-10 bg-border" />
        <div className="flex-1">
          <p className="text-text-dim text-[10px] font-mono uppercase tracking-wider mb-1">{hasFollowerGap ? 'Gap' : 'Surplus'}</p>
          <p className={`text-2xl font-semibold font-mono ${hasFollowerGap ? 'text-danger' : 'text-success'}`}>
            {hasFollowerGap ? formatNumber(followerGap) : `+${formatNumber(Math.abs(followerGap))}`}
          </p>
        </div>
      </div>

      {/* Paid media lever — always visible */}
      <div className="bg-bg-secondary border border-border rounded-card p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-success" />
          <h3 className="text-text-primary text-sm font-medium">Paid Media Lever</h3>
          <span
            className="px-1.5 py-0.5 rounded text-[9px] font-mono"
            style={{ backgroundColor: '#4ade8015', color: '#4ade80' }}
          >
            High confidence
          </span>
        </div>
        <p className="text-text-dim text-xs leading-relaxed mb-4">
          Allocate monthly paid media budget to accelerate follower acquisition across platforms. Based on blended CPF of ${COST_PER_FOLLOWER.toFixed(2)} (IG ~$1.00, TT ~$0.80, X ~$2.00, FB ~$1.50).
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {BUDGET_STEPS.map(step => {
            const isActive = paidBudget === step;
            const label = step === 0 ? '$0' : step < 1000 ? `$${step}` : `$${(step / 1000).toFixed(step % 1000 === 0 ? 0 : 1)}K`;
            return (
              <button
                key={step}
                onClick={() => onPaidBudgetChange(step)}
                className={`px-3 py-1.5 rounded-inner text-xs font-mono transition-colors ${
                  isActive
                    ? 'bg-success/20 text-success border border-success/40'
                    : 'bg-bg-tertiary text-text-dim border border-transparent hover:text-text-secondary hover:border-border'
                }`}
              >
                {label}/mo
              </button>
            );
          })}
        </div>

        {paidBudget > 0 && (
          <div className="bg-bg-tertiary rounded-inner p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-text-dim text-[10px] font-mono uppercase tracking-wider">
                Paid media contribution
              </p>
              <div className="flex items-center gap-2">
                <span className="text-success text-xs font-mono font-semibold">
                  {formatGrowth(paidFollowersTotal)}
                </span>
                <span className="text-text-dim text-[10px]">followers/year</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-text-dim text-[10px] font-mono">
              <span>{formatNumber(paidFollowersPerMonth)} followers/mo</span>
              <span className="text-border">|</span>
              <span>${formatNumber(paidBudget * 12)} annual spend</span>
            </div>
          </div>
        )}
      </div>

      {/* Target met message */}
      {!hasFollowerGap && (
        <div className="bg-bg-secondary border border-success/30 rounded-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <h3 className="text-success text-sm font-medium">All targets on track</h3>
          </div>
          <p className="text-text-secondary text-xs leading-relaxed">
            The current strategy projects {formatGrowth(currentGrowth)} followers, meeting the +{formatNumber(KPI_TARGETS.followerGrowth)} target.
          </p>
        </div>
      )}

      {/* Organic strategy recommendations — always visible */}
      {recommendations.length > 0 && (
      <>
      <h3 className="text-text-primary text-sm font-medium mb-3">Other Organic Strategies</h3>
      <div className="space-y-3">
        {recommendations.slice(0, 5).map((rec, i) => {
          const reachesTarget = rec.newTotal >= KPI_TARGETS.followerGrowth;
          return (
            <div key={i} className="bg-bg-secondary border border-border rounded-card p-5">
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <ArrowRight className="w-3.5 h-3.5 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-text-primary text-sm font-medium">{rec.lever}</p>
                    <span
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono"
                      style={{
                        backgroundColor: `${CONFIDENCE_COLORS[rec.confidence]}15`,
                        color: CONFIDENCE_COLORS[rec.confidence],
                      }}
                    >
                      {CONFIDENCE_LABELS[rec.confidence]}
                    </span>
                  </div>
                  <p className="text-text-dim text-xs leading-relaxed mb-3">{rec.detail}</p>

                  {/* Projection bar */}
                  <div className="bg-bg-tertiary rounded-inner p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-text-dim text-[10px] font-mono uppercase tracking-wider">
                        With this change
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-success text-xs font-mono font-semibold">
                          {formatGrowth(rec.additionalFollowers)}
                        </span>
                        <span className="text-text-dim text-[10px]">additional</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-bg-primary rounded-full overflow-hidden relative">
                      {/* Target marker */}
                      <div
                        className="absolute top-0 h-full w-px bg-text-dim z-10"
                        style={{ left: '100%' }}
                      />
                      {/* Current base */}
                      <div
                        className="absolute top-0 h-full rounded-full bg-gold/40"
                        style={{ width: `${Math.min(100, (currentGrowth / KPI_TARGETS.followerGrowth) * 100)}%` }}
                      />
                      {/* With this recommendation */}
                      <div
                        className="absolute top-0 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (rec.newTotal / KPI_TARGETS.followerGrowth) * 100)}%`,
                          backgroundColor: reachesTarget ? '#4ade80' : '#d4a843',
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <p className="text-text-dim text-[10px] font-mono">
                        {formatCompact(rec.newTotal)} of {formatCompact(KPI_TARGETS.followerGrowth)} target
                      </p>
                      {reachesTarget && (
                        <p className="text-success text-[10px] font-mono font-medium">Target reached</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-text-dim text-[10px] mt-4 leading-relaxed">
        Projections are based on individual changes applied to the current strategy. Combining multiple recommendations may produce compounding effects not reflected in these estimates.
      </p>
      </>
      )}
    </div>
  );
});

GapAnalysis.displayName = 'GapAnalysis';
export default GapAnalysis;
