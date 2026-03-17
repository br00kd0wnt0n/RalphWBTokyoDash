import React from 'react';

interface SectionHeaderProps {
  moduleNumber: number;
  title: string;
  subtitle: React.ReactNode;
  id: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = React.memo(({ moduleNumber: _moduleNumber, title, subtitle, id }) => (
  <div id={id} className="mb-8 scroll-mt-24">
    <h2 className="font-display text-3xl font-semibold text-text-primary mb-2">
      {title}
    </h2>
    <p className="text-text-secondary text-sm max-w-2xl">
      {subtitle}
    </p>
  </div>
));

SectionHeader.displayName = 'SectionHeader';
export default SectionHeader;
