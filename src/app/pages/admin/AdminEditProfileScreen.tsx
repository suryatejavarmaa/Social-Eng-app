import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ChevronLeft, Camera, X, Check, Save, User, Mail, Phone, Building2,
  Shield, Sparkles, BadgeCheck, CreditCard, Landmark, QrCode, UserCheck,
} from 'lucide-react';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { PremiumInput } from '../../components/imitr/PremiumInput';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

export function AdminEditProfileScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { admins, adminPaymentSettings, adminUpdatePaymentSettings } = useApp();

  const admin = admins.find(a => a.status === 'active') || admins[0];

  // Personal Details
  const [displayName, setDisplayName] = useState(admin?.name || 'Admin');
  const [email, setEmail] = useState(admin?.email || '');
  const [phone] = useState(admin?.phone || '');
  const [organization, setOrganization] = useState(admin?.organization || '');
  const [avatar, setAvatar] = useState('');

  // Payment Settings
  const [bankAccount, setBankAccount] = useState(adminPaymentSettings.bankAccount || '');
  const [upiId, setUpiId] = useState(adminPaymentSettings.upiId || '');
  const [ifscCode, setIfscCode] = useState(adminPaymentSettings.ifscCode || '');
  const [accountHolder, setAccountHolder] = useState(adminPaymentSettings.accountHolderName || '');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleSave = useCallback(() => {
    if (!displayName.trim()) return;
    setSaving(true);
    setTimeout(() => {
      // Save payment settings
      adminUpdatePaymentSettings({
        bankAccount: bankAccount.trim(),
        upiId: upiId.trim(),
        ifscCode: ifscCode.trim(),
        accountHolderName: accountHolder.trim(),
      });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  }, [displayName, bankAccount, upiId, ifscCode, accountHolder, adminUpdatePaymentSettings]);

  const initials = displayName.trim()
    ? displayName.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  return (
    <div className="imitr-page-enter" style={{ maxHeight: '80vh', overflowY: 'auto', paddingBottom: '24px' }}>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/profile')}
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            backdropFilter: 'blur(12px)',
          }}
        >
          <ChevronLeft size={18} style={{ color: colors.primary }} />
        </button>
        <div className="flex-1">
          <h1 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '20px' }}>
            Edit Admin Profile
          </h1>
          <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
            Update your profile & payment details
          </p>
        </div>
        <span
          className="rounded-full px-2.5 py-1"
          style={{
            background: `${colors.primary}20`,
            color: colors.primary,
            fontSize: '9px',
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '0.5px',
          }}
        >
          ADMIN
        </span>
      </div>

      {/* Avatar Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <GlassCard className="flex flex-col items-center p-6">
          <div
            className="relative mb-3 cursor-pointer overflow-hidden rounded-full"
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '90px',
              height: '90px',
              background: avatar ? 'transparent' : colors.buttonGradient,
              boxShadow: `0 4px 20px ${colors.glowColor}`,
              border: `3px solid ${colors.primary}40`,
            }}
          >
            {avatar ? (
              <>
                <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100"
                  style={{ background: 'rgba(0,0,0,0.5)' }}
                >
                  <Camera size={22} style={{ color: '#fff' }} />
                </div>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span style={{ color: colors.buttonText, fontFamily: "'Playfair Display', serif", fontSize: '28px' }}>
                  {initials}
                </span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <div className="mb-1 flex items-center gap-1.5">
            <span style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '16px' }}>
              {displayName}
            </span>
            <BadgeCheck size={14} style={{ color: colors.primary }} />
          </div>
          <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
            Creator Admin · {admin?.id || 'ADM-001'}
          </span>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2"
              style={{
                background: `${colors.primary}15`,
                border: `1px solid ${colors.primary}30`,
                color: colors.primary,
                fontFamily: "'Inter', sans-serif",
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              <Camera size={12} /> {avatar ? 'Change Photo' : 'Upload Photo'}
            </button>
            {avatar && (
              <button
                onClick={() => setAvatar('')}
                className="flex items-center gap-1 rounded-xl px-3 py-2"
                style={{
                  background: `${colors.danger}10`,
                  border: `1px solid ${colors.danger}20`,
                  color: colors.danger,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                <X size={12} /> Remove
              </button>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Personal Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <GlassCard className="mb-5 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles size={14} style={{ color: colors.primary }} />
            <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px', letterSpacing: '0.5px' }}>
              Personal Details
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <PremiumInput
              label="Display Name *"
              placeholder="Admin name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              icon={<User size={16} />}
            />

            <PremiumInput
              label="Email"
              placeholder="admin@imitr.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={16} />}
            />

            <PremiumInput
              label="Phone Number"
              placeholder="+91"
              value={phone}
              onChange={() => {}}
              disabled
              icon={<Phone size={16} />}
            />

            <PremiumInput
              label="Organization"
              placeholder="Your company/agency name"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              icon={<Building2 size={16} />}
            />
          </div>
        </GlassCard>
      </motion.div>

      {/* Payment / Bank Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <GlassCard className="mb-5 p-5">
          <div className="mb-4 flex items-center gap-2">
            <CreditCard size={14} style={{ color: colors.primary }} />
            <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px', letterSpacing: '0.5px' }}>
              Payment & Bank Details
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <PremiumInput
              label="Bank Account Number"
              placeholder="Enter bank account number"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              icon={<Landmark size={16} />}
            />

            <PremiumInput
              label="IFSC Code"
              placeholder="e.g. SBIN0001234"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
              icon={<Shield size={16} />}
            />

            <PremiumInput
              label="Account Holder Name"
              placeholder="Name as on bank account"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              icon={<UserCheck size={16} />}
            />

            <PremiumInput
              label="UPI ID"
              placeholder="yourname@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              icon={<QrCode size={16} />}
            />
          </div>
        </GlassCard>
      </motion.div>

      {/* Stats Card (read-only) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <GlassCard className="mb-6 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Shield size={14} style={{ color: colors.primary }} />
            <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px', letterSpacing: '0.5px' }}>
              Account Stats
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Users Managed', value: admin?.users?.toString() || '0' },
              { label: 'Coins Distributed', value: admin?.totalCoinsDistributed?.toLocaleString() || '0' },
              { label: 'Coin Inventory', value: admin?.coinInventory?.toLocaleString() || '0' },
              { label: 'Diamond Balance', value: admin?.diamondBalance?.toLocaleString() || '0' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-3 text-center"
                style={{
                  background: `${colors.primary}08`,
                  border: `1px solid ${colors.cardBorder}`,
                }}
              >
                <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '16px', display: 'block' }}>
                  {stat.value}
                </span>
                <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        <PremiumButton fullWidth onClick={handleSave} disabled={saving || !displayName.trim()}>
          <div className="flex items-center justify-center gap-2">
            {saving ? (
              <span className="h-4 w-4 animate-spin rounded-full" style={{ border: `2px solid ${colors.buttonText}`, borderTopColor: 'transparent' }} />
            ) : saved ? (
              <Check size={18} />
            ) : (
              <Save size={18} />
            )}
            {saving ? 'Saving...' : saved ? 'Profile Updated!' : 'Save All Changes'}
          </div>
        </PremiumButton>
      </motion.div>
    </div>
  );
}
