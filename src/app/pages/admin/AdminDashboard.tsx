import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Coins, Users, Phone, TrendingUp, BarChart3, MessageCircle, AlertCircle,
  ShoppingCart, Clock, Check, X, AlertTriangle, Sparkles, ArrowDown, IndianRupee,
} from 'lucide-react';
import { GlassCard } from '../../components/imitr/GlassCard';
import { StatCard } from '../../components/imitr/StatCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { useTheme } from '../../context/ThemeContext';
import { useApp, COIN_PACK_SIZE, COIN_PACK_RUPEE_COST } from '../../context/AppContext';

export function AdminDashboard() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const {
    adminCoinInventory, adminDiamondBalance, adminUsers, callHistory, transactions, withdrawRequests,
    coinPurchaseRequests, adminPaymentDebt, requestCoinPurchase,
  } = useApp();

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const pendingWithdrawals = withdrawRequests.filter(w => w.status === 'pending').length;
  const pendingCoinRequests = coinPurchaseRequests.filter(r => r.status === 'pending').length;
  const approvedUnpaid = coinPurchaseRequests.filter(r => r.status === 'approved').length;

  const handleRequestCoins = () => {
    setRequesting(true);
    setTimeout(() => {
      requestCoinPurchase(COIN_PACK_SIZE);
      setRequesting(false);
      setRequestSuccess(true);
    }, 1500);
  };

  const recentActivity = [
    ...transactions.slice(0, 3).map(t => ({
      id: t.id,
      action: t.type === 'recharge' ? 'User recharge' : 'Call deduction',
      details: t.type === 'recharge' ? `${t.method} — ${t.amount} coins` : `${t.user} — ${Math.abs(t.amount)} coins`,
      time: t.date,
    })),
    ...callHistory.slice(0, 2).map(c => ({
      id: c.id,
      action: 'Call completed',
      details: `${c.userName} (${c.type}) — ${c.duration}s`,
      time: c.date,
    })),
  ];

  return (
    <div className="imitr-page-enter">
      {/* ─── Payment Debt Banner ─── */}
      {adminPaymentDebt > 0 && (
        <div
          className="mb-5 overflow-hidden rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${colors.danger}15 0%, ${colors.danger}08 100%)`,
            border: `1px solid ${colors.danger}30`,
          }}
        >
          <div className="flex items-center gap-4 p-4">
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl"
              style={{ background: `${colors.danger}20` }}
            >
              <AlertTriangle size={22} style={{ color: colors.danger }} />
            </div>
            <div className="flex-1">
              <span style={{ color: colors.danger, fontSize: '13px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                Outstanding Payment Due
              </span>
              <div className="mt-1 flex items-center gap-2">
                <IndianRupee size={18} style={{ color: colors.danger }} />
                <span style={{ color: colors.danger, fontSize: '24px', fontFamily: "'Playfair Display', serif" }}>
                  -{adminPaymentDebt.toLocaleString()}
                </span>
              </div>
              <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                {approvedUnpaid} unpaid coin purchase{approvedUnpaid > 1 ? 's' : ''} pending payment to Super Admin
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="imitr-stagger mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={<Coins size={20} />} label="Coins Inventory" value={adminCoinInventory.toLocaleString()} trend="+8.2%" trendUp onClick={() => navigate('/admin/coins')} />
        <StatCard
          icon={<IndianRupee size={20} />}
          label="Payment Due"
          value={adminPaymentDebt > 0 ? `₹${adminPaymentDebt.toLocaleString()}` : '₹0'}
          trend={adminPaymentDebt > 0 ? 'Debt pending' : 'Clear'}
          trendUp={adminPaymentDebt === 0}
        />
        <StatCard icon={<Users size={20} />} label="Active Users" value={adminUsers.length.toString()} trend="+5.1%" trendUp onClick={() => navigate('/admin/users')} />
        <StatCard icon={<AlertCircle size={20} />} label="Pending Withdrawals" value={pendingWithdrawals.toString()} onClick={() => navigate('/admin/withdrawals')} />
      </div>

      {/* ─── Buy Coins from Super Admin ─── */}
      <GlassCard className="mb-6 overflow-hidden">
        <div className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: colors.buttonGradient }}
              >
                <ShoppingCart size={18} style={{ color: colors.buttonText }} />
              </div>
              <div>
                <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '16px' }}>
                  Buy Coins from Super Admin
                </h3>
                <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                  Request coin packs — {COIN_PACK_SIZE.toLocaleString()} coins for ₹{COIN_PACK_RUPEE_COST.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Deal Card */}
          <div
            className="mb-4 rounded-2xl p-4"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}12 0%, ${colors.primary}05 100%)`,
              border: `1px solid ${colors.primary}20`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-1.5">
                    <Coins size={20} style={{ color: colors.primary }} />
                    <span style={{ color: colors.text, fontSize: '22px', fontFamily: "'Playfair Display', serif" }}>
                      {COIN_PACK_SIZE.toLocaleString()}
                    </span>
                  </div>
                  <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                    COINS
                  </span>
                </div>
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: `${colors.primary}15` }}
                >
                  <span style={{ color: colors.primary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>for</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1.5">
                    <IndianRupee size={20} style={{ color: colors.primary }} />
                    <span style={{ color: colors.text, fontSize: '22px', fontFamily: "'Playfair Display', serif" }}>
                      {COIN_PACK_RUPEE_COST.toLocaleString()}
                    </span>
                  </div>
                  <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                    RUPEES
                  </span>
                </div>
              </div>
            </div>
          </div>

          <PremiumButton fullWidth onClick={() => { setShowRequestModal(true); setRequestSuccess(false); }}>
            <span className="flex items-center justify-center gap-2">
              <Sparkles size={16} /> Request Coin Pack
            </span>
          </PremiumButton>
        </div>
      </GlassCard>

      {/* ─── My Coin Purchase Requests ─── */}
      {coinPurchaseRequests.length > 0 && (
        <GlassCard className="mb-6 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>My Coin Requests</h3>
            {pendingCoinRequests > 0 && (
              <span
                className="flex items-center gap-1 rounded-full px-2 py-1"
                style={{ background: `${colors.primary}15`, color: colors.primary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}
              >
                <Clock size={10} /> {pendingCoinRequests} pending
              </span>
            )}
          </div>
          <div className="space-y-3">
            {coinPurchaseRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between rounded-xl p-3"
                style={{
                  background: req.status === 'approved' ? `${colors.danger}06` : `${colors.primary}06`,
                  border: `1px solid ${
                    req.status === 'approved' ? `${colors.danger}15` :
                    req.status === 'paid' ? `${colors.success}15` :
                    req.status === 'rejected' ? `${colors.textSecondary}15` :
                    `${colors.primary}15`
                  }`,
                }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Coins size={14} style={{ color: colors.primary }} />
                    <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
                      {req.coinsPack.toLocaleString()} coins
                    </span>
                    <span style={{ color: colors.textSecondary, fontSize: '11px' }}>|</span>
                    <IndianRupee size={12} style={{ color: colors.primary }} />
                    <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
                      {req.rupeeCost.toLocaleString()}
                    </span>
                  </div>
                  <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                    {req.requestedAt}
                  </span>
                </div>
                <span
                  className="rounded-full px-2.5 py-1"
                  style={{
                    background:
                      req.status === 'pending' ? `${colors.primary}15` :
                      req.status === 'approved' ? `${colors.danger}15` :
                      req.status === 'paid' ? `${colors.success}15` :
                      `${colors.textSecondary}15`,
                    color:
                      req.status === 'pending' ? colors.primary :
                      req.status === 'approved' ? colors.danger :
                      req.status === 'paid' ? colors.success :
                      colors.textSecondary,
                    fontSize: '10px',
                    fontFamily: "'Inter', sans-serif",
                    textTransform: 'capitalize',
                  }}
                >
                  {req.status === 'approved' ? `Unpaid (₹${req.rupeeCost.toLocaleString()})` : req.status}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Revenue Card */}
      <GlassCard className="mb-6 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>Revenue Overview</h3>
          <span className="flex items-center gap-1 rounded-full px-2 py-1" style={{ background: `${colors.success}20`, color: colors.success, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
            <TrendingUp size={12} /> +18.5%
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Today', value: '₹12,450' },
            { label: 'This Week', value: '₹67,820' },
            { label: 'This Month', value: '₹2,84,500' },
          ].map((r) => (
            <div key={r.label} className="rounded-xl p-3" style={{ background: `${colors.primary}10` }}>
              <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{r.label}</span>
              <span className="imitr-counter" style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '18px' }}>{r.value}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Quick Actions */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Buy Coins', icon: Coins, path: '/admin/buy-coins' },
          { label: 'Create User', icon: Users, path: '/admin/create-user' },
          { label: 'View Reports', icon: BarChart3, path: '/admin/reports' },
          { label: 'Withdrawals', icon: IndianRupee, path: '/admin/withdrawals' },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <GlassCard key={action.label} className="flex flex-col items-center gap-2 p-4 cursor-pointer group" onClick={() => navigate(action.path)}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                  background: colors.buttonGradient,
                  boxShadow: `0 4px 12px ${colors.glowColor}`
                }}>
                <Icon size={22} style={{ color: colors.buttonText }} />
              </div>
              <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 500 }}>{action.label}</span>
            </GlassCard>
          );
        })}
      </div>

      {/* Recent Activity */}
      <GlassCard className="p-5">
        <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>Recent Activity</h3>
        <div className="imitr-stagger">
          {recentActivity.map((a, i) => (
            <div
              key={a.id}
              className="flex items-center justify-between py-3"
              style={i < recentActivity.length - 1 ? { borderBottom: `1px solid ${colors.cardBorder}` } : {}}
            >
              <div>
                <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px', display: 'block' }}>{a.action}</span>
                <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>{a.details}</span>
              </div>
              <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px', flexShrink: 0 }}>{a.time}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* ─── Request Coin Pack Modal ─── */}
      {showRequestModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowRequestModal(false); }}
        >
          <div
            className="relative mx-4 w-full max-w-md overflow-hidden rounded-3xl"
            style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}
          >
            {!requestSuccess ? (
              <div className="p-6">
                {/* Header */}
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{ background: colors.buttonGradient }}
                    >
                      <ShoppingCart size={20} style={{ color: colors.buttonText }} />
                    </div>
                    <div>
                      <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '18px' }}>
                        Request Coin Pack
                      </h3>
                      <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                        From Super Admin
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full"
                    style={{ background: `${colors.textSecondary}15` }}
                  >
                    <X size={18} style={{ color: colors.textSecondary }} />
                  </button>
                </div>

                {/* Deal Details */}
                <div
                  className="mb-5 rounded-2xl p-5 text-center"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.primary}03 100%)`,
                    border: `1px solid ${colors.primary}20`,
                  }}
                >
                  <div className="mb-3 flex items-center justify-center gap-4">
                    <div>
                      <Coins size={28} style={{ color: colors.primary, margin: '0 auto 4px' }} />
                      <span style={{ color: colors.text, fontSize: '28px', fontFamily: "'Playfair Display', serif", display: 'block' }}>
                        {COIN_PACK_SIZE.toLocaleString()}
                      </span>
                      <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                        COINS
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <ArrowDown size={20} style={{ color: colors.primary, transform: 'rotate(-90deg)' }} />
                      <span style={{ color: colors.primary, fontSize: '10px', fontFamily: "'Inter', sans-serif", marginTop: '2px' }}>
                        FOR
                      </span>
                    </div>
                    <div>
                      <IndianRupee size={28} style={{ color: colors.primary, margin: '0 auto 4px' }} />
                      <span style={{ color: colors.text, fontSize: '28px', fontFamily: "'Playfair Display', serif", display: 'block' }}>
                        {COIN_PACK_RUPEE_COST.toLocaleString()}
                      </span>
                      <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                        RUPEES
                      </span>
                    </div>
                  </div>
                </div>

                {/* Warning */}
                <div
                  className="mb-5 flex items-start gap-2 rounded-xl px-3 py-2.5"
                  style={{ background: '#F59E0B12', border: '1px solid #F59E0B25' }}
                >
                  <AlertTriangle size={14} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ color: '#F59E0B', fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                    Once approved, <strong>₹{COIN_PACK_RUPEE_COST.toLocaleString()} payment</strong> will be due to the Super Admin until payment is made.
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="flex-1 rounded-2xl py-3"
                    style={{
                      background: `${colors.textSecondary}10`,
                      border: `1px solid ${colors.cardBorder}`,
                      color: colors.textSecondary,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '14px',
                    }}
                  >
                    Cancel
                  </button>
                  <PremiumButton fullWidth loading={requesting} onClick={handleRequestCoins}>
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles size={16} /> Send Request
                    </span>
                  </PremiumButton>
                </div>
              </div>
            ) : (
              /* Success State */
              <div className="p-6 text-center">
                <div
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ background: `${colors.success}15`, boxShadow: `0 0 30px ${colors.success}30` }}
                >
                  <Check size={32} style={{ color: colors.success }} />
                </div>
                <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '20px', marginBottom: '8px' }}>
                  Request Sent!
                </h3>
                <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', marginBottom: '20px' }}>
                  Your request for <strong style={{ color: colors.primary }}>10,000 coins</strong> has been submitted. Super Admin will review and approve your purchase.
                </p>
                <PremiumButton fullWidth onClick={() => setShowRequestModal(false)}>
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles size={16} /> Done
                  </span>
                </PremiumButton>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
