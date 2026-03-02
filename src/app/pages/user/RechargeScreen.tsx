import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Coins, Star, CreditCard, Smartphone, Building2, Check, Sparkles } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { HeaderBar } from '../../components/imitr/HeaderBar';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

const plans = [
  { coins: 100, price: 50, popular: false, bonus: 0 },
  { coins: 500, price: 225, popular: false, bonus: 0 },
  { coins: 1000, price: 400, popular: true, bonus: 50 },
  { coins: 2500, price: 900, popular: false, bonus: 150 },
  { coins: 5000, price: 1600, popular: false, bonus: 400 },
  { coins: 10000, price: 2800, popular: false, bonus: 1000 },
];

const paymentMethods = [
  { id: 'upi', label: 'UPI', icon: Smartphone },
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'netbanking', label: 'Net Banking', icon: Building2 },
];

export function RechargeScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { coinBalance, addCoins } = useApp();
  const [selected, setSelected] = useState<number | null>(null);
  const [payMethod, setPayMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);

  const handlePurchase = () => {
    if (selected === null) return;
    setProcessing(true);
    const plan = plans[selected];
    setTimeout(() => {
      addCoins(plan.coins + plan.bonus, payMethod.toUpperCase());
      setProcessing(false);
      navigate('/payment-result');
    }, 1500);
  };

  return (
    <ScreenWrapper>
      <div className="imitr-page-enter">
        <HeaderBar title="Recharge Coins" showBack />

        {/* Current balance */}
        <GlassCard className="mb-5 flex items-center justify-between p-4">
          <span style={{ color: colors.textSecondary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>Current Balance</span>
          <span className="flex items-center gap-1 imitr-counter" style={{ color: colors.primary, fontFamily: "'Playfair Display', serif", fontSize: '20px' }}>
            <Coins size={16} /> {coinBalance.toLocaleString()}
          </span>
        </GlassCard>

        <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '14px', marginBottom: '16px' }}>
          Select a coin package
        </p>

        <div className="imitr-stagger mb-6 grid grid-cols-3 gap-3">
          {plans.map((plan, i) => (
            <GlassCard
              key={plan.coins}
              className={`relative flex flex-col items-center p-4`}
              style={selected === i ? { boxShadow: `0 0 24px ${colors.glowColor}`, border: `1.5px solid ${colors.primary}` } : {}}
              onClick={() => setSelected(i)}
            >
              {plan.popular && (
                <div className="absolute -top-2 flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background: colors.buttonGradient }}>
                  <Sparkles size={8} style={{ color: colors.buttonText }} />
                  <span style={{ color: colors.buttonText, fontSize: '8px', fontFamily: "'Inter', sans-serif" }}>BEST VALUE</span>
                </div>
              )}
              {selected === i && (
                <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full" style={{ background: colors.primary }}>
                  <Check size={12} style={{ color: colors.buttonText }} />
                </div>
              )}
              <Coins size={20} style={{ color: colors.primary, marginBottom: '6px' }} />
              <span style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '18px' }}>
                {plan.coins >= 1000 ? `${plan.coins / 1000}K` : plan.coins}
              </span>
              <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                coins
              </span>
              {plan.bonus > 0 && (
                <span style={{ color: colors.success, fontFamily: "'Inter', sans-serif", fontSize: '9px', marginTop: '2px' }}>
                  +{plan.bonus} bonus
                </span>
              )}
              <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '13px', marginTop: '6px' }}>
                ₹{plan.price}
              </span>
            </GlassCard>
          ))}
        </div>

        <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '14px', marginBottom: '12px' }}>
          Payment Method
        </p>
        <div className="mb-6 flex gap-3">
          {paymentMethods.map((m) => {
            const Icon = m.icon;
            const isActive = payMethod === m.id;
            return (
              <GlassCard
                key={m.id}
                className="imitr-ripple flex flex-1 flex-col items-center gap-2 p-3"
                onClick={() => setPayMethod(m.id)}
                style={isActive ? { borderColor: colors.primary, boxShadow: `0 0 12px ${colors.glowColor}` } : {}}
              >
                <Icon size={20} style={{ color: isActive ? colors.primary : colors.textSecondary }} />
                <span style={{ color: isActive ? colors.primary : colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                  {m.label}
                </span>
              </GlassCard>
            );
          })}
        </div>

        <PremiumButton
          fullWidth
          disabled={selected === null}
          loading={processing}
          onClick={handlePurchase}
        >
          {selected !== null ? `Pay ₹${plans[selected].price} — Get ${(plans[selected].coins + plans[selected].bonus).toLocaleString()} coins` : 'Select a package'}
        </PremiumButton>
      </div>
    </ScreenWrapper>
  );
}
