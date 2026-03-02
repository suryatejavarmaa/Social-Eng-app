import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Shield,
  Users,
  Briefcase,
  Palette,
  Megaphone,
  Headphones,
  ChevronRight,
  Mail,
  AtSign,
  FileText,
  CheckCircle2,
  Clock,
  Star,
  Coins,
  Diamond,
  Crown,
  Sparkles,
  Send,
  X,
  AlertCircle,
  Phone,
  Video,
  MessageCircle,
  MapPin,
} from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { PremiumInput } from '../../components/imitr/PremiumInput';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

const categories = [
  { id: 'content-creator', label: 'Content Creator', desc: 'Create & manage content for users', icon: Palette },
  { id: 'influencer', label: 'Influencer', desc: 'Leverage your social media presence', icon: Megaphone },
  { id: 'business', label: 'Business Owner', desc: 'Grow your business on IMITR', icon: Briefcase },
  { id: 'community', label: 'Community Manager', desc: 'Build & manage user communities', icon: Users },
  { id: 'entertainer', label: 'Entertainer', desc: 'Perform & engage with audiences', icon: Headphones },
];

const adminPerks = [
  { icon: Users, label: 'Manage Users', desc: 'Onboard and manage creator profiles' },
  { icon: Coins, label: 'Coin Distribution', desc: 'Buy & distribute coins to your users' },
  { icon: Diamond, label: 'Diamond Oversight', desc: 'Monitor diamond earnings & withdrawals' },
  { icon: Star, label: 'Performance Dashboard', desc: 'Track calls, revenue & growth metrics' },
];

const premiumBenefits = [
  { icon: Coins, label: '100 free coins on signup' },
  { icon: Phone, label: 'Audio call access' },
  { icon: Video, label: 'Video call access' },
  { icon: MessageCircle, label: 'Message anyone' },
  { icon: Crown, label: 'Celebrity lounge access' },
  { icon: MapPin, label: 'Location-based filtering' },
  { icon: Diamond, label: 'Min 25 diamonds payout' },
];

const tierComparison = [
  { feature: 'Video Call', free: true, premium: true, icon: Video },
  { feature: 'Audio Call', free: false, premium: true, icon: Phone },
  { feature: 'Messaging', free: false, premium: true, icon: MessageCircle },
  { feature: 'Celebrity Lounge', free: false, premium: true, icon: Crown },
  { feature: 'Location Filtering', free: false, premium: true, icon: MapPin },
  { feature: 'Signup Bonus', free: '—', premium: '100 Coins', icon: Coins },
  { feature: 'Min Diamond Payout', free: '100', premium: '25', icon: Diamond },
];

export function AdminRequestScreen() {
  const { colors, theme } = useTheme();
  const { adminRequest, submitAdminRequest, cancelAdminRequest, userName, userPhone } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(adminRequest ? 4 : 0); // 0=intro, 1=category, 2=details, 3=review, 4=status
  const [selectedCategory, setSelectedCategory] = useState('');
  const [reason, setReason] = useState('');
  const [email, setEmail] = useState('');
  const [socialHandle, setSocialHandle] = useState('');
  const [pitch, setPitch] = useState('');
  const [pitchFocused, setPitchFocused] = useState(false);

  const isDetailsValid = email.includes('@') && pitch.trim().length > 10;

  const handleSubmit = () => {
    submitAdminRequest({
      category: selectedCategory,
      reason,
      email,
      socialHandle,
      pitch,
    });
    setStep(4);
  };

  const handleCancel = () => {
    cancelAdminRequest();
    setStep(0);
    setSelectedCategory('');
    setReason('');
    setEmail('');
    setSocialHandle('');
    setPitch('');
  };

  const selectedCat = categories.find(c => c.id === selectedCategory);

  return (
    <ScreenWrapper noPadding>
      <div className="px-5 pb-24 pt-6 imitr-page-enter">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => {
              if (step === 0 || step === 4) navigate('/settings');
              else setStep(prev => prev - 1);
            }}
            className="imitr-ripple flex h-10 w-10 items-center justify-center rounded-2xl"
            style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}
          >
            <ArrowLeft size={18} style={{ color: colors.text }} />
          </button>
          <div className="flex-1">
            <h2 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '20px' }}>
              {step === 4 ? 'Application Status' : 'Become a Creator Admin'}
            </h2>
            <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
              {step === 0 ? 'Join the IMITR creator ecosystem' :
               step === 1 ? 'Step 1 of 3 — Choose your category' :
               step === 2 ? 'Step 2 of 3 — Tell us about yourself' :
               step === 3 ? 'Step 3 of 3 — Review & submit' :
               'Your request is being reviewed'}
            </span>
          </div>
          {step > 0 && step < 4 && (
            <div className="flex gap-1">
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: step >= s ? '20px' : '8px',
                    background: step >= s ? colors.primary : `${colors.textSecondary}30`,
                    transition: 'all 0.4s ease',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {/* ═══ STEP 0: INTRO ═══ */}
          {step === 0 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero Card */}
              <GlassCard
                className="relative mb-6 overflow-hidden p-6"
                style={{ boxShadow: `0 8px 40px ${colors.glowColor}` }}
              >
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: `radial-gradient(circle at 80% 20%, ${colors.primary}, transparent 60%)`,
                  }}
                />
                <div className="relative">
                  <div
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                    style={{
                      background: colors.buttonGradient,
                      boxShadow: `0 4px 24px ${colors.glowColor}`,
                    }}
                  >
                    <Shield size={28} style={{ color: colors.buttonText }} />
                  </div>
                  <h3
                    className="mb-2"
                    style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '22px' }}
                  >
                    Unlock Creator Admin Powers
                  </h3>
                  <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px', lineHeight: '1.6' }}>
                    As a Creator Admin, you'll manage users, distribute coins, oversee diamond earnings, and build your own creator community within the IMITR ecosystem.
                  </p>
                </div>
              </GlassCard>

              {/* Admin Perks */}
              <p
                className="mb-3"
                style={{
                  color: colors.textSecondary,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                What you'll get
              </p>
              <div className="mb-6 grid grid-cols-2 gap-3">
                {adminPerks.map((perk, i) => {
                  const Icon = perk.icon;
                  return (
                    <motion.div
                      key={perk.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <GlassCard className="p-4">
                        <div
                          className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                          style={{ background: `${colors.primary}15` }}
                        >
                          <Icon size={18} style={{ color: colors.primary }} />
                        </div>
                        <span
                          className="mb-1 block"
                          style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}
                        >
                          {perk.label}
                        </span>
                        <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>
                          {perk.desc}
                        </span>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>

              {/* ── Premium Benefits (checklist style) ── */}
              <GlassCard className="mb-6 overflow-hidden p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles size={16} style={{ color: colors.primary }} />
                  <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    Premium Benefits
                  </span>
                </div>
                <div className="space-y-0">
                  {premiumBenefits.map((benefit, i) => {
                    const BIcon = benefit.icon;
                    return (
                      <div
                        key={benefit.label}
                        className="flex items-center gap-3 py-3"
                        style={i < premiumBenefits.length - 1 ? { borderBottom: `1px solid ${colors.cardBorder}` } : {}}
                      >
                        <div
                          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                          style={{ background: `${colors.primary}12` }}
                        >
                          <BIcon size={15} style={{ color: colors.primary, opacity: 0.8 }} />
                        </div>
                        <span className="flex-1" style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                          {benefit.label}
                        </span>
                        <div
                          className="flex h-5 w-5 items-center justify-center rounded-full"
                          style={{ background: `${colors.success}20` }}
                        >
                          <CheckCircle2 size={12} style={{ color: colors.success }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

              {/* ── Free vs Premium Comparison Table ── */}
              <GlassCard className="mb-6 overflow-hidden">
                {/* Table Header */}
                <div
                  className="flex items-center px-5 py-3"
                  style={{ background: `${colors.primary}08`, borderBottom: `1px solid ${colors.cardBorder}` }}
                >
                  <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px', flex: 1, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    Feature
                  </span>
                  <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px', width: '56px', textAlign: 'center', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    Free
                  </span>
                  <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '11px', width: '72px', textAlign: 'center', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    Premium
                  </span>
                </div>

                {/* Table Rows */}
                {tierComparison.map((row, i) => {
                  const RowIcon = row.icon;
                  return (
                    <div
                      key={row.feature}
                      className="flex items-center px-5 py-3"
                      style={i < tierComparison.length - 1 ? { borderBottom: `1px solid ${colors.cardBorder}` } : {}}
                    >
                      <div className="flex flex-1 items-center gap-2.5">
                        <RowIcon size={14} style={{ color: colors.primary, opacity: 0.7 }} />
                        <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                          {row.feature}
                        </span>
                      </div>
                      {/* Free column */}
                      <div className="flex w-14 items-center justify-center">
                        {typeof row.free === 'boolean' ? (
                          row.free ? (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: `${colors.success}20` }}>
                              <CheckCircle2 size={12} style={{ color: colors.success }} />
                            </div>
                          ) : (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: `${colors.danger}15` }}>
                              <X size={12} style={{ color: colors.danger }} />
                            </div>
                          )
                        ) : (
                          <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>{row.free}</span>
                        )}
                      </div>
                      {/* Premium column */}
                      <div className="flex w-[72px] items-center justify-center">
                        {typeof row.premium === 'boolean' ? (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: `${colors.success}20` }}>
                            <CheckCircle2 size={12} style={{ color: colors.success }} />
                          </div>
                        ) : (
                          <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>{row.premium}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </GlassCard>

              {/* How it works */}
              <GlassCard className="mb-6 p-4">
                <p
                  className="mb-3"
                  style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
                >
                  How it works
                </p>
                {[
                  { num: '1', text: 'Choose your category & fill in your details' },
                  { num: '2', text: 'Submit your application for review' },
                  { num: '3', text: 'Super Admin reviews & approves your request' },
                  { num: '4', text: 'Get your Admin panel access & start managing!' },
                ].map((item, i) => (
                  <div
                    key={item.num}
                    className="flex items-center gap-3 py-2.5"
                    style={i < 3 ? { borderBottom: `1px solid ${colors.cardBorder}` } : {}}
                  >
                    <div
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
                      style={{ background: `${colors.primary}20`, color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}
                    >
                      {item.num}
                    </div>
                    <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </GlassCard>

              <PremiumButton fullWidth onClick={() => setStep(1)}>
                <span className="flex items-center justify-center gap-2">
                  <Sparkles size={16} />
                  Start Application
                  <ChevronRight size={16} />
                </span>
              </PremiumButton>
            </motion.div>
          )}

          {/* ═══ STEP 1: CATEGORY ═══ */}
          {step === 1 && (
            <motion.div
              key="category"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <p
                className="mb-4"
                style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '15px' }}
              >
                What best describes you?
              </p>

              <div className="mb-6 space-y-3">
                {categories.map((cat, i) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <GlassCard
                        className="flex items-center gap-4 p-4"
                        onClick={() => setSelectedCategory(cat.id)}
                        style={{
                          borderColor: isSelected ? colors.primary : colors.cardBorder,
                          boxShadow: isSelected ? `0 0 20px ${colors.glowColor}` : 'none',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <div
                          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl transition-all"
                          style={{
                            background: isSelected ? colors.buttonGradient : `${colors.primary}12`,
                            boxShadow: isSelected ? `0 4px 16px ${colors.glowColor}` : 'none',
                          }}
                        >
                          <Icon size={20} style={{ color: isSelected ? colors.buttonText : colors.primary }} />
                        </div>
                        <div className="flex-1">
                          <span
                            className="block"
                            style={{ color: isSelected ? colors.primary : colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px', transition: 'color 0.3s' }}
                          >
                            {cat.label}
                          </span>
                          <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                            {cat.desc}
                          </span>
                        </div>
                        <div
                          className="flex h-6 w-6 items-center justify-center rounded-full transition-all"
                          style={{
                            border: `2px solid ${isSelected ? colors.primary : colors.textSecondary + '40'}`,
                            background: isSelected ? colors.primary : 'transparent',
                          }}
                        >
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="h-2.5 w-2.5 rounded-full bg-white"
                            />
                          )}
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>

              {/* Optional reason */}
              <PremiumInput
                label="Why do you want to be an admin? (optional)"
                placeholder="I want to build a community of..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                icon={<FileText size={16} />}
                className="mb-6"
              />

              <PremiumButton fullWidth onClick={() => setStep(2)} disabled={!selectedCategory}>
                <span className="flex items-center justify-center gap-2">
                  Continue
                  <ChevronRight size={16} />
                </span>
              </PremiumButton>
            </motion.div>
          )}

          {/* ═══ STEP 2: DETAILS ═══ */}
          {step === 2 && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <p
                className="mb-1"
                style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '15px' }}
              >
                Tell us about yourself
              </p>
              <p
                className="mb-5"
                style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}
              >
                This helps the Super Admin evaluate your application
              </p>

              {/* Auto-filled info */}
              <GlassCard className="mb-5 p-4">
                <p className="mb-2" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Auto-filled from your profile
                </p>
                <div className="flex items-center justify-between py-1">
                  <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>Name</span>
                  <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>{userName}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>Phone</span>
                  <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>{userPhone}</span>
                </div>
              </GlassCard>

              <PremiumInput
                label="Email Address"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={16} />}
                type="email"
                className="mb-4"
              />

              <PremiumInput
                label="Social Media Handle (optional)"
                placeholder="@yourusername"
                value={socialHandle}
                onChange={(e) => setSocialHandle(e.target.value)}
                icon={<AtSign size={16} />}
                className="mb-4"
              />

              {/* Pitch textarea */}
              <div className="mb-6">
                <label
                  className="mb-2 block"
                  style={{
                    color: pitchFocused ? colors.primary : colors.textSecondary,
                    fontFamily: "'Inter', sans-serif",
                    transition: 'color 0.3s ease',
                  }}
                >
                  Your Pitch (min 10 characters)
                </label>
                <div
                  className="rounded-2xl px-4 py-3.5"
                  style={{
                    background: colors.inputBg,
                    backdropFilter: 'blur(16px)',
                    border: `1px solid ${pitchFocused ? colors.primary : colors.border}`,
                    transition: 'all 0.3s ease',
                    boxShadow: pitchFocused ? `0 0 0 2px ${colors.glowColor}, 0 0 20px ${colors.glowColor}` : 'none',
                  }}
                >
                  <textarea
                    placeholder="Tell the Super Admin why you'd be a great Creator Admin. Share your experience, audience size, content plans..."
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    onFocus={() => setPitchFocused(true)}
                    onBlur={() => setPitchFocused(false)}
                    rows={4}
                    className="w-full resize-none bg-transparent outline-none"
                    style={{
                      color: colors.text,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span style={{ color: pitch.trim().length >= 10 ? colors.success : colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>
                    {pitch.trim().length >= 10 ? 'Looks good!' : `${10 - pitch.trim().length} more characters needed`}
                  </span>
                  <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>
                    {pitch.length} chars
                  </span>
                </div>
              </div>

              <PremiumButton fullWidth onClick={() => setStep(3)} disabled={!isDetailsValid}>
                <span className="flex items-center justify-center gap-2">
                  Review Application
                  <ChevronRight size={16} />
                </span>
              </PremiumButton>
            </motion.div>
          )}

          {/* ═══ STEP 3: REVIEW ═══ */}
          {step === 3 && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <p
                className="mb-5"
                style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '15px' }}
              >
                Review your application
              </p>

              <GlassCard className="mb-4 overflow-hidden">
                {/* Category */}
                <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${colors.primary}15` }}>
                    {selectedCat && <selectedCat.icon size={18} style={{ color: colors.primary }} />}
                  </div>
                  <div>
                    <span className="block" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Category
                    </span>
                    <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                      {selectedCat?.label}
                    </span>
                  </div>
                </div>

                {/* Applicant */}
                <div className="p-4" style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                  <span className="mb-2 block" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Applicant
                  </span>
                  <div className="space-y-1.5">
                    {[
                      { label: 'Name', value: userName },
                      { label: 'Phone', value: userPhone },
                      { label: 'Email', value: email },
                      ...(socialHandle ? [{ label: 'Social', value: socialHandle }] : []),
                    ].map(row => (
                      <div key={row.label} className="flex items-center justify-between">
                        <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>{row.label}</span>
                        <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pitch */}
                <div className="p-4" style={reason ? { borderBottom: `1px solid ${colors.cardBorder}` } : {}}>
                  <span className="mb-1.5 block" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Your Pitch
                  </span>
                  <p style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px', lineHeight: '1.5' }}>
                    {pitch}
                  </p>
                </div>

                {/* Reason */}
                {reason && (
                  <div className="p-4">
                    <span className="mb-1.5 block" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Reason
                    </span>
                    <p style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px', lineHeight: '1.5' }}>
                      {reason}
                    </p>
                  </div>
                )}
              </GlassCard>

              {/* Terms notice */}
              <GlassCard className="mb-6 flex items-start gap-3 p-4">
                <AlertCircle size={16} style={{ color: colors.primary, flexShrink: 0, marginTop: '2px' }} />
                <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px', lineHeight: '1.5' }}>
                  By submitting, you agree to IMITR's Creator Admin Terms. Your application will be reviewed by the Super Admin team within 24-48 hours. You'll receive a notification once a decision is made.
                </p>
              </GlassCard>

              <PremiumButton fullWidth onClick={handleSubmit}>
                <span className="flex items-center justify-center gap-2">
                  <Send size={16} />
                  Submit Application
                </span>
              </PremiumButton>
            </motion.div>
          )}

          {/* ═══ STEP 4: STATUS (after submission) ═══ */}
          {step === 4 && adminRequest && (
            <motion.div
              key="status"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Status Hero */}
              <GlassCard
                className="relative mb-6 overflow-hidden p-6 text-center"
                style={{ boxShadow: `0 8px 40px ${colors.glowColor}` }}
              >
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: `radial-gradient(circle at 50% 30%, ${
                      adminRequest.status === 'pending' ? colors.primary :
                      adminRequest.status === 'approved' ? colors.success : colors.danger
                    }, transparent 60%)`,
                  }}
                />
                <div className="relative">
                  {/* Animated icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full"
                    style={{
                      background: adminRequest.status === 'pending'
                        ? `${colors.primary}20`
                        : adminRequest.status === 'approved'
                        ? `${colors.success}20`
                        : `${colors.danger}20`,
                      boxShadow: `0 0 40px ${
                        adminRequest.status === 'pending' ? colors.glowColor :
                        adminRequest.status === 'approved' ? colors.success + '40' : colors.danger + '40'
                      }`,
                    }}
                  >
                    {adminRequest.status === 'pending' ? (
                      <Clock size={36} style={{ color: colors.primary }} className="animate-pulse" />
                    ) : adminRequest.status === 'approved' ? (
                      <CheckCircle2 size={36} style={{ color: colors.success }} />
                    ) : (
                      <X size={36} style={{ color: colors.danger }} />
                    )}
                  </motion.div>

                  <h3
                    className="mb-2"
                    style={{
                      color: adminRequest.status === 'pending' ? colors.primary :
                             adminRequest.status === 'approved' ? colors.success : colors.danger,
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '22px',
                    }}
                  >
                    {adminRequest.status === 'pending' ? 'Application Submitted!' :
                     adminRequest.status === 'approved' ? 'Application Approved!' :
                     'Application Declined'}
                  </h3>
                  <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px', lineHeight: '1.6' }}>
                    {adminRequest.status === 'pending'
                      ? 'Your request has been sent to the Super Admin for review. You will be notified once a decision is made.'
                      : adminRequest.status === 'approved'
                      ? 'Congratulations! You now have Creator Admin access. Check your admin dashboard.'
                      : 'Unfortunately your application was not approved at this time. You can reapply later.'}
                  </p>
                </div>
              </GlassCard>

              {/* Application details */}
              <GlassCard className="mb-6 overflow-hidden">
                <div className="flex items-center justify-between p-4" style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                  <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>Status</span>
                  <span
                    className="rounded-full px-3 py-1"
                    style={{
                      background: adminRequest.status === 'pending' ? `${colors.primary}20` :
                                  adminRequest.status === 'approved' ? `${colors.success}20` : `${colors.danger}20`,
                      color: adminRequest.status === 'pending' ? colors.primary :
                             adminRequest.status === 'approved' ? colors.success : colors.danger,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {adminRequest.status === 'pending' ? 'Under Review' :
                     adminRequest.status === 'approved' ? 'Approved' : 'Rejected'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4" style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                  <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>Category</span>
                  <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                    {categories.find(c => c.id === adminRequest.category)?.label || adminRequest.category}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4" style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                  <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>Submitted</span>
                  <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>{adminRequest.submittedAt}</span>
                </div>
                <div className="flex items-center justify-between p-4">
                  <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>Est. Review</span>
                  <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>24-48 hours</span>
                </div>
              </GlassCard>

              {/* Timeline */}
              <GlassCard className="mb-6 p-4">
                <p className="mb-3" style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                  Application Timeline
                </p>
                {[
                  { label: 'Application Submitted', done: true, time: adminRequest.submittedAt },
                  { label: 'Under Super Admin Review', done: adminRequest.status !== 'pending', time: adminRequest.status !== 'pending' ? 'Completed' : 'In progress...' },
                  { label: 'Decision & Notification', done: adminRequest.status === 'approved' || adminRequest.status === 'rejected', time: adminRequest.status === 'approved' ? 'Approved' : adminRequest.status === 'rejected' ? 'Rejected' : 'Pending' },
                  { label: 'Admin Panel Access', done: adminRequest.status === 'approved', time: adminRequest.status === 'approved' ? 'Granted' : '—' },
                ].map((item, i) => (
                  <div key={item.label} className="flex gap-3">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded-full"
                        style={{
                          background: item.done ? colors.primary : `${colors.textSecondary}20`,
                          boxShadow: item.done ? `0 0 8px ${colors.glowColor}` : 'none',
                        }}
                      >
                        {item.done ? (
                          <CheckCircle2 size={12} style={{ color: colors.buttonText }} />
                        ) : (
                          <div className="h-2 w-2 rounded-full" style={{ background: colors.textSecondary + '50' }} />
                        )}
                      </div>
                      {i < 3 && (
                        <div
                          className="w-0.5 flex-1"
                          style={{
                            background: item.done ? colors.primary : `${colors.textSecondary}20`,
                            minHeight: '24px',
                          }}
                        />
                      )}
                    </div>
                    <div className="pb-4">
                      <span className="block" style={{ color: item.done ? colors.text : colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                        {item.label}
                      </span>
                      <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </GlassCard>

              {/* Actions */}
              <div className="space-y-3">
                {adminRequest.status === 'approved' && (
                  <PremiumButton fullWidth onClick={() => navigate('/admin/dashboard')}>
                    <span className="flex items-center justify-center gap-2">
                      <Crown size={16} />
                      Go to Admin Panel
                    </span>
                  </PremiumButton>
                )}
                <PremiumButton fullWidth variant="outline" onClick={() => navigate('/settings')}>
                  <span className="flex items-center justify-center gap-2">
                    <ArrowLeft size={16} />
                    Back to Settings
                  </span>
                </PremiumButton>
                {adminRequest.status === 'pending' && (
                  <PremiumButton fullWidth variant="danger" onClick={handleCancel}>
                    <span className="flex items-center justify-center gap-2">
                      <X size={16} />
                      Cancel Application
                    </span>
                  </PremiumButton>
                )}
                {adminRequest.status === 'rejected' && (
                  <PremiumButton fullWidth onClick={handleCancel}>
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles size={16} />
                      Reapply
                    </span>
                  </PremiumButton>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScreenWrapper>
  );
}