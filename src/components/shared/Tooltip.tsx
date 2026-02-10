import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, className = '' }) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children || <Info className="w-3.5 h-3.5 text-text-dim cursor-help" />}
      {visible && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-bg-tertiary border border-border rounded-inner text-xs text-text-secondary whitespace-nowrap z-50 shadow-lg">
          {content}
        </span>
      )}
    </span>
  );
};

export default Tooltip;
