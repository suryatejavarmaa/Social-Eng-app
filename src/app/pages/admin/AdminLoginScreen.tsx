import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield, Phone, ArrowRight,
  AlertCircle, Sparkles, ArrowLeft, User, Building2, Mail, UserX,
} from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { PremiumInput } from '../../components/imitr/PremiumInput';
import { OTPInput } from '../../components/imitr/OTPInput';
import { ThemeToggle } from '../../components/imitr/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { SplashTransition } from '../../components/imitr/SplashTransition';

type LoginStep = 'phone' | 'not-found' | 'otp' | 'profile-setup' | 'splash';

export function AdminLoginScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { checkPhoneForLogin, verifyLoginOTP, markProfileCompleted } = useApp();

  const [step, setStep] = useState<LoginStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchedId, setMatchedId] = useState('');
  const [matchedName, setMatchedName] = useState('');
  const [profileCompleted, setProfileCompleted] = useState(false);

  // Profile setup fields
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const SUPER_ADMIN_EMAIL = 'superadmin@imitr.com';

  const handleSendOTP = useCallback(() => {
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = checkPhoneForLogin(phoneNumber, 'ADMIN');
      if (result.success) {
        setMatchedId(result.id || '');
        setMatchedName(result.name || '');
        setProfileCompleted(result.profileCompleted || false);
        setStep('otp');
      } else {
        // If account not found or suspended, show not-found screen
        if (result.error?.includes('not found') || result.error?.includes('suspended')) {
          setError(result.error || '');
          setStep('not-found');
        } else {
          setError(result.error || 'Login failed');
        }
      }
      setLoading(false);
    }, 1000);
  }, [phoneNumber, checkPhoneForLogin]);

  const handleVerifyOTP = useCallback((otp: string) => {
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = verifyLoginOTP(phoneNumber, otp);
      if (result.success) {
        if (profileCompleted) {
          setStep('splash');
        } else {
          setDisplayName(matchedName);
          setStep('profile-setup');
        }
      } else {
        setError(result.error || 'Invalid OTP');
      }
      setLoading(false);
    }, 800);
  }, [phoneNumber, verifyLoginOTP, profileCompleted, matchedName]);

  const handleProfileSave = useCallback(() => {
    if (!displayName || displayName.length < 2) {
      setError('Display name must be at least 2 characters');
      return;
    }
    setError('');
    setSavingProfile(true);
    setTimeout(() => {
      markProfileCompleted('ADMIN', matchedId);
      setSavingProfile(false);
      setStep('splash');
    }, 1200);
  }, [displayName, matchedId, markProfileCompleted]);

  return (
    <ScreenWrapper className="flex min-h-screen flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {/* ─── Step 1: Phone Number Entry ─── */}
        {step === 'phone' && (
          <motion.div
            key="phone"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm px-4"
          >
            <button
              onClick={() => navigate('/')}
              className="mb-6 flex items-center gap-2"
              style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}
            >
              <ArrowLeft size={16} /> Back to Portal
            </button>

            <div className="mb-8 text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl imitr-breathe"
                style={{ background: colors.buttonGradient, boxShadow: `0 4px 24px ${colors.glowColor}` }}
              >
                <Shield size={28} style={{ color: colors.buttonText }} />
              </div>
              <h1 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '26px' }}>
                Admin Login
              </h1>
              <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '14px', marginTop: '4px' }}>
                Sign in with your registered phone number
              </p>
            </div>

            <GlassCard className="p-6">
              <div className="flex flex-col gap-4">
                <PremiumInput
                  label="Phone Number"
                  placeholder="+91 98765 00001"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  icon={<Phone size={18} />}
                />

                <div
                  className="flex items-start gap-2 rounded-xl px-3 py-2.5"
                  style={{ background: `${colors.primary}06`, border: `1px solid ${colors.primary}15` }}
                >
                  <Shield size={14} style={{ color: colors.primary, flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                    Only Super Admin approved accounts can log in. A 6-digit OTP will be sent to your registered phone number.
                  </span>
                </div>

                {error && (
                  <div
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                    style={{ background: `${colors.danger}10`, border: `1px solid ${colors.danger}20` }}
                  >
                    <AlertCircle size={14} style={{ color: colors.danger, flexShrink: 0 }} />
                    <span style={{ color: colors.danger, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>{error}</span>
                  </div>
                )}

                <PremiumButton
                  fullWidth
                  onClick={handleSendOTP}
                  disabled={!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10}
                  loading={loading}
                >
                  <span className="flex items-center justify-center gap-2">
                    Send OTP <ArrowRight size={18} />
                  </span>
                </PremiumButton>
              </div>
            </GlassCard>

            {/* Contact Super Admin */}
            <div className="mt-5 flex flex-col items-center gap-2">
              <button
                onClick={() => navigate('/')}
                style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}
              >
                {"Not an admin? "}
                <span style={{ color: colors.primary }}>Go Back</span>
              </button>
              <a
                href={`mailto:${SUPER_ADMIN_EMAIL}?subject=Admin%20Account%20Request%20-%20IMITR&body=Hi%20Super%20Admin%2C%0A%0AI%20would%20like%20to%20request%20an%20Admin%20account%20on%20IMITR.%0A%0AName%3A%20%0APhone%3A%20%0AOrganization%3A%20%0A%0AThank%20you.`}
                className="flex items-center gap-1.5"
                style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px', textDecoration: 'none' }}
              >
                <Mail size={12} style={{ color: colors.primary }} />
                <span>Need access? <span style={{ color: colors.primary }}>Contact Super Admin</span></span>
              </a>
            </div>
          </motion.div>
        )}

        {/* ─── Step: Account Not Found ─── */}
        {step === 'not-found' && (
          <motion.div
            key="not-found"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm px-4"
          >
            <div className="mb-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ background: `${colors.danger}15`, boxShadow: `0 0 30px ${colors.danger}20` }}
              >
                <UserX size={28} style={{ color: colors.danger }} />
              </motion.div>
              <h1 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '22px' }}>
                Account Not Found
              </h1>
              <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px', marginTop: '6px' }}>
                No admin account found for <strong style={{ color: colors.primary }}>{phoneNumber}</strong>
              </p>
            </div>

            <GlassCard className="mb-5 p-5">
              <div className="flex flex-col gap-4">
                {/* Explanation */}
                <div
                  className="flex items-start gap-3 rounded-xl px-4 py-3"
                  style={{ background: `${colors.danger}06`, border: `1px solid ${colors.danger}15` }}
                >
                  <Shield size={16} style={{ color: colors.danger, flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px', marginBottom: '4px' }}>
                      {error || 'Admin accounts can only be created by the Super Admin.'}
                    </p>
                    <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                      You cannot create an admin account manually. Please contact the Super Admin to request access.
                    </p>
                  </div>
                </div>

                {/* Contact Super Admin via Email */}
                <a
                  href={`mailto:${SUPER_ADMIN_EMAIL}?subject=Admin%20Account%20Request%20-%20IMITR&body=Hi%20Super%20Admin%2C%0A%0AI%20would%20like%20to%20request%20an%20Admin%20account%20on%20IMITR.%0A%0AName%3A%20%0APhone%3A%20${encodeURIComponent(phoneNumber)}%0AOrganization%3A%20%0A%0AThank%20you.`}
                  className="block w-full"
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5"
                    style={{
                      background: colors.buttonGradient,
                      boxShadow: `0 4px 16px ${colors.glowColor}`,
                      color: colors.buttonText,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    <Mail size={18} />
                    Contact Super Admin
                  </div>
                </a>

                {/* Try Different Number */}
                <button
                  onClick={() => { setStep('phone'); setError(''); setPhoneNumber(''); }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl py-3"
                  style={{
                    background: 'transparent',
                    border: `1px solid ${colors.cardBorder}`,
                    color: colors.text,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '13px',
                  }}
                >
                  <Phone size={16} /> Try Different Number
                </button>
              </div>
            </GlassCard>

            <button
              onClick={() => { setStep('phone'); setError(''); }}
              className="flex w-full items-center justify-center gap-2"
              style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}
            >
              <ArrowLeft size={14} /> Back to Login
            </button>
          </motion.div>
        )}

        {/* ─── Step 2: OTP Verification ─── */}
        {step === 'otp' && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm px-4"
          >
            <div className="mb-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ background: `${colors.primary}15`, border: `1px solid ${colors.primary}25`, boxShadow: `0 0 30px ${colors.primary}20` }}
              >
                <Shield size={28} style={{ color: colors.primary }} />
              </motion.div>
              <h1 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '24px', marginBottom: '8px' }}>
                Verify OTP
              </h1>
              <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                Enter the 6-digit code sent to{' '}
                <strong style={{ color: colors.primary }}>{phoneNumber}</strong>
              </p>
            </div>

            <GlassCard className="mb-6 p-6">
              <div className="mb-5">
                <OTPInput length={6} onComplete={handleVerifyOTP} />
              </div>

              <div
                className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5"
                style={{ background: `${colors.primary}08`, border: `1px solid ${colors.primary}18` }}
              >
                <Sparkles size={14} style={{ color: colors.primary, flexShrink: 0 }} />
                <span style={{ color: colors.primary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
                  Demo Mode: Use OTP <strong>123456</strong>
                </span>
              </div>

              {error && (
                <div
                  className="mt-4 flex items-center gap-2 rounded-xl px-3 py-2.5"
                  style={{ background: `${colors.danger}10`, border: `1px solid ${colors.danger}20` }}
                >
                  <AlertCircle size={14} style={{ color: colors.danger, flexShrink: 0 }} />
                  <span style={{ color: colors.danger, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>{error}</span>
                </div>
              )}
            </GlassCard>

            <button
              onClick={() => { setStep('phone'); setError(''); }}
              className="flex w-full items-center justify-center gap-2"
              style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}
            >
              <ArrowLeft size={14} /> Change Phone Number
            </button>
          </motion.div>
        )}

        {/* ─── Step 3: First-Time Profile Setup ─── */}
        {step === 'profile-setup' && (
          <motion.div
            key="profile-setup"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm px-4"
          >
            <div className="mb-6 text-center">
              <div
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: colors.buttonGradient, boxShadow: `0 4px 20px ${colors.glowColor}` }}
              >
                <User size={24} style={{ color: colors.buttonText }} />
              </div>
              <h1 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '22px' }}>
                Complete Your Profile
              </h1>
              <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', marginTop: '4px' }}>
                Welcome, <strong style={{ color: colors.primary }}>{matchedName}</strong>! Set up your admin profile.
              </p>
            </div>

            <GlassCard className="p-6">
              <div className="flex flex-col gap-4">
                <PremiumInput
                  label="Display Name"
                  placeholder="Your display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  icon={<User size={18} />}
                />

                <PremiumInput
                  label="Email (optional)"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail size={18} />}
                />

                {/* Notification about welcome */}
                <div
                  className="flex items-start gap-2 rounded-xl px-3 py-2.5"
                  style={{ background: `${colors.success}08`, border: `1px solid ${colors.success}15` }}
                >
                  <Sparkles size={14} style={{ color: colors.success, flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                    After setup, you'll have access to your Admin Dashboard where you can manage users, coins, and withdrawals.
                  </span>
                </div>

                {error && (
                  <div
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                    style={{ background: `${colors.danger}10`, border: `1px solid ${colors.danger}20` }}
                  >
                    <AlertCircle size={14} style={{ color: colors.danger, flexShrink: 0 }} />
                    <span style={{ color: colors.danger, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>{error}</span>
                  </div>
                )}

                <PremiumButton
                  fullWidth
                  onClick={handleProfileSave}
                  disabled={!displayName || displayName.length < 2}
                  loading={savingProfile}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles size={16} /> Save & Continue
                  </span>
                </PremiumButton>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ─── Step 4: Splash → Dashboard ─── */}
        {step === 'splash' && (
          <SplashTransition onComplete={() => navigate('/admin/dashboard')} />
        )}
      </AnimatePresence>
    </ScreenWrapper>
  );
}