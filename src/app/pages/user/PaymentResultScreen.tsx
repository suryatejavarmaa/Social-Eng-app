import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { CheckCircle, Coins, Home, Sparkles } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

export function PaymentResultScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { coinBalance, transactions } = useApp();

  // Get the most recent recharge
  const lastRecharge = transactions.find(t => t.type === 'recharge');

  return (
    <ScreenWrapper className="flex min-h-screen flex-col items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
          <div className="relative mx-auto mb-4 inline-block">
            <CheckCircle size={72} style={{ color: colors.success, filter: `drop-shadow(0 0 16px ${colors.success})` }} />
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -right-2 -top-2"
            >
              <Sparkles size={20} style={{ color: colors.primary }} />
            </motion.div>
          </div>
        </motion.div>

        <h1 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '26px' }}>
          Payment Successful!
        </h1>
        <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '14px', marginTop: '8px' }}>
          Coins have been added to your wallet
        </p>

        <GlassCard className="mx-auto mt-6 p-5 imitr-fade-scale">
          {lastRecharge && (
            <div className="mb-3 flex items-center justify-between">
              <span style={{ color: colors.textSecondary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>Coins Added</span>
              <span className="flex items-center gap-1 imitr-counter" style={{ color: colors.primary, fontSize: '16px', fontFamily: "'Playfair Display', serif" }}>
                <Coins size={14} /> +{lastRecharge.amount.toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between" style={{ borderTop: `1px solid ${colors.cardBorder}`, paddingTop: '12px' }}>
            <span style={{ color: colors.textSecondary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>New Balance</span>
            <span className="imitr-counter" style={{ color: colors.text, fontSize: '16px', fontFamily: "'Playfair Display', serif" }}>
              {coinBalance.toLocaleString()} coins
            </span>
          </div>
        </GlassCard>

        <PremiumButton fullWidth onClick={() => navigate('/home')} className="mt-8">
          <span className="flex items-center justify-center gap-2"><Home size={16} /> Back to Home</span>
        </PremiumButton>
      </motion.div>
    </ScreenWrapper>
  );
}
