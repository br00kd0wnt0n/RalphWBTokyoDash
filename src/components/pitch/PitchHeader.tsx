import React from 'react';
import { Info, FileText } from 'lucide-react';

interface PitchHeaderProps {
  onInfoClick: () => void;
  onMethodologyClick: () => void;
}

const PitchHeader: React.FC<PitchHeaderProps> = React.memo(({ onInfoClick, onMethodologyClick }) => (
  <header className="sticky top-0 z-50 bg-bg-secondary/95 backdrop-blur-md border-b border-border">
    <div className="max-w-dashboard mx-auto px-6 py-4 flex items-center justify-between">
      <div className="flex-shrink-0 flex items-center gap-3">
        <img src="/WBlogo.png" alt="Warner Bros. Studio Tour Tokyo" className="h-10 w-auto" />
        <div>
          <h1 className="font-display text-2xl font-semibold text-gold flex items-center gap-2">
            Studio Scope
            <span className="text-text-dim text-sm font-normal">by</span>
            <img src="/ralph-logo.png" alt="Ralph" className="h-6 w-auto" />
          </h1>
          <p className="text-text-secondary text-xs mt-0.5 tracking-wide">
            WBSTT Social Growth Forecasting
          </p>
        </div>
      </div>
      <nav className="flex items-center gap-1">
        <button
          onClick={onInfoClick}
          className="px-2 py-1.5 text-text-dim hover:text-gold hover:bg-bg-tertiary/50 rounded-inner transition-colors duration-200"
          title="How this works"
        >
          <Info className="w-4 h-4" />
        </button>
        <button
          onClick={onMethodologyClick}
          className="px-3 py-1.5 text-xs text-text-dim hover:text-gold hover:bg-bg-tertiary/50 rounded-inner transition-colors duration-200 flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          Methodology
        </button>
      </nav>
    </div>
  </header>
));

PitchHeader.displayName = 'PitchHeader';
export default PitchHeader;
