import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { Phone, Video, Coins, AlertCircle, BadgeCheck, Diamond } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { HeaderBar } from '../../components/imitr/HeaderBar';
import { PremiumGateOverlay } from '../../components/imitr/PremiumGate';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { AUDIO_COINS_PER_MIN, VIDEO_COINS_PER_MIN, AUDIO_COINS_PER_10SEC, VIDEO_COINS_PER_10SEC, AUDIO_DIAMONDS_PER_MIN, VIDEO_DIAMONDS_PER_MIN, COIN_DIAMOND_RATE } from '../../context/AppContext';
import { resolveProfile } from '../../data/resolveProfile';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export function PreCallScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id, type } = useParams();
  const { coinBalance, isPremium, celebrities, userAssignedAdmin } = useApp();
  const [showPremiumGate, setShowPremiumGate] = React.useState(false);
  const user = resolveProfile(id, celebrities);
  const isVideo = type === 'video';
  const rate = isVideo ? VIDEO_COINS_PER_MIN : AUDIO_COINS_PER_MIN;
  const ratePer10Sec = isVideo ? VIDEO_COINS_PER_10SEC : AUDIO_COINS_PER_10SEC;
  const diamondsPerMin = isVideo ? VIDEO_DIAMONDS_PER_MIN : AUDIO_DIAMONDS_PER_MIN;
  const estMinutes = Math.floor(coinBalance / rate);
  const canCall = coinBalance >= ratePer10Sec;

  // Gate audio calls for free users
  React.useEffect(() => {
    if (!isVideo && !isPremium) {
      setShowPremiumGate(true);
    }
  }, [isVideo, isPremium]);

  return (
    <ScreenWrapper className="flex min-h-screen flex-col">
      <HeaderBar title="Confirm Call" showBack />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-1 flex-col items-center justify-center"
      >
        <div className="relative mb-6">
          <ImageWithFallback
            src={user.avatar}
            alt={user.name}
            className="h-24 w-24 rounded-full object-cover imitr-gold-pulse"
            style={{ border: `3px solid ${colors.primary}` }}
          />
          {user.online && (
            <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full border-2" style={{ background: colors.success, borderColor: colors.bg }} />
          )}
        </div>

        <h2 className="mb-1 flex items-center gap-2" style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>
          {user.name} {user.verified && <BadgeCheck size={18} style={{ color: colors.primary }} />}
        </h2>
        <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>{user.city}</p>

        <GlassCard className="mx-4 mt-8 w-full max-w-sm p-5 imitr-fade-scale">
          <div className="mb-4 flex items-center justify-between">
            <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>Call Type</span>
            <span className="flex items-center gap-2" style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
              {isVideo ? <Video size={16} style={{ color: colors.primary }} /> : <Phone size={16} style={{ color: colors.primary }} />}
              {isVideo ? 'Video Call' : 'Audio Call'}
            </span>
          </div>
          <div className="mb-4 flex items-center justify-between" style={{ borderTop: `1px solid ${colors.cardBorder}`, paddingTop: '12px' }}>
            <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>Rate</span>
            <span className="flex items-center gap-1" style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
              <Coins size={14} /> {ratePer10Sec} coin{ratePer10Sec > 1 ? 's' : ''}/10 sec
            </span>
          </div>
          <div className="flex items-center justify-between" style={{ borderTop: `1px solid ${colors.cardBorder}`, paddingTop: '12px' }}>
            <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>Your Balance</span>
            <span className="flex items-center gap-1 imitr-counter" style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
              <Coins size={14} style={{ color: colors.primary }} /> {coinBalance.toLocaleString()} coins
            </span>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex items-center justify-between rounded-xl p-3" style={{ background: `${colors.primary}10` }}>
              <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                Est. call time
              </span>
              <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                {estMinutes} min
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl p-3" style={{ background: `${colors.success}10` }}>
              <span className="flex items-center gap-1" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                <Diamond size={12} style={{ color: colors.success }} /> Receiver earns
              </span>
              <span style={{ color: colors.success, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                {diamondsPerMin} diamond{diamondsPerMin > 1 ? 's' : ''}/min
              </span>
            </div>
          </div>
        </GlassCard>

        {!canCall && (
          <div className="mx-4 mt-4 flex items-center gap-2 rounded-xl px-4 py-3" style={{ background: `${colors.danger}15` }}>
            <AlertCircle size={16} style={{ color: colors.danger }} />
            <span style={{ color: colors.danger, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
              Insufficient coins. Please recharge first.
            </span>
          </div>
        )}

        <div className="mt-8 flex w-full max-w-sm gap-3 px-4">
          <PremiumButton fullWidth variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </PremiumButton>
          {canCall ? (
            <PremiumButton fullWidth onClick={() => navigate(`/calling/${id}/${type}`)}>
              <span className="flex items-center justify-center gap-2">
                {isVideo ? <Video size={18} /> : <Phone size={18} />} Call Now
              </span>
            </PremiumButton>
          ) : (
            <PremiumButton fullWidth onClick={() => navigate(userAssignedAdmin ? '/recharge-coins' : '/admin-selection')}>
              Recharge
            </PremiumButton>
          )}
        </div>
      </motion.div>

      {showPremiumGate && (
        <PremiumGateOverlay
          isOpen={showPremiumGate}
          onClose={() => {
            setShowPremiumGate(false);
            if (!isPremium) navigate(-1);
          }}
          feature="Audio Call"
        />
      )}
    </ScreenWrapper>
  );
}