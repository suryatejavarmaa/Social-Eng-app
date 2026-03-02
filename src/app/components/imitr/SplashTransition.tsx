import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';

interface SplashTransitionProps {
  onComplete: () => void;
}

export function SplashTransition({ onComplete }: SplashTransitionProps) {
  const { colors } = useTheme();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return p + 2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      key="splash"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex w-full flex-col items-center justify-center px-6"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 150 }}
        className="imitr-breathe mb-6 flex h-24 w-24 items-center justify-center rounded-3xl"
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
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          fontFamily: "'Playfair Display', serif",
          color: colors.text,
          fontSize: '36px',
          letterSpacing: '4px',
        }}
      >
        IMITR
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-2"
        style={{
          color: colors.textSecondary,
          fontFamily: "'Inter', sans-serif",
          fontSize: '14px',
          letterSpacing: '2px',
        }}
      >
        Connect. Talk. Earn.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scaleX: 0.5 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 w-48"
      >
        <div
          className="h-1 overflow-hidden rounded-full"
          style={{ background: `${colors.primary}15` }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: colors.buttonGradient }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-3 text-center"
          style={{
            color: colors.textSecondary,
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
          }}
        >
          Loading your experience...
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
