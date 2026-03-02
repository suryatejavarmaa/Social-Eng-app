import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, Users, Coins, Phone, Diamond, Bell, FileText, Settings, LogOut, BarChart3, Clock, ShoppingCart, Zap, User } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { useTheme } from '../../context/ThemeContext';
import { ThemeToggle } from '../../components/imitr/ThemeToggle';
import { useApp } from '../../context/AppContext';

const sideNav = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/recharge-requests', icon: Zap, label: 'Recharge Req' },
  { path: '/admin/buy-coins', icon: ShoppingCart, label: 'Buy Coins' },
  { path: '/admin/users', icon: Users, label: 'Users' },
  { path: '/admin/coins', icon: Coins, label: 'Transactions' },
  { path: '/admin/calls', icon: Phone, label: 'Calls' },
  { path: '/admin/withdrawals', icon: Diamond, label: 'Withdrawals' },
  { path: '/admin/diamonds', icon: Diamond, label: 'Diamonds' },
  { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
  { path: '/admin/notifications', icon: Bell, label: 'Notifications' },
  { path: '/admin/audit', icon: Clock, label: 'Audit' },
  { path: '/admin/profile', icon: Settings, label: 'Profile' },
];

export function AdminLayout() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { withdrawRequests, coinPurchaseRequests, coinRechargeRequests, admins } = useApp();
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const profileMenuRef = React.useRef<HTMLDivElement>(null);

  const admin = admins.find(a => a.status === 'active') || admins[0];
  const adminInitials = admin ? admin.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) : 'AD';

  // Close profile menu on outside click
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showProfileMenu]);

  const pendingWithdrawals = withdrawRequests.filter(w => w.status === 'pending').length;
  const approvedWithdrawals = withdrawRequests.filter(w => w.status === 'approved').length;
  const unpaidCoinPurchases = coinPurchaseRequests.filter(r => r.status === 'approved').length;
  const pendingRechargeRequests = coinRechargeRequests.filter(r => r.status === 'pending' && r.adminIds.includes('ADM-001')).length;

  const getBadge = (path: string) => {
    if (path === '/admin/withdrawals' && (pendingWithdrawals + approvedWithdrawals) > 0) return pendingWithdrawals + approvedWithdrawals;
    if (path === '/admin/buy-coins' && unpaidCoinPurchases > 0) return unpaidCoinPurchases;
    if (path === '/admin/recharge-requests' && pendingRechargeRequests > 0) return pendingRechargeRequests;
    return 0;
  };

  return (
    <ScreenWrapper noPadding showThemeToggle={false}>
      <div className="flex min-h-screen">
        {/* Sidebar - hidden on mobile, visible on wider screens */}
        <aside
          className="hidden w-64 flex-col p-4 lg:flex"
          style={{
            background: colors.cardBg,
            backdropFilter: 'blur(24px)',
            borderRight: `1px solid ${colors.cardBorder}`,
          }}
        >
          <div className="mb-8 flex items-center gap-3 px-3 pt-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: colors.buttonGradient }}>
              <span style={{ color: colors.buttonText, fontFamily: "'Playfair Display', serif", fontSize: '14px' }}>IM</span>
            </div>
            <div>
              <span style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '16px' }}>IMITR</span>
              <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif", display: 'block' }}>Admin Panel</span>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {sideNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const badge = getBadge(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="imitr-ripple flex w-full items-center gap-3 rounded-xl px-3 py-2.5"
                  style={{
                    background: isActive ? `${colors.primary}15` : 'transparent',
                    color: isActive ? colors.primary : colors.textSecondary,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '13px',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? `inset 0 0 12px ${colors.glowColor}` : 'none',
                  }}
                >
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

          <button
            onClick={() => navigate('/')}
            className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-2.5"
            style={{ color: colors.danger, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </aside>

        {/* Mobile bottom nav */}
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

        {/* Main content */}
        <main className="flex-1 overflow-auto pb-20 lg:pb-0 imitr-scroll">
          <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: colors.cardBorder }}>
            <h2 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>Admin Panel</h2>
            <div className="flex items-center gap-3">
              <ThemeToggle />

              {/* Profile Avatar Button */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(prev => !prev)}
                  className="imitr-ripple flex h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    background: 'transparent',
                    border: `2px solid ${showProfileMenu ? colors.primary : colors.primary}80`,
                    transition: 'all 0.3s ease',
                    boxShadow: showProfileMenu ? `0 0 14px ${colors.glowColor}, inset 0 0 8px ${colors.glowColor}30` : 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                    e.currentTarget.style.boxShadow = `0 0 14px ${colors.glowColor}, inset 0 0 8px ${colors.glowColor}30`;
                  }}
                  onMouseLeave={(e) => {
                    if (!showProfileMenu) {
                      e.currentTarget.style.borderColor = `${colors.primary}80`;
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <span style={{ color: colors.primary, fontFamily: "'Playfair Display', serif", fontSize: '13px', letterSpacing: '0.5px' }}>
                    {adminInitials}
                  </span>
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div
                    className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl"
                    style={{
                      background: colors.cardBg,
                      backdropFilter: 'blur(24px)',
                      border: `1px solid ${colors.cardBorder}`,
                      boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 20px ${colors.glowColor}20`,
                    }}
                  >
                    {/* Admin Info Header */}
                    <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ background: colors.buttonGradient, boxShadow: `0 2px 10px ${colors.glowColor}` }}
                      >
                        <span style={{ color: colors.buttonText, fontFamily: "'Playfair Display', serif", fontSize: '13px' }}>
                          {adminInitials}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px', display: 'block' }}>
                          {admin?.name || 'Admin'}
                        </span>
                        <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>
                          {admin?.email || 'admin@imitr.com'}
                        </span>
                      </div>
                    </div>

                    {/* Menu Items */}
                    {[
                      { icon: User, label: 'View Profile', action: () => { navigate('/admin/profile'); setShowProfileMenu(false); } },
                      { icon: Settings, label: 'Edit Profile', action: () => { navigate('/admin/edit-profile'); setShowProfileMenu(false); } },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          onClick={item.action}
                          className="imitr-ripple flex w-full items-center gap-3 px-4 py-3"
                          style={{
                            borderBottom: `1px solid ${colors.cardBorder}`,
                            transition: 'background 0.2s ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = `${colors.primary}10`; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <Icon size={16} style={{ color: colors.primary }} />
                          <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>{item.label}</span>
                        </button>
                      );
                    })}

                    {/* Logout */}
                    <button
                      onClick={() => { navigate('/'); setShowProfileMenu(false); }}
                      className="imitr-ripple flex w-full items-center gap-3 px-4 py-3"
                      onMouseEnter={(e) => { e.currentTarget.style.background = `${colors.danger}10`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <LogOut size={16} style={{ color: colors.danger }} />
                      <span style={{ color: colors.danger, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>Logout</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate('/')}
                className="imitr-ripple flex h-10 w-10 items-center justify-center rounded-full"
                style={{
                  background: 'transparent',
                  border: `2px solid ${colors.danger}60`,
                  color: colors.danger,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.danger;
                  e.currentTarget.style.boxShadow = `0 0 12px ${colors.danger}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${colors.danger}60`;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
          <div className="p-5 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </ScreenWrapper>
  );
}