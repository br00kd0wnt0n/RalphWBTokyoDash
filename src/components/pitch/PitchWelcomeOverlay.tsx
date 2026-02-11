import React from 'react';
import { X, BarChart3, Sliders, TrendingUp } from 'lucide-react';

interface PitchWelcomeOverlayProps {
  onClose: () => void;
}

const SECTIONS = [
  {
    icon: BarChart3,
    label: 'Where You Are',
    description: 'A snapshot of WBSTT social presence today: 535K followers across four platforms, with Instagram as the primary growth engine.',
  },
  {
    icon: Sliders,
    label: 'Strategy Controls',
    description: 'Configure audience targeting, platform allocation, and campaign calendar. Every change updates the forecast instantly.',
  },
  {
    icon: TrendingUp,
    label: 'Projected Impact',
    description: '12-month forecast against the three RFP KPIs: +100K followers, +10% engagement YoY, and 50 strategic posts per month. Updates dynamically as you adjust the strategy.',
  },
];

const PitchWelcomeOverlay: React.FC<PitchWelcomeOverlayProps> = React.memo(({ onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-bg-primary/90 backdrop-blur-sm" onClick={onClose} />
    <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-bg-secondary border border-border rounded-card p-8">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-text-dim hover:text-text-secondary transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Branding */}
      <div className="flex items-center gap-3 mb-2">
        <img src="/WBlogo.png" alt="Warner Bros. Studio Tour Tokyo" className="h-10 w-auto" />
        <div>
          <h1 className="font-display text-2xl font-semibold text-gold flex items-center gap-2">
            Studio Scope
            <span className="text-text-dim text-sm font-normal">by</span>
            <img src="/ralph-logo.png" alt="Ralph" className="h-6 w-auto" />
          </h1>
        </div>
      </div>

      <p className="text-text-secondary text-sm leading-relaxed mb-6">
        WBSTT Social Growth Forecasting
      </p>

      <div className="border-t border-border pt-6 mb-6">
        <h2 className="text-text-primary text-sm font-medium mb-2">Three KPIs. One interactive forecast.</h2>
        <p className="text-text-secondary text-xs leading-relaxed mb-4">
          This pitch tool maps Ralph's strategy directly to the three KPIs from the RFP. Adjust the audience mix, platform allocation, and campaign calendar, then see projected impact on follower growth, engagement, and content volume in real time.
        </p>

        {/* KPI badges */}
        <div className="flex gap-2 mb-6">
          <span className="px-3 py-1.5 bg-bg-tertiary border border-border rounded-inner text-xs text-gold font-mono">
            +100K Followers
          </span>
          <span className="px-3 py-1.5 bg-bg-tertiary border border-border rounded-inner text-xs text-gold font-mono">
            +10% Engagement
          </span>
          <span className="px-3 py-1.5 bg-bg-tertiary border border-border rounded-inner text-xs text-gold font-mono">
            50 Posts/Month
          </span>
        </div>
      </div>

      {/* Section guide */}
      <div className="space-y-3">
        {SECTIONS.map((section, i) => {
          const Icon = section.icon;
          return (
            <div key={i} className="flex items-start gap-3 p-3 bg-bg-tertiary rounded-inner">
              <div className="flex-shrink-0 w-8 h-8 rounded bg-bg-secondary flex items-center justify-center">
                <Icon className="w-4 h-4 text-gold" />
              </div>
              <div>
                <p className="text-text-primary text-xs font-medium">{section.label}</p>
                <p className="text-text-dim text-[11px] leading-relaxed mt-0.5">{section.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onClose}
        className="w-full mt-6 px-6 py-3 bg-gold text-bg-primary font-medium text-sm rounded-inner hover:bg-gold-light transition-colors"
      >
        View the Pitch
      </button>
    </div>
  </div>
));

PitchWelcomeOverlay.displayName = 'PitchWelcomeOverlay';
export default PitchWelcomeOverlay;
