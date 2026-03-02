import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Clock, Diamond, Home, CheckCircle } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { DIAMOND_TO_RUPEE } from '../../context/AppContext';

export function WithdrawStatusScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { withdrawRequests } = useApp();

  const latestRequest = withdrawRequests[0];

  return (
    <ScreenWrapper className="flex min-h-screen flex-col items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm text-center">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: `${colors.primary}15`, border: `2px solid ${colors.primary}`, boxShadow: `0 0 24px ${colors.glowColor}` }}
        >
          <Clock size={36} style={{ color: colors.primary }} />
        </motion.div>

        <h1 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '24px' }}>
          Withdrawal Submitted
        </h1>
        <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '14px', marginTop: '8px' }}>
          Your request has been sent to Creator Admin for manual approval
        </p>

        {latestRequest && (
          <GlassCard className="mt-6 p-5 imitr-fade-scale">
            <div className="mb-3 flex items-center justify-between">
              <span style={{ color: colors.textSecondary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>Amount</span>
              <span className="flex items-center gap-1 imitr-counter" style={{ color: colors.primary, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
                <Diamond size={14} /> {latestRequest.diamonds} diamonds
              </span>
            </div>
            <div className="mb-3 flex items-center justify-between" style={{ borderTop: `1px solid ${colors.cardBorder}`, paddingTop: '12px' }}>
              <span style={{ color: colors.textSecondary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>Payout</span>
              <span style={{ color: colors.success, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>₹{latestRequest.amount.toLocaleString()}</span>
            </div>
            <div className="mb-3 flex items-center justify-between" style={{ borderTop: `1px solid ${colors.cardBorder}`, paddingTop: '12px' }}>
              <span style={{ color: colors.textSecondary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>Method</span>
              <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>{latestRequest.method}</span>
            </div>
            <div className="mb-3 flex items-center justify-between" style={{ borderTop: `1px solid ${colors.cardBorder}`, paddingTop: '12px' }}>
              <span style={{ color: colors.textSecondary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>Status</span>
              <span className="flex items-center gap-1 rounded-full px-2 py-0.5" style={{
                background: latestRequest.status === 'paid' ? `${colors.success}20`
                  : latestRequest.status === 'approved' ? '#F59E0B20'
                  : latestRequest.status === 'rejected' ? `${colors.danger}20`
                  : `${colors.primary}20`,
                color: latestRequest.status === 'paid' ? colors.success
                  : latestRequest.status === 'approved' ? '#F59E0B'
                  : latestRequest.status === 'rejected' ? colors.danger
                  : colors.primary,
                fontSize: '12px',
              }}>
                {latestRequest.status === 'paid' ? <CheckCircle size={10} />
                  : latestRequest.status === 'approved' ? <Clock size={10} />
                  : <Clock size={10} />}
                {latestRequest.status === 'paid' ? 'Payment Sent'
                  : latestRequest.status === 'approved' ? 'Approved - Awaiting Payment'
                  : latestRequest.status === 'rejected' ? 'Rejected'
                  : 'Pending Review'}
              </span>
            </div>
            <div className="flex items-center justify-between" style={{ borderTop: `1px solid ${colors.cardBorder}`, paddingTop: '12px' }}>
              <span style={{ color: colors.textSecondary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>Est. Time</span>
              <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>24-48 hours</span>
            </div>
          </GlassCard>
        )}

        <PremiumButton fullWidth onClick={() => navigate('/home')} className="mt-8">
          <span className="flex items-center justify-center gap-2"><Home size={16} /> Back to Home</span>
        </PremiumButton>
      </motion.div>
    </ScreenWrapper>
  );
}