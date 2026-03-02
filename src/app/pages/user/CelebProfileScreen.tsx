import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { Star, Phone, Video, BadgeCheck, Heart, Coins, Clock, Shield, ChevronLeft, MessageCircle, Lock, Crown, Users, Flame, Diamond } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { ThemeToggle } from '../../components/imitr/ThemeToggle';
import { PremiumGateOverlay, usePremiumGate } from '../../components/imitr/PremiumGate';
import { useTheme } from '../../context/ThemeContext';
import { useApp, AUDIO_COINS_PER_10SEC, VIDEO_COINS_PER_10SEC, MESSAGE_COST_COINS } from '../../context/AppContext';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export function CelebProfileScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const { celebrities, favourites, toggleFavourite, coinBalance } = useApp();
  const { showGate, gateFeature, setShowGate, requirePremium, isPremium } = usePremiumGate();
  
  const celeb = celebrities.find(c => c.id === id);
  const isFav = id ? favourites.includes(id) : false;

  if (!celeb) {
    return (
      <ScreenWrapper className="flex min-h-screen flex-col items-center justify-center">
        <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif" }}>Celebrity not found</p>
        <PremiumButton onClick={() => navigate('/celebs')} className="mt-4">Back to Celebs</PremiumButton>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper noPadding showThemeToggle={false}>
      {/* Hero Image Section */}
      <div className="relative mx-4 mt-4">
        <ImageWithFallback
          src={celeb.image}
          alt={celeb.name}
          className="w-full rounded-2xl object-cover object-top"
          style={{ height: '380px' }}
        />
        <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.75) 100%)' }} />

        {/* Floating header */}
        <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="imitr-ripple flex h-10 w-10 items-center justify-center rounded-full"
            style={{
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${colors.cardBorder}`,
            }}
          >
            <ChevronLeft size={20} style={{ color: colors.primary }} />
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => id && toggleFavourite(id)}
              className="imitr-ripple flex h-10 w-10 items-center justify-center rounded-full"
              style={{
                background: 'rgba(0,0,0,0.35)',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${colors.cardBorder}`,
              }}
            >
              <Heart
                size={17}
                fill={isFav ? '#FF4D4D' : 'transparent'}
                style={{
                  color: isFav ? '#FF4D4D' : colors.primary,
                  transition: 'all 0.3s ease',
                  filter: isFav ? 'drop-shadow(0 0 8px rgba(255,77,77,0.5))' : 'none',
                }}
              />
            </button>
          </div>
        </div>

        {/* Live badge */}
        {celeb.isLive && (
          <div className="absolute left-4 top-16 flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{
              background: 'rgba(255,77,77,0.9)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 0 20px rgba(255,77,77,0.5)',
            }}
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            <span style={{ color: '#fff', fontFamily: "'Inter', sans-serif", fontSize: '11px', letterSpacing: '1px' }}>
              LIVE
            </span>
          </div>
        )}

        {/* Name & info overlay */}
        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex items-center gap-2">
            <h1 style={{ color: '#fff', fontFamily: "'Playfair Display', serif", fontSize: '24px' }}>{celeb.name}</h1>
            {celeb.isVerified && <BadgeCheck size={20} style={{ color: colors.primary, filter: `drop-shadow(0 0 4px ${colors.glowColor})` }} />}
            <span
              className="flex items-center gap-1 rounded-full px-2.5 py-0.5"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                boxShadow: '0 2px 8px rgba(255,165,0,0.4)',
              }}
            >
              <Crown size={10} style={{ color: '#fff' }} />
              <span style={{ color: '#fff', fontSize: '9px', fontFamily: "'Inter', sans-serif", letterSpacing: '0.5px' }}>CELEB</span>
            </span>
          </div>
          <div className="mt-1 flex items-center gap-3">
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
              {celeb.category}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>•</span>
            <span className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
              <Users size={12} /> {celeb.followers}
            </span>
            <span className="flex items-center gap-1" style={{ color: colors.primary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
              <Star size={12} fill={colors.primary} /> {celeb.rating}
            </span>
          </div>
        </div>
      </div>

      <div className="imitr-page-enter px-5 pb-8 pt-5">
        {/* Stats */}
        <div className="imitr-stagger mb-5 grid grid-cols-3 gap-3">
          {[
            { icon: <Phone size={16} />, label: 'Total Calls', value: celeb.totalCalls.toLocaleString() },
            { icon: <Star size={16} />, label: 'Rating', value: celeb.rating.toString() },
            { icon: <Diamond size={16} />, label: 'Earnings', value: `${(celeb.totalEarnings / 1000).toFixed(1)}K` },
          ].map((stat) => (
            <GlassCard key={stat.label} className="flex flex-col items-center p-3">
              <span style={{ color: colors.primary }}>{stat.icon}</span>
              <span className="imitr-counter" style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '18px', marginTop: '4px' }}>
                {stat.value}
              </span>
              <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                {stat.label}
              </span>
            </GlassCard>
          ))}
        </div>

        {/* Bio */}
        <GlassCard className="mb-5 p-4">
          <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            About
          </p>
          <p style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px', lineHeight: '1.6' }}>
            {celeb.bio}
          </p>
        </GlassCard>

        {/* Tags */}
        <GlassCard className="mb-5 p-4">
          <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {celeb.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-3 py-1"
                style={{
                  background: `${colors.primary}15`,
                  border: `1px solid ${colors.cardBorder}`,
                  color: colors.primary,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '12px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </GlassCard>

        {/* Call Rates */}
        <GlassCard className="mb-5 p-4">
          <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Rates
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="flex flex-1 items-center gap-3 rounded-xl p-3" style={{ background: `${colors.primary}10` }}>
                <Phone size={18} style={{ color: colors.primary }} />
                <div>
                  <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px', display: 'block' }}>Audio</span>
                  <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                    <Coins size={10} className="mr-1 inline" />{AUDIO_COINS_PER_10SEC} coin/10s
                  </span>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-3 rounded-xl p-3" style={{ background: `${colors.primary}10` }}>
                <Video size={18} style={{ color: colors.primary }} />
                <div>
                  <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px', display: 'block' }}>Video</span>
                  <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                    <Coins size={10} className="mr-1 inline" />{VIDEO_COINS_PER_10SEC} coins/10s
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: `${colors.primary}10` }}>
              <MessageCircle size={18} style={{ color: colors.primary }} />
              <div>
                <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px', display: 'block' }}>Message</span>
                <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                  <Coins size={10} className="mr-1 inline" />{MESSAGE_COST_COINS} coins/msg
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Status */}
        <div className="mb-4 flex items-center justify-center gap-3 rounded-xl py-2" style={{ background: `${colors.primary}08` }}>
          <span
            className="h-2 w-2 rounded-full"
            style={{
              background: celeb.isOnline ? colors.success : colors.danger,
              boxShadow: `0 0 6px ${celeb.isOnline ? colors.success : colors.danger}`,
            }}
          />
          <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
            {celeb.isOnline ? 'Online Now' : 'Offline'} • Balance: <span style={{ color: colors.primary }}>{coinBalance.toLocaleString()} coins</span>
          </span>
        </div>

        {/* Call Buttons */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <PremiumButton fullWidth onClick={() => {
              if (!isPremium) { requirePremium('Audio Call'); return; }
              navigate(`/pre-call/${celeb.id}/audio`);
            }}>
              <span className="flex items-center justify-center gap-2">
                <Phone size={18} /> Audio Call
                {!isPremium && <Lock size={12} />}
              </span>
            </PremiumButton>
            <PremiumButton fullWidth variant="outline" onClick={() => navigate(`/pre-call/${celeb.id}/video`)}>
              <span className="flex items-center justify-center gap-2"><Video size={18} /> Video Call</span>
            </PremiumButton>
          </div>
          <PremiumButton fullWidth variant="outline" onClick={() => {
            if (!isPremium) { requirePremium('Messaging'); return; }
            navigate(`/chat/${celeb.id}`);
          }}>
            <span className="flex items-center justify-center gap-2">
              <MessageCircle size={18} /> Message ({MESSAGE_COST_COINS} coins/msg)
              {!isPremium && <Lock size={12} />}
            </span>
          </PremiumButton>
        </div>
      </div>
      <PremiumGateOverlay
        isOpen={showGate}
        onClose={() => setShowGate(false)}
        feature={gateFeature}
      />
    </ScreenWrapper>
  );
}