import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { GlassCard } from './GlassCard';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  onClick?: () => void;
}

export function StatCard({ icon, label, value, trend, trendUp, onClick }: StatCardProps) {
  const { colors } = useTheme();

  return (
    <GlassCard className="p-4" onClick={onClick}>
      <div className="mb-2 flex items-center justify-between">
        <span style={{ color: colors.primary }}>{icon}</span>
        {trend && (
          <span
            className="rounded-full px-1.5 py-0.5"
            style={{
              color: trendUp ? colors.success : colors.danger,
              background: trendUp ? `${colors.success}15` : `${colors.danger}15`,
              fontSize: '10px',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {trend}
          </span>
        )}
      </div>
      <div className="imitr-counter" style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '22px' }}>
        {value}
      </div>
      <div
        style={{
          color: colors.textSecondary,
          fontFamily: "'Inter', sans-serif",
          fontSize: '12px',
          marginTop: '2px',
        }}
      >
        {label}
      </div>
    </GlassCard>
  );
}
