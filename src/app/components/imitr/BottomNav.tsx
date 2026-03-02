import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Home, Wallet, Clock, Settings, Crown, Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { PremiumGateOverlay, usePremiumGate } from './PremiumGate';

const leftItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/wallet', icon: Wallet, label: 'Wallet' },
];

const rightItems = [
  { path: '/call-history', icon: Clock, label: 'History' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const celebItem = { path: '/celebs', icon: Crown, label: 'Celeb' };

export function BottomNav() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { showGate, gateFeature, setShowGate, requirePremium, isPremium } = usePremiumGate();

  const renderItem = (item: { path: string; icon: React.ElementType; label: string }) => {
    const isActive = location.pathname.startsWith(item.path);
    const Icon = item.icon;
    return (
      <button
        key={item.path}
        onClick={() => navigate(item.path)}
        className="imitr-ripple relative flex flex-col items-center gap-1 px-3 py-1"
      >
        {isActive && (
          <div
            className="absolute -top-3 h-1 w-6 rounded-full"
            style={{
              background: colors.buttonGradient,
              boxShadow: `0 0 8px ${colors.glowColor}`,
            }}
          />
        )}
        <Icon
          size={22}
          style={{
            color: isActive ? colors.primary : colors.inactive,
            filter: isActive ? `drop-shadow(0 0 6px ${colors.glowColor})` : 'none',
            transition: 'all 0.3s ease',
            transform: isActive ? 'scale(1.1)' : 'scale(1)',
          }}
        />
        <span
          style={{
            color: isActive ? colors.primary : colors.inactive,
            fontFamily: "'Inter', sans-serif",
            fontSize: '10px',
            transition: 'color 0.3s ease',
          }}
        >
          {item.label}
        </span>
      </button>
    );
  };

  const isCelebActive = location.pathname.startsWith(celebItem.path);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-around border-0 px-2 pb-3 pt-3 imitr-glass"
      style={{
        background: colors.navBg,
        borderTop: `1px solid ${colors.cardBorder}`,
        borderColor: colors.cardBorder,
      }}
    >
      {/* Left side */}
      {leftItems.map(renderItem)}

      {/* Center — Celeb (raised special button) */}
      <div className="relative flex flex-col items-center" style={{ marginTop: '-22px' }}>
        <button
          onClick={() => {
            navigate(celebItem.path);
          }}
          className="imitr-ripple relative flex h-14 w-14 items-center justify-center rounded-full"
          style={{
            background: isCelebActive
              ? colors.buttonGradient
              : colors.cardBg,
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: colors.primary,
            boxShadow: isCelebActive
              ? `0 0 24px ${colors.glowColor}, 0 4px 16px ${colors.glowColor}`
              : `0 0 12px ${colors.glowColor}`,
            transition: 'all 0.3s ease',
          }}
        >
          <Crown
            size={24}
            style={{
              color: isCelebActive ? colors.buttonText : colors.primary,
              filter: `drop-shadow(0 0 8px ${colors.glowColor})`,
              transition: 'all 0.3s ease',
            }}
          />
          {/* Lock indicator for free users - removed */}
          {/* Decorative ring */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              border: `1px solid ${colors.primary}`,
              opacity: 0.3,
              transform: 'scale(1.2)',
            }}
          />
        </button>
        <span
          style={{
            color: isCelebActive ? colors.primary : colors.inactive,
            fontFamily: "'Inter', sans-serif",
            fontSize: '10px',
            marginTop: '4px',
            transition: 'color 0.3s ease',
          }}
        >
          {celebItem.label}
        </span>
      </div>

      {/* Right side */}
      {rightItems.map(renderItem)}

      <PremiumGateOverlay
        isOpen={showGate}
        onClose={() => setShowGate(false)}
        feature={gateFeature}
      />
    </div>
  );
}