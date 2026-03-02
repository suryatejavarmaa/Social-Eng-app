import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { OTPInput } from '../../components/imitr/OTPInput';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

export function OTPScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { login, completeOnboarding } = useApp();
  const [timer, setTimer] = useState(30);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const handleVerify = () => {
    if (otp.length < 6) return;
    setVerifying(true);
    setTimeout(() => {
      login();
      completeOnboarding();
      setVerifying(false);
      navigate('/profile-setup');
    }, 1200);
  };

  return (
    <ScreenWrapper className="flex min-h-screen flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl imitr-gold-pulse"
            style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}
          >
            <Shield size={28} style={{ color: colors.primary }} />
          </div>
          <h1 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '24px' }}>
            Verification
          </h1>
          <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '14px', marginTop: '4px' }}>
            Enter the 6-digit code sent to your phone
          </p>
        </div>

        <GlassCard className="p-6 imitr-fade-scale">
          <OTPInput length={6} onComplete={(val) => setOtp(val)} />

          <div className="mt-6 text-center">
            {timer > 0 ? (
              <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                Resend in <span style={{ color: colors.primary }}>{timer}s</span>
              </p>
            ) : (
              <button
                onClick={() => setTimer(30)}
                style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}
              >
                Resend Code
              </button>
            )}
          </div>

          <PremiumButton fullWidth className="mt-6" onClick={handleVerify} disabled={otp.length < 6} loading={verifying}>
            Verify & Continue
          </PremiumButton>
        </GlassCard>
      </motion.div>
    </ScreenWrapper>
  );
}
