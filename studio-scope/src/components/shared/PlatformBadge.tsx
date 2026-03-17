import React from 'react';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import { Platform, PLATFORM_LABELS, PLATFORM_COLORS } from '../../data/types';

interface PlatformBadgeProps {
  platform: Platform;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const ICONS: Record<Platform, React.FC<{ className?: string }>> = {
  ig: Instagram,
  x: Twitter,
  tt: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.83-3.38 2.89 2.89 0 0 1 3.59-2.22V9.05a6.33 6.33 0 0 0-1-.05A6.34 6.34 0 0 0 3 15.37a6.34 6.34 0 0 0 6.86 6.31 6.34 6.34 0 0 0 5.81-6.33V9.19a8.16 8.16 0 0 0 4.77 1.53V7.27a4.85 4.85 0 0 1-.85-.58Z" />
    </svg>
  ),
  fb: Facebook,
  yt: Youtube,
};

const SIZES = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const PlatformBadge: React.FC<PlatformBadgeProps> = React.memo(({
  platform,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const Icon = ICONS[platform];
  const color = PLATFORM_COLORS[platform];

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`} style={{ color }}>
      <Icon className={SIZES[size]} />
      {showLabel && (
        <span className="text-sm font-medium">{PLATFORM_LABELS[platform]}</span>
      )}
    </span>
  );
});

PlatformBadge.displayName = 'PlatformBadge';
export default PlatformBadge;
