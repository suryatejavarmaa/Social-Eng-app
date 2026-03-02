import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Crown, Lock, Sparkles, X, Check, Coins, MapPin, Phone, Video,
  MessageCircle, Diamond, Star, ChevronDown, ChevronUp, XCircle,
  CheckCircle2, ArrowLeft, CreditCard, Smartphone, Building2,
  Wallet, Shield, Zap, Gift, ChevronRight, BadgeCheck, PartyPopper,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

interface PremiumGateOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

type PaymentStep = 'benefits' | 'pricing' | 'gateway' | 'processing' | 'success';

interface PricingPlan {
  id: string;
  name: string;
  duration: string;
  price: number;
  originalPrice?: number;
  perMonth: number;
  badge?: string;
  savings?: string;
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    duration: '1 Month',
    price: 149,
    perMonth: 149,
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    duration: '3 Months',
    price: 349,
    originalPrice: 447,
    perMonth: 116,
    savings: 'Save 22%',
    popular: true,
    badge: 'MOST POPULAR',
  },
  {
    id: 'yearly',
    name: 'Annual',
    duration: '12 Months',
    price: 999,
    originalPrice: 1788,
    perMonth: 83,
    savings: 'Save 44%',
    badge: 'BEST VALUE',
  },
];

interface PaymentMethod {
  id: string;
  name: string;
  desc: string;
  icon: React.ElementType;
  providers?: string[];
}

const paymentMethods: PaymentMethod[] = [
  { id: 'upi', name: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: Smartphone, providers: ['GPay', 'PhonePe', 'Paytm', 'BHIM'] },
  { id: 'card', name: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard, providers: ['Visa', 'Mastercard', 'RuPay'] },
  { id: 'netbanking', name: 'Net Banking', desc: 'All major banks supported', icon: Building2, providers: ['SBI', 'HDFC', 'ICICI', 'Axis'] },
  { id: 'wallet', name: 'Wallets', desc: 'Paytm, Amazon Pay, Mobikwik', icon: Wallet, providers: ['Paytm', 'Amazon', 'Mobikwik'] },
];

/**
 * Full-screen premium upgrade overlay with payment flow
 */
export function PremiumGateOverlay({ isOpen, onClose, feature }: PremiumGateOverlayProps) {
  const { colors, theme } = useTheme();
  const { upgradeToPremium } = useApp();
  const [step, setStep] = React.useState<PaymentStep>('benefits');
  const [showComparison, setShowComparison] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<string>('quarterly');
  const [selectedPayment, setSelectedPayment] = React.useState<string>('');
  const [processingProgress, setProcessingProgress] = React.useState(0);

  // Reset state when overlay opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('benefits');
        setShowComparison(false);
        setSelectedPlan('quarterly');
        setSelectedPayment('');
        setProcessingProgress(0);
      }, 400);
    }
  }, [isOpen]);

  const solidBg = theme === 'night' ? '#022B22' : '#3D0C11';
  const cardSolidBg = theme === 'night' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.08)';

  const currentPlan = plans.find(p => p.id === selectedPlan)!;

  const handleProceedToPayment = () => {
    if (!selectedPayment) return;
    setStep('processing');
    setProcessingProgress(0);

    // Simulate payment processing
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setStep('success');
            upgradeToPremium();
          }, 400);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 300);
  };

  const handleClose = () => {
    if (step === 'success') {
      onClose();
    } else if (step === 'benefits') {
      onClose();
    } else {
      // Go back one step
      if (step === 'pricing') setStep('benefits');
      else if (step === 'gateway') setStep('pricing');
    }
  };

  const handleSuccessClose = () => {
    onClose();
  };

  const perks = [
    { icon: Coins, text: '100 free coins on signup', highlight: true },
    { icon: BadgeCheck, text: 'Premium verified badge', highlight: true },
    { icon: Phone, text: 'Audio call access', highlight: false },
    { icon: Video, text: 'Video call access', highlight: false },
    { icon: MessageCircle, text: 'Message anyone', highlight: false },
    { icon: Crown, text: 'Celebrity lounge access', highlight: false },
    { icon: MapPin, text: 'Location-based filtering', highlight: false },
    { icon: Diamond, text: 'Min 25 diamonds payout', highlight: true },
  ];

  const tierComparison = [
    { feature: 'Video Call', free: true, premium: true, icon: Video },
    { feature: 'Audio Call', free: false, premium: true, icon: Phone },
    { feature: 'Messaging', free: false, premium: true, icon: MessageCircle },
    { feature: 'Verified Badge', free: false, premium: true, icon: BadgeCheck },
    { feature: 'Celebrity Lounge', free: false, premium: true, icon: Crown },
    { feature: 'Location Filtering', free: false, premium: true, icon: MapPin },
    { feature: 'Signup Bonus', free: '—' as string | boolean, premium: '100 Coins' as string | boolean, icon: Coins },
    { feature: 'Min Diamond Payout', free: '100' as string | boolean, premium: '25' as string | boolean, icon: Diamond },
  ];

  /* ─────────── Step: Benefits (original content) ─────────── */
  const renderBenefits = () => (
    <motion.div
      key="benefits"
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.3 }}
      className="flex flex-1 flex-col"
    >
      {/* Hero section */}
      <div className="mb-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
          className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full"
          style={{
            background: colors.buttonGradient,
            boxShadow: `0 8px 40px ${colors.glowColor}, 0 0 60px ${colors.glowColor}40`,
          }}
        >
          <Crown size={40} style={{ color: colors.buttonText }} />
          <div className="pointer-events-none absolute inset-0 rounded-full"
            style={{ border: `2px solid ${colors.primary}40`, transform: 'scale(1.25)' }} />
          <div className="pointer-events-none absolute inset-0 rounded-full"
            style={{ border: `1px solid ${colors.primary}20`, transform: 'scale(1.5)' }} />
        </motion.div>

        <h1 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '28px', marginBottom: '8px' }}>
          Upgrade to Premium
        </h1>

        {feature && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-3 flex items-center gap-2 rounded-full px-4 py-1.5"
            style={{ background: `${colors.danger}20`, border: `1px solid ${colors.danger}30` }}
          >
            <Lock size={13} style={{ color: colors.danger }} />
            <span style={{ color: colors.danger, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
              {feature} requires Premium
            </span>
          </motion.div>
        )}

        <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '14px', maxWidth: '280px' }}>
          Unlock the full IMITR experience with premium features
        </p>
      </div>

      {/* Perks list */}
      <div className="mb-6 rounded-2xl p-5" style={{ background: cardSolidBg, border: `1px solid ${colors.cardBorder}` }}>
        <p className="mb-4" style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          <Sparkles size={12} className="mr-1.5 inline" />
          Premium Benefits
        </p>
        <div className="space-y-3.5">
          {perks.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <motion.div key={perk.text} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }} className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ background: perk.highlight ? `${colors.primary}25` : `${colors.primary}12`, border: perk.highlight ? `1px solid ${colors.primary}40` : 'none' }}>
                  <Icon size={16} style={{ color: colors.primary }} />
                </div>
                <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px', flex: 1 }}>{perk.text}</span>
                <Check size={16} style={{ color: colors.success, filter: `drop-shadow(0 0 4px ${colors.success}50)` }} />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Plan summary cards */}
      <div className="mb-4 overflow-hidden rounded-2xl" style={{ border: `1px solid ${colors.cardBorder}` }}>
        <div className="flex items-center gap-3 p-4" style={{ background: `rgba(255,255,255,0.03)` }}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${colors.textSecondary}20` }}>
            <Lock size={14} style={{ color: colors.textSecondary }} />
          </div>
          <div className="flex-1">
            <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px', display: 'block' }}>Free Plan</span>
            <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px', opacity: 0.7 }}>Video call only &middot; 100 diamond min payout</span>
          </div>
        </div>
        <div style={{ height: '1px', background: colors.cardBorder }} />
        <div className="flex items-center gap-3 p-4" style={{ background: `${colors.primary}08` }}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: colors.buttonGradient }}>
            <Crown size={14} style={{ color: colors.buttonText }} />
          </div>
          <div className="flex-1">
            <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '13px', display: 'block' }}>Premium Plan</span>
            <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '10px', opacity: 0.7 }}>All features &middot; 25 diamond min payout</span>
          </div>
          <div className="flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background: `${colors.success}20` }}>
            <Star size={10} fill={colors.success} style={{ color: colors.success }} />
            <span style={{ color: colors.success, fontFamily: "'Inter', sans-serif", fontSize: '9px' }}>BEST</span>
          </div>
        </div>
      </div>

      {/* Expandable comparison */}
      <button onClick={() => setShowComparison(prev => !prev)}
        className="mx-auto mb-4 flex items-center gap-2 rounded-full px-5 py-2"
        style={{ background: `${colors.primary}10`, border: `1px solid ${colors.primary}30` }}>
        <Sparkles size={13} style={{ color: colors.primary }} />
        <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
          {showComparison ? 'Hide' : 'Show'} Comparison
        </span>
        {showComparison ? <ChevronUp size={14} style={{ color: colors.primary }} /> : <ChevronDown size={14} style={{ color: colors.primary }} />}
      </button>

      <AnimatePresence>
        {showComparison && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden">
            <div className="mb-6 overflow-hidden rounded-2xl" style={{ border: `1px solid ${colors.cardBorder}` }}>
              <div className="flex items-center px-5 py-3" style={{ background: `${colors.primary}08`, borderBottom: `1px solid ${colors.cardBorder}` }}>
                <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px', flex: 1, letterSpacing: '0.8px', textTransform: 'uppercase' }}>Feature</span>
                <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px', width: '56px', textAlign: 'center', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Free</span>
                <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '11px', width: '72px', textAlign: 'center', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Premium</span>
              </div>
              {tierComparison.map((row, i) => {
                const RowIcon = row.icon;
                return (
                  <motion.div key={row.feature} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }} className="flex items-center px-5 py-3.5"
                    style={i < tierComparison.length - 1 ? { borderBottom: `1px solid ${colors.cardBorder}` } : {}}>
                    <div className="flex flex-1 items-center gap-2.5">
                      <RowIcon size={15} style={{ color: colors.primary, opacity: 0.7 }} />
                      <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>{row.feature}</span>
                    </div>
                    <div className="flex w-14 items-center justify-center">
                      {typeof row.free === 'boolean' ? (row.free
                        ? <div className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: `${colors.success}20` }}><CheckCircle2 size={14} style={{ color: colors.success }} /></div>
                        : <div className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: `${colors.danger}15` }}><XCircle size={14} style={{ color: colors.danger }} /></div>
                      ) : <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>{row.free}</span>}
                    </div>
                    <div className="flex w-[72px] items-center justify-center">
                      {typeof row.premium === 'boolean'
                        ? <div className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: `${colors.success}20` }}><CheckCircle2 size={14} style={{ color: colors.success }} /></div>
                        : <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>{row.premium}</span>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1" />

      {/* CTA */}
      <div>
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          onClick={() => setStep('pricing')}
          className="imitr-ripple mb-3 flex w-full items-center justify-center gap-2.5 rounded-2xl py-4"
          style={{ background: colors.buttonGradient, boxShadow: `0 6px 30px ${colors.glowColor}, 0 0 20px ${colors.glowColor}30` }}>
          <Crown size={20} style={{ color: colors.buttonText }} />
          <span style={{ color: colors.buttonText, fontFamily: "'Inter', sans-serif", fontSize: '16px' }}>Activate Premium Now</span>
        </motion.button>
        <button onClick={onClose} className="flex w-full items-center justify-center py-3">
          <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>Maybe later</span>
        </button>
      </div>
    </motion.div>
  );

  /* ─────────── Step: Pricing ─────────── */
  const renderPricing = () => (
    <motion.div
      key="pricing"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.3 }}
      className="flex flex-1 flex-col"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: colors.buttonGradient, boxShadow: `0 6px 30px ${colors.glowColor}` }}
        >
          <Crown size={28} style={{ color: colors.buttonText }} />
        </motion.div>
        <h2 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '24px', marginBottom: '6px' }}>
          Choose Your Plan
        </h2>
        <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
          Select the plan that works best for you
        </p>
      </div>

      {/* Plans */}
      <div className="mb-6 space-y-3">
        {plans.map((plan, i) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <motion.button
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedPlan(plan.id)}
              className="relative w-full overflow-hidden rounded-2xl p-4 text-left"
              style={{
                background: isSelected ? `${colors.primary}15` : cardSolidBg,
                border: `2px solid ${isSelected ? colors.primary : colors.cardBorder}`,
                transition: 'all 0.3s ease',
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div
                  className="absolute right-3 top-3 rounded-full px-2.5 py-0.5"
                  style={{
                    background: plan.popular ? colors.buttonGradient : `${colors.success}20`,
                  }}
                >
                  <span style={{
                    color: plan.popular ? colors.buttonText : colors.success,
                    fontFamily: "'Inter', sans-serif", fontSize: '9px', letterSpacing: '0.5px',
                  }}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4">
                {/* Radio */}
                <div
                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                  style={{
                    border: `2px solid ${isSelected ? colors.primary : colors.textSecondary}40`,
                    background: isSelected ? colors.primary : 'transparent',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isSelected && <Check size={14} style={{ color: colors.buttonText }} />}
                </div>

                {/* Plan info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '16px' }}>
                      {plan.name}
                    </span>
                    {plan.savings && (
                      <span className="rounded-full px-2 py-0.5"
                        style={{ background: `${colors.success}15`, color: colors.success, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>
                        {plan.savings}
                      </span>
                    )}
                  </div>
                  <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                    {plan.duration}
                  </span>
                </div>

                {/* Price */}
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>&#8377;</span>
                    <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '22px' }}>{plan.price}</span>
                  </div>
                  {plan.originalPrice && (
                    <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px', textDecoration: 'line-through' }}>
                      &#8377;{plan.originalPrice}
                    </span>
                  )}
                  <div style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>
                    &#8377;{plan.perMonth}/mo
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* What's included mini */}
      <div className="mb-6 rounded-2xl p-4" style={{ background: cardSolidBg, border: `1px solid ${colors.cardBorder}` }}>
        <div className="mb-3 flex items-center gap-2">
          <Gift size={14} style={{ color: colors.primary }} />
          <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Included with all plans
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Coins, text: '100 free coins' },
            { icon: Phone, text: 'Audio calls' },
            { icon: MessageCircle, text: 'Messaging' },
            { icon: Crown, text: 'Celeb lounge' },
          ].map(item => {
            const Ic = item.icon;
            return (
              <div key={item.text} className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: `${colors.primary}08` }}>
                <Ic size={13} style={{ color: colors.primary, opacity: 0.7 }} />
                <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1" />

      {/* Security badge */}
      <div className="mb-4 flex items-center justify-center gap-2">
        <Shield size={13} style={{ color: colors.success }} />
        <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
          256-bit SSL Encrypted &middot; Secure Payment
        </span>
      </div>

      {/* Continue button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => setStep('gateway')}
        className="imitr-ripple flex w-full items-center justify-center gap-2.5 rounded-2xl py-4"
        style={{ background: colors.buttonGradient, boxShadow: `0 6px 30px ${colors.glowColor}` }}
      >
        <span style={{ color: colors.buttonText, fontFamily: "'Inter', sans-serif", fontSize: '15px' }}>
          Continue &middot; &#8377;{currentPlan.price}
        </span>
        <ChevronRight size={18} style={{ color: colors.buttonText }} />
      </motion.button>
    </motion.div>
  );

  /* ─────────── Step: Gateway ─────────── */
  const renderGateway = () => (
    <motion.div
      key="gateway"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.3 }}
      className="flex flex-1 flex-col"
    >
      {/* Order summary */}
      <div className="mb-6 overflow-hidden rounded-2xl" style={{ border: `1px solid ${colors.cardBorder}` }}>
        <div className="p-4" style={{ background: `${colors.primary}08` }}>
          <div className="mb-1 flex items-center justify-between">
            <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              Order Summary
            </span>
            <button onClick={() => setStep('pricing')}
              style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
              Change
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4" style={{ background: cardSolidBg }}>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: colors.buttonGradient }}>
            <Crown size={20} style={{ color: colors.buttonText }} />
          </div>
          <div className="flex-1">
            <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px', display: 'block' }}>
              IMITR Premium — {currentPlan.name}
            </span>
            <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
              {currentPlan.duration} subscription
            </span>
          </div>
          <div className="text-right">
            <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '18px' }}>
              &#8377;{currentPlan.price}
            </span>
            {currentPlan.originalPrice && (
              <div style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px', textDecoration: 'line-through' }}>
                &#8377;{currentPlan.originalPrice}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment methods */}
      <p className="mb-3" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>
        Select Payment Method
      </p>

      <div className="mb-6 space-y-3">
        {paymentMethods.map((method, i) => {
          const isSelected = selectedPayment === method.id;
          const MIcon = method.icon;
          return (
            <motion.button
              key={method.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelectedPayment(method.id)}
              className="w-full overflow-hidden rounded-2xl text-left"
              style={{
                border: `2px solid ${isSelected ? colors.primary : colors.cardBorder}`,
                background: isSelected ? `${colors.primary}10` : cardSolidBg,
                transition: 'all 0.3s ease',
              }}
            >
              <div className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: isSelected ? `${colors.primary}20` : `${colors.primary}10` }}>
                  <MIcon size={20} style={{ color: colors.primary }} />
                </div>
                <div className="flex-1">
                  <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px', display: 'block' }}>
                    {method.name}
                  </span>
                  <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                    {method.desc}
                  </span>
                </div>
                <div className="flex h-5 w-5 items-center justify-center rounded-full"
                  style={{
                    border: `2px solid ${isSelected ? colors.primary : `${colors.textSecondary}40`}`,
                    background: isSelected ? colors.primary : 'transparent',
                    transition: 'all 0.3s ease',
                  }}>
                  {isSelected && <Check size={11} style={{ color: colors.buttonText }} />}
                </div>
              </div>

              {/* Provider chips — show when selected */}
              <AnimatePresence>
                {isSelected && method.providers && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-2 px-4 pb-4">
                      {method.providers.map(provider => (
                        <span key={provider} className="rounded-full px-3 py-1"
                          style={{ background: `${colors.primary}12`, color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '11px', border: `1px solid ${colors.primary}20` }}>
                          {provider}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      <div className="flex-1" />

      {/* Security badges */}
      <div className="mb-4 flex items-center justify-center gap-4">
        <div className="flex items-center gap-1.5">
          <Shield size={12} style={{ color: colors.success }} />
          <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>Secure</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock size={12} style={{ color: colors.success }} />
          <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>Encrypted</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap size={12} style={{ color: colors.success }} />
          <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>Instant</span>
        </div>
      </div>

      {/* Pay button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={handleProceedToPayment}
        disabled={!selectedPayment}
        className="imitr-ripple flex w-full items-center justify-center gap-2.5 rounded-2xl py-4"
        style={{
          background: selectedPayment ? colors.buttonGradient : `${colors.textSecondary}20`,
          boxShadow: selectedPayment ? `0 6px 30px ${colors.glowColor}` : 'none',
          opacity: selectedPayment ? 1 : 0.5,
          transition: 'all 0.3s ease',
          cursor: selectedPayment ? 'pointer' : 'not-allowed',
        }}
      >
        <Lock size={16} style={{ color: selectedPayment ? colors.buttonText : colors.textSecondary }} />
        <span style={{ color: selectedPayment ? colors.buttonText : colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '15px' }}>
          Pay &#8377;{currentPlan.price} Securely
        </span>
      </motion.button>
    </motion.div>
  );

  /* ─────────── Step: Processing ─────────── */
  const renderProcessing = () => {
    const cappedProgress = Math.min(processingProgress, 100);
    const statusText = cappedProgress < 30
      ? 'Connecting to payment gateway...'
      : cappedProgress < 60
      ? 'Processing your payment...'
      : cappedProgress < 90
      ? 'Verifying transaction...'
      : 'Activating your premium...';

    return (
      <motion.div
        key="processing"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="flex flex-1 flex-col items-center justify-center text-center"
      >
        {/* Animated loader */}
        <motion.div
          className="relative mb-8 flex h-28 w-28 items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          {/* Outer spinning ring */}
          <svg width="112" height="112" viewBox="0 0 112 112" className="absolute">
            <circle cx="56" cy="56" r="50" fill="none" stroke={`${colors.primary}15`} strokeWidth="4" />
            <circle cx="56" cy="56" r="50" fill="none" stroke={colors.primary} strokeWidth="4"
              strokeDasharray={`${cappedProgress * 3.14} ${314 - cappedProgress * 3.14}`}
              strokeLinecap="round" transform="rotate(-90 56 56)"
              style={{ transition: 'stroke-dasharray 0.3s ease' }} />
          </svg>
          {/* Inner static icon */}
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
            <CreditCard size={32} style={{ color: colors.primary }} />
          </motion.div>
        </motion.div>

        <h2 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '22px', marginBottom: '8px' }}>
          Processing Payment
        </h2>
        <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px', marginBottom: '24px' }}>
          {statusText}
        </p>

        {/* Progress bar */}
        <div className="mb-3 w-full max-w-[250px] overflow-hidden rounded-full" style={{ height: '6px', background: `${colors.primary}15` }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: colors.buttonGradient, width: `${cappedProgress}%`, transition: 'width 0.3s ease' }}
          />
        </div>
        <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
          {Math.round(cappedProgress)}%
        </span>

        {/* Security note */}
        <div className="mt-8 flex items-center gap-2 rounded-full px-4 py-2" style={{ background: `${colors.success}10`, border: `1px solid ${colors.success}20` }}>
          <Shield size={13} style={{ color: colors.success }} />
          <span style={{ color: colors.success, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
            Do not close this screen
          </span>
        </div>
      </motion.div>
    );
  };

  /* ─────────── Step: Success ─────────── */
  const renderSuccess = () => (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, type: 'spring', damping: 15 }}
      className="flex flex-1 flex-col items-center justify-center text-center"
    >
      {/* Success animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 10, stiffness: 150, delay: 0.2 }}
        className="relative mb-6"
      >
        {/* Outer glow rings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full"
          style={{ background: `${colors.success}15`, transform: 'scale(2)', filter: 'blur(20px)' }}
        />
        <div
          className="relative flex h-28 w-28 items-center justify-center rounded-full"
          style={{ background: `${colors.success}20`, border: `3px solid ${colors.success}` }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 8, stiffness: 200, delay: 0.5 }}
          >
            <BadgeCheck size={52} style={{ color: colors.success }} />
          </motion.div>
        </div>

        {/* Confetti particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0.5],
              x: Math.cos((i * Math.PI * 2) / 8) * 70,
              y: Math.sin((i * Math.PI * 2) / 8) * 70,
            }}
            transition={{ delay: 0.6 + i * 0.05, duration: 1 }}
            className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
            style={{
              background: i % 2 === 0 ? colors.primary : colors.success,
              marginLeft: '-4px',
              marginTop: '-4px',
            }}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="mb-2 flex items-center justify-center gap-2">
          <PartyPopper size={20} style={{ color: colors.primary }} />
          <h2 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '26px' }}>
            Welcome to Premium!
          </h2>
        </div>

        <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '14px', maxWidth: '280px', margin: '0 auto 20px' }}>
          Your subscription is now active. Enjoy all premium features!
        </p>
      </motion.div>

      {/* Receipt card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mb-8 w-full overflow-hidden rounded-2xl"
        style={{ border: `1px solid ${colors.cardBorder}`, background: cardSolidBg }}
      >
        <div className="p-4" style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle2 size={14} style={{ color: colors.success }} />
            <span style={{ color: colors.success, fontFamily: "'Inter', sans-serif", fontSize: '11px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              Payment Successful
            </span>
          </div>
          {[
            { label: 'Plan', value: `Premium ${currentPlan.name}` },
            { label: 'Duration', value: currentPlan.duration },
            { label: 'Amount Paid', value: `\u20B9${currentPlan.price}` },
            { label: 'Transaction ID', value: `IMITR${Date.now().toString(36).toUpperCase()}` },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between py-1.5">
              <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>{row.label}</span>
              <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Bonus coins */}
        <div className="flex items-center gap-3 p-4" style={{ background: `${colors.primary}08` }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${colors.primary}20` }}>
            <Coins size={18} style={{ color: colors.primary }} />
          </div>
          <div className="flex-1">
            <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px', display: 'block' }}>
              +100 Bonus Coins
            </span>
            <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
              Added to your wallet
            </span>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 1.2 }}
          >
            <Gift size={20} style={{ color: colors.primary }} />
          </motion.div>
        </div>
      </motion.div>

      <div className="flex-1" />

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="w-full"
      >
        <button
          onClick={handleSuccessClose}
          className="imitr-ripple mb-3 flex w-full items-center justify-center gap-2.5 rounded-2xl py-4"
          style={{ background: colors.buttonGradient, boxShadow: `0 6px 30px ${colors.glowColor}` }}
        >
          <Sparkles size={18} style={{ color: colors.buttonText }} />
          <span style={{ color: colors.buttonText, fontFamily: "'Inter', sans-serif", fontSize: '15px' }}>
            Start Exploring Premium
          </span>
        </button>
      </motion.div>
    </motion.div>
  );

  /* ─────────── Main Overlay Shell ─────────── */
  const overlayContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="fixed inset-0 z-[9999] overflow-y-auto"
          style={{ background: solidBg }}
        >
          {/* Top decorative glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2"
            style={{ background: `radial-gradient(circle, ${colors.primary}25, transparent 70%)`, filter: 'blur(40px)' }}
          />

          {/* Content wrapper */}
          <div className="relative flex min-h-screen flex-col px-6 pb-10 pt-14">
            {/* Top bar: back / close */}
            {step !== 'processing' && (
              <div className="absolute left-5 right-5 top-5 z-10 flex items-center justify-between">
                {(step === 'pricing' || step === 'gateway') ? (
                  <button
                    onClick={handleClose}
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ background: cardSolidBg, border: `1px solid ${colors.cardBorder}` }}
                  >
                    <ArrowLeft size={18} style={{ color: colors.textSecondary }} />
                  </button>
                ) : <div />}
                {step !== 'success' && (
                  <button
                    onClick={onClose}
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ background: cardSolidBg, border: `1px solid ${colors.cardBorder}` }}
                  >
                    <X size={18} style={{ color: colors.textSecondary }} />
                  </button>
                )}
              </div>
            )}

            {/* Step indicator (only on pricing & gateway) */}
            {(step === 'pricing' || step === 'gateway') && (
              <div className="mb-6 flex items-center justify-center gap-2">
                {['pricing', 'gateway'].map((s, i) => (
                  <div key={s} className="contents">
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full"
                      style={{
                        background: step === s || (step === 'gateway' && s === 'pricing')
                          ? colors.primary
                          : `${colors.textSecondary}20`,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {(step === 'gateway' && s === 'pricing') ? (
                        <Check size={13} style={{ color: colors.buttonText }} />
                      ) : (
                        <span style={{
                          color: step === s ? colors.buttonText : colors.textSecondary,
                          fontFamily: "'Inter', sans-serif", fontSize: '11px',
                        }}>
                          {i + 1}
                        </span>
                      )}
                    </div>
                    {i === 0 && (
                      <div className="w-10 rounded-full" style={{
                        height: '2px',
                        background: step === 'gateway' ? colors.primary : `${colors.textSecondary}30`,
                        transition: 'all 0.3s ease',
                      }} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Animated step content */}
            <AnimatePresence mode="wait">
              {step === 'benefits' && renderBenefits()}
              {step === 'pricing' && renderPricing()}
              {step === 'gateway' && renderGateway()}
              {step === 'processing' && renderProcessing()}
              {step === 'success' && renderSuccess()}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(overlayContent, document.body);
}

/**
 * Inline premium lock badge — small indicator on buttons/icons
 */
export function PremiumLockBadge({ size = 14 }: { size?: number }) {
  const { colors } = useTheme();
  return (
    <div
      className="flex items-center justify-center rounded-full"
      style={{
        width: size + 4,
        height: size + 4,
        background: `${colors.primary}30`,
        border: `1px solid ${colors.primary}`,
      }}
    >
      <Lock size={size - 4} style={{ color: colors.primary }} />
    </div>
  );
}

/**
 * Hook to manage premium gate state
 */
export function usePremiumGate() {
  const { isPremium } = useApp();
  const [showGate, setShowGate] = React.useState(false);
  const [gateFeature, setGateFeature] = React.useState('');

  const requirePremium = (feature: string, callback?: () => void) => {
    if (isPremium) {
      callback?.();
      return true;
    }
    setGateFeature(feature);
    setShowGate(true);
    return false;
  };

  return {
    isPremium,
    showGate,
    gateFeature,
    setShowGate,
    requirePremium,
  };
}