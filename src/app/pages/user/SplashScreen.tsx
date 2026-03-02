import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { useTheme } from '../../context/ThemeContext';

export function SplashScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate('/onboarding/1'), 300);
          return 100;
        }
        return p + 2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <ScreenWrapper className="flex min-h-screen flex-col items-center justify-center px-5">
      <GlassCard className="px-8 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          <div
            className="imitr-breathe mb-4 flex h-24 w-24 items-center justify-center rounded-3xl"
            style={{
              background: colors.buttonGradient,
              boxShadow: `0 8px 40px ${colors.glowColor}`,
            }}
          >
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '32px',
                color: colors.buttonText,
              }}
            >
              IM
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              color: colors.text,
              fontSize: '36px',
              letterSpacing: '4px',
            }}
          >
            IMITR
          </h1>
          <p
            className="mt-2"
            style={{
              color: colors.textSecondary,
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              letterSpacing: '2px',
            }}
          >
            Connect. Talk. Earn.
          </p>

          <div className="mt-12 w-48">
            <div
              className="h-1 overflow-hidden rounded-full"
              style={{ background: colors.cardBg }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: colors.buttonGradient }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      </GlassCard>
    </ScreenWrapper>
  );
}