import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import emeraldBg from 'figma:asset/e12529c9b31c3c6df10051c7dd0838954d5b96f1.png';

import { ThemeToggle } from './ThemeToggle';

interface ScreenWrapperProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  showThemeToggle?: boolean;
}

export function ScreenWrapper({ children, className = '', noPadding = false, showThemeToggle = true }: ScreenWrapperProps) {
  const { theme } = useTheme();

  const nightStyle: React.CSSProperties = {
    backgroundImage: `url(${emeraldBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const dayStyle: React.CSSProperties = {
    background: 'linear-gradient(180deg, #850222 0%, #3A000E 50%, #140005 100%)',
  };

  return (
    <div
      className={`relative min-h-screen w-full overflow-x-clip overflow-y-auto imitr-scroll ${noPadding ? '' : 'px-5 py-6'} ${className}`}
      style={theme === 'night' ? nightStyle : dayStyle}
    >
      {theme === 'day' && (
        <div className="contents">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 30% 20%, rgba(254,255,174,0.06) 0%, transparent 60%)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 70% 80%, rgba(254,255,174,0.04) 0%, transparent 50%)',
            }}
          />
        </div>
      )}
      <div className="relative z-10">{children}</div>
      {showThemeToggle && (
        <div className="fixed right-4 top-4 z-[999]">
          <ThemeToggle />
        </div>
      )}
    </div>
  );
}