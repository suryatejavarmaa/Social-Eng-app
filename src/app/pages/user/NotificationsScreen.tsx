import React from 'react';
import { Phone, Coins, Diamond, AlertCircle, Gift, Shield, CheckCheck, Bell, MessageCircle } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { HeaderBar } from '../../components/imitr/HeaderBar';
import { BottomNav } from '../../components/imitr/BottomNav';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { ThemeToggle } from '../../components/imitr/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

const iconMap: Record<string, any> = {
  info: Shield,
  success: Gift,
  warning: AlertCircle,
  call: Phone,
  coin: Coins,
  diamond: Diamond,
  message: MessageCircle,
};

export function NotificationsScreen() {
  const { colors } = useTheme();
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadNotifications } = useApp();

  return (
    <ScreenWrapper noPadding showThemeToggle={false}>
      <div className="px-5 pb-24 pt-6 imitr-page-enter">
        <HeaderBar
          title="Notifications"
          rightAction={
            <div className="flex items-center gap-2">
              {unreadNotifications > 0 && (
                <button onClick={markAllNotificationsRead} className="flex items-center gap-1 rounded-xl px-3 py-1.5"
                  style={{ background: `${colors.primary}15`, border: `1px solid ${colors.cardBorder}` }}>
                  <CheckCheck size={14} style={{ color: colors.primary }} />
                  <span style={{ color: colors.primary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>Read All</span>
                </button>
              )}
              <ThemeToggle />
            </div>
          }
        />

        {unreadNotifications > 0 && (
          <div className="mb-4 flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: `${colors.primary}10` }}>
            <Bell size={14} style={{ color: colors.primary }} />
            <span style={{ color: colors.primary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
              {unreadNotifications} unread notification{unreadNotifications > 1 ? 's' : ''}
            </span>
          </div>
        )}

        <div className="imitr-stagger flex flex-col gap-3">
          {notifications.map((n) => {
            const Icon = iconMap[n.type] || Shield;
            return (
              <GlassCard
                key={n.id}
                className="flex items-start gap-3 p-4"
                onClick={() => markNotificationRead(n.id)}
                style={!n.read ? { borderColor: `${colors.primary}40`, boxShadow: `0 0 8px ${colors.glowColor}` } : {}}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${colors.primary}15`, flexShrink: 0 }}>
                  <Icon size={18} style={{ color: colors.primary }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>{n.title}</span>
                      {!n.read && (
                        <div className="imitr-badge-pulse h-2 w-2 rounded-full" style={{ background: colors.primary, boxShadow: `0 0 6px ${colors.primary}` }} />
                      )}
                    </div>
                    <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px', flexShrink: 0 }}>{n.time}</span>
                  </div>
                  <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', marginTop: '2px' }}>
                    {n.message}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {notifications.length === 0 && (
          <div className="flex flex-col items-center py-16">
            <Bell size={40} style={{ color: colors.inactive, marginBottom: '12px' }} />
            <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>No notifications yet</p>
          </div>
        )}
      </div>
      <BottomNav />
    </ScreenWrapper>
  );
}