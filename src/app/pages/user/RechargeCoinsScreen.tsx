import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { Coins, Star, Sparkles, Check, Send, Users, Crown, ArrowLeft, Shield } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { HeaderBar } from '../../components/imitr/HeaderBar';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

const plans = [
  { coins: 100, price: 100, popular: false, bonus: 0 },
  { coins: 500, price: 500, popular: false, bonus: 0 },
  { coins: 1000, price: 1000, popular: true, bonus: 0 },
  { coins: 2500, price: 2500, popular: false, bonus: 0 },
  { coins: 5000, price: 5000, popular: false, bonus: 0 },
  { coins: 10000, price: 10000, popular: false, bonus: 0 },
];

export function RechargeCoinsScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { coinBalance, admins, submitCoinRechargeRequest, userAssignedAdmin } = useApp();

  // Support both: query-param admins (from old flow) OR assigned admin (new flow)
  const adminIdsFromQuery = (searchParams.get('admins') || '').split(',').filter(Boolean);
  const hasAssignedAdmin = !!userAssignedAdmin;
  const adminIds = hasAssignedAdmin ? [userAssignedAdmin!.id] : adminIdsFromQuery;
  const selectedAdmins = hasAssignedAdmin
    ? [{ id: userAssignedAdmin!.id, name: userAssignedAdmin!.name }]
    : admins.filter(a => adminIds.includes(a.id));

  const [selected, setSelected] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selected === null || adminIds.length === 0) return;
    setProcessing(true);
    const plan = plans[selected];
    setTimeout(() => {
      submitCoinRechargeRequest(adminIds, plan.coins, plan.price, plan.bonus);
      setProcessing(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <ScreenWrapper className="flex min-h-screen flex-col items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm text-center px-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full"
            style={{ background: `${colors.primary}15`, border: `2px solid ${colors.primary}`, boxShadow: `0 0 30px ${colors.glowColor}` }}
          >
            <Send size={32} style={{ color: colors.primary }} />
          </motion.div>

          <h1 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '22px' }}>
            Request Sent!
          </h1>
          <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px', marginTop: '6px' }}>
            {hasAssignedAdmin
              ? `Your recharge request has been sent to ${userAssignedAdmin!.name}. You'll be notified once approved.`
              : `Your recharge request has been sent to ${selectedAdmins.length} admin${selectedAdmins.length > 1 ? 's' : ''}. You'll be notified once approved.`
            }
          </p>

          <GlassCard className="mt-5 p-4 text-left">
            <div className="mb-3 flex items-center justify-between">
              <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>Coins</span>
              <span className="flex items-center gap-1" style={{ color: colors.primary, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
                <Coins size={14} /> {selected !== null ? plans[selected].coins.toLocaleString() : ''}
                {selected !== null && plans[selected].bonus > 0 && (
                  <span style={{ color: colors.success, fontSize: '11px' }}>+{plans[selected].bonus}</span>
                )}
              </span>
            </div>
            <div className="mb-3 flex items-center justify-between" style={{ borderTop: `1px solid ${colors.cardBorder}`, paddingTop: '10px' }}>
              <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>Sent to</span>
              <div className="flex items-center gap-1">
                {selectedAdmins.map((a) => (
                  <span key={a.id} className="rounded-full px-2 py-0.5" style={{ background: `${colors.primary}12`, color: colors.primary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                    {a.name.split(' ')[0]}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between" style={{ borderTop: `1px solid ${colors.cardBorder}`, paddingTop: '10px' }}>
              <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>Status</span>
              <span className="flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background: `${colors.primary}15`, color: colors.primary, fontSize: '11px' }}>
                <Star size={10} /> Pending Approval
              </span>
            </div>
          </GlassCard>

          <PremiumButton fullWidth onClick={() => navigate('/wallet')} className="mt-6">
            <span className="flex items-center justify-center gap-2"><Coins size={16} /> Go to Wallet</span>
          </PremiumButton>
        </motion.div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <div className="imitr-page-enter">
        <HeaderBar title="Select Coins" showBack />

        {/* Step Indicator — show 2-step if from admin selection, single step if assigned */}
        {!hasAssignedAdmin && (
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: `${colors.success}20` }}>
              <Check size={14} style={{ color: colors.success }} />
            </div>
            <div className="h-0.5 flex-1 rounded-full" style={{ background: colors.primary }} />
            <div className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: colors.buttonGradient }}>
              <span style={{ color: colors.buttonText, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>2</span>
            </div>
          </div>
        )}

        {/* Admin info strip */}
        <GlassCard className="mb-5 p-3">
          <div className="flex items-center gap-2">
            {hasAssignedAdmin ? (
              <>
                <Shield size={14} style={{ color: colors.primary }} />
                <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                  Your Admin:
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: colors.buttonGradient }}>
                  <span style={{ color: colors.buttonText, fontFamily: "'Inter', sans-serif", fontSize: '9px' }}>
                    {userAssignedAdmin!.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <span className="flex items-center gap-1 rounded-full px-2.5 py-1" style={{
                  background: `${colors.primary}12`, border: `1px solid ${colors.primary}20`,
                  color: colors.primary, fontSize: '12px', fontFamily: "'Inter', sans-serif",
                }}>
                  {userAssignedAdmin!.name}
                </span>
              </>
            ) : (
              <>
                <Users size={14} style={{ color: colors.primary }} />
                <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                  Sending to:
                </span>
                <div className="flex flex-1 flex-wrap gap-1.5">
                  {selectedAdmins.map(a => (
                    <span key={a.id} className="flex items-center gap-1 rounded-full px-2.5 py-1" style={{
                      background: `${colors.primary}12`, border: `1px solid ${colors.primary}20`,
                      color: colors.primary, fontSize: '11px', fontFamily: "'Inter', sans-serif",
                    }}>
                      <Crown size={10} /> {a.name.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </GlassCard>

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
              className="relative flex flex-col items-center p-4"
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

        <PremiumButton
          fullWidth
          disabled={selected === null}
          loading={processing}
          onClick={handleSubmit}
        >
          {selected !== null
            ? <span className="flex items-center justify-center gap-2">
                <Send size={16} /> Request {(plans[selected].coins + plans[selected].bonus).toLocaleString()} Coins
              </span>
            : 'Select a package'}
        </PremiumButton>
      </div>
    </ScreenWrapper>
  );
}