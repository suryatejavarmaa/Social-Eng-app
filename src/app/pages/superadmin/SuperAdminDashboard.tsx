import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Coins, Diamond, Users, Phone, TrendingUp, Crown, Shield,
  CreditCard, Bell, Clock, BarChart3, Activity, Globe, Server,
  AlertCircle,
} from 'lucide-react';
import { GlassCard } from '../../components/imitr/GlassCard';
import { StatCard } from '../../components/imitr/StatCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

const systemHealth = [
  { label: 'API Uptime', value: '99.97%', status: 'healthy' },
  { label: 'Twilio Status', value: 'Active', status: 'healthy' },
  { label: 'Razorpay', value: 'Connected', status: 'healthy' },
  { label: 'DB Load', value: '23%', status: 'healthy' },
];

const adminActivity = [
  { id: '1', admin: 'Admin Suresh', action: 'Approved withdrawal', details: '200 diamonds for Priya P.', time: '8 min ago' },
  { id: '2', admin: 'Admin Kavita', action: 'Created user', details: 'New user Vikram S.', time: '25 min ago' },
  { id: '3', admin: 'Admin Suresh', action: 'Bought coins', details: '50,000 coins purchased', time: '1 hr ago' },
  { id: '4', admin: 'Admin Ravi', action: 'Rejected withdrawal', details: '150 diamonds for Arjun N.', time: '2 hrs ago' },
  { id: '5', admin: 'Admin Kavita', action: 'Blocked user', details: 'User USR-089 blocked', time: '4 hrs ago' },
];

const revenueBreakdown = [
  { label: 'Coin Sales', value: '₹4,28,500', pct: '62%' },
  { label: 'Diamond Settlements', value: '₹1,45,200', pct: '21%' },
  { label: 'Platform Fees', value: '₹87,300', pct: '12%' },
  { label: 'Other', value: '₹34,000', pct: '5%' },
];

export function SuperAdminDashboard() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { admins, totalMintedCoins, totalSystemDiamonds, totalCoinsInCirculation, totalDiamondsConverted, coinPurchaseRequests, adminRequests } = useApp();

  const activeAdmins = admins.filter(a => a.status === 'active').length;
  const totalUsersUnderAdmins = admins.reduce((s, a) => s + a.users, 0);
  const pendingCoinRequests = coinPurchaseRequests.filter(r => r.status === 'pending').length;
  const pendingAdminRequests = adminRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="imitr-page-enter">
      {/* ─── Pending Coin Requests Alert ─── */}
      {pendingCoinRequests > 0 && (
        <GlassCard
          className="mb-5 flex cursor-pointer items-center justify-between p-4"
          onClick={() => navigate('/superadmin/coins')}
          style={{ border: `1px solid ${colors.primary}30` }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${colors.primary}20` }}>
              <AlertCircle size={18} style={{ color: colors.primary }} />
            </div>
            <div>
              <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                {pendingCoinRequests} Coin Purchase Request{pendingCoinRequests > 1 ? 's' : ''} Pending
              </span>
              <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                Creator Admins are waiting for approval
              </span>
            </div>
          </div>
          <PremiumButton size="sm" onClick={() => navigate('/superadmin/coins')}>
            Review
          </PremiumButton>
        </GlassCard>
      )}

      {/* ─── Pending Admin Requests Alert ─── */}
      {pendingAdminRequests > 0 && (
        <GlassCard
          className="mb-5 flex cursor-pointer items-center justify-between p-4"
          onClick={() => navigate('/superadmin/admin-requests')}
          style={{ border: `1px solid ${colors.primary}30` }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${colors.primary}20` }}>
              <Shield size={18} style={{ color: colors.primary }} />
            </div>
            <div>
              <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                {pendingAdminRequests} Admin Request{pendingAdminRequests > 1 ? 's' : ''} Pending
              </span>
              <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                Users want to become Creator Admins
              </span>
            </div>
          </div>
          <PremiumButton size="sm" onClick={() => navigate('/superadmin/admin-requests')}>
            Review
          </PremiumButton>
        </GlassCard>
      )}

      {/* System Stats */}
      <div className="imitr-stagger mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={<Crown size={20} />} label="Active Admins" value={activeAdmins.toString()} trend={`/${admins.length} total`} trendUp onClick={() => navigate('/superadmin/admins')} />
        <StatCard icon={<Users size={20} />} label="Users (under admins)" value={totalUsersUnderAdmins.toLocaleString()} trend="+4.8%" trendUp onClick={() => navigate('/superadmin/admins')} />
        <StatCard icon={<Coins size={20} />} label="Coins in System" value={`${(totalMintedCoins / 1000000).toFixed(1)}M`} trend="+12%" trendUp onClick={() => navigate('/superadmin/coins')} />
        <StatCard icon={<Diamond size={20} />} label="Diamonds Generated" value={`${(totalSystemDiamonds / 1000000).toFixed(1)}M`} trend={`${(totalDiamondsConverted / 1000).toFixed(0)}K converted`} trendUp onClick={() => navigate('/superadmin/diamonds')} />
      </div>

      {/* System Health */}
      <GlassCard className="mb-6 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>System Health</h3>
          <span className="flex items-center gap-1 rounded-full px-2 py-1"
            style={{ background: `${colors.success}20`, color: colors.success, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
            <Activity size={12} /> All Systems Operational
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {systemHealth.map((s) => (
            <div key={s.label} className="flex items-center gap-3 rounded-xl p-3" style={{ background: `${colors.primary}08` }}>
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: colors.success, boxShadow: `0 0 8px ${colors.success}` }} />
              <div>
                <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{s.label}</span>
                <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>{s.value}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Revenue Overview */}
      <GlassCard className="mb-6 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>Revenue Overview</h3>
          <span className="flex items-center gap-1 rounded-full px-2 py-1"
            style={{ background: `${colors.success}20`, color: colors.success, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
            <TrendingUp size={12} /> +22.4%
          </span>
        </div>
        <div className="mb-5 grid grid-cols-3 gap-4">
          {[
            { label: 'Today', value: '₹1,24,500' },
            { label: 'This Week', value: '₹6,78,200' },
            { label: 'This Month', value: '₹28,45,000' },
          ].map((r) => (
            <div key={r.label} className="rounded-xl p-3" style={{ background: `${colors.primary}10` }}>
              <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{r.label}</span>
              <span style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '18px' }}>{r.value}</span>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {revenueBreakdown.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>{item.label}</span>
                  <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>{item.value}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full" style={{ background: `${colors.primary}15` }}>
                  <div className="h-full rounded-full" style={{ background: colors.buttonGradient, width: item.pct }} />
                </div>
              </div>
              <span style={{ color: colors.primary, fontSize: '12px', fontFamily: "'Inter', sans-serif", width: '36px', textAlign: 'right' }}>{item.pct}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Quick Actions */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Manage Admins', icon: Crown, path: '/superadmin/admins' },
          { label: 'Mint Coins', icon: Coins, path: '/superadmin/coins' },
          { label: 'Analytics', icon: BarChart3, path: '/superadmin/analytics' },
          { label: 'Announcements', icon: Bell, path: '/superadmin/announcements' },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <GlassCard key={action.label} className="imitr-ripple flex flex-col items-center gap-2 p-4 cursor-pointer group" onClick={() => navigate(action.path)}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110" 
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

      {/* Platform Metrics */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={<Phone size={18} />} label="Today's Calls" value="3,842" trend="+11%" trendUp />
        <StatCard icon={<CreditCard size={18} />} label="Today's Revenue" value="₹1.24L" trend="+18%" trendUp />
        <StatCard icon={<Globe size={18} />} label="Active Now" value="1,247" trend="+3%" trendUp />
        <StatCard icon={<Server size={18} />} label="Avg Response" value="124ms" trend="-8%" trendUp />
      </div>

      {/* Admin Activity Feed */}
      <GlassCard className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>Admin Activity Feed</h3>
          <button onClick={() => navigate('/superadmin/audit')} style={{ color: colors.primary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
            View All →
          </button>
        </div>
        {adminActivity.map((a, i) => (
          <div key={a.id} className="flex items-start gap-3 py-3"
            style={i < adminActivity.length - 1 ? { borderBottom: `1px solid ${colors.cardBorder}` } : {}}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: `${colors.primary}15`, flexShrink: 0 }}>
              <Shield size={14} style={{ color: colors.primary }} />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>{a.admin}</span>
                <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif", flexShrink: 0 }}>{a.time}</span>
              </div>
              <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
                {a.action} — {a.details}
              </span>
            </div>
          </div>
        ))}
      </GlassCard>
    </div>
  );
}