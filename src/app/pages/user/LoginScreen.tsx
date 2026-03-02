import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Phone, ArrowRight } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { PremiumInput } from '../../components/imitr/PremiumInput';
import { ThemeToggle } from '../../components/imitr/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

export function LoginScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { setUserProfile } = useApp();
  const [phone, setPhone] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  const handleContinue = () => {
    if (phone.length !== 10) return;
    if (isSignup && name) {
      setUserProfile({ name, phone: `+91 ${phone}` });
    } else {
      setUserProfile({ phone: `+91 ${phone}` });
    }
    navigate('/otp');
  };

  return (
    <ScreenWrapper className="flex min-h-screen flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl imitr-breathe"
            style={{ background: colors.buttonGradient, boxShadow: `0 4px 24px ${colors.glowColor}` }}
          >
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: colors.buttonText }}>IM</span>
          </div>
          <h1 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '26px' }}>
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '14px', marginTop: '4px' }}>
            {isSignup ? 'Join the premium ecosystem' : 'Sign in to continue'}
          </p>
        </div>

        <GlassCard className="p-6 imitr-fade-scale">
          <div className="flex flex-col gap-4">
            {isSignup && (
              <PremiumInput
                label="Full Name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <div>
              <PremiumInput
                label="Phone Number"
                placeholder="9876543210"
                value={phone}
                onChange={handlePhoneChange}
                type="tel"
                icon={<Phone size={18} />}
              />
              <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px', marginTop: '6px', marginLeft: '2px' }}>
                Enter 10 digit mobile number without +91
              </p>
            </div>
            <PremiumButton fullWidth onClick={handleContinue} disabled={phone.length !== 10 || (isSignup && !name)}>
              <span className="flex items-center justify-center gap-2">
                {isSignup ? 'Sign Up' : 'Sign In'}
                <ArrowRight size={18} />
              </span>
            </PremiumButton>
          </div>
        </GlassCard>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignup(!isSignup)}
            style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}
          >
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <span style={{ color: colors.primary }}>{isSignup ? 'Sign In' : 'Sign Up'}</span>
          </button>
        </div>
      </motion.div>
    </ScreenWrapper>
  );
}