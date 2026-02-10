import React from 'react';

interface ToggleSwitchProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  className?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = React.memo(({ label, enabled, onChange, className = '' }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${
        enabled ? 'bg-gold' : 'bg-border'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-text-primary transition-transform duration-300 ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
    <span className="text-text-secondary text-sm">{label}</span>
  </div>
));

ToggleSwitch.displayName = 'ToggleSwitch';
export default ToggleSwitch;
