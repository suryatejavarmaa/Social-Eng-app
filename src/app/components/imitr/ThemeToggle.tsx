import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../ui/utils';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme, colors } = useTheme();
  const isDark = theme === 'night';

  return (
    <div
      className={cn(
        "flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300 imitr-ripple",
        className
      )}
      style={{
        background: colors.cardBg,
        backdropFilter: 'blur(16px)',
        border: `1px solid ${colors.border}`,
        boxShadow: `0 2px 8px ${colors.glowColor}`,
      }}
      onClick={toggleTheme}
      role="button"
      tabIndex={0}
    >
      <div className="flex justify-between items-center w-full">
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-all duration-300",
            isDark 
              ? "transform translate-x-0" 
              : "transform translate-x-8"
          )}
          style={{
            background: colors.primary,
            boxShadow: `0 2px 8px ${colors.glowColor}`,
          }}
        >
          {isDark ? (
            <Moon 
              className="w-4 h-4 imitr-moon-rotate" 
              strokeWidth={1.5}
              style={{ color: colors.buttonText }}
            />
          ) : (
            <Sun 
              className="w-4 h-4 imitr-sun-rotate" 
              strokeWidth={1.5}
              style={{ color: colors.buttonText }}
            />
          )}
        </div>
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
            isDark 
              ? "bg-transparent" 
              : "transform -translate-x-8"
          )}
        >
          {isDark ? (
            <Sun 
              className="w-4 h-4" 
              strokeWidth={1.5}
              style={{ color: colors.textSecondary, opacity: 0.5 }}
            />
          ) : (
            <Moon 
              className="w-4 h-4" 
              strokeWidth={1.5}
              style={{ color: colors.text, opacity: 0.5 }}
            />
          )}
        </div>
      </div>
    </div>
  );
}