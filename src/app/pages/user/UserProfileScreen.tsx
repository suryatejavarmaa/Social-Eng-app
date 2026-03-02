import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { Star, Phone, Video, BadgeCheck, MapPin, Heart, Coins, Clock, Shield, ChevronLeft, MessageCircle, Lock, Crown } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { ThemeToggle } from '../../components/imitr/ThemeToggle';
import { PremiumGateOverlay, usePremiumGate } from '../../components/imitr/PremiumGate';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { AUDIO_COINS_PER_10SEC, VIDEO_COINS_PER_10SEC, MESSAGE_COST_COINS } from '../../context/AppContext';
import { resolveProfile } from '../../data/resolveProfile';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export function UserProfileScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const { favourites, toggleFavourite, coinBalance, celebrities } = useApp();
  const { showGate, gateFeature, setShowGate, requirePremium, isPremium } = usePremiumGate();
  const profile = resolveProfile(id, celebrities);

  // If the resolved profile is a celebrity, redirect to the celeb profile page
  React.useEffect(() => {
    if (profile.isCeleb && id) {
      navigate(`/celeb/${id}`, { replace: true });
    }
  }, [profile.isCeleb, id, navigate]);

  const isFav = favourites.includes(profile.id);

  return (
    <ScreenWrapper noPadding showThemeToggle={false}>
      {/* Hero Image Section */}
      <div className="relative mx-4 mt-4">
        {/* Profile Image — top-aligned to show face/upper body */}
        <ImageWithFallback
          src={profile.avatar}
          alt={profile.name}
          className="w-full rounded-2xl object-cover object-top"
          style={{ height: '380px' }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.75) 100%)' }} />

        {/* Floating header — transparent, over the image */}
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
              onClick={() => toggleFavourite(profile.id)}
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
            <ThemeToggle />
          </div>
        </div>

        {/* Name & info overlay at bottom of image */}
        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex items-center gap-2">
            <h1 style={{ color: '#fff', fontFamily: "'Playfair Display', serif", fontSize: '24px' }}>{profile.name}</h1>
            {profile.verified && <BadgeCheck size={20} style={{ color: colors.primary, filter: `drop-shadow(0 0 4px ${colors.glowColor})` }} />}
          </div>
          <div className="mt-1 flex items-center gap-3">
            <span className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
              <MapPin size={14} /> {profile.city}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>•</span>
            {profile.age > 0 && (
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
                {profile.age} years
              </span>
            )}
            <span className="flex items-center gap-1" style={{ color: colors.primary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
              <Star size={12} fill={colors.primary} /> {profile.rating}
            </span>
          </div>
        </div>
      </div>

      <div className="imitr-page-enter px-5 pb-8 pt-5">
        {/* Stats */}
        <div className="imitr-stagger mb-5 grid grid-cols-3 gap-3">
          {[
            { icon: <Clock size={16} />, label: 'Status', value: profile.online ? 'Online' : 'Offline' },
            { icon: <Star size={16} />, label: 'Rating', value: profile.rating.toString() },
            { icon: <Shield size={16} />, label: 'Verified', value: profile.verified ? 'Yes' : 'New' },
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

        {/* Interests */}
        <GlassCard className="mb-5 p-4">
          <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Interests
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((i) => (
              <span
                key={i}
                className="rounded-full px-3 py-1"
                style={{
                  background: `${colors.primary}15`,
                  border: `1px solid ${colors.cardBorder}`,
                  color: colors.primary,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '12px',
                }}
              >
                {i}
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
                  <Coins size={10} className="mr-1 inline" />{MESSAGE_COST_COINS} coins/msg • 50 words max
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Your balance indicator */}
        <div className="mb-4 flex items-center justify-center gap-2 rounded-xl py-2" style={{ background: `${colors.primary}08` }}>
          <Coins size={14} style={{ color: colors.primary }} />
          <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
            Your balance: <span style={{ color: colors.text }}>{coinBalance.toLocaleString()} coins</span>
          </span>
        </div>

        {/* Call Buttons */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <PremiumButton fullWidth onClick={() => {
              if (!isPremium) { requirePremium('Audio Call'); return; }
              navigate(`/pre-call/${profile.id}/audio`);
            }}>
              <span className="flex items-center justify-center gap-2">
                <Phone size={18} /> Audio Call
                {!isPremium && <Lock size={12} />}
              </span>
            </PremiumButton>
            <PremiumButton fullWidth variant="outline" onClick={() => navigate(`/pre-call/${profile.id}/video`)}>
              <span className="flex items-center justify-center gap-2"><Video size={18} /> Video Call</span>
            </PremiumButton>
          </div>
          <PremiumButton fullWidth variant="outline" onClick={() => {
            if (!isPremium) { requirePremium('Messaging'); return; }
            navigate(`/chat/${profile.id}`);
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