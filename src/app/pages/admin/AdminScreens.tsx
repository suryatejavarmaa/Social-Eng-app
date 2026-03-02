import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Coins, Users, Phone, Diamond, Plus, Search, ChevronRight, Check, X,
  ArrowDownLeft, ArrowUpRight, Clock, Eye, Ban, BarChart3,
  Bell, User, Shield, Building2, Send, AlertCircle, Sparkles, Settings,
} from 'lucide-react';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { PremiumInput } from '../../components/imitr/PremiumInput';
import { StatCard } from '../../components/imitr/StatCard';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { DIAMOND_TO_RUPEE, MIN_WITHDRAW_DIAMONDS, COIN_DIAMOND_RATE } from '../../context/AppContext';
import { COIN_TO_RUPEE_RATIO, COIN_PACK_SIZE, COIN_PACK_RUPEE_COST } from '../../context/AppContext';
import { mockUsers } from '../../data/mockUsers';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

// A-05 Buy Coins — uses the coin purchase request flow (Admin → Super Admin)
export function AdminBuyCoins() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const {
    adminCoinInventory, adminPaymentDebt, coinPurchaseRequests,
    requestCoinPurchase,
  } = useApp();
  const [requesting, setRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [coinAmount, setCoinAmount] = useState('');

  const parsedCoins = parseInt(coinAmount) || 0;
  const calculatedRupees = Math.round(parsedCoins * COIN_TO_RUPEE_RATIO);

  const pendingCoinRequests = coinPurchaseRequests.filter(r => r.status === 'pending').length;
  const approvedUnpaid = coinPurchaseRequests.filter(r => r.status === 'approved').length;

  const handleRequestCoins = () => {
    if (parsedCoins < 100) return;
    setRequesting(true);
    setTimeout(() => {
      requestCoinPurchase(parsedCoins);
      setRequesting(false);
      setRequestSuccess(true);
      setCoinAmount('');
      setTimeout(() => setRequestSuccess(false), 3000);
    }, 1500);
  };

  // Quick-select presets
  const presets = [5000, 10000, 20000, 50000];

  return (
    <div className="imitr-page-enter">
      <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>Buy Coins from Super Admin</h3>

      {/* Current Inventory */}
      <GlassCard className="mb-5 p-5">
        <div className="flex items-center justify-between mb-2">
          <span style={{ color: colors.textSecondary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>Current Inventory</span>
          <span className="flex items-center gap-1 imitr-counter" style={{ color: colors.primary, fontFamily: "'Playfair Display', serif", fontSize: '22px' }}>
            <Coins size={18} /> {adminCoinInventory.toLocaleString()}
          </span>
        </div>
        {adminPaymentDebt > 0 && (
          <div className="flex items-center gap-2 mt-2 rounded-xl px-3 py-2" style={{ background: `${colors.danger}10`, border: `1px solid ${colors.danger}20` }}>
            <AlertCircle size={14} style={{ color: colors.danger }} />
            <span style={{ color: colors.danger, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
              Outstanding payment: ₹{adminPaymentDebt.toLocaleString()}
            </span>
          </div>
        )}
      </GlassCard>

      {/* Coin Request Card */}
      <GlassCard className="mb-5 overflow-hidden">
        <div className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: colors.buttonGradient }}>
              <Coins size={18} style={{ color: colors.buttonText }} />
            </div>
            <div>
              <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '16px' }}>Request Coins</h4>
              <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                Rate: ₹{COIN_TO_RUPEE_RATIO}/coin · {(COIN_PACK_SIZE / 1000).toFixed(0)}K coins = ₹{COIN_PACK_RUPEE_COST.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Coin Amount Input */}
          <PremiumInput
            label="How many coins do you need?"
            placeholder="Enter coin amount (min 100)"
            value={coinAmount}
            onChange={(e) => setCoinAmount(e.target.value.replace(/\D/g, ''))}
            type="text"
            icon={<Coins size={18} />}
            className="mb-3"
          />

          {/* Quick Select Presets */}
          <div className="mb-4 flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => setCoinAmount(preset.toString())}
                className="imitr-ripple rounded-xl px-3 py-2"
                style={{
                  background: parsedCoins === preset ? colors.buttonGradient : `${colors.primary}10`,
                  color: parsedCoins === preset ? colors.buttonText : colors.primary,
                  fontSize: '12px',
                  fontFamily: "'Inter', sans-serif",
                  border: `1px solid ${parsedCoins === preset ? 'transparent' : `${colors.primary}25`}`,
                  transition: 'all 0.3s ease',
                }}
              >
                {preset.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Live Cost Preview */}
          {parsedCoins >= 100 && (
            <div className="mb-4 grid grid-cols-2 gap-3 rounded-2xl p-4" style={{ background: `${colors.primary}06`, border: `1px solid ${colors.primary}15` }}>
              <div className="text-center">
                <span className="flex items-center justify-center gap-1.5" style={{ color: colors.primary, fontSize: '22px', fontFamily: "'Playfair Display', serif" }}>
                  <Coins size={18} /> {parsedCoins.toLocaleString()}
                </span>
                <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>COINS</span>
              </div>
              <div className="text-center">
                <span className="flex items-center justify-center gap-1.5" style={{ color: colors.primary, fontSize: '22px', fontFamily: "'Playfair Display', serif" }}>
                  ₹{calculatedRupees.toLocaleString()}
                </span>
                <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>RUPEES</span>
              </div>
            </div>
          )}

          <div className="mb-4 flex items-start gap-2 rounded-xl px-3 py-2.5" style={{ background: '#F59E0B12', border: '1px solid #F59E0B25' }}>
            <AlertCircle size={14} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '1px' }} />
            <span style={{ color: '#F59E0B', fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
              Once approved, <strong>₹{calculatedRupees.toLocaleString()}</strong> payment will be due until payment is made to Super Admin.
            </span>
          </div>
          <PremiumButton fullWidth loading={requesting} onClick={handleRequestCoins} disabled={parsedCoins < 100}>
            <span className="flex items-center justify-center gap-2">
              {requestSuccess ? <><Check size={16} /> Request Sent!</> : <><Send size={16} /> Request {parsedCoins >= 100 ? `${parsedCoins.toLocaleString()} Coins` : 'Coin Pack'}</>}
            </span>
          </PremiumButton>
        </div>
      </GlassCard>

      {/* My Purchase Requests */}
      {coinPurchaseRequests.length > 0 && (
        <GlassCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>My Purchase Requests</h4>
            {pendingCoinRequests > 0 && (
              <span className="flex items-center gap-1 rounded-full px-2 py-1" style={{ background: `${colors.primary}15`, color: colors.primary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                {pendingCoinRequests} pending
              </span>
            )}
          </div>
          <div className="space-y-3">
            {coinPurchaseRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between rounded-xl p-3" style={{
                background: req.status === 'approved' ? `${colors.danger}06` : `${colors.primary}06`,
                border: `1px solid ${req.status === 'approved' ? `${colors.danger}15` : req.status === 'paid' ? `${colors.success}15` : req.status === 'rejected' ? `${colors.textSecondary}15` : `${colors.primary}15`}`,
              }}>
                <div>
                  <div className="flex items-center gap-2">
                    <Coins size={14} style={{ color: colors.primary }} />
                    <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>{req.coinsPack.toLocaleString()} coins</span>
                    <span style={{ color: colors.textSecondary, fontSize: '11px' }}>|</span>
                    <span style={{ color: colors.primary, fontSize: '12px' }}>₹</span>
                    <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>{req.rupeeCost.toLocaleString()}</span>
                  </div>
                  <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>{req.requestedAt}</span>
                </div>
                <span className="rounded-full px-2.5 py-1" style={{
                  background: req.status === 'pending' ? `${colors.primary}15` : req.status === 'approved' ? `${colors.danger}15` : req.status === 'paid' ? `${colors.success}15` : `${colors.textSecondary}15`,
                  color: req.status === 'pending' ? colors.primary : req.status === 'approved' ? colors.danger : req.status === 'paid' ? colors.success : colors.textSecondary,
                  fontSize: '10px', fontFamily: "'Inter', sans-serif", textTransform: 'capitalize',
                }}>
                  {req.status === 'approved' ? `Unpaid (₹${req.rupeeCost.toLocaleString()})` : req.status}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}

// A-06 Purchase History — now uses real coinPurchaseRequests from AppContext
export function AdminPurchaseHistory() {
  const { colors } = useTheme();
  const { coinPurchaseRequests } = useApp();

  const statusColor = (status: string) => {
    switch (status) {
      case 'paid': return colors.success;
      case 'approved': return colors.danger;
      case 'rejected': return colors.textSecondary;
      default: return colors.primary;
    }
  };
  const statusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'approved': return 'Unpaid';
      case 'rejected': return 'Rejected';
      default: return 'Pending';
    }
  };

  return (
    <div className="imitr-page-enter">
      <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>Coin Purchase History</h3>
      {coinPurchaseRequests.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <Coins size={32} style={{ color: colors.primary, opacity: 0.3, margin: '0 auto 8px' }} />
          <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
            No coin purchases yet. Request a coin pack from the Buy Coins page.
          </p>
        </GlassCard>
      ) : (
        <div className="imitr-stagger">
          {coinPurchaseRequests.map((req) => (
            <GlassCard key={req.id} className="mb-3 flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{
                  background: req.status === 'paid' ? `${colors.success}15` :
                    req.status === 'approved' ? `${colors.danger}15` : `${colors.primary}15`,
                }}>
                  {req.status === 'paid' ? <Check size={18} style={{ color: colors.success }} /> :
                    req.status === 'approved' ? <AlertCircle size={18} style={{ color: colors.danger }} /> :
                    <Coins size={18} style={{ color: colors.primary }} />}
                </div>
                <div>
                  <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                    {req.coinsPack.toLocaleString()} coins
                  </span>
                  <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                    {req.requestedAt}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="flex items-center justify-end gap-1" style={{ color: colors.primary, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
                  ₹{req.rupeeCost.toLocaleString()}
                </span>
                <span className="mt-1 inline-block rounded-full px-2 py-0.5" style={{
                  background: `${statusColor(req.status)}20`,
                  color: statusColor(req.status),
                  fontSize: '10px',
                }}>
                  {statusLabel(req.status)}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

// A-07 Users List
export function AdminUsersList() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { adminUsers, createdUsers } = useApp();
  const [search, setSearch] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const filtered = adminUsers.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));
  const filteredCreated = createdUsers.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));
  const totalUsers = adminUsers.length + createdUsers.length;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="imitr-page-enter">
      <div className="mb-5 flex items-center justify-between">
        <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>Users ({totalUsers})</h3>
        <PremiumButton size="sm" onClick={() => navigate('/admin/create-user')}>
          <span className="flex items-center gap-1"><Plus size={14} /> New</span>
        </PremiumButton>
      </div>
      <PremiumInput placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search size={18} />} className="mb-4" />

      {/* Admin-created users with credentials */}
      {filteredCreated.length > 0 && (
        <>
          <div className="mb-2 flex items-center gap-2">
            <Shield size={13} style={{ color: colors.primary }} />
            <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Created Users ({filteredCreated.length})
            </span>
          </div>
          <div className="imitr-stagger mb-4">
            {filteredCreated.map((user) => (
              <GlassCard key={user.id} className="mb-3 overflow-hidden">
                <div className="flex items-center justify-between p-4" onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)} style={{ cursor: 'pointer' }}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full" style={{ background: colors.buttonGradient }}>
                      <User size={18} style={{ color: colors.buttonText }} />
                    </div>
                    <div>
                      <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{user.name}</span>
                      <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                        {user.city} · {user.gender} · {user.id}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full px-2 py-0.5" style={{ background: `${colors.success}20`, color: colors.success, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                    {user.status}
                  </span>
                </div>
                {expandedUserId === user.id && (
                  <div className="px-4 pb-4" style={{ borderTop: `1px solid ${colors.cardBorder}` }}>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between rounded-xl border-0 px-3 py-2" style={{ background: `${colors.primary}04` }}>
                        <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>Phone</span>
                        <span style={{ color: colors.text, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>{user.phone}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border-0 px-3 py-2" style={{ background: `${colors.primary}04` }}>
                        <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>Profile Status</span>
                        <span className="rounded-full px-2 py-0.5" style={{
                          background: user.profileCompleted ? `${colors.success}20` : `#F59E0B20`,
                          color: user.profileCompleted ? colors.success : '#F59E0B',
                          fontSize: '10px', fontFamily: "'Inter', sans-serif",
                        }}>
                          {user.profileCompleted ? 'Completed' : 'Pending Setup'}
                        </span>
                      </div>
                    </div>
                    <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif", display: 'block', marginTop: '6px' }}>
                      Created: {user.createdAt}
                    </span>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        </>
      )}

      {/* Existing mock users */}
      <div className="imitr-stagger">
        {filtered.map((user) => (
          <GlassCard key={user.id} className="mb-3 flex items-center justify-between p-4" onClick={() => navigate(`/admin/user/${user.id}`)}>
            <div className="flex items-center gap-3">
              <ImageWithFallback src={user.avatar} alt={user.name} className="h-11 w-11 rounded-full object-cover" />
              <div>
                <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{user.name}</span>
                <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                  {user.city} • {user.online ? '🟢 Online' : '⚫ Offline'}
                </span>
              </div>
            </div>
            <ChevronRight size={16} style={{ color: colors.textSecondary }} />
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

// A-08 Create User
export function AdminCreateUser() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { adminCreateUser } = useApp();

  const [form, setForm] = useState({ name: '', phone: '', city: '', gender: 'Male' as 'Male' | 'Female' | 'Other' });
  const [creating, setCreating] = useState(false);
  const [createdUser, setCreatedUser] = useState<any | null>(null);

  const isValid = form.name.length > 2 && form.phone.length > 6 && form.city.length > 1;

  const handleCreate = () => {
    if (!isValid) return;
    setCreating(true);
    setTimeout(() => {
      const user = adminCreateUser({
        name: form.name,
        phone: form.phone,
        city: form.city,
        gender: form.gender,
        adminId: 'ADM-001', // Current logged-in admin ID
        adminName: 'Suresh Kumar', // Current logged-in admin name
      });
      setCreating(false);
      setCreatedUser(user);
      setForm({ name: '', phone: '', city: '', gender: 'Male' });
    }, 1200);
  };

  // Success modal — shows credentials (matches celeb flow exactly)
  if (createdUser) {
    return (
      <div className="imitr-page-enter">
        <div className="mx-auto max-w-lg">
          <GlassCard className="mb-5 overflow-hidden">
            {/* Success Header */}
            <div className="px-6 pt-6 pb-4 text-center" style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: `${colors.success}15`, boxShadow: `0 0 30px ${colors.success}30` }}>
                <Check size={32} style={{ color: colors.success }} />
              </div>
              <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '20px', marginBottom: '4px' }}>
                User Created!
              </h3>
              <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                Account for <strong style={{ color: colors.primary }}>{createdUser.name}</strong> is now active on the platform
              </p>
            </div>

            <div className="px-6 py-4">
              {/* User Info */}
              <div className="mb-4 flex items-center gap-3 rounded-2xl p-3" style={{ background: `${colors.primary}06`, border: `1px solid ${colors.primary}15` }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: colors.buttonGradient }}>
                  <User size={20} style={{ color: colors.buttonText }} />
                </div>
                <div>
                  <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{createdUser.name}</span>
                  <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                    {createdUser.city} · {createdUser.gender} · ID: {createdUser.id}
                  </span>
                </div>
              </div>

              {/* Phone-based login info */}
              <div className="mb-4 rounded-2xl p-3" style={{ background: `${colors.success}06`, border: `1px solid ${colors.success}15` }}>
                <div className="mb-2 flex items-center gap-2">
                  <Phone size={14} style={{ color: colors.success }} />
                  <span style={{ color: colors.success, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>Login Information</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between rounded-xl border-0 px-3 py-2" style={{ background: `${colors.primary}04` }}>
                    <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>Phone</span>
                    <span style={{ color: colors.text, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>{createdUser.phone}</span>
                  </div>
                  <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif", display: 'block', marginTop: '6px' }}>
                    User can login via the User Portal using this phone number. An OTP will be sent for verification.
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <PremiumButton fullWidth onClick={() => { setCreatedUser(null); }}>
                  <span className="flex items-center justify-center gap-2"><Plus size={16} /> Create Another</span>
                </PremiumButton>
                <PremiumButton fullWidth variant="outline" onClick={() => navigate('/admin/users')}>
                  <span className="flex items-center justify-center gap-2"><Users size={16} /> View Users</span>
                </PremiumButton>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="imitr-page-enter">
      <div className="mb-5">
        <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>Create User</h3>
        <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', marginTop: '2px' }}>
          Add a new user with phone-based OTP login
        </p>
      </div>

      <GlassCard className="p-5 imitr-fade-scale">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: colors.buttonGradient }}>
            <User size={18} style={{ color: colors.buttonText }} />
          </div>
          <div>
            <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '16px' }}>User Details</h4>
            <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
              Enter name and phone — login is OTP-based
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <PremiumInput label="Full Name *" placeholder="Enter name" value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} icon={<User size={18} />} />
          <PremiumInput label="Phone Number *" placeholder="+91 00000 00000" value={form.phone} onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))} icon={<Phone size={18} />} />
          <PremiumInput label="City *" placeholder="City" value={form.city} onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))} />

          {/* Gender */}
          <div>
            <label className="mb-2 block" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>Gender</label>
            <div className="flex gap-3">
              {(['Male', 'Female', 'Other'] as const).map((g) => (
                <button key={g} onClick={() => setForm(prev => ({ ...prev, gender: g }))} className="imitr-ripple flex-1 rounded-xl py-3" style={{
                  background: form.gender === g ? colors.buttonGradient : `${colors.primary}06`,
                  color: form.gender === g ? colors.buttonText : colors.text,
                  border: `1px solid ${form.gender === g ? 'transparent' : colors.cardBorder}`,
                  fontFamily: "'Inter', sans-serif", fontSize: '13px',
                  transition: 'all 0.3s ease',
                }}>{g}</button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {form.name && (
            <div className="rounded-2xl p-3" style={{ background: `${colors.primary}06`, border: `1px solid ${colors.primary}12` }}>
              <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Preview</span>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: colors.buttonGradient }}>
                  <User size={16} style={{ color: colors.buttonText }} />
                </div>
                <div>
                  <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{form.name}</span>
                  <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                    {form.city || 'City'} · {form.gender}
                  </span>
                </div>
              </div>
            </div>
          )}

          <PremiumButton fullWidth onClick={handleCreate} disabled={!isValid} loading={creating}>
            <span className="flex items-center justify-center gap-2"><Plus size={16} /> Create User Account</span>
          </PremiumButton>
        </div>
      </GlassCard>
    </div>
  );
}

// A-09 User Detail
export function AdminUserDetail() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { createdUsers } = useApp();
  const { id } = useParams();

  // Look up from created users first, then mock users
  const createdUser = createdUsers.find((u: any) => u.id === id);
  const mockUser = mockUsers.find((u: any) => u.id === id) || mockUsers[0];

  if (createdUser) {
    return (
      <div className="imitr-page-enter">
        {/* Profile Header */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: colors.buttonGradient, boxShadow: `0 0 16px ${colors.glowColor}` }}>
            <User size={28} style={{ color: colors.buttonText }} />
          </div>
          <div className="flex-1">
            <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>{createdUser.name}</h3>
            <span style={{ color: colors.textSecondary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
              {createdUser.city} · {createdUser.gender} · ID: {createdUser.id}
            </span>
          </div>
          <span className="rounded-full px-2.5 py-1" style={{
            background: createdUser.status === 'active' ? `${colors.success}20` : `${colors.danger}20`,
            color: createdUser.status === 'active' ? colors.success : colors.danger,
            fontSize: '11px', fontFamily: "'Inter', sans-serif",
          }}>
            {createdUser.status}
          </span>
        </div>

        {/* Stats */}
        <div className="imitr-stagger mb-5 grid grid-cols-3 gap-3">
          <StatCard icon={<Coins size={16} />} label="Coins" value={createdUser.coinBalance.toLocaleString()} />
          <StatCard icon={<Diamond size={16} />} label="Diamonds" value={createdUser.diamondBalance.toLocaleString()} />
          <StatCard icon={<Phone size={16} />} label="Phone" value={createdUser.phone || '—'} />
        </div>

        {/* User Info Card */}
        <GlassCard className="mb-4 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Shield size={13} style={{ color: colors.primary }} />
            <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '11px', letterSpacing: '0.8px', textTransform: 'uppercase' as const }}>
              User Information
            </span>
          </div>
          <div className="space-y-2.5">
            {[
              { label: 'Full Name', value: createdUser.name },
              { label: 'Phone', value: createdUser.phone },
              { label: 'City', value: createdUser.city },
              { label: 'Gender', value: createdUser.gender },
              { label: 'Created', value: createdUser.createdAt },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between rounded-xl border-0 px-3 py-2" style={{ background: `${colors.primary}04` }}>
                <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>{item.label}</span>
                <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Login Info */}
        <GlassCard className="mb-4 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Phone size={14} style={{ color: colors.primary }} />
            <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '11px', letterSpacing: '0.8px', textTransform: 'uppercase' as const }}>
              Login Information
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-xl border-0 px-3 py-2" style={{ background: `${colors.primary}04` }}>
              <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>Phone</span>
              <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>{createdUser.phone}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border-0 px-3 py-2" style={{ background: `${colors.primary}04` }}>
              <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>Profile Status</span>
              <span className="rounded-full px-2 py-0.5" style={{
                background: createdUser.profileCompleted ? `${colors.success}20` : `#F59E0B20`,
                color: createdUser.profileCompleted ? colors.success : '#F59E0B',
                fontSize: '10px', fontFamily: "'Inter', sans-serif",
              }}>
                {createdUser.profileCompleted ? 'Completed' : 'Pending Setup'}
              </span>
            </div>
          </div>
          <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif", display: 'block', marginTop: '8px' }}>
            User logs in via phone OTP. No password required.
          </span>
        </GlassCard>

        {/* Actions */}
        <div className="flex gap-3">
          <PremiumButton fullWidth size="sm" variant="outline" onClick={() => navigate('/admin/users')}>
            <span className="flex items-center justify-center gap-2"><Users size={14} /> Back to List</span>
          </PremiumButton>
          <PremiumButton fullWidth size="sm" variant="danger">Block User</PremiumButton>
        </div>
      </div>
    );
  }

  // Fallback: mock user view (no credentials available for pre-existing users)
  const user = mockUser;
  return (
    <div className="imitr-page-enter">
      <div className="mb-6 flex items-center gap-4">
        <ImageWithFallback src={user.avatar} alt={user.name} className="h-16 w-16 rounded-full object-cover" style={{ border: `2px solid ${colors.primary}`, boxShadow: `0 0 16px ${colors.glowColor}` }} />
        <div>
          <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>{user.name}</h3>
          <span style={{ color: colors.textSecondary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>{user.city} • ID: {user.id}</span>
        </div>
      </div>
      <div className="imitr-stagger mb-5 grid grid-cols-3 gap-3">
        <StatCard icon={<Coins size={16} />} label="Balance" value="450" />
        <StatCard icon={<Diamond size={16} />} label="Diamonds" value="127" />
        <StatCard icon={<Phone size={16} />} label="Calls" value={user.totalCalls.toString()} />
      </div>
      <div className="flex gap-3">
        <PremiumButton fullWidth size="sm">Edit User</PremiumButton>
        <PremiumButton fullWidth size="sm" variant="danger">Block User</PremiumButton>
      </div>
    </div>
  );
}

// A-11 Coin Transactions
export function AdminCoinTransactions() {
  const { colors } = useTheme();
  const { transactions } = useApp();
  return (
    <div className="imitr-page-enter">
      <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>Coin Transactions</h3>
      <div className="imitr-stagger">
        {transactions.map((tx) => (
          <GlassCard key={tx.id} className="mb-3 flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: tx.amount > 0 ? `${colors.success}20` : `${colors.primary}15` }}>
                {tx.amount > 0 ? <ArrowDownLeft size={18} style={{ color: colors.success }} /> : <ArrowUpRight size={18} style={{ color: colors.primary }} />}
              </div>
              <div>
                <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{tx.user || tx.method || tx.type}</span>
                <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>{tx.type} • {tx.date}</span>
              </div>
            </div>
            <span style={{ color: tx.amount > 0 ? colors.success : colors.primary, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
              {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
            </span>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

// A-12 Calls Log
export function AdminCallsLog() {
  const { colors } = useTheme();
  const { callHistory } = useApp();
  return (
    <div className="imitr-page-enter">
      <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>Calls Log</h3>
      <div className="imitr-stagger">
        {callHistory.map((c) => (
          <GlassCard key={c.id} className="mb-3 p-4">
            <div className="flex items-center justify-between mb-2">
              <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>{c.userName}</span>
              <span className="rounded-full px-2 py-0.5" style={{ background: `${colors.primary}15`, color: colors.primary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>{c.type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
                <Clock size={12} className="mr-1 inline" />{Math.floor(c.duration / 60)}:{(c.duration % 60).toString().padStart(2, '0')} • {c.date}
              </span>
              <span style={{ color: colors.primary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
                <Coins size={12} className="mr-1 inline" />{c.coinsUsed} coins
              </span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

// A-14 Withdraw Requests
export function AdminWithdrawals() {
  const { colors } = useTheme();
  const {
    withdrawRequests, adminApproveWithdraw, adminRejectWithdraw, adminMarkWithdrawPaid,
    adminPaymentSettings, adminUpdatePaymentSettings, addNotification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'requests' | 'paid' | 'settings'>('requests');
  const [payingId, setPayingId] = useState<string | null>(null);
  const [payNote, setPayNote] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [localUpi, setLocalUpi] = useState(adminPaymentSettings.upiId);
  const [localBank, setLocalBank] = useState(adminPaymentSettings.bankAccount);
  const [localIfsc, setLocalIfsc] = useState(adminPaymentSettings.ifscCode);
  const [localHolder, setLocalHolder] = useState(adminPaymentSettings.accountHolderName);

  const pendingRequests = withdrawRequests.filter(w => w.status === 'pending');
  const approvedRequests = withdrawRequests.filter(w => w.status === 'approved');
  const paidRequests = withdrawRequests.filter(w => w.status === 'paid');
  const rejectedRequests = withdrawRequests.filter(w => w.status === 'rejected');

  const hasPaymentSetup = adminPaymentSettings.upiId.length > 3 || adminPaymentSettings.bankAccount.length > 3;

  const handleApprove = (id: string) => {
    adminApproveWithdraw(id);
    addNotification({ title: 'Withdrawal Approved', message: 'A payout request has been approved. Please send the payment and mark it as paid.', type: 'diamond' });
  };

  const handleReject = (id: string) => {
    adminRejectWithdraw(id);
    addNotification({ title: 'Withdrawal Rejected', message: 'A payout request has been rejected. Diamonds refunded to user.', type: 'warning' });
  };

  const handleMarkPaid = (id: string) => {
    adminMarkWithdrawPaid(id, payNote || undefined);
    addNotification({ title: 'Payment Sent', message: 'Payout marked as paid. User has been notified.', type: 'success' });
    setPayingId(null);
    setPayNote('');
  };

  const handleSaveSettings = () => {
    setSavingSettings(true);
    setTimeout(() => {
      adminUpdatePaymentSettings({
        upiId: localUpi,
        bankAccount: localBank,
        ifscCode: localIfsc,
        accountHolderName: localHolder,
      });
      setSavingSettings(false);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2000);
    }, 800);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'paid': return colors.success;
      case 'approved': return '#F59E0B';
      case 'rejected': return colors.danger;
      default: return colors.primary;
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'approved': return 'Send Payment';
      case 'rejected': return 'Rejected';
      default: return 'Pending';
    }
  };

  const tabs = [
    { key: 'requests' as const, label: 'Requests', count: pendingRequests.length + approvedRequests.length },
    { key: 'paid' as const, label: 'Paid', count: paidRequests.length },
    { key: 'settings' as const, label: 'Payment Setup', count: 0 },
  ];

  return (
    <div className="imitr-page-enter">
      <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '8px' }}>Withdrawal Requests</h3>
      <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', marginBottom: '16px' }}>
        Approve requests, send money, and mark as paid
      </p>

      {/* Payment Setup Warning */}
      {!hasPaymentSetup && activeTab !== 'settings' && (
        <GlassCard className="mb-4 flex items-start gap-3 p-4" style={{ border: `1px solid #F59E0B30`, background: '#F59E0B08' }}>
          <AlertCircle size={18} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <span style={{ color: '#F59E0B', fontSize: '13px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
              Set up your payment methods first
            </span>
            <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
              Add your UPI or bank details so you can send payouts to users.
            </span>
            <button
              onClick={() => setActiveTab('settings')}
              className="mt-2 block"
              style={{ color: '#F59E0B', fontSize: '12px', fontFamily: "'Inter', sans-serif", textDecoration: 'underline' }}
            >
              Set up now
            </button>
          </div>
        </GlassCard>
      )}

      {/* Tabs */}
      <div className="mb-5 flex gap-2">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="imitr-ripple flex-1 rounded-xl px-3 py-2.5 text-center"
            style={{
              background: activeTab === tab.key ? colors.buttonGradient : `${colors.primary}08`,
              color: activeTab === tab.key ? colors.buttonText : colors.textSecondary,
              fontSize: '12px',
              fontFamily: "'Inter', sans-serif",
              border: `1px solid ${activeTab === tab.key ? 'transparent' : `${colors.primary}15`}`,
              transition: 'all 0.3s ease',
              position: 'relative',
            }}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1"
                style={{
                  background: activeTab === tab.key ? `${colors.buttonText}30` : colors.primary,
                  color: activeTab === tab.key ? colors.buttonText : '#fff',
                  fontSize: '9px',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="imitr-stagger">
          {/* Summary Stats */}
          <div className="mb-4 grid grid-cols-3 gap-3">
            <StatCard icon={<Clock size={16} />} label="Pending" value={pendingRequests.length.toString()} />
            <StatCard icon={<AlertCircle size={16} />} label="To Pay" value={approvedRequests.length.toString()} />
            <StatCard icon={<Diamond size={16} />} label="Total ₹" value={`₹${withdrawRequests.filter(w => w.status !== 'rejected').reduce((s, w) => s + w.amount, 0).toLocaleString()}`} />
          </div>

          {/* Approved (needs payment) */}
          {approvedRequests.length > 0 && (
            <>
              <h4 style={{ color: '#F59E0B', fontFamily: "'Inter', sans-serif", fontSize: '13px', marginBottom: '8px' }}>
                Awaiting Payment ({approvedRequests.length})
              </h4>
              {approvedRequests.map((r) => (
                <GlassCard key={r.id} className="mb-3 p-4" style={{ border: `1px solid #F59E0B25` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                        {(r as any).userName || 'User'}
                      </span>
                      <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                        {r.date} | {r.method}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="flex items-center gap-1" style={{ color: colors.primary, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
                        <Diamond size={12} /> {r.diamonds}
                      </span>
                      <span style={{ color: colors.success, fontSize: '13px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                        ₹{r.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* User's Payment Details */}
                  {r.paymentDetails && (
                    <div className="mb-3 rounded-xl px-3 py-2" style={{ background: `${colors.primary}06`, border: `1px solid ${colors.primary}12` }}>
                      <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif", display: 'block', marginBottom: '2px' }}>
                        SEND PAYMENT TO
                      </span>
                      <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
                        {r.paymentDetails}
                      </span>
                    </div>
                  )}

                  {payingId === r.id ? (
                    <div className="space-y-2">
                      <PremiumInput
                        placeholder="Add a note (optional, e.g. transaction ID)"
                        value={payNote}
                        onChange={(e) => setPayNote(e.target.value)}
                        icon={<Building2 size={14} />}
                      />
                      <div className="flex gap-2">
                        <PremiumButton fullWidth size="sm" onClick={() => handleMarkPaid(r.id)}>
                          <span className="flex items-center justify-center gap-1"><Check size={14} /> Confirm Paid</span>
                        </PremiumButton>
                        <PremiumButton fullWidth size="sm" variant="outline" onClick={() => { setPayingId(null); setPayNote(''); }}>
                          Cancel
                        </PremiumButton>
                      </div>
                    </div>
                  ) : (
                    <PremiumButton fullWidth size="sm" onClick={() => setPayingId(r.id)}>
                      <span className="flex items-center justify-center gap-1"><Send size={14} /> Mark as Paid</span>
                    </PremiumButton>
                  )}
                </GlassCard>
              ))}
            </>
          )}

          {/* Pending (needs approval) */}
          {pendingRequests.length > 0 && (
            <>
              <h4 style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '13px', marginBottom: '8px', marginTop: approvedRequests.length > 0 ? '16px' : '0' }}>
                Pending Approval ({pendingRequests.length})
              </h4>
              {pendingRequests.map((r) => (
                <GlassCard key={r.id} className="mb-3 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                        {(r as any).userName || r.method}
                      </span>
                      <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                        {r.date} | {r.method}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="flex items-center gap-1" style={{ color: colors.primary, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
                        <Diamond size={12} /> {r.diamonds}
                      </span>
                      <span style={{ color: colors.success, fontSize: '13px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                        ₹{r.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {r.paymentDetails && (
                    <div className="mb-3 rounded-xl px-3 py-2" style={{ background: `${colors.primary}06`, border: `1px solid ${colors.primary}12` }}>
                      <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif", display: 'block', marginBottom: '2px' }}>
                        USER'S PAYMENT DETAILS
                      </span>
                      <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
                        {r.paymentDetails}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <PremiumButton fullWidth size="sm" onClick={() => handleApprove(r.id)}>
                      <span className="flex items-center justify-center gap-1"><Check size={14} /> Approve</span>
                    </PremiumButton>
                    <PremiumButton fullWidth size="sm" variant="danger" onClick={() => handleReject(r.id)}>
                      <span className="flex items-center justify-center gap-1"><X size={14} /> Reject</span>
                    </PremiumButton>
                  </div>
                </GlassCard>
              ))}
            </>
          )}

          {/* Rejected */}
          {rejectedRequests.length > 0 && (
            <>
              <h4 style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px', marginBottom: '8px', marginTop: '16px' }}>
                Rejected ({rejectedRequests.length})
              </h4>
              {rejectedRequests.map((r) => (
                <GlassCard key={r.id} className="mb-3 flex items-center justify-between p-4" style={{ opacity: 0.6 }}>
                  <div>
                    <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                      {(r as any).userName || r.method}
                    </span>
                    <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>{r.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="flex items-center gap-1" style={{ color: colors.textSecondary, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
                      <Diamond size={12} /> {r.diamonds}
                    </span>
                    <span className="mt-1 inline-block rounded-full px-2 py-0.5" style={{ background: `${colors.danger}20`, color: colors.danger, fontSize: '10px' }}>
                      Rejected
                    </span>
                  </div>
                </GlassCard>
              ))}
            </>
          )}

          {pendingRequests.length === 0 && approvedRequests.length === 0 && rejectedRequests.length === 0 && (
            <GlassCard className="p-8 text-center">
              <Diamond size={32} style={{ color: colors.primary, opacity: 0.3, margin: '0 auto 8px' }} />
              <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                No withdrawal requests yet
              </p>
            </GlassCard>
          )}
        </div>
      )}

      {/* Paid Tab */}
      {activeTab === 'paid' && (
        <div className="imitr-stagger">
          {paidRequests.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <Check size={32} style={{ color: colors.success, opacity: 0.3, margin: '0 auto 8px' }} />
              <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                No completed payouts yet
              </p>
            </GlassCard>
          ) : (
            paidRequests.map((r) => (
              <GlassCard key={r.id} className="mb-3 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                      {(r as any).userName || 'User'}
                    </span>
                    <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                      {r.paidAt || r.date} | {r.method}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="flex items-center gap-1" style={{ color: colors.success, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
                      <Diamond size={12} /> {r.diamonds}
                    </span>
                    <span style={{ color: colors.success, fontSize: '13px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                      ₹{r.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
                {r.paymentDetails && (
                  <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                    Sent to: {r.paymentDetails}
                  </span>
                )}
                {r.adminNote && (
                  <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif", display: 'block', fontStyle: 'italic' }}>
                    Note: {r.adminNote}
                  </span>
                )}
                <span className="mt-2 inline-block rounded-full px-2.5 py-0.5" style={{ background: `${colors.success}20`, color: colors.success, fontSize: '10px' }}>
                  Paid
                </span>
              </GlassCard>
            ))
          )}
        </div>
      )}

      {/* Payment Settings Tab */}
      {activeTab === 'settings' && (
        <div className="imitr-fade-scale">
          <GlassCard className="p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: colors.buttonGradient }}>
                <Building2 size={18} style={{ color: colors.buttonText }} />
              </div>
              <div>
                <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '16px' }}>Payment Settings</h4>
                <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                  Configure how you send money to users
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <PremiumInput
                label="UPI ID"
                placeholder="yourname@upi"
                value={localUpi}
                onChange={(e) => setLocalUpi(e.target.value)}
                icon={<Send size={14} />}
              />
              <PremiumInput
                label="Bank Account Number"
                placeholder="Enter bank account number"
                value={localBank}
                onChange={(e) => setLocalBank(e.target.value)}
                icon={<Building2 size={14} />}
              />
              <PremiumInput
                label="IFSC Code"
                placeholder="e.g. SBIN0001234"
                value={localIfsc}
                onChange={(e) => setLocalIfsc(e.target.value)}
              />
              <PremiumInput
                label="Account Holder Name"
                placeholder="Name on bank account"
                value={localHolder}
                onChange={(e) => setLocalHolder(e.target.value)}
                icon={<User size={14} />}
              />

              <PremiumButton fullWidth onClick={handleSaveSettings} loading={savingSettings}>
                <span className="flex items-center justify-center gap-2">
                  {settingsSaved ? <><Check size={16} /> Saved!</> : <><Shield size={16} /> Save Payment Settings</>}
                </span>
              </PremiumButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

// A-17 Diamond Liability
export function AdminDiamondLiability() {
  const { colors } = useTheme();
  const { adminDiamondBalance } = useApp();
  return (
    <div className="imitr-page-enter">
      <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>Diamond Liability</h3>
      <div className="imitr-stagger mb-5 grid grid-cols-2 gap-3">
        <StatCard icon={<Diamond size={18} />} label="Total Issued" value="15,840" />
        <StatCard icon={<Diamond size={18} />} label="Pending Payout" value={adminDiamondBalance.toLocaleString()} />
        <StatCard icon={<Send size={18} />} label="Conversion Rate" value={`₹${DIAMOND_TO_RUPEE}/diamond`} />
        <StatCard icon={<Coins size={18} />} label="Liability" value={`₹${(adminDiamondBalance * DIAMOND_TO_RUPEE).toLocaleString()}`} />
      </div>
      <PremiumButton fullWidth>
        <span className="flex items-center justify-center gap-2"><Send size={16} /> Send Diamonds to Super Admin</span>
      </PremiumButton>
      <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginTop: '24px', marginBottom: '12px' }}>Settlement History</h4>
      {[
        { date: 'Feb 20', amount: 2000, status: 'Completed' },
        { date: 'Feb 15', amount: 3500, status: 'Completed' },
        { date: 'Feb 10', amount: 3000, status: 'Completed' },
      ].map((s, i) => (
        <GlassCard key={i} className="mb-3 flex items-center justify-between p-4">
          <div>
            <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>{s.amount} diamonds</span>
            <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{s.date}</span>
          </div>
          <span className="rounded-full px-2 py-0.5" style={{ background: `${colors.success}20`, color: colors.success, fontSize: '10px' }}>{s.status}</span>
        </GlassCard>
      ))}
    </div>
  );
}

// A-20 Reports
export function AdminReports() {
  const { colors } = useTheme();
  return (
    <div className="imitr-page-enter">
      <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>Reports</h3>
      <div className="imitr-stagger grid gap-3 lg:grid-cols-2">
        {[
          { title: 'Revenue Report', desc: 'Daily, weekly, monthly revenue breakdown', icon: BarChart3 },
          { title: 'User Analytics', desc: 'User growth, retention, and engagement', icon: Users },
          { title: 'Call Analytics', desc: 'Call volume, duration, peak hours', icon: Phone },
          { title: 'Financial Summary', desc: 'Coins sold, diamonds issued, payouts', icon: Coins },
        ].map((r) => {
          const Icon = r.icon;
          return (
            <GlassCard key={r.title} className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: `${colors.primary}15` }}>
                <Icon size={22} style={{ color: colors.primary }} />
              </div>
              <div>
                <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{r.title}</span>
                <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>{r.desc}</span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

// A-21 Notifications
export function AdminNotifications() {
  const { colors } = useTheme();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  const notifIcon = (type: string) => {
    switch (type) {
      case 'coin': return Coins;
      case 'diamond': return Diamond;
      case 'call': return Phone;
      case 'message': return Users;
      case 'success': return Check;
      case 'warning': return AlertCircle;
      default: return Bell;
    }
  };

  return (
    <div className="imitr-page-enter">
      <div className="mb-4 flex items-center justify-between">
        <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>Notifications ({notifications.length})</h3>
        {notifications.some(n => !n.read) && (
          <button
            onClick={markAllNotificationsRead}
            className="rounded-xl px-3 py-1.5"
            style={{ background: `${colors.primary}15`, color: colors.primary, fontSize: '11px', fontFamily: "'Inter', sans-serif", border: `1px solid ${colors.primary}30` }}
          >
            Mark all read
          </button>
        )}
      </div>
      <div className="imitr-stagger">
        {notifications.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <Bell size={32} style={{ color: colors.primary, opacity: 0.3, margin: '0 auto 8px' }} />
            <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>No notifications</p>
          </GlassCard>
        ) : (
          notifications.map((n) => {
            const Icon = notifIcon(n.type);
            return (
              <GlassCard
                key={n.id}
                className="mb-3 flex items-start gap-3 p-4"
                onClick={() => !n.read && markNotificationRead(n.id)}
                style={{ opacity: n.read ? 0.7 : 1 }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${colors.primary}15`, flexShrink: 0 }}>
                  <Icon size={18} style={{ color: colors.primary }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>{n.title}</span>
                      {!n.read && (
                        <div className="h-2 w-2 rounded-full" style={{ background: colors.primary, boxShadow: `0 0 6px ${colors.glowColor}` }} />
                      )}
                    </div>
                    <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif", flexShrink: 0 }}>{n.time}</span>
                  </div>
                  <p style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif", marginTop: '2px' }}>{n.message}</p>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
}

// A-22 Profile
export function AdminProfile() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { admins, adminPaymentSettings, adminCoinInventory, adminDiamondBalance, adminTotalCoinsDistributed } = useApp();
  const admin = admins.find(a => a.status === 'active') || admins[0];
  const initials = admin ? admin.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) : 'AD';

  return (
    <div className="imitr-page-enter">
      <div className="mb-5 flex items-center justify-between">
        <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>Admin Profile</h3>
        <button
          onClick={() => navigate('/admin/edit-profile')}
          className="imitr-ripple flex items-center gap-1.5 rounded-xl px-4 py-2"
          style={{ background: colors.buttonGradient, boxShadow: `0 2px 12px ${colors.glowColor}` }}
        >
          <Settings size={13} style={{ color: colors.buttonText }} />
          <span style={{ color: colors.buttonText, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>Edit Profile</span>
        </button>
      </div>

      {/* Profile Card */}
      <GlassCard className="mb-5 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full imitr-breathe" style={{ background: colors.buttonGradient, boxShadow: `0 4px 16px ${colors.glowColor}` }}>
            <span style={{ color: colors.buttonText, fontFamily: "'Playfair Display', serif", fontSize: '22px' }}>{initials}</span>
          </div>
          <div className="flex-1">
            <span style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '18px', display: 'block' }}>{admin?.name || 'Admin'}</span>
            <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>Creator Admin • {admin?.id || 'ADM-001'}</span>
            {admin?.organization && (
              <span style={{ color: colors.primary, fontSize: '11px', fontFamily: "'Inter', sans-serif", display: 'block', marginTop: '2px' }}>{admin.organization}</span>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Contact Details */}
      <GlassCard className="mb-5 p-5">
        <div className="mb-3 flex items-center gap-2">
          <User size={14} style={{ color: colors.primary }} />
          <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px', letterSpacing: '0.5px' }}>Contact Details</span>
        </div>
        {[
          { label: 'Email', value: admin?.email || '—' },
          { label: 'Phone', value: admin?.phone || '—' },
          { label: 'Organization', value: admin?.organization || '—' },
          { label: 'Joined', value: admin?.joined || '—' },
        ].map((item, i) => (
          <div key={item.label} className="flex items-center justify-between py-2.5" style={i < 3 ? { borderBottom: `1px solid ${colors.cardBorder}` } : {}}>
            <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>{item.label}</span>
            <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>{item.value}</span>
          </div>
        ))}
      </GlassCard>

      {/* Payment Settings */}
      <GlassCard className="mb-5 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Coins size={14} style={{ color: colors.primary }} />
          <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px', letterSpacing: '0.5px' }}>Payment Settings</span>
        </div>
        {[
          { label: 'Bank Account', value: adminPaymentSettings.bankAccount || 'Not set' },
          { label: 'UPI ID', value: adminPaymentSettings.upiId || 'Not set' },
          { label: 'IFSC Code', value: adminPaymentSettings.ifscCode || 'Not set' },
          { label: 'Account Holder', value: adminPaymentSettings.accountHolderName || 'Not set' },
        ].map((item, i) => (
          <div key={item.label} className="flex items-center justify-between py-2.5" style={i < 3 ? { borderBottom: `1px solid ${colors.cardBorder}` } : {}}>
            <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>{item.label}</span>
            <span style={{ color: item.value === 'Not set' ? colors.inactive : colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>{item.value}</span>
          </div>
        ))}
      </GlassCard>

      {/* Stats */}
      <GlassCard className="mb-5 p-5">
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 size={14} style={{ color: colors.primary }} />
          <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px', letterSpacing: '0.5px' }}>Account Stats</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Coin Inventory', value: adminCoinInventory.toLocaleString() },
            { label: 'Diamond Balance', value: adminDiamondBalance.toLocaleString() },
            { label: 'Users Managed', value: (admin?.users || 0).toString() },
            { label: 'Coins Distributed', value: adminTotalCoinsDistributed.toLocaleString() },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl p-3 text-center" style={{ background: `${colors.primary}08`, border: `1px solid ${colors.cardBorder}` }}>
              <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '16px', display: 'block' }}>{stat.value}</span>
              <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <PremiumButton fullWidth onClick={() => navigate('/admin/edit-profile')}>
        <div className="flex items-center justify-center gap-2">
          <Settings size={16} />
          Edit Profile & Payment Settings
        </div>
      </PremiumButton>
    </div>
  );
}

// A-23 Audit Logs
export function AdminAuditLogs() {
  const { colors } = useTheme();
  const logs = [
    { id: '1', action: 'User Created', details: 'Created user Vikram S.', actor: 'Admin', time: 'Feb 25, 3:42 PM' },
    { id: '2', action: 'Withdrawal Approved', details: 'Approved 500 diamonds for Meera K.', actor: 'Admin', time: 'Feb 25, 2:15 PM' },
    { id: '3', action: 'Coins Purchased', details: 'Bought 50,000 coins', actor: 'Admin', time: 'Feb 24' },
    { id: '4', action: 'User Blocked', details: 'Blocked user ID: USR-089', actor: 'Admin', time: 'Feb 23' },
    { id: '5', action: 'Settings Updated', details: 'Updated call rates', actor: 'Admin', time: 'Feb 22' },
  ];
  return (
    <div className="imitr-page-enter">
      <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>Audit Logs</h3>
      <div className="imitr-stagger">
        {logs.map((log) => (
          <GlassCard key={log.id} className="mb-3 p-4">
            <div className="flex items-center justify-between mb-1">
              <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>{log.action}</span>
              <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>{log.time}</span>
            </div>
            <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>{log.details}</span>
            <div className="mt-2">
              <span className="rounded-full px-2 py-0.5" style={{ background: `${colors.primary}15`, color: colors.primary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                By: {log.actor}
              </span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

// A-24 User Recharge Requests
export function AdminRechargeRequests() {
  const { colors } = useTheme();
  const { coinRechargeRequests, approveCoinRechargeRequest, rejectCoinRechargeRequest, admins } = useApp();

  const currentAdminId = 'ADM-001';
  const myRequests = coinRechargeRequests.filter(r =>
    r.adminIds.includes(currentAdminId) && !r.rejectedByAdminIds.includes(currentAdminId)
  );
  const pendingRequests = myRequests.filter(r => r.status === 'pending');
  const approvedRequests = myRequests.filter(r => r.status === 'approved');

  return (
    <div className="imitr-page-enter">
      <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '8px' }}>User Recharge Requests</h3>
      <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', marginBottom: '16px' }}>
        Users requesting coin recharges from you
      </p>

      <div className="mb-5 grid grid-cols-3 gap-3">
        <StatCard icon={<Clock size={16} />} label="Pending" value={pendingRequests.length.toString()} />
        <StatCard icon={<Check size={16} />} label="Approved" value={approvedRequests.length.toString()} />
        <StatCard icon={<Coins size={16} />} label="Total" value={myRequests.length.toString()} />
      </div>

      {pendingRequests.length > 0 && (
        <>
          <h4 style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '13px', marginBottom: '8px' }}>
            Pending ({pendingRequests.length})
          </h4>
          {pendingRequests.map((req) => (
            <GlassCard key={req.id} className="mb-3 p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                    {req.userName}
                  </span>
                  <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                    {req.createdAt}
                  </span>
                </div>
                <div className="text-right">
                  <span className="flex items-center gap-1" style={{ color: colors.primary, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
                    <Coins size={12} /> {req.coins.toLocaleString()}
                    {req.bonus > 0 && <span style={{ color: colors.success, fontSize: '11px' }}>+{req.bonus}</span>}
                  </span>
                  <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                    ₹{req.price.toLocaleString()}
                  </span>
                </div>
              </div>
              {req.adminIds.length > 1 && (
                <div className="mb-3 flex items-center gap-1.5 flex-wrap">
                  <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Also sent to:</span>
                  {req.adminIds.filter(id => id !== currentAdminId).map(id => {
                    const a = admins.find(x => x.id === id);
                    return a ? (
                      <span key={id} className="rounded-full px-2 py-0.5" style={{ background: `${colors.primary}10`, color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                        {a.name.split(' ')[0]}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
              <div className="flex gap-2">
                <PremiumButton fullWidth size="sm" onClick={() => approveCoinRechargeRequest(req.id, currentAdminId)}>
                  <span className="flex items-center justify-center gap-1"><Check size={14} /> Approve</span>
                </PremiumButton>
                <PremiumButton fullWidth size="sm" variant="danger" onClick={() => rejectCoinRechargeRequest(req.id, currentAdminId)}>
                  <span className="flex items-center justify-center gap-1"><X size={14} /> Reject</span>
                </PremiumButton>
              </div>
            </GlassCard>
          ))}
        </>
      )}

      {approvedRequests.length > 0 && (
        <>
          <h4 style={{ color: colors.success, fontFamily: "'Inter', sans-serif", fontSize: '13px', marginBottom: '8px', marginTop: pendingRequests.length > 0 ? '16px' : '0' }}>
            Approved ({approvedRequests.length})
          </h4>
          {approvedRequests.map((req) => (
            <GlassCard key={req.id} className="mb-3 flex items-center justify-between p-4">
              <div>
                <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{req.userName}</span>
                <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                  {req.approvedAt || req.createdAt} | By: {req.approvedByAdminName || 'You'}
                </span>
              </div>
              <div className="text-right">
                <span className="flex items-center gap-1" style={{ color: colors.success, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
                  <Coins size={12} /> {(req.coins + req.bonus).toLocaleString()}
                </span>
                <span className="mt-1 inline-block rounded-full px-2 py-0.5" style={{ background: `${colors.success}20`, color: colors.success, fontSize: '10px' }}>
                  Approved
                </span>
              </div>
            </GlassCard>
          ))}
        </>
      )}

      {myRequests.length === 0 && (
        <GlassCard className="p-8 text-center">
          <Coins size={32} style={{ color: colors.primary, opacity: 0.3, margin: '0 auto 8px' }} />
          <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
            No recharge requests from users yet
          </p>
        </GlassCard>
      )}
    </div>
  );
}