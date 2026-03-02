import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { Phone, Video, Diamond, Shield, Sparkles, Coins } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { useTheme } from '../../context/ThemeContext';

const slides = [
  {
    id: 1,
    icon: Sparkles,
    title: 'Connect. Talk. Earn.',
    subtitle: 'Welcome to IMITR',
    description: 'A premium communication ecosystem where every conversation holds value. Connect with verified users in a secure, monetized platform.',
  },
  {
    id: 2,
    icon: Coins,
    title: 'Coins & Calls',
    subtitle: 'Your Currency of Connection',
    description: 'Audio calls cost 6 coins per minute. Video calls cost 24 coins per minute. Purchase coins to start meaningful conversations.',
    stats: [
      { icon: Phone, label: 'Audio Call', value: '6 coins/min' },
      { icon: Video, label: 'Video Call', value: '24 coins/min' },
    ],
  },
  {
    id: 3,
    icon: Diamond,
    title: 'Diamonds & Earnings',
    subtitle: 'Turn Conversations into Revenue',
    description: 'Earn diamonds for every call you receive. Audio calls earn 1 diamond. Video calls earn 4 diamonds. Convert diamonds to real money.',
    stats: [
      { icon: Phone, label: 'Audio Earned', value: '1 diamond' },
      { icon: Video, label: 'Video Earned', value: '4 diamonds' },
    ],
  },
  {
    id: 4,
    icon: Shield,
    title: 'Trust & Safety',
    subtitle: 'Enterprise-Grade Security',
    description: 'Every user is verified. Every transaction is logged. Your privacy and security are our highest priority in this controlled ecosystem.',
  },
];

export function OnboardingScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { step } = useParams();
  const currentStep = parseInt(step || '1');
  const slide = slides[currentStep - 1];
  const Icon = slide.icon;

  const handleNext = () => {
    if (currentStep < 4) {
      navigate(`/onboarding/${currentStep + 1}`);
    } else {
      navigate('/profile-setup');
    }
  };

  return (
    <ScreenWrapper noPadding className="flex min-h-screen flex-col">
      {/* Progress dots — fixed at top */}
      <div className="flex justify-center gap-2 px-6 pt-14 pb-8">
        {slides.map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full transition-all duration-500"
            style={{
              width: i < currentStep ? '32px' : '20px',
              background: i < currentStep ? colors.primary : `${colors.primary}30`,
            }}
          />
        ))}
      </div>

      {/* Content — centered in available space */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.4 }}
        className="flex flex-1 flex-col items-center justify-center px-6 text-center"
      >
        {/* Icon container */}
        <div
          className="mb-8 mt-6 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            boxShadow: `0 0 30px ${colors.glowColor}`,
          }}
        >
          <Icon size={28} style={{ color: colors.primary }} />
        </div>

        {/* Text content with GlassCard background */}
        <GlassCard className="mb-6 max-w-[320px] px-6 py-8">
          <p
            className="mb-2"
            style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase' }}
          >
            {slide.subtitle}
          </p>
          <h1
            className="mb-4"
            style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '28px', lineHeight: '1.3' }}
          >
            {slide.title}
          </h1>
          <p
            style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '14px', lineHeight: '1.8' }}
          >
            {slide.description}
          </p>
        </GlassCard>

        {slide.stats && (
          <div className="flex gap-3">
            {slide.stats.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <GlassCard
                  key={i}
                  className="flex flex-col items-center px-5 py-4"
                >
                  <StatIcon size={18} style={{ color: colors.primary, marginBottom: '6px' }} />
                  <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600 }}>
                    {stat.value}
                  </span>
                  <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px', marginTop: '2px' }}>
                    {stat.label}
                  </span>
                </GlassCard>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Bottom buttons — pinned to bottom */}
      <div className="flex items-center gap-3 px-6 pb-10 pt-4">
        {currentStep > 1 && (
          <PremiumButton variant="outline" onClick={() => navigate(`/onboarding/${currentStep - 1}`)}>
            Back
          </PremiumButton>
        )}
        <PremiumButton fullWidth onClick={handleNext}>
          {currentStep < 4 ? 'Continue' : 'Get Started'}
        </PremiumButton>
      </div>
    </ScreenWrapper>
  );
}