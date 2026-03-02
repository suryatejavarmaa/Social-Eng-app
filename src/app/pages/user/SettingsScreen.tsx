import React from 'react';
import { useNavigate } from 'react-router';
import { User, Bell, Shield, HelpCircle, FileText, LogOut, ChevronRight, Globe, Lock, Crown, Check, X as XIcon, Sparkles, Coins, Phone, Video, MessageCircle, MapPin, Diamond, Clock } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { HeaderBar } from '../../components/imitr/HeaderBar';
import { BottomNav } from '../../components/imitr/BottomNav';
import { ThemeToggle } from '../../components/imitr/ThemeToggle';
import { PremiumGateOverlay } from '../../components/imitr/PremiumGate';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

// Premium vs Free comparison data
const tierComparison = [
  { feature: 'Video Call', free: true, premium: true },
  { feature: 'Audio Call', free: false, premium: true },
  { feature: 'Messaging', free: false, premium: true },
  { feature: 'Verified Badge', free: false, premium: true },
  { feature: 'Celebrity Lounge', free: false, premium: true },
  { feature: 'Location Filtering', free: false, premium: true },
  { feature: 'Signup Bonus', free: '—', premium: '100 Coins' },
  { feature: 'Min Diamond Payout', free: '100', premium: '25' },
];

const settingsGroups = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Edit Profile', path: '/edit-profile' },
      { icon: Lock, label: 'Privacy', path: '#' },
      { icon: Bell, label: 'Notifications', path: '/notifications' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Globe, label: 'Language', path: '#', value: 'English' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help & FAQ', path: '#' },
      { icon: FileText, label: 'Terms & Privacy', path: '/terms' },
      { icon: Shield, label: 'Report Issue', path: '#' },
    ],
  },
];

export function SettingsScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { userName, userPhone, logout, isPremium, upgradeToPremium, downgradeToFree, adminRequest, userAssignedAdmin } = useApp();
  const [showPremiumGate, setShowPremiumGate] = React.useState(false);
  const [showComparison, setShowComparison] = React.useState(false);

  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <ScreenWrapper noPadding>
      <div className="px-5 pb-24 pt-6 imitr-page-enter">
        <HeaderBar title="Settings" />

        {/* Profile Card */}
        <GlassCard className="mb-6 flex items-center gap-4 p-4" onClick={() => navigate('/profile-setup')}>
          <div className="flex h-14 w-14 items-center justify-center rounded-full imitr-breathe" style={{ background: colors.buttonGradient, boxShadow: `0 4px 16px ${colors.glowColor}` }}>
            <span style={{ color: colors.buttonText, fontFamily: "'Playfair Display', serif", fontSize: '20px' }}>{initials}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '16px' }}>{userName}</span>
              {isPremium && (
                <span className="flex items-center gap-1 rounded-full px-2 py-0.5"
                  style={{ background: colors.buttonGradient, fontSize: '9px', fontFamily: "'Inter', sans-serif", color: colors.buttonText, letterSpacing: '0.5px' }}>
                  <Crown size={9} /> PREMIUM
                </span>
              )}
            </div>
            <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>{userPhone}</span>
          </div>
          <ChevronRight size={18} style={{ color: colors.textSecondary }} />
        </GlassCard>

        {/* ── My Admin Section ── */}
        {userAssignedAdmin && (
          <div className="mb-5">
            <p className="mb-3" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              My Admin
            </p>
            <GlassCard className="overflow-hidden" style={{ borderColor: `${colors.primary}30`, boxShadow: `0 2px 12px ${colors.glowColor}15` }}>
              <div className="flex items-center gap-4 p-4">
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ background: colors.buttonGradient, boxShadow: `0 4px 16px ${colors.glowColor}` }}
                >
                  <span style={{ color: colors.buttonText, fontFamily: "'Playfair Display', serif", fontSize: '16px' }}>
                    {userAssignedAdmin.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '15px' }}>
                      {userAssignedAdmin.name}
                    </span>
                    <Crown size={14} style={{ color: colors.primary }} />
                  </div>
                  <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                    Creator Admin
                  </span>
                </div>
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-xl"
                  style={{ background: `${colors.success}15` }}
                >
                  <Shield size={14} style={{ color: colors.success }} />
                </div>
              </div>
              {userAssignedAdmin.email && (
                <>
                  <div style={{ height: '1px', background: colors.cardBorder }} />
                  <div className="flex items-center gap-2 px-4 py-2.5">
                    <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                      Contact: {userAssignedAdmin.email}
                    </span>
                  </div>
                </>
              )}
            </GlassCard>
          </div>
        )}

        {/* ── Premium / Free Toggle (Design Testing) ── */}
        <div className="mb-5">
          <p className="mb-3" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Account Tier
          </p>
          <GlassCard className="overflow-hidden" style={{ borderColor: colors.primary, boxShadow: `0 0 16px ${colors.glowColor}30` }}>
            {/* Toggle row */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    background: isPremium ? colors.buttonGradient : `${colors.primary}20`,
                    boxShadow: isPremium ? `0 4px 16px ${colors.glowColor}` : 'none',
                  }}
                >
                  <Crown size={20} style={{ color: isPremium ? colors.buttonText : colors.primary }} />
                </div>
                <div>
                  <span style={{ color: isPremium ? colors.primary : colors.text, fontFamily: "'Inter', sans-serif", fontSize: '15px', display: 'block' }}>
                    {isPremium ? 'Premium Account' : 'Free Account'}
                  </span>
                  <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                    {isPremium ? 'All features unlocked' : 'Video call only'}
                  </span>
                </div>
              </div>
              {/* Toggle switch */}
              <button
                onClick={() => {
                  if (isPremium) {
                    downgradeToFree();
                  } else {
                    upgradeToPremium();
                  }
                }}
                className="relative flex h-8 w-14 items-center rounded-full p-1 transition-all"
                style={{
                  background: isPremium ? colors.buttonGradient : `${colors.textSecondary}30`,
                  boxShadow: isPremium ? `0 0 12px ${colors.glowColor}` : 'none',
                }}
              >
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-full shadow-md transition-all"
                  style={{
                    background: '#fff',
                    transform: isPremium ? 'translateX(24px)' : 'translateX(0)',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {isPremium ? (
                    <Crown size={12} style={{ color: colors.primary }} />
                  ) : (
                    <Lock size={10} style={{ color: colors.textSecondary }} />
                  )}
                </div>
              </button>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: colors.cardBorder }} />

            {/* Mini status bar */}
            <div className="flex items-center gap-2 px-4 py-3">
              <div
                className="h-2 w-2 rounded-full"
                style={{
                  background: isPremium ? colors.success : colors.danger,
                  boxShadow: `0 0 6px ${isPremium ? colors.success : colors.danger}`,
                }}
              />
              <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px', flex: 1 }}>
                {isPremium
                  ? `Min payout: 25 diamonds · 100 bonus coins added`
                  : `Min payout: 100 diamonds · Limited features`}
              </span>
              <span
                className="rounded-full px-2 py-0.5"
                style={{
                  background: isPremium ? `${colors.success}20` : `${colors.danger}20`,
                  color: isPremium ? colors.success : colors.danger,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '9px',
                  letterSpacing: '0.5px',
                }}
              >
                {isPremium ? 'ACTIVE' : 'FREE'}
              </span>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: colors.cardBorder }} />

            {/* Show Comparison toggle */}
            <button
              onClick={() => setShowComparison(prev => !prev)}
              className="imitr-ripple flex w-full items-center justify-center gap-2 px-4 py-3"
            >
              <Sparkles size={13} style={{ color: colors.primary }} />
              <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                {showComparison ? 'Hide Comparison' : 'View Free vs Premium'}
              </span>
              <ChevronRight
                size={14}
                style={{
                  color: colors.primary,
                  transform: showComparison ? 'rotate(90deg)' : 'rotate(0)',
                  transition: 'transform 0.3s ease',
                }}
              />
            </button>

            {/* Comparison table */}
            {showComparison && (
              <div style={{ borderTop: `1px solid ${colors.cardBorder}` }}>
                {/* Table header */}
                <div className="flex items-center px-4 py-2.5" style={{ background: `${colors.primary}08` }}>
                  <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px', flex: 1, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    Feature
                  </span>
                  <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px', width: '56px', textAlign: 'center', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    Free
                  </span>
                  <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '11px', width: '64px', textAlign: 'center', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    Premium
                  </span>
                </div>

                {/* Comparison rows */}
                {tierComparison.map((row, i) => {
                  const icons: Record<string, React.ElementType> = {
                    'Video Call': Video,
                    'Audio Call': Phone,
                    'Messaging': MessageCircle,
                    'Verified Badge': Shield,
                    'Celebrity Lounge': Crown,
                    'Location Filtering': MapPin,
                    'Signup Bonus': Coins,
                    'Min Diamond Payout': Diamond,
                  };
                  const RowIcon = icons[row.feature] || Sparkles;

                  return (
                    <div
                      key={row.feature}
                      className="flex items-center px-4 py-3"
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
                              <Check size={12} style={{ color: colors.success }} />
                            </div>
                          ) : (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: `${colors.danger}15` }}>
                              <XIcon size={12} style={{ color: colors.danger }} />
                            </div>
                          )
                        ) : (
                          <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                            {row.free}
                          </span>
                        )}
                      </div>
                      {/* Premium column */}
                      <div className="flex w-16 items-center justify-center">
                        {typeof row.premium === 'boolean' ? (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: `${colors.success}20` }}>
                            <Check size={12} style={{ color: colors.success }} />
                          </div>
                        ) : (
                          <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                            {row.premium}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>

          {/* Design testing note */}
          <p className="mt-2 text-center" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px', opacity: 0.5 }}>
            ⚙ Toggle for design testing — switch to see UI differences
          </p>
        </div>

        {/* ── Become a Creator Admin ── */}
        <div className="mb-5">
          <p className="mb-3" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Creator Program
          </p>
          <GlassCard
            className="relative overflow-hidden"
            onClick={() => navigate('/admin-request')}
            style={{ boxShadow: `0 4px 20px ${colors.glowColor}20` }}
          >
            {/* Subtle gradient accent */}
            <div
              className="absolute inset-0 opacity-5"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, transparent 60%)` }}
            />
            <div className="relative flex items-center gap-4 p-4">
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl"
                style={{
                  background: adminRequest?.status === 'pending'
                    ? `${colors.primary}20`
                    : adminRequest?.status === 'approved'
                    ? `${colors.success}20`
                    : colors.buttonGradient,
                  boxShadow: !adminRequest ? `0 4px 16px ${colors.glowColor}` : 'none',
                }}
              >
                {adminRequest?.status === 'pending' ? (
                  <Clock size={22} style={{ color: colors.primary }} />
                ) : adminRequest?.status === 'approved' ? (
                  <Check size={22} style={{ color: colors.success }} />
                ) : (
                  <Shield size={22} style={{ color: colors.buttonText }} />
                )}
              </div>
              <div className="flex-1">
                <span className="block" style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                  {adminRequest?.status === 'pending'
                    ? 'Application Under Review'
                    : adminRequest?.status === 'approved'
                    ? 'Admin Access Granted'
                    : 'Become a Creator Admin'}
                </span>
                <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                  {adminRequest?.status === 'pending'
                    ? 'Super Admin is reviewing your request'
                    : adminRequest?.status === 'approved'
                    ? 'You have creator admin privileges'
                    : 'Manage users, coins & grow your community'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {adminRequest?.status === 'pending' && (
                  <span
                    className="rounded-full px-2 py-0.5"
                    style={{
                      background: `${colors.primary}20`,
                      color: colors.primary,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '9px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    PENDING
                  </span>
                )}
                {adminRequest?.status === 'approved' && (
                  <span
                    className="rounded-full px-2 py-0.5"
                    style={{
                      background: `${colors.success}20`,
                      color: colors.success,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '9px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    ACTIVE
                  </span>
                )}
                <ChevronRight size={16} style={{ color: colors.textSecondary }} />
              </div>
            </div>
          </GlassCard>

          {/* Go to Admin Panel button when approved */}
          {adminRequest?.status === 'approved' && (
            <GlassCard
              className="mt-3 overflow-hidden"
              onClick={() => navigate('/admin/dashboard')}
              style={{ borderColor: `${colors.success}40`, boxShadow: `0 2px 12px ${colors.success}15` }}
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: `${colors.success}15` }}
                  >
                    <Shield size={18} style={{ color: colors.success }} />
                  </div>
                  <div>
                    <span className="block" style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                      Open Admin Panel
                    </span>
                    <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                      Access your Creator Admin dashboard
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: colors.success }} />
              </div>
            </GlassCard>
          )}
        </div>

        {settingsGroups.map((group) => (
          <div key={group.title} className="mb-5">
            <p className="mb-3" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {group.title}
            </p>
            <GlassCard className="overflow-hidden">
              {group.items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => item.path !== '#' && navigate(item.path)}
                    className="imitr-ripple flex w-full items-center justify-between p-4"
                    style={i < group.items.length - 1 ? { borderBottom: `1px solid ${colors.cardBorder}` } : {}}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} style={{ color: colors.primary }} />
                      <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.value && <span style={{ color: colors.textSecondary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>{item.value}</span>}
                      <ChevronRight size={16} style={{ color: colors.textSecondary }} />
                    </div>
                  </button>
                );
              })}
            </GlassCard>
          </div>
        ))}

        <button
          onClick={handleLogout}
          className="imitr-ripple flex w-full items-center justify-center gap-2 rounded-2xl p-4"
          style={{ background: `${colors.danger}15`, border: `1px solid ${colors.danger}30` }}
        >
          <LogOut size={18} style={{ color: colors.danger }} />
          <span style={{ color: colors.danger, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>Log Out</span>
        </button>
      </div>
      <BottomNav />
      <PremiumGateOverlay
        isOpen={showPremiumGate}
        onClose={() => setShowPremiumGate(false)}
      />
    </ScreenWrapper>
  );
}