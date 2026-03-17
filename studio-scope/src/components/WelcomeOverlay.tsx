import React from 'react';
import { X, BarChart3, Sliders, TrendingUp, Eye, FileText, Layers } from 'lucide-react';

interface WelcomeOverlayProps {
  onClose: () => void;
}

const MODULES = [
  {
    icon: BarChart3,
    label: 'State of Play',
    description: 'Historical performance across all platforms from June 2023 to December 2025. Where WBSTT stands today.',
  },
  {
    icon: Sliders,
    label: 'Strategy Controls',
    description: 'Configure audience targeting, platform allocation, and campaign calendar. Changes update the forecast in real time.',
  },
  {
    icon: TrendingUp,
    label: 'Follower Forecast',
    description: '12-month growth projection with confidence bands. Toggle between organic, strategy, and campaign scenarios.',
  },
  {
    icon: Layers,
    label: 'Engagement Forecast',
    description: 'Year-over-year engagement tracking against the +10% KPI target.',
  },
  {
    icon: Eye,
    label: 'Content Tracker',
    description: 'Operational view of content volume by platform against the 50 posts/month KPI.',
  },
  {
    icon: FileText,
    label: 'Methodology',
    description: 'Full transparency on every data source, formula, and assumption powering the forecast.',
  },
];

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = React.memo(({ onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-bg-primary/90 backdrop-blur-sm" onClick={onClose} />
    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-bg-secondary border border-border rounded-card p-8">
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
        <h2 className="text-text-primary text-sm font-medium mb-2">How this dashboard works</h2>
        <p className="text-text-secondary text-xs leading-relaxed mb-4">
          Studio Scope is an interactive forecasting tool that projects WBSTT social media growth across Instagram, X, TikTok, Facebook, and YouTube. Every chart responds to your inputs: adjust the audience mix, change platform content volume, toggle campaigns on and off, and watch the 12-month forecast update live.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          Start with the <span className="text-gold">Strategy Controls</span> to set your audience targeting and content allocation, then scroll to the <span className="text-gold">Forecast</span> to see the projected impact. The <span className="text-gold">Methodology</span> section documents every assumption and data source for full transparency.
        </p>
      </div>

      {/* Module guide */}
      <div className="space-y-3">
        {MODULES.map((mod, i) => {
          const Icon = mod.icon;
          return (
            <div key={i} className="flex items-start gap-3 p-3 bg-bg-tertiary rounded-inner">
              <div className="flex-shrink-0 w-8 h-8 rounded bg-bg-secondary flex items-center justify-center">
                <Icon className="w-4 h-4 text-gold" />
              </div>
              <div>
                <p className="text-text-primary text-xs font-medium">{mod.label}</p>
                <p className="text-text-dim text-[11px] leading-relaxed mt-0.5">{mod.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onClose}
        className="w-full mt-6 px-6 py-3 bg-gold text-bg-primary font-medium text-sm rounded-inner hover:bg-gold-light transition-colors"
      >
        Explore the Dashboard
      </button>
    </div>
  </div>
));

WelcomeOverlay.displayName = 'WelcomeOverlay';
export default WelcomeOverlay;
