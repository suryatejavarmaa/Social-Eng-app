import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, Users, Coins, Diamond, Phone, CreditCard, Settings, LogOut, Crown, BarChart3, Shield, Bell, Clock, Star } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { useTheme } from '../../context/ThemeContext';
import { ThemeToggle } from '../../components/imitr/ThemeToggle';
import { useApp } from '../../context/AppContext';

const sideNav = [
  { path: '/superadmin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/superadmin/admins', icon: Crown, label: 'Admins' },
  { path: '/superadmin/admin-requests', icon: Shield, label: 'Admin Requests' },
  { path: '/superadmin/celebrities', icon: Star, label: 'Celebrities' },
  { path: '/superadmin/coins', icon: Coins, label: 'Coin Mint' },
  { path: '/superadmin/diamonds', icon: Diamond, label: 'Diamonds' },
  { path: '/superadmin/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/superadmin/payments', icon: CreditCard, label: 'Payments' },
  { path: '/superadmin/announcements', icon: Bell, label: 'Announcements' },
  { path: '/superadmin/audit', icon: Clock, label: 'Audit Logs' },
  { path: '/superadmin/profile', icon: Settings, label: 'Settings' },
];

export function SuperAdminLayout() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { adminRequests, coinPurchaseRequests } = useApp();

  const pendingAdminRequests = adminRequests.filter(r => r.status === 'pending').length;
  const pendingCoinRequests = coinPurchaseRequests.filter(r => r.status === 'pending').length;

  const getBadge = (path: string) => {
    if (path === '/superadmin/admin-requests' && pendingAdminRequests > 0) return pendingAdminRequests;
    if (path === '/superadmin/coins' && pendingCoinRequests > 0) return pendingCoinRequests;
    return 0;
  };

  return (
    <ScreenWrapper noPadding showThemeToggle={false}>
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-col p-4 lg:flex" style={{ background: colors.cardBg, backdropFilter: 'blur(24px)', borderRight: `1px solid ${colors.cardBorder}` }}>
          <div className="mb-8 flex items-center gap-3 px-3 pt-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: colors.buttonGradient }}>
              <Crown size={18} style={{ color: colors.buttonText }} />
            </div>
            <div>
              <span style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '16px' }}>IMITR</span>
              <span style={{ color: colors.primary, fontSize: '10px', fontFamily: "'Inter', sans-serif", display: 'block' }}>Super Admin</span>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            {sideNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const badge = getBadge(item.path);
              return (
                <button key={item.path} onClick={() => navigate(item.path)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5"
                  style={{ background: isActive ? `${colors.primary}15` : 'transparent', color: isActive ? colors.primary : colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                  <Icon size={18} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {badge > 0 && (
                    <span
                      className="flex h-5 min-w-5 items-center justify-center rounded-full px-1"
                      style={{ background: colors.primary, color: colors.buttonText, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
          <button onClick={() => navigate('/')} className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-2.5" style={{ color: colors.danger, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
            <LogOut size={18} />Logout
          </button>
        </aside>

        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-1 py-2 imitr-glass lg:hidden"
          style={{ background: colors.navBg, borderTop: `1px solid ${colors.cardBorder}` }}>
          {sideNav.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const badge = getBadge(item.path);
            return (
              <button key={item.path} onClick={() => navigate(item.path)} className="imitr-ripple relative flex flex-col items-center gap-0.5 px-2 py-1">
                {isActive && (
                  <div className="absolute -top-2 h-0.5 w-5 rounded-full" style={{ background: colors.buttonGradient, boxShadow: `0 0 6px ${colors.glowColor}` }} />
                )}
                <Icon size={18} style={{ color: isActive ? colors.primary : colors.inactive, filter: isActive ? `drop-shadow(0 0 4px ${colors.glowColor})` : 'none', transition: 'all 0.3s ease' }} />
                <span style={{ color: isActive ? colors.primary : colors.inactive, fontSize: '9px', fontFamily: "'Inter', sans-serif" }}>{item.label}</span>
                {badge > 0 && (
                  <span
                    className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-0.5"
                    style={{ background: colors.danger, color: '#fff', fontSize: '9px', fontFamily: "'Inter', sans-serif" }}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <main className="flex-1 overflow-auto pb-20 lg:pb-0 imitr-scroll">
          <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: colors.cardBorder }}>
            <div className="flex items-center gap-2">
              <Crown size={20} style={{ color: colors.primary }} />
              <h2 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>Super Admin</h2>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => navigate('/')}
                className="imitr-ripple flex items-center gap-2 rounded-xl px-4 py-2"
                style={{
                  background: `${colors.danger}15`,
                  border: `1px solid ${colors.danger}30`,
                  color: colors.danger,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${colors.danger}25`;
                  e.currentTarget.style.boxShadow = `0 0 12px ${colors.danger}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${colors.danger}15`;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
          <div className="p-5 lg:p-6"><Outlet /></div>
        </main>
      </div>
    </ScreenWrapper>
  );
}