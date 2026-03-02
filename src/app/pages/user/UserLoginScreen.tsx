import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Phone, ArrowRight, Shield,
  AlertCircle, Sparkles, ArrowLeft, CheckCircle, User, Crown, UserPlus,
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

export function UserLoginScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { checkPhoneForLogin, verifyLoginOTP, markProfileCompleted, setUserProfile, assignAdminToUser } = useApp();

  const [step, setStep] = useState<LoginStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchedId, setMatchedId] = useState('');
  const [matchedName, setMatchedName] = useState('');
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [matchedAdminId, setMatchedAdminId] = useState('');
  const [matchedAdminName, setMatchedAdminName] = useState('');

  // Profile setup fields
  const [username, setUsername] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const availableInterests = ['Music', 'Fashion', 'Sports', 'Gaming', 'Travel', 'Food', 'Fitness', 'Tech', 'Movies', 'Comedy', 'Business', 'Art'];

  const handleSendOTP = useCallback(() => {
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = checkPhoneForLogin(phoneNumber, 'USER');
      if (result.success) {
        // Phone found under an admin
        setMatchedId(result.id || '');
        setMatchedName(result.name || '');
        setProfileCompleted(result.profileCompleted || false);
        setMatchedAdminId(result.adminId || '');
        setMatchedAdminName(result.adminName || '');
        setStep('otp');
      } else if (result.error === 'not_found') {
        // Phone not registered under any admin → show sign-up redirect
        setStep('not-found');
      } else {
        setError(result.error || 'Login failed');
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
        // Auto-assign admin if this user was created by an admin
        if (matchedAdminId) {
          assignAdminToUser(matchedAdminId);
        }
        if (profileCompleted) {
          // Existing user → straight to dashboard
          setUserProfile({ name: matchedName, phone: phoneNumber });
          setStep('splash');
        } else {
          // Admin-created user, first login → profile setup
          setUsername(matchedName);
          setStep('profile-setup');
        }
      } else {
        setError(result.error || 'Invalid OTP');
      }
      setLoading(false);
    }, 800);
  }, [phoneNumber, verifyLoginOTP, profileCompleted, matchedName, matchedAdminId, assignAdminToUser, setUserProfile]);

  const handleProfileSave = useCallback(() => {
    if (!username || username.length < 2) {
      setError('Display name must be at least 2 characters');
      return;
    }
    setError('');
    setSavingProfile(true);
    setTimeout(() => {
      markProfileCompleted('USER', matchedId);
      setUserProfile({ name: username, phone: phoneNumber, interests, gender, city });
      setSavingProfile(false);
      setStep('splash');
    }, 1200);
  }, [username, interests, gender, city, phoneNumber, matchedId, markProfileCompleted, setUserProfile]);

  const toggleInterest = (interest: string) => {
    setInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]);
  };

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
                <Users size={28} style={{ color: colors.buttonText }} />
              </div>
              <h1 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '26px' }}>
                User Login
              </h1>
              <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '14px', marginTop: '4px' }}>
                Sign in with your phone number
              </p>
            </div>

            <GlassCard className="p-6">
              <div className="flex flex-col gap-4">
                <PremiumInput
                  label="Phone Number"
                  placeholder="+91 98765 43210"
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
                    Enter your phone number. If your Admin has created your account, you'll receive an OTP. New users can sign up directly.
                  </span>
                </div>

                {error && error !== 'not_found' && (
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
                    Continue <ArrowRight size={18} />
                  </span>
                </PremiumButton>
              </div>
            </GlassCard>

            <div className="mt-5 text-center">
              <button
                onClick={() => navigate('/onboarding/1')}
                style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}
              >
                {"Don't have an account? "}
                <span style={{ color: colors.primary }}>Sign Up</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── Step: Not Found → Sign Up Redirect ─── */}
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
                style={{ background: `${colors.primary}15`, boxShadow: `0 0 30px ${colors.primary}20` }}
              >
                <UserPlus size={28} style={{ color: colors.primary }} />
              </motion.div>
              <h1 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '22px' }}>
                Account Not Found
              </h1>
              <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px', marginTop: '6px' }}>
                No account found for <strong style={{ color: colors.primary }}>{phoneNumber}</strong>
              </p>
            </div>

            <GlassCard className="mb-5 p-5">
              <div className="flex flex-col gap-4">
                {/* Info message */}
                <div
                  className="flex items-start gap-3 rounded-xl px-4 py-3"
                  style={{ background: `${colors.primary}06`, border: `1px solid ${colors.primary}15` }}
                >
                  <Shield size={16} style={{ color: colors.primary, flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px', marginBottom: '4px' }}>
                      This phone number is not registered yet.
                    </p>
                    <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                      You can create a new account by signing up, or ask your Admin to add you to the platform.
                    </p>
                  </div>
                </div>

                {/* Sign Up Button */}
                <PremiumButton
                  fullWidth
                  onClick={() => navigate('/onboarding/1')}
                >
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus size={16} /> Create New Account
                  </span>
                </PremiumButton>

                {/* Try Different Number */}
                <PremiumButton
                  fullWidth
                  variant="outline"
                  onClick={() => { setStep('phone'); setError(''); setPhoneNumber(''); }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Phone size={16} /> Try Different Number
                  </span>
                </PremiumButton>
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
              {/* Show admin info if admin-created user */}
              {matchedAdminName && !profileCompleted && (
                <div
                  className="mx-auto mt-3 flex items-center justify-center gap-2 rounded-full px-3 py-1.5"
                  style={{ background: `${colors.primary}10`, border: `1px solid ${colors.primary}20` }}
                >
                  <Crown size={12} style={{ color: colors.primary }} />
                  <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                    Added by Admin: <strong>{matchedAdminName}</strong>
                  </span>
                </div>
              )}
            </div>

            <GlassCard className="mb-6 p-6">
              <div className="mb-5">
                <OTPInput length={6} onComplete={handleVerifyOTP} />
              </div>

              {/* Demo OTP hint */}
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

        {/* ─── Step 3: First-Time Profile Setup (admin-created users) ─── */}
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
                Set Up Your Account
              </h1>
              <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', marginTop: '4px' }}>
                Welcome, <strong style={{ color: colors.primary }}>{matchedName}</strong>! Complete your profile to get started.
              </p>
              {/* Admin attribution badge */}
              {matchedAdminName && (
                <div
                  className="mx-auto mt-3 flex items-center justify-center gap-2 rounded-full px-3 py-1.5"
                  style={{ background: `${colors.primary}10`, border: `1px solid ${colors.primary}20` }}
                >
                  <Crown size={12} style={{ color: colors.primary }} />
                  <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                    Your Admin: <strong>{matchedAdminName}</strong>
                  </span>
                </div>
              )}
            </div>

            <GlassCard className="p-6">
              <div className="flex flex-col gap-4">
                <PremiumInput
                  label="Display Name"
                  placeholder="Choose your display name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  icon={<User size={18} />}
                />

                <PremiumInput
                  label="City"
                  placeholder="Enter your city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  icon={<Shield size={18} />}
                />

                {/* Gender */}
                <div>
                  <label className="mb-2 block" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>Gender</label>
                  <div className="flex gap-2">
                    {['Male', 'Female', 'Other'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className="flex-1 rounded-xl py-2.5"
                        style={{
                          background: gender === g ? colors.buttonGradient : `${colors.primary}06`,
                          color: gender === g ? colors.buttonText : colors.text,
                          border: `1px solid ${gender === g ? 'transparent' : colors.cardBorder}`,
                          fontFamily: "'Inter', sans-serif", fontSize: '12px',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="mb-2 block" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {availableInterests.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className="rounded-full px-3 py-1.5"
                        style={{
                          background: interests.includes(interest) ? colors.buttonGradient : `${colors.primary}06`,
                          color: interests.includes(interest) ? colors.buttonText : colors.textSecondary,
                          border: `1px solid ${interests.includes(interest) ? 'transparent' : colors.cardBorder}`,
                          fontFamily: "'Inter', sans-serif", fontSize: '11px',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Admin info card in profile setup */}
                {matchedAdminName && (
                  <div
                    className="flex items-center gap-3 rounded-xl p-3"
                    style={{ background: `${colors.primary}06`, border: `1px solid ${colors.primary}15` }}
                  >
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                      style={{ background: colors.buttonGradient }}
                    >
                      <span style={{ color: colors.buttonText, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>
                        {matchedAdminName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <span className="flex items-center gap-1" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>
                        <Crown size={10} /> Your Admin
                      </span>
                      <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px', display: 'block' }}>
                        {matchedAdminName}
                      </span>
                    </div>
                    <CheckCircle size={16} style={{ color: colors.success, marginLeft: 'auto', flexShrink: 0 }} />
                  </div>
                )}

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
                  disabled={!username || username.length < 2}
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
          <SplashTransition onComplete={() => navigate('/home')} />
        )}
      </AnimatePresence>
    </ScreenWrapper>
  );
}