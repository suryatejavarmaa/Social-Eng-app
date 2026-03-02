import React from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface HeaderBarProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function HeaderBar({ title, showBack = false, rightAction }: HeaderBarProps) {
  const { colors } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="imitr-slide-down mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="imitr-ripple flex items-center justify-center rounded-xl p-2"
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              backdropFilter: 'blur(16px)',
            }}
          >
            <ChevronLeft size={20} style={{ color: colors.primary }} />
          </button>
        )}
        {title && <h2 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>{title}</h2>}
      </div>
      {rightAction}
    </div>
  );
}
