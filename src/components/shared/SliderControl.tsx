import React from 'react';

interface SliderControlProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  className?: string;
}

const SliderControl: React.FC<SliderControlProps> = React.memo(({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  formatValue,
  className = '',
}) => (
  <div className={`space-y-2 ${className}`}>
    <div className="flex items-center justify-between">
      <label className="text-text-secondary text-sm">{label}</label>
      <span className="text-text-primary text-sm font-mono font-medium">
        {formatValue ? formatValue(value) : value}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full"
    />
  </div>
));

SliderControl.displayName = 'SliderControl';
export default SliderControl;
