import React, { useState } from 'react';
import { Sparkles, ArrowRight, TrendingUp, Globe, Calendar, BarChart3 } from 'lucide-react';
import SectionHeader from './shared/SectionHeader';

const RECOMMENDATIONS = [
  {
    icon: TrendingUp,
    title: 'TikTok Content Volume Opportunity',
    impact: 'High',
    impactColor: '#4ade80',
    observation: 'WBSTT currently publishes an average of 10 posts/month on TikTok, well below the platform optimum for entertainment venues. Early data (Jul-Aug 2023) showed explosive growth when content was posted, with 22K and 21K monthly gains respectively.',
    recommendation: 'Increase TikTok output to 12-15 posts/month, focusing on short-form video (behind-the-scenes, visitor reactions, set reveals). Each additional TikTok post has an outsized algorithmic impact due to the platform\'s discovery-driven feed.',
    projectedImpact: '+2,400 to +4,800 additional TikTok followers over 12 months',
  },
  {
    icon: Globe,
    title: 'Language Expansion ROI',
    impact: 'High',
    impactColor: '#4ade80',
    observation: 'Current content is primarily Japanese-language. With 42.4M inbound tourists projected for 2025 (and growing), WBSTT is leaving significant international reach on the table, particularly on Instagram and YouTube where tourist audiences are concentrated.',
    recommendation: 'Implement JP+EN bilingual content as a baseline, with JP+EN+ZH+KO for key tourism-focused posts. Subtitles on video content, bilingual captions on static posts. This unlocks the tourist segment\'s follow conversion multiplier.',
    projectedImpact: '+15% uplift on tourist segment conversion, estimated +8,000 to +12,000 additional followers over 12 months',
  },
  {
    icon: Calendar,
    title: 'Campaign Stacking During Peak Tourist Months',
    impact: 'Medium',
    impactColor: '#fbbf24',
    observation: 'March-May (sakura + Golden Week) and October-November (Dark Arts + Halloween + winter seasonals) show campaign overlap. Currently, these campaigns are treated independently, but coordinated stacking could amplify growth during these windows.',
    recommendation: 'Create unified content narratives that bridge overlapping campaigns. For example: "Dark Arts x Halloween" as a single content arc rather than two separate campaigns. This maximizes the campaign multiplier effect during high-traffic periods.',
    projectedImpact: '+10-15% incremental growth during Q4 peak vs. isolated campaign execution',
  },
  {
    icon: BarChart3,
    title: 'X Platform Reallocation',
    impact: 'Medium',
    impactColor: '#fbbf24',
    observation: 'X (Twitter) has plateaued at ~194K followers with an average monthly growth of just 800. Despite receiving 33 posts/month (the second-highest content volume), the platform shows diminishing returns on investment.',
    recommendation: 'Reduce X content volume from 33 to 12 strategic posts/month, reallocating creative resources to TikTok and Instagram Reels where growth potential is significantly higher. Maintain X for announcements and community management, not as a growth channel.',
    projectedImpact: 'Resource reallocation enables +15-20% more TikTok and IG video content with no net increase in total production effort',
  },
];

const AIAssessment: React.FC = React.memo(() => {
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRevealed(true);
    }, 1800);
  };

  return (
    <section>
      <SectionHeader
        moduleNumber={7}
        title="AI Strategy Assessment"
        subtitle="Strategic observations and recommendations based on current dashboard configuration."
        id="module-7"
      />

      {!revealed && (
        <div className="bg-bg-secondary border border-border rounded-card p-12 text-center">
          <Sparkles className="w-10 h-10 text-gold-dim mx-auto mb-4" />
          <p className="text-text-primary text-lg font-display font-semibold mb-2">
            Strategy Assessment
          </p>
          <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
            Generate an AI-powered analysis of the current dashboard configuration, including actionable recommendations and projected impact estimates.
          </p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-bg-primary font-medium text-sm rounded-inner hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-bg-primary/30 border-t-bg-primary rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Assessment
              </>
            )}
          </button>
        </div>
      )}

      {revealed && (
        <div className="space-y-4">
          <div className="bg-bg-secondary border border-gold/30 rounded-card p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-gold" />
              <h3 className="text-gold text-sm font-medium">Assessment Summary</h3>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              Based on the current audience composition (Casual Expansion preset), platform allocation, and campaign calendar, WBSTT has strong growth fundamentals but is underinvesting in its two highest-potential channels: TikTok and international audience reach. The following four recommendations, if implemented together, could add an estimated 25,000 to 40,000 additional followers beyond the base forecast.
            </p>
          </div>

          {RECOMMENDATIONS.map((rec, i) => {
            const Icon = rec.icon;
            return (
              <div key={i} className="bg-bg-secondary border border-border rounded-card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-inner bg-bg-tertiary flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-text-primary font-medium text-sm">{rec.title}</h4>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded font-mono"
                        style={{
                          backgroundColor: `${rec.impactColor}20`,
                          color: rec.impactColor,
                        }}
                      >
                        {rec.impact} Impact
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-text-dim text-[10px] font-mono uppercase tracking-wider mb-1">Observation</p>
                        <p className="text-text-secondary text-xs leading-relaxed">{rec.observation}</p>
                      </div>
                      <div>
                        <p className="text-text-dim text-[10px] font-mono uppercase tracking-wider mb-1">Recommendation</p>
                        <p className="text-text-secondary text-xs leading-relaxed">{rec.recommendation}</p>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-bg-tertiary rounded-inner">
                        <ArrowRight className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                        <p className="text-gold text-xs font-medium">{rec.projectedImpact}</p>
                      </div>
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

AIAssessment.displayName = 'AIAssessment';
export default AIAssessment;
