import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { useTheme } from '../../context/ThemeContext';

export function WelcomeScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();

  return (
    <ScreenWrapper className="flex min-h-screen flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center px-5"
      >
        <GlassCard className="flex flex-col items-center px-6 py-8">
          <div
            className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl"
            style={{ background: colors.buttonGradient, boxShadow: `0 8px 40px ${colors.glowColor}` }}
          >
            <Sparkles size={36} style={{ color: colors.buttonText }} />
          </div>

          <h1
            className="mb-3"
            style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '30px' }}
          >
            You're All Set!
          </h1>
          <p
            className="mb-6 max-w-xs"
            style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '14px', lineHeight: '1.7' }}
          >
            Welcome to IMITR. Start exploring verified users and begin earning through meaningful conversations.
          </p>

          <PremiumButton onClick={() => navigate('/home')}>
            <span className="flex items-center gap-2">
              Explore Now <ArrowRight size={18} />
            </span>
          </PremiumButton>
        </GlassCard>
      </motion.div>
    </ScreenWrapper>
  );
}