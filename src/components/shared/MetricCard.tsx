import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: 'up' | 'down' | 'flat';
  trendLabel?: string;
  accentColor?: string;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = React.memo(({
  label,
  value,
  subValue,
  trend,
  trendLabel,
  accentColor,
  className = '',
}) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-text-dim';

  return (
    <div className={`bg-bg-secondary border border-border rounded-card p-6 ${className}`}>
      <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-3">
        {label}
      </p>
      <p className="text-2xl font-semibold text-text-primary" style={accentColor ? { color: accentColor } : undefined}>
        {value}
      </p>
      {(subValue || trend) && (
        <div className="flex items-center gap-2 mt-2">
          {trend && (
            <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
          )}
          <span className={`text-xs ${trendColor}`}>
            {trendLabel || subValue}
          </span>
        </div>
      )}
    </div>
  );
});

MetricCard.displayName = 'MetricCard';
export default MetricCard;
