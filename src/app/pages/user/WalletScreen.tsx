import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Coins, Plus, ArrowUpRight, ArrowDownLeft, TrendingUp, Diamond, Crown, Mail, Clock, Check, Shield } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { BottomNav } from '../../components/imitr/BottomNav';
import { HeaderBar } from '../../components/imitr/HeaderBar';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { DIAMOND_TO_RUPEE, COIN_DIAMOND_RATE } from '../../context/AppContext';

export function WalletScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { coinBalance, diamondBalance, transactions, userAssignedAdmin, coinRechargeRequests } = useApp();

  const recentTx = transactions.slice(0, 6);
  const pendingRequests = coinRechargeRequests.filter(r => r.status === 'pending');
  const recentApproved = coinRechargeRequests.filter(r => r.status === 'approved').slice(0, 2);

  return (
    <ScreenWrapper noPadding>
      <div className="px-5 pb-24 pt-6 imitr-page-enter">
        <HeaderBar title="Wallet" />

        {/* Assigned Admin Card — separate from balance */}
        {userAssignedAdmin && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-3">
            <GlassCard className="flex items-center gap-3 p-3.5">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full" style={{ background: colors.buttonGradient }}>
                <span style={{ color: colors.buttonText, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>
                  {userAssignedAdmin.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Crown size={12} style={{ color: colors.primary }} />
                  <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                    Admin:
                  </span>
                  <span className="truncate" style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                    {userAssignedAdmin.name}
                  </span>
                  <Shield size={11} style={{ color: colors.primary, flexShrink: 0 }} />
                </div>
              </div>
              {userAssignedAdmin.email && (
                <button
                  onClick={(e) => { e.stopPropagation(); window.open(`mailto:${userAssignedAdmin.email}`, '_blank'); }}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border-0"
                  style={{ background: `${colors.primary}12` }}
                >
                  <Mail size={14} style={{ color: colors.primary }} />
                </button>
              )}
            </GlassCard>
          </motion.div>
        )}

        {/* Coin Balance Card — colored background, standalone */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <GlassCard className="mb-3 p-6 imitr-gold-pulse" style={{ background: colors.buttonGradient }}>
            <p style={{ color: colors.buttonText, fontFamily: "'Inter', sans-serif", fontSize: '13px', opacity: 0.8 }}>
              Coin Balance
            </p>
            <div className="my-3 flex items-center gap-3">
              <Coins size={28} style={{ color: colors.buttonText }} />
              <span className="imitr-counter" style={{ color: colors.buttonText, fontFamily: "'Playfair Display', serif", fontSize: '36px' }}>
                {coinBalance.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={14} style={{ color: colors.buttonText, opacity: 0.7 }} />
              <span style={{ color: colors.buttonText, fontFamily: "'Inter', sans-serif", fontSize: '12px', opacity: 0.7 }}>
                {COIN_DIAMOND_RATE} coins = 1 diamond
              </span>
            </div>
          </GlassCard>
        </motion.div>

        {/* Diamond mini card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="mb-5 flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Diamond size={20} style={{ color: colors.primary }} />
              <div>
                <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif", display: 'block' }}>Diamond Earnings</span>
                <span className="imitr-counter" style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '20px' }}>
                  {diamondBalance.toLocaleString()}
                </span>
              </div>
            </div>
            <span style={{ color: colors.success, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
              ₹{(diamondBalance * DIAMOND_TO_RUPEE).toLocaleString()}
            </span>
          </GlassCard>
        </motion.div>

        <div className="mb-6 flex gap-3">
          <PremiumButton fullWidth onClick={() => navigate(userAssignedAdmin ? '/recharge-coins' : '/admin-selection')}>
            <span className="flex items-center justify-center gap-2"><Plus size={18} /> Recharge</span>
          </PremiumButton>
          <PremiumButton fullWidth variant="outline" onClick={() => navigate('/earnings')}>
            <span className="flex items-center justify-center gap-2"><Diamond size={18} /> Earnings</span>
          </PremiumButton>
        </div>

        {/* Pending Recharge Requests */}
        {pendingRequests.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="mb-3 flex items-center gap-2">
              <Clock size={14} style={{ color: colors.primary }} />
              <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                Pending Requests ({pendingRequests.length})
              </span>
            </div>
            {pendingRequests.map((req) => (
              <GlassCard key={req.id} className="mb-3 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${colors.primary}12` }}>
                      <Coins size={14} style={{ color: colors.primary }} />
                    </div>
                    <div>
                      <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                        {req.coins.toLocaleString()} coins{req.bonus > 0 ? ` +${req.bonus}` : ''}
                      </span>
                      <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                        Sent to {req.adminIds.length} admin{req.adminIds.length > 1 ? 's' : ''} · {req.createdAt}
                      </span>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 rounded-full px-2 py-0.5" style={{
                    background: `${colors.primary}12`, color: colors.primary,
                    fontSize: '10px', fontFamily: "'Inter', sans-serif",
                  }}>
                    <Clock size={9} /> Pending
                  </span>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}

        {/* Recently Approved */}
        {recentApproved.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            {recentApproved.map((req) => (
              <GlassCard key={req.id} className="mb-3 flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${colors.success}15` }}>
                    <Check size={14} style={{ color: colors.success }} />
                  </div>
                  <div>
                    <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                      {(req.coins + req.bonus).toLocaleString()} coins approved
                    </span>
                    <span style={{ color: colors.success, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                      by {req.approvedByAdminName}
                    </span>
                  </div>
                </div>
                <span className="rounded-full px-2 py-0.5" style={{
                  background: `${colors.success}15`, color: colors.success,
                  fontSize: '10px', fontFamily: "'Inter', sans-serif",
                }}>
                  Approved
                </span>
              </GlassCard>
            ))}
          </motion.div>
        )}

        {/* Recent Transactions */}
        <div className="mb-4 flex items-center justify-between">
          <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>Recent Activity</h3>
          <button onClick={() => navigate('/transactions')} style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
            View All →
          </button>
        </div>

        <div className="imitr-stagger flex flex-col gap-3">
          {recentTx.map((tx) => (
            <GlassCard key={tx.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: tx.amount > 0 ? `${colors.success}20` : `${colors.primary}15` }}
                >
                  {tx.amount > 0 ?
                    <ArrowDownLeft size={18} style={{ color: colors.success }} /> :
                    <ArrowUpRight size={18} style={{ color: colors.primary }} />
                  }
                </div>
                <div>
                  <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px', display: 'block' }}>
                    {tx.type === 'recharge' ? `Recharge via ${tx.method}` : tx.type === 'call' ? `Call with ${tx.user}` : tx.type === 'message' ? `Message to ${tx.user}` : tx.type === 'withdraw' ? 'Withdrawal' : tx.type}
                  </span>
                  <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                    {tx.date}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span style={{
                  color: tx.amount > 0 ? colors.success : colors.primary,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px',
                  display: 'block',
                }}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                </span>
                <span className="rounded-full px-1.5 py-0.5" style={{
                  background: tx.status === 'completed' ? `${colors.success}15` : tx.status === 'pending' ? `${colors.primary}15` : `${colors.danger}15`,
                  color: tx.status === 'completed' ? colors.success : tx.status === 'pending' ? colors.primary : colors.danger,
                  fontSize: '9px', fontFamily: "'Inter', sans-serif",
                }}>
                  {tx.status}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
      <BottomNav />
    </ScreenWrapper>
  );
}
