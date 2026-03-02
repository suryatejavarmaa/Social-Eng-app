import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTheme } from '../../context/ThemeContext';
import { mockUsers } from '../../data/mockUsers';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { PremiumInput } from '../../components/imitr/PremiumInput';
import { StatCard } from '../../components/imitr/StatCard';
import { HeaderBar } from '../../components/imitr/HeaderBar';
import {
  Crown, Shield, Users, Coins, Phone, Building2, Search,
  DollarSign, Hash, Diamond, TrendingUp, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle, XCircle, AlertTriangle, Ban,
  Eye, Edit, Trash2, MoreVertical, Filter, Download,
  Globe, Server, Activity, Bell, FileText, Settings,
  CreditCard, BarChart3, Zap, Lock, Unlock,
  Send, Megaphone, Calendar, Star, ChevronRight,
  Wallet, RefreshCw, ExternalLink, Copy, Check,
  ToggleRight, ToggleLeft, Plus, AlertCircle, X, Key, Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DIAMOND_TO_RUPEE, COIN_DIAMOND_RATE, MIN_WITHDRAW_DIAMONDS, COIN_PACK_SIZE, COIN_PACK_RUPEE_COST, COIN_TO_RUPEE_RATIO } from '../../context/AppContext';

// ─────────────────────────────────────────────
// SA-02: Admin Management
// ─────────────────────────────────────────────

export function SAAdminManagement() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { admins, suspendAdmin, activateAdmin, removeAdmin } = useApp();
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const filtered = admins.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));

  const totalUsers = admins.reduce((s, a) => s + a.users, 0);
  const totalCoins = admins.reduce((s, a) => s + a.coinInventory, 0);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>Admin Management ({admins.length})</h3>
        <PremiumButton size="sm" onClick={() => navigate('/superadmin/admins/create')}>
          <span className="flex items-center gap-1"><Plus size={14} /> New Admin</span>
        </PremiumButton>
      </div>
      <PremiumInput placeholder="Search admins..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search size={18} />} className="mb-4" />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={<Crown size={18} />} label="Total Admins" value={admins.length.toString()} />
        <StatCard icon={<Shield size={18} />} label="Active" value={admins.filter(a => a.status === 'active').length.toString()} />
        <StatCard icon={<Users size={18} />} label="Total Users Under Admins" value={totalUsers.toLocaleString()} />
        <StatCard icon={<Coins size={18} />} label="Total Coin Inventory" value={`${(totalCoins / 1000).toFixed(0)}K`} />
      </div>

      {filtered.map((admin) => (
        <GlassCard key={admin.id} className="mb-3 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full" style={{ background: colors.buttonGradient }}>
                <span style={{ color: colors.buttonText, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                  {admin.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{admin.name}</span>
                <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>{admin.id} • {admin.joined}</span>
              </div>
            </div>
            <span className="rounded-full px-2 py-0.5" style={{
              background: admin.status === 'active' ? `${colors.success}20` : `${colors.danger}20`,
              color: admin.status === 'active' ? colors.success : colors.danger,
              fontSize: '10px', fontFamily: "'Inter', sans-serif",
            }}>
              {admin.status}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="rounded-lg p-2 text-center" style={{ background: `${colors.primary}08` }}>
              <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{admin.coinInventory.toLocaleString()}</span>
              <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Coins</span>
            </div>
            <div className="rounded-lg p-2 text-center" style={{ background: `${colors.primary}08` }}>
              <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{admin.diamondBalance.toLocaleString()}</span>
              <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Diamonds</span>
            </div>
            <div className="rounded-lg p-2 text-center" style={{ background: `${colors.primary}08` }}>
              <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{admin.users}</span>
              <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Users</span>
            </div>
          </div>
          {/* Profile Details + Credentials — expandable */}
          {expandedId === admin.id && (
            <div className="mb-3" style={{ borderTop: `1px solid ${colors.cardBorder}`, paddingTop: '12px' }}>
              {/* Admin Info Fields */}
              <div className="mb-3 space-y-2">
                {[
                  { label: 'Role', value: admin.role },
                  { label: 'Email', value: admin.email },
                  { label: 'Phone', value: admin.phone },
                  ...(admin.organization ? [{ label: 'Organization', value: admin.organization }] : []),
                  { label: 'Joined', value: admin.joined },
                ].filter(item => item.value).map(item => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl border-0 px-3 py-2" style={{ background: `${colors.primary}04` }}>
                    <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>{item.label}</span>
                    <span style={{ color: colors.text, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Profile Status */}
              <div className="flex items-center gap-2 rounded-xl border-0 px-3 py-2" style={{ background: `${colors.primary}04` }}>
                <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>Profile Status</span>
                <span className="ml-auto rounded-full px-2 py-0.5" style={{
                  background: admin.profileCompleted ? `${colors.success}20` : `#F59E0B20`,
                  color: admin.profileCompleted ? colors.success : '#F59E0B',
                  fontSize: '10px', fontFamily: "'Inter', sans-serif",
                }}>
                  {admin.profileCompleted ? 'Completed' : 'Pending Setup'}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <PremiumButton fullWidth size="sm" variant="outline" onClick={() => setExpandedId(expandedId === admin.id ? null : admin.id)}>
              <span className="flex items-center justify-center gap-1">{expandedId === admin.id ? <><X size={14} /> Close</> : <><Eye size={14} /> View</>}</span>
            </PremiumButton>
            <PremiumButton fullWidth size="sm" variant={admin.status === 'active' ? 'danger' : 'primary'}
              onClick={() => admin.status === 'active' ? suspendAdmin(admin.id) : activateAdmin(admin.id)}>
              <span className="flex items-center justify-center gap-1">
                {admin.status === 'active' ? <><Ban size={14} /> Suspend</> : <><Check size={14} /> Activate</>}
              </span>
            </PremiumButton>
            <PremiumButton size="sm" variant="danger" onClick={() => removeAdmin(admin.id)}>
              <span className="flex items-center justify-center gap-1"><Trash2 size={14} /></span>
            </PremiumButton>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// SA-02b: Create Admin
// ─────────────────────────────────────────────
export function SACreateAdmin() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { createAdmin } = useApp();

  const [form, setForm] = useState({ name: '', email: '', phone: '', organization: '', initialCoins: '' });
  const [creating, setCreating] = useState(false);
  const [createdAdmin, setCreatedAdmin] = useState<any | null>(null);

  const isValid = form.name.length > 2 && form.email.includes('@') && form.phone.length > 6;

  const handleCreate = () => {
    if (!isValid) return;
    setCreating(true);
    setTimeout(() => {
      const admin = createAdmin({
        name: form.name,
        email: form.email,
        phone: form.phone,
        organization: form.organization || undefined,
        initialCoins: parseInt(form.initialCoins) || 0,
      });
      setCreating(false);
      setCreatedAdmin(admin);
      setForm({ name: '', email: '', phone: '', organization: '', initialCoins: '' });
    }, 1200);
  };

  // Success modal — shows credentials (matches celeb flow exactly)
  if (createdAdmin) {
    return (
      <div>
        <div className="mx-auto max-w-lg">
          <GlassCard className="mb-5 overflow-hidden">
            {/* Success Header */}
            <div className="px-6 pt-6 pb-4 text-center" style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: `${colors.success}15`, boxShadow: `0 0 30px ${colors.success}30` }}>
                <Check size={32} style={{ color: colors.success }} />
              </div>
              <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '20px', marginBottom: '4px' }}>
                Admin Created!
              </h3>
              <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                Account for <strong style={{ color: colors.primary }}>{createdAdmin.name}</strong> is now active on the platform
              </p>
            </div>

            <div className="px-6 py-4">
              {/* Admin Info */}
              <div className="mb-4 flex items-center gap-3 rounded-2xl p-3" style={{ background: `${colors.primary}06`, border: `1px solid ${colors.primary}15` }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: colors.buttonGradient }}>
                  <span style={{ color: colors.buttonText, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                    {createdAdmin.name.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>{createdAdmin.name}</span>
                    <Shield size={14} style={{ color: colors.primary }} />
                  </div>
                  <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                    {createdAdmin.role} · ID: {createdAdmin.id}
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
                    <span style={{ color: colors.text, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>{createdAdmin.phone}</span>
                  </div>
                  <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif", display: 'block', marginTop: '6px' }}>
                    Admin can login via the Admin Portal using this phone number. An OTP will be sent for verification.
                  </span>
                </div>
              </div>

              {/* Done */}
              <PremiumButton fullWidth onClick={() => { setCreatedAdmin(null); navigate('/superadmin/admins'); }}>
                <span className="flex items-center justify-center gap-2"><Sparkles size={16} /> Done</span>
              </PremiumButton>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>Create New Admin</h3>
          <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', marginTop: '2px' }}>
            Add a new Creator Admin with phone-based login
          </p>
        </div>
      </div>

      <GlassCard className="p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: colors.buttonGradient }}>
            <Crown size={18} style={{ color: colors.buttonText }} />
          </div>
          <div>
            <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '16px' }}>Admin Details</h4>
            <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
              Enter name and phone — login is OTP-based
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <PremiumInput label="Full Name *" placeholder="Admin full name" value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} icon={<Crown size={18} />} />
          <PremiumInput label="Email *" placeholder="admin@imitr.com" type="email" value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} />
          <PremiumInput label="Phone Number *" placeholder="+91 00000 00000" value={form.phone} onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))} icon={<Phone size={18} />} />
          <PremiumInput label="Organization" placeholder="Company/Org name (optional)" value={form.organization} onChange={(e) => setForm(prev => ({ ...prev, organization: e.target.value }))} icon={<Building2 size={18} />} />
          <PremiumInput label="Initial Coin Allocation" placeholder="0" type="number" value={form.initialCoins} onChange={(e) => setForm(prev => ({ ...prev, initialCoins: e.target.value.replace(/\D/g, '') }))} icon={<Coins size={18} />} />

          {/* Preview */}
          {form.name && (
            <div className="rounded-2xl p-3" style={{ background: `${colors.primary}06`, border: `1px solid ${colors.primary}12` }}>
              <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Preview</span>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: colors.buttonGradient }}>
                  <span style={{ color: colors.buttonText, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                    {form.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div>
                  <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{form.name}</span>
                  <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                    Creator Admin {form.organization ? `· ${form.organization}` : ''}
                  </span>
                </div>
              </div>
            </div>
          )}

          <PremiumButton fullWidth onClick={handleCreate} disabled={!isValid} loading={creating}>
            <span className="flex items-center justify-center gap-2"><Zap size={16} /> Create Admin Account</span>
          </PremiumButton>
        </div>
      </GlassCard>
    </div>
  );
}

// ─────────────────────────────────────────────
// SA-03: Coin Minting & Selling
// ─────────────────────────────────────────────
export function SACoinMinting() {
  const { colors } = useTheme();
  const { admins, mintCoins, totalMintedCoins, totalCoinsInCirculation, coinPurchaseRequests, approveCoinPurchaseRequest, rejectCoinPurchaseRequest, markCoinPurchasePaid, sellCoinsToAdmin } = useApp();
  const [mintAmount, setMintAmount] = useState('');
  const [minting, setMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [sellAmount, setSellAmount] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState('');

  const handleMint = () => {
    const num = parseInt(mintAmount);
    if (!num) return;
    setMinting(true);
    setTimeout(() => {
      mintCoins(num);
      setMinting(false);
      setMintSuccess(true);
      setTimeout(() => setMintSuccess(false), 2000);
      setMintAmount('');
    }, 1200);
  };

  const handleSell = () => {
    const num = parseInt(sellAmount);
    if (!num || !selectedAdmin) return;
    sellCoinsToAdmin(selectedAdmin, num);
    setSellAmount('');
    setSelectedAdmin('');
  };

  const pendingRequests = coinPurchaseRequests.filter(r => r.status === 'pending');
  const approvedRequests = coinPurchaseRequests.filter(r => r.status === 'approved');
  const allProcessed = coinPurchaseRequests.filter(r => r.status !== 'pending');

  const sellHistory = [
    { id: '1', amount: 50000, admin: 'Suresh Kumar', price: 20000, date: 'Feb 25' },
    { id: '2', amount: 100000, admin: 'Kavita Sharma', price: 40000, date: 'Feb 22' },
    { id: '3', amount: 75000, admin: 'Ravi Patel', price: 30000, date: 'Feb 18' },
  ];

  return (
    <div>
      <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>Coin Minting & Distribution</h3>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={<Coins size={18} />} label="Total Minted" value={`${(totalMintedCoins / 1000000).toFixed(1)}M`} />
        <StatCard icon={<Coins size={18} />} label="In Circulation" value={`${(totalCoinsInCirculation / 1000000).toFixed(1)}M`} />
        <StatCard icon={<DollarSign size={18} />} label="Total Sold Value" value="₹24.8L" />
        <StatCard icon={<AlertCircle size={18} />} label="Pending Requests" value={pendingRequests.length.toString()} />
      </div>

      {/* ─── Admin Coin Purchase Requests ─── */}
      {pendingRequests.length > 0 && (
        <GlassCard className="mb-5 overflow-hidden" style={{ border: `1px solid ${colors.primary}30` }}>
          <div className="px-5 pt-5 pb-3">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} style={{ color: colors.primary }} />
                <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>
                  Incoming Coin Purchase Requests ({pendingRequests.length})
                </h4>
              </div>
            </div>
            <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', marginBottom: '12px' }}>
              Creator Admins requesting coins — paid in rupees only (₹{COIN_PACK_RUPEE_COST / COIN_PACK_SIZE}/coin · {(COIN_PACK_SIZE / 1000).toFixed(0)}K coins = ₹{COIN_PACK_RUPEE_COST.toLocaleString()})
            </p>
          </div>
          <div className="px-5 pb-5 space-y-3">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="rounded-2xl p-4"
                style={{ background: `${colors.primary}06`, border: `1px solid ${colors.primary}15` }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: colors.buttonGradient }}>
                      <span style={{ color: colors.buttonText, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                        {req.adminName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                        {req.adminName}
                      </span>
                      <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                        {req.adminId} · {req.requestedAt}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full px-2 py-0.5" style={{ background: `${colors.primary}15`, color: colors.primary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                    Pending
                  </span>
                </div>
                <div className="mb-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl p-2.5 text-center" style={{ background: `${colors.primary}08` }}>
                    <span className="flex items-center justify-center gap-1" style={{ color: colors.primary, fontSize: '16px', fontFamily: "'Inter', sans-serif" }}>
                      <Coins size={14} /> {req.coinsPack.toLocaleString()}
                    </span>
                    <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Coins Requested</span>
                  </div>
                  <div className="rounded-xl p-2.5 text-center" style={{ background: `${colors.primary}08` }}>
                    <span className="flex items-center justify-center gap-1" style={{ color: colors.primary, fontSize: '16px', fontFamily: "'Inter', sans-serif" }}>
                      ₹{req.rupeeCost.toLocaleString()}
                    </span>
                    <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Rupee Cost</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <PremiumButton fullWidth size="sm" onClick={() => approveCoinPurchaseRequest(req.id)}>
                    <span className="flex items-center justify-center gap-1"><Check size={14} /> Approve & Send Coins</span>
                  </PremiumButton>
                  <PremiumButton size="sm" variant="danger" onClick={() => rejectCoinPurchaseRequest(req.id)}>
                    <span className="flex items-center justify-center gap-1"><X size={14} /></span>
                  </PremiumButton>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* ─── Unpaid (Approved) Requests ─── */}
      {approvedRequests.length > 0 && (
        <GlassCard className="mb-5 overflow-hidden" style={{ border: `1px solid ${colors.danger}30` }}>
          <div className="px-5 pt-5 pb-3">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle size={18} style={{ color: colors.danger }} />
              <h4 style={{ color: colors.danger, fontFamily: "'Playfair Display', serif" }}>
                Unpaid Coin Purchases ({approvedRequests.length})
              </h4>
            </div>
            <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', marginBottom: '12px' }}>
              Coins delivered but rupee payment not yet received
            </p>
          </div>
          <div className="px-5 pb-5 space-y-3">
            {approvedRequests.map((req) => (
              <div
                key={req.id}
                className="rounded-2xl p-4"
                style={{ background: `${colors.danger}06`, border: `1px solid ${colors.danger}15` }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: colors.buttonGradient }}>
                      <span style={{ color: colors.buttonText, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                        {req.adminName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                        {req.adminName}
                      </span>
                      <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                        Approved: {req.approvedAt}
                      </span>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 rounded-full px-2.5 py-1" style={{ background: `${colors.danger}15`, color: colors.danger, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                    ₹{req.rupeeCost.toLocaleString()} unpaid
                  </span>
                </div>
                <PremiumButton fullWidth size="sm" onClick={() => markCoinPurchasePaid(req.id)}>
                  <span className="flex items-center justify-center gap-1"><Check size={14} /> Mark as Paid</span>
                </PremiumButton>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Mint Section */}
      <GlassCard className="mb-5 p-5">
        <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '12px' }}>Mint New Coins</h4>
        <PremiumInput label="Amount to Mint" placeholder="Enter amount" value={mintAmount} onChange={(e) => setMintAmount(e.target.value)} icon={<Coins size={18} />} className="mb-3" />
        <div className="mb-4 grid grid-cols-3 gap-2">
          {[100000, 500000, 1000000].map((v) => (
            <GlassCard key={v} className="cursor-pointer p-3 text-center" onClick={() => setMintAmount(v.toString())}
              style={mintAmount === v.toString() ? { borderColor: colors.primary, boxShadow: `0 0 12px ${colors.glowColor}` } : {}}>
              <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>{(v / 1000)}K</span>
            </GlassCard>
          ))}
        </div>
        <PremiumButton fullWidth disabled={!mintAmount} loading={minting} onClick={handleMint}>
          {mintSuccess ? <span className="flex items-center justify-center gap-1"><Check size={16} /> Minted!</span> : 'Mint Coins'}
        </PremiumButton>
      </GlassCard>

      {/* Sell to Admin */}
      <GlassCard className="mb-5 p-5">
        <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '12px' }}>Sell to Admin (Manual)</h4>
        <div className="mb-3">
          <label className="mb-2 block" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif" }}>Select Admin</label>
          <div className="flex flex-wrap gap-2">
            {admins.filter(a => a.status === 'active').map((admin) => (
              <button key={admin.id} className="rounded-xl px-3 py-2" onClick={() => setSelectedAdmin(admin.id)}
                style={{
                  background: selectedAdmin === admin.id ? `${colors.primary}25` : colors.cardBg,
                  border: `1px solid ${selectedAdmin === admin.id ? colors.primary : colors.cardBorder}`,
                  color: selectedAdmin === admin.id ? colors.primary : colors.text,
                  fontSize: '12px', fontFamily: "'Inter', sans-serif",
                }}>
                {admin.name}
              </button>
            ))}
          </div>
        </div>
        <PremiumInput label="Coins to Sell" placeholder="Enter amount" value={sellAmount} onChange={(e) => setSellAmount(e.target.value)} icon={<Coins size={18} />} className="mb-2" />
        {sellAmount && (
          <p style={{ color: colors.primary, fontSize: '13px', fontFamily: "'Inter', sans-serif", marginBottom: '12px' }}>
            Revenue: ₹{(parseInt(sellAmount || '0') * COIN_TO_RUPEE_RATIO).toLocaleString()}
          </p>
        )}
        <PremiumButton fullWidth disabled={!sellAmount || !selectedAdmin} onClick={handleSell}>Sell Coins</PremiumButton>
      </GlassCard>

      {/* ─── All Coin Purchase Requests History ─── */}
      {allProcessed.length > 0 && (
        <>
          <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '12px' }}>Coin Purchase History</h4>
          {allProcessed.map((req) => (
            <GlassCard key={req.id} className="mb-3 flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{
                  background: req.status === 'paid' ? `${colors.success}20` : req.status === 'approved' ? `${colors.danger}20` : `${colors.textSecondary}20`,
                }}>
                  {req.status === 'paid' ? <Check size={18} style={{ color: colors.success }} /> :
                   req.status === 'approved' ? <AlertTriangle size={18} style={{ color: colors.danger }} /> :
                   <X size={18} style={{ color: colors.textSecondary }} />}
                </div>
                <div>
                  <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                    {req.adminName} — {req.coinsPack.toLocaleString()} coins
                  </span>
                  <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                    {req.requestedAt}
                  </span>
                </div>
              </div>
              <span className="rounded-full px-2.5 py-1" style={{
                background: req.status === 'paid' ? `${colors.success}15` : req.status === 'approved' ? `${colors.danger}15` : `${colors.textSecondary}15`,
                color: req.status === 'paid' ? colors.success : req.status === 'approved' ? colors.danger : colors.textSecondary,
                fontSize: '10px', fontFamily: "'Inter', sans-serif", textTransform: 'capitalize',
              }}>
                {req.status === 'approved' ? 'Unpaid' : req.status}
              </span>
            </GlassCard>
          ))}
        </>
      )}

      {/* Sell History */}
      <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '12px', marginTop: allProcessed.length > 0 ? '24px' : '0' }}>Recent Manual Sales</h4>
      {sellHistory.map((s) => (
        <GlassCard key={s.id} className="mb-3 flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${colors.success}20` }}>
              <ArrowUpRight size={18} style={{ color: colors.success }} />
            </div>
            <div>
              <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{s.amount.toLocaleString()} coins → {s.admin}</span>
              <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>{s.date}</span>
            </div>
          </div>
          <span style={{ color: colors.success, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>₹{s.price.toLocaleString()}</span>
        </GlassCard>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// SA-04: Diamond Monitoring
// ─────────────────────────────────────────────
export function SADiamondMonitoring() {
  const { colors } = useTheme();

  const adminDiamonds = [
    { admin: 'Suresh Kumar', received: 3247, settled: 2500, pending: 747 },
    { admin: 'Kavita Sharma', received: 1850, settled: 1200, pending: 650 },
    { admin: 'Ravi Patel', received: 920, settled: 700, pending: 220 },
    { admin: 'Amit Singh', received: 2100, settled: 1800, pending: 300 },
  ];

  const settlements = [
    { id: '1', admin: 'Suresh Kumar', diamonds: 500, amount: 5000, status: 'completed', date: 'Feb 24' },
    { id: '2', admin: 'Kavita Sharma', diamonds: 300, amount: 3000, status: 'pending', date: 'Feb 25' },
    { id: '3', admin: 'Ravi Patel', diamonds: 200, amount: 2000, status: 'completed', date: 'Feb 23' },
    { id: '4', admin: 'Amit Singh', diamonds: 400, amount: 4000, status: 'pending', date: 'Feb 25' },
  ];

  return (
    <div>
      <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>Diamond Monitoring</h3>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={<Diamond size={18} />} label="Total in System" value="1.2M" />
        <StatCard icon={<Diamond size={18} />} label="Pending Settlements" value="1,917" />
        <StatCard icon={<DollarSign size={18} />} label="Total Liability" value="₹19,170" />
        <StatCard icon={<TrendingUp size={18} />} label="Settlement Rate" value={`₹${DIAMOND_TO_RUPEE}/diamond`} />
      </div>

      {/* Per-Admin Diamond Status */}
      <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '12px' }}>Admin Diamond Status</h4>
      {adminDiamonds.map((ad) => (
        <GlassCard key={ad.admin} className="mb-3 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>{ad.admin}</span>
            <span className="rounded-full px-2 py-0.5" style={{ background: `${colors.primary}15`, color: colors.primary, fontSize: '11px' }}>
              {ad.pending} pending
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg p-2 text-center" style={{ background: `${colors.primary}08` }}>
              <span style={{ color: colors.primary, fontSize: '16px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{ad.received.toLocaleString()}</span>
              <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Received</span>
            </div>
            <div className="rounded-lg p-2 text-center" style={{ background: `${colors.success}10` }}>
              <span style={{ color: colors.success, fontSize: '16px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{ad.settled.toLocaleString()}</span>
              <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Settled</span>
            </div>
            <div className="rounded-lg p-2 text-center" style={{ background: `${colors.danger}10` }}>
              <span style={{ color: colors.danger, fontSize: '16px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{ad.pending}</span>
              <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Pending</span>
            </div>
          </div>
        </GlassCard>
      ))}

      {/* Settlement Requests */}
      <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", margin: '24px 0 12px' }}>Settlement Requests</h4>
      {settlements.map((s) => (
        <GlassCard key={s.id} className="mb-3 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{s.admin}</span>
              <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>{s.date}</span>
            </div>
            <div className="text-right">
              <span className="flex items-center gap-1" style={{ color: colors.primary, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
                <Diamond size={12} /> {s.diamonds}
              </span>
              <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>₹{s.amount.toLocaleString()}</span>
            </div>
          </div>
          {s.status === 'pending' ? (
            <div className="flex gap-2">
              <PremiumButton fullWidth size="sm">
                <span className="flex items-center justify-center gap-1"><Check size={14} /> Settle</span>
              </PremiumButton>
              <PremiumButton fullWidth size="sm" variant="danger">
                <span className="flex items-center justify-center gap-1"><X size={14} /> Reject</span>
              </PremiumButton>
            </div>
          ) : (
            <span className="rounded-full px-3 py-1" style={{ background: `${colors.success}20`, color: colors.success, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
              ✓ Settled
            </span>
          )}
        </GlassCard>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// SA-05: Global Users
// ─────────────────────────────────────────────
export function SAGlobalUsers() {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const filtered = mockUsers.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>Global User Oversight</h3>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={<Users size={18} />} label="Total Users" value="24,831" trend="+4.8%" trendUp />
        <StatCard icon={<Globe size={18} />} label="Online Now" value="1,247" />
        <StatCard icon={<Shield size={18} />} label="Verified" value="18,420" />
        <StatCard icon={<Ban size={18} />} label="Blocked" value="234" />
      </div>

      <PremiumInput placeholder="Search across all users..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search size={18} />} className="mb-4" />

      {filtered.map((user) => (
        <GlassCard key={user.id} className="mb-3 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <ImageWithFallback src={user.avatar} alt={user.name} className="h-11 w-11 rounded-full object-cover" />
              <div>
                <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{user.name}</span>
                <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                  {user.city} • {user.online ? '🟢 Online' : '⚫ Offline'} • ⭐ {user.rating}
                </span>
              </div>
            </div>
            <span className="rounded-full px-2 py-0.5" style={{ background: `${colors.success}20`, color: colors.success, fontSize: '10px' }}>
              {user.verified ? 'Verified' : 'Unverified'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="rounded-lg p-2 text-center" style={{ background: `${colors.primary}08` }}>
              <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>{user.totalCalls}</span>
              <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif", display: 'block' }}>Calls</span>
            </div>
            <div className="rounded-lg p-2 text-center" style={{ background: `${colors.primary}08` }}>
              <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>A: {user.callRate.audio}</span>
              <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif", display: 'block' }}>Audio Rate</span>
            </div>
            <div className="rounded-lg p-2 text-center" style={{ background: `${colors.primary}08` }}>
              <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>V: {user.callRate.video}</span>
              <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif", display: 'block' }}>Video Rate</span>
            </div>
          </div>
          <div className="flex gap-2">
            <PremiumButton fullWidth size="sm" variant="outline">
              <span className="flex items-center justify-center gap-1"><Eye size={14} /> Details</span>
            </PremiumButton>
            <PremiumButton fullWidth size="sm" variant="danger">
              <span className="flex items-center justify-center gap-1"><Ban size={14} /> Block</span>
            </PremiumButton>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// SA-06: Global Calls
// ─────────────────────────────────────────────
export function SAGlobalCalls() {
  const { colors } = useTheme();

  const calls = [
    { id: '1', caller: 'Rahul M.', receiver: 'Ananya S.', type: 'Video', duration: '12:34', coins: 309, admin: 'Suresh', date: 'Feb 25, 3:42 PM', status: 'completed' },
    { id: '2', caller: 'Vikram S.', receiver: 'Priya P.', type: 'Audio', duration: '06:12', coins: 31, admin: 'Kavita', date: 'Feb 25, 2:15 PM', status: 'completed' },
    { id: '3', caller: 'Arjun N.', receiver: 'Meera K.', type: 'Video', duration: '08:45', coins: 219, admin: 'Ravi', date: 'Feb 25, 1:30 PM', status: 'completed' },
    { id: '4', caller: 'User X', receiver: 'User Y', type: 'Video', duration: '—', coins: 0, admin: 'Suresh', date: 'Feb 25, 12:45 PM', status: 'missed' },
    { id: '5', caller: 'User A', receiver: 'User B', type: 'Audio', duration: '03:22', coins: 17, admin: 'Amit', date: 'Feb 25, 11:20 AM', status: 'completed' },
  ];

  return (
    <div>
      <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>Global Call Oversight</h3>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={<Phone size={18} />} label="Today's Calls" value="3,842" trend="+11%" trendUp />
        <StatCard icon={<Clock size={18} />} label="Avg Duration" value="7:23" />
        <StatCard icon={<Coins size={18} />} label="Coins Consumed" value="48,320" />
        <StatCard icon={<Activity size={18} />} label="Active Now" value="127" />
      </div>

      {calls.map((c) => (
        <GlassCard key={c.id} className="mb-3 p-4">
          <div className="flex items-center justify-between mb-2">
            <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>{c.caller} → {c.receiver}</span>
            <div className="flex items-center gap-2">
              <span className="rounded-full px-2 py-0.5" style={{ background: `${colors.primary}15`, color: colors.primary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                {c.type}
              </span>
              <span className="rounded-full px-2 py-0.5" style={{
                background: c.status === 'completed' ? `${colors.success}20` : `${colors.danger}20`,
                color: c.status === 'completed' ? colors.success : colors.danger,
                fontSize: '10px',
              }}>
                {c.status}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
              <Clock size={12} className="mr-1 inline" />{c.duration} • {c.date}
            </span>
            <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
              Admin: {c.admin}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span style={{ color: colors.primary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
              <Coins size={12} className="mr-1 inline" />{c.coins} coins
            </span>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// SA-07: Payments (Razorpay Integration)
// ─────────────────────────────────────────────
export function SAPayments() {
  const { colors } = useTheme();

  const transactions = [
    { id: 'pay_L1234', user: 'Ananya S.', amount: 999, coins: 1000, method: 'UPI', status: 'success', date: 'Feb 25, 3:42 PM', admin: 'Suresh' },
    { id: 'pay_L1235', user: 'Rahul M.', amount: 499, coins: 500, method: 'Card', status: 'success', date: 'Feb 25, 2:15 PM', admin: 'Kavita' },
    { id: 'pay_L1236', user: 'Vikram S.', amount: 2499, coins: 2500, method: 'UPI', status: 'failed', date: 'Feb 25, 1:30 PM', admin: 'Suresh' },
    { id: 'pay_L1237', user: 'Meera K.', amount: 999, coins: 1000, method: 'Wallet', status: 'success', date: 'Feb 25, 12:45 PM', admin: 'Ravi' },
    { id: 'pay_L1238', user: 'Arjun N.', amount: 4999, coins: 5000, method: 'Card', status: 'success', date: 'Feb 24', admin: 'Amit' },
  ];

  return (
    <div>
      <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>Payment Gateway</h3>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={<CreditCard size={18} />} label="Today's Revenue" value="₹1,24,500" trend="+18%" trendUp />
        <StatCard icon={<TrendingUp size={18} />} label="This Month" value="₹28.4L" trend="+22%" trendUp />
        <StatCard icon={<Check size={18} />} label="Success Rate" value="97.3%" />
        <StatCard icon={<AlertCircle size={18} />} label="Failed Today" value="12" />
      </div>

      {/* Razorpay Config */}
      <GlassCard className="mb-6 p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>Razorpay Integration</h4>
          <span className="flex items-center gap-1 rounded-full px-2 py-1" style={{ background: `${colors.success}20`, color: colors.success, fontSize: '11px' }}>
            <Activity size={12} /> Connected
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3" style={{ background: `${colors.primary}08` }}>
            <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif", display: 'block' }}>Merchant ID</span>
            <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>rzp_live_•••••abc</span>
          </div>
          <div className="rounded-xl p-3" style={{ background: `${colors.primary}08` }}>
            <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif", display: 'block' }}>Environment</span>
            <span style={{ color: colors.success, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>Production</span>
          </div>
        </div>
      </GlassCard>

      {/* Transactions */}
      <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '12px' }}>Recent Transactions</h4>
      {transactions.map((tx) => (
        <GlassCard key={tx.id} className="mb-3 p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{tx.user}</span>
              <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>{tx.id}</span>
            </div>
            <div className="text-right">
              <span style={{ color: colors.text, fontSize: '15px', fontFamily: "'Inter', sans-serif", display: 'block' }}>₹{tx.amount.toLocaleString()}</span>
              <span className="rounded-full px-2 py-0.5" style={{
                background: tx.status === 'success' ? `${colors.success}20` : `${colors.danger}20`,
                color: tx.status === 'success' ? colors.success : colors.danger,
                fontSize: '10px',
              }}>
                {tx.status}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
              {tx.method} • {tx.date}
            </span>
            <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
              {tx.coins.toLocaleString()} coins • Admin: {tx.admin}
            </span>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// SA-08: Pricing Configuration
// ─────────────────────────────────────────────
export function SAPricingConfig() {
  const { colors } = useTheme();

  const coinPacks = [
    { coins: 100, price: 99, active: true },
    { coins: 500, price: 449, active: true },
    { coins: 1000, price: 849, active: true },
    { coins: 2500, price: 1999, active: true },
    { coins: 5000, price: 3749, active: false },
  ];

  return (
    <div>
      <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>Pricing Configuration</h3>

      {/* Call Rates */}
      <GlassCard className="mb-5 p-5">
        <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '12px' }}>Call & Message Rates</h4>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: `${colors.primary}08`, border: `1px solid ${colors.cardBorder}` }}>
            <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>Audio Call</span>
            <div className="flex items-center gap-2">
              <Coins size={14} style={{ color: colors.primary }} />
              <span style={{ color: colors.primary, fontSize: '16px', fontFamily: "'Playfair Display', serif" }}>1</span>
              <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>coin/10s (6/min)</span>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: `${colors.primary}08`, border: `1px solid ${colors.cardBorder}` }}>
            <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>Video Call</span>
            <div className="flex items-center gap-2">
              <Coins size={14} style={{ color: colors.primary }} />
              <span style={{ color: colors.primary, fontSize: '16px', fontFamily: "'Playfair Display', serif" }}>4</span>
              <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>coins/10s (24/min)</span>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: `${colors.primary}08`, border: `1px solid ${colors.cardBorder}` }}>
            <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>Message</span>
            <div className="flex items-center gap-2">
              <Coins size={14} style={{ color: colors.primary }} />
              <span style={{ color: colors.primary, fontSize: '16px', fontFamily: "'Playfair Display', serif" }}>3</span>
              <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>coins/msg</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Diamond Conversion */}
      <GlassCard className="mb-5 p-5">
        <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '12px' }}>Diamond Configuration</h4>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: `${colors.primary}08`, border: `1px solid ${colors.cardBorder}` }}>
            <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>Diamond Value</span>
            <span style={{ color: colors.primary, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>{`₹${DIAMOND_TO_RUPEE}`} / diamond</span>
          </div>
          <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: `${colors.primary}08`, border: `1px solid ${colors.cardBorder}` }}>
            <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>Coins per Diamond</span>
            <span style={{ color: colors.primary, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>{COIN_DIAMOND_RATE} coins = 1 diamond</span>
          </div>
          <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: `${colors.primary}08`, border: `1px solid ${colors.cardBorder}` }}>
            <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>Min Withdrawal</span>
            <span style={{ color: colors.primary, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>{MIN_WITHDRAW_DIAMONDS} diamonds</span>
          </div>
          <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: `${colors.primary}08`, border: `1px solid ${colors.cardBorder}` }}>
            <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>Creator Commission</span>
            <span style={{ color: colors.primary, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>70%</span>
          </div>
        </div>
      </GlassCard>

      {/* Coin Packs */}
      <GlassCard className="mb-5 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>User Recharge Packs</h4>
          <PremiumButton size="sm"><span className="flex items-center gap-1"><Plus size={14} /> Add</span></PremiumButton>
        </div>
        {coinPacks.map((pack) => (
          <div key={pack.coins} className="flex items-center justify-between rounded-xl px-4 py-3 mb-2" style={{ background: `${colors.primary}08`, border: `1px solid ${colors.cardBorder}` }}>
            <div>
              <span className="flex items-center gap-1" style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
                <Coins size={14} style={{ color: colors.primary }} /> {pack.coins.toLocaleString()} coins
              </span>
              <span style={{ color: colors.primary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>₹{pack.price}</span>
            </div>
            <div className="flex items-center gap-2">
              {pack.active ? (
                <ToggleRight size={24} style={{ color: colors.success }} />
              ) : (
                <ToggleLeft size={24} style={{ color: colors.inactive }} />
              )}
            </div>
          </div>
        ))}
      </GlassCard>

      <PremiumButton fullWidth>Save All Changes</PremiumButton>
    </div>
  );
}

// ─────────────────────────────────────────────
// SA-09: Announcements
// ─────────────────────────────────────────────
export function SAAnnouncements() {
  const { colors } = useTheme();
  const { announcements, addAnnouncement } = useApp();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('All Users');
  const [publishing, setPublishing] = useState(false);

  const handlePublish = () => {
    if (!title || !message) return;
    setPublishing(true);
    setTimeout(() => {
      addAnnouncement(title, message, target);
      setTitle('');
      setMessage('');
      setTarget('All Users');
      setPublishing(false);
    }, 800);
  };

  return (
    <div>
      <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>Announcements</h3>

      {/* Create Announcement */}
      <GlassCard className="mb-6 p-5">
        <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '12px' }}>New Announcement</h4>
        <div className="flex flex-col gap-3">
          <PremiumInput label="Title" placeholder="Announcement title" value={title} onChange={(e) => setTitle(e.target.value)} icon={<Megaphone size={18} />} />
          <div className="w-full">
            <label className="mb-2 block" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif" }}>Message</label>
            <textarea
              placeholder="Write your announcement..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full rounded-2xl px-4 py-3.5 outline-none"
              style={{ background: colors.inputBg, backdropFilter: 'blur(16px)', border: `1px solid ${colors.border}`, color: colors.text, fontFamily: "'Inter', sans-serif", resize: 'none' }}
            />
          </div>
          <div>
            <label className="mb-2 block" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif" }}>Target Audience</label>
            <div className="flex flex-wrap gap-2">
              {['All Users', 'Admins Only', 'Creators Only', 'Specific Admin'].map((t) => (
                <button key={t} onClick={() => setTarget(t)} className="rounded-xl px-3 py-2" style={{ background: target === t ? `${colors.primary}25` : colors.cardBg, border: `1px solid ${target === t ? colors.primary : colors.cardBorder}`, color: target === t ? colors.primary : colors.text, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <PremiumButton fullWidth disabled={!title || !message} loading={publishing} onClick={handlePublish}>
            <span className="flex items-center justify-center gap-2"><Send size={16} /> Publish Announcement</span>
          </PremiumButton>
        </div>
      </GlassCard>

      {/* Past Announcements */}
      <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '12px' }}>Past Announcements ({announcements.length})</h4>
      {announcements.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <Megaphone size={32} style={{ color: colors.primary, opacity: 0.3, margin: '0 auto 8px' }} />
          <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
            No announcements yet. Create your first one above.
          </p>
        </GlassCard>
      ) : (
      announcements.map((a) => (
        <GlassCard key={a.id} className="mb-3 p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${colors.primary}15`, flexShrink: 0 }}>
                <Megaphone size={16} style={{ color: colors.primary }} />
              </div>
              <div>
                <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{a.title}</span>
                <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>{a.message}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="rounded-full px-2 py-0.5" style={{ background: `${colors.primary}15`, color: colors.primary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>{a.target}</span>
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>{a.date}</span>
          </div>
        </GlassCard>
      ))
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SA-10: Audit Logs
// ─────────────────────────────────────────────
export function SAAuditLogs() {
  const { colors } = useTheme();
  const [filter, setFilter] = useState('all');

  const logs = [
    { id: '1', action: 'Coins Minted', details: 'Minted 500,000 coins to system', actor: 'Super Admin', category: 'system', time: 'Feb 25, 4:12 PM', severity: 'info' },
    { id: '2', action: 'Admin Created', details: 'Created admin account for Deepa Nair', actor: 'Super Admin', category: 'admin', time: 'Feb 25, 3:42 PM', severity: 'info' },
    { id: '3', action: 'Coins Sold', details: '50,000 coins sold to Admin Suresh — ₹20,000', actor: 'Super Admin', category: 'financial', time: 'Feb 25, 2:15 PM', severity: 'info' },
    { id: '4', action: 'Admin Suspended', details: 'Suspended admin ADM-004 (Deepa Nair)', actor: 'Super Admin', category: 'admin', time: 'Feb 25, 1:30 PM', severity: 'warning' },
    { id: '5', action: 'Settlement Approved', details: 'Approved 500 diamond settlement for Admin Suresh — ₹5,000', actor: 'Super Admin', category: 'financial', time: 'Feb 24', severity: 'info' },
    { id: '6', action: 'Pricing Updated', details: 'Video call rate changed from 20 to 25 coins/min', actor: 'Super Admin', category: 'system', time: 'Feb 24', severity: 'warning' },
    { id: '7', action: 'Razorpay Key Rotated', details: 'API keys rotated for production environment', actor: 'Super Admin', category: 'system', time: 'Feb 23', severity: 'critical' },
    { id: '8', action: 'User Force-Blocked', details: 'Force blocked user USR-1205 across all admins', actor: 'Super Admin', category: 'user', time: 'Feb 23', severity: 'warning' },
  ];

  const categories = ['all', 'system', 'admin', 'financial', 'user'];
  const filtered = filter === 'all' ? logs : logs.filter(l => l.category === filter);

  const severityColors: Record<string, string> = {
    info: colors.primary,
    warning: '#F59E0B',
    critical: colors.danger,
  };

  return (
    <div>
      <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>System Audit Logs</h3>

      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button key={cat} className="rounded-xl px-3 py-2" onClick={() => setFilter(cat)}
            style={{
              background: filter === cat ? `${colors.primary}25` : colors.cardBg,
              border: `1px solid ${filter === cat ? colors.primary : colors.cardBorder}`,
              color: filter === cat ? colors.primary : colors.text,
              fontSize: '12px', fontFamily: "'Inter', sans-serif", textTransform: 'capitalize',
            }}>
            {cat}
          </button>
        ))}
      </div>

      {filtered.map((log) => (
        <GlassCard key={log.id} className="mb-3 p-4">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-2 w-2 rounded-full" style={{ background: severityColors[log.severity], boxShadow: `0 0 6px ${severityColors[log.severity]}`, flexShrink: 0 }} />
              <div>
                <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{log.action}</span>
                <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>{log.details}</span>
              </div>
            </div>
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif", flexShrink: 0 }}>{log.time}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full px-2 py-0.5" style={{ background: `${colors.primary}15`, color: colors.primary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
              {log.actor}
            </span>
            <span className="rounded-full px-2 py-0.5" style={{ background: `${severityColors[log.severity]}20`, color: severityColors[log.severity], fontSize: '10px', fontFamily: "'Inter', sans-serif", textTransform: 'capitalize' }}>
              {log.category}
            </span>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// SA-11: Twilio Configuration
// ─────────────────────────────────────────────
export function SATwilioConfig() {
  const { colors } = useTheme();

  return (
    <div>
      <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>Twilio Integration</h3>

      <GlassCard className="mb-5 p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>Connection Status</h4>
          <span className="flex items-center gap-1 rounded-full px-2 py-1" style={{ background: `${colors.success}20`, color: colors.success, fontSize: '11px' }}>
            <Activity size={12} /> Active
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl p-3" style={{ background: `${colors.primary}08` }}>
            <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif", display: 'block' }}>Account SID</span>
            <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>AC•••••••xyz</span>
          </div>
          <div className="rounded-xl p-3" style={{ background: `${colors.primary}08` }}>
            <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif", display: 'block' }}>Auth Token</span>
            <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>•••••••••</span>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="mb-5 p-5">
        <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '12px' }}>Usage Stats</h4>
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<Phone size={16} />} label="Calls Today" value="3,842" />
          <StatCard icon={<Clock size={16} />} label="Total Minutes" value="28,315" />
          <StatCard icon={<DollarSign size={16} />} label="Twilio Cost" value="$142.50" />
          <StatCard icon={<Activity size={16} />} label="Concurrent" value="127" />
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '12px' }}>Configuration</h4>
        <div className="flex flex-col gap-3">
          <PremiumInput label="Account SID" placeholder="ACxxxxxxx" />
          <PremiumInput label="Auth Token" placeholder="Token" type="password" />
          <PremiumInput label="API Key" placeholder="SKxxxxxxx" />
          <PremiumInput label="API Secret" placeholder="Secret" type="password" />
          <PremiumButton fullWidth>Update Twilio Config</PremiumButton>
        </div>
      </GlassCard>
    </div>
  );
}

// ─────────────────────────────────────────────
// SA-12: Super Admin Profile
// ─────────────────────────────────────────────
export function SAProfile() {
  const { colors } = useTheme();

  return (
    <div>
      <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>Super Admin Profile</h3>

      <GlassCard className="mb-6 flex items-center gap-4 p-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: colors.buttonGradient, boxShadow: `0 4px 24px ${colors.glowColor}` }}>
          <Crown size={28} style={{ color: colors.buttonText }} />
        </div>
        <div>
          <span style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '18px', display: 'block' }}>System Administrator</span>
          <span style={{ color: colors.primary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>Super Admin • SA-001</span>
        </div>
      </GlassCard>

      <GlassCard className="mb-5 p-5">
        <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '12px' }}>Account Details</h4>
        <div className="flex flex-col gap-4">
          <PremiumInput label="Display Name" placeholder="Name" defaultValue="System Administrator" />
          <PremiumInput label="Email" placeholder="email" defaultValue="superadmin@imitr.com" />
          <PremiumInput label="Phone" placeholder="+91" defaultValue="+91 99999 00001" />
          <PremiumButton fullWidth>Update Profile</PremiumButton>
        </div>
      </GlassCard>

      <GlassCard className="mb-5 p-5">
        <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '12px' }}>Security</h4>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: `${colors.primary}08`, border: `1px solid ${colors.cardBorder}` }}>
            <div className="flex items-center gap-3">
              <Lock size={16} style={{ color: colors.primary }} />
              <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>Two-Factor Auth</span>
            </div>
            <ToggleRight size={22} style={{ color: colors.success }} />
          </div>
          <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: `${colors.primary}08`, border: `1px solid ${colors.cardBorder}` }}>
            <div className="flex items-center gap-3">
              <Shield size={16} style={{ color: colors.primary }} />
              <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>Login Notifications</span>
            </div>
            <ToggleRight size={22} style={{ color: colors.success }} />
          </div>
          <PremiumButton fullWidth variant="outline">Change Password</PremiumButton>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '12px' }}>System Settings</h4>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between rounded-xl px-4 py-3 cursor-pointer" style={{ background: `${colors.primary}08`, border: `1px solid ${colors.cardBorder}` }}>
            <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>Pricing Configuration</span>
            <ChevronRight size={16} style={{ color: colors.textSecondary }} />
          </div>
          <div className="flex items-center justify-between rounded-xl px-4 py-3 cursor-pointer" style={{ background: `${colors.primary}08`, border: `1px solid ${colors.cardBorder}` }}>
            <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>Twilio Configuration</span>
            <ChevronRight size={16} style={{ color: colors.textSecondary }} />
          </div>
          <div className="flex items-center justify-between rounded-xl px-4 py-3 cursor-pointer" style={{ background: `${colors.primary}08`, border: `1px solid ${colors.cardBorder}` }}>
            <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>Razorpay Configuration</span>
            <ChevronRight size={16} style={{ color: colors.textSecondary }} />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

// ─────────────────────────────────────────────
// SA-13: Analytics Dashboard
// ─────────────────────────────────────────────
export function SAAnalytics() {
  const { colors } = useTheme();
  const {
    admins, celebrities, totalMintedCoins, totalSystemDiamonds,
    totalCoinsInCirculation, totalDiamondsConverted, coinPurchaseRequests,
    adminRequests, withdrawRequests,
  } = useApp();

  const totalAdmins = admins.length;
  const activeAdmins = admins.filter(a => a.status === 'active').length;
  const totalUsersUnderAdmins = admins.reduce((s, a) => s + a.users, 0);
  const totalCelebs = celebrities.length;
  const activeCelebs = celebrities.filter(c => c.status === 'active').length;
  const onlineCelebs = celebrities.filter(c => c.isOnline).length;
  const totalCelebCalls = celebrities.reduce((s, c) => s + c.totalCalls, 0);
  const totalCelebEarnings = celebrities.reduce((s, c) => s + c.totalEarnings, 0);

  const paidRequests = coinPurchaseRequests.filter(r => r.status === 'paid');
  const totalCoinsSold = paidRequests.reduce((s, r) => s + r.coinsPack, 0);
  const totalRupeeRevenue = paidRequests.reduce((s, r) => s + r.rupeeCost, 0);

  const approvedWithdraws = withdrawRequests.filter(w => w.status === 'approved');
  const totalWithdrawnDiamonds = approvedWithdraws.reduce((s, w) => s + w.diamonds, 0);
  const totalWithdrawnRupees = approvedWithdraws.reduce((s, w) => s + w.amount, 0);

  const adminReqApproved = adminRequests.filter(r => r.status === 'approved').length;
  const adminReqRejected = adminRequests.filter(r => r.status === 'rejected').length;
  const adminReqPending = adminRequests.filter(r => r.status === 'pending').length;

  const adminCoinData = admins.map(a => ({
    name: a.name.split(' ')[0],
    coins: a.coinInventory,
    diamonds: a.diamondBalance,
    users: a.users,
    distributed: a.totalCoinsDistributed,
  }));

  const categoryBreakdown = celebrities.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>
        Platform Analytics
      </h3>

      {/* Top-level metrics */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={<Coins size={18} />} label="Coins Minted" value={`${(totalMintedCoins / 1000000).toFixed(1)}M`} trend="Total supply" trendUp />
        <StatCard icon={<Coins size={18} />} label="In Circulation" value={`${(totalCoinsInCirculation / 1000000).toFixed(1)}M`} trend={`${((totalCoinsInCirculation / totalMintedCoins) * 100).toFixed(0)}% of total`} trendUp />
        <StatCard icon={<Diamond size={18} />} label="Diamonds Generated" value={`${(totalSystemDiamonds / 1000000).toFixed(1)}M`} trend="All-time" trendUp />
        <StatCard icon={<Diamond size={18} />} label="Diamonds Converted" value={`${(totalDiamondsConverted / 1000).toFixed(0)}K`} trend={`₹${((totalDiamondsConverted * DIAMOND_TO_RUPEE) / 100000).toFixed(1)}L value`} trendUp />
      </div>

      {/* Admin Economy */}
      <GlassCard className="mb-6 p-5">
        <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>Admin Economy Overview</h4>
        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl p-3 text-center" style={{ background: `${colors.primary}08` }}>
            <span style={{ color: colors.text, fontSize: '22px', fontFamily: "'Playfair Display', serif", display: 'block' }}>{activeAdmins}/{totalAdmins}</span>
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Active Admins</span>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: `${colors.primary}08` }}>
            <span style={{ color: colors.text, fontSize: '22px', fontFamily: "'Playfair Display', serif", display: 'block' }}>{totalUsersUnderAdmins.toLocaleString()}</span>
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Total Users</span>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: `${colors.primary}08` }}>
            <span style={{ color: colors.text, fontSize: '22px', fontFamily: "'Playfair Display', serif", display: 'block' }}>{totalCoinsSold.toLocaleString()}</span>
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Coins Sold to Admins</span>
          </div>
        </div>
        <div className="space-y-3">
          {adminCoinData.map((a) => (
            <div key={a.name} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <span style={{ color: colors.text, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>{a.name}</span>
                  <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                    {a.coins.toLocaleString()} coins · {a.diamonds.toLocaleString()} dia · {a.users} users
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full" style={{ background: `${colors.primary}15` }}>
                  <div className="h-full rounded-full" style={{ background: colors.buttonGradient, width: `${Math.min(100, (a.distributed / 500000) * 100)}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Celebrity Analytics */}
      <GlassCard className="mb-6 p-5">
        <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>Celebrity Performance</h4>
        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-xl p-3 text-center" style={{ background: `${colors.primary}08` }}>
            <span style={{ color: colors.text, fontSize: '20px', fontFamily: "'Playfair Display', serif", display: 'block' }}>{activeCelebs}/{totalCelebs}</span>
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Active Celebs</span>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: `${colors.success}08` }}>
            <span style={{ color: colors.success, fontSize: '20px', fontFamily: "'Playfair Display', serif", display: 'block' }}>{onlineCelebs}</span>
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Online Now</span>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: `${colors.primary}08` }}>
            <span style={{ color: colors.text, fontSize: '20px', fontFamily: "'Playfair Display', serif", display: 'block' }}>{totalCelebCalls.toLocaleString()}</span>
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Total Calls</span>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: `${colors.primary}08` }}>
            <span style={{ color: colors.text, fontSize: '20px', fontFamily: "'Playfair Display', serif", display: 'block' }}>₹{(totalCelebEarnings / 1000).toFixed(0)}K</span>
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Total Earnings</span>
          </div>
        </div>
        <div className="mb-3">
          <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif", display: 'block', marginBottom: '8px' }}>By Category</span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryBreakdown).map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: `${colors.primary}08`, border: `1px solid ${colors.cardBorder}` }}>
                <Star size={12} style={{ color: colors.primary }} />
                <span style={{ color: colors.text, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>{cat}</span>
                <span className="rounded-full px-1.5 py-0.5" style={{ background: `${colors.primary}15`, color: colors.primary, fontSize: '10px' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {celebrities.slice().sort((a, b) => b.totalEarnings - a.totalEarnings).slice(0, 5).map((c, i) => (
            <div key={c.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: `${colors.primary}06` }}>
              <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: colors.buttonGradient, color: colors.buttonText, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>{i + 1}</span>
              <div className="flex-1">
                <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif", display: 'block' }}>{c.name}</span>
                <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>{c.category} · {c.totalCalls.toLocaleString()} calls · {c.followers} followers</span>
              </div>
              <span style={{ color: colors.primary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>₹{c.totalEarnings.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Withdrawal Analytics */}
      <GlassCard className="mb-6 p-5">
        <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>Withdrawal Analytics</h4>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-xl p-3 text-center" style={{ background: `${colors.primary}08` }}>
            <span style={{ color: colors.text, fontSize: '20px', fontFamily: "'Playfair Display', serif", display: 'block' }}>{withdrawRequests.length}</span>
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Total Requests</span>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: `${colors.success}08` }}>
            <span style={{ color: colors.success, fontSize: '20px', fontFamily: "'Playfair Display', serif", display: 'block' }}>{approvedWithdraws.length}</span>
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Approved</span>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: `${colors.primary}08` }}>
            <span style={{ color: colors.text, fontSize: '20px', fontFamily: "'Playfair Display', serif", display: 'block' }}>{totalWithdrawnDiamonds.toLocaleString()}</span>
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Diamonds Paid</span>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: `${colors.primary}08` }}>
            <span style={{ color: colors.text, fontSize: '20px', fontFamily: "'Playfair Display', serif", display: 'block' }}>₹{totalWithdrawnRupees.toLocaleString()}</span>
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Rupees Settled</span>
          </div>
        </div>
      </GlassCard>

      {/* Admin Requests Pipeline */}
      <GlassCard className="mb-6 p-5">
        <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>Admin Request Pipeline</h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl p-3 text-center" style={{ background: `${colors.primary}08` }}>
            <span style={{ color: colors.primary, fontSize: '24px', fontFamily: "'Playfair Display', serif", display: 'block' }}>{adminReqPending}</span>
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Pending</span>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: `${colors.success}08` }}>
            <span style={{ color: colors.success, fontSize: '24px', fontFamily: "'Playfair Display', serif", display: 'block' }}>{adminReqApproved}</span>
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Approved</span>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: `${colors.danger}08` }}>
            <span style={{ color: colors.danger, fontSize: '24px', fontFamily: "'Playfair Display', serif", display: 'block' }}>{adminReqRejected}</span>
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Rejected</span>
          </div>
        </div>
      </GlassCard>

      {/* Coin Purchase Flow */}
      <GlassCard className="p-5">
        <h4 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>Coin Purchase Flow</h4>
        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-xl p-3 text-center" style={{ background: `${colors.primary}08` }}>
            <span style={{ color: colors.text, fontSize: '20px', fontFamily: "'Playfair Display', serif", display: 'block' }}>{coinPurchaseRequests.length}</span>
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Total Requests</span>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: `${colors.primary}08` }}>
            <span style={{ color: colors.primary, fontSize: '20px', fontFamily: "'Playfair Display', serif", display: 'block' }}>{coinPurchaseRequests.filter(r => r.status === 'pending').length}</span>
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Pending</span>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: `${colors.danger}08` }}>
            <span style={{ color: colors.danger, fontSize: '20px', fontFamily: "'Playfair Display', serif", display: 'block' }}>{coinPurchaseRequests.filter(r => r.status === 'approved').length}</span>
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Unpaid</span>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: `${colors.success}08` }}>
            <span style={{ color: colors.success, fontSize: '20px', fontFamily: "'Playfair Display', serif", display: 'block' }}>{paidRequests.length}</span>
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Paid</span>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl p-3" style={{ background: `${colors.primary}06` }}>
          <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>Total Rupee Revenue from Coin Sales</span>
          <div className="flex items-center gap-1.5">
            <Wallet size={14} style={{ color: colors.primary }} />
            <span style={{ color: colors.text, fontSize: '16px', fontFamily: "'Playfair Display', serif" }}>₹{totalRupeeRevenue.toLocaleString()}</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}