import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star, Phone, ArrowRight, Shield,
  AlertCircle, Sparkles, ArrowLeft, User, Mail, UserX,
  MapPin, Calendar, Globe, Award, Instagram,
  Camera, ImagePlus, X, Users2, Briefcase, Youtube, Twitter, Video, Mic, Handshake, Radio,
} from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { PremiumInput } from '../../components/imitr/PremiumInput';
import { OTPInput } from '../../components/imitr/OTPInput';
import { ThemeToggle } from '../../components/imitr/ThemeToggle';
import { PremiumSelect } from '../../components/imitr/PremiumSelect';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { SplashTransition } from '../../components/imitr/SplashTransition';

type LoginStep = 'phone' | 'not-found' | 'otp' | 'profile-setup' | 'splash';

export function CelebLoginScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { checkPhoneForLogin, verifyLoginOTP, markProfileCompleted, updateCelebrity } = useApp();

  const [step, setStep] = useState<LoginStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchedId, setMatchedId] = useState('');
  const [matchedName, setMatchedName] = useState('');
  const [profileCompleted, setProfileCompleted] = useState(false);

  // Profile setup
  const [displayName, setDisplayName] = useState('');
  const [celebAge, setCelebAge] = useState('');
  const [celebCity, setCelebCity] = useState('');
  const [celebGender, setCelebGender] = useState<'Male' | 'Female' | 'Other' | ''>('');
  const [celebCategory, setCelebCategory] = useState('');
  const [celebSpeciality, setCelebSpeciality] = useState('');
  const [celebBio, setCelebBio] = useState('');
  const [celebLanguages, setCelebLanguages] = useState('');
  const [celebInstagram, setCelebInstagram] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [celebImage, setCelebImage] = useState<string>('');
  const [celebExperience, setCelebExperience] = useState('');
  const [celebYoutube, setCelebYoutube] = useState('');
  const [celebTwitter, setCelebTwitter] = useState('');
  const [celebAvailableFor, setCelebAvailableFor] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const SUPER_ADMIN_EMAIL = 'superadmin@imitr.com';

  const handleSendOTP = useCallback(() => {
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = checkPhoneForLogin(phoneNumber, 'CELEBRITY');
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
    if (!celebAge || parseInt(celebAge) < 16 || parseInt(celebAge) > 80) {
      setError('Please enter a valid age (16-80)');
      return;
    }
    if (!celebCity.trim()) {
      setError('City is required');
      return;
    }
    if (!celebGender) {
      setError('Please select your gender');
      return;
    }
    if (!celebCategory) {
      setError('Please select your category');
      return;
    }
    setError('');
    setSavingProfile(true);
    setTimeout(() => {
      const updateData: any = {
        name: displayName,
        age: parseInt(celebAge),
        city: celebCity.trim(),
        gender: celebGender as 'Male' | 'Female' | 'Other',
        category: celebCategory,
        speciality: celebSpeciality.trim(),
        bio: celebBio.trim(),
        languages: celebLanguages.split(',').map(l => l.trim()).filter(Boolean),
        instagram: celebInstagram.trim(),
        isPremium: true,
        tags: [celebCategory, ...(celebSpeciality ? [celebSpeciality] : [])],
        experience: celebExperience ? parseInt(celebExperience) : undefined,
        youtube: celebYoutube.trim(),
        twitter: celebTwitter.trim(),
        availableFor: celebAvailableFor,
      };
      if (celebImage) {
        updateData.image = celebImage;
      }
      updateCelebrity(matchedId, updateData);
      markProfileCompleted('CELEBRITY', matchedId);
      setSavingProfile(false);
      setStep('splash');
    }, 1200);
  }, [displayName, matchedId, markProfileCompleted, updateCelebrity, celebAge, celebCity, celebGender, celebCategory, celebSpeciality, celebBio, celebLanguages, celebInstagram, celebImage, celebExperience, celebYoutube, celebTwitter, celebAvailableFor]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCelebImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

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
                <Star size={28} style={{ color: colors.buttonText }} />
              </div>
              <h1 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '26px' }}>
                Celebrity Login
              </h1>
              <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '14px', marginTop: '4px' }}>
                Sign in with your registered phone number
              </p>
            </div>

            <GlassCard className="p-6">
              <div className="flex flex-col gap-4">
                <PremiumInput
                  label="Phone Number"
                  placeholder="+91 99887 76601"
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
                    Only Super Admin approved celebrity accounts can log in. No self-registration is available.
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
                {"Not a celebrity? "}
                <span style={{ color: colors.primary }}>Go Back</span>
              </button>
              <a
                href={`mailto:${SUPER_ADMIN_EMAIL}?subject=Celebrity%20Account%20Request%20-%20IMITR&body=Hi%20Super%20Admin%2C%0A%0AI%20would%20like%20to%20request%20a%20Celebrity%20account%20on%20IMITR.%0A%0AName%3A%20%0APhone%3A%20%0ACategory%3A%20%0A%0AThank%20you.`}
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
                No celebrity account found for <strong style={{ color: colors.primary }}>{phoneNumber}</strong>
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
                      {error || 'Celebrity accounts can only be created by the Super Admin.'}
                    </p>
                    <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                      Self-registration is not available for celebrity accounts. Please contact the Super Admin to get onboarded.
                    </p>
                  </div>
                </div>

                {/* Contact Super Admin via Email */}
                <a
                  href={`mailto:${SUPER_ADMIN_EMAIL}?subject=Celebrity%20Account%20Request%20-%20IMITR&body=Hi%20Super%20Admin%2C%0A%0AI%20would%20like%20to%20request%20a%20Celebrity%20account%20on%20IMITR.%0A%0AName%3A%20%0APhone%3A%20${encodeURIComponent(phoneNumber)}%0ACategory%3A%20%0A%0AThank%20you.`}
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

        {/* ─── Step 3: First-Time Profile Setup (Expanded) ─── */}
        {step === 'profile-setup' && (
          <motion.div
            key="profile-setup"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm px-4"
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div className="mb-5 text-center">
              <div
                className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: colors.buttonGradient, boxShadow: `0 4px 20px ${colors.glowColor}` }}
              >
                <Star size={24} style={{ color: colors.buttonText }} />
              </div>
              <h1 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '22px' }}>
                Complete Your Profile
              </h1>
              <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', marginTop: '4px' }}>
                Welcome, <strong style={{ color: colors.primary }}>{matchedName}</strong>! Set up your celebrity profile.
              </p>
            </div>

            <GlassCard className="p-5">
              <div className="flex flex-col gap-3.5">
                {/* Display Name */}
                <PremiumInput
                  label="Display Name *"
                  placeholder="Your stage/display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  icon={<User size={18} />}
                />

                {/* Age & City — side by side */}
                <div className="grid grid-cols-2 gap-3">
                  <PremiumInput
                    label="Age *"
                    placeholder="e.g. 28"
                    value={celebAge}
                    onChange={(e) => setCelebAge(e.target.value.replace(/\D/g, '').slice(0, 2))}
                    icon={<Calendar size={16} />}
                  />
                  <PremiumInput
                    label="City *"
                    placeholder="e.g. Mumbai"
                    value={celebCity}
                    onChange={(e) => setCelebCity(e.target.value)}
                    icon={<MapPin size={16} />}
                  />
                </div>

                {/* Gender Select */}
                <PremiumSelect
                  label="Gender *"
                  placeholder="Select gender"
                  value={celebGender}
                  onChange={(val) => setCelebGender(val as any)}
                  icon={<Users2 size={16} />}
                  options={[
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Other', label: 'Other' },
                  ]}
                />

                {/* Category Select */}
                <PremiumSelect
                  label="Category *"
                  placeholder="Select category"
                  value={celebCategory}
                  onChange={(val) => setCelebCategory(val)}
                  icon={<Star size={16} />}
                  options={[
                    { value: 'Actor', label: 'Actor' },
                    { value: 'Actress', label: 'Actress' },
                    { value: 'Singer', label: 'Singer / Musician' },
                    { value: 'Influencer', label: 'Influencer' },
                    { value: 'Athlete', label: 'Athlete' },
                    { value: 'Comedian', label: 'Comedian' },
                    { value: 'Model', label: 'Model' },
                    { value: 'Director', label: 'Director / Producer' },
                    { value: 'Other', label: 'Other' },
                  ]}
                />

                {/* Speciality / Talent */}
                <PremiumInput
                  label="Speciality / Talent"
                  placeholder="e.g. Method Acting, Playback Singing"
                  value={celebSpeciality}
                  onChange={(e) => setCelebSpeciality(e.target.value)}
                  icon={<Award size={16} />}
                />

                {/* Bio */}
                <div>
                  <label style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', marginBottom: '6px', display: 'block' }}>
                    Bio
                  </label>
                  <textarea
                    placeholder="Tell your fans about yourself..."
                    value={celebBio}
                    onChange={(e) => setCelebBio(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-xl px-4 py-3"
                    style={{
                      background: colors.cardBg,
                      color: colors.text,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '14px',
                      border: `1px solid ${colors.cardBorder}`,
                      outline: 'none',
                      backdropFilter: 'blur(12px)',
                    }}
                  />
                </div>

                {/* Languages */}
                <PremiumInput
                  label="Languages"
                  placeholder="Hindi, English, Tamil (comma separated)"
                  value={celebLanguages}
                  onChange={(e) => setCelebLanguages(e.target.value)}
                  icon={<Globe size={16} />}
                />

                {/* Instagram Handle */}
                <PremiumInput
                  label="Instagram Handle"
                  placeholder="@yourhandle"
                  value={celebInstagram}
                  onChange={(e) => setCelebInstagram(e.target.value)}
                  icon={<Instagram size={16} />}
                />

                {/* Experience */}
                <PremiumInput
                  label="Experience (Years)"
                  placeholder="e.g. 5"
                  value={celebExperience}
                  onChange={(e) => setCelebExperience(e.target.value.replace(/\D/g, '').slice(0, 2))}
                  icon={<Briefcase size={16} />}
                />

                {/* YouTube & Twitter — side by side */}
                <div className="grid grid-cols-2 gap-3">
                  <PremiumInput
                    label="YouTube"
                    placeholder="@channel"
                    value={celebYoutube}
                    onChange={(e) => setCelebYoutube(e.target.value)}
                    icon={<Youtube size={16} />}
                  />
                  <PremiumInput
                    label="Twitter / X"
                    placeholder="@handle"
                    value={celebTwitter}
                    onChange={(e) => setCelebTwitter(e.target.value)}
                    icon={<Twitter size={16} />}
                  />
                </div>

                {/* Available For — toggle chips */}
                <div>
                  <label style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', marginBottom: '8px', display: 'block' }}>
                    Available For
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'Video Call', icon: Video },
                      { value: 'Audio Call', icon: Mic },
                      { value: 'Meet & Greet', icon: Handshake },
                      { value: 'Live Session', icon: Radio },
                    ].map((service) => {
                      const isSelected = celebAvailableFor.includes(service.value);
                      const Icon = service.icon;
                      return (
                        <button
                          key={service.value}
                          type="button"
                          onClick={() => {
                            setCelebAvailableFor((prev) =>
                              isSelected
                                ? prev.filter((s) => s !== service.value)
                                : [...prev, service.value]
                            );
                          }}
                          className="flex items-center gap-1.5 rounded-xl px-3 py-2"
                          style={{
                            background: isSelected ? `${colors.primary}20` : colors.cardBg,
                            border: `1px solid ${isSelected ? colors.primary : colors.cardBorder}`,
                            color: isSelected ? colors.primary : colors.textSecondary,
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '11px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: isSelected ? `0 0 8px ${colors.glowColor}` : 'none',
                          }}
                        >
                          <Icon size={12} />
                          {service.value}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Profile Photo Upload */}
                <div>
                  <label style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', marginBottom: '8px', display: 'block' }}>
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-4">
                    <div
                      className="relative flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        width: '80px',
                        height: '80px',
                        background: celebImage ? 'transparent' : `${colors.primary}12`,
                        border: `2px dashed ${celebImage ? colors.primary : colors.cardBorder}`,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {celebImage ? (
                        <>
                          <img
                            src={celebImage}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                          <div
                            className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100"
                            style={{ background: 'rgba(0,0,0,0.5)' }}
                          >
                            <Camera size={20} style={{ color: '#fff' }} />
                          </div>
                        </>
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-1">
                          <ImagePlus size={22} style={{ color: colors.primary }} />
                          <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '8px', letterSpacing: '0.5px' }}>
                            UPLOAD
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5"
                        style={{
                          background: `${colors.primary}15`,
                          border: `1px solid ${colors.primary}30`,
                          color: colors.primary,
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        <Camera size={14} />
                        {celebImage ? 'Change Photo' : 'Choose Photo'}
                      </button>
                      {celebImage && (
                        <button
                          onClick={() => setCelebImage('')}
                          className="flex items-center justify-center gap-1 rounded-xl px-3 py-1.5"
                          style={{
                            background: `${colors.danger}10`,
                            border: `1px solid ${colors.danger}20`,
                            color: colors.danger,
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '11px',
                            cursor: 'pointer',
                          }}
                        >
                          <X size={12} /> Remove
                        </button>
                      )}
                      <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>
                        JPG, PNG up to 5MB. This will be your public profile photo.
                      </span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Premium badge info */}
                <div
                  className="flex items-start gap-2 rounded-xl px-3 py-2.5"
                  style={{ background: `${colors.success}08`, border: `1px solid ${colors.success}15` }}
                >
                  <Sparkles size={14} style={{ color: colors.success, flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                    All celebrity accounts include <strong style={{ color: colors.primary }}>Premium status</strong> with unlimited access to the Celebrity Dashboard.
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
                  disabled={!displayName || displayName.length < 2 || !celebAge || !celebCity || !celebGender || !celebCategory}
                  loading={savingProfile}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles size={16} /> Save & Launch Profile
                  </span>
                </PremiumButton>
              </div>
            </GlassCard>
            <div style={{ height: '24px' }} />
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