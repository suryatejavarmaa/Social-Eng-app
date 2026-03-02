import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Diamond, TrendingUp, ArrowRight, Phone, Video, DollarSign, MessageCircle, Clock, CheckCircle, XCircle, Send } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { HeaderBar } from '../../components/imitr/HeaderBar';
import { BottomNav } from '../../components/imitr/BottomNav';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { DIAMOND_TO_RUPEE, MIN_WITHDRAW_DIAMONDS, COIN_DIAMOND_RATE } from '../../context/AppContext';

export function EarningsScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { diamondBalance, callHistory, chatThreads, withdrawRequests } = useApp();

  const audioCalls = callHistory.filter(c => c.type === 'audio').length;
  const videoCalls = callHistory.filter(c => c.type === 'video').length;
  const totalMsgDiamonds = chatThreads.reduce((sum, t) => sum + t.totalDiamondsReceived, 0);

  return (
    <ScreenWrapper noPadding>
      <div className="px-5 pb-24 pt-6 imitr-page-enter">
        <HeaderBar title="Earnings" showBack />

        {/* Diamond Balance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="mb-5 p-6 imitr-border-glow" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(184,134,11,0.1))' }}>
            <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>Diamond Balance</p>
            <div className="my-3 flex items-center gap-3">
              <Diamond size={28} style={{ color: colors.primary, filter: `drop-shadow(0 0 8px ${colors.glowColor})` }} />
              <span className="imitr-counter" style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '36px' }}>
                {diamondBalance.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign size={14} style={{ color: colors.success }} />
                <span style={{ color: colors.success, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                  ₹{(diamondBalance * DIAMOND_TO_RUPEE).toLocaleString()} withdrawable
                </span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp size={14} style={{ color: colors.success }} />
                <span style={{ color: colors.success, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>+12%</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <PremiumButton fullWidth onClick={() => navigate('/withdraw')} className="mb-6" disabled={diamondBalance < MIN_WITHDRAW_DIAMONDS}>
          <span className="flex items-center justify-center gap-2">
            {diamondBalance < MIN_WITHDRAW_DIAMONDS ? `Min ${MIN_WITHDRAW_DIAMONDS} diamonds to withdraw` : 'Withdraw Diamonds'}
            <ArrowRight size={18} />
          </span>
        </PremiumButton>

        {/* Conversion Info */}
        <GlassCard className="mb-5 p-4">
          <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Conversion Rates
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>1 Diamond</span>
              <span style={{ color: colors.primary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>{COIN_DIAMOND_RATE} Coins = ₹{DIAMOND_TO_RUPEE}</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>Audio Call (60s)</span>
              <span style={{ color: colors.primary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>Earns 1 Diamond</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>Video Call (60s)</span>
              <span style={{ color: colors.primary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>Earns 4 Diamonds</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>2 Messages Received</span>
              <span style={{ color: colors.primary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>Earns 1 Diamond</span>
            </div>
          </div>
        </GlassCard>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <GlassCard className="p-4">
            <Phone size={18} style={{ color: colors.primary, marginBottom: '8px' }} />
            <span className="imitr-counter" style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '22px', display: 'block' }}>{audioCalls}</span>
            <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>Audio Calls Received</span>
          </GlassCard>
          <GlassCard className="p-4">
            <Video size={18} style={{ color: colors.primary, marginBottom: '8px' }} />
            <span className="imitr-counter" style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '22px', display: 'block' }}>{videoCalls}</span>
            <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>Video Calls</span>
          </GlassCard>
          <GlassCard className="p-4">
            <MessageCircle size={18} style={{ color: colors.primary, marginBottom: '8px' }} />
            <span className="imitr-counter" style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '22px', display: 'block' }}>{totalMsgDiamonds}</span>
            <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>Msg Diamonds</span>
          </GlassCard>
        </div>

        {/* Diamond History from call records */}
        <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '12px' }}>Diamond History</h3>
        <div className="imitr-stagger flex flex-col gap-3">
          {callHistory.filter(c => c.diamondsEarned > 0).map((c) => (
            <GlassCard key={c.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${colors.primary}15` }}>
                  {c.type === 'audio' ? <Phone size={18} style={{ color: colors.primary }} /> : <Video size={18} style={{ color: colors.primary }} />}
                </div>
                <div>
                  <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px', display: 'block' }}>
                    {c.type === 'audio' ? 'Audio' : 'Video'} from {c.userName.split(' ')[0]}
                  </span>
                  <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>{c.date}</span>
                </div>
              </div>
              <span className="flex items-center gap-1" style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                +{c.diamondsEarned} <Diamond size={12} />
              </span>
            </GlassCard>
          ))}
        </div>

        {/* Payout History */}
        {withdrawRequests.length > 0 && (
          <>
            <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginTop: '24px', marginBottom: '12px' }}>Payout History</h3>
            <div className="imitr-stagger flex flex-col gap-3">
              {withdrawRequests.map((w) => {
                const statusConfig = {
                  pending: { color: colors.primary, bg: `${colors.primary}15`, label: 'Pending Review', icon: Clock },
                  approved: { color: '#F59E0B', bg: '#F59E0B15', label: 'Approved - Awaiting Payment', icon: Clock },
                  paid: { color: colors.success, bg: `${colors.success}15`, label: 'Payment Sent', icon: CheckCircle },
                  rejected: { color: colors.danger, bg: `${colors.danger}15`, label: 'Rejected', icon: XCircle },
                  processing: { color: '#F59E0B', bg: '#F59E0B15', label: 'Processing', icon: Send },
                };
                const cfg = statusConfig[w.status] || statusConfig.pending;
                const StatusIcon = cfg.icon;
                return (
                  <GlassCard key={w.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: cfg.bg }}>
                          <StatusIcon size={18} style={{ color: cfg.color }} />
                        </div>
                        <div>
                          <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px', display: 'block' }}>
                            {w.diamonds} diamonds
                          </span>
                          <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                            {w.date} | {w.method}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span style={{ color: colors.success, fontFamily: "'Inter', sans-serif", fontSize: '14px', display: 'block' }}>
                          ₹{w.amount.toLocaleString()}
                        </span>
                        <span className="inline-block rounded-full px-2 py-0.5 mt-1" style={{ background: cfg.bg, color: cfg.color, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                    {w.paidAt && (
                      <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                        Paid: {w.paidAt}
                      </span>
                    )}
                  </GlassCard>
                );
              })}
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </ScreenWrapper>
  );
}