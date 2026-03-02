import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { Clock, Coins, Star, Diamond, Home } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { COIN_DIAMOND_RATE } from '../../context/AppContext';
import { resolveProfile } from '../../data/resolveProfile';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export function CallEndScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const { coinBalance, callHistory, celebrities } = useApp();
  const user = resolveProfile(id, celebrities);
  const [rating, setRating] = React.useState(0);

  // Get the most recent call record
  const lastCall = callHistory[0];
  const duration = lastCall ? `${Math.floor(lastCall.duration / 60).toString().padStart(2, '0')}:${(lastCall.duration % 60).toString().padStart(2, '0')}` : '00:00';
  const coinsUsed = lastCall?.coinsUsed || 0;
  const diamondsEarned = lastCall?.diamondsEarned || 0;
  const diamondFormula = `${coinsUsed} ÷ ${COIN_DIAMOND_RATE} = ${diamondsEarned}`;

  return (
    <ScreenWrapper className="flex min-h-screen flex-col items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm text-center">
        <ImageWithFallback
          src={user.avatar}
          alt={user.name}
          className="mx-auto mb-4 h-20 w-20 rounded-full object-cover"
          style={{ border: `2px solid ${colors.primary}`, boxShadow: `0 0 24px ${colors.glowColor}` }}
        />
        <h2 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '22px' }}>Call Ended</h2>
        <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px', marginTop: '4px' }}>
          with {user.name}
        </p>

        <GlassCard className="mt-6 p-5 imitr-fade-scale">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2" style={{ color: colors.textSecondary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
              <Clock size={14} style={{ color: colors.primary }} /> Duration
            </span>
            <span className="imitr-counter" style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>{duration}</span>
          </div>
          <div className="mb-4 flex items-center justify-between" style={{ borderTop: `1px solid ${colors.cardBorder}`, paddingTop: '12px' }}>
            <span className="flex items-center gap-2" style={{ color: colors.textSecondary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
              <Coins size={14} style={{ color: colors.primary }} /> Coins Used
            </span>
            <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>{coinsUsed} coins</span>
          </div>
          {diamondsEarned > 0 && (
            <div className="mb-4 flex flex-col gap-1" style={{ borderTop: `1px solid ${colors.cardBorder}`, paddingTop: '12px' }}>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2" style={{ color: colors.textSecondary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
                  <Diamond size={14} style={{ color: colors.success }} /> Receiver Earns
                </span>
                <span style={{ color: colors.success, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>+{diamondsEarned} diamonds</span>
              </div>
              <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif", textAlign: 'right' }}>
                ({diamondFormula})
              </span>
            </div>
          )}
          <div className="flex items-center justify-between" style={{ borderTop: `1px solid ${colors.cardBorder}`, paddingTop: '12px' }}>
            <span style={{ color: colors.textSecondary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>Remaining</span>
            <span className="imitr-counter" style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>{coinBalance.toLocaleString()} coins</span>
          </div>
        </GlassCard>

        <GlassCard className="mt-4 p-5">
          <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px', marginBottom: '12px' }}>
            Rate your experience
          </p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setRating(s)} className="imitr-ripple p-1">
                <Star
                  size={28}
                  fill={s <= rating ? colors.primary : 'transparent'}
                  style={{
                    color: s <= rating ? colors.primary : colors.border,
                    transition: 'all 0.2s ease',
                    filter: s <= rating ? `drop-shadow(0 0 4px ${colors.glowColor})` : 'none',
                    transform: s <= rating ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
              </button>
            ))}
          </div>
        </GlassCard>

        <div className="mt-8 flex gap-3">
          <PremiumButton fullWidth variant="outline" onClick={() => navigate('/home')}>
            <span className="flex items-center justify-center gap-2"><Home size={16} /> Home</span>
          </PremiumButton>
          <PremiumButton fullWidth onClick={() => navigate(`/pre-call/${id}/audio`)}>
            Call Again
          </PremiumButton>
        </div>
      </motion.div>
    </ScreenWrapper>
  );
}