import React from 'react';

interface ModuleNavProps {
  activeModule: number;
  onModuleClick: (module: number) => void;
}

const MODULES = [
  { num: 1, label: 'State of Play' },
  { num: 2, label: 'Audience Engine' },
  { num: 3, label: 'Platform Matrix' },
  { num: 4, label: 'Follower Forecast' },
  { num: 5, label: 'Engagement' },
  { num: 6, label: 'Campaign Calendar' },
  { num: 7, label: 'Content Tracker' },
  { num: 8, label: 'Under the Hood' },
  { num: 9, label: 'AI Assessment' },
];

const ModuleNav: React.FC<ModuleNavProps> = React.memo(({ activeModule, onModuleClick }) => (
  <nav className="hidden xl:fixed xl:block xl:left-4 xl:top-1/2 xl:-translate-y-1/2 z-40">
    <div className="flex flex-col gap-2">
      {MODULES.map(({ num, label }) => (
        <button
          key={num}
          onClick={() => onModuleClick(num)}
          className="group flex items-center gap-2"
          title={label}
        >
          <span
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeModule === num
                ? 'bg-gold scale-125'
                : 'bg-border group-hover:bg-gold-dim'
            }`}
          />
          <span
            className={`text-xs transition-all duration-200 opacity-0 group-hover:opacity-100 whitespace-nowrap ${
              activeModule === num ? 'text-gold opacity-100' : 'text-text-dim'
            }`}
          >
            {label}
          </span>
        </button>
      ))}
    </div>
  </nav>
));

ModuleNav.displayName = 'ModuleNav';
export default ModuleNav;
