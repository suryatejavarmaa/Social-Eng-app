import React from 'react';
import { useNavigate } from 'react-router';
import { MessageCircle, Coins, Diamond } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { HeaderBar } from '../../components/imitr/HeaderBar';
import { BottomNav } from '../../components/imitr/BottomNav';
import { useTheme } from '../../context/ThemeContext';
import { useApp, MESSAGE_COST_COINS, COIN_DIAMOND_RATE } from '../../context/AppContext';
import { PremiumGateOverlay } from '../../components/imitr/PremiumGate';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export function ChatListScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { chatThreads, coinBalance, isPremium, celebrities } = useApp();
  const [showPremiumGate, setShowPremiumGate] = React.useState(!isPremium);

  React.useEffect(() => {
    if (!isPremium) setShowPremiumGate(true);
  }, [isPremium]);

  const totalCoinsSpent = chatThreads.reduce((sum, t) => sum + t.totalCoinsSent, 0);
  const totalDiamonds = Math.floor(totalCoinsSpent / COIN_DIAMOND_RATE);

  // Helper to determine if a chat user is a celebrity
  const getProfilePath = (userId: string) => {
    const isCeleb = userId.startsWith('CEL-') || celebrities.some(c => c.id === userId);
    return isCeleb ? `/celeb/${userId}` : `/user/${userId}`;
  };

  return (
    <ScreenWrapper noPadding>
      <div className="px-5 pb-24 pt-6 imitr-page-enter">
        <HeaderBar title="Messages" />

        {/* Stats */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          <GlassCard className="p-3 text-center">
            <MessageCircle size={16} style={{ color: colors.primary, margin: '0 auto 4px' }} />
            <span className="imitr-counter" style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '18px', display: 'block' }}>
              {chatThreads.length}
            </span>
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Chats</span>
          </GlassCard>
          <GlassCard className="p-3 text-center">
            <Coins size={16} style={{ color: colors.primary, margin: '0 auto 4px' }} />
            <span className="imitr-counter" style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '18px', display: 'block' }}>
              {totalCoinsSpent}
            </span>
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Coins Spent</span>
          </GlassCard>
          <GlassCard className="p-3 text-center">
            <Diamond size={16} style={{ color: colors.success, margin: '0 auto 4px' }} />
            <span className="imitr-counter" style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '18px', display: 'block' }}>
              {totalDiamonds}
            </span>
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Equivalent</span>
          </GlassCard>
        </div>

        {/* Cost info */}
        <div className="mb-4 flex items-center justify-center gap-2 rounded-xl py-2" style={{ background: `${colors.primary}08` }}>
          <Coins size={12} style={{ color: colors.primary }} />
          <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
            {MESSAGE_COST_COINS} coins/message • Balance: <span style={{ color: colors.primary }}>{coinBalance.toLocaleString()}</span>
          </span>
        </div>

        {/* Chat threads */}
        <div className="imitr-stagger flex flex-col gap-3">
          {chatThreads.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <MessageCircle size={40} style={{ color: colors.primary, margin: '0 auto 12px', opacity: 0.5 }} />
              <p style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '16px', marginBottom: '4px' }}>
                No conversations yet
              </p>
              <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                Start a chat from any user profile
              </p>
            </GlassCard>
          ) : (
            chatThreads.map((thread) => {
              const lastMsg = thread.messages[thread.messages.length - 1];
              return (
                <GlassCard
                  key={thread.userId}
                  className="flex items-center gap-3 p-4"
                  onClick={() => navigate(`/chat/${thread.userId}`)}
                >
                  <div className="relative">
                    <ImageWithFallback
                      src={thread.userAvatar}
                      alt={thread.userName}
                      className="h-12 w-12 rounded-full object-cover"
                      style={{ border: `2px solid ${colors.cardBorder}` }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                        {thread.userName}
                      </span>
                      <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>
                        {lastMsg?.timestamp.split(', ')[1] || lastMsg?.timestamp}
                      </span>
                    </div>
                    <p className="truncate" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', marginTop: '2px' }}>
                      {lastMsg?.direction === 'sent' ? 'You: ' : ''}{lastMsg?.text}
                    </p>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="flex items-center gap-1" style={{ color: colors.primary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                        <Coins size={10} /> {thread.totalCoinsSent} spent
                      </span>
                      <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                        {thread.messages.length} messages
                      </span>
                    </div>
                  </div>
                </GlassCard>
              );
            })
          )}
        </div>
      </div>
      <BottomNav />
      {!isPremium && (
        <PremiumGateOverlay
          isOpen={showPremiumGate}
          onClose={() => {
            setShowPremiumGate(false);
            navigate('/home');
          }}
          feature="Messaging"
        />
      )}
    </ScreenWrapper>
  );
}