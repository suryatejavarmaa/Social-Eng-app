import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed, Star, Diamond, MessageCircle } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { HeaderBar } from '../../components/imitr/HeaderBar';
import { BottomNav } from '../../components/imitr/BottomNav';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export function CallHistoryScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { callHistory, celebrities } = useApp();
  const [filter, setFilter] = useState<'all' | 'audio' | 'video'>('all');

  const filtered = callHistory.filter(c => filter === 'all' || c.type === filter);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // Helper: determine the correct profile route
  const getProfilePath = (userId: string) => {
    // Check if it's a celebrity ID
    const isCeleb = userId.startsWith('CEL-') || celebrities.some(c => c.id === userId);
    return isCeleb ? `/celeb/${userId}` : `/user/${userId}`;
  };

  return (
    <ScreenWrapper noPadding>
      <div className="px-5 pb-24 pt-6 imitr-page-enter">
        <HeaderBar title="Call History" />

        {/* Filters */}
        <div className="mb-5 flex items-center gap-3">
          {(['all', 'audio', 'video'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="imitr-ripple rounded-xl px-4 py-2"
              style={{
                background: filter === f ? colors.buttonGradient : colors.cardBg,
                color: filter === f ? colors.buttonText : colors.text,
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
                border: `1px solid ${filter === f ? 'transparent' : colors.cardBorder}`,
                transition: 'all 0.3s ease',
              }}
            >
              {f === 'all' ? 'All' : f === 'audio' ? 'Audio' : 'Video'}
            </button>
          ))}

          {/* Chat History Button */}
          <button
            onClick={() => navigate('/messages')}
            className="imitr-ripple ml-auto flex items-center gap-1.5 rounded-xl px-4 py-2"
            style={{
              background: colors.cardBg,
              color: colors.primary,
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              border: `1px solid ${colors.cardBorder}`,
              transition: 'all 0.3s ease',
            }}
          >
            <MessageCircle size={15} />
            <span>Chats</span>
          </button>
        </div>

        <div className="imitr-stagger flex flex-col gap-3">
          {filtered.map((call) => (
            <GlassCard key={call.id} className="flex items-center justify-between p-4" onClick={() => navigate(getProfilePath(call.userId))}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ImageWithFallback src={call.userAvatar} alt={call.userName} className="h-12 w-12 rounded-full object-cover" />
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full" style={{ background: colors.bg }}>
                    {call.type === 'video' ? <Video size={10} style={{ color: colors.primary }} /> : <Phone size={10} style={{ color: colors.primary }} />}
                  </div>
                </div>
                <div>
                  <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px', display: 'block' }}>{call.userName}</span>
                  <div className="flex items-center gap-2">
                    <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                      {formatDuration(call.duration)} • {call.type}
                    </span>
                    {call.rating && (
                      <span className="flex items-center gap-0.5" style={{ color: colors.primary, fontSize: '10px' }}>
                        <Star size={8} fill={colors.primary} /> {call.rating}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px', display: 'block' }}>{call.date}</span>
                {call.coinsUsed > 0 && (
                  <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>-{call.coinsUsed} coins</span>
                )}
                {call.diamondsEarned > 0 && (
                  <span className="flex items-center justify-end gap-0.5" style={{ color: colors.success, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                    +{call.diamondsEarned} <Diamond size={9} />
                  </span>
                )}
              </div>
            </GlassCard>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-16">
            <Phone size={40} style={{ color: colors.inactive, marginBottom: '12px' }} />
            <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>No calls yet</p>
          </div>
        )}
      </div>
      <BottomNav />
    </ScreenWrapper>
  );
}