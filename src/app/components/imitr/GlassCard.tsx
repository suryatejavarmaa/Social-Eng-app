import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  glow?: boolean;
  shimmer?: boolean;
}

export function GlassCard({ children, className = '', onClick, style, glow, shimmer }: GlassCardProps) {
  const { colors } = useTheme();

  return (
    <div
      onClick={onClick}
      className={`rounded-3xl imitr-card-hover ${onClick ? 'cursor-pointer' : ''} ${shimmer ? 'imitr-shimmer' : ''} ${glow ? 'imitr-gold-pulse' : ''} ${className}`}
      style={{
        background: colors.cardBg,
        backdropFilter: 'blur(24px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
        border: `1px solid ${colors.cardBorder}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}